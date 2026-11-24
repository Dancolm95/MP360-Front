# Plan técnico — Requerimientos de personal (RH-REQ-01)

**ID:** RH-REQ-01  
**Versión del plan:** 1.3 (17-nov-2026; **adición estructural**: convención de estructura del dominio, §6). La v1.2 sigue **aprobada técnicamente el 10 de noviembre de 2026** (cambio de stack a Next.js) y esa aprobación no se revoca; la v1.3 es una adición sin cambios funcionales y queda **aprobada técnicamente el 17-nov-2026 por confirmación explícita del usuario**. La v1.1 (React + TypeScript con Vite) queda como registro histórico.  
**Cubre:** RH-REQ-01 v0.7 «Requerimientos de personal» (aprobada funcionalmente el 10-nov-2026). Se integra con CORE-01 v0.6 «Contenedor ERP compartido» a través de su plan ([`../../core/CORE-01-contenedor-erp/plan.md`](../../core/CORE-01-contenedor-erp/plan.md)).  
**Estado:** **Aprobado técnicamente el 10 de noviembre de 2026** (v1.2, cambio de stack a Next.js). La v1.1 aprobada el 10-nov-2026 (React + TypeScript + Vite) queda como registro histórico. No fija URLs, endpoints ni payloads; lo que dependa de proveedor real queda señalado como decisión técnica abierta a resolver antes de cerrar las tareas dependientes. Las decisiones C-01 a C-04 heredadas del contenedor y la persistencia intra-sesión quedan resueltas a nivel de contrato (10-nov-2026); INT-01 (contratos técnicos Selección/Alta y casos límite) y P-04 (matriz final de permisos) siguen abiertos. La v1.3 (17-nov-2026) añade solo la convención de estructura del dominio (§6) y queda **aprobada técnicamente el 17-nov-2026** por confirmación explícita del usuario: no cambia los requisitos de la spec, el stack, el gestor pnpm (registrado en el plan de CORE-01 §6.1, fuente canónica que este plan referencia), las decisiones C-01 a C-04, INT-01 ni P-04.  
**Fecha:** 10 de noviembre de 2026 (v1.2); 17 de noviembre de 2026 (v1.3).

## Decisiones técnicas adoptadas (10 de noviembre de 2026)

- **Stack (revisado el 10-nov-2026; aprobado con la v1.2):** Next.js 16 (App Router) + React 19 + TypeScript sobre Node 24 LTS, entregado con `next start`; **sin SSR de datos ni de sesión** (`layout.tsx` servidor, shell cliente); sin autorización en `proxy.ts` (antes `middleware.ts`); runner único Vitest con React Testing Library + jsdom. Detalle y rationale: plan de CORE-01 §6, que es la **fuente canónica**.
- **Nota (10-nov-2026):** el cambio de stack no altera ningún requisito, criterio ni la decisión de persistencia intra-sesión; se registra en el plan de CORE-01 §6.
- **Operaciones:** se construye contra mocks/adaptadores de contrato, distinguibles de operaciones reales, sin autorización ni persistencia falsas.
- **Diferido:** RH-REQ-01 §10 criterio 18 (comparación visual de páginas 6–9) y C-05 quedan diferidos en este corte.
- **Persistencia intra-sesión (C-04, heredada del contenedor):** `sessionStorage` solo con datos no sensibles, encapsulada en `SessionScopedStore<T>` y borrada al terminar la sesión; aplica a filtros, orden y página de la bandeja (T-RH-06).
- **Autorización y catálogo (C-01/C-03, heredadas):** capacidades como cadenas opacas con prefijo, nunca nombres de rol; visibilidad no concede operación.

---

## 1. Alcance y exclusiones

**Alcance.** Requerimientos de personal (RH-REQ-01 §2): bandeja UX-02, creación/edición/revisión/envío UX-03 y detalle/aprobación UX-04, con plazos/alertas, estados y transiciones, concurrencia versionada e integración Selección/Alta (INT-01). El contenedor ERP de escritorio (CORE-01 §2, §4) se cubre en su propio plan.

**Exclusiones de este corte.**

- **C-05 y criterio 18 (diferidos):** la comparación visual directa con el PDF (RH-REQ-01 §10 criterio 18) comparte el mismo límite de lectura del PDF que motiva C-05 y queda **diferida** en este corte junto con C-05 (véase §4); la comparación visual del contenedor (CORE-01 §7 criterio 9) se remite al plan de CORE-01. Se mantiene la regla de no adoptar datos ilustrativos del PDF como reglas y no reproducir composiciones no legibles desde el visor.
- **P-04 (externo):** la matriz técnica final de roles, ámbitos y permisos es dependencia externa; este corte usa el contrato provisional autorizado (RH-REQ-01 §3, CORE-01 §3).
- **Módulos/vistas no incluidos:** candidatos UX-05/06, Alta UX-07 operativa, ficha/legajo UX-08 y el resto de vistas RR. HH. Los módulos de dominio (Selección, Alta) solo aparecen como proveedores de resultados de integración, no como vistas operativas de este corte.

---

## 2. Contrato de integración INT-01 (Selección/Alta)

Cuatro decisiones funcionales ya aprobadas (RH-REQ-01 §6, §7.3, §11). Aquí se define el **contrato funcional** y las responsabilidades; no se fijan payloads, eventos técnicos ni APIs concretas. Los casos límite se resuelven sin alterar las reglas funcionales.

### 2.1 Apertura de proceso confirmada por Selección

- **Contrato funcional:** RR. HH. con capacidad inicia «Abrir proceso en Selección» desde el detalle de un requerimiento **Aprobado**. El requerimiento permanece Aprobado hasta que Selección confirme la creación del proceso; solo con esa confirmación pasa a En reclutamiento. No hay cambio optimista; el error se muestra en Requerimientos y el reintento parte de la misma acción.
- **Responsabilidades:** Frontend RR. HH. (dispara la acción, presenta resultado confirmado o error/reintento); Backend ERP (versiona el comando, revalida capacidad/estado, aplica la transición solo con confirmación); Selección (confirma la creación del proceso).
- **Verificación:** RH-REQ-01 §10 criterios 8 y 26 (fallo → permanece Aprobado; error + reintento; sin En reclutamiento anticipado).
- **Casos límite (al plan):** duplicidad o reintento de la apertura; concurrencia entre confirmación de Selección, reversión y primer día real.

### 2.2 Primer día real registrado por Alta

- **Contrato funcional:** Alta registra el primer día real; Requerimientos lo consume en **solo lectura** únicamente para la cobertura. No altera la fecha objetivo ni el cómputo de plazos (que siguen rigiéndose por la fecha de aprobación). `cubiertas` solo aumenta al confirmarse ese primer día.
- **Responsabilidades:** Alta (registra el dato); Frontend RR. HH. (muestra solo lectura, recalcula cobertura); Backend ERP (revalida e integra el dato, mantiene inmutables los datos aprobados y la fecha objetivo).
- **Verificación:** RH-REQ-01 §10 criterios 9 y 24; RH-REQ-01 §5.1 (el primer día real no participa en el cómputo de plazos).
- **Casos límite:** completar el alta antes del primer día real no cuenta; consistencia de `pendientes = solicitadas − cubiertas`.

### 2.3 Reversión de cobertura originada por evento auditado de Selección

- **Contrato funcional:** la reversión efectiva la origina un evento auditado de Selección con motivo obligatorio. RR. HH. con capacidad la solicita desde el seguimiento con motivo obligatorio; los contadores no cambian hasta que el evento se confirma. Un rechazo o fallo conserva estado y contadores, informa y permite reintentar. Solicitud y evento confirmado quedan auditados (actor, fecha/hora, motivo).
- **Responsabilidades:** Frontend RR. HH. (solicita con motivo, refleja solo el resultado confirmado); Selección (emite el evento auditado con motivo); Backend ERP (revalida, recalcula cobertura y estado sin editar datos aprobados, audita).
- **Verificación:** RH-REQ-01 §10 criterios 10 y 27.
- **Casos límite:** reversión con pendientes previas (permanece En reclutamiento); Cubierto con nuevas pendientes → retorna a En reclutamiento; solicitud rechazada o fallida.

### 2.4 Remuneración previa al alta

- **Contrato funcional:** el ajuste de remuneración previo al alta pertenece a Alta, con trazabilidad propia. Alta **no** hereda la excepción `0.00` de Practicante: mantiene la validación >0 de UX-07 sin excepción y **no confirma el ingreso mientras el importe siga en `0.00`**. El ajuste no modifica el requerimiento aprobado de RH-REQ-01.
- **Responsabilidades:** Alta (ajusta con trazabilidad y no confirma con `0.00`); Frontend RR. HH. (no edita ni duplica ese ajuste; si lo muestra es solo lectura); Backend ERP (valida y audita el ajuste en Alta, mantiene inmutables los datos aprobados del requerimiento).
- **Verificación:** RH-REQ-01 §10 criterio 25.
- **Casos límite:** el historial y el contrato concreto del ajuste pertenecen a Alta y al plan (no se definen aquí sus campos).

---

## 3. Traza de P-04 (autorización provisional y matriz final)

- **Contrato provisional autorizado** (RH-REQ-01 §3): el backend limita los registros consultables al ámbito efectivo; cada requerimiento devuelve sus capacidades/acciones permitidas por usuario y versión; el frontend presenta acciones a partir de esas capacidades y contempla lectura/sin permisos; el backend revalida autorización, ámbito, estado y versión en cada comando. Ocultar una acción no constituye autorización.
- **Dependencia externa:** la matriz técnica final de roles/ámbitos/permisos sigue fuera de este repositorio y no bloquea el plan. Los adaptadores/mocks de este corte deben parametrizarse por capacidades y no codificar permisos por nombre de rol ni por etiquetas del PDF, para poder migrar a la matriz final sin reescribir reglas.
- **Verificación de la traza:** RH-REQ-01 §10 criterios 15, 16; CORE-01 §7 criterios 2 y 3 (sin permisos y visibilidad sin operación) se cubren en el plan de CORE-01.

---

## 4. Verificación

Se verifican **todos** los criterios de aceptación de RH-REQ-01 §10, salvo el diferido explícito. La verificación es funcional (fixtures de sesión/capacidades), de reglas (cálculos de plazos/umbrales/cobertura), de integración (Selección/Alta), de concurrencia (versionado) y de accesibilidad (teclado, foco, nombres, mensajes por texto). El criterio de accesibilidad transversal aplica a RH-REQ-01 §8/§10-17; la verificación del contenedor (CORE-01 §7) se cubre en el plan de CORE-01.

### 4.1 RH-REQ-01 §10

| Criterio | Verificación |
|---|---|
| 1 | Guardar borrador incompleto; reabrir devuelve exactamente los valores confirmados por backend; fallo conserva valores en pantalla y no muestra éxito. |
| 2 | «Revisión y envío» presenta todos los datos y errores; «Volver a editar» conserva cambios no persistidos; guardar borrador exige persistencia real. |
| 3 | Validación de vacantes (entero ≥1) y remuneración (PEN, ≥0, máx. 2 decimales; `0.00` solo Practicante). |
| 4 | Aprobación = día 0; cómputo en días hábiles del calendario único; aprobación en día no hábil → día 1 = siguiente hábil. |
| 5 | Operativo: objetivo 10 y alertas en días 5/7/9. Administrativo 17: umbrales en 9/13/16; ninguno es vencimiento. |
| 6 | Administrativo sin plazo entero 15–30 no aprueba; RR. HH. fija/ajusta con motivo solo en Aprobado/En reclutamiento; no en Cubierto/Cancelado. |
| 7 | Ajuste 17→20 recalcula desde la misma aprobación original; historial conserva actor/fecha/motivo/valores/fechas; eventos históricos no se borran ni se simulan correos. |
| 8 | Aprobado → solo «Abrir proceso en Selección» + confirmación de Selección → En reclutamiento; fallo permanece Aprobado, error y reintento (sin optimismo). |
| 9 | Alta antes del primer día real no incrementa cubiertas; primer día en solo lectura; `pendientes = solicitadas − cubiertas`; Cubierto al llegar a cero; fecha objetivo sin cambio. |
| 10 | Reversión solo por evento auditado de Selección con motivo; recalcula cobertura; Cubierto→En reclutamiento; datos aprobados no editados. |
| 11 | «Asociar candidato» solo RR. HH. con capacidad en En reclutamiento; navega al proceso ya creado; vínculos/desvínculos proceden de Selección. |
| 12 | Comandos versionados (editar/guardar, enviar/reenviar, fijar/ajustar plazo, abrir proceso, cancelar, solicitar reversión, aprobar, observar): versión antigua se rechaza sin persistir, conserva entrada, muestra vigentes y permite nueva decisión. |
| 13 | Bandeja: filtro de periodo por fecha de aprobación; responsable o «Sin asignar»; orden inicial creación desc.; columnas ordenables con ausentes al final e ID como desempate. |
| 14 | Filtros sobreviven a navegación/recarga dentro de la sesión, se limpian al cerrar y no exponen datos sensibles en `localStorage`. |
| 15 | Carga, vacío, sin resultados, error recuperable, sin permisos, conflicto y éxito persistido verificables por separado. |
| 16 | Sin capacidad no se ve la acción y el intento directo es rechazado por backend; registros limitados por ámbito. |
| 17 | Flujo completo solo con teclado; foco, nombres, errores, orden y alertas conforme a §8. |
| 18 | **Diferido (junto a C-05):** comparación visual de páginas 6–9 (1920×1080) no exigible en este corte; se mantiene la regla de no adoptar datos ilustrativos ni composiciones no legibles del visor. |
| 19 | Días objetivo aún en plazo; incumplimiento al iniciar el siguiente día computable; alerta ≠ vencimiento; comunicación por texto/icono + color. |
| 20 | «Cancelar edición» con cambios no guardados → confirmación de descarte (aceptar vuelve sin persistir; rechazar conserva); «Cancelar requerimiento» es otra transición. |
| 21 | Observado: el creador ve el comentario de observación antes de corregir. |
| 22 | «Volver a bandeja» restaura filtros, orden y página previos. |
| 23 | Fila abre detalle por teclado e interacción; entrada/regreso conservan contexto de bandeja. |
| 24 | Sin fecha objetivo definitiva antes de aprobar; UX-03 muestra duración y aviso de cálculo posterior; UX-02 sin fecha sin aprobación. |
| 25 | `0.00` solo en RH-REQ-01; Alta mantiene >0 sin excepción y no confirma con `0.00`; ajuste trazable en Alta sin modificar el requerimiento aprobado. |
| 26 | «Abrir proceso en Selección» solo en detalle de Aprobado; permanece Aprobado hasta confirmación; fallo → error y reintento; «Asociar candidato» solo en En reclutamiento. |
| 27 | Solicitud de reversión solo con motivo; contadores solo cambian con el evento confirmado; rechazo/fallo conserva e informa; solicitud y evento auditados. |

### 4.2 Diferido: RH-REQ-01 §10 criterio 18 y C-05

- **RH-REQ-01 §10 criterio 18 (DIFERIDO):** la comparación visual de páginas 6–9 se difiere en este corte junto con C-05 (mismo límite de lectura del PDF). Se mantiene la regla de no adoptar datos ilustrativos ni composiciones no legibles del visor.
- **C-05 (CORE-01):** queda diferido (CORE-01 §7 criterio 9), sin adoptar composición no legible desde el visor.

---

## 5. Riesgos y decisiones abiertas para el usuario

**Aprobadas el 10-nov-2026 (v1.2).**

- **Stack y tooling (10-nov-2026)** — Next.js 16 (App Router) + React 19 + TypeScript sobre Node 24 LTS; sin SSR de datos ni de sesión; sin autorización en `proxy.ts` (antes `middleware.ts`); runner único Vitest con React Testing Library + jsdom. Detalle, rationale y riesgos: plan de CORE-01 §6, **fuente canónica**.

**Aprobada técnicamente el 17-nov-2026 (v1.3):**

- **Convención de estructura del dominio (§6)** — carpetas con rol arquitectónico en inglés y archivos/símbolos de dominio en español, frontera única en `contracts/` y barril raíz sin `fixtures`; ejecución en T-RH-25 (refactor sin cambios funcionales).

**Resueltas (10 de noviembre de 2026):**

1. **Existencia de backend/proveedores reales** — RESUELTA: este corte se construye contra **adaptadores/mocks que respeten los contratos** (distinguibles de operaciones reales, sin autorización ni persistencia falsas), no contra servicios reales.
2. **Persistencia intra-sesión (C-04, heredada del contenedor)** — RESUELTA (10-nov-2026): `sessionStorage` solo con datos no sensibles, encapsulada en `SessionScopedStore<T>` y borrada al terminar la sesión (aplica a T-RH-06). El gestor de estado concreto queda a criterio de la implementación.

**Decisiones técnicas abiertas (a resolver antes de cerrar las tareas dependientes; `tasks.md` ya existe pero no las concreta):**

3. **INT-01:** contratos técnicos con Selección/Alta y resolución de casos límite (duplicidad/reintento de apertura, concurrencia, reversión rechazada).
4. **P-04:** plazo de disponibilidad de la matriz final de permisos y criterio de migración desde el contrato provisional.

**Diferido (fuera de este corte):**

5. **RH-REQ-01 §10 criterio 18** — DIFERIDO junto a C-05: la comparación visual de páginas 6–9 no es exigible en este corte (mismo límite de lectura del PDF).

**Riesgos principales.**

- **Dependencia de proveedores sin contrato real** (Selección, Alta): riesgo de bloqueo; mitigación con adaptadores de contrato definido, sin autorización/persistencia falsa.
- **Concurrencia/versionado (INT-01 y comandos versionados):** riesgo de estados inconsistentes; mitigación con confirmación sin optimismo y rechazo de versiones desactualizadas.
- **Matriz de permisos externa (P-04):** riesgo de retrabajo en autorización; mitigación parametrizando por capacidades, sin codificar por nombre de rol.
- **Riesgos del cambio de stack:** `tsconfig` de Vite frente a Next y `.next/types`, entrega con `.next/` + `next start` sobre Node 24, entorno de pruebas `node`/`jsdom` y acoplamiento Vitest–Vite, frontera Server/Client e hidratación, foco en cambios de ruta del App Router y Node 25.9.0 local frente a LTS. Mitigación detallada en CORE-01 plan §5; se ejecuta en T-CORE-11 (y el foco, en T-CORE-08).

---

## 6. Convención de estructura del dominio (17-nov-2026)

Adición estructural de la v1.3, sin cambios funcionales: define cómo se organizan las carpetas, los archivos y los tipos del dominio Requerimientos. Es canónica para este módulo y patrón de referencia para los módulos futuros; su ejecución queda en **T-RH-25**.

**Reglas.**

- **R1 — Carpetas y archivos.** Las carpetas nombran su rol arquitectónico en inglés, alineado con `src/container/`: `contracts/`, `fixtures/`, `model/`, `deadlines/`, `state/`, `integration/` y las rebanadas `tray/`, `form/`, `review/`, `detail/`, `actions/` y `transitions/`. Los archivos y los símbolos de dominio se nombran en español (`BandejaRequerimientos`, `ajustarPlazoAdministrativo`, …).
- **R2 — Frontera única.** `contracts/` es el único hogar de los tipos que cruzan fronteras (puertos, DTOs, errores, identificadores); ninguna otra carpeta define tipos de frontera.
- **R3 — Ubicación de los tipos locales.** Un tipo local vive en la rebanada más interna que contenga a todos sus consumidores; si tiene consumidores en dos o más rebanadas, sube a `contracts/` (frontera) o a `model/` (dominio puro).
- **R4 — Responsabilidades por carpeta.** `deadlines/` es el único hogar del cómputo de plazos y del calendario (puro, sin I/O); `actions/` orquesta los comandos; las vistas solo presentan.
- **R5 — Archivos estructurales en inglés.** Los archivos estructurales (`index`, `types`, `model`, `state`, `helpers`) se nombran en inglés; los archivos de concepto de dominio (`ajuste-plazo`, `calendario`, `contexto-bandeja`, …) en español.
- **R6 — Barril raíz.** El barril raíz exporta solo la API pública (`contracts`, `model`, `deadlines` y las rebanadas); `fixtures/` queda interno del módulo y solo lo consumen las pruebas.

**Grafo de dependencias vigente (verificado el 17-nov-2026):** `contracts/` ← `model/` y `deadlines/` ← rebanadas; `state/` y `fixtures/` dependen solo de `contracts/`; sin imports horizontales entre rebanadas. **Queda prohibido importar entre rebanadas:** el consumo cruzado pasa por el barril raíz, o el tipo/concepto se promueve a `model/` o a `contracts/`.

**Nombres afectados (se ejecutan en T-RH-25):** `acciones/` → `actions/`; `acciones/tipos.ts` → `actions/types.ts`; `review/modelo.ts` → `review/model.ts`; `detail/modelo.ts` → `detail/model.ts`; el barril raíz deja de reexportar `./fixtures`.

**Qué no cambia:** los requisitos de `spec.md`, el stack, el gestor pnpm, las decisiones C-01 a C-04, INT-01 y P-04.

---

**Siguiente punto:** la **v1.3 (17-nov-2026)** añade únicamente la convención de estructura del dominio (§6) y queda **aprobada técnicamente el 17-nov-2026** por confirmación explícita del usuario; la v1.2 permanece **aprobada técnicamente el 10-nov-2026** y esa aprobación no se revoca. **T-RH-01 a T-RH-22, T-RH-25 y T-RH-27 están cerradas e integradas en `main`**. T-RH-05 se integró por fast-forward el 12-nov-2026 (`1bbd33e` + `06f5fd4`; reviewer final **APROBADO** tras un ciclo): bandeja UX-02 con filtros, columnas, orden y paginación, estado frente a alerta, duración antes de aprobar y estados de lectura accesibles, sin integrar `src/app`, sin persistencia intra-sesión, acciones por capacidades, plazos ni integración real con backend, Selección ni Alta. T-RH-06 se integró por fast-forward el 13-nov-2026 (`bb79ded` + `50b7f22`; reviewer final **APROBADO** tras un ciclo): persistencia intra-sesión de filtros, orden y página con `SessionScopedStore` sobre `sessionStorage`, contexto de bandeja reutilizable y disparador accesible de fila de UX-02, cubriendo el criterio 14 completo y la parte UX-02 del criterio 23, sin acoplamiento estado→presentación; UX-04 y el criterio 22 quedan en T-RH-11/T-RH-14 y el foco visible (`tr:focus-visible`) se verifica en la integración. T-RH-07 se integró por fast-forward el 13-nov-2026 (`ef50734`; reviewer final **APROBADO**, sin hallazgos bloqueantes): acciones de bandeja por capacidades y estados de interfaz («Nuevo» por `['crear']` de bandeja, «Detalle» para toda fila visible y «Editar»/«Cancelar» por `accionesPermitidas`), solo botones + intención, accesibilidad §8 y «Detalle» reutilizando el `onAbrirDetalle` de T-RH-06; cubre el criterio 16 en su parte de visibilidad; el resto del criterio 15/16 y la causal/confirmación de Cancelar quedan en T-RH-12/T-RH-16. T-RH-08 se integró por fast-forward el 16-nov-2026 (`620f487`; reviewer final **APROBADO**, sin hallazgos bloqueantes): formulario crear/editar UX-03 con jerarquías organizacional y geográfica, colaborador a reemplazar condicional, clasificación derivada, duración aplicable en lugar de fecha objetivo y obligatorios con semántica accesible; cubre el criterio 24 en su parte de UX-03 y no se integra en `src/app`/`RrhhContainer` (T-CORE-09); «Revisión y envío», «Cancelar edición» y el comentario de Observado quedan en T-RH-09/T-RH-10, y la fijación del plazo y el cálculo de la fecha objetivo en T-RH-12/T-RH-13/T-RH-15. T-RH-09 se integró por fast-forward el 17-nov-2026 (`e5f38ce` + `dd655c4`; reviewer final **APROBADO**, sin hallazgos bloqueantes tras un ciclo: B-01 resuelto sin cambios de producción): lógica y estado de «Revisión y envío» con modelo de revisión y etiquetas presentables, errores consolidados de T-RH-04, conservación de valores no persistidos e invalidación al cambiar datos, envío/reenvío versionado solo desde revisión, guardar borrador por el puerto de comandos y confirmación con ID/resumen/responsable/estado; cubre los criterios 1 y 2, sin vistas ni integración en `src/app`. T-RH-10 se integró por fast-forward el 17-nov-2026 (`aee47e9` + `0ea02d9` + `f0f29f8`; reviewer final **APROBADO**, sin hallazgos bloqueantes tras dos ciclos: normalización laxa, evidencia del punto de partida y fixture de observación, más un falso positivo residual con campos vacíos, resueltos sin cambios de alcance): lógica y estado de «Cancelar edición» con confirmación de descarte, conservación de valores al rechazar, distinción de «Guardar borrador» y «Cancelar requerimiento», y observación vigente por instante con autor y fecha, separada de la justificación y con reenvío ejercido; cubre los criterios 20 y 21, sin vistas ni integración en `src/app`. T-RH-11 se integró por fast-forward el 17-nov-2026 (`d3eb796`; reviewer final **APROBADO** en el primer ciclo, sin hallazgos bloqueantes): lógica y estado del detalle UX-04 con resumen por campos, cobertura con invariante `pendientes = solicitadas − cubiertas`, plazo/alerta/cumplimiento e historial normalizado, sin calcular plazos, umbrales ni vencimientos (T-RH-15) y sin vistas ni integración en `src/app`; cubre el criterio 19 y la parte de cobertura del criterio 13. T-RH-12 se integró por fast-forward el 17-nov-2026 (`837cd5d`; reviewer final **APROBADO** en el primer ciclo, sin hallazgos bloqueantes): elegibilidad por intersección de `accionesPermitidas` y estado, ejecución de Aprobar/Observar/Cancelar y de fijar plazo con los comandos versionados y mapeo de resultados sin cambio optimista, con las validaciones de Observar (comentario), Cancelar (confirmación y causal) y aprobación (plazo administrativo obligatorio y válido); cubre los criterios 4 y 6, sin vistas ni integración en `src/app` (la re-fijación del plazo mientras sigue Pendiente se auditó y se admitió; el ajuste con motivo obligatorio queda en T-RH-13). T-RH-15 se integró por fast-forward el 17-nov-2026 (`6d51a57`; reviewer final **APROBADO** en el primer ciclo, sin bloqueantes): calendario único con excepciones, fecha objetivo, vencimiento y umbrales 50/75/90 % con días fijos 5/7/9 para Operativo, con evaluación pura y determinista, sin vistas ni integración en `src/app`; cubre los criterios 4, 5 y 19. T-RH-13 se integró por fast-forward el 17-nov-2026 (`a940f56`; reviewer final **APROBADO** en el primer ciclo, sin bloqueantes): una sola fuente del rango 15–30 en `deadlines/rango.ts` (sin ciclo `acciones`↔`deadlines`), ajuste auditado solo para Administrativo en Aprobado/En reclutamiento con motivo obligatorio y rango, recálculo de fecha objetivo y umbrales desde la aprobación original y evento de historial con actor, fecha/hora, motivo, valores y fechas, sin vistas ni integración en `src/app`; cubre los criterios 6 y 7. T-RH-14 se integró por fast-forward el 17-nov-2026 (`3a8260a` + `08eaf4b` + `2d5eafb`; reviewer final **APROBADO** tras dos ciclos: B-01 duplicación de la validación de filtros y B-02 respaldo del orden): restauración del contexto de bandeja con saneo compartido y `CLAVES_FILTRO_BANDEJA`, estados `restaurado`/`sin-contexto`/`incompleto`/`incompatible`, respaldo selectivo por dimensión y orden inicial ante cualquier defecto de orden, sin vistas ni integración en `src/app`; cubre el criterio 22 en su parte de restauración. **UX-04 queda completa en lógica y estado.** T-RH-25 se integró por fast-forward el 17-nov-2026 (`c8d5243`; reviewer final **APROBADO** en el primer ciclo, sin bloqueantes): reorganización estructural según §6 (`acciones/` → `actions/`, tipos estructurales en inglés, `model/` como hogar de los tipos compartidos, `deadlines/` único del cómputo, `fixtures/` interno y barril raíz sin `./fixtures`), con 0 imports entre rebanadas y sin cambios funcionales (29 archivos/561 pruebas idénticas), sin vistas ni integración en `src/app`. **T-RH-16** quedó cerrada e integrada en `main` el 17-nov-2026 (`9dc074f` + `6eb52ba`, reviewer **APROBADO** tras un ciclo; máquina de §6 con matriz completa de transiciones y guardas, Cubierto solo con pendientes cero, efecto de vencimiento sin recalcular y centralización de estados cancelables, causales y acciones elegibles, sin vistas ni integración en `src/app`; cubre los criterios 8 y 10); **T-RH-17** quedó cerrada e integrada en `main` el 18-nov-2026 (`a467e9d`, reviewer **APROBADO** en el primer ciclo, sin bloqueantes; puerta única `ejecutarComandoVersionado` para los diez comandos del criterio 12, con rechazo sin persistir, entrada conservada, datos y versión vigentes y reintento con la versión actualizada, sin vistas ni integración en `src/app`); **T-RH-18** quedó cerrada e integrada en `main` el 18-nov-2026 (`dd4cd3f`, reviewer **APROBADO** en el primer ciclo, sin bloqueantes; apertura de proceso en Selección con capacidad y estado Aprobado, sin cambio optimista, permanencia en Aprobado hasta `EventoAperturaProceso` confirmado, fallo reintentable y sin procesos inventados; cubre los criterios 8 y 26 en su primera parte, sin vistas ni integración en `src/app`); **T-RH-19** quedó cerrada e integrada en `main` el 18-nov-2026 (`f83bfaa`, reviewer **APROBADO** en el primer ciclo, sin bloqueantes; primer día real en solo lectura, cobertura solo con evento confirmado, `pendientes` derivado, Cubierto por la máquina a cero pendientes y fecha objetivo intacta, con la puerta versionada aplicada a una lectura porque el contrato no tiene comando de escritura; cubre el criterio 9, sin vistas ni integración en `src/app`); **T-RH-20** quedó cerrada e integrada en `main` el 18-nov-2026 (`966e475`, reviewer **APROBADO** en el primer ciclo, sin bloqueantes; solicitud motivada que no altera estado ni contadores, reversión solo con evento auditado, `pendientes` recalculado, Cubierto → En reclutamiento por la máquina y trazabilidad `solicitudId`; cubre los criterios 10 y 27, sin vistas ni integración en `src/app`); **T-RH-21** quedó cerrada e integrada en `main` el 18-nov-2026 (`b28e249` + `2fab3f9`, reviewer **APROBADO** tras un ciclo con **B-01** resuelto; elegibilidad con capacidad y En reclutamiento, navegación al proceso existente sin crear proceso ni vínculo, con el suceso fuera de `TRANSICIONES` para no crear una transición ficticia fuera de §6; cubre el criterio 11, sin vistas ni integración en `src/app`); y **T-RH-22** quedó cerrada e integrada en `main` el 18-nov-2026 (`5878067`, reviewer **APROBADO** en el primer ciclo, sin bloqueantes; remuneración previa al alta en solo lectura sin editar ni duplicar el ajuste, excepción `0.00` de Practicante no heredada, Alta no confirma con `0.00` ni negativos y requerimiento aprobado inmutable; cubre el criterio 25, sin vistas ni integración en `src/app`); **el bloque INT-01 queda completo en lógica y estado**. **Pendientes: T-RH-23 y T-RH-24.** **T-RH-27** (reconciliación de la capa visual con `main`) **quedó cerrada e integrada en `main` el 24-nov-2026** (merge `c68daa1` conservando el historial; commit de tarea `a4b81fb` integrado por fast-forward, `main` = `a4b81fb`; 52 commits y 95 archivos (+27 225/−5); cuatro conflictos resueltos por contenido con `form/FormularioRequerimiento.tsx` y su test idénticos a `main`; poda de 12 áreas, 40 archivos y −11 480 líneas, con 9 modos supervivientes; `tray/formato` eliminado y `AVISO_DURACION` única; ruta `/preview/requerimientos/comparacion-ux03`; suite 42/768 con las 14 pruebas de producción intactas; reviewer **APROBADO** tras un ciclo con B1 resuelto; corrección de embebido de la comparación en `60cbe85` con prueba del defecto), con lo que **la capa visual ya está integrada en `main`**; **T-RH-23** (UX-03 definitiva y accesibilidad de UX-02/03/04) es el **único trabajo accionable de RH-REQ-01**, con la **decisión de UX-03 ya tomada el 24-nov-2026**: la superficie canónica es la de la rama `codex/rh-vis` (modal con pasos), el paso de datos reutiliza el componente de producción `form/FormularioRequerimiento.tsx` para no duplicar reglas, la confirmación se muestra solo tras persistencia confirmada y los datos de ejemplo incluyen un caso administrativo; las etiquetas «(S/)» y «Responsable de aprobación» se deciden durante la tarea (si gana el PDF, primero `spec.md`); **T-RH-24** (verificación integral y traza de P-04) depende de T-RH-23, de T-RH-26 y de la matriz final de permisos **P-04**, que es su **única dependencia externa**. **T-RH-26** (consolidación de superficies únicas del dominio, refactor sin cambios visibles) sigue registrada y aprobada técnicamente, pero **no se ejecuta hasta que el usuario la indique**, y **no sustituye** a T-RH-23 ni a T-RH-24. **T-CORE-09** (integración con UX-02/03/04 sin alterar el dominio) ya no está bloqueada por la capa visual, integrada en `main`: **depende ahora de T-RH-23**.
