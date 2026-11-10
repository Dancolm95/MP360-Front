---
description: SDD · Desglosar un plan aprobado en tareas verificables
agent: planner
---
Capacidad: `docs/specs/$1/`.

Lee `AGENTS.md`, `memory.md`, `docs/constitution.md`, `docs/specs/README.md`, `spec.md` y
`plan.md` de la capacidad. Si la spec o el plan no están aprobados, hay
decisiones bloqueantes abiertas, o el plan no cubre los criterios de aceptación,
detente y explica qué falta.

Escribe `docs/specs/$1/tasks.md` con tareas pequeñas, ordenadas por dependencia,
y checkboxes. Cada tarea indica los criterios de aceptación o reglas que cubre,
archivos o responsabilidades previstas y un «Hecho cuando» verificable con
pruebas adecuadas al stack que se haya decidido. Incluye estados de error,
sin permisos, accesibilidad e inspección visual donde correspondan. No empieces
la implementación.
