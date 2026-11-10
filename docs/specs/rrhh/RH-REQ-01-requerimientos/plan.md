# Plan técnico — Requerimientos de personal (RH-REQ-01)

**ID:** RH-REQ-01  
**Versión del plan:** 0.1 (borrador pendiente de aprobación técnica).  
**Cubre:** RH-REQ-01 v0.7 «Requerimientos de personal» (aprobada funcionalmente el 10-nov-2026). Se integra con CORE-01 v0.6 «Contenedor ERP compartido» a través de su plan ([`../../core/CORE-01-contenedor-erp/plan.md`](../../core/CORE-01-contenedor-erp/plan.md)).  
**Estado:** borrador pendiente de aprobación técnica del usuario. No fija stack final, URLs, endpoints ni payloads; toda decisión que requiera elección de stack o de proveedor real queda señalada como decisión pendiente del usuario.  
**Fecha:** 10 de noviembre de 2026.

---

## 1. Alcance y exclusiones

**Alcance.** Requerimientos de personal (RH-REQ-01 §2): bandeja UX-02, creación/edición/revisión/envío UX-03 y detalle/aprobación UX-04, con plazos/alertas, estados y transiciones, concurrencia versionada e integración Selección/Alta (INT-01). El contenedor ERP de escritorio (CORE-01 §2, §4) se cubre en su propio plan.

**Exclusiones de este corte.**

- **C-05 (diferido):** comparación visual directa con el PDF (RH-REQ-01 §10 criterio 18) comparte el mismo límite de lectura del PDF que motiva C-05 y queda pendiente de decisión (véase §4); la comparación visual del contenedor (CORE-01 §7 criterio 9) se remite al plan de CORE-01. Se mantiene la regla de no adoptar datos ilustrativos del PDF como reglas y no reproducir composiciones no legibles desde el visor.
- **P-04 (externo):** la matriz técnica final de roles, ámbitos y permisos es dependencia externa; este corte usa el contrato provisional autorizado (RH-REQ-01 §3, CORE-01 §3).
- **Módulos/vistas no incluidos:** candidatos UX-05/06, Alta UX-07 operativa, ficha/legajo UX-08 y el resto de vistas RR. HH. Los módulos de dominio (Selección, Alta) solo aparecen como proveedores de resultados de integración, no como vistas operativas de este corte.

---

## 2. Contrato de integración INT-01 (Selección/Alta)

Cuatro decisiones funcionales ya aprobadas (RH-REQ-01 §6, §7.3, §11). Aquí se define el **contrato funcional** y las responsabilidades; no se fijan payloads, eventos técnicos ni APIs concretas. Los casos límite se resuelven sin alterar las reglas funcionales.

### 2.1 Apertura de proceso confirmada por Selección

- **Contrato funcional:** RR. HH. con capacidad inicia «Abrir proceso en Selección» desde el detalle de un requerimiento **Aprobado**. El requerimiento permanece Aprobado hasta que Selección confirme la creación del proceso; solo con esa confirmación pasa a En reclutamiento. No hay cambio optimista; el error se muestra en Requerimientos y el reintento parte de la misma acción.
- **Responsabilidades:** Frontend RR. HH. (dispara la acción, presenta resultado confirmado o error/reintento); Backend ERP (versiona el comando, revalida capacidad/estado, aplica la transición solo con confirmación); Selección (confirma la creación del proceso).
- **Verificación:** RH-REQ-01 §10 criterios 8 y 26 (fallo → permanece Aprobado; error + reintento; sin En reclutamiento anticipado).
- **Casos límite (al plan):** duplicidad o reintento de la apertura; concurrencia entre confirmación de Selección, reversión y primer día real.

### 2.2 Primer día real registrado por Alta

- **Contrato funcional:** Alta registra el primer día real; Requerimientos lo consume en **solo lectura** únicamente para la cobertura. No altera la fecha objetivo ni el cómputo de plazos (que siguen rigiéndose por la fecha de aprobación). `cubiertas` solo aumenta al confirmarse ese primer día.
- **Responsabilidades:** Alta (registra el dato); Frontend RR. HH. (muestra solo lectura, recalcula cobertura); Backend ERP (revalida e integra el dato, mantiene inmutables los datos aprobados y la fecha objetivo).
- **Verificación:** RH-REQ-01 §10 criterios 9 y 24; RH-REQ-01 §5.1 (el primer día real no participa en el cómputo de plazos).
- **Casos límite:** completar el alta antes del primer día real no cuenta; consistencia de `pendientes = solicitadas − cubiertas`.

### 2.3 Reversión de cobertura originada por evento auditado de Selección

- **Contrato funcional:** la reversión efectiva la origina un evento auditado de Selección con motivo obligatorio. RR. HH. con capacidad la solicita desde el seguimiento con motivo obligatorio; los contadores no cambian hasta que el evento se confirma. Un rechazo o fallo conserva estado y contadores, informa y permite reintentar. Solicitud y evento confirmado quedan auditados (actor, fecha/hora, motivo).
- **Responsabilidades:** Frontend RR. HH. (solicita con motivo, refleja solo el resultado confirmado); Selección (emite el evento auditado con motivo); Backend ERP (revalida, recalcula cobertura y estado sin editar datos aprobados, audita).
- **Verificación:** RH-REQ-01 §10 criterios 10 y 27.
- **Casos límite:** reversión con pendientes previas (permanece En reclutamiento); Cubierto con nuevas pendientes → retorna a En reclutamiento; solicitud rechazada o fallida.

### 2.4 Remuneración previa al alta

- **Contrato funcional:** el ajuste de remuneración previo al alta pertenece a Alta, con trazabilidad propia. Alta **no** hereda la excepción `0.00` de Practicante: mantiene la validación >0 de UX-07 sin excepción y **no confirma el ingreso mientras el importe siga en `0.00`**. El ajuste no modifica el requerimiento aprobado de RH-REQ-01.
- **Responsabilidades:** Alta (ajusta con trazabilidad y no confirma con `0.00`); Frontend RR. HH. (no edita ni duplica ese ajuste; si lo muestra es solo lectura); Backend ERP (valida y audita el ajuste en Alta, mantiene inmutables los datos aprobados del requerimiento).
- **Verificación:** RH-REQ-01 §10 criterio 25.
- **Casos límite:** el historial y el contrato concreto del ajuste pertenecen a Alta y al plan (no se definen aquí sus campos).

---

## 3. Traza de P-04 (autorización provisional y matriz final)

- **Contrato provisional autorizado** (RH-REQ-01 §3): el backend limita los registros consultables al ámbito efectivo; cada requerimiento devuelve sus capacidades/acciones permitidas por usuario y versión; el frontend presenta acciones a partir de esas capacidades y contempla lectura/sin permisos; el backend revalida autorización, ámbito, estado y versión en cada comando. Ocultar una acción no constituye autorización.
- **Dependencia externa:** la matriz técnica final de roles/ámbitos/permisos sigue fuera de este repositorio y no bloquea el plan. Los adaptadores/mocks de este corte deben parametrizarse por capacidades y no codificar permisos por nombre de rol ni por etiquetas del PDF, para poder migrar a la matriz final sin reescribir reglas.
- **Verificación de la traza:** RH-REQ-01 §10 criterios 15, 16; CORE-01 §7 criterios 2 y 3 (sin permisos y visibilidad sin operación) se cubren en el plan de CORE-01.

---

## 4. Verificación

Se verifican **todos** los criterios de aceptación de RH-REQ-01 §10, salvo el diferido explícito. La verificación es funcional (fixtures de sesión/capacidades), de reglas (cálculos de plazos/umbrales/cobertura), de integración (Selección/Alta), de concurrencia (versionado) y de accesibilidad (teclado, foco, nombres, mensajes por texto). El criterio de accesibilidad transversal aplica a RH-REQ-01 §8/§10-17; la verificación del contenedor (CORE-01 §7) se cubre en el plan de CORE-01.

### 4.1 RH-REQ-01 §10

| Criterio | Verificación |
|---|---|
| 1 | Guardar borrador incompleto; reabrir devuelve exactamente los valores confirmados por backend; fallo conserva valores en pantalla y no muestra éxito. |
| 2 | «Revisión y envío» presenta todos los datos y errores; «Volver a editar» conserva cambios no persistidos; guardar borrador exige persistencia real. |
| 3 | Validación de vacantes (entero ≥1) y remuneración (PEN, ≥0, máx. 2 decimales; `0.00` solo Practicante). |
| 4 | Aprobación = día 0; cómputo en días hábiles del calendario único; aprobación en día no hábil → día 1 = siguiente hábil. |
| 5 | Operativo: objetivo 10 y alertas en días 5/7/9. Administrativo 17: umbrales en 9/13/16; ninguno es vencimiento. |
| 6 | Administrativo sin plazo entero 15–30 no aprueba; RR. HH. fija/ajusta con motivo solo en Aprobado/En reclutamiento; no en Cubierto/Cancelado. |
| 7 | Ajuste 17→20 recalcula desde la misma aprobación original; historial conserva actor/fecha/motivo/valores/fechas; eventos históricos no se borran ni se simulan correos. |
| 8 | Aprobado → solo «Abrir proceso en Selección» + confirmación de Selección → En reclutamiento; fallo permanece Aprobado, error y reintento (sin optimismo). |
| 9 | Alta antes del primer día real no incrementa cubiertas; primer día en solo lectura; `pendientes = solicitadas − cubiertas`; Cubierto al llegar a cero; fecha objetivo sin cambio. |
| 10 | Reversión solo por evento auditado de Selección con motivo; recalcula cobertura; Cubierto→En reclutamiento; datos aprobados no editados. |
| 11 | «Asociar candidato» solo RR. HH. con capacidad en En reclutamiento; navega al proceso ya creado; vínculos/desvínculos proceden de Selección. |
| 12 | Comandos versionados (editar/guardar, enviar/reenviar, fijar/ajustar plazo, abrir proceso, cancelar, solicitar reversión, aprobar, observar): versión antigua se rechaza sin persistir, conserva entrada, muestra vigentes y permite nueva decisión. |
| 13 | Bandeja: filtro de periodo por fecha de aprobación; responsable o «Sin asignar»; orden inicial creación desc.; columnas ordenables con ausentes al final e ID como desempate. |
| 14 | Filtros sobreviven a navegación/recarga dentro de la sesión, se limpian al cerrar y no exponen datos sensibles en `localStorage`. |
| 15 | Carga, vacío, sin resultados, error recuperable, sin permisos, conflicto y éxito persistido verificables por separado. |
| 16 | Sin capacidad no se ve la acción y el intento directo es rechazado por backend; registros limitados por ámbito. |
| 17 | Flujo completo solo con teclado; foco, nombres, errores, orden y alertas conforme a §8. |
| 18 | Comparación visual de páginas 6–9 (1920×1080): véase §4.2; su exigibilidad en este corte es una decisión abierta (mismo límite de lectura del PDF que C-05). |
| 19 | Días objetivo aún en plazo; incumplimiento al iniciar el siguiente día computable; alerta ≠ vencimiento; comunicación por texto/icono + color. |
| 20 | «Cancelar edición» con cambios no guardados → confirmación de descarte (aceptar vuelve sin persistir; rechazar conserva); «Cancelar requerimiento» es otra transición. |
| 21 | Observado: el creador ve el comentario de observación antes de corregir. |
| 22 | «Volver a bandeja» restaura filtros, orden y página previos. |
| 23 | Fila abre detalle por teclado e interacción; entrada/regreso conservan contexto de bandeja. |
| 24 | Sin fecha objetivo definitiva antes de aprobar; UX-03 muestra duración y aviso de cálculo posterior; UX-02 sin fecha sin aprobación. |
| 25 | `0.00` solo en RH-REQ-01; Alta mantiene >0 sin excepción y no confirma con `0.00`; ajuste trazable en Alta sin modificar el requerimiento aprobado. |
| 26 | «Abrir proceso en Selección» solo en detalle de Aprobado; permanece Aprobado hasta confirmación; fallo → error y reintento; «Asociar candidato» solo en En reclutamiento. |
| 27 | Solicitud de reversión solo con motivo; contadores solo cambian con el evento confirmado; rechazo/fallo conserva e informa; solicitud y evento auditados. |

### 4.2 Nota sobre RH-REQ-01 criterio 18 y C-05 diferido

- **RH-REQ-01 criterio 18:** exige comparar visualmente las páginas 6–9, que comparten el mismo PDF que no pudo contrastarse directamente (el mismo límite de lectura que motiva C-05). Se requiere confirmación del usuario sobre si ese criterio también se difiere en este corte (junto a C-05) o si existe una vía alternativa de verificación visual.
- **C-05 (CORE-01):** queda diferido y se remite al plan de CORE-01 (CORE-01 §7 criterio 9), sin adoptar composición no legible desde el visor.

---

## 5. Riesgos y decisiones abiertas para el usuario

**Decisiones abiertas (requieren decisión del usuario).**

1. **Elección de stack y tooling** del frontend (framework, gestor de estado, persistencia intra-sesión): no se deduce del ZIP ni de la maqueta; se decide aquí, no se asume.
2. **Existencia de backend/proveedores reales:** no hay backend de autorización, Selección ni Alta implementados. Decidir si este corte se construye contra **adaptadores/mocks que respeten los contratos** (distinguibles de operaciones reales, sin autorización ni persistencia falsas) o contra servicios reales. Los mocks, si se autorizan, deben respetar los mismos contratos y escenarios.
3. **INT-01:** si los contratos con Selección/Alta son reales o adaptados, y resolución de casos límite (duplicidad/reintento de apertura, concurrencia, reversión rechazada).
4. **RH-REQ-01 criterio 18:** confirmar si la comparación visual de páginas 6–9 se difiere junto con C-05 o se verifica por otra vía.
5. **P-04:** plazo de disponibilidad de la matriz final de permisos y criterio de migración desde el contrato provisional.

**Riesgos principales.**

- **Dependencia de proveedores sin contrato real** (Selección, Alta): riesgo de bloqueo; mitigación con adaptadores de contrato definido, sin autorización/persistencia falsa.
- **Concurrencia/versionado (INT-01 y comandos versionados):** riesgo de estados inconsistentes; mitigación con confirmación sin optimismo y rechazo de versiones desactualizadas.
- **Matriz de permisos externa (P-04):** riesgo de retrabajo en autorización; mitigación parametrizando por capacidades, sin codificar por nombre de rol.

---

**Siguiente punto:** aprobación técnica; `tasks.md` solo tras aprobación.
