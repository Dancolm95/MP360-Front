---
description: SDD · Plan técnico para una spec aprobada
agent: planner
---
Capacidad: `docs/specs/$1/`.

Lee `AGENTS.md`, `memory.md`, `docs/constitution.md`, `docs/specs/README.md`, la spec vigente
y, para RR. HH., `docs/Inventario_y_conciliacion_RRHH.md`. Comprueba que la
spec esté aprobada y que las dudas que afectan al corte estén resueltas o
explícitamente fuera de alcance. Si no lo están, detente: explica el bloqueo
sin crear el plan.

Escribe `docs/specs/$1/plan.md`: componentes y responsabilidades; contratos
de datos, capacidades y adaptadores acordados o provisionales identificados
como tales; integración con capacidades compartidas del ERP; estados de
interfaz, manejo de errores y accesibilidad; archivos previstos, decisiones
técnicas justificadas y estrategia de pruebas y comparación visual. Vincula
cada parte con los criterios de aceptación y fuentes de `spec.md`. No deduzcas
stack, rutas de API o permisos de la maqueta. No escribas código ni `tasks.md`.
