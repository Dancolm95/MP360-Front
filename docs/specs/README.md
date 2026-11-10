# Organización de specs

- `core/` reúne capacidades compartidas del ERP; cada módulo tiene su carpeta (`rrhh/`, y las que se incorporen después).
- Cada capacidad usa una carpeta con el ID de su spec: `<ID>-<nombre>/`. Ejemplo: `rrhh/RH-REQ-01-requerimientos/`.
- `spec.md` define alcance, reglas, actores, vistas, criterios de aceptación, fuentes y dudas abiertas. Es la única spec vigente de esa capacidad.
- `plan.md` describe contratos, responsabilidades técnicas y verificación; solo se crea tras aprobación explícita de la spec y resolución o exclusión expresa de bloqueos del corte. `tasks.md` enumera trabajos trazables y solo se crea desde un plan aprobado.
- Los cambios de requisitos se incorporan primero a `spec.md`, después al plan, las tareas y la implementación. Las decisiones transversales se registran fuera de las specs y se enlazan desde ellas.

## Estado actual

| Capacidad | Estado | Documento |
|---|---|---|
| Requerimientos de personal (RR. HH.) | RH-REQ-01 v0.7, con las cuatro decisiones funcionales de integración Selección/Alta (INT-01), las correcciones de revisión B-01 a B-04 y S-02 a S-04 y las correcciones del segundo ciclo H-01 a H-03 incorporadas; aprobada funcionalmente el 10-nov-2026; P-04 provisional (matriz final externa); sin plan ni tareas | [RH-REQ-01-requerimientos/spec.md](rrhh/RH-REQ-01-requerimientos/spec.md) |
| Contenedor ERP compartido | CORE-01 v0.6, en re-aprobación funcional por el cambio de C-02 (salida voluntaria incluida como requisito); su v0.5 había sido aprobada funcionalmente el 10-nov-2026; bloqueos del corte resueltos o excluidos el 10-nov-2026: C-01/C-03/C-04 contratos al plan, C-02 incluido, C-05 excluido (verificación diferida), P-04 provisional; sin plan ni tareas | [CORE-01-contenedor-erp/spec.md](core/CORE-01-contenedor-erp/spec.md) |
