# Organización de specs

- `core/` reúne capacidades compartidas del ERP; cada módulo tiene su carpeta (`rrhh/`, y las que se incorporen después).
- Cada capacidad usa una carpeta con el ID de su spec: `<ID>-<nombre>/`. Ejemplo: `rrhh/RH-REQ-01-requerimientos/`.
- `spec.md` define alcance, reglas, actores, vistas, criterios de aceptación, fuentes y dudas abiertas. Es la única spec vigente de esa capacidad.
- `plan.md` describe contratos, responsabilidades técnicas y verificación; `tasks.md` enumera trabajos trazables. Ambos viven en la carpeta de la capacidad (`<ID>-<nombre>/`), junto a `spec.md`. Cuando un corte agrupa varias capacidades, cada una tiene su propio plan y se referencian entre sí. `plan.md` solo se crea tras aprobación explícita de la spec y resolución o exclusión expresa de bloqueos del corte; `tasks.md`, solo desde un plan aprobado.
- Los cambios de requisitos se incorporan primero a `spec.md`, después al plan, las tareas y la implementación. Las decisiones transversales se registran fuera de las specs y se enlazan desde ellas.

## Estado actual

| Capacidad | Estado | Documento |
|---|---|---|
| Requerimientos de personal (RR. HH.) | RH-REQ-01 v0.7, aprobada funcionalmente el 10-nov-2026; P-04 provisional (matriz final externa); C-05 diferido; plan de la capacidad en curso (pendiente de aprobación técnica); sin tareas | [spec.md](rrhh/RH-REQ-01-requerimientos/spec.md) · [plan.md](rrhh/RH-REQ-01-requerimientos/plan.md) |
| Contenedor ERP compartido | CORE-01 v0.6, aprobada funcionalmente el 10-nov-2026; bloqueos del corte: C-01/C-03/C-04 contratos al plan, C-02 contrato al plan, C-05 diferido (verificación diferida), P-04 provisional (matriz final externa); plan de la capacidad en curso (pendiente de aprobación técnica); sin tareas | [spec.md](core/CORE-01-contenedor-erp/spec.md) · [plan.md](core/CORE-01-contenedor-erp/plan.md) |

Planes por capacidad en curso (pendientes de aprobación técnica): [CORE-01](core/CORE-01-contenedor-erp/plan.md) y [RH-REQ-01](rrhh/RH-REQ-01-requerimientos/plan.md). `tasks.md` solo se crea tras la aprobación técnica de cada plan.
