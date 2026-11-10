---
description: SDD · Llevar una rama de tarea a main en lineal, sin push
---
Rama de la tarea: `$1` (por ejemplo, `task/core-01-t02`).

Ejecuta solo estos pasos, en orden, y detente en el primero que falle:

1. `git status --porcelain`. Si devuelve algo, para: hay cambios sin commitear.
2. `git rev-parse --verify "$1"`. Si la rama no existe, para e indícalo.
3. `git log --oneline main.."$1"` y `git diff --stat main..."$1"`. Si no hay commits por
   delante de `main`, para. Muestra rama, commits y archivos afectados.
4. `git switch main` y `git merge --ff-only "$1"`. Si el merge falla, no lo fuerces ni
   cambies de estrategia: informa y deja el árbol como estaba.
5. `git status -sb` y `git log --oneline -3`. Informa del resultado y recuerda que el push
   lo hace el usuario.

No ejecutes `git push`, `git fetch`, `git pull`, `--force`, `--no-ff`, `--squash` ni
`git branch -d`. No decidas si el trabajo está aprobado: eso lo confirma el usuario.
