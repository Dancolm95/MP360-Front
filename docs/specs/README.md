# Organización de specs

- `core/` reúne capacidades compartidas del ERP; cada módulo tiene su carpeta (`rrhh/`, y las que se incorporen después).
- Cada capacidad usa una carpeta con el ID de su spec: `<ID>-<nombre>/`. Ejemplo: `rrhh/RH-REQ-01-requerimientos/`.
- `spec.md` define alcance, reglas, actores, vistas, criterios de aceptación, fuentes y dudas abiertas. Es la única spec vigente de esa capacidad.
- `plan.md` describe contratos, responsabilidades técnicas y verificación; `tasks.md` enumera trabajos trazables. Ambos viven en la carpeta de la capacidad (`<ID>-<nombre>/`), junto a `spec.md`. Cuando un corte agrupa varias capacidades, cada una tiene su propio plan y se referencian entre sí. `plan.md` solo se crea tras aprobación explícita de la spec y resolución o exclusión expresa de bloqueos del corte; `tasks.md`, solo desde un plan aprobado.
- Los cambios de requisitos se incorporan primero a `spec.md`, después al plan, las tareas y la implementación. Las decisiones transversales se registran fuera de las specs y se enlazan desde ellas.

## Estado actual

| Capacidad | Estado | Documento |
|---|---|---|
| Requerimientos de personal (RR. HH.) | RH-REQ-01 v0.7, aprobada funcionalmente el 10-nov-2026; P-04 provisional (matriz final externa); C-05 y criterio 18 diferidos; plan **v1.2 aprobado técnicamente el 10-nov-2026** (v1.1 histórica); tareas creadas (T-RH-01…24) | [spec.md](rrhh/RH-REQ-01-requerimientos/spec.md) · [plan.md](rrhh/RH-REQ-01-requerimientos/plan.md) · [tasks.md](rrhh/RH-REQ-01-requerimientos/tasks.md) |
| Contenedor ERP compartido | CORE-01 v0.6, aprobada funcionalmente el 10-nov-2026; contratos C-01/C-03/C-04 y C-02 al plan; C-05 diferido (verificación diferida); P-04 provisional (matriz final externa); plan **v1.2 aprobado técnicamente el 10-nov-2026** (v1.1 histórica); tareas creadas (T-CORE-11, T-CORE-04 y T-CORE-05 cerradas; T-CORE-06 siguiente) | [spec.md](core/CORE-01-contenedor-erp/spec.md) · [plan.md](core/CORE-01-contenedor-erp/plan.md) · [tasks.md](core/CORE-01-contenedor-erp/tasks.md) |

Planes por capacidad aprobados técnicamente el 10-nov-2026 y sus tareas creadas: [CORE-01 plan](core/CORE-01-contenedor-erp/plan.md) · [CORE-01 tasks](core/CORE-01-contenedor-erp/tasks.md) y [RH-REQ-01 plan](rrhh/RH-REQ-01-requerimientos/plan.md) · [RH-REQ-01 tasks](rrhh/RH-REQ-01-requerimientos/tasks.md). La **v1.2** de ambos planes (Next.js 16 + React 19 + TypeScript, Node 24 LTS) está **aprobada técnicamente el 10-nov-2026**; la v1.1 (React + TypeScript con Vite) queda como histórica.
