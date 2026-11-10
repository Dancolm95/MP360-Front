# Memoria operativa — ERP MP 360

> Bitácora breve para retomar el trabajo. No es fuente de requisitos ni reemplaza
> `docs/constitution.md`, `docs/specs/`, sus fuentes o el estado de `tasks.md`.

## Estado actual

- Fecha de actualización: 10 de noviembre de 2026.
- Fase general: definición por especificaciones; todavía no hay aplicación implementada.
- Primera capacidad: `RH-REQ-01`, Requerimientos de personal.
- Spec vigente: `docs/specs/rrhh/RH-REQ-01-requerimientos/spec.md`, versión 0.7 con las cuatro decisiones funcionales de integración Selección/Alta (INT-01) y las correcciones B-01 a B-04 y H-01 a H-03; **aprobada funcionalmente** por confirmación explícita del usuario el 10 de noviembre de 2026, tras revisión QA con veredicto APROBADO. La v0.4 fue aprobada el 9 de noviembre de 2026; esa aprobación es histórica.
- `CORE-01` v0.6 incorpora la salida voluntaria (C-02) y la resolución/exclusión de los bloqueos del corte (C-01/C-03/C-04 al plan, C-05 diferido); **aprobada funcionalmente** por confirmación explícita del usuario el 10 de noviembre de 2026, tras veredicto APROBADO del reviewer. La v0.5 fue aprobada el mismo día y es histórica. Sin aprobación de contratos, visual, arquitectura técnica ni plan.
- Aún no existen `plan.md` ni `tasks.md` para esta capacidad.
- Corte propuesto: contenedor ERP compartido + UX-02, UX-03 y UX-04.

## Decisiones vigentes

- La jerarquía de fuentes y las reglas transversales están en `docs/constitution.md`.
- El PDF gobierna la composición visual; sus datos de ejemplo no son requisitos.
- El frontend será modular y RR. HH. será el primer módulo.
- Las specs se organizan por capacidad conforme a `docs/specs/README.md`.
- El flujo SDD de OpenCode dispone de coordinator, planner, implementer y reviewer en `.opencode/agents/`, y de comandos `/sdd-*` en `.opencode/commands/`.

## Bloqueos y pendientes

- P-01, P-02 y P-03 están funcionalmente resueltos en la spec v0.7 (sin cambios respecto a la v0.4 aprobada).
- P-04 dispone de contrato provisional autorizado, pero la política/matriz técnica final de ámbitos y permisos continúa como dependencia externa; las decisiones de INT-01 no la modifican.
- INT-01 quedó funcionalmente resuelto en la v0.7 con cuatro decisiones expresas del usuario el 9 de noviembre de 2026: RR. HH. inicia «Abrir proceso en Selección» desde un requerimiento Aprobado, sin cambio optimista, con error reintentable y permanencia en Aprobado hasta la confirmación; primer día real registrado por Alta, mostrado en solo lectura y consumido solo para cobertura, sin alterar fecha objetivo ni plazos; reversión de cobertura originada por evento auditado de Selección, con solicitud motivada de RR. HH., contadores sin cambio hasta la confirmación y reintento ante rechazo o fallo; Alta mantiene >0 sin excepción y no confirma el ingreso con `0.00` de Practicante hasta ajustar el importe con trazabilidad, sin editar el requerimiento aprobado. Quedan sus contratos técnicos para el plan.
- CORE-01 v0.6 está en `docs/specs/core/CORE-01-contenedor-erp/spec.md`, aprobada funcionalmente el 10 de noviembre de 2026. Bloqueos del corte resueltos o excluidos expresamente: C-01/C-03/C-04 con contrato técnico a definir en el plan; C-02 (salida voluntaria) incluido como requisito con contrato técnico para el plan; C-05 (QA visual del PDF) excluido del corte como verificación diferida; P-04 se mantiene con contrato provisional y matriz final externa. Ya no hay bloqueos funcionales para planificar.
- RH-REQ-01 v0.7 y CORE-01 v0.6 están aprobadas funcionalmente e independientemente el 10 de noviembre de 2026; esa aprobación no cubre contratos técnicos, P-04, stack ni QA visual.
- UX/UI V1.2 fue verificada directamente mediante exportación de texto; su contraste para UX-02/03/04, §8 y §12 está incorporado en la spec v0.7. Ya no hay bloqueo de acceso para esta revisión.

## Última verificación

- Se comprobó que OpenCode v2.2.5 está disponible.
- Se verificó la presencia y asociación de los agentes y comandos SDD.
- RH-REQ-01 v0.4 recibió revisión QA independiente con veredicto APROBADO; el usuario confirmó explícitamente «Sí, aprobar v0.4» el 9 de noviembre de 2026. Esta aprobación es solo funcional para RH-REQ-01, no para `core` ni para planificar el corte conjunto.
- Se verificaron directamente UX/UI V1.2 (UX-02/03/04, §8 y §12) y Definición Funcional V2.2 §6.3. Las diferencias sobre remuneración y plazo previo a aprobación se concilian en la spec sin extender la excepción de Practicante a UX-07/Alta; el PDF sigue siendo referencia visual, no regla.
- No hay pruebas de aplicación que ejecutar porque aún no existe implementación.
- Se consultó directamente la exportación de texto UX/UI V1.2 para core. El enlace PDF abrió el visor, pero no permitió cotejo directo de páginas con las herramientas disponibles; la referencia de páginas del borrador procede del inventario.
- CORE-01 v0.2 incorpora las decisiones transmitidas tras QA sobre entrada condicionada a lectura UX-02, visibilidad explícita de «Próximamente» y limpieza de sesión/contexto al vencer o terminar externamente, sin alterar RH-REQ-01.
- El reviewer dio APROBADO para solicitar aprobación funcional de CORE-01 v0.2 y el usuario confirmó explícitamente «Sí, aprobar v0.2» el 9 de noviembre de 2026. Solo queda aprobada funcionalmente esta spec; no los contratos, el contraste visual ni la arquitectura técnica.
- RH-REQ-01 v0.7 incorpora las cuatro decisiones funcionales de INT-01 y las correcciones de dos ciclos (B-01 a B-04, S-02 a S-04, H-01 a H-03) sin fijar eventos, payloads, URLs ni stack. CORE-01 v0.5 solo actualiza referencias, la fila INT-01 de §8 y la atribución de contratos, sin alterar su alcance funcional. Ninguna de las dos queda aprobada.
- El reviewer auditó CORE-01 v0.6 con veredicto APROBADO y el usuario confirmó explícitamente «Sí, aprobar v0.6» el 10 de noviembre de 2026. Ambas specs (RH-REQ-01 v0.7 y CORE-01 v0.6) quedan aprobadas funcionalmente y los bloqueos del corte resueltos o excluidos. No existen `plan.md` ni `tasks.md`.

## Próximo paso

Generar `plan.md` desde las specs aprobadas (RH-REQ-01 v0.7 y CORE-01 v0.6), definiendo en el plan los contratos técnicos C-01/C-02/C-03/C-04, la integración INT-01 y la traza P-04 con contrato provisional, sin prejuzgar si el plan es conjunto o desdoblado. `tasks.md` solo tras plan aprobado técnicamente.

## Regla de actualización

Actualizar esta memoria al aprobar una fase SDD, cerrar una tarea con evidencia, cambiar un bloqueo o modificar el siguiente paso. Registrar solo hechos comprobados; mantener el detalle y los requisitos en sus documentos de origen.
