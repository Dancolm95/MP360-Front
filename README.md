# ERP MP 360 — Frontend

Frontend administrativo **modular** del ERP MP 360. **RR. HH. es el primer módulo**, no una aplicación aislada.

## Estado del proyecto

Fase de **implementación por tareas (SDD)**: specs aprobadas funcionalmente, planes aprobados técnicamente (v1.1) con una revisión v1.2 propuesta por cambio de stack, y tareas creadas. Hay andamiaje, contratos y fixtures del contenedor; las vistas aún no existen.

| Capacidad | Módulo | Spec | Estado | Documento |
|---|---|---|---|---|
| Requerimientos de personal | RR. HH. | RH-REQ-01 v0.7 | Aprobada funcionalmente (10-nov-2026); plan v1.1 aprobado técnicamente (10-nov-2026) y v1.2 propuesto (pendiente de aprobación); tareas creadas | [spec.md](docs/specs/rrhh/RH-REQ-01-requerimientos/spec.md) · [plan.md](docs/specs/rrhh/RH-REQ-01-requerimientos/plan.md) · [tasks.md](docs/specs/rrhh/RH-REQ-01-requerimientos/tasks.md) |
| Contenedor ERP compartido | Core | CORE-01 v0.6 | Aprobada funcionalmente (10-nov-2026); plan v1.1 aprobado técnicamente (10-nov-2026) y v1.2 propuesto (pendiente de aprobación); tareas creadas (T-CORE-01…10 vigentes; T-CORE-11 propuesta) | [spec.md](docs/specs/core/CORE-01-contenedor-erp/spec.md) · [plan.md](docs/specs/core/CORE-01-contenedor-erp/plan.md) · [tasks.md](docs/specs/core/CORE-01-contenedor-erp/tasks.md) |

> Corte propuesto: contenedor ERP compartido + `UX-02`/`UX-03`/`UX-04`. Stack: **Next.js 16 (App Router) + React + TypeScript**, con mocks/adaptadores de contrato. El cambio de stack está **propuesto el 10-nov-2026 y pendiente de aprobación técnica**; sustituye a la decisión anterior de React + TypeScript con Vite (plan v1.1, histórica). C-05 y el criterio 18 de RH-REQ-01 quedan diferidos; las decisiones abiertas (INT-01, P-04 y la aprobación de la v1.2) se resuelven antes de cerrar las tareas dependientes.

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
