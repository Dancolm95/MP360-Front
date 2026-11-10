---
description: SDD · Implementar una sola tarea aprobada
agent: implementer
---
Capacidad: `docs/specs/$1/`. Tarea: $2

Lee `AGENTS.md`, `memory.md`, `docs/constitution.md`, `docs/specs/README.md` y `spec.md`,
`plan.md`, `tasks.md` de la capacidad. Comprueba que la spec y el plan estén
aprobados y que la tarea indicada exista, esté pendiente y no dependa de
trabajos incompletos. Si falta alguna condición, para y explica por qué.

Implementa SOLO esa tarea conforme a los criterios trazados. Añade o ajusta
pruebas pertinentes y ejecútalas con las herramientas realmente adoptadas en
el plan; no asumas `node --test` ni un framework. Verifica los estados y la
comparación visual si aplican. Marca la tarea como hecha únicamente si su
«Hecho cuando» se cumple y hay evidencia; de lo contrario, déjala pendiente
y comunica el bloqueo. No avances a la tarea siguiente.
