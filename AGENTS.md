# ERP MP 360

Este repositorio alojará el frontend modular del ERP; RR. HH. es el primer módulo.
Antes de cambios funcionales o de arquitectura, lee `docs/constitution.md` y la spec vigente en `docs/specs/`.
Sigue la convención de `docs/specs/README.md`; mantén una sola spec por capacidad.
Consulta `docs/Inventario_y_conciliacion_RRHH.md` para fuentes visuales y diferencias documentales.
Mantén el trabajo nuevo en este repositorio; `ERP Front.zip` es una referencia, no una fuente de requisitos.
Lee `memory.md` al retomar el trabajo y actualízalo solo después de un avance verificable. Es una bitácora de continuidad: no sustituye la constitución, las specs, los planes ni las tareas.

## Cierre de tarea y commits

- **Ninguna tarea se cierra sin commit.** Una tarea con su «Hecho cuando» cumplido y evidencia
  registrada termina con el commit que contiene ese trabajo.
- **No se inicia una tarea con el árbol sucio.** Antes de editar, `git status --porcelain` debe
  estar limpio; si hay cambios de otra tarea o de otro agente, detente y repórtalo.
- **Mensaje:** `feat(<capacidad>): <T-ID> <resumen en imperativo>`, con un cuerpo breve que
  enumere la evidencia (verificaciones ejecutadas, veredicto del reviewer, fecha).
  Tipos admitidos: `feat`, `fix`, `docs`, `chore`, `test`, `refactor`. Ámbito: la capacidad en
  minúsculas (`core-01`, `rh-req-01`) o `sdd`/`opencode` para cambios de proceso y de agentes.
  Ejemplo: `feat(core-01): T-CORE-01 andamiaje React + TypeScript + Vite`.
- **Rutas explícitas:** se commitea con `git add -- <rutas>` y nunca con `git add -A` ni
  `git add .`, para no arrastrar trabajo de otra tarea en el mismo árbol.
- **El agente llega hasta el commit y reporta su hash. El push lo hace el usuario** tras la
  verificación correspondiente. El agente no hace push, no usa `--force` y no reescribe
  commits ya publicados.
