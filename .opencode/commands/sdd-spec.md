---
description: SDD · Elaborar o revisar la spec de una capacidad
agent: planner
---
Capacidad: `docs/specs/$1/`. Contexto adicional del usuario: $2

Lee primero `AGENTS.md`, `memory.md`, `docs/constitution.md`, `docs/specs/README.md` y,
si es RR. HH., `docs/Inventario_y_conciliacion_RRHH.md`. Comprueba si ya existe
`docs/specs/$1/spec.md`: es la única spec vigente de esa capacidad; revísala
en lugar de crear una versión paralela. Consulta las fuentes citadas cuando
estén disponibles y señala las que no puedas verificar.

Pregunta al usuario por decisiones funcionales pendientes que afecten al corte,
sin convertirlas en supuestos. Cuando haya información suficiente, redacta o
actualiza `spec.md` con objetivo, alcance y exclusiones, actores/capacidades,
reglas y estados, vistas, criterios de aceptación verificables, trazabilidad
de fuentes y dudas abiertas. Conserva explícito el estado de borrador hasta que
el usuario o el responsable funcional confirme su aprobación. No generes
`plan.md`, `tasks.md` ni código en este paso.
