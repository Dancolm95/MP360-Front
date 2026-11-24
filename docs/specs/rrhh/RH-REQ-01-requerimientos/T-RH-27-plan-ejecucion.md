# T-RH-27 — Plan de ejecución: reconciliación de la capa visual con `main`

> **Anexo de ejecución.** No es una spec ni modifica requisitos, `plan.md` ni `tasks.md`.
> Complementa la definición de T-RH-27 con el procedimiento operativo acordado con el
> usuario el 23-nov-2026. La fuente normativa sigue siendo `tasks.md` §T-RH-27.
>
> **Reconciliado el 24-nov-2026** con las decisiones del usuario: merge conservando el
> historial, poda de las previews ajenas al corte, UX-03 en convivencia, etiquetas diferidas
> a T-RH-23 y ruta de comparación. Si este anexo y `tasks.md` §T-RH-27 discrepan, **manda
> `tasks.md`**; este documento solo describe el procedimiento.

- **Capacidad:** `rh-req-01` (RH-REQ-01 — Requerimientos)
- **Tarea:** T-RH-27 (cerrada e integrada en `main` el 24-nov-2026: merge `c68daa1` + tarea `a4b81fb`)
- **Fuentes:** `tasks.md` §T-RH-27, `plan.md` §6 (R1–R6), `docs/Inventario_y_conciliacion_RRHH.md`, `docs/constitution.md`, `AGENTS.md`
- **Objetivo:** que la capa visual (ventanas diseñadas en `codex/rh-vis`) compile, pase la suite y conviva con la lógica cerrada de `main` (T-RH-01…22 + T-RH-25), sin perder exports, pruebas ni comportamiento aprobado, y sin cambiar requisitos ni reinterpretar vistas.

---

## 1. Estado de partida (re-medido el 24-nov-2026)

| Elemento | Valor |
|---|---|
| Repositorio principal | `/Users/danielcolona/DevProjects/ERP-Front-Codex` (rama `main`, `33e3a63`, árbol limpio) |
| Worktree visual | `/Users/danielcolona/DevProjects/erp-rh-vis-wt` (rama `codex/rh-vis`, `aabd424`, árbol limpio) |
| Punto de divergencia (`merge-base`) | `f080739` |
| Divergencia (`git rev-list --left-right --count main...codex/rh-vis`) | `81 50`: **81 commits de `main`** que la rama no tiene y **50 commits de la rama** que `main` no tiene |
| Archivos cambiados desde la base | `main` 91, `codex/rh-vis` 132; la intersección son **exactamente** los cuatro archivos en conflicto |
| Conflictos reales (`git merge-tree --write-tree main codex/rh-vis`) | Cuatro: `detail/index.ts` y `form/index.ts` (contenido); `form/FormularioRequerimiento.tsx` y `form/FormularioRequerimiento.test.tsx` (`add/add`) |
| `main` contiene | Lógica completa: `contracts/`, `model/`, `deadlines/`, `state/`, `actions/`, `transitions/`, `tray/`, `form/`, `review/`, `detail/`; T-RH-25 reorganizó y **eliminó `tray/formato.ts`** |
| `codex/rh-vis` contiene | Ventanas del PDF en `src/app/preview/requerimientos/**` (17 áreas), más `form/FormularioRequerimiento.tsx` (+CSS y test) y `detail/DetalleRequerimiento.tsx` (+CSS y test) |
| Precondición de T-RH-27 | **Cumplida:** el usuario confirmó que las pantallas están terminadas y commiteadas (sin pendientes en la rama) |

`tasks.md` registra la medición anterior del mismo 24-nov con **78 commits detrás**; la cifra
crece con cada commit documental de `main` y la de esta tabla es la vigente al reconciliar el
anexo (`main` = `33e3a63`). Antes de mergear se vuelve a medir (§2); el número no se copia.

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

Si `main` cambió respecto de `33e3a63`, **re-medir** la divergencia:

```bash
git log --oneline main..codex/rh-vis | wc -l
git log --oneline codex/rh-vis..main | wc -l
git diff --name-only $(git merge-base main codex/rh-vis)..codex/rh-vis -- src/
```

Anotar los números reales en la evidencia del commit. El punto de partida registrado en T-RH-27 (18-nov-2026) era `4e0cec7`, 23 delante / 76 detrás; a la fecha de este anexo (24-nov-2026) la rama visual tiene **50 commits propios** y la misma base `f080739`, mientras `main` ha avanzado a `33e3a63` (81 commits que la rama no tiene).

Si el repositorio no tiene remoto (así está hoy), `git pull --ff-only` no aplica; basta con comprobar que `main` está limpio y al día con lo que se vaya a mezclar.

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

**Si hay conflictos**, resolver uno a uno con las reglas del §3.3. Nunca `git checkout --ours/--theirs` sobre archivos en conflicto: T-RH-27 exige resolución **por contenido**; en los dos `FormularioRequerimiento.*` la resolución es la **convivencia** de §3.3.2.

Mapa **real** de conflictos (medido el 24-nov-2026 con `git merge-tree --write-tree main codex/rh-vis` sobre `main` = `33e3a63`):

| Archivo | Tipo | Resolución |
|---|---|---|
| `src/modules/rrhh/requerimientos/detail/index.ts` | contenido | Unión de exports: todos los de `main` (modelo y resultado del detalle) se conservan y se añade `DetalleRequerimiento` (+ `DetalleRequerimientoProps`) de la rama |
| `src/modules/rrhh/requerimientos/form/index.ts` | contenido | Unión de exports: se conserva la superficie de `main` (`FormularioRequerimiento`, `FormularioRequerimientoProps` y `helpers`) y se añade el componente de preview **renombrado** y sus tipos (§3.3.2). El nombre compartido `FormularioRequerimiento` sigue apuntando al de producción |
| `src/modules/rrhh/requerimientos/form/FormularioRequerimiento.tsx` | `add/add` | `main` conserva su componente **sin modificar**; la versión de la rama pasa a un archivo propio renombrado (§3.3.2) |
| `src/modules/rrhh/requerimientos/form/FormularioRequerimiento.test.tsx` | `add/add` | `main` conserva sus **14 pruebas sin modificar**; el test de la rama (3 pruebas) acompaña al componente renombrado |

El resto de lo que aporta la rama entra **sin conflicto**: `detail/DetalleRequerimiento.{tsx,module.css,test.tsx}`, `form/FormularioRequerimiento.module.css`, todo `src/app/preview/**`, `public/preview/**` y los documentos de `docs/`.

Corrección del mapa anterior de este anexo (23-nov-2026): listaba como conflicto o como «solo en la rama» `tray/BandejaRequerimientos.tsx`, `tray/filtros.ts`, `src/app/globals.css`, `package.json`/`pnpm-lock.yaml`/`vitest.config.ts` y `tray/formato.ts`. La medición del 24-nov muestra que **la rama no toca ninguno de esos archivos**: no hay modificación doble ni diferencia de dependencias. `tray/formato.ts` no lo aporta la rama; lo **eliminó `main`** en T-RH-25, y la rama aún lo importa en tres archivos (§3.3.1).

Al terminar cada resolución: `git add -- <ruta>` (nunca `git add -A` ni `git add .`).

#### 3.2.1 Poda de las previews ajenas al corte

Decisión del usuario del 24-nov-2026. Se **conservan** `ux02`, `ux03`, `ux04`, `inicio`, `acceso` y el cromo compartido (`ux02/Cromo.tsx`, `ux02/DisenoPagina6.tsx`, `ux02/VistaEscalada.tsx`, `preview.module.css`, `ux02-fiel.css`, `layout.tsx`, `data.ts`). Se **eliminan**, íntegros, bajo `src/app/preview/requerimientos/`:

`documental/`, `offboarding/`, `alta/`, `licencias/`, `epp/`, `dotacion/`, `onboarding/`, `colaboradores/`, `colaborador/`, `candidatos/`, `candidato/` y `calendario/`.

Precauciones:

- Borrar cada directorio con su `datos.ts`; ningún área conservada importa datos de las podadas (verificado: `ux03`, `ux04` e `inicio` solo importan cromo de `ux02`).
- Quitar de `page.tsx` los `import` de sus componentes, sus entradas en `DISENOS`, sus valores de la unión `Diseno` y cualquier botón o modo asociado. La unión y `DISENOS` son la fuente del build: una entrada huérfana rompe `tsc`.
- Revisar `data.ts`, `layout.tsx` y `preview.module.css` por si alguna entrada o regla queda exclusiva de un área podada. Hoy `layout.tsx` solo importa `ux02-fiel.css` y `data.ts` no tiene entradas por área; se verifica, no se supone.
- No dejar rutas ni imports huérfanos. Las imágenes `public/preview/mp360/img/referencia-<área>.jpg` de las áreas podadas quedan sin uso; podarlas es opcional y, si se hace, hay que comprobar que ninguna `referencia` de `DISENOS` las use.
- Verificación: `git grep -n "preview/requerimientos/<área>" -- src/` sin resultados para cada una de las doce, `git grep -n "from './<área>/" -- src/app/preview/requerimientos/` sin resultados y `pnpm build` OK.

### 3.3 Reglas de resolución (T-RH-27 «Salida», puntos 2–7; el punto 1 es el merge del §3.2)

#### 3.3.1 Imports de `tray/formato` eliminado (punto 2)

`tray/formato.ts` ya no existe en `main` (lo eliminó T-RH-25). Correspondencia verificada en `main` el 24-nov-2026:

| Símbolo | Hogar en `main` |
|---|---|
| `ESTADO_LABELS`, `MOTIVO_LABELS`, `ALERTA_LABELS`, `AVISO_DURACION` | `src/modules/rrhh/requerimientos/model/etiquetas.ts` (líneas 20, 30, 37 y 43) |
| `formatearFecha` | `src/modules/rrhh/requerimientos/model/formato.ts` |
| `ESTADOS`, `MOTIVOS` | `src/modules/rrhh/requerimientos/state/valores-bandeja.ts` (no se exportan por el barril; ver §6.1 para el consumo desde el preview) |

Archivos de la rama a reapuntar (grep de partida; son exactamente tres):

- `src/modules/rrhh/requerimientos/detail/DetalleRequerimiento.tsx` → `ALERTA_LABELS`, `ESTADO_LABELS`, `MOTIVO_LABELS` desde `model/etiquetas.ts` y `formatearFecha` desde `model/formato.ts`
- `src/modules/rrhh/requerimientos/form/FormularioRequerimiento.tsx` (→ `FormularioRequerimientoPreview.tsx`, §3.3.2) → `MOTIVOS` desde `state/valores-bandeja.ts` y `MOTIVO_LABELS` desde `model/etiquetas.ts`
- `src/app/preview/requerimientos/data.ts` → `MOTIVOS` desde `state/valores-bandeja.ts` y `MOTIVO_LABELS` desde `model/etiquetas.ts`

Verificación al final: `git grep -n "tray/formato" -- src/` sin resultados.

#### 3.3.2 `form/FormularioRequerimiento.*`: convivencia de UX-03 (puntos 3–4)

La versión de la rama **no es un superconjunto** de la de `main`: es un fork con otra API (no controlada, sin `deshabilitado` ni `plazoAdministrativoDias`), sin duración administrativa 15–30, sin clasificación derivada, sin `required`/`aria-required`, con confirmación propia y otras divergencias de comportamiento. Sustituir la de `main` haría fallar sus **14 pruebas** e incumpliría los criterios 20 y 24. Por eso:

- `form/FormularioRequerimiento.tsx` y `form/FormularioRequerimiento.test.tsx` se quedan **como están en `main`**: 502 líneas de componente y 494 líneas / 14 pruebas, **sin modificar**.
- La versión de la rama pasa a `form/FormularioRequerimientoPreview.tsx` (nombre propuesto `FormularioRequerimientoPreview`, con `FormularioRequerimientoPreviewProps` y `PasoFormularioPreview` para no colisionar con los tipos de producción), conserva su `FormularioRequerimiento.module.css` y su test (136 líneas / 3 pruebas) se renombra en consecuencia.
- `form/index.ts` exporta las dos superficies: la de `main` intacta y, además, `FormularioRequerimientoPreview` con sus tipos. El nombre compartido `FormularioRequerimiento` **sigue apuntando a producción**.
- El componente de preview se consume **solo** desde `src/app/preview/**`; ninguna rebanada de producción (`tray/`, `review/`, `detail/`, `actions/`, `transitions/`, `state/`) lo importa. Verificación: `git grep -n "FormularioRequerimientoPreview" -- src/` solo devuelve `src/app/preview/**` y `form/**`.
- El test de la rama no sustituye al de `main` ni se fusiona con él: queda como test del componente de preview. Las 14 pruebas de `main` corren sin cambios.
- `src/app/preview/requerimientos/page.tsx` debe apuntar el modo `Funcional UX-03` a `FormularioRequerimientoPreview`: la API de `main` (`valor` + `onCambio`) no admite las props que hoy usa el preview (`onCancelar`, `onGuardarBorrador`, …), y dejarlo apuntando al de producción rompería `tsc`.

`form/index.ts` y `detail/index.ts` se resuelven por **unión** de exports, nunca por lado completo. Comparar antes/después y exigir que el diff de los barriles solo **añada** líneas:

```bash
git show main:src/modules/rrhh/requerimientos/form/index.ts
git show main:src/modules/rrhh/requerimientos/detail/index.ts
git diff main -- 'src/modules/rrhh/requerimientos/*/index.ts'
```

#### 3.3.3 Estilos (precaución transversal)

El merge no pone `globals.css` en conflicto: la rama no lo modifica y las reglas de `main` se conservan **tal cual**. Los estilos de la rama entran como CSS Modules propios (`FormularioRequerimiento.module.css` del preview, `DetalleRequerimiento.module.css`, `preview.module.css`, `ux02-fiel.css`); no se convierten en reglas globales ni duplican selectores de `main`.

#### 3.3.4 `AVISO_DURACION` (punto 6)

Definición única en `model/etiquetas.ts` (línea 43). Quedan **dos** copias locales, una por lado:

- `main`: `tray/BandejaRequerimientos.tsx` la declara en la línea 214 → debe importarla de `model/etiquetas.ts`.
- rama: el componente que pasa a `FormularioRequerimientoPreview.tsx` la declara en la línea ~41 → mismo import.
- El `form/FormularioRequerimiento.tsx` de `main` **ya la importa** de `model` (línea 22): ahí no hay nada que quitar. El anexo anterior atribuía la copia local a este archivo por confundir los dos lados.

Texto visible idéntico: `La fecha objetivo se calcula al aprobar.` Verificación: `git grep -n "const AVISO_DURACION" -- src/` sin resultados y el texto sigue apareciendo en la bandeja y en el componente de preview.

#### 3.3.5 Sin pérdidas (punto 7)

Ningún archivo de `main` pierde exports, pruebas ni comportamiento. Si una pantalla exige un cambio de dominio, se aísla en un archivo propio y se justifica en el cuerpo del commit.

Comprobar también:

- Nada de imports horizontales entre rebanadas (`tray/`, `form/`, `review/`, `detail/`, `actions/`, `transitions/`); `deadlines/` solo importa `contracts/`; producción no importa `fixtures/`.
- El barril raíz (`index.ts`) conserva los exports de `main` y añade los de la vista; los componentes visuales nuevos (`DetalleRequerimiento` y `FormularioRequerimientoPreview`) y sus tipos no sustituyen ningún símbolo de `main`.
- Las etiquetas «(S/)» y «Responsable de aprobación» **no se tocan** en esta tarea: viajan con el componente de preview tal como están y se deciden en T-RH-23. Si el PDF gana, el cambio va primero a `spec.md`.

#### 3.3.6 Ruta de comparación de UX-03 (punto 4)

Entregable de T-RH-27: una ruta bajo `src/app/preview/requerimientos/` que renderice **ambas** versiones para que el usuario compare y decida. Nombre propuesto: `comparacion-ux03/page.tsx`; también vale un modo nuevo del `page.tsx` existente, siempre que la ruta quede bajo `src/app/preview/requerimientos/` y sea alcanzable desde la barra del preview.

- Columna izquierda: `FormularioRequerimiento` de `form/` (producción, API controlada). Se monta con estado local a partir de `crearFormularioVacio(CATALOGOS)` y aplica los cambios con `aplicarCambio`/`onCambio` del contrato de `model`.
- Columna derecha: `FormularioRequerimientoPreview` (rama) con sus propias props y sus datos de ejemplo.
- Cada versión se monta con **su** contrato de props: no se adapta ni se unifica la API. La ruta es de comparación visual, no de decisión.
- No elige ganadora, no cambia `form/index.ts` y no toca las etiquetas. La decisión final de UX-03 y la unificación de etiquetas son de **T-RH-23**.
- Verificación manual: `pnpm dev` y abrir la ruta; ambas versiones renderizan sin errores de consola por imports rotos, y `pnpm build` incluye la ruta.

### 3.4 Verificación («Hecho cuando»)

Ejecutar en el worktree `task/rh-req-01-t27`:

```bash
pnpm install --frozen-lockfile
pnpm exec tsc --noEmit                  # exit 0
pnpm test                               # suite completa: >= 760 pruebas de main + las de la vista que sobreviva a la poda
pnpm build                              # OK
git diff --check                        # sin espacios/errores
git status --porcelain                  # vacío
git grep -n "tray/formato" -- src/      # sin resultados
git grep -n "const AVISO_DURACION" -- src/   # sin resultados
git grep -n "FormularioRequerimientoPreview" -- src/ | grep -v "src/app/preview/"   # solo form/**
git log --oneline main..HEAD            # rama con la mezcla
git diff --stat main...HEAD             # inventario del cambio total
```

**Poda:** para cada una de las doce áreas, `git grep -n "preview/requerimientos/<área>" -- src/` sin resultados; además, `git grep -n "from './<área>/" -- src/app/preview/requerimientos/` sin resultados. `ux02`, `ux03`, `ux04`, `inicio`, `acceso` y el cromo siguen presentes y `pnpm build` los compila.

**Superficie pública:** comparar los barriles (`src/modules/rrhh/requerimientos/index.ts`, `detail/index.ts` y `form/index.ts`, además de los `*/index.ts`) contra `main` y demostrar que solo se añaden líneas. **Pruebas:** comparar el conteo de la suite de `main` (línea base T-RH-22/T-RH-27: ≥ 760) con el de la rama; ninguna prueba de `main` desaparece y las **14 de `form/FormularioRequerimiento.test.tsx` corren sin cambios**.

**Expresividad de la vista:** al menos una ejecución manual de `pnpm dev` con `/preview/requerimientos` (modos: diseños, `Comparar`, `Funcional UX-03`, `Funcional UX-04`) y con la ruta de comparación de §3.3.6, verificando que responden y que no hay errores de consola de imports rotos.

### 3.5 Commit y evidencia

Mensaje (una sola tarea, una sola rama):

```
feat(rh-req-01): T-RH-27 reconciliar la capa visual con main

- merge codex/rh-vis sobre task/rh-req-01-t27 conservando el historial, con los cuatro conflictos resueltos por contenido
- poda de las doce previews ajenas al corte; se conservan ux02, ux03, ux04, inicio, acceso y el cromo
- UX-03 en convivencia: main conserva su componente y sus 14 pruebas; la versión de la rama entra renombrada y solo la consume el preview
- ruta de comparación de UX-03 en src/app/preview/requerimientos/
- imports de tray/formato reapuntados a model/etiquetas, model/formato y state/valores-bandeja
- AVISO_DURACION único desde model/etiquetas.ts
- etiquetas «(S/)» y «Responsable de aprobación» intactas; se deciden en T-RH-23
- barriles sin pérdida de exports; sin imports horizontales entre rebanadas

Evidencia: pnpm install --frozen-lockfile, tsc, suite N/N, build, git diff --check, árbol limpio
Reviewer: <veredicto posterior>
Fecha: 24-nov-2026
```

Commit con rutas explícitas:

```bash
git add -- <rutas resueltas>
git commit -m "feat(rh-req-01): T-RH-27 reconciliar la capa visual con main"   # con cuerpo
```

**Reportar al coordinador:** rama `task/rh-req-01-t27`, hash del commit, `git status --porcelain` vacío. **No push, no merge, no `--force`.** El usuario mergea con `git merge --ff-only task/rh-req-01-t27` tras el `APROBADO`.

---

## 4. Criterios de cierre (checklist)

- [ ] Rama `task/rh-req-01-t27` creada desde `main` limpio (`33e3a63` o posterior, re-medido).
- [ ] `codex/rh-vis` mezclada conservando el historial; los **cuatro** conflictos resueltos por contenido, nunca por lado completo.
- [ ] Poda de `documental`, `offboarding`, `alta`, `licencias`, `epp`, `dotacion`, `onboarding`, `colaboradores`, `colaborador`, `candidatos`, `candidato` y `calendario`, con sus `datos.ts` y sus entradas de `page.tsx`; sin rutas ni imports huérfanos; `ux02`, `ux03`, `ux04`, `inicio`, `acceso` y el cromo intactos.
- [ ] `tray/formato.ts` no existe y `git grep -n "tray/formato" -- src/` está vacío.
- [ ] `form/FormularioRequerimiento.tsx` y sus **14 pruebas** de `main` corren **sin modificar**; la versión de la rama está renombrada y solo la consume `src/app/preview/**`.
- [ ] La ruta de comparación de UX-03 renderiza ambas versiones y es de comparación, no de decisión.
- [ ] Las etiquetas «(S/)» y «Responsable de aprobación» quedan intactas y diferidas a T-RH-23.
- [ ] `AVISO_DURACION` con una sola definición (`model/etiquetas.ts`).
- [ ] Estilos de la rama en CSS Modules; `globals.css` de `main` sin cambios.
- [ ] `pnpm install --frozen-lockfile`, `pnpm exec tsc --noEmit`, `pnpm test` (≥ 760 + vista superviviente), `pnpm build`, `git diff --check` OK; árbol limpio.
- [ ] Superficie pública comparada antes/después: solo adiciones.
- [ ] Commit único con hash reportado; sin push.
- [ ] Reviewer emite veredicto sobre el diff de la rama contra `main`.

---

## 5. Fuera de alcance (no se hace en T-RH-27)

- Elegir la versión canónica de UX-03 y unificar sus etiquetas «(S/)» y «Responsable de aprobación» (T-RH-23); si el PDF gana, primero `spec.md`.
- Accesibilidad de UX-02/03/04 (T-RH-23).
- Verificación integral y traza de P-04 (T-RH-24); P-04 sigue como dependencia externa.
- Consolidación de superficies únicas del dominio (T-RH-26); solo se ejecuta cuando el usuario lo indique.
- Comparación visual del criterio 18 y C-05.
- Integración en `src/app`/`RrhhContainer` y rutas reales (T-CORE-09, bloqueada hasta T-RH-23).
- Cambios de requisitos, `spec.md`, `plan.md` o `tasks.md`.
- Reescritura de commits de `main` o de `codex/rh-vis`.
- Recuperar o mantener las previews podadas; no tienen spec en este corte.

---

## 6. Riesgos y decisiones abiertas durante la ejecución

1. **Preview y `MOTIVOS`:** `src/app/preview/requerimientos/data.ts` usa `MOTIVOS`, que en `main` vive en `state/valores-bandeja.ts` y no se exporta por el barril del módulo. Opción preferida: import profundo a `state/valores-bandeja.ts` desde el preview; alternativa: lista local de datos de ejemplo (nunca promover el símbolo a `contracts/`). `MOTIVO_LABELS` sí está en `model/etiquetas.ts` y se importa de ahí.
2. **Convivencia de UX-03:** la tentación de «aplicar la piel visual» sobre el componente de `main` está descartada. Son dos componentes con API y comportamiento distintos: producción conserva el de `main`, y el de la rama vive renombrado y solo para preview. Cualquier intento de fusionarlos es una decisión de T-RH-23, no de esta tarea.
3. **Fuga del componente de preview:** si una rebanada de producción importa `FormularioRequerimientoPreview`, el alcance se rompe. Verificar con el grep de §3.4 y rechazar el cambio en revisión.
4. **Poda incompleta:** la unión `Diseno` y `DISENOS` de `page.tsx` son la fuente del build; una entrada o import huérfano rompe `tsc`/`build`. Borrar directorio, `datos.ts`, import, entrada y valor de la unión en el mismo cambio.
5. **Formulario y detalle:** la vista trae markup distinto al aprobado en T-RH-08/T-RH-11. El detalle de la rama se añade como componente de UX-04 y no altera el modelo de T-RH-11; si una pantalla exigiera lógica nueva, **no** se acepta sin justificación explícita en el commit y revisión del reviewer.
6. **`src/app/preview/**` con datos de ejemplo:** no son requisitos (constitución); no se usan para redefinir comportamiento ni para decidir etiquetas.
7. **Si `main` avanzó desde `33e3a63`:** repetir la medición de divergencia y el `git merge-tree` antes de mergear; no reescribir `codex/rh-vis`. El número de commits detrás cambia con cada commit documental y no invalida el plan, solo la foto.

---

## 7. Handoff al implementer (resumen autosuficiente)

> Capacidad `rh-req-01`, tarea T-RH-27. Fuente normativa: `tasks.md` §T-RH-27; este anexo es el procedimiento. Trabaja en un worktree nuevo con rama `task/rh-req-01-t27` creada desde `main` limpio (`33e3a63` o posterior) y **re-mide** antes de mergear: `git merge-base main codex/rh-vis` (`f080739`), `git rev-list --left-right --count main...codex/rh-vis` (50/81 el 24-nov) y `git merge-tree --write-tree main codex/rh-vis` (cuatro conflictos).
>
> **Merge** de `codex/rh-vis` conservando el historial (sin squash ni rebase). Resuelve **por contenido** los cuatro conflictos: unión de exports en `detail/index.ts` y `form/index.ts`; en `form/FormularioRequerimiento.tsx` y su test, `main` **conserva su componente y sus 14 pruebas sin modificar** y la versión de la rama pasa a `FormularioRequerimientoPreview.tsx` (+ test renombrado), consumida **solo** desde `src/app/preview/**`. El nombre `FormularioRequerimiento` sigue siendo el de producción.
>
> **Poda** las doce previews ajenas al corte (`documental`, `offboarding`, `alta`, `licencias`, `epp`, `dotacion`, `onboarding`, `colaboradores`, `colaborador`, `candidatos`, `candidato`, `calendario`), con sus `datos.ts` y sus imports/entradas de `page.tsx`; conserva `ux02`, `ux03`, `ux04`, `inicio`, `acceso` y el cromo. **Reapunta** los tres imports de `tray/formato` (detalle, formulario de preview y `preview/data.ts`) a `model/etiquetas.ts`, `model/formato.ts` y `state/valores-bandeja.ts`. Deja **una sola** `AVISO_DURACION` en `model/etiquetas.ts` (copia local en `tray/BandejaRequerimientos.tsx` de `main` y en el componente de preview).
>
> **Añade la ruta de comparación de UX-03** bajo `src/app/preview/requerimientos/`, montando cada versión con su propio contrato de props. **No toques** las etiquetas «(S/)» ni «Responsable de aprobación»: se deciden en T-RH-23 y, si gana el PDF, primero `spec.md`. No elijas la versión canónica: eso también es T-RH-23.
>
> **Verifica** con `pnpm install --frozen-lockfile`, `tsc --noEmit`, suite completa (≥ 760 de `main` + vista superviviente, con las 14 de `form/` intactas), `pnpm build`, `git diff --check` y árbol limpio; además, los greps de poda, `tray/formato` y `FormularioRequerimientoPreview`. Commitea con `feat(rh-req-01): T-RH-27 …`, reporta rama, hash y árbol limpio. No hagas push ni merge a `main`.
