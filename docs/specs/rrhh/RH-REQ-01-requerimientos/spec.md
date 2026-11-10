# Especificación SDD — Requerimientos de personal

**ID:** RH-REQ-01  
**Versión:** 0.7, con las decisiones funcionales de integración Selección/Alta (INT-01) incorporadas, las correcciones de revisión B-01 a B-04 y S-01 a S-04 aplicadas y las correcciones del segundo ciclo H-01 a H-03 aplicadas  
**Estado:** Aprobada funcionalmente el 10 de noviembre de 2026 por confirmación explícita del usuario. No implica aprobación de la spec `core`, de contratos ni del plan que se acuerde para el corte.  
**Fecha:** 9 de noviembre de 2026  
**Corte propuesto:** UX-02, UX-03 y UX-04 integradas con el contenedor compartido del ERP. La definición del contenedor es una [capacidad `core` separada](../../README.md), ya especificada en CORE-01 v0.6 (aprobada funcionalmente el 10-nov-2026).

## 1. Fuentes, trazabilidad y objetivo

- [Definición Funcional RR. HH. V2.2](https://docs.google.com/document/d/1LpMOGQDZDIg7oEUBJEHDwJwPIOCOjbM2/edit): secciones 6 y 7; RN-REQ-01 a RN-REQ-15 y RN-SEL-07.
- [Especificación UX/UI RR. HH. V1.2](https://docs.google.com/document/d/15npfsRFguIGtSrLoichEyzuJmOp9Ig9z/export?format=txt): UX-02, UX-03, UX-04, §8 (patrones transversales) y §12 (handoff); contrastadas directamente el 9 de noviembre de 2026. Sus diferencias con V2.2 y las decisiones del usuario se concilian en esta spec.
- [MP360PantallasRRHH.pdf](https://drive.google.com/file/d/1qi3uom74f_ij-nOyPmqLdfuJSXcC6Xw0/view?usp=drivesdk): páginas 6 (bandeja), 7 (formulario), 8 (confirmación) y 9 (detalle). Sus datos de ejemplo no son requisitos.
- [Inventario y conciliación](../../../Inventario_y_conciliacion_RRHH.md): D-01 a D-05 y D-10.
- Decisiones funcionales transmitidas por el usuario el 9 de noviembre de 2026: cómputo y ajuste posterior de plazos, vencimiento, alertas históricas, revisión previa al envío, cobertura y reversión, apertura de Selección, conflictos de versión, validaciones, bandeja y contrato provisional de autorización; además, confirmación al descartar cambios no guardados y presentación de duración sin fecha objetivo definitiva antes de aprobar.
- Decisiones funcionales de integración Selección/Alta (INT-01) transmitidas por el usuario el 9 de noviembre de 2026: apertura del proceso confirmada por Selección antes de cambiar de estado, iniciada por RR. HH. con capacidad desde un requerimiento Aprobado mediante la acción explícita «Abrir proceso en Selección»; primer día real registrado por Alta y consumido en solo lectura para la cobertura; reversión de cobertura originada por evento auditado de Selección; y ajuste trazable de la remuneración previo al alta, sin trasladar a Alta la excepción `0.00` de Practicante, que conserva su validación >0 sin excepción y no confirma el ingreso con importe `0.00`.
- Correcciones de revisión aplicadas el 9 de noviembre de 2026 sobre la v0.5: B-01 (UX-07 mantiene >0 sin excepción y no confirma con `0.00`), B-02 (acción explícita «Abrir proceso en Selección» desde Aprobado, con error reintentable en Requerimientos), B-03 (el primer día real solo alimenta cobertura y se muestra en solo lectura) y B-04 (criterio verificable de solicitud de reversión); además S-02, S-03 y S-04.
- Correcciones del segundo ciclo de revisión aplicadas el 9 de noviembre de 2026 sobre la v0.6: H-01 (en §7.3 el primer día real se muestra en solo lectura y no se edita; el ajuste de remuneración previo al alta no se edita y, si se muestra, es de solo lectura, sin alterar con ello fecha objetivo ni cómputo de plazos), H-02 (la forma de planificación no se prejuzga: se habla del plan que se acuerde para el corte) y H-03 («Abrir proceso en Selección» se incorpora a los comandos versionados y a su criterio verificable).

**Objetivo:** registrar una necesidad de personal, someterla a aprobación del Jefe de Operaciones y seguir su cobertura hasta cubrir todas las vacantes o cancelar el requerimiento.

## 2. Alcance y exclusiones

Incluye:

1. Bandeja con filtros, orden, paginación, cobertura parcial y acceso al detalle.
2. Creación, edición permitida, revisión completa, guardado de borrador, envío y reenvío a aprobación.
3. Detalle, historial, plazos y alertas, aprobación, observación y cancelación según capacidades.
4. Fijación y ajuste posterior por RR. HH. del plazo administrativo de seguimiento, separado de los datos aprobados, bajo las reglas de esta spec.
5. Seguimiento de cobertura confirmada por integración —el primer día real solo alimenta la cobertura y se muestra en solo lectura— y presentación del resultado de una reversión originada por Selección y solicitada por RR. HH.
6. Apertura del proceso de Selección mediante la acción explícita «Abrir proceso en Selección» de RR. HH. con capacidad desde un requerimiento Aprobado, reflejo del paso a En reclutamiento solo tras la confirmación de Selección, error reintentable que mantiene el estado Aprobado y presentación de sus resultados permitidos, sin administrar aquí el vínculo de candidatos.
7. Estados de interfaz, conflictos de versión, accesibilidad y comparación visual de las páginas 6–9.

No incluye:

- La gestión de candidatos, el vínculo formal regido por RN-SEL-07 y la desvinculación con su auditoría, que pertenecen a Selección.
- El registro del primer día real y el ajuste de la remuneración previo al alta, que pertenecen a Alta; RH-REQ-01 solo consume su resultado permitido por integración.
- La gestión del alta, notificaciones por correo, generación de documentos o cálculo del dashboard.
- La definición del contenedor ERP, identidad, navegación global, selector de módulos ni políticas transversales. RH-REQ-01 solo se integra con la spec `core` correspondiente (CORE-01).
- La política final de ámbitos y permisos, que sigue siendo una dependencia externa; este corte usa el contrato provisional autorizado en la sección 3.

## 3. Actores, ámbitos y autorización provisional

| Actor funcional | Capacidades funcionales documentadas |
|---|---|
| Gerente General | Crear requerimientos y consultar los registros que el backend incluya en su ámbito. |
| Coordinador / Jefe de Área | Crear y seguir los registros que el backend incluya en su ámbito. |
| Jefe de Operaciones | Crear; aprobar u observar pendientes; cancelar cuando el estado y las capacidades lo permitan. Es siempre el aprobador. |
| Creador | Editar en Borrador, Pendiente de aprobación u Observado; reenviar un Observado; cancelar hasta En reclutamiento cuando la capacidad esté concedida. |
| RR. HH. | Consultar y seguir cobertura; fijar/modificar el plazo administrativo de seguimiento de un Administrativo; abrir el proceso de Selección desde un requerimiento Aprobado mediante la acción explícita «Abrir proceso en Selección»; navegar al proceso ya creado desde «Asociar candidato» cuando el requerimiento está En reclutamiento; solicitar la reversión de coberturas erróneas, siempre según las capacidades recibidas. |

Contrato provisional autorizado para este corte:

1. El backend limita los registros consultables al ámbito efectivo del usuario; el frontend no deduce ni amplía ámbitos por el nombre del rol.
2. Cada requerimiento devuelve las capacidades o acciones permitidas para ese usuario y esa versión.
3. El frontend presenta las acciones a partir de esas capacidades y contempla lectura o estado sin permisos.
4. El backend revalida autorización, ámbito, estado y versión en cada comando. Ocultar una acción no constituye autorización.

La matriz y política técnica final de roles, ámbitos y permisos continúa como dependencia externa P-04.

## 4. Datos y validaciones

| Campo | Regla al enviar a aprobación |
|---|---|
| Motivo | Obligatorio. Catálogo canónico: Reemplazo, Nueva Vacante, Practicante, Otros. |
| Empresa | Obligatoria; proviene del catálogo del consorcio. |
| Colaborador a reemplazar | Obligatorio cuando Motivo = Reemplazo. |
| Departamento → Área/Subárea → Puesto | Obligatorios; selecciones jerárquicas de catálogos. |
| Clasificación Operativo/Administrativo | Derivada de Puesto y Área/Subárea; no es libre. |
| Cantidad de vacantes | Entero mayor o igual que 1. |
| Remuneración mensual | Obligatoria en PEN, no negativa y con máximo dos decimales. Solo Motivo = Practicante admite `0.00`; los demás motivos exigen un valor mayor que cero. |
| Ubicación | Departamento → Provincia → Distrito, obligatorios. |
| Usuario de próxima tarea | Jefe de Operaciones seleccionado por defecto; obligatorio. |
| Comentario/justificación | Obligatorio. |

Un borrador puede estar incompleto. Guardarlo persiste realmente los valores admitidos por el contrato y solo se confirma después de la respuesta del backend. Un fallo conserva el contenido introducido y no se sustituye información ausente por datos ficticios.

La remuneración aprobada queda como referencia para Selección y Alta (RN-REQ-14/15). RH-REQ-01 no ofrece edición directa de los datos aprobados del requerimiento (RN-REQ-05); ajustar el plazo administrativo de seguimiento conforme a 5.1 no edita esos datos. El ajuste de la remuneración previo al alta corresponde a Alta, con trazabilidad propia (decisión INT-01); RH-REQ-01 no lo edita, no lo duplica ni altera con él los datos aprobados del requerimiento.

**Conciliación de remuneración:** UX-03 V1.2 pide monto mayor que cero para todo requerimiento; V2.2 §6.3 solo lo declara obligatorio, sin mínimo. La excepción `0.00` exclusivamente para Motivo = Practicante y el formato PEN/no negativo/hasta dos decimales son decisiones expresas del usuario para **RH-REQ-01**; prevalecen aquí sobre la validación >0 general de UX-03. Esa excepción es exclusiva de RH-REQ-01 y **no se traslada** a UX-07/Alta (decisión INT-01): Alta mantiene la validación >0 de UX-07 **sin excepción** y **no confirma el ingreso mientras el importe siga en `0.00`**; antes de confirmar, el importe debe ajustarse con la trazabilidad propia de Alta, y el requerimiento aprobado no se modifica con ese ajuste. La validación concreta, los mensajes y el contrato de ese ajuste pertenecen a Alta y al plan; esta spec no los define.

## 5. Plazos y alertas

### 5.1 Cómputo

- El plazo comienza cuando el Jefe de Operaciones aprueba; la fecha de aprobación es el día 0.
- Se cuentan días hábiles según un único calendario laboral configurado en el ERP.
- Si la aprobación ocurre en día no hábil, el día 1 es el siguiente día hábil del calendario.
- Para personal Operativo, el objetivo es 10 días hábiles.
- Para personal Administrativo, RR. HH. debe fijar un plazo entero entre 15 y 30 días hábiles antes de la aprobación. Si falta o está fuera de rango, el comando de aprobación se rechaza y el requerimiento permanece Pendiente de aprobación.
- Antes de la aprobación no existe una fecha objetivo definitiva: el formulario, la bandeja y el detalle muestran la duración aplicable (Operativo: 10 días hábiles; Administrativo: plazo fijado por RR. HH. o «pendiente de definir») y explican que la fecha objetivo se calcula al aprobar. No se deriva una fecha de una aprobación hipotética; sin fecha de aprobación, la columna «Fecha objetivo» no presenta una fecha.
- Solo para personal Administrativo y solo en Aprobado o En reclutamiento, RR. HH. puede ajustar el plazo administrativo de seguimiento a un entero entre 15 y 30 días hábiles, con motivo obligatorio. No está disponible en Cubierto ni Cancelado ni para personal Operativo, cuyo objetivo permanece en 10 días hábiles. Es una operación auditada separada: no modifica el requerimiento aprobado ni su fecha de aprobación original (RN-REQ-05). El historial conserva fecha/hora, actor, motivo, valor y fecha objetivo anteriores y nuevos.
- Tras cada ajuste, la fecha objetivo vigente se recalcula desde la aprobación original (mismo día 0 y mismo calendario único), no desde la fecha del ajuste. La alerta y el cumplimiento visibles se recalculan con el nuevo plazo; los eventos históricos de alertas y vencimientos conservan sus fechas y no se borran ni se reescriben. Este recálculo no constituye un envío de correo ni permite mostrar uno que no ocurrió.
- El día objetivo aún está dentro del plazo: con pendientes, el incumplimiento comienza **al iniciar el siguiente día computable** después del día objetivo (para Operativo, después del día hábil 10; para Administrativo, después del día hábil `n`). No cambia automáticamente el estado del requerimiento. Alcanzar un umbral de alerta no equivale a vencimiento.
- El primer día real no se registra ni se edita en RH-REQ-01: lo aporta Alta y esta capacidad solo lo consume para la cobertura, mostrándolo en solo lectura. No altera la fecha objetivo ni el cómputo de plazos de esta sección, que sigue rigiéndose por la fecha de aprobación (decisión INT-01).

### 5.2 Umbrales

| Tipo | Temprana | Media | Crítica |
|---|---:|---:|---:|
| Operativo, 10 días hábiles | Día hábil 5 | Día hábil 7 | Día hábil 9 |
| Administrativo, plazo `n` | Primer día hábil con transcurrido ≥ 50 % de `n` | Primer día hábil con transcurrido ≥ 75 % de `n` | Primer día hábil con transcurrido ≥ 90 % de `n` |

En el caso administrativo, el día umbral equivale a redondear hacia arriba cada porcentaje. La alerta vigente se calcula con el plazo vigente (incluso tras un ajuste), se identifica con texto e icono además de color y es distinta del incumplimiento. Los destinatarios funcionales son Líder de RR. HH. en temprana; además Jefe de Operaciones en media; y además Gerente General en crítica. En este corte la alerta es visible en el ERP; no se incluye correo.

## 6. Estados, transiciones y concurrencia

| Origen | Evento válido | Destino / resultado |
|---|---|---|
| Borrador | Enviar desde “Revisión y envío”, con validación completa | Pendiente de aprobación |
| Pendiente de aprobación | Editar el creador | Permanece Pendiente de aprobación y genera una nueva versión |
| Pendiente de aprobación | Observar el Jefe de Operaciones con comentario | Observado |
| Pendiente de aprobación | Aprobar el Jefe de Operaciones; si es Administrativo debe existir plazo válido | Aprobado; la aprobación no inicia por sí sola el reclutamiento |
| Observado | Corregir y reenviar desde “Revisión y envío” | Pendiente de aprobación, con nuevo evento de historial |
| Aprobado | RR. HH. con capacidad inicia «Abrir proceso en Selección» y Selección confirma la creación del proceso correspondiente; solo con esa confirmación | En reclutamiento, automáticamente y sin cambio optimista |
| En reclutamiento | Alta confirma el primer día real de un colaborador y quedan vacantes pendientes | Permanece En reclutamiento y recalcula cobertura |
| En reclutamiento | Alta confirma el primer día real que completa todas las vacantes | Cubierto |
| Cubierto | Selección emite el evento auditado de reversión de una cobertura errónea y vuelven a existir pendientes | En reclutamiento, automáticamente |
| Aprobado o En reclutamiento (Administrativo) | RR. HH. ajusta el plazo administrativo de seguimiento con motivo | Mantiene el estado; recalcula fecha objetivo, alerta y cumplimiento visibles sin editar datos aprobados |
| Borrador, Pendiente, Observado, Aprobado o En reclutamiento | Cancelar un actor autorizado con confirmación y causal válida | Cancelado |

Reglas complementarias:

- Las causales documentadas de cancelación son menor carga laboral que la prevista y creación por error.
- La apertura del proceso no se aplica de forma optimista: RR. HH. con capacidad la inicia desde el detalle de un requerimiento Aprobado mediante la acción explícita «Abrir proceso en Selección». Si la confirmación de Selección falla, el requerimiento permanece Aprobado, Requerimientos muestra el error y el reintento parte de la misma acción. No se presenta En reclutamiento ni se habilita su seguimiento antes de la confirmación.
- Una vacante aumenta `cubiertas` solo al confirmarse el primer día real del colaborador, registrado por Alta. Completar el alta antes de ese día no cuenta. RH-REQ-01 no edita ni sustituye ese dato y lo muestra en solo lectura; el primer día real no altera la fecha objetivo ni el cómputo de plazos.
- `pendientes = solicitadas − cubiertas`. Toda confirmación o reversión recalcula solicitadas, cubiertas y pendientes.
- La reversión de una cobertura errónea la origina un evento de Selección con motivo obligatorio y auditoría; RH-REQ-01 recalcula estado y cobertura sin editar los datos aprobados del requerimiento. RR. HH. con capacidad puede solicitarla desde el seguimiento con motivo obligatorio, y solo refleja el resultado confirmado: los contadores no cambian hasta que el evento de Selección se confirma, y un rechazo o un fallo conserva el estado, informa y permite reintentar. La solicitud y el evento confirmado quedan auditados. El contrato técnico del evento pertenece al plan.
- Si la reversión ocurre mientras todavía había pendientes, el requerimiento permanece En reclutamiento; si estaba Cubierto y reaparecen pendientes, retorna a En reclutamiento.
- El ajuste de la remuneración previo al alta pertenece a Alta, con trazabilidad propia; no es una edición de los datos aprobados en RH-REQ-01. Alta no hereda la excepción `0.00` de Practicante (véase §4): mantiene la validación >0 sin excepción y no confirma el ingreso mientras el importe siga en `0.00`, por lo que el ajuste trazable es obligatorio antes de confirmar.
- RN-SEL-07 regula el vínculo formal del candidato; la desvinculación y su auditoría pertenecen a Selección. Requerimientos solo consume el resultado permitido por integración.

Para **cualquier comando versionado de este corte** (entre otros, editar/guardar, enviar o reenviar, fijar/ajustar plazo, abrir proceso en Selección, cancelar, solicitar la reversión de cobertura, aprobar y observar), una versión desactualizada se rechaza sin persistir cambio alguno. El ERP conserva la entrada del usuario, informa del conflicto, muestra los datos vigentes y permite revisar y decidir de nuevo antes de reintentar; nunca sobrescribe automáticamente los datos vigentes. Esto incluye el caso de edición de un Pendiente mientras el aprobador veía una versión anterior. Un conflicto no produce un correo de acción no realizada.

## 7. Vistas y comportamiento

### 7.1 UX-02 — Bandeja (PDF p. 6)

- Filtros: Estado, Motivo, Empresa, Área/Subárea, Puesto, Solicitante y periodo. El periodo se aplica a la fecha de aprobación: sin esa fecha, el requerimiento no coincide con ningún rango activo; sin filtro de periodo permanece visible según los demás filtros y permisos.
- Los filtros se conservan durante la sesión autenticada, incluida la navegación y la recarga, y se limpian al cerrar sesión. No se almacenan datos sensibles en `localStorage`.
- Columnas: ID, fecha de creación, motivo, empresa, puesto, solicitadas, cubiertas, pendientes, estado, fecha objetivo y responsable. Responsable es el usuario asignado a la próxima tarea; si no hay tarea pendiente **o** no hay asignación, muestra «Sin asignar» (no se infiere otro actor).
- El orden inicial es fecha de creación descendente, con ID como desempate estable. Todas las columnas visibles son ordenables; en cualquiera de ellas, los valores ausentes van al final tanto en ascendente como en descendente, con ID como desempate estable.
- Estado y alerta son conceptos distintos. Se muestran estados canónicos; “Urgente” solo puede representarse como alerta.
- Nuevo, Detalle, Editar y Cancelar dependen de las capacidades recibidas. Paginación y total corresponden a la misma consulta filtrada y ordenada.
- Además de la acción «Detalle», cada fila disponible permite abrir el detalle correspondiente mediante una interacción accesible por teclado; se conserva el contexto de la bandeja al entrar y regresar.

### 7.2 UX-03 — Crear, editar, revisar y enviar (PDF p. 7–8)

- El formulario sigue el patrón visual de la página 7, incorpora ubicación y presenta comentario como obligatorio.
- Cambiar Departamento organizacional limpia Área/Subárea y Puesto incompatibles; cambiar Área/Subárea limpia el Puesto incompatible. La ubicación mantiene su propia jerarquía Departamento → Provincia → Distrito.
- Colaborador a reemplazar solo aparece cuando Motivo = Reemplazo. Clasificación y plazo aplicable se muestran sin convertirlos en valores libres.
- Antes de aprobar, el plazo se presenta como duración, no como fecha objetivo definitiva; Operativo muestra 10 días hábiles y Administrativo el plazo fijado por RR. HH. o que está pendiente. Se avisa que la fecha objetivo se calculará tras la aprobación. Se concilia así el texto «Fecha objetivo» de UX-03 V1.2 con el inicio del cómputo al aprobar.
- En Observado, antes de corregir se muestra al creador el comentario de observación del Jefe de Operaciones, sin ocultarlo tras la entrada en edición.
- “Revisión y envío” muestra todos los datos y todos los errores de validación antes de enviar. El envío o reenvío a aprobación solo se ejecuta desde esta pantalla.
- Acciones de revisión: **Volver a editar**, **Guardar borrador** y **Enviar a aprobación**.
- Volver a editar conserva exactamente todos los valores introducidos, incluidos los aún no persistidos. Guardar borrador sí exige persistencia real y no muestra éxito antes de confirmarla el backend.
- «Cancelar edición» es distinto de «Guardar borrador» y de «Cancelar requerimiento» (transición de estado con causal). Si hay cambios no guardados, solicita confirmar su descarte: al aceptarlo regresa al contexto anterior sin guardar; al rechazarlo permanece en el formulario con los valores intactos. No cancela el requerimiento ni afirma persistencia. El diálogo sigue las reglas de foco y teclado de §8.
- La confirmación posterior al envío muestra ID, resumen, responsable y estado devueltos por el backend. No se ofrece “Enviar por correo” en este corte.

### 7.3 UX-04 — Detalle y aprobación (PDF p. 9)

- Muestra resumen en lectura, remuneración, solicitadas/cubiertas/pendientes, plazo, alertas e historial.
- El historial presenta usuario, fecha/hora, acción, estado anterior/nuevo y comentario cuando corresponda; el ajuste de plazo conserva motivo, valor y fecha objetivo anteriores y nuevos, junto con eventos históricos de alertas y vencimientos con sus fechas originales.
- Aprobar, Observar y Cancelar solo aparecen según estado y capacidades. Observar exige comentario; cancelar exige confirmación y causal.
- Para un administrativo pendiente, RR. HH. puede fijar el plazo. La aprobación informa y rechaza la ausencia o invalidez de ese plazo. En Aprobado o En reclutamiento, RR. HH. puede ajustar **solo el plazo administrativo de seguimiento de un Administrativo**, con motivo; en Cubierto, Cancelado y para personal Operativo no se ofrece esa acción.
- «Abrir proceso en Selección» es la acción explícita de RR. HH. con capacidad desde el detalle de un requerimiento **Aprobado**: inicia la creación del proceso en Selección. Mientras Selección no confirme, el requerimiento permanece Aprobado; el error se muestra en Requerimientos con opción de reintentar la misma acción, sin cambio optimista ni datos de seguimiento simulados.
- “Asociar candidato” no crea preasignación, proceso ni vínculo en Requerimientos: para RR. HH. con capacidad y solo cuando el requerimiento está En reclutamiento, navega al proceso de Selección ya creado.
- El requerimiento no se presenta como En reclutamiento hasta que Selección confirma la creación del proceso. Mientras no exista esa confirmación permanece Aprobado; el error y el reintento se gestionan en Requerimientos, sin cambio optimista ni datos de seguimiento simulados.
- La zona de candidatos solo consume/muestra resultados que permita el contrato de Selección. Las acciones de vincular o desvincular y su auditoría no pertenecen a esta vista.
- El primer día real se muestra en esta vista en solo lectura y no se edita aquí: lo registra Alta. No altera la fecha objetivo ni el cómputo de plazos. El ajuste de remuneración previo al alta pertenece a Alta y no se edita en esta vista; si se muestra, es de solo lectura. Alta no confirma el ingreso mientras la remuneración siga en `0.00`.
- RR. HH. con capacidad puede solicitar la reversión de cobertura desde el seguimiento; debe introducir el motivo obligatorio y recibe el resultado persistido o el rechazo/fallo, que conserva el estado y permite reintentar. La reversión efectiva la origina un evento auditado de Selección; los contadores no cambian hasta ese evento confirmado, y esta vista solo refleja el resultado confirmado y recalcula la cobertura sin editar los datos aprobados.
- «Volver a bandeja» recupera el contexto previo a la entrada al detalle: filtros, orden y página si aplica, sin perder la persistencia de filtros durante la sesión definida para UX-02.

## 8. Estados de interfaz, errores y accesibilidad

Cada vista aplicable diferencia de manera observable:

1. carga, sin presentar datos anteriores como vigentes;
2. lista vacía y filtros sin resultados;
3. fallo de lectura o escritura, con explicación y reintento cuando corresponda;
4. lectura o acción sin permisos;
5. conflicto de versión, incluido el flujo explícito de recarga y nueva decisión;
6. éxito solo después de persistencia confirmada.

Los fallos de validación muestran simultáneamente todos los errores detectados, con resumen y asociación al control correspondiente; el foco se dirige de forma predecible al primer error. Los datos introducidos se conservan ante errores de validación, persistencia o conflicto.

Formulario, revisión, filtros, tabla, orden, paginación, acciones y diálogos se operan por teclado. Los controles tienen nombre accesible, estado y error comunicables; el indicador de orden se expone semánticamente; las alertas no dependen solo del color. Los diálogos gestionan el foco dentro de ellos mientras están abiertos, permiten cerrarse por el mecanismo previsto y devuelven el foco al control que los abrió.

## 9. Contratos e integraciones pendientes

Sin fijar rutas HTTP, nombres técnicos ni stack, el plan futuro deberá definir contratos para:

- catálogos, jerarquías y calendario laboral único;
- consulta filtrada, ordenada y paginada; detalle e historial;
- borrador, revisión, envío/reenvío, aprobación/observación, cancelación y modificación de plazo;
- versión del recurso y rechazo sin persistencia de todos los comandos versionados sobre versiones desactualizadas, con datos vigentes y entrada conservada para revisión/reintento;
- ajuste auditado del plazo administrativo independiente de los datos aprobados, recálculo de objetivo/alerta/cumplimiento y conservación de eventos históricos con sus fechas;
- capacidades por requerimiento y aplicación backend de ámbito/autorización conforme al contrato provisional;
- acción explícita «Abrir proceso en Selección» desde un requerimiento Aprobado y confirmación de Selección de la creación del proceso que habilita Aprobado → En reclutamiento, con resultado confirmado, error mostrado en Requerimientos y reintento de la misma acción sin cambio optimista;
- navegación desde “Asociar candidato” al proceso ya creado y resultados de vínculo/desvínculo que Requerimientos puede mostrar;
- confirmación del primer día real por Alta, consumo de solo lectura en Requerimientos solo para cobertura, sin efecto en fecha objetivo ni cómputo de plazos, y evento auditado de reversión originado en Selección con la solicitud de RR. HH.;
- ajuste trazable de remuneración previo al alta, propiedad de Alta, con validación >0 sin excepción y sin trasladar a esa vista la excepción `0.00` de Practicante;
- errores de validación, autorización, estado, versión e integración.

Esta spec no fija esos contratos ni resuelve sus casos límite. Se declaran expresamente como parte del contrato del plan: la duplicidad o reintento de la apertura del proceso, la concurrencia entre la confirmación de Selección, el evento de reversión y las confirmaciones de primer día real de Alta, la solicitud de reversión rechazada o fallida, y la trazabilidad y auditoría de cada una de esas operaciones. El plan deberá resolverlos sin alterar las reglas funcionales definidas aquí.

Los mocks, si se autorizan posteriormente, deberán respetar los mismos contratos y escenarios y no sustituir persistencia ni autorización real.

## 10. Criterios de aceptación verificables

1. Un usuario con capacidad puede guardar un borrador incompleto y, tras reabrirlo, obtiene exactamente los valores confirmados por backend; un fallo de guardado conserva los valores en pantalla y no muestra éxito.
2. “Revisión y envío” presenta todos los datos y todos los errores; solo desde ella puede enviarse. Volver a editar conserva incluso cambios no persistidos, y guardar borrador aplica persistencia real.
3. El envío rechaza vacantes no enteras o menores que 1; remuneración negativa, con más de dos decimales o distinta de PEN; `0.00` se acepta exclusivamente para el motivo canónico Practicante y los demás motivos exigen más de cero.
4. La aprobación registra día 0 y el cómputo usa días hábiles del calendario único. Si se aprueba en día no hábil, el día 1 es el siguiente hábil.
5. Un Operativo aprobado obtiene objetivo de 10 días hábiles y alertas en los días 5, 7 y 9. Para un Administrativo de 17 días, los umbrales se alcanzan por primera vez en los días hábiles 9, 13 y 16; ninguno de esos umbrales constituye vencimiento.
6. Un Administrativo sin plazo entero entre 15 y 30 no puede aprobarse y permanece Pendiente. RR. HH. puede fijarlo antes de aprobar y ajustarlo, con motivo y dentro del mismo rango, solo en Aprobado o En reclutamiento; no puede ajustarlo en Cubierto ni Cancelado ni editar directamente los datos aprobados.
7. Al ajustar un Administrativo de 17 a 20 días, la fecha objetivo pasa del día hábil 17 al 20 contado desde la **misma aprobación original**, incluso si el ajuste se hace después del primer objetivo; historial conserva actor, fecha/hora, motivo, ambos valores y ambas fechas objetivo. La alerta y cumplimiento visibles reflejan el plazo 20; los eventos históricos de alerta y vencimiento conservan fecha original y no se borran ni se presentan como correos enviados por el recálculo.
8. Aprobar deja el requerimiento Aprobado. Solo «Abrir proceso en Selección» iniciada por RR. HH. con capacidad y la posterior confirmación de Selección de la creación del proceso lo cambian a En reclutamiento. Si esa confirmación falla, permanece Aprobado, Requerimientos informa el error y la misma acción puede reintentarse; no se muestra el nuevo estado de forma optimista.
9. Completar el alta antes del primer día real no incrementa cubiertas. El primer día real lo registra Alta y Requerimientos solo lo consume para la cobertura y lo muestra en solo lectura: no altera la fecha objetivo ni el cómputo de plazos. Tras confirmar primeros días, solicitadas, cubiertas y pendientes reflejan exactamente las confirmaciones con `pendientes = solicitadas − cubiertas`, el estado solo pasa a Cubierto al llegar a cero pendientes, la fecha objetivo permanece sin cambio y el primer día real se ve en solo lectura.
10. La reversión de una cobertura solo procede por un evento de Selección con motivo y auditoría; los contadores se recalculan, un Cubierto con nuevas pendientes retorna automáticamente a En reclutamiento y los datos aprobados del requerimiento no se editan.
11. “Asociar candidato” solo está disponible para RR. HH. con capacidad en En reclutamiento y navega al proceso ya creado en Selección sin crear proceso ni vínculo en Requerimientos; los vínculos y desvínculos mostrados proceden de Selección.
12. Para editar/guardar, enviar/reenviar, fijar/ajustar plazo, abrir proceso en Selección, cancelar, solicitar la reversión de cobertura, aprobar y observar, una versión antigua se rechaza sin persistir, conserva la entrada, muestra los datos vigentes y permite una nueva decisión/reintento tras revisarlos; no sobrescribe ni simula un correo enviado.
13. La bandeja filtra el periodo por fecha de aprobación: con rango activo excluye requerimientos sin esa fecha; sin filtro los muestra si cumplen los demás filtros y permisos. El responsable es el usuario asignado a la próxima tarea, o «Sin asignar» cuando no exista tarea pendiente o asignación. El orden inicial es creación descendente; toda columna permite ascendente/descendente, con ausentes al final en ambos sentidos e ID como desempate estable.
14. Los filtros sobreviven a navegación y recarga dentro de la sesión autenticada, se limpian al cerrar sesión y no exponen datos sensibles en `localStorage`.
15. Carga, vacío, sin resultados, error recuperable, sin permisos, conflicto y éxito persistido pueden verificarse por separado en las vistas afectadas.
16. Un usuario sin capacidad no ve la acción correspondiente y un intento directo es rechazado por backend; los registros consultados ya vienen limitados por el ámbito del backend.
17. El flujo completo de crear → revisar → enviar → aprobar/observar, los filtros, el orden y los diálogos se completa solo con teclado; foco, nombres, errores, orden y alertas cumplen lo definido en la sección 8.
18. Las páginas 6–9 se comparan visualmente con su referencia de 1920 × 1080 y se documentan resultados. Son diferencias funcionales intencionales: ubicación y comentario obligatorio en p. 7; revisión previa no dibujada y ausencia de correo en p. 8; columnas de cobertura y estados canónicos en p. 6; y en p. 9 acciones reales, historial, cobertura válida y derivación a Selección sin reproducir el escenario de ejemplo incompatible.
19. Con vacantes pendientes, los días objetivo 10 (Operativo) y `n` (Administrativo) aún figuran en plazo; el incumplimiento aparece al comenzar el siguiente día computable y no cambia automáticamente el estado. Alertas y vencimiento se comunican con texto/icono además de color; una alerta de umbral no equivale a incumplimiento.
20. En UX-03, «Cancelar edición» con cambios no guardados ofrece confirmación: rechazarla deja formulario y valores intactos; aceptarla vuelve al contexto anterior sin persistir ni cambiar el estado del requerimiento. Guardar borrador persiste solo tras confirmación del backend; «Cancelar requerimiento» exige capacidad, confirmación y causal y ejecuta una transición distinta.
21. Al abrir un Observado para corregirlo, el creador ve primero el comentario de observación del Jefe de Operaciones; puede consultarlo en el formulario antes de modificar y reenviar.
22. Desde UX-04, «Volver a bandeja» restaura filtros, orden y página previamente aplicados (si hay paginación), y presenta la misma consulta contextual en UX-02.
23. En UX-02, una fila disponible abre su detalle mediante teclado y mediante interacción con la fila, sin depender exclusivamente de la acción «Detalle»; la entrada y regreso conservan el contexto de la bandeja.
24. En Borrador, Pendiente de aprobación y Observado no se muestra fecha objetivo definitiva: UX-03 y el seguimiento muestran duración de 10 días hábiles para Operativo o duración administrativa fijada por RR. HH. (o pendiente de definir), y avisan del cálculo posterior a aprobación; UX-02 no muestra una fecha objetivo sin aprobación. Solo después de aprobar se presenta la fecha calculada desde el día 0 efectivo, sin usar una fecha hipotética.
25. Un requerimiento Practicante con remuneración `0.00` conserva esa excepción solo en RH-REQ-01. Alta no la hereda: mantiene la validación >0 de UX-07 sin excepción y no confirma el ingreso mientras el importe siga en `0.00`; antes de confirmar, el importe se ajusta con la trazabilidad propia de Alta sin modificar el requerimiento aprobado. El historial y el contrato concretos de ese ajuste pertenecen a Alta y al plan.
26. RR. HH. con capacidad dispone de la acción explícita «Abrir proceso en Selección» solo en el detalle de un requerimiento Aprobado. Al ejecutarla, el requerimiento sigue Aprobado hasta que Selección confirme la creación del proceso; si la confirmación falla, Requerimientos muestra el error y permite reintentar la misma acción, sin presentar En reclutamiento ni datos de seguimiento simulados. «Asociar candidato» solo aparece en En reclutamiento y navega al proceso ya creado.
27. RR. HH. con capacidad solicita la reversión de una cobertura solo con motivo obligatorio. La solicitud no altera solicitadas, cubiertas ni pendientes: solo el evento confirmado de Selección recalcula la cobertura. Un rechazo o un fallo conserva el estado y los contadores, informa y permite reintentar. La solicitud y el evento confirmado quedan auditados con actor, fecha/hora y motivo.

## 11. Resolución de puntos y dependencias abiertas

| ID | Estado en esta versión | Dependencia restante |
|---|---|---|
| P-01 | Resuelto funcionalmente: aprobación día 0, calendario único, Operativo 10, Administrativo 15–30, ajuste separado y auditado solo para Administrativo en Aprobado/En reclutamiento, recálculo desde aprobación original y conservación de eventos históricos; vencimiento tras el día objetivo. | Contratos de calendario, plazos, auditoría y alertas para el plan; no queda decisión funcional pendiente sobre el efecto del ajuste. |
| P-02 | Resuelto y contrastado directamente con UX-03 V1.2: revisión completa; único punto de envío; volver, guardar borrador y enviar; cancelar edición con confirmación de descarte de cambios no guardados; comentario visible antes de corregir Observado. | Verificar comportamiento del formulario y del diálogo durante la implementación; no equivale a cancelar el requerimiento. |
| P-03 | Resuelto: «Abrir proceso en Selección» desde un Aprobado y «Asociar candidato» en En reclutamiento no preasignan ni vinculan; RN-SEL-07 regula el vínculo formal, y la desvinculación con su auditoría pertenece a Selección. | Contrato de navegación y resultados permitidos entre ambas capacidades. |
| P-04 | Contrato provisional autorizado: ámbito aplicado por backend, capacidades por registro y revalidación de comandos. | Política/matriz técnica final de ámbitos y permisos de la dependencia externa. |
| CORE-01 | Capacidad compartida separada, ya especificada en CORE-01 v0.6; no es una duda funcional de RH-REQ-01. | CORE-01 v0.6 aprobada funcionalmente el 10-nov-2026. Los bloqueos del corte quedaron resueltos o excluidos el 10 de noviembre de 2026: C-01/C-03/C-04 contratos al plan, C-02 incluido, C-05 excluido (verificación diferida) y P-04 provisional; no se define implícitamente aquí. |
| INT-01 | Funcionalmente resuelto en esta versión por cuatro decisiones expresas del usuario el 9 de noviembre de 2026: (1) el requerimiento pasa a En reclutamiento solo cuando RR. HH. con capacidad inicia «Abrir proceso en Selección» desde el detalle de un Aprobado y Selección confirma la creación del proceso, sin cambio optimista, con error en Requerimientos y reintento de la misma acción; (2) el primer día real lo registra Alta y Requerimientos solo lo consume para cobertura y lo muestra en solo lectura, sin alterar fecha objetivo ni cómputo de plazos; (3) la reversión de cobertura la origina un evento auditado de Selección con motivo, se solicita por RR. HH. con motivo obligatorio, los contadores no cambian hasta el evento confirmado y un rechazo o fallo conserva el estado e informa para reintentar, con solicitud y evento auditados; (4) el ajuste de remuneración previo al alta pertenece a Alta con trazabilidad, sin trasladar a UX-07/Alta la excepción `0.00` de Practicante, que conserva su validación >0 sin excepción y no confirma el ingreso con importe `0.00`. | Contratos técnicos de los cuatro puntos para el plan (eventos, datos, errores, auditoría, casos límite y navegación), sin fijarlos en esta spec. La v0.7 está aprobada funcionalmente el 10 de noviembre de 2026; esos contratos técnicos siguen perteneciendo al plan y no los aprueba esta spec. |
| SRC-01 | Contraste directo completado con UX/UI V1.2 (UX-02/03/04, §8 y §12): acceso desde fila, comentario previo a corrección, cancelar edición y regreso al contexto incorporados; plazo/fecha objetivo y validación >0 de UX-03 conciliados con V2.2 y decisiones expresas del usuario. D-01 mantiene la prioridad visual acordada del PDF. | Sin bloqueo de acceso; la v0.7 está aprobada funcionalmente el 10 de noviembre de 2026. |

La spec RH-REQ-01 v0.7 incorpora las cuatro decisiones funcionales de integración Selección/Alta (INT-01), las correcciones de revisión B-01 a B-04, las sugerencias S-02 a S-04 y las correcciones del segundo ciclo H-01 a H-03, y está **aprobada funcionalmente el 10 de noviembre de 2026** por confirmación explícita del usuario. CORE-01 v0.6 está **aprobada funcionalmente el 10-nov-2026**. Los contratos técnicos de INT-01, sus casos límite, los contratos C-01/C-03/C-04, el contrato técnico de C-02 y la matriz final de ámbitos y permisos (P-04) pertenecen al plan técnico de esta capacidad y a la dependencia externa; C-05 queda excluido de este corte como verificación diferida. Esta versión no aprueba `core`, stack, API final ni plan. Corresponde ahora el `plan.md` de esta capacidad; `tasks.md` solo tras la aprobación técnica de ese plan.
