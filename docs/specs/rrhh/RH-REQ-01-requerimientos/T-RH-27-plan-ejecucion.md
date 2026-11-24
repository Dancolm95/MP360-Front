# T-RH-27 — Plan de ejecución: reconciliación de la capa visual con `main`

> **Anexo de ejecución.** No es una spec ni modifica requisitos, `plan.md` ni `tasks.md`.
> Complementa la definición de T-RH-27 con el procedimiento operativo acordado con el
> usuario el 23-nov-2026. La fuente normativa sigue siendo `tasks.md` §T-RH-27.

- **Capacidad:** `rh-req-01` (RH-REQ-01 — Requerimientos)
- **Tarea:** T-RH-27 (pendiente en `tasks.md`)
- **Fuentes:** `tasks.md` §T-RH-27, `plan.md` §6 (R1–R6), `docs/Inventario_y_conciliacion_RRHH.md`, `docs/constitution.md`, `AGENTS.md`
- **Objetivo:** que la capa visual (ventanas diseñadas en `codex/rh-vis`) compile, pase la suite y conviva con la lógica cerrada de `main` (T-RH-01…22 + T-RH-25), sin perder exports, pruebas ni comportamiento aprobado, y sin cambiar requisitos ni reinterpretar vistas.

---

## 1. Estado de partida (verificado el 23-nov-2026)

| Elemento | Valor |
|---|---|
| Repositorio principal | `/Users/danielcolona/DevProjects/ERP-Front-Codex` (rama `main`, `b3e06cd`) |
| Worktree visual | `/Users/danielcolona/DevProjects/erp-rh-vis-wt` (rama `codex/rh-vis`, `aabd424`, árbol limpio) |
| Punto de divergencia | `f0807390` |
| `main` contiene | Lógica completa: `contracts/`, `model/`, `deadlines/`, `state/`, `actions/`, `transitions/`, `tray/`, `form/`, `review/`, `detail/`; T-RH-25 reorganizó y **eliminó `tray/formato.ts`** |
| `codex/rh-vis` contiene | Ventanas del PDF en `src/app/preview/requerimientos/**`, más `form/FormularioRequerimiento.tsx` (+CSS y test) y `detail/DetalleRequerimiento.tsx` (+CSS y test) |
| Precondición de T-RH-27 | **Cumplida:** el usuario confirmó que las pantallas están terminadas y commiteadas (sin pendientes en la rama) |

Regla de ramas (`AGENTS.md`): una rama por tarea, creada desde `main` limpio y sincronizado; el agente implementa y commitea en ella, **no** mergea a `main` ni hace push.

---

## 2. Inspección inicial obligatoria (antes de tocar nada)

Ejecutar en el worktree de la tarea (tras el paso 3.1):

```bash
git switch main && git pull --ff-only
git status --porcelain            # debe estar vacío
git log --oneline -3
git merge-base --is-ancestor main codex/rh-vis; echo "ancestro: $?"
```

Si `main` cambió respecto de `b3e06cd`, **re-medir** la divergencia:

```bash
git log --oneline main..codex/rh-vis | wc -l
git log --oneline codex/rh-vis..main | wc -l
git diff --name-only $(git merge-base main codex/rh-vis)..codex/rh-vis -- src/
```

Anotar los números reales en la evidencia del commit. El punto de partida registrado en T-RH-27 (18-nov-2026) era `4e0cec7`, 23 delante / 76 detrás; a la fecha de este plan la rama visual tiene **50 commits propios** y diverge en `f0807390`.

---

## 3. Procedimiento

### 3.1 Preparar worktree y rama de tarea

No se trabaja sobre `codex/rh-vis`: se deja intacta como referencia.

```bash
# desde el repositorio principal (main limpio)
git worktree add ../erp-rh-t27-wt -b task/rh-req-01-t27 main
cd ../erp-rh-t27-wt
pnpm install --frozen-lockfile
```

> Si el entorno ya tiene el worktree creado, verificar rama y limpieza antes de continuar.
> El mensaje de commit usará el ámbito `rh-req-01` y el prefijo `feat`.

### 3.2 Traer la capa visual

```bash
git merge --no-ff codex/rh-vis -m "merge: capa visual codex/rh-vis en task/rh-req-01-t27"
```

**Si hay conflictos**, resolver uno a uno con las reglas del §3.3. Nunca `git checkout --ours/--theirs` sobre archivos en conflicto: T-RH-27 exige resolución **por contenido**.

Mapa esperado de conflictos (verificado por diff de árboles `main` vs `codex/rh-vis`):

| Archivo | Tipo | Acción esperada |
|---|---|---|
| `src/modules/rrhh/requerimientos/form/FormularioRequerimiento.tsx` | add/add | Fusionar por contenido: conservar la lógica/superficie aprobada en T-RH-08 y aplicar la piel visual de la vista |
| `src/modules/rrhh/requerimientos/form/FormularioRequerimiento.test.tsx` | add/add | Conservar las pruebas de `main` (T-RH-08) **e** incorporar las de la vista que sigan siendo válidas |
| `src/modules/rrhh/requerimientos/form/index.ts` | add/add | Unión de exports; ninguno de `main` se pierde |
| `src/modules/rrhh/requerimientos/detail/index.ts` | add/add | Unión de exports; ninguno de `main` se pierde |
| `src/modules/rrhh/requerimientos/tray/BandejaRequerimientos.tsx` | modificación doble | Quedarse con la versión de `main` y portar solo la presentación visual que falte |
| `src/modules/rrhh/requerimientos/tray/filtros.ts` | modificación doble | Conservar la lógica de `main` (T-RH-05/T-RH-14); la vista no debe alterarla |
| `src/app/globals.css` | modificación doble | Unir reglas sin duplicar; las reglas de bandeja presentes en `main` (T-RH-05) se conservan |
| `package.json` / `pnpm-lock.yaml` / `vitest.config.ts` | posible diferencia | Conservar los de `main`; la vista no añade dependencias nuevas salvo justificación |
| `tray/formato.ts` | solo en la rama visual | **Eliminar** tras reapuntar todos sus imports (regla 1) |
| `detail/DetalleRequerimiento.tsx` / `.module.css` / `.test.tsx` | solo en la rama visual | Se añaden limpios; ajustar imports (§3.3.1) |
| `src/app/preview/**` | solo en la rama visual | Se añade limpio; ajustar imports (§3.3.1) |

Al terminar cada resolución: `git add -- <ruta>` (nunca `git add -A` ni `git add .`).

### 3.3 Reglas de resolución (T-RH-27 «Salida», puntos 1–5)

#### 3.3.1 Imports de `tray/formato` eliminado (punto 1)

`tray/formato.ts` ya no existe en `main`. Correspondencia exacta (verificada en `main`):

| Símbolo | Hogar en `main` |
|---|---|
| `ESTADO_LABELS`, `MOTIVO_LABELS`, `ALERTA_LABELS`, `AVISO_DURACION` | `src/modules/rrhh/requerimientos/model/etiquetas.ts` |
| `formatearFecha` | `src/modules/rrhh/requerimientos/model/formato.ts` |
| `ESTADOS`, `MOTIVOS` | `src/modules/rrhh/requerimientos/state/valores-bandeja.ts` (no se exporta por barril; import directo permitido desde dentro del módulo) |

Archivos afectados a reapuntar (grep de partida):

- `src/modules/rrhh/requerimientos/detail/DetalleRequerimiento.tsx` → `model/etiquetas.ts` + `model/formato.ts`
- `src/modules/rrhh/requerimientos/form/FormularioRequerimiento.tsx` → `model/etiquetas.ts` + `state/valores-bandeja.ts`
- `src/app/preview/requerimientos/data.ts` → `model/etiquetas.ts` + `state/valores-bandeja.ts`

Verificación al final: `git grep -n "tray/formato" -- src/` sin resultados.

#### 3.3.2 `add/add` por contenido (punto 2)

`form/FormularioRequerimiento.tsx`, su test, `form/index.ts` y `detail/index.ts` conservan la **superficie pública** y las pruebas aprobadas en T-RH-08 y T-RH-11, e integran lo que la vista aporte sin sustituirlo. Comparar props/contratos exportados antes y después:

```bash
git show main:src/modules/rrhh/requerimientos/form/index.ts
git show main:src/modules/rrhh/requerimientos/detail/index.ts
# tras resolver, el diff de los barriles solo debe AÑADIR líneas
git diff main -- 'src/modules/rrhh/requerimientos/*/index.ts'
```

#### 3.3.3 Estilos (punto 3)

Los estilos del preview (`preview.module.css`, `globals.css`) no duplican reglas ya existentes ni reintroducen las que T-RH-25 movió. Si una regla de `globals.css` de la vista repite una de `main`, se deja una sola definición.

#### 3.3.4 `AVISO_DURACION` (punto 4)

Eliminar las copias locales de `AVISO_DURACION` en:

- `src/modules/rrhh/requerimientos/tray/BandejaRequerimientos.tsx` (línea ~96)
- `src/modules/rrhh/requerimientos/form/FormularioRequerimiento.tsx` (línea ~41)

Ambos deben importar la definición única de `model/etiquetas.ts`. Texto visible idéntico: `La fecha objetivo se calcula al aprobar.`

#### 3.3.5 Sin pérdidas (punto 5)

Ningún archivo de `main` pierde exports, pruebas ni comportamiento. Si una pantalla exige un cambio de dominio, se aísla en un archivo propio y se justifica en el cuerpo del commit.

Comprobar también:

- Nada de imports horizontales entre rebanadas (`tray/`, `form/`, `review/`, `detail/`, `actions/`, `transitions/`); `deadlines/` solo importa `contracts/`; producción no importa `fixtures/`.
- El barril raíz (`index.ts`) conserva los exports de `main` y añade los de la vista.

### 3.4 Verificación («Hecho cuando»)

Ejecutar en el worktree `task/rh-req-01-t27`:

```bash
pnpm install --frozen-lockfile
pnpm exec tsc --noEmit                  # exit 0
pnpm test                               # suite completa: >= 760 pruebas de main + las de la vista
pnpm build                              # OK
git diff --check                        # sin espacios/errores
git status --porcelain                  # vacío
git grep -n "tray/formato" -- src/      # sin resultados
git log --oneline main..HEAD            # rama con la mezcla
git diff --stat main...HEAD             # inventario del cambio total
```

**Superficie pública:** comparar los barriles (`src/modules/rrhh/requerimientos/index.ts` y los `*/index.ts`) contra `main` y demostrar que solo se añaden líneas. **Pruebas:** comparar el conteo de la suite de `main` (línea base T-RH-22/T-RH-27: ≥ 760) con el de la rama; ninguna prueba de `main` desaparece.

**Expresividad de la vista:** al menos una ejecución manual de `pnpm dev` con `/preview/requerimientos` (modos: diseños, `Comparar`, `Funcional UX-03`, `Funcional UX-04`) verificando que la página responde y no hay errores de consola de imports rotos.

### 3.5 Commit y evidencia

Mensaje (una sola tarea, una sola rama):

```
feat(rh-req-01): T-RH-27 reconciliar la capa visual con main

- merge codex/rh-vis sobre task/rh-req-01-t27, conflictos resueltos por contenido
- imports de tray/formato reapuntados a model/etiquetas, model/formato y state/valores-bandeja
- AVISO_DURACION único desde model/etiquetas.ts
- barriles sin pérdida de exports; sin imports horizontales entre rebanadas

Evidencia: pnpm install --frozen-lockfile, tsc, suite N/N, build, git diff --check, árbol limpio
Reviewer: <veredicto posterior>
Fecha: 23-nov-2026
```

Commit con rutas explícitas:

```bash
git add -- <rutas resueltas>
git commit -m "feat(rh-req-01): T-RH-27 reconciliar la capa visual con main"   # con cuerpo
```

**Reportar al coordinador:** rama `task/rh-req-01-t27`, hash del commit, `git status --porcelain` vacío. **No push, no merge, no `--force`.** El usuario mergea con `git merge --ff-only task/rh-req-01-t27` tras el `APROBADO`.

---

## 4. Criterios de cierre (checklist)

- [ ] Rama `task/rh-req-01-t27` creada desde `main` limpio (`b3e06cd` o posterior).
- [ ] `codex/rh-vis` mezclada; conflictos resueltos por contenido, nunca por lado completo.
- [ ] `tray/formato.ts` eliminado y `git grep -n "tray/formato" -- src/` vacío.
- [ ] Los 4 `add/add` conservan superficie y pruebas de T-RH-08/T-RH-11 e integran la vista.
- [ ] `AVISO_DURACION` con una sola definición (`model/etiquetas.ts`).
- [ ] Estilos sin duplicados ni reglas reintroducidas.
- [ ] `pnpm install --frozen-lockfile`, `pnpm exec tsc --noEmit`, `pnpm test` (≥ 760 + vista), `pnpm build`, `git diff --check` OK; árbol limpio.
- [ ] Superficie pública comparada antes/después: solo adiciones.
- [ ] Commit único con hash reportado; sin push.
- [ ] Reviewer emite veredicto sobre el diff de la rama contra `main`.

---

## 5. Fuera de alcance (no se hace en T-RH-27)

- Accesibilidad de UX-02/03/04 (T-RH-23).
- Verificación integral y traza de P-04 (T-RH-24); P-04 sigue como dependencia externa.
- Consolidación de superficies únicas del dominio (T-RH-26); solo se ejecuta cuando el usuario lo indique.
- Comparación visual del criterio 18 y C-05.
- Integración en `src/app`/`RrhhContainer` y rutas reales (T-CORE-09, bloqueada hasta T-RH-23).
- Cambios de requisitos, `spec.md`, `plan.md` o `tasks.md`.
- Reescritura de commits de `main` o de `codex/rh-vis`.

---

## 6. Riesgos y decisiones abiertas durante la ejecución

1. **Preview y `MOTIVOS`:** `src/app/preview/requerimientos/data.ts` usa `MOTIVOS`, que en `main` vive en `state/valores-bandeja.ts` y no se exporta por barril. Opción preferida: import directo desde dentro del módulo; alternativa: lista local de datos de ejemplo en el preview (nunca promover el símbolo a `contracts/`).
2. **`globals.css`:** es el conflicto más probable. Regla: conservar todas las reglas de `main` y añadir solo las que la vista requiera y no existan.
3. **Formulario y detalle:** la vista puede traer markup distinto al aprobado en T-RH-08/T-RH-11. Si la diferencia es solo presentación, se porta; si toca lógica o contrato, **no** se acepta sin justificación explícita en el commit y revisión del reviewer.
4. **`src/app/preview/**` con datos de ejemplo:** no son requisitos (constitución); no se usan para redefinir comportamiento.
5. **Si `main` avanzó desde `b3e06cd`:** repetir la medición de divergencia y actualizar el mapa de conflictos antes de mergear; no reescribir `codex/rh-vis`.

---

## 7. Handoff al implementer (resumen autosuficiente)

> Capacidad `rh-req-01`, tarea T-RH-27. Trabaja en un worktree nuevo con rama `task/rh-req-01-t27` creada desde `main` limpio. Mezcla `codex/rh-vis`, resuelve conflictos **por contenido** siguiendo las 5 reglas de T-RH-27, reapunta los imports de `tray/formato` a `model/etiquetas.ts`/`model/formato.ts`/`state/valores-bandeja.ts`, elimina las copias locales de `AVISO_DURACION`, conserva exports y pruebas de `main`, y verifica con `pnpm install --frozen-lockfile`, `tsc --noEmit`, suite completa, `build`, `git diff --check` y árbol limpio. Commitea con `feat(rh-req-01): T-RH-27 …`, reporta rama, hash y árbol limpio. No hagas push ni merge a `main`.
