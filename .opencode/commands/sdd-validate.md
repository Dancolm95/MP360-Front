---
description: SDD · Auditar cumplimiento de una spec sin corregir código
agent: reviewer
---
Capacidad: `docs/specs/$1/`.

Lee `AGENTS.md`, `memory.md`, `docs/constitution.md`, `docs/specs/README.md` y `spec.md`,
`plan.md`, `tasks.md` que existan; para RR. HH., también
`docs/Inventario_y_conciliacion_RRHH.md`. Si faltan plan, tareas o
implementación, indica que aún no es posible dar un veredicto de entrega.

Para cada criterio de aceptación, relaciona regla, vista UX y página visual
cuando apliquen, prueba o evidencia y resultado. Ejecuta las pruebas disponibles
si el entorno lo permite; informa con claridad de comprobaciones no realizadas.
Revisa permisos, persistencia real, carga/vacío/error, accesibilidad y
comparación con el PDF sin tratar datos de ejemplo como reglas. Devuelve
«Cumplida», «No cumplida» o «No verificable» con bloqueos concretos. No edites
archivos ni corrijas defectos en este comando.
Señala el exceso de comentarios como hallazgo no bloqueante; solo es bloqueante si contradice
el código o induce a error.
