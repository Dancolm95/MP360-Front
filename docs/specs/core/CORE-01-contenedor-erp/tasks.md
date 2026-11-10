# Tareas — Contenedor ERP compartido (CORE-01)

**Spec:** CORE-01 v0.6 (aprobada funcionalmente el 10-nov-2026).  
**Plan:** [`plan.md`](plan.md) v1.0 (aprobado técnicamente el 10-nov-2026).  
**Estado del corte:** sin tareas iniciadas; ninguna tarea marcada como hecha.  
**Alcance activo:** CORE-01 §7 criterios 1–8.  
**Diferido (fuera del alcance activo):** C-05 (CORE-01 §7 criterio 9) y RH-REQ-01 §10 criterio 18 (verificación diferida junto a C-05).

## Convenciones

- IDs estables `T-CORE-xx`.
- Cada tarea cita criterios de aceptación (CORE-01 §7) y secciones del plan.
- **Entrada** = insumos; **Salida** = artefactos verificables; **Hecho cuando** = criterio de verificación demostrable.
- No se fijan URLs, endpoints ni payloads. Los mocks respetan los contratos y son distinguibles de operaciones reales (sin autorización ni persistencia falsas).

## Fase A — Andamiaje y contratos base

### T-CORE-01 — Andamiaje del proyecto React + TypeScript (Vite)
- **Depende de:** — (primera tarea).
- **Traza:** constitución §Arquitectura; plan §1; decisión técnica (React + TS + Vite).
- **Entrada:** decisión técnica de stack aprobada (10-nov-2026).
- **Salida:** proyecto React + TypeScript (Vite) compilable, con estructura base que separa contenedor/común de módulos.
- **Hecho cuando:** el proyecto instala dependencias, compila y arranca sin errores; la estructura de carpetas separa contenedor/común de módulos.

### T-CORE-02 — Contratos TypeScript del contenedor (puertos)
- **Depende de:** T-CORE-01.
- **Traza:** plan §2 (C-01, C-03, C-04, C-02); CORE-01 §3 y §4.
- **Entrada:** decisiones funcionales de C-01/C-02/C-03/C-04 (plan §2).
- **Salida:** contratos tipados (sesión/contexto/capacidades, catálogo de secciones, rutas lógicas, salida) sin fijar URLs ni payloads.
- **Hecho cuando:** los contratos compilan y representan responsabilidades y entradas/salidas de plan §2, sin dependencias de endpoints concretos.

### T-CORE-03 — Adaptadores mock de contrato del contenedor (fixtures)
- **Depende de:** T-CORE-02.
- **Traza:** plan §2 y §3 (P-04); decisión técnica (mocks de contrato).
- **Entrada:** contratos de T-CORE-02.
- **Salida:** fixtures parametrizables por capacidades: sesión válida con/sin lectura UX-02, catálogo con secciones implementadas/no implementadas y visibilidad, expiración/terminación, y salida. Distinguibles de operaciones reales; sin autorización ni persistencia falsas; sin datos sensibles en `localStorage`.
- **Hecho cuando:** cada escenario de CORE-01 §5/§7 se puede inyectar por fixture; la parametrización es por capacidad, no por nombre de rol ni etiqueta del PDF.

## Fase B — Contenedor

### T-CORE-04 — Cabecera, identidad y selector de módulos
- **Depende de:** T-CORE-03.
- **Traza:** CORE-01 §7 criterios 1, 2, 3, 8; plan §2.1 y §2.2.
- **Entrada:** contratos y fixtures de contexto/capacidades/catálogo.
- **Salida:** cabecera con marca ERP e identidad/contexto solo si se reciben y pueden mostrarse; navegación horizontal; selector que muestra solo RR. HH. con lectura UX-02; indicación de módulo/sección activa; sin identidad de ejemplo.
- **Hecho cuando:** criterios 1 y 2 observables con fixtures (con y sin UX-02); navegación operable por teclado con activo identificable (criterio 8).

### T-CORE-05 — Estados de sesión/contexto y limpieza ante vencimiento/terminación
- **Depende de:** T-CORE-03, T-CORE-04.
- **Traza:** CORE-01 §5; §7 criterios 5 y 6; plan §2.1 (C-01).
- **Entrada:** fixtures de carga/error/vencimiento/terminación.
- **Salida:** estados de carga y error (con reintento si procede) sin mostrar datos previos como vigentes; ante vencimiento o terminación externa, limpieza inmediata de identidad/contexto/capacidades/filtros/contexto de bandeja y toda persistencia de sesión; indicación de recuperación por proveedor, sin login local.
- **Hecho cuando:** criterios 5 y 6 verificables; nueva autenticación no hereda estado; sin datos sensibles en `localStorage`.

### T-CORE-06 — Acción «Salir» (C-02)
- **Depende de:** T-CORE-05.
- **Traza:** CORE-01 §7 criterios 6 y 7; plan §2.4.
- **Entrada:** contrato de salida de T-CORE-02 y fixtures.
- **Salida:** acción «Salir» que inicia el cierre de la sesión real en el proveedor; al terminar limpia estado/contexto local; destino de confirmación y manejo de errores del proveedor conforme a lo concretado en esta tarea (sin fijar endpoint/URL).
- **Hecho cuando:** criterio 7 verificable (cierre real → limpieza); un error del proveedor conserva el estado y explica cómo continuar.

### T-CORE-07 — Entrada a RR. HH., retorno y «Próximamente» (C-03/C-04)
- **Depende de:** T-CORE-04, T-CORE-05.
- **Traza:** CORE-01 §4; §7 criterios 1, 2, 3; plan §2.2 y §2.3.
- **Entrada:** fixtures de catálogo y capacidades.
- **Salida:** entrada a RR. HH. → Requerimientos (bandeja) sin dashboard; secciones no implementadas solo con visibilidad explícita del backend → «Próximamente» informativo con regreso autorizado; destinos directos validan sesión y autorización; destinos desconocidos no se convierten en «Próximamente» ni vista ficticia; sin lectura UX-02 todo acceso RR. HH. se deniega sin datos.
- **Hecho cuando:** criterios 1, 2 y 3 verificables; la visibilidad sola no opera ni accede a vistas inexistentes.

### T-CORE-08 — Accesibilidad del contenedor
- **Depende de:** T-CORE-04, T-CORE-05, T-CORE-06, T-CORE-07.
- **Traza:** CORE-01 §5; §7 criterio 8.
- **Entrada:** vistas del contenedor implementadas.
- **Salida:** operación por teclado, foco visible y gestionado en cambios de vista/pérdida de sesión, nombres accesibles, activo identificable y mensajes por texto (no solo color).
- **Hecho cuando:** criterio 8 verificable en selector, navegación, estados informativos y «Salir».

### T-CORE-09 — Integración con UX-02/03/04 sin alterar el dominio (con RH-REQ-01)
- **Depende de:** T-CORE-07 y de las tareas de RH-REQ-01 (vistas UX-02/03/04).
- **Traza:** CORE-01 §7 criterio 4; plan §4.1 criterio 4.
- **Entrada:** vistas de Requerimientos de RH-REQ-01 en la zona central.
- **Salida:** UX-02/03/04 funcionan en la zona central sin alterar navegación/retorno de bandeja, filtros ni acciones de RH-REQ-01; la alerta real de plazo permanece visible sin panel derecho.
- **Hecho cuando:** criterio 4 verificable de forma conjunta con el plan de RH-REQ-01.

## Fase C — Verificación y traza

### T-CORE-10 — Verificación funcional y traza de criterios (incl. P-04)
- **Depende de:** T-CORE-04 a T-CORE-09.
- **Traza:** plan §3 (P-04) y §4; CORE-01 §7 criterios 1–8.
- **Entrada:** todas las tareas anteriores.
- **Salida:** matriz de verificación que cubre CORE-01 §7 criterios 1–8 y la traza de P-04 (criterios 2 y 3: sin permisos y visibilidad sin operación), registrando qué fixture/prueba valida cada criterio.
- **Hecho cuando:** criterios 1–8 verificados y trazados; el criterio 9 queda excluido (diferido).

## Verificación diferida (fuera del alcance activo)

- **C-05 (CORE-01 §7 criterio 9):** comparación visual directa con el PDF pp. 3/5/6/9. No es tarea de este corte.
- **RH-REQ-01 §10 criterio 18:** comparación visual de páginas 6–9. No es tarea de este corte (diferida junto a C-05).
