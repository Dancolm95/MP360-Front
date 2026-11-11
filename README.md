# ERP MP 360 — Frontend

Frontend administrativo **modular** del ERP MP 360. **RR. HH. es el primer módulo**, no una aplicación aislada.

## Estado del proyecto

Fase de **implementación por tareas (SDD)**: specs aprobadas funcionalmente, planes **v1.2 aprobados técnicamente el 10-nov-2026** (la v1.1 con Vite es histórica), con el plan de CORE-01 en **v1.3 (11-nov-2026, adopción de pnpm)** y el de RH-REQ-01 en **v1.2**, y tareas creadas. El andamiaje Next.js, los contratos, las fixtures, la cabecera/selector, los estados de sesión del contenedor y el tooling de dependencias están cerrados (T-CORE-02, T-CORE-03, T-CORE-11, T-CORE-04, T-CORE-05 y T-CORE-12); el gestor de dependencias vigente es **pnpm** (`pnpm-lock.yaml` es el único lockfile). Las **vistas de dominio** aún no existen.

| Capacidad | Módulo | Spec | Estado | Documento |
|---|---|---|---|---|
| Requerimientos de personal | RR. HH. | RH-REQ-01 v0.7 | Aprobada funcionalmente (10-nov-2026); plan **v1.2 aprobado técnicamente** (10-nov-2026; v1.1 histórica); tareas creadas (T-RH-01…24), ninguna iniciada | [spec.md](docs/specs/rrhh/RH-REQ-01-requerimientos/spec.md) · [plan.md](docs/specs/rrhh/RH-REQ-01-requerimientos/plan.md) · [tasks.md](docs/specs/rrhh/RH-REQ-01-requerimientos/tasks.md) |
| Contenedor ERP compartido | Core | CORE-01 v0.6 | Aprobada funcionalmente (10-nov-2026); plan **v1.3** (11-nov-2026; la v1.2 sigue aprobada técnicamente desde el 10-nov-2026 y la v1.1 es histórica); tareas creadas (T-CORE-01…13); T-CORE-11, T-CORE-04, T-CORE-05 y T-CORE-12 cerradas y mergeadas; T-CORE-13 siguiente (tooling) y T-CORE-06 después | [spec.md](docs/specs/core/CORE-01-contenedor-erp/spec.md) · [plan.md](docs/specs/core/CORE-01-contenedor-erp/plan.md) · [tasks.md](docs/specs/core/CORE-01-contenedor-erp/tasks.md) |

> Corte en curso: contenedor ERP compartido + `UX-02`/`UX-03`/`UX-04`. Stack: **Next.js 16 (App Router) + React 19 + TypeScript sobre Node 24 LTS**, con mocks/adaptadores de contrato. El cambio de stack fue **aprobado técnicamente el 10-nov-2026** (plan v1.2) y sustituye a la decisión anterior de React + TypeScript con Vite (plan v1.1, histórica). C-05 y el criterio 18 de RH-REQ-01 quedan diferidos; siguen abiertas las decisiones de INT-01 (contratos técnicos Selección/Alta y casos límite) y P-04 (matriz final de permisos y criterio de migración). El gestor de dependencias es **pnpm**, decisión de tooling del **11-nov-2026** (CORE-01 plan v1.3, §6.1) que no altera requisitos ni criterios; la migración a pnpm quedó **cerrada en `c947acb`** (T-CORE-12, veredicto APROBADO, merge `--ff-only`). El efecto de `next dev` sobre `AGENTS.md` y el resto del tooling de desarrollo se aborda en **T-CORE-13**.

## Estructura del repositorio

```
.
├── docs/
│   ├── constitution.md          # Reglas transversales y jerarquía de fuentes
│   ├── specs/
│   │   ├── README.md            # Convención de organización de specs
│   │   ├── core/CORE-01-…/      # Capacidades compartidas del ERP
│   │   └── rrhh/RH-REQ-01-…/    # Capacidades del módulo RR. HH.
│   └── Inventario_y_conciliacion_RRHH.md
├── .opencode/
│   ├── agents/                  # coordinator, planner, implementer, reviewer
│   └── commands/                # Comandos /sdd-*
├── AGENTS.md                    # Guía de trabajo del repositorio
└── memory.md                    # Bitácora de continuidad (no es fuente de requisitos)
```

## Desarrollo

Requisitos: **Node 24 LTS** (fijado en `.nvmrc`) y **pnpm 12.14.0** (fijado en `package.json` → `packageManager`). El gestor de dependencias del repositorio es pnpm; no se usa npm.

```bash
nvm use                        # Node 24 LTS según .nvmrc
pnpm install --frozen-lockfile # instalación reproducible desde pnpm-lock.yaml
pnpm dev                       # servidor de desarrollo (next dev)
pnpm test                      # pruebas (Vitest)
pnpm build                     # build de producción (next build)
pnpm exec tsc --noEmit         # comprobación de tipos
```

`pnpm-lock.yaml` es el único lockfile versionado; `package-lock.json` no existe. `next-env.d.ts` lo genera Next.js y está ignorado: `pnpm dev`/`pnpm build` lo regeneran sin ensuciar el árbol.

## Fuentes de verdad

1. **Definición Funcional RR. HH. V2.2** — reglas, datos, actores y estados (conserva V2.1 donde no la sustituye).
2. **Especificación UX/UI RR. HH. V1.2** — vistas, acciones y patrones de interacción.
3. **`MP360PantallasRRHH.pdf`** — apariencia y composición visual (sus datos de ejemplo no son reglas).
4. **Maqueta `ERP Front.zip`** — referencia técnica, **no** fuente de requisitos.

## Cómo trabajar (SDD)

Flujo por capacidad: **spec → plan → tareas → implementación**, con aprobación explícita en cada fase.

- Una sola spec por capacidad; vive en `docs/specs/<módulo>/<ID>-<nombre>/spec.md`.
- `plan.md` solo se crea tras aprobar la spec y resolver/excluir los bloqueos del corte.
- `tasks.md` solo se crea desde un plan aprobado.
- Los agentes SDD (`coordinator`, `planner`, `implementer`, `reviewer`) y los comandos `/sdd-*` automatizan el flujo.

Antes de cualquier cambio funcional o de arquitectura, lee:

1. `docs/constitution.md`
2. La spec vigente en `docs/specs/`
3. `docs/specs/README.md` (convención)
4. `docs/Inventario_y_conciliacion_RRHH.md` (fuentes visuales y diferencias documentales)
5. `memory.md` (bitácora de continuidad; se actualiza solo tras un avance verificable)
