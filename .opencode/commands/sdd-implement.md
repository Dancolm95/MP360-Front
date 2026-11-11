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

Antes de editar, ejecuta `git status --porcelain`: si hay cambios sin commitear
de otra tarea, detente y repórtalo sin tocarlos. Al cerrar, commitea solo los
archivos de la tarea con `git add -- <rutas>` (nunca `git add -A`) y el mensaje
`feat(<capacidad>): <T-ID> <resumen en imperativo>` con cuerpo de evidencia.
Reporta el hash y deja el árbol limpio. No hagas push: lo hace el usuario tras
verificar.

Comenta solo lo puntual y no obvio: decisiones, motivos, invariantes o advertencias. No repitas
en prosa lo que el código ya dice ni añadas cabeceras de bloque por defecto.

Trabaja en la rama `task/<capacidad>-<T-ID>`: si estás en `main`, créala con
`git switch -c` desde un árbol limpio; si ya existe para esa misma tarea, continúa en
ella. No cambies a otra rama, no mergees y no hagas push: el merge y el push los hace
el usuario tras la validación.
