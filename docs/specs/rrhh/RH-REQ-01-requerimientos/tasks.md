# Tareas — Requerimientos de personal (RH-REQ-01)

**Spec:** RH-REQ-01 v0.7 (aprobada funcionalmente el 10-nov-2026).  
**Plan:** [`plan.md`](plan.md) v1.2 (**aprobado técnicamente el 10-nov-2026**; cambio de stack a Next.js). La v1.1 (React + TypeScript + Vite) fue aprobada técnicamente el 10-nov-2026 y es histórica.  
**Estado del corte:** **T-RH-01 y T-RH-02 están cerradas e integradas en `main`; T-RH-03 está cerrada en su rama de tarea y pendiente de revisión/merge por el usuario**. T-RH-02 se integró por fast-forward el 12-nov-2026 (`2088eb6` + `694fad3` + `b9060ee`; rama `task/rh-req-01-t02`; reviewer **APROBADO** tras dos ciclos de corrección, sin hallazgos bloqueantes). La base compartida del contenedor hasta **T-CORE-08** también está cerrada y en `main`. T-RH-04…24 permanecen sin iniciar. **T-CORE-09** (integración con UX-02/03/04 sin alterar el dominio) sigue **bloqueada** hasta que existan las vistas UX-02/03/04 de RH-REQ-01 (T-RH-05…14).
**Alcance activo:** RH-REQ-01 §10 criterios 1–17 y 19–27.  
**Diferido (fuera del alcance activo):** RH-REQ-01 §10 criterio 18 y C-05 (verificación diferida).

## Convenciones

- IDs estables `T-RH-xx`.
- Cada tarea cita criterios de aceptación (RH-REQ-01 §10) y secciones del plan.
- **Entrada** = insumos; **Salida** = artefactos verificables; **Hecho cuando** = criterio de verificación demostrable.
- No se fijan URLs, endpoints ni payloads. Los mocks respetan los contratos y son distinguibles de operaciones reales (sin autorización ni persistencia falsas).
- **Límite de evidencia con mocks:** las pruebas con fixtures demuestran el contrato y los estados de interfaz, no la integración real con el proveedor. La verificación contra servicios reales queda pendiente hasta disponer de ellos.

## Fase A — Andamiaje y contratos base

### T-RH-01 — Andamiaje del módulo RR. HH. sobre la base Next.js
- [x] Hecha — Evidencia (**11-nov-2026**, bajo **Node v24.21.0 LTS** y pnpm 12.14.0): estructura de carpetas del dominio Requerimientos integrada con el contenedor, con 10 archivos nuevos (+13) y barriles `index.ts` vacíos bajo `src/modules/rrhh/requerimientos/` (subcarpetas `contracts/`, `fixtures/`, `model/`, `tray/`, `form/`, `detail/`, `deadlines/`, `state/`, `integration/` y raíz), alineados con las fases de `tasks.md` y el `plan.md` §2; sin lógica de dominio y sin tocar la frontera preexistente (`src/modules/rrhh/index.ts`, `identifiers.ts`, `RrhhContainer.tsx`, `RrhhContainer.test.tsx`). `pnpm install --frozen-lockfile` OK, `pnpm test` **10 archivos / 71 pruebas** OK, `pnpm build` OK, `pnpm exec tsc --noEmit` exit 0 y árbol limpio. Commit `f2929a73c1ff4236fbd770b083cce27296559147` en `task/rh-req-01-t01`, integrado en `main` por fast-forward. **Veredicto del reviewer: APROBADO**, sin hallazgos bloqueantes. Hallazgos no bloqueantes: (1) comentarios de fase en los 10 barriles (precisos y trazables; opcional vaciarlos); (2) test flaky preexistente de foco en `RrhhContainer.test.tsx:83` (carrera entre `findByRole` y `useFocusOnMount`), perteneciente al contenedor (T-CORE-08), ajeno a T-RH-01.
- **Depende de:** T-CORE-11 (base Next.js del contenedor; sustituye al andamiaje Vite de T-CORE-01).
- **Traza:** constitución §Arquitectura; CORE-01 plan §6 «Revisión de stack» y §5 «Aprobadas el 10-nov-2026 (v1.2)» (stack).
- **Entrada:** base Next.js de CORE-01 (T-CORE-11).
- **Salida:** estructura de carpetas del dominio Requerimientos integrada con el contenedor.
- **Hecho cuando:** el módulo compila junto al contenedor sin errores.

### T-RH-02 — Contratos TypeScript del dominio Requerimientos
- [x] Hecha — Evidencia (**12-nov-2026**, **Node 24 LTS** y pnpm 12.14.0): 15 archivos bajo `src/modules/rrhh/requerimientos/**` (+1537/−3) definen contratos TypeScript para catálogos, jerarquías, calendario, bandeja filtrada/ordenada/paginada, detalle/historial, plazos, comandos versionados, capacidades por registro y de bandeja, creación e INT-01, sin URLs, endpoints, payloads, roles ni datos ficticios. El contenido revisado viaja en envío/reenvío y se persiste al enviar; la lectura de candidatos de Selección queda fuera de esta tarea y diferida a T-RH-11; cancelar un Borrador incompleto conserva sus datos parciales sin inventar campos. `pnpm install --frozen-lockfile` OK, `pnpm test` **11 archivos / 94 pruebas** OK, `pnpm build` OK, `pnpm exec tsc --noEmit` OK y `git diff --check` OK, con árbol limpio. Commits `2088eb610058290b09c863f48d37bbda9b437197`, `694fad32407f117a46b01b8cf2ae46fb3e752145` y `b9060ee6e5fab8fb7c90b1a153495063ac1f7171` en `task/rh-req-01-t02`, integrados en `main` por fast-forward. **Veredicto final del reviewer: APROBADO**, sin hallazgos bloqueantes, después de dos ciclos de corrección.
- **Depende de:** T-RH-01, T-CORE-02.
- **Traza:** RH-REQ-01 §9; plan §2.
- **Entrada:** reglas funcionales de §4–§7 y §9.
- **Salida:** contratos tipados de catálogos/jerarquías/calendario, consulta filtrada/ordenada/paginada, detalle/historial, comandos versionados, capacidades por registro e integración INT-01; sin fijar URLs ni payloads.
- **Hecho cuando:** los contratos compilan y representan las responsabilidades y casos límite del plan §2, sin endpoints concretos.

### T-RH-03 — Adaptadores mock de contrato del dominio (fixtures)
- [x] Hecha — Evidencia (**12-nov-2026**, bajo **Node v24.21.0 LTS** y pnpm 12.14.0): adaptadores `kind: 'mock'` para catálogos, bandeja, detalle/historial, los diez comandos, navegación a Selección y paquete de fixture parametrizado por `Capability` y acciones efectivas, con resultados configurados y trazas aisladas; sin autorización, persistencia, red, rutas ni temporizadores. Los builders cubren lectura, escritura, creación/borrador incompleto, guardado por estado, Cancelado parcial e INT-01 (apertura idempotente/fallo, reversión y datos de Alta de solo lectura). Prueba enfocada **1 archivo / 21 pruebas**, suite completa **12 archivos / 115 pruebas**, `pnpm build`, `pnpm exec tsc --noEmit` y `git diff --check` OK. Evidencia con mocks no demuestra integración real. Rama `task/rh-req-01-t03`; commit consignado al cierre.
- **Depende de:** T-RH-02.
- **Traza:** plan §2 y §3 (P-04); decisión técnica (mocks).
- **Entrada:** contratos de T-RH-02.
- **Salida:** fixtures parametrizables por capacidades (catálogos, requerimientos, historial, comandos versionados, Selección/Alta), distinguibles de operaciones reales, sin autorización ni persistencia falsas.
- **Hecho cuando:** los escenarios de §10 se pueden inyectar por fixture; la parametrización es por capacidad, no por nombre de rol.

## Fase B — Datos y validaciones

### T-RH-04 — Modelo de datos y validaciones de formulario
- [ ] Hecha
- **Depende de:** T-RH-02.
- **Traza:** RH-REQ-01 §4; §10 criterio 3.
- **Entrada:** reglas de §4.
- **Salida:** campos y validaciones (obligatorios; jerarquías; colaborador a reemplazar solo si Motivo = Reemplazo; clasificación derivada; vacantes entero ≥ 1; remuneración PEN ≥ 0 con máx. dos decimales y excepción `0.00` solo Practicante).
- **Hecho cuando:** criterio 3 verificable (rechazos por vacantes/remuneración; `0.00` solo Practicante).

## Fase C — UX-02 Bandeja

### T-RH-05 — Bandeja UX-02: filtros, columnas, orden y paginación
- [ ] Hecha
- **Depende de:** T-RH-03, T-RH-04.
- **Traza:** RH-REQ-01 §7.1; §10 criterio 13.
- **Entrada:** contrato de consulta filtrada/ordenada/paginada.
- **Salida:** filtros (Estado, Motivo, Empresa, Área/Subárea, Puesto, Solicitante y periodo por fecha de aprobación); columnas; orden inicial creación descendente con ID como desempate; columnas ordenables con ausentes al final; paginación/total; responsable o «Sin asignar»; estado distinto de alerta.
- **Hecho cuando:** criterio 13 verificable.

### T-RH-06 — Persistencia intra-sesión de filtros y apertura de fila con contexto
- [ ] Hecha
- **Depende de:** T-RH-05.
- **Traza:** RH-REQ-01 §7.1; §10 criterios 14, 22 y 23.
- **Entrada:** bandeja de T-RH-05.
- **Salida:** filtros que sobreviven a navegación/recarga dentro de la sesión y se limpian al cerrar sesión, sin datos sensibles en `localStorage`; la fila abre su detalle por teclado e interacción; la entrada y el regreso conservan el contexto.
- **Hecho cuando:** criterios 14, 22 y 23 verificables.

### T-RH-07 — Acciones por capacidades y estados de interfaz de la bandeja
- [ ] Hecha
- **Depende de:** T-RH-05.
- **Traza:** RH-REQ-01 §7.1 y §8; §10 criterios 15 y 16.
- **Entrada:** capacidades por registro.
- **Salida:** Nuevo/Detalle/Editar/Cancelar según capacidades; estados de carga, vacío, sin resultados, error recuperable, sin permisos, conflicto y éxito persistido.
- **Hecho cuando:** criterios 15 y 16 verificables (sin capacidad no se ve la acción; el intento directo es rechazado por backend; los registros vienen limitados por ámbito).

## Fase D — UX-03 Crear/editar/revisar/enviar

### T-RH-08 — Formulario crear/editar UX-03
- [ ] Hecha
- **Depende de:** T-RH-04.
- **Traza:** RH-REQ-01 §7.2; §10 criterio 24.
- **Entrada:** modelo y validaciones de T-RH-04.
- **Salida:** formulario con jerarquías y limpieza de dependencias, colaborador a reemplazar condicional, clasificación/plazo derivados, ubicación y comentario obligatorio; duración (no fecha objetivo) antes de aprobar, con aviso.
- **Hecho cuando:** criterio 24 verificable (sin fecha objetivo definitiva antes de aprobar).

### T-RH-09 — Revisión y envío
- [ ] Hecha
- **Depende de:** T-RH-08.
- **Traza:** RH-REQ-01 §7.2; §10 criterios 1 y 2.
- **Entrada:** formulario.
- **Salida:** «Revisión y envío» con todos los datos y errores; «Volver a editar» conserva valores no persistidos; «Guardar borrador» exige persistencia real; envío/reenvío solo desde revisión; confirmación posterior con ID/resumen/responsable/estado.
- **Hecho cuando:** criterios 1 y 2 verificables contra el adaptador mock; la persistencia real en backend no se demuestra con fixtures y queda pendiente hasta disponer de servicios reales.

### T-RH-10 — Cancelar edición y comentario de observación
- [ ] Hecha
- **Depende de:** T-RH-08.
- **Traza:** RH-REQ-01 §7.2; §10 criterios 20 y 21.
- **Entrada:** formulario.
- **Salida:** «Cancelar edición» con confirmación de descarte (aceptar vuelve sin persistir; rechazar conserva valores), distinto de «Guardar borrador» y de «Cancelar requerimiento»; en Observado, comentario visible antes de corregir.
- **Hecho cuando:** criterios 20 y 21 verificables.

## Fase E — UX-04 Detalle y aprobación

### T-RH-11 — Detalle UX-04 (resumen, cobertura, plazo, alertas, historial)
- [ ] Hecha
- **Depende de:** T-RH-03.
- **Traza:** RH-REQ-01 §7.3; §10 criterios 13 (cobertura) y 19.
- **Entrada:** contrato de detalle/historial.
- **Salida:** resumen en lectura, remuneración, solicitadas/cubiertas/pendientes, plazo, alertas e historial con usuario, fecha/hora, acción, estado anterior/nuevo y comentario.
- **Hecho cuando:** criterio 19 y la parte de cobertura del criterio 13 verificables.

### T-RH-12 — Aprobar/Observar/Cancelar y fijación de plazo administrativo
- [ ] Hecha
- **Observación heredada de T-RH-02 (no bloqueante):** los comandos tipados de fijar/ajustar plazo reciben `diasHabiles: number`, mientras el valor persistido expresa el rango 15–30; verificar aquí que la validación y la revalidación del backend rechacen valores fuera del rango, sin ampliar el contrato funcional.
- **Depende de:** T-RH-11.
- **Traza:** RH-REQ-01 §7.3; §10 criterios 4 y 6.
- **Entrada:** detalle + capacidades.
- **Salida:** Aprobar/Observar/Cancelar por estado y capacidades (Observar exige comentario; cancelar exige confirmación y causal); RR. HH. fija el plazo para un administrativo pendiente; la aprobación rechaza la ausencia o invalidez de ese plazo.
- **Hecho cuando:** criterios 4 y 6 verificables.

### T-RH-13 — Ajuste auditado del plazo administrativo
- [ ] Hecha
- **Depende de:** T-RH-11.
- **Traza:** RH-REQ-01 §5.1 y §7.3; §10 criterios 6 y 7.
- **Entrada:** detalle + reglas de §5.1.
- **Salida:** ajuste solo para Administrativo en Aprobado/En reclutamiento con motivo y rango 15–30; recálculo desde la aprobación original; historial que conserva actor, fecha/hora, motivo, valores y fechas; eventos históricos que no se borran ni se simulan como correos.
- **Hecho cuando:** criterio 7 verificable (17→20 recalcula desde la misma aprobación).

### T-RH-14 — «Volver a bandeja» con contexto
- [ ] Hecha
- **Depende de:** T-RH-11, T-RH-06.
- **Traza:** RH-REQ-01 §7.3; §10 criterio 22.
- **Entrada:** detalle + contexto de bandeja.
- **Salida:** restaura filtros, orden y página previos.
- **Hecho cuando:** criterio 22 verificable.

## Fase F — Cómputo de plazos y alertas

### T-RH-15 — Cómputo de plazos, umbrales y vencimiento
- [ ] Hecha
- **Observación heredada de T-RH-02 (no bloqueante):** cubrir el límite 15–30 cuando `diasHabiles` llega como `number`; el backend conserva la responsabilidad de revalidarlo y esta observación no cambia las reglas de §5.
- **Depende de:** T-RH-04.
- **Traza:** RH-REQ-01 §5; §10 criterios 4, 5 y 19.
- **Entrada:** calendario único y reglas de §5.
- **Salida:** día 0 = aprobación; aprobación en día no hábil → día 1 siguiente hábil; Operativo 10; Administrativo 15–30; umbrales 50/75/90 % (redondeo hacia arriba); vencimiento al iniciar el siguiente día computable; alerta ≠ vencimiento; comunicación por texto/icono además de color.
- **Hecho cuando:** criterios 4, 5 y 19 verificables.

## Fase G — Estados, transiciones y concurrencia

### T-RH-16 — Máquina de estados y transiciones
- [ ] Hecha
- **Depende de:** T-RH-15, T-RH-12.
- **Traza:** RH-REQ-01 §6; §10 criterios 8 y 10 (parcial).
- **Entrada:** reglas de §6.
- **Salida:** transiciones Borrador → Pendiente → Aprobado/Observado, En reclutamiento, Cubierto y Cancelado, con causales de cancelación.
- **Hecho cuando:** las transiciones de §6 se verifican, incluidas las condicionadas por integración (véase Fase H).

### T-RH-17 — Concurrencia versionada (comandos)
- [ ] Hecha
- **Depende de:** T-RH-16.
- **Traza:** RH-REQ-01 §6; §10 criterio 12.
- **Entrada:** comandos versionados.
- **Salida:** rechazo sin persistir de comandos sobre versión desactualizada; conserva la entrada; muestra los datos vigentes; permite nueva decisión/reintento; sin correo simulado.
- **Hecho cuando:** criterio 12 verificable para los comandos listados (editar/guardar, enviar/reenviar, fijar/ajustar plazo, abrir proceso, cancelar, solicitar reversión, aprobar, observar).

## Fase H — Integración INT-01 (Selección/Alta)

### T-RH-18 — «Abrir proceso en Selección»
- [ ] Hecha
- **Depende de:** T-RH-16.
- **Traza:** plan §2.1; §10 criterios 8 y 26.
- **Entrada:** contrato de apertura (T-RH-02).
- **Salida:** acción explícita desde el detalle de un Aprobado; sin optimismo (permanece Aprobado hasta confirmación); error reintentable; transición Aprobado → En reclutamiento solo con confirmación de Selección.
- **Hecho cuando:** criterios 8 y 26 verificables.

### T-RH-19 — Primer día real de Alta y cobertura
- [ ] Hecha
- **Depende de:** T-RH-16.
- **Traza:** plan §2.2; §10 criterio 9.
- **Entrada:** contrato de Alta (T-RH-02).
- **Salida:** primer día real en solo lectura solo para cobertura; `cubiertas` incrementa solo al confirmarse; `pendientes = solicitadas − cubiertas`; Cubierto al llegar a cero; fecha objetivo sin cambio.
- **Hecho cuando:** criterio 9 verificable.

### T-RH-20 — Reversión de cobertura
- [ ] Hecha
- **Depende de:** T-RH-19.
- **Traza:** plan §2.3; §10 criterios 10 y 27.
- **Entrada:** contrato de reversión (T-RH-02).
- **Salida:** solicitud por RR. HH. con motivo; los contadores solo cambian con el evento auditado confirmado de Selección; Cubierto → En reclutamiento; rechazo/fallo conserva e informa; solicitud y evento auditados.
- **Hecho cuando:** criterios 10 y 27 verificables.

### T-RH-21 — «Asociar candidato» (navegación)
- [ ] Hecha
- **Depende de:** T-RH-18.
- **Traza:** plan §2; §10 criterio 11.
- **Entrada:** contrato de navegación (T-RH-02).
- **Salida:** solo RR. HH. con capacidad en En reclutamiento; navega al proceso ya creado en Selección; no crea proceso ni vínculo; vínculos/desvínculos proceden de Selección.
- **Hecho cuando:** criterio 11 verificable.

### T-RH-22 — Remuneración previa al alta (solo lectura)
- [ ] Hecha
- **Depende de:** T-RH-11.
- **Traza:** plan §2.4; §10 criterio 25.
- **Entrada:** contrato del ajuste de Alta (T-RH-02).
- **Salida:** RH-REQ-01 no edita ni duplica el ajuste; si se muestra, es solo lectura; Alta no hereda la excepción `0.00` y no confirma con `0.00`; el ajuste no modifica el requerimiento aprobado.
- **Hecho cuando:** criterio 25 verificable.

## Fase I — Accesibilidad y verificación

### T-RH-23 — Accesibilidad de UX-02/03/04
- [ ] Hecha
- **Depende de:** T-RH-05 a T-RH-22 (vistas).
- **Traza:** RH-REQ-01 §8; §10 criterio 17.
- **Entrada:** vistas implementadas.
- **Salida:** flujo completo por teclado; foco, nombres, errores, orden y alertas accesibles; los diálogos gestionan el foco y lo devuelven al control que los abrió.
- **Hecho cuando:** criterio 17 verificable.

### T-RH-24 — Verificación integral y traza (incl. P-04)
- [ ] Hecha
- **Depende de:** todas las anteriores.
- **Traza:** plan §3 (P-04) y §4; RH-REQ-01 §10 criterios 1–17 y 19–27.
- **Entrada:** todas las tareas.
- **Salida:** matriz de verificación que cubre criterios 1–17 y 19–27 y la traza de P-04 (criterios 15 y 16: capacidades por registro y revalidación/ámbito).
- **Hecho cuando:** criterios verificados y trazados; el criterio 18 queda excluido (diferido).

## Verificación diferida (fuera del alcance activo)

- **RH-REQ-01 §10 criterio 18:** comparación visual de páginas 6–9 (1920 × 1080). No es tarea de este corte.
- **C-05 (CORE-01 §7 criterio 9):** comparación visual del contenedor con el PDF. No es tarea de este corte.
