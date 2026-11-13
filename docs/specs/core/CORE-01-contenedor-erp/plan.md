# Plan técnico — Contenedor ERP compartido (CORE-01)

**ID:** CORE-01  
**Versión del plan:** 1.3 (**11 de noviembre de 2026**; adopción de **pnpm** como gestor de dependencias, decisión de tooling que no altera requisitos ni criterios). La v1.2 (aprobada técnicamente el 10-nov-2026; cambio de stack a Next.js) y la v1.1 (React + TypeScript con Vite) quedan como registro histórico.  
**Cubre:** CORE-01 v0.6 «Contenedor ERP compartido» (aprobada funcionalmente el 10-nov-2026; **su aprobación funcional no cambia**). Se integra con RH-REQ-01 v0.7 «Requerimientos de personal» a través de su plan ([`../../rrhh/RH-REQ-01-requerimientos/plan.md`](../../rrhh/RH-REQ-01-requerimientos/plan.md)).  
**Estado:** **Aprobado técnicamente el 10 de noviembre de 2026** (v1.2, cambio de stack a Next.js). La **v1.3** registra la decisión de tooling del 11-nov-2026 (pnpm) **sin reabrir** requisitos, criterios de aceptación, contratos, alcance ni tareas existentes; la v1.1 aprobada el 10-nov-2026 (React + TypeScript + Vite) queda como registro histórico. No fija URLs, endpoints ni payloads; lo que dependa de proveedor real queda señalado como decisión técnica abierta a resolver antes de cerrar las tareas dependientes. Las decisiones C-01 a C-04 quedan resueltas a nivel de contrato (10-nov-2026); P-04 sigue abierta.  
**Fecha:** 11 de noviembre de 2026.

## Decisiones técnicas adoptadas (10-11 de noviembre de 2026)

- **Stack (revisado el 10-nov-2026; sustituye a la decisión de la v1.1):** Next.js 16 (App Router) + React 19 + TypeScript, con Node 24 LTS fijado como runtime; entrega con `next start` (servidor Node), sin `output: 'export'` en este MVP.
  - **Renderizado:** **sin SSR de datos ni de sesión**. `src/app/layout.tsx` es Server Component (exporta `metadata`, fija `lang`) y `page.tsx`/el shell del contenedor son Client Components (`'use client'`); Next sigue prerenderizando el HTML inicial, pero no se resuelve contexto ni capacidades en el servidor porque la sesión (C-01) es un puerto opaco: el frontend no ve credenciales ni token.
  - **Entrega:** `output: 'export'` queda explícitamente **revisable** para cuando exista backend real. La reversibilidad es asimétrica (Node → estático es trivial; estático → Node rompe enrutado avanzado y route handlers). Un BFF/proxy que evite CORS y no exponga la URL interna del backend es una **posibilidad futura**, no una decisión adoptada.
  - **Autorización:** no se implementa en `proxy.ts` (antes `middleware.ts`); la revalida el backend (constitución §Seguridad). Si se usa, es solo para redirecciones de UX.
  - **Rutas y resultados (C-04):**
    - `ok` → vista autorizada.
    - `not-found` → `app/not-found.tsx`, sin datos.
    - `forbidden` → estado/componente propio de «sin permisos», **distinto** de la 404, sin datos ni vista ficticia.
    - `session-ended` → estado sin acceso, con limpieza inmediata del estado de sesión.
    - Los destinos directos se resuelven por `NavigationPort` antes de renderizar contenido; ningún resultado se convierte en «Próximamente».
  - **Persistencia:** `sessionStorage` (C-04) solo se lee en efectos/cliente, nunca durante el render, para evitar hydration mismatch; `SessionScopedStore<T>` se mantiene sin cambios de contrato.
  - **Tests:** un único runner, **Vitest**, con React Testing Library y jsdom para componentes; se descarta Jest. El runner conserva su propio pipeline (hoy apoyado en Vite) y su configuración es independiente de la de la aplicación; la aplicación no usa Vite.
  - **Estructura:** `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/not-found.tsx` y `src/app/globals.css`; se conservan `src/container/`, `src/shared/` y `src/modules/rrhh/`.
- **Gestor de dependencias (11-nov-2026; v1.3):** se adopta **pnpm** como gestor único del repositorio; el equipo ha tenido problemas con npm y esta decisión es de tooling, no de requisitos. No cambia código de aplicación, contratos, criterios ni tareas existentes.
  - **Lockfile:** `pnpm-lock.yaml` versionado y `package-lock.json` retirado del control de versiones.
  - **Fijado de versión:** `packageManager` en `package.json` con `pnpm@12.14.0`, versión confirmada con `pnpm --version` al ejecutar T-CORE-12. Node 24 LTS se mantiene (`.nvmrc`, `engines.node`).
  - **Ignorados:** `node_modules/` sigue ignorado; se añade `.pnpm-store/` a `.gitignore` de forma defensiva (el store real está fuera del repositorio).
  - **`next-env.d.ts`:** archivo generado por Next; la **política A quedó fijada con evidencia** en T-CORE-12: ignorado y fuera del índice, sin edición manual, y el build lo regenera con contenido idéntico (véase §6.1).
  - **Comandos oficiales de evidencia:** `pnpm install --frozen-lockfile`, `pnpm test`, `pnpm build` y `pnpm exec tsc --noEmit`, bajo Node 24 LTS.
  - **Historia:** las evidencias registradas con `npm` se conservan como registro histórico; las instrucciones vigentes y nuevas usan pnpm.
- **Operaciones:** se construye contra mocks/adaptadores de contrato, distinguibles de operaciones reales, sin autorización ni persistencia falsas.
- **Diferido:** C-05 (CORE-01 §7 criterio 9) y RH-REQ-01 §10 criterio 18 quedan diferidos en este corte (verificación visual directa con el PDF).
- **C-01 (sesión):** puerto de sesión opaco — el frontend solicita contexto/capacidades y escucha el fin de sesión, sin ver credenciales ni token; el transporte lo resuelve el adaptador; estados `loading`/`authenticated`/`expired`/`terminated`/`error`.
- **C-01 (fin de sesión y recuperación):** expiración/terminación por suscripción `onEnded`; recuperación mediante `recoverAccess()` delegada en el proveedor, sin URL tipada ni login local.
- **C-03 (catálogo):** jerárquico módulo → sección con `status: 'implemented' | 'not-implemented'`, `visible: boolean` y `capabilities: Capability[]` (vacío = visible pero no operable); `Capability` es cadena opaca con prefijo, nunca nombre de rol.
- **C-04 (persistencia intra-sesión y destinos):** `sessionStorage` solo con datos no sensibles, encapsulado en `SessionScopedStore<T>` y borrado al terminar la sesión; destinos desconocidos devuelven `ok | forbidden | not-found | session-ended`, distintos de «Próximamente».
- **C-02 (salida):** `signOut()` tipado con resultado de éxito (destino `provider | local`) o error `retryable`; acción y destino concretos los resuelve el adaptador, sin fijar URL ni endpoint.

---

## 1. Alcance y exclusiones

**Alcance.** Contenedor ERP de escritorio (CORE-01 §2, §4): cabecera con identidad/contexto recibidos, navegación horizontal y selector de módulos, entrada a RR. HH. solo con lectura UX-02, navegación secundaria de Requerimientos y tratamiento informativo de secciones no implementadas («Próximamente» con visibilidad explícita del backend). El dominio de Requerimientos (RH-REQ-01 §2) se cubre en su propio plan.

**Exclusiones de este corte.**

- **C-05 (diferido):** comparación visual directa con el PDF (CORE-01 §7 criterio 9) queda diferida y no es exigible en este corte. Se mantiene la regla de no adoptar datos ilustrativos del PDF como reglas y no reproducir composiciones no legibles desde el visor.
- **P-04 (externo):** la matriz técnica final de roles, ámbitos y permisos es dependencia externa; este corte usa el contrato provisional autorizado (RH-REQ-01 §3, CORE-01 §3).
- **Módulos/vistas no incluidos:** login local y selección de perfil, dashboard UX-01, candidatos UX-05/06, Alta UX-07 operativa, ficha/legajo UX-08 y el resto de vistas RR. HH.; panel contextual derecho, búsqueda global, notificaciones globales; interfaz móvil/responsive. Los módulos de dominio (Selección, Alta) solo aparecen como proveedores de resultados de integración, no como vistas operativas de este corte.

---

## 2. Contratos por acordar o resolver en este plan

Cada contrato define responsabilidades por parte (frontend, backend ERP, proveedor externo), entrada y salida esperadas, y criterio de verificación. No se fijan APIs concretas, URLs ni payloads; lo que depende del transporte o del proveedor real lo resuelve el adaptador, con las decisiones registradas en §5 (C-01 a C-04 resueltas el 10-nov-2026; P-04 abierta).

### 2.1 C-01 — Sesión, identidad, contexto y capacidades efectivas; expiración, terminación, actualización y fallos

**Responsabilidades.**

- **Frontend (contenedor):** solicita contexto/capacidades solo tras disponer de una sesión ya autenticada; representa los estados de carga, error, sin permisos y sesión vencida/terminada; **no** implementa login local ni captura credenciales; ante expiración/terminación limpia de inmediato identidad, contexto, capacidades, filtros y contexto de bandeja y toda persistencia de sesión; no persiste datos sensibles en `localStorage`; comunica que la recuperación del acceso se hace por el proveedor externo, sin afirmar una redirección o cierre no acordados.
- **Backend ERP (autorización):** entrega el contexto y las capacidades efectivas del usuario; revalida acceso y comandos; comunica la expiración o terminación de la sesión; aplica el ámbito del contrato provisional P-04.
- **Proveedor externo de identidad:** mantiene la sesión real; comunica vencimiento/terminación al ERP; ofrece el mecanismo de recuperación de acceso (re-login) sin que el ERP muestre login local.

**Entrada esperada:** una sesión externa válida (o la notificación de expiración/terminación).  
**Salida esperada:** contexto + capacidades efectivas (o un estado explícito de error/expiración); y, al vencer o terminar, la limpieza inmediata y aislada del estado local.  
**Criterio de verificación:** CORE-01 §7 criterios 5 y 6 (y 7 para la salida). Sin herencia de estado entre autenticaciones; sin datos sensibles en `localStorage`; indicación de recuperación por proveedor.  
**Resuelto (10-nov-2026):** puerto de sesión opaco (D1), fin de sesión por suscripción `onEnded` y recuperación vía `recoverAccess()` sin URL tipada (D2); el transporte concreto lo resuelve el adaptador.

### 2.2 C-03 — Catálogo de secciones, estado implementado y visibilidad/capacidades efectivas

**Responsabilidades.**

- **Backend ERP:** expone un catálogo de secciones RR. HH. con su estado (implementada / no implementada) y la visibilidad/capacidades efectivas por usuario; es la única fuente que decide qué es visible y qué es operable.
- **Frontend (contenedor):** renderiza la navegación secundaria y el «Próximamente» **solo** según ese catálogo; sin lectura UX-02 deniega el módulo; visibilidad no concede operaciones ni acceso a vistas inexistentes.
- **Proveedor externo:** no aplica (la autorización es del backend ERP).

**Entrada esperada:** contexto/capacidades del usuario (C-01).  
**Salida esperada:** lista de secciones con estado implementado y visibilidad/capacidades efectivas; el frontend la refleja sin inferir permisos del nombre de rol ni de etiquetas del PDF.  
**Criterio de verificación:** CORE-01 §7 criterios 1, 2, 3 y 5.  
**Resuelto (10-nov-2026):** catálogo jerárquico módulo → sección con `status: 'implemented' | 'not-implemented'`, `visible: boolean` y `capabilities: Capability[]` (vacío = visible pero no operable); `Capability` es cadena opaca con prefijo, nunca nombre de rol.

### 2.3 C-04 — Semántica de rutas lógicas, destinos directos/desconocidos, retorno y aislamiento de persistencia intra-sesión

**Responsabilidades.**

- **Frontend (contenedor + Requerimientos):** resuelve las rutas lógicas (entrada → bandeja; bandeja → nuevo/editar/detalle → retorno; sección no implementada visible → «Próximamente» → retorno autorizado); ante un **destino directo** valida sesión y autorización antes de exponer contenido; un **destino desconocido** no se convierte en «Próximamente» ni en vista ficticia; ante **pérdida de sesión** en navegación limpia y devuelve a un estado sin acceso; aísla la persistencia intra-sesión (filtros y contexto de bandeja) para que solo viva durante la sesión autenticada y se borre al finalizar.
- **Backend ERP:** valida acceso a destinos directos y deniega destinos no autorizados o inexistentes sin filtrar datos.
- **Proveedor externo:** no aplica.

**Entrada esperada:** una ruta lógica o un destino directo, con sesión y capacidades.  
**Salida esperada:** la vista autorizada o un estado de sin permisos/error; el contexto de bandeja (filtros, orden, página) preservado solo dentro de la sesión y limpiado al finalizar.  
**Criterio de verificación:** CORE-01 §7 criterios 1–4, 6 y 8; RH-REQ-01 §10 criterios 14, 22 y 23 (retorno de contexto de bandeja y persistencia de filtros).  
**Resuelto (10-nov-2026):** persistencia intra-sesión en `sessionStorage` solo con datos no sensibles, encapsulada en `SessionScopedStore<T>` y borrada al terminar la sesión; destinos desconocidos como resultado discriminado `ok | forbidden | not-found | session-ended`, sin datos y sin vista ficticia.

### 2.4 C-02 — Salida voluntaria («Salir»)

**Responsabilidades.**

- **Frontend (contenedor):** ofrece la acción «Salir»; inicia el cierre de la sesión real en el proveedor; al terminar, limpia de inmediato estado y contexto local conforme a §2.1; muestra el destino de confirmación acordado; ante un error del proveedor conserva el estado y explica cómo continuar.
- **Proveedor externo de identidad:** ejecuta el cierre de la sesión real y comunica el resultado (éxito/error).
- **Backend ERP:** invalida el contexto local asociado al finalizar; no es la autoridad del cierre en el proveedor.

**Entrada esperada:** activación de «Salir».  
**Salida esperada:** sesión real cerrada en el proveedor y limpieza local inmediata (o, en caso de error del proveedor, estado conservado con mensaje y opción de reintento si procede).  
**Criterio de verificación:** CORE-01 §7 criterios 6 y 7.  
**Resuelto (10-nov-2026):** `signOut()` devuelve éxito con destino `provider | local` o error `retryable`; la acción de cierre y el destino los resuelve el adaptador, sin fijar URL ni endpoint.

---

## 3. Traza de P-04 (autorización provisional y matriz final)

- **Contrato provisional autorizado** (CORE-01 §3, RH-REQ-01 §3): el backend limita el ámbito efectivo (módulos y secciones visibles/operables) y es la única fuente de lo que es visible y operable; el frontend (contenedor) presenta navegación, selector y «Próximamente» a partir de esas capacidades y contempla lectura/sin permisos; el backend revalida autorización, ámbito, estado y versión en cada comando. Ocultar una acción no constituye autorización.
- **Dependencia externa:** la matriz técnica final de roles/ámbitos/permisos sigue fuera de este repositorio y no bloquea el plan. Los adaptadores/mocks de este corte deben parametrizarse por capacidades y no codificar permisos por nombre de rol ni por etiquetas del PDF, para poder migrar a la matriz final sin reescribir reglas.
- **Verificación de la traza:** CORE-01 §7 criterios 2 y 3 (sin permisos y visibilidad sin operación); los criterios 15 y 16 de RH-REQ-01 §10 (ámbito por registro y revalidación de comandos) se cubren en el plan de RH-REQ-01.

---

## 4. Verificación

Se verifican **todos** los criterios de aceptación de CORE-01 §7, salvo el diferido explícito (C-05). La verificación es funcional (fixtures de sesión/capacidades) y de accesibilidad (teclado, foco, nombres, mensajes por texto). El criterio de accesibilidad transversal aplica a CORE-01 §5/§7-8; la verificación de reglas, integración y concurrencia del dominio de Requerimientos se cubre en el plan de RH-REQ-01.

### 4.1 CORE-01 §7

| Criterio | Verificación |
|---|---|
| 1 | Fixture con sesión válida + lectura UX-02: selector muestra solo RR. HH., entrada abre UX-02 (bandeja), no dashboard. |
| 2 | Fixture con sesión válida sin UX-02: sin RR. HH. en selector, sin «Próximamente» sustituto, entrada directa → sin permisos sin datos. |
| 3 | Fixture con lectura UX-02 + una sección no implementada visible explícitamente: «Próximamente» sin datos/acciones y regreso a UX-02; visibilidad sola no opera ni accede a vistas inexistentes. |
| 4 | Integración: UX-02/03/04 intactas en la zona central; retorno de bandeja, filtros y acciones de RH-REQ-01 sin alterar; alerta real de plazo visible (RH-REQ-01 §5/§7). |
| 5 | Fixture de carga/fallo de contexto/capacidades: no se muestran identidad/navegación/datos previos como vigentes; error con explicación y reintento si procede. |
| 6 | Fixture de vencimiento o terminación externa: limpieza inmediata de identidad, contexto, capacidades, filtros y contexto de bandeja y de toda persistencia; nueva autenticación no hereda; sin datos sensibles en `localStorage`; indicación de recuperación por proveedor. |
| 7 | Fixture de «Salir»: inicia cierre de sesión real en el proveedor y, al terminar, limpia conforme al criterio 6 (acción/destino/errores dependen de C-02). |
| 8 | Accesibilidad: operación por teclado, foco visible y gestionado en cambios, nombres accesibles, activo identificable, errores por texto (no solo color). |
| 9 | **Diferido (C-05):** comparación visual directa con el PDF no exigible en este corte; se verifica solo que no se adoptan datos ilustrativos ni composiciones no legibles del visor. |

### 4.2 Diferido (C-05) y RH-REQ-01 §10 criterio 18

- **C-05** queda diferido: la comparación visual directa con el PDF no es exigible en este corte (CORE-01 §7 criterio 9), sin adoptar composición no legible desde el visor.
- **RH-REQ-01 §10 criterio 18 (DIFERIDO junto a C-05):** la comparación visual de las páginas 6–9 se difiere en este corte (mismo límite de lectura del PDF); se mantiene la regla de no adoptar datos ilustrativos ni composiciones no legibles del visor. Véase el plan de RH-REQ-01.

---

## 5. Riesgos y decisiones abiertas para el usuario

**Aprobadas el 10-nov-2026 (v1.2).**

- **Stack y tooling (10-nov-2026)** — Next.js 16 (App Router) + React 19 + TypeScript sobre Node 24 LTS; entrega con `next start` y `output: 'export'` revisable cuando exista backend real; sin SSR de datos ni de sesión; sin autorización en `proxy.ts` (antes `middleware.ts`); un único runner de tests (Vitest + React Testing Library + jsdom). El gestor de estado concreto queda a criterio de la implementación y no se deduce del ZIP ni de la maqueta; la persistencia intra-sesión queda resuelta en C-04 (10-nov-2026). El detalle está en las «Decisiones técnicas adoptadas» y en §6.

**Decisión de tooling adoptada el 11-nov-2026 (v1.3).**

- **Gestor de dependencias:** **pnpm** sustituye a npm (`pnpm-lock.yaml` versionado, `package-lock.json` retirado, `packageManager` fijado, `.pnpm-store/` ignorado y política de `next-env.d.ts` aplicada con evidencia en T-CORE-12). No altera stack, requisitos, criterios, contratos ni el alcance de las tareas vigentes. Detalle y rationale en §6.1. La migración **está ejecutada** en T-CORE-12 (`c947acb`, 11-nov-2026, veredicto APROBADO y merge `--ff-only`).

**Resueltas (10 de noviembre de 2026):**

1. **Existencia de backend/proveedores reales** — RESUELTA: este corte se construye contra **adaptadores/mocks que respeten los contratos** (distinguibles de operaciones reales, sin autorización ni persistencia falsas), no contra servicios reales.
2. **C-01 (sesión):** puerto de sesión opaco con estados `loading`/`authenticated`/`expired`/`terminated`/`error`; el frontend solicita contexto/capacidades sin ver credenciales ni token y el transporte lo resuelve el adaptador (10-nov-2026).
3. **C-02 (salida):** `signOut()` devuelve éxito con destino `provider | local` o error `retryable`; la acción de cierre y el destino los resuelve el adaptador, sin fijar URL ni endpoint (10-nov-2026).
4. **C-03 (catálogo):** catálogo jerárquico módulo → sección con `status: 'implemented' | 'not-implemented'`, `visible: boolean` y `capabilities: Capability[]` (vacío = visible pero no operable); `Capability` es cadena opaca con prefijo, nunca nombre de rol (10-nov-2026).
5. **C-04 (persistencia intra-sesión y destinos):** `sessionStorage` solo con datos no sensibles, encapsulado en `SessionScopedStore<T>` y borrado al terminar la sesión; destinos desconocidos devuelven `ok | forbidden | not-found | session-ended`, distintos de «Próximamente» (10-nov-2026).
6. **C-01 (fin de sesión y recuperación):** expiración/terminación por suscripción `onEnded` y recuperación vía `recoverAccess()` delegada en el proveedor, sin URL tipada ni login local (10-nov-2026).

**Decisiones técnicas abiertas (a resolver antes de cerrar las tareas dependientes; `tasks.md` ya existe pero no las concreta):**

7. **P-04:** plazo de disponibilidad de la matriz final de permisos y criterio de migración desde el contrato provisional; se resolverán antes de cerrar T-CORE-10.

**Diferido (fuera de este corte):**

8. **C-05** — DIFERIDO: la comparación visual directa con el PDF queda fuera de este corte (CORE-01 §7 criterio 9); el criterio 18 de RH-REQ-01 se difiere junto con C-05 (véase el plan de RH-REQ-01).

**Riesgos principales.**

- **Dependencia de proveedores sin contrato real** (identidad): riesgo de bloqueo; mitigación con adaptadores de contrato definido, sin autorización/persistencia falsa.
- **C-05 diferido:** riesgo de divergencia visual acumulada; mitigación con verificación diferida planificada y regla de no adoptar datos ilustrativos.
- **Matriz de permisos externa (P-04):** riesgo de retrabajo en autorización; mitigación parametrizando por capacidades, sin codificar por nombre de rol.
- **`tsconfig` de Vite incompatible con Next y sus tipos generados (`.next/types`):** mitigación: reconfigurar `tsconfig.json` en T-CORE-11 y verificarlo con `npm run build`.
- **Desaparición de `dist/` y entrega con `.next/` + `next start` sobre Node 24:** mitigación: `.nvmrc`, `engines.node` y evidencia registrada bajo LTS.
- **Cambio de entorno de pruebas (`node` → `jsdom` solo para componentes) y acoplamiento Vitest–Vite:** mitigación: configuración de test independiente de la configuración de la aplicación.
- **Frontera Server/Client e hidratación (`sessionStorage` leído en render):** mitigación: `layout.tsx` servidor y shell cliente; lectura del almacenamiento solo en efectos.
- **Foco y accesibilidad en cambios de ruta del App Router:** mitigación: se verifica en T-CORE-08.
- **Node 25.9.0 local frente a Node 24 LTS exigido:** mitigación: `.nvmrc`, `engines.node` y evidencia registrada bajo LTS.
- **Migración de gestor de dependencias (npm → pnpm) a mitad de implementación:** riesgo de lockfile divergente, árbol sucio o `next-env.d.ts` regenerado por `pnpm dev`; mitigación: T-CORE-12 aislada, `pnpm install --frozen-lockfile`, `.pnpm-store/` ignorado y política de `next-env.d.ts` decidida con evidencia (§6.1).

---

## 6. Revisión de stack (10-nov-2026)

- **Motivo:** el equipo exige Next.js. Las specs funcionales **no requieren cambios**: ambas excluyen el stack de su alcance (CORE-01 `spec.md` línea 25 (§2): «Tampoco define … stack»; RH-REQ-01 `spec.md` línea 191 (§9): «Sin fijar rutas HTTP, nombres técnicos ni stack»). Los criterios de aceptación quedan intactos y la v1.2 quedó **aprobada técnicamente el 10-nov-2026**. Next aquí aporta enrutado, convenciones y pipeline, **sin SSR de datos ni de sesión**: es un ERP administrativo interno, sin SEO ni primera pintura crítica.
- **Qué NO cambia:** requisitos y criterios de aceptación; contratos y puertos de T-CORE-02 (`SessionPort`, `CatalogPort`, `Capability`, `SignOutPort`, `SessionScopedStore<T>`, destinos `ok | forbidden | not-found | session-ended`); adaptadores/mocks de contrato; separación `container/` + `shared/` + `modules/<módulo>`.
- **Vite y Vitest:** la **aplicación** deja de usar Vite (sin `vite.config.ts`, sin `index.html`, sin scripts de Vite y sin las dependencias `vite`/`@vitejs/plugin-react`); el **runner** sigue siendo Vitest, con configuración propia sin `mergeConfig` sobre la config de la app, y su Vite llega como dependencia transitiva del runner. La comprobación se acota a la aplicación, no al runner.
- **Coste:** es el momento más barato. Solo existen andamiaje (T-CORE-01), contratos (T-CORE-02) y fixtures de contrato (T-CORE-03); no hay vistas ni lógica de dominio que migrar.
- **Consecuencia operativa:** se añade **T-CORE-11** (sustituir el andamiaje Vite por Next.js) y T-CORE-01 queda sustituida por ella, conservando su commit como traza histórica. T-CORE-02 y T-CORE-03 ya están cerradas en `main` y no se reabren; T-CORE-11 incluye re-verificar los contratos y fixtures con el runner definitivo (Vitest + React Testing Library + jsdom). Con la v1.2 **aprobada el 10-nov-2026**, T-CORE-11 quedó cerrada ese mismo día con veredicto APROBADO y las tareas de vistas (T-CORE-04…10) se inician tras ese cierre, empezando por T-CORE-04.

### 6.1 Revisión de tooling (11-nov-2026)

- **Motivo:** el equipo ha tenido problemas con npm. La decisión del usuario/senior del 11-nov-2026 es usar **pnpm** como gestor único. Es una decisión de tooling, no de requisitos: **las specs no se modifican** (CORE-01 `spec.md` excluye el stack de su alcance y su aprobación funcional sigue vigente) y no se tocan criterios de aceptación, contratos ni el alcance de las tareas existentes.
- **Qué cambia:** `pnpm-lock.yaml` pasa a ser el lockfile versionado; `package-lock.json` se retira; `package.json` declara `packageManager` (pnpm); `.gitignore` añade `.pnpm-store/` de forma defensiva; las instrucciones de instalación y evidencia pasan a pnpm.
- **Qué NO cambia:** stack (Next.js 16 App Router + React 19 + TypeScript), runtime **Node 24 LTS**, entrega con `next start`, runner Vitest + React Testing Library + jsdom, contratos y puertos de T-CORE-02, fixtures de T-CORE-03 y la separación `container/` + `shared/` + `modules/<módulo>`. Tampoco cambia la evidencia histórica: lo registrado con `npm` se conserva tal cual como registro.
- **Estado previo a T-CORE-12 (11-nov-2026; superado por su ejecución):** `pnpm 12.14.0` está instalado; existe un `pnpm-lock.yaml` **parked fuera del repositorio**; `package-lock.json` sigue versionado; `package.json` **no** declara `packageManager`; `node_modules/` ya está en layout de pnpm y el store real está **fuera** del repositorio.
- **Política de `next-env.d.ts` (resuelta con evidencia en T-CORE-12: política A):** el archivo lo genera Next y `pnpm dev` lo reescribe (ruta `.next/dev/types`). La decisión de T-CORE-12 siguió este orden: (1) si `pnpm build`, `pnpm test` y `pnpm exec tsc --noEmit` pasan **sin** el archivo versionado, se ignora y se retira del índice; (2) si alguna de esas verificaciones depende de él, se mantiene versionado y se documenta que se restaura tras `pnpm dev`. La evidencia cumplió (1): el archivo está ignorado y fuera del índice, y el build lo regenera con contenido idéntico sin ensuciar el árbol.
- **Evidencia exigida:** `pnpm install --frozen-lockfile`, `pnpm test` (7 archivos / 43 pruebas), `pnpm build` y `pnpm exec tsc --noEmit`, bajo **Node 24 LTS**, con árbol limpio (`git status --porcelain` vacío) después de build y tests.
- **Consecuencia operativa de T-CORE-12 (ejecutada el 11-nov-2026, `c947acb`):** la migración a pnpm **está hecha** y mergeada en `main` con `--ff-only` tras veredicto APROBADO del reviewer; `next-env.d.ts` se rige por la **política A demostrada** (retirado del índice e ignorado: sin el archivo, `pnpm exec tsc --noEmit`, `pnpm test` y `pnpm build` pasan bajo Node 24.21.0 LTS y el build lo regenera con contenido idéntico, dejando el árbol limpio). Consecuencia nueva (resuelta en T-CORE-13): `pnpm dev` con Next 16.4.6 escribía un bloque en `AGENTS.md` (archivo versionado) y dejaba el árbol sucio —no era una regresión de pnpm—; **T-CORE-13 la cerró el 11-nov-2026** (`cc97826`, veredicto APROBADO, merge `--ff-only`) fijando `agentRules: false` en `next.config.ts`, opción raíz de Next 16.4.6, sin tocar requisitos ni el contenido acordado de `AGENTS.md`. `false` no solo evita generar el bloque: desde Next v16.4.0 **también elimina** un bloque gestionado existente (`<!-- BEGIN:nextjs-agent-rules --> … <!-- END:nextjs-agent-rules -->`), de modo que no debe reintroducirse esperando que Next lo conserve.
- **Consecuencia documental de la v1.3 (11-nov-2026):** se añade **T-CORE-12** (adoptar pnpm) en la Fase A de `tasks.md`, con dependencia de T-CORE-11. T-CORE-06…10 no se reabren ni cambian de alcance; T-CORE-06 pasa a ejecutarse **después** de T-CORE-13 (ya cerrada, `cc97826`) y quedó **cerrada el 11-nov-2026** (`c8d3fe0`+`5d9c369`, veredicto APROBADO en revisión inicial y revalidación), sin cambios en su alcance. La migración se hizo en su propia rama (`task/core-01-t12`) y no en el cambio documental.

---

**Siguiente punto:** la v1.2 sigue **aprobada técnicamente el 10-nov-2026** y la v1.3 solo registra pnpm, sin reabrir requisitos ni criterios. T-CORE-11, T-CORE-04, T-CORE-05, T-CORE-12, T-CORE-13, T-CORE-06, T-CORE-07 y **T-CORE-08 están cerradas y en `main`**. T-CORE-08 quedó integrada por fast-forward el 11-nov-2026 (`8826bec150b7108bc7e3c30c003b8e78bab0c0de`; reviewer **APROBADO**, sin hallazgos bloqueantes): cubre la accesibilidad del contenedor (teclado con Enter/Espacio reales, foco visible y gestionado, `aria-live`/`role="status"`/`role="alert"`, activo identificable y nombres accesibles) y resuelve las notas heredadas de T-CORE-04/05/06; su evidencia con mocks no demuestra integración real con backend/proveedor ni validación manual con lector de pantalla o navegador real. **T-CORE-09** (integración con UX-02/03/04 sin alterar el dominio) está **bloqueada** hasta que existan las vistas UX-02/03/04 de RH-REQ-01 (T-RH-05…14); no está iniciada. **T-RH-03 a T-RH-05 están cerradas e integradas en `main`** por fast-forward (T-RH-05 el 12-nov-2026, `1bbd33e` + `06f5fd4`, reviewer **APROBADO** tras un ciclo; bandeja UX-02 sin integrar en `src/app` ni persistencia); **T-RH-06** quedó cerrada e integrada en `main` el 13-nov-2026 (`bb79ded` + `50b7f22`, reviewer **APROBADO** tras un ciclo; persistencia intra-sesión de filtros/orden/página y contexto de bandeja reutilizable); el siguiente trabajo accionable del corte es **T-RH-07**, no iniciado y sujeto a confirmación explícita del usuario. T-CORE-10 sigue pendiente; P-04 se resuelve antes de cerrar T-CORE-10.
