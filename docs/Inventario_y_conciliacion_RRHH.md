# Inventario visual y conciliación de fuentes — ERP MP 360 / RR. HH.

**Estado:** revisión inicial para SDD, 9 de noviembre de 2026.  
**Alcance:** frontend administrativo de RR. HH., con base reutilizable para otros módulos. No es una especificación de implementación.

## Fuentes y criterio de uso

| Fuente | Uso en el proyecto |
|---|---|
| [Definición Funcional RR. HH. V2.2](https://docs.google.com/document/d/1LpMOGQDZDIg7oEUBJEHDwJwPIOCOjbM2/edit) | Reglas, actores funcionales, datos y estados. Los acuerdos V2.2 prevalecen sobre las reglas anteriores que modifican; V2.1 sigue vigente donde V2.2 no la sustituye. |
| [Especificación UX/UI RR. HH. V1.2](https://docs.google.com/document/d/15npfsRFguIGtSrLoichEyzuJmOp9Ig9z/edit) | Inventario UX-01 a UX-24, estructura de cada vista, acciones, variantes y estados de interfaz, salvo conflicto con V2.2. |
| [MP360PantallasRRHH.pdf](https://drive.google.com/file/d/1qi3uom74f_ij-nOyPmqLdfuJSXcC6Xw0/view?usp=drivesdk) | Referencia visual del equipo: composición, jerarquía, colores, proporciones y patrones visibles. Contiene 41 páginas de 1920 × 1080 puntos. Las cifras, nombres, estados y textos de ejemplo no son datos ni reglas definitivas. |
| `ERP Front.zip` | Prototipo técnico consultado para decidir qué código y estilos pueden rescatarse; no define requisitos. |

**Decisión de conciliación visual:** el usuario confirmó que las pantallas del equipo deben seguirse visualmente. Por ello, la navegación horizontal y el selector de módulos del PDF gobiernan el diseño del contenedor. La indicación de barra lateral izquierda en UX/UI V1.2 queda registrada como diferencia de layout. Para comportamiento, estados, permisos y datos manda la fuente funcional vigente.

## Inventario de las 41 páginas

“Parcial” significa que la maqueta representa algo de la pantalla, pero no cumple todavía el proceso ni la arquitectura exigidos. “No” indica que no hay una vista equivalente en el ZIP. Las páginas son variaciones de interfaz; no equivalen a 41 funcionalidades independientes.

| Pág. | Pantalla o variación visual | Vista UX | Maqueta ZIP |
|---:|---|---|---|
| 1 | Inicio de sesión | Global, fuera de UX-01–24 | Parcial; credenciales de demo |
| 2 | Selección de perfil | Global | Parcial; perfil sin autorización real |
| 3 | Selección de módulo en pantalla | Global | Parcial; selector implementado de otra forma |
| 4 | Dashboard RR. HH. | UX-01 | Parcial; datos fijos |
| 5 | Dashboard con selector de módulos abierto | UX-01 / global | Parcial |
| 6 | Bandeja de requerimientos | UX-02 | Parcial |
| 7 | Nuevo requerimiento, formulario modal | UX-03 | Parcial |
| 8 | Confirmación de envío de requerimiento | UX-03 | Parcial; confirmación local |
| 9 | Detalle de requerimiento y postulantes | UX-04 | Parcial |
| 10 | Bandeja de candidatos | UX-05 | Parcial |
| 11 | Detalle y evaluación de candidato | UX-06 | Parcial |
| 12 | Bandeja de colaboradores | UX-08, acceso a UX-07 | No |
| 13 | Alta: selección de candidato y requerimiento | UX-07 | Parcial; solo búsqueda |
| 14 | Alta: datos personales y de trabajo | UX-07 | No |
| 15 | Alta: resumen de validaciones | UX-07 | No |
| 16 | Alta: confirmación | UX-07 | No |
| 17 | Ficha de colaborador: resumen | UX-08 | No |
| 18 | Ficha: boletas de pago | UX-08 | No |
| 19 | Ficha: asistencia | UX-08 | No |
| 20 | Bandeja de onboarding, “En curso” | UX-09/10, solo acceso | No |
| 21 | Bandeja de onboarding, “Sin onboarding” | UX-09/10, solo acceso | No |
| 22 | Asignaciones de EPP y equipos | UX-11 | No |
| 23 | Devolución/reposición de EPP | UX-12 | No |
| 24 | Bandeja de licencias y ausencias | UX-13 | No |
| 25 | Registro de licencia/ausencia | UX-14 | No |
| 26 | Detalle y subsanación de licencia | UX-15 | No |
| 27 | Bandeja de offboarding | UX-16 | No |
| 28 | Offboarding: datos y causal | UX-17 | No |
| 29 | Offboarding: checklist y revisión por áreas | UX-17 | No |
| 30 | Offboarding: liquidación | UX-17 | No |
| 31 | Offboarding: confirmación | UX-17 | No |
| 32 | Organización y dotación: resumen | UX-18 | No |
| 33 | Dotación por cliente: estructura de puestos | UX-19 | No |
| 34 | Dotación por cliente: colaboradores activos | UX-19 | No |
| 35 | Dotación por cliente: historial de asignación | UX-19 | No |
| 36 | Calendario de asistencia | UX-22 | No |
| 37 | Bandeja global de gestión documental | UX-23 | No |
| 38 | Generación documental: tipo y colaborador | UX-24 | No |
| 39 | Generación: información del documento | UX-24 | No |
| 40 | Generación: contenido y vista previa | UX-24 | No |
| 41 | Generación: confirmación | UX-24 | No |

## Cobertura de las 24 vistas UX

| Vista | Correspondencia visual | Lectura para el desarrollo |
|---|---|---|
| UX-01 Dashboard | 4–5 | Referencia visual; KPIs y alertas deberán calcularse, no fijarse en HTML. |
| UX-02 Bandeja de requerimientos | 6 | Referencia visual directa. |
| UX-03 Crear/editar requerimiento | 7–8 | Formulario y confirmación; falta variante de edición/observado. |
| UX-04 Detalle y aprobación | 9 | Hay resumen y candidatos; faltan aprobación, observación, cancelación e historial. |
| UX-05 Bandeja de candidatos | 10 | Referencia visual directa, con estados y filtros por completar. |
| UX-06 Detalle/evaluación | 11 | Solo una etapa visual; faltan token, subsanación y variantes operativo/administrativo. |
| UX-07 Alta | 13–16 | Varias etapas visibles; la maqueta solo cubre parte de la primera. |
| UX-08 Ficha y legajo | 12, 17–19 | La ficha tiene referencia; la gestión documental completa exige más estados. |
| UX-09 Iniciar onboarding | 20–21 | Se ve la bandeja y “Crear proceso”; no se ve el formulario de inicio. |
| UX-10 Seguimiento onboarding | 20–21 | Se ve la bandeja; no se ve el detalle de tareas, evidencias y cierre. |
| UX-11 Asignaciones EPP | 22 | Referencia visual directa. |
| UX-12 Reposición/devolución EPP | 23 | Referencia visual de bandeja; no se observa el formulario completo de movimiento. |
| UX-13 Bandeja licencias/ausencias | 24 | Referencia visual directa. |
| UX-14 Registrar/editar licencia | 25 | Referencia visual de registro; variante de edición no visible. |
| UX-15 Detalle/subsanación | 26 | Referencia visual directa. |
| UX-16 Bandeja offboarding | 27 | Referencia visual directa. |
| UX-17 Proceso offboarding | 28–31 | Etapas principales visibles. |
| UX-18 Resumen dotación | 32 | Referencia visual, con responsabilidad de edición por conciliar. |
| UX-19 Detalle dotación | 33–35 | Tres pestañas visibles, con responsabilidad de edición por conciliar. |
| UX-20 Bandeja general de asistencia | Sin página identificada | Hay navegación a Asistencia, licencias y calendario, pero no un resumen general independiente. |
| UX-21 Vacaciones administrativas | Sin página identificada | Requiere diseño visual; V2.2 cambió el aprobador funcional. |
| UX-22 Calendario asistencia | 36 | Referencia visual directa. |
| UX-23 Bandeja documental | 37 | Referencia visual directa. |
| UX-24 Generación documental | 38–41 | Flujo visual disponible; catálogo y condiciones cambiaron en V2.2. |

## Diferencias y decisiones registradas

| ID | Evidencia | Tratamiento propuesto | Estado |
|---|---|---|---|
| D-01 | UX/UI V1.2 pide barra lateral izquierda; PDF usa barra superior con navegación horizontal y selector de módulo. | Seguir el PDF visualmente por indicación expresa del usuario; construir el contenedor como componente común y extensible. | Criterio acordado |
| D-02 | PDF p. 7 omite ubicación y no marca comentario como obligatorio; V2.2 los exige. Sus motivos de ejemplo no sustituyen el catálogo funcional. | Añadir los campos y la validación funcional respetando el patrón visual del formulario. | Regla definida; diseño a adaptar |
| D-03 | PDF p. 6 y 9 usa etiquetas como “Reclutando” y “Urgente”. V2.2 define Borrador, Pendiente de aprobación, Observado, Aprobado, En reclutamiento, Cubierto y Cancelado. | Usar estados funcionales canónicos; “urgente” debe tratarse como nivel de alerta, no como estado. | Regla definida |
| D-04 | PDF p. 9 muestra postulantes y 2 vacantes cubiertas en un requerimiento aún “Pendiente de aprobación”. RN-REQ-02 exige aprobación antes de reclutar. | Tratar las cifras del PDF como ejemplo visual, nunca como escenario válido de prueba. | Regla definida |
| D-05 | PDF p. 9 ofrece “Asociar candidato”; RN-SEL-07 vincula formalmente al candidato al completar sin errores el formulario tokenizado. | Especificar el significado de esa acción antes de implementarla; no crear una vinculación formal anticipada. | Pendiente de detalle funcional |
| D-06 | PDF p. 15–16 presenta confirmación de alta mientras “Alta SUNAT” aparece en proceso. V2.2 la exige realizada antes de confirmar. | Bloquear la confirmación hasta cumplir la validación; conservar el diseño de resumen. | Regla definida |
| D-07 | UX-21 V1.2 atribuye aprobación final de vacaciones a RR. HH.; V2.2 la asigna al superior correspondiente dentro del ERP. | Especificar UX-21 con el aprobador de V2.2 y diseñar la pantalla faltante. | Regla definida; diseño pendiente |
| D-08 | UX-18/19 y PDF p. 32–33 muestran edición de dotación desde RR. HH.; V2.2 asigna registro y cambios a Operaciones, con consulta de solo lectura para RR. HH. | Mantener visual de consulta; mostrar edición solo bajo capacidad de Operaciones. | Regla definida; variante visual pendiente |
| D-09 | UX-24 y PDF p. 38 muestran catálogo anterior; V2.2 consolida nueve documentos, admite generación excepcional para excolaboradores y aún espera las plantillas oficiales. | No cerrar campos dinámicos, firmantes ni catálogo visual final hasta recibir plantillas y conciliar UX-24. | Bloqueo documental |
| D-10 | V2.2 indica que la matriz técnica final de roles y permisos depende de otra área. | Diseñar vistas de lectura/sin permisos y usar capacidades configurables; no codificar permisos basados solo en nombres de perfiles del PDF. | Dependencia externa |

## Implicaciones para una base modular

1. **Contenedor común del ERP:** identidad, selector de módulos, navegación horizontal, área central y panel contextual derecho según el PDF. Las rutas y permisos de cada módulo se registran, no se escriben como condiciones dispersas en cada pantalla.
2. **Sistema visual compartido:** tipografía, color, espacios, tablas, filtros, formularios, badges, diálogos, mensajes y estados. Su aplicación se verifica contra el PDF; los textos y datos de muestra no son fuente de verdad.
3. **Módulos de dominio:** RR. HH. encapsula requerimientos, reclutamiento, colaboradores, onboarding, EPP, asistencia, offboarding, dotación y gestión documental. Otros módulos reutilizan el contenedor y los componentes sin depender de `features.js`.
4. **Datos y backend:** contratos de lectura/escritura, manejo uniforme de carga/error, autorización y auditoría. Los mocks se sustituyen por adaptadores con el mismo contrato y datos coherentes, sin almacenar información sensible de producción en `localStorage`.
5. **Verificación SDD:** cada funcionalidad debe vincular regla funcional, vista UX, página PDF, contrato de datos y criterio de aceptación. Las diferencias D-01 a D-10 se resuelven explícitamente, sin pedir a Codex que adivine.

## Primer corte recomendado

Contenedor común + **Requerimientos (UX-02/03/04; PDF p. 6–9)**. El dashboard depende de datos de varios procesos y conviene integrarlo después. El primer corte debe demostrar navegación, estados, permisos, validaciones, adaptación visual y pruebas con una operación completa.
