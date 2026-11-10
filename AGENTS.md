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

## Ramas y merges

- **`main` solo contiene trabajo verificado:** lo que ya pasó el veredicto del reviewer, más
  cambios de documentación y de proceso.
- **Una rama por tarea de código:** `task/<capacidad>-<T-ID en minúsculas>` (`T-CORE-02` →
  `task/core-01-t02`; `T-RH-05` → `task/rh-req-01-t05`), creada desde `main` limpio y
  sincronizado (`git switch main && git pull --ff-only`).
- **El agente implementa y commitea en esa rama.** No cambia de rama, no mergea y no hace
  push. Si la rama pertenece a otra tarea, se detiene.
- **El merge a `main` lo hace el usuario, solo tras `APROBADO`, y en lineal:**
  `git merge --ff-only task/<...>`. Si el veredicto es `CAMBIOS NECESARIOS`, se corrige en la
  misma rama y se repite la validación; nunca se publica a medias.
- **Documentación, proceso y agentes** (`.opencode/`, `AGENTS.md`, `memory.md`) van directos
  en `main` con su propio commit.
- **Dos tareas en paralelo exigen dos worktrees** (`git worktree add`), no dos ramas en la
  misma carpeta.
