# Tareas — Contenedor ERP compartido (CORE-01)

**Spec:** CORE-01 v0.6 (aprobada funcionalmente el 10-nov-2026).  
**Plan:** [`plan.md`](plan.md) v1.2 (**aprobado técnicamente el 10-nov-2026**; cambio de stack a Next.js). La v1.1 (React + TypeScript + Vite) fue aprobada técnicamente el 10-nov-2026 y es histórica.  
**Estado del corte:** tareas vigentes — T-CORE-01 hecha y **sustituida por T-CORE-11** (commit conservado como traza); T-CORE-02 y T-CORE-03 hechas (`b36a956` y `74ef493`, ambas en `main`); **T-CORE-11 hecha, aprobada por el reviewer y mergeada en `main` el 10-nov-2026** (`ec02c2a` y `df1ade6`, rama `task/core-01-t11`); **T-CORE-04 es la siguiente tarea**; T-CORE-05…10 pendientes.  
**Alcance activo:** CORE-01 §7 criterios 1–8.  
**Diferido (fuera del alcance activo):** C-05 (CORE-01 §7 criterio 9) y RH-REQ-01 §10 criterio 18 (verificación diferida junto a C-05).

## Convenciones

- IDs estables `T-CORE-xx`.
- Cada tarea cita criterios de aceptación (CORE-01 §7) y secciones del plan.
- **Entrada** = insumos; **Salida** = artefactos verificables; **Hecho cuando** = criterio de verificación demostrable.
- No se fijan URLs, endpoints ni payloads. Los mocks respetan los contratos y son distinguibles de operaciones reales (sin autorización ni persistencia falsas).
- **Límite de evidencia con mocks:** las pruebas con fixtures demuestran el contrato y los estados de interfaz, no la integración real con el proveedor. La verificación contra servicios reales queda pendiente hasta disponer de ellos.

## Fase A — Andamiaje y contratos base

### T-CORE-01 — Andamiaje del proyecto React + TypeScript (Vite)
- [x] Hecha — Evidencia: scaffold React + TypeScript + Vite en `src/` (`container/`, `shared/`, `modules/rrhh/`); `npm install` sin vulnerabilidades, `npm run build` (tsc + vite) sin errores y `npm run dev` arrancando (HTTP 200); reviewer APROBADO el 10-nov-2026. **Sustituida por T-CORE-11** (cambio de stack a Next.js, 10-nov-2026); el commit se conserva como traza histórica.
- **Depende de:** — (primera tarea).
- **Traza:** constitución §Arquitectura; plan §1; decisión técnica (React + TS + Vite).
- **Entrada:** decisión técnica de stack aprobada (10-nov-2026).
- **Salida:** proyecto React + TypeScript (Vite) compilable, con estructura base que separa contenedor/común de módulos.
- **Hecho cuando:** el proyecto instala dependencias, compila y arranca sin errores; la estructura de carpetas separa contenedor/común de módulos.

### T-CORE-02 — Contratos TypeScript del contenedor (puertos)
- [x] Hecha — Evidencia: puertos C-01 `SessionPort`, C-03 `CatalogPort`+`Capability`, C-04 `NavigationPort`+`SessionScopedStore`, C-02 `SignOutPort`; identificadores opacos, sin URLs/endpoints/payloads; `npm run build` sin errores; reviewer APROBADO el 10-nov-2026; commit `b36a956`, lineal sobre `main` (verificado en la reflog de `main`). Sin cambios por el cambio de stack.
- **Depende de:** T-CORE-01.
- **Traza:** plan §2 (C-01, C-03, C-04, C-02); CORE-01 §3 y §4.
- **Entrada:** decisiones funcionales de C-01/C-02/C-03/C-04 (plan §2).
- **Salida:** contratos tipados (sesión/contexto/capacidades, catálogo de secciones, rutas lógicas, salida) sin fijar URLs ni payloads.
- **Hecho cuando:** los contratos compilan y representan responsabilidades y entradas/salidas de plan §2, sin dependencias de endpoints concretos.

### T-CORE-03 — Adaptadores mock de contrato del contenedor (fixtures)
- [x] Hecha — Evidencia: fixtures en `src/container/fixtures/` (mock/identifiers/session/catalog/navigation/sign-out/store/scenarios); 15 pruebas Vitest OK; `npm run build` OK; parametrización por `Capability` sin roles; reviewer APROBADO el 10-nov-2026; commit `74ef493` mergeado a `main`.
- **Depende de:** T-CORE-02.
- **Traza:** plan §2 y §3 (P-04); decisión técnica (mocks de contrato).
- **Entrada:** contratos de T-CORE-02.
- **Salida:** fixtures parametrizables por capacidades: sesión válida con/sin lectura UX-02, catálogo con secciones implementadas/no implementadas y visibilidad, expiración/terminación, y salida. Distinguibles de operaciones reales; sin autorización ni persistencia falsas; sin datos sensibles en `localStorage`.
- **Hecho cuando:** cada escenario de CORE-01 §5/§7 se puede inyectar por fixture; la parametrización es por capacidad, no por nombre de rol ni etiqueta del PDF.

### T-CORE-11 — Sustituir el andamiaje Vite por Next.js
- [x] Hecha — Evidencia: retirados `vite.config.ts`, `index.html`, `src/main.tsx`, `src/app/App.tsx`, `src/vite-env.d.ts`, `src/styles/global.css`, las dependencias `vite`/`@vitejs/plugin-react`, el script `preview` y el artefacto `dist/`; migrado a **Next.js 16.4.6 (App Router)** con `next.config.ts` sin `output: 'export'`, `src/app/layout.tsx` **Server Component** (`lang="es"`, `metadata` «ERP MP 360», `globals.css`), `src/app/page.tsx` **Client Component** (`'use client'`, título + tres capas, sin datos ni identidad ficticia) y `src/app/not-found.tsx` informativo (`#root` eliminado del CSS); **Vitest 4.1.12 + React Testing Library 16.3.3 + jsdom 31 + `@testing-library/dom` 10.4.2** con `vitest.config.ts` independiente de la app (sin `mergeConfig`; entorno `node` por defecto y `jsdom` por archivo); `tsconfig.json` de Next con `moduleResolution: "bundler"`, plugin de Next, `next-env.d.ts`, `.next/types/**/*.ts` y `src`; `.nvmrc` con 24; `.gitignore` con `.next/`. **`npm run build` OK** (Turbopack + TypeScript), **`npm start` HTTP 200**, **`npm test` 3 archivos / 16 pruebas OK** (contratos, fixtures y humo de componente); comprobación acotada de Vite cumplida (sin `vite.config.ts`/`index.html` y sin referencias a Vite fuera de la cadena «vitest»). Ejecutado bajo **Node v24.21.0 LTS** (npm 11.19.0) el **10-nov-2026**; commit de cierre `feat(core-01): T-CORE-11 sustituir el andamiaje por Next.js` en `task/core-01-t11` (HEAD de la rama). **Corrección tras revisión (10-nov-2026):** `vitest.config.ts` sin la opción `esbuild` —ignorada por Vitest 4, que transforma con oxc— y con el comentario ajustado a la realidad; `tsconfig.json` documentado como gestionado por Next (`jsx: "react-jsx"`), sin dejar el árbol sucio tras `npm run build`. **Veredicto del reviewer: APROBADO** (10-nov-2026); rama mergeada en `main` con `git merge --ff-only` y `main` sincronizado con `origin/main`.
- **Depende de:** T-CORE-02 y T-CORE-03 (sus fixtures se re-verifican en esta tarea); sustituye el andamiaje de T-CORE-01, que queda como traza histórica.
- **Traza:** plan §6 «Revisión de stack (10-nov-2026)» y plan §5 «Aprobadas el 10-nov-2026 (v1.2)» (stack); constitución §Arquitectura; decisión técnica del 10-nov-2026 (Next.js 16 + React 19 + TypeScript, Node 24 LTS).
- **Entrada:** andamiaje Vite de T-CORE-01; contratos y fixtures de T-CORE-02/T-CORE-03.
- **Salida:**
  - **Se retira:** `vite.config.ts`, `index.html`, `src/main.tsx`, `src/app/App.tsx` (su contenido demostrativo se traslada) y `src/vite-env.d.ts`; dependencias `vite` y `@vitejs/plugin-react`; scripts `dev`/`build`/`preview` de Vite (sustituidos abajo).
  - **Next.js:** `next.config.ts` (sin `output: 'export'`) y `next-env.d.ts`; scripts `dev` (`next dev`), `build` (`next build`) y `start` (`next start`). No se crea `proxy.ts` ni `middleware.ts` de autorización.
  - **App:** `src/app/layout.tsx` como Server Component (`lang="es"`, `metadata` con título «ERP MP 360», importa `globals.css`); `src/app/page.tsx` como Client Component (`'use client'`) que conserva el contenido demostrativo actual (título + capas), sin datos de ejemplo ni identidad ficticia; `src/app/not-found.tsx` informativo, sin datos ni acciones.
  - **CSS:** `src/styles/global.css` se migra a `src/app/globals.css`, adaptando o eliminando el selector `#root`, y conserva `font-family`, `box-sizing` y `color-scheme`.
  - **Frontera:** sin SSR de datos ni de sesión; sin `proxy.ts` (antes `middleware.ts`) de autorización.
  - **Tests:** `src/__tests__/smoke.test.ts` (importa los contratos) conserva su función con destino explícito en la nueva estructura; se añade una prueba de humo **de componente** con React Testing Library + jsdom sobre `page.tsx`; `vitest.config.ts` se reescribe sin `mergeConfig(viteConfig)`, con entorno `node` por defecto para contratos/fixtures y `jsdom` solo para las pruebas de componente (por archivo o por proyecto).
  - **`package.json`:** altas `next`, `@testing-library/react` y `jsdom`; bajas `vite` y `@vitejs/plugin-react`; scripts `dev`, `build`, `start`, `test` y `test:watch`; `engines.node` `>=20.9`.
  - **`tsconfig.json`:** configuración gestionada por Next (incluye `jsx: "react-jsx"`: Next 16.4.6 lo reescribe desde `preserve` y reformatea el archivo durante `next build`, por eso se conserva el valor que Next mantiene para no dejar el árbol sucio; plugin de Next, `include` de `next-env.d.ts` y `.next/types/**/*.ts`, `moduleResolution: "bundler"`), retirando lo específico de Vite.
  - **Entorno:** `.nvmrc` con 24 (Node 24 LTS).
  - **`.gitignore`:** `.next/` en lugar de `dist/`.
  - **Se conservan sin cambios:** `src/container/`, `src/shared/`, `src/modules/rrhh/` y los contratos de T-CORE-02.
- **Hecho cuando:** `npm run build` termina sin errores; `npm start` responde HTTP 200 tras `next build`, con el árbol limpio de `dist/`/`.next/`; `npm test` pasa completo (contratos, fixtures y prueba de humo de componente); la comprobación acotada de Vite se cumple —no existen `vite.config.ts` ni `index.html`, y no hay referencias a Vite en `package.json`, `tsconfig.json`, `next.config.ts` ni `src/`, excluyendo `vitest.config.ts` y las coincidencias de la cadena «vitest»—; la evidencia se registra bajo **Node 24 LTS** (el entorno local tiene 25.9.0).

## Fase B — Contenedor

### T-CORE-04 — Cabecera, identidad y selector de módulos
- [ ] Hecha
- **Depende de:** T-CORE-03, T-CORE-11 (ninguna vista se implementa sobre el andamiaje Vite; T-CORE-11 debe estar cerrada).
- **Traza:** CORE-01 §7 criterios 1, 2, 3, 8; plan §2.1 y §2.2.
- **Entrada:** contratos y fixtures de contexto/capacidades/catálogo.
- **Salida:** cabecera con marca ERP e identidad/contexto solo si se reciben y pueden mostrarse; navegación horizontal; selector que muestra solo RR. HH. con lectura UX-02; indicación de módulo/sección activa; sin identidad de ejemplo.
- **Hecho cuando:** criterios 1 y 2 observables con fixtures (con y sin UX-02); navegación operable por teclado con activo identificable (criterio 8).

### T-CORE-05 — Estados de sesión/contexto y limpieza ante vencimiento/terminación
- [ ] Hecha
- **Depende de:** T-CORE-03, T-CORE-04.
- **Traza:** CORE-01 §5; §7 criterios 5 y 6; plan §2.1 (C-01).
- **Entrada:** fixtures de carga/error/vencimiento/terminación.
- **Salida:** estados de carga y error (con reintento si procede) sin mostrar datos previos como vigentes; ante vencimiento o terminación externa, limpieza inmediata de identidad/contexto/capacidades/filtros/contexto de bandeja y toda persistencia de sesión; indicación de recuperación por proveedor, sin login local.
- **Hecho cuando:** criterios 5 y 6 verificables; nueva autenticación no hereda estado; sin datos sensibles en `localStorage`.

### T-CORE-06 — Acción «Salir» (C-02)
- [ ] Hecha
- **Depende de:** T-CORE-05.
- **Traza:** CORE-01 §7 criterios 6 y 7; plan §2.4.
- **Entrada:** contrato de salida de T-CORE-02 y fixtures.
- **Salida:** acción «Salir» que inicia el cierre de la sesión real en el proveedor; al terminar limpia estado/contexto local; destino de confirmación y manejo de errores del proveedor conforme a lo concretado en esta tarea (sin fijar endpoint/URL).
- **Hecho cuando:** criterio 7 verificable contra el adaptador mock (cierre simulado → limpieza); un error del proveedor simulado conserva el estado y explica cómo continuar. La integración real de cierre con el proveedor queda pendiente.

### T-CORE-07 — Entrada a RR. HH., retorno y «Próximamente» (C-03/C-04)
- [ ] Hecha
- **Depende de:** T-CORE-04, T-CORE-05.
- **Traza:** CORE-01 §4; §7 criterios 1, 2, 3; plan §2.2 y §2.3.
- **Entrada:** fixtures de catálogo y capacidades.
- **Salida:** entrada a RR. HH. → Requerimientos (bandeja) sin dashboard; secciones no implementadas solo con visibilidad explícita del backend → «Próximamente» informativo con regreso autorizado; destinos directos validan sesión y autorización; destinos desconocidos no se convierten en «Próximamente» ni vista ficticia; sin lectura UX-02 todo acceso RR. HH. se deniega sin datos.
- **Hecho cuando:** criterios 1, 2 y 3 verificables; la visibilidad sola no opera ni accede a vistas inexistentes.

### T-CORE-08 — Accesibilidad del contenedor
- [ ] Hecha
- **Depende de:** T-CORE-04, T-CORE-05, T-CORE-06, T-CORE-07.
- **Traza:** CORE-01 §5; §7 criterio 8.
- **Entrada:** vistas del contenedor implementadas.
- **Salida:** operación por teclado, foco visible y gestionado en cambios de vista/pérdida de sesión, nombres accesibles, activo identificable y mensajes por texto (no solo color).
- **Hecho cuando:** criterio 8 verificable en selector, navegación, estados informativos y «Salir».

### T-CORE-09 — Integración con UX-02/03/04 sin alterar el dominio (con RH-REQ-01)
- [ ] Hecha
- **Depende de:** T-CORE-07 y de las tareas de RH-REQ-01 (vistas UX-02/03/04).
- **Traza:** CORE-01 §7 criterio 4; plan §4.1 criterio 4.
- **Entrada:** vistas de Requerimientos de RH-REQ-01 en la zona central.
- **Salida:** UX-02/03/04 funcionan en la zona central sin alterar navegación/retorno de bandeja, filtros ni acciones de RH-REQ-01; la alerta real de plazo permanece visible sin panel derecho.
- **Hecho cuando:** criterio 4 verificable de forma conjunta con el plan de RH-REQ-01.

## Fase C — Verificación y traza

### T-CORE-10 — Verificación funcional y traza de criterios (incl. P-04)
- [ ] Hecha
- **Depende de:** T-CORE-04 a T-CORE-09.
- **Traza:** plan §3 (P-04) y §4; CORE-01 §7 criterios 1–8.
- **Entrada:** todas las tareas anteriores.
- **Salida:** matriz de verificación que cubre CORE-01 §7 criterios 1–8 y la traza de P-04 (criterios 2 y 3: sin permisos y visibilidad sin operación), registrando qué fixture/prueba valida cada criterio.
- **Hecho cuando:** criterios 1–8 verificados y trazados; el criterio 9 queda excluido (diferido).

## Verificación diferida (fuera del alcance activo)

- **C-05 (CORE-01 §7 criterio 9):** comparación visual directa con el PDF pp. 3/5/6/9. No es tarea de este corte.
- **RH-REQ-01 §10 criterio 18:** comparación visual de páginas 6–9. No es tarea de este corte (diferida junto a C-05).
