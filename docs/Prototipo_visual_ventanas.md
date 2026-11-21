# Prototipo visual de ventanas — rama `codex/rh-vis`

**Última actualización:** 21 de noviembre de 2026.
**Carácter:** documento de rama. Describe el alcance y el estado del prototipo visual que
vive en `codex/rh-vis`. **No es una spec, no añade requisitos y no sustituye** a
`docs/constitution.md`, a `docs/specs/` ni a `memory.md`.

## 1. Para qué existe esta rama

Esta rama **solo genera ventanas**: réplicas visuales de las pantallas del diseño aprobado
(«MP360 Diseño Elegido»), sin lógica de negocio.

- **Aquí** se construyen y ajustan las pantallas: composición, tipografía, colores, estados
  visuales, escalado y comparación contra el render del diseño.
- **La lógica se desarrolla en el repositorio principal**, sobre `main` y sus ramas
  `task/<capacidad>-<T-ID>`, con el flujo SDD (spec → plan → tareas → implementación).
  La siguiente tarea funcional es **T-RH-06** (`tasks.md` de RH-REQ-01).

Consecuencia práctica: esta rama **no** implementa contratos, estado, validaciones,
persistencia, sesión ni integración. Cuando una ventana se valida, sirve de referencia
visual y de medida para la implementación funcional; no se convierte en la implementación.

## 2. Separación de responsabilidades

| Aspecto | Esta rama (`codex/rh-vis`) | Repositorio principal (lógica) |
|---|---|---|
| Objetivo | Réplica visual de las ventanas | Comportamiento, contratos y estados |
| Rutas que toca | `src/app/preview/**`, `public/preview/**` | `src/modules/**`, `src/container/**`, `src/app/**` |
| Specs y tareas | Solo lectura y contraste | Autoridad: `docs/specs/**` |
| Persistencia y sesión | No | Según CORE-01 y RH-REQ-01 |
| Merge | Lo hace el usuario tras validar | Gate SDD con reviewer y rama por tarea |

Reglas vigentes heredadas de `AGENTS.md`:

1. No se toca `src/modules/rrhh/requerimientos/{contracts,state,tray,form,detail,…}` ni
   `RrhhContainer`, ni `src/app/page.tsx`.
2. El agente implementa y **commitea**; el **merge y el push los hace el usuario**.
   Nunca `--force` y nunca merge desde el agente.
3. Commits con rutas explícitas (`git add -- <rutas>`), nunca `git add -A`.
4. Una tarea no se inicia con el árbol sucio.
5. Los cambios de requisitos vuelven primero a `spec.md`; el prototipo no crea requisitos.
6. Los datos de ejemplo del diseño **no son reglas** y no se usan como criterio de aceptación.

## 3. Inventario de ventanas

Todas se sirven en una única ruta de preview con selector de modo:
`/preview/requerimientos` (por defecto abre **Inicio**).
Atajo por URL: `?ux=<modo>`; comparación: `?modo=comparar&ux=<modo>`.

| Modo | Ventana | Mesa del diseño | Lienzo | Ruta directa |
|---|---|---|---|---|
| `inicio` | Dashboard de Gestión de RR. HH. | `a-04` | 1920 × 1176 | `?ux=inicio` |
| `inicio-modulo` | Dashboard con selector de módulo abierto | `a-05` | 1920 × 1176 | `?ux=inicio-modulo` |
| `ux02` | Bandeja de Requerimientos | `req-06` | 1920 × 1176 | `?ux=ux02` |
| `ux03-formulario` | Nuevo requerimiento de personal | `req-07` | 1920 × 1176 | `?ux=ux03-formulario` |
| `ux03-confirmacion` | Confirmación de envío | `req-08` | 1920 × 1176 | `?ux=ux03-confirmacion` |
| `ux04` | Detalle del requerimiento | `req-09` | 1920 × 1176 | `?ux=ux04` |
| `candidatos` | Bandeja de candidatos | PDF p. 10 (UX-05) | 1920 × 1176 | `?ux=candidatos` |
| `candidato` | Detalle y evaluación de candidato | PDF p. 11 (UX-06) | 1920 × 1176 | `?ux=candidato` |
| `colaboradores` | Bandeja de colaboradores | PDF p. 12 (UX-08) | 1920 × 1176 | `?ux=colaboradores` |
| `colaborador` | Ficha de colaborador (resumen) | PDF p. 17 (UX-08) | 1920 × 1176 | `?ux=colaborador` |
| `colaborador-boletas` | Ficha de colaborador (boletas de pago) | PDF p. 18 (UX-08) | 1920 × 1176 | `?ux=colaborador-boletas` |
| `colaborador-boletas-proceso` | Ficha de colaborador (boletas con proceso) | PDF p. 19 (UX-08) | 1920 × 1176 | `?ux=colaborador-boletas-proceso` |
| `alta-seleccion` | Alta: selección de candidato y requerimiento | PDF p. 13 (UX-07) | 1920 × 1176 | `?ux=alta-seleccion` |
| `alta-datos` | Alta: datos personales y de trabajo | PDF p. 14 (UX-07) | 1920 × 1176 | `?ux=alta-datos` |
| `alta-resumen` | Alta: resumen de validaciones | PDF p. 15 (UX-07) | 1920 × 1176 | `?ux=alta-resumen` |
| `alta-confirmacion` | Alta: confirmación | PDF p. 16 (UX-07) | 1920 × 1176 | `?ux=alta-confirmacion` |
| `onboarding` | Bandeja de onboarding (En curso) | PDF p. 20 (UX-09/10) | 1920 × 1176 | `?ux=onboarding` |
| `onboarding-sin` | Bandeja de onboarding (Sin onboarding) | PDF p. 21 (UX-09/10) | 1920 × 1176 | `?ux=onboarding-sin` |
| `epp` | Asignaciones de EPP y equipos | PDF p. 22 (UX-11) | 1920 × 1176 | `?ux=epp` |
| `epp-devolucion` | Devolución y reposición de EPP | PDF p. 23 (UX-12) | 1920 × 1176 | `?ux=epp-devolucion` |
| `licencias` | Bandeja de licencias y ausencias | PDF p. 24 (UX-13) | 1920 × 1176 | `?ux=licencias` |
| `licencia-registro` | Registro de licencia/ausencia | PDF p. 25 (UX-14) | 1920 × 1176 | `?ux=licencia-registro` |
| `licencia-detalle` | Detalle y subsanación de licencia | PDF p. 26 (UX-15) | 1920 × 1176 | `?ux=licencia-detalle` |
| `offboarding` | Bandeja de offboarding | PDF p. 27 (UX-16) | 1920 × 1176 | `?ux=offboarding` |
| `offboarding-datos` | Offboarding · datos y causal | PDF p. 28 (UX-17) | 1920 × 1176 | `?ux=offboarding-datos` |
| `offboarding-checklist` | Offboarding · checklist y revisión por áreas | PDF p. 29 (UX-17) | 1920 × 1176 | `?ux=offboarding-checklist` |
| `offboarding-liquidacion` | Offboarding · liquidación | PDF p. 30 (UX-17) | 1920 × 1176 | `?ux=offboarding-liquidacion` |
| `offboarding-cierre` | Offboarding · cierre | PDF p. 31 (UX-17) | 1920 × 1176 | `?ux=offboarding-cierre` |
| `dotacion` | Organización y dotación · resumen | PDF p. 32 (UX-18) | 1920 × 1176 | `?ux=dotacion` |
| `dotacion-estructura` | Dotación por cliente · estructura de puestos | PDF p. 33 (UX-19) | 1920 × 1176 | `?ux=dotacion-estructura` |
| `dotacion-asignados` | Dotación por cliente · colaboradores asignados | PDF p. 34 (UX-19) | 1920 × 1176 | `?ux=dotacion-asignados` |
| `dotacion-historial` | Dotación por cliente · historial de cambios | PDF p. 35 (UX-19) | 1920 × 1176 | `?ux=dotacion-historial` |
| `calendario` | Calendario de asistencia | PDF p. 36 (UX-22) | 1920 × 1176 | `?ux=calendario` |
| `documental` | Bandeja global de gestión documental | PDF p. 37 (UX-23) | 1920 × 1176 | `?ux=documental` |
| `documental-tipo` | Generación documental: tipo y colaborador | PDF p. 38 (UX-24) | 1920 × 1176 | `?ux=documental-tipo` |
| `documental-info` | Generación documental: información del documento | PDF p. 39 (UX-24) | 1920 × 1176 | `?ux=documental-info` |
| `documental-contenido` | Generación: contenido y vista previa | PDF p. 40 (UX-24) | 1920 × 1176 | `?ux=documental-contenido` |
| `documental-confirmacion` | Generación: confirmación | PDF p. 41 (UX-24) | 1920 × 1176 | `?ux=documental-confirmacion` |
| `login` | Acceso a MP 360 | `a-01` | 1920 × 1080 | `?ux=login` |
| `perfiles` | Selección de perfil | `a-02` | 1920 × 1080 | `?ux=perfiles` |
| `modulos` | Selección de módulo | `a-03` | 1920 × 1080 | `?ux=modulos` |

Además, el selector conserva las vistas **funcionales** experimentales (`Funcional UX-03` y
`Funcional UX-04`), que montan los componentes reales del módulo con datos de ejemplo.
No forman parte del prototipo visual: están ahí solo para contraste.

**Nota sobre `a-05`:** es la misma pantalla de Inicio con el **selector de módulo**
abierto —no el filtro de Área/Subárea—. Se replica como modo propio `inicio-modulo` para
compararlo y como interacción del botón «Recursos Humanos» en `inicio`.

**Nota sobre la p. 20:** lienzo de 1920 × 1176, primera pantalla del bloque de Onboarding
(UX-09/10). La pestaña resaltada es **«Offboarding»**, no «Onboarding», y no dibuja submenú:
el diseño deja «Onboarding» como pestaña inactiva aunque el breadcrumb, el título y los datos
sean de onboarding. El cromo compartido se mantiene y el azul medido es `#2249f2`. Bajo el
hero (93 px) se dibujan una tarjeta de filtros de 138 px (búsqueda, Estado, Puesto, Tipo de
personal y Cargo), un panel blanco de 521 px con las pestañas «En curso» / «Sin Onboarding» /
«Finalizados», cuatro indicadores sin icono (`Sin encargado`, `Sin Responsabless`,
`Procesos a Tiempo`, `Procesos atrasados`, todos a 0), la barra de orden y una tabla de diez
columnas —nueve rotuladas y la de acciones— con una fila de muestra («Luis Torres Caycho»),
badge «Activo» y cuatro filas vacías recortadas por el panel; el paginador queda sobre el
fondo. Se replican las erratas y
artefactos literales: «Onborading» como título, «Sin Responsabless», el buscador «Buscar
candidatos por nombre, DNI o puesto...», «Tipo de personal» en minúscula y «Acciones rápidas»
con el mismo listado duplicado del cromo. La variante «Sin onboarding» (p. 21) reutiliza este
componente con el estado `sin-onboarding`. Medidas de la fuente en `.cache/p20-render.png`
(no versionado).

**Nota sobre la p. 21:** misma ventana con la pestaña «Sin Onboarding» activa (borde y texto
azules; «En curso» y «Finalizados» en gris) y el cromo idéntico a la p. 20 —pestaña
«Offboarding» resaltada en la navegación y **sin submenú**—. El panel añade a la derecha de las
pestañas una fila de vistas: «Colaboradores» (activa, con icono de casa y fondo `#dfe7f9`),
«Colaboradores sin Ficha», «Tareas» y «Analítica», todas en gris salvo la primera. Los cuatro
indicadores se estrechan (282 px por tarjeta frente a 293) y bajan 8 px, mientras la barra de
orden y la tabla conservan su posición. El resto de la bandeja se repite literal: filtros,
tabla con la fila «Luis Torres Caycho», badge «Activo», cuatro filas vacías y paginador
«Mostrando 10 de 246». Se conservan las erratas «Onborading» y «Sin Responsabless»; «Sin
Onboarding» mantiene la mayúscula dibujada y «Analítica» su tilde. El azul medido es `#2249f2`
y el paginador activo `#1c4cf7`, iguales a la p. 20. El contenido de la p. 21 aparece ~2 px
desplazado respecto a la p. 20 en el render del PDF; se replica la geometría de la p. 20 para no
mover el cromo. Medidas de la fuente en `.cache/p21-render.png` (no versionado).

**Nota sobre la p. 22:** lienzo de 1920 × 1176 con la pestaña «EPP y Equipos» activa y un
submenú dibujado con «Detalle» —resaltado— y «Devolución y Reposición». El azul medido es
`#2249f2`, igual que en las páginas 24–26. Bajo el hero (93 px) se dibujan una tarjeta de
filtros de 139 px, un panel blanco de 549 px con cuatro indicadores de 64 px, la barra de
orden y la tabla de seis filas, y el paginador sobre el fondo. Se replican las erratas y
artefactos literales: «Stock Minimo», el buscador «Buscar candidatos por nombre, DNI o
puesto...», dos badges «Dañado» con relleno distinto (ámbar y rojo) y las fechas con
espacios irregulares. La pestaña compartida conserva «Asistencia» en singular frente al
«Asistencias» del render. Medidas de la fuente en `.cache/epp-p22-medidas.md` (no
versionado). La devolución/reposición (p. 23, UX-12) se replica en el modo `epp-devolucion`.

**Nota sobre la p. 23:** lienzo de 1920 × 1176 con la pestaña «EPP y Equipos» activa y
**sin submenú dibujado** —a diferencia de la p. 22—; el azul medido sigue siendo `#2249f2`.
El breadcrumb tiene tres niveles (`R.R.H.H / EPP y equipos / Devolución y Reposición`) y el
hero añade el botón «Registrar Movimiento». Bajo él se dibujan una tarjeta de filtros de
139 px con «Tipo de Movimiento», «Estado», «Motivo» e «Implemento»; un panel blanco de 549 px
con cuatro indicadores de 64 px; la barra de orden; una tabla de diez columnas y seis filas
con badges; y el paginador. La maqueta **no dibuja el formulario completo de movimiento**, así
que no se añade: solo se replica la bandeja y el botón que lo invoca. Se conservan las erratas
y artefactos literales: «Candidato» como cabecera de la tabla, «Stock Minimo» sin tilde, la
cantidad «L» en las reposiciones y las fechas «15 / 10 / 2026» con espacios. Medidas de la
fuente en `.cache/epp-p23-medidas.md` (no versionado).

**Nota sobre la p. 25:** lienzo de 1920 × 1176 con el mismo cromo de la p. 24 —pestaña
«Asistencia» activa y sin submenú— y el azul medido `#2249f2`. Bajo el hero hay un stepper
de 4 pasos (banda `#f6f9fe` de 1591 × 49, tres pasos en azul y «Confirmación» en gris, barra
de progreso de 968 px). El formulario se dibuja en tres columnas dentro de 1587 px: selección
de colaborador (520), tipo de solicitud e información general (625) y sustento, impacto y
observaciones (427); la barra de acciones (772 × 81) flota bajo las dos últimas. Se replican
las erratas y artefactos literales: breadcrumb «Colaborades», subtítulo copiado del alta,
«calendaria» en el aviso y «7 días» para un rango del 20 al 24 de noviembre. Medidas
detalladas de la fuente en `.cache/licencias-p25-medidas.md` (no versionado).

**Nota sobre la p. 26:** lienzo de 1920 × 1176 con el cromo de la p. 24 —pestaña
«Asistencia» activa y sin submenú— y el azul medido `#2249f2`. Bajo el hero, una ficha blanca
(1572 × 171) resume la solicitud en seis bloques y dibuja una línea de tiempo de cuatro hitos
(Registro y En revisión completados, Subsanación y Aprobada pendientes). El contenido se
reparte en tres columnas —información y documentos (514), impacto, observaciones y alertas
(526), resumen y acciones (506)— sobre un lienzo de 1572 px. Se replican las erratas y
artefactos literales: breadcrumb «Postulante» y botón «Volver a Postulantes», «Secundaria
Completa» como motivo, el periodo «19 /10 /2026 - 21/10/2026» con espacios, «Requerimiento
aprobado» como tipo de permiso, «7 DÍAS» frente a los 3 días del resto de la ficha,
«calendaria», «RR.HH» sin punto final y «Adjunto . PDF» en ambos archivos. Medidas de la
fuente en `.cache/licencias-p26-medidas.md` (no versionado).

**Nota sobre la p. 27:** primera pantalla del bloque Offboarding (UX-16), lienzo de
1920 × 1176. Reutiliza el cromo de las pp. 20–21 —pestaña «Offboarding» resaltada y **sin
submenú**—, pero el azul medido es `#2b48e9`, como en las páginas 10–19 y 32, en lugar del
`#2249f2` de onboarding. El breadcrumb dibuja «R.R.H.H / Offboarding» y el hero, el título
«Offboarding», el subtítulo «Gestión de procesos de cese de colaboradores» y el botón
«Iniciar Offboarding». Bajo él se dibujan una tarjeta de filtros de 137 px con la cabecera
«Búsqueda», el buscador «Buscar candidatos por nombre, DNI o puesto...» y cuatro filtros
(Estado, «Casual de cese», Empresa y Cargo, todos en «Todos»); un panel blanco de 522 px con
las pestañas «En proceso» / «Pendiente de regularización» / «Cerrados», cuatro indicadores
(18, 5, 3 y 12), la barra «Ordenar por: Últimos registrados» y una tabla de nueve columnas
—Candidato, ID de Proceso, Causal de cese, Fecha de cese, Empresa, Área, Responsable, Estado
y acciones— con tres filas de muestra idénticas (Luis Torres Caycho) y badges «Cerrado»
(verde), «Pendiente» (gris) y «En proceso» (azul); el paginador queda sobre el fondo. Se
replican las erratas y artefactos literales: «Casual de cese», el identificador
«offL-00125», la fila y el documento repetidos, y «Mostrando 10 de 246» frente a las tres
filas dibujadas. El paginador activo mide `#294bee`. Medidas de la fuente en
`.cache/pdfp-27.png` (no versionado). La p. 28 se replica en `offboarding-datos`, las etapas 2–3 de la p. 29 en
`offboarding-checklist`, la p. 30 en `offboarding-liquidacion` y la p. 31 en
`offboarding-cierre`; `MarcoOffboarding` reserva el slot de contenido para su stepper.

**Nota sobre la p. 28:** primera etapa del proceso de offboarding (UX-17), lienzo de
1920 × 1176. Reutiliza el cromo de la p. 27 —pestaña «Offboarding» resaltada y sin
submenú— con el mismo azul medido `#2b48e9`; el círculo activo del stepper mide
`#294bee`. El breadcrumb dibuja «R.R.H.H / Procesos de offboarding», el hero titula
«Proceso de Offboarding» con el subtítulo «Registra la causal de cese y gestiona la
hoja de ruta de salida del colaborador.» y el botón «Regresar a Offboarding». Bajo él
se dibuja un stepper de cinco pasos —«Datos y Causal» activo, «Checklist de salida»,
«Revisiones por áreas», «Liquidación» y «Cierre»— sobre una banda de 1592 × 49
(`#f7f9fe`) con un subrayado azul de 239 × 5 bajo el primer paso. El contenido se
reparte en dos columnas: a la izquierda, el panel «Selec. Colaborador» (buscador,
tipo y número de documento, la ficha verde «Postulante encontrado» y cuatro
colaboradores encontrados); a la derecha, «Causal y fecha de cese» (causal, fecha de
último día de labores y motivo con contador) y «Resumen del proceso» (cese
programado, estado, checklist, áreas y liquidación), más la barra Cancelar / Guardar
Borrador / Continuar. Se replican literales las erratas y artefactos del dibujo:
«Selec. Colaborador», «Procesos de offboarding» en minúscula, «Liquidicación» en el
resumen —frente a «Liquidación» en el stepper—, «Nac: Peruano» sin punto, el teléfono
«999 999 99» de la lista frente a «999 999 999» de la ficha, el buscador «Buscar por
nombre, DNI....» con cuatro puntos y «Cese Programado : 20/10/2026» con espacios. La
maqueta solo dibuja esta etapa: no hay validaciones, cálculos ni opciones de
desplegable; el contador «32/200» y los valores de los selects son estáticos. Medidas
de la fuente en `.cache/p28-render.png` (no versionado). La p. 29 se replica en
`offboarding-checklist`, la p. 30 en `offboarding-liquidacion` y la p. 31 en
`offboarding-cierre`; `StepperOffboarding` se reutiliza en todas.

**Nota sobre la p. 29:** segunda pantalla del proceso (UX-17), lienzo de 1920 × 1176.
Reutiliza el cromo, el azul `#2b48e9` y el rail de la p. 28; el círculo activo del
stepper mide `#294bee`. La página cubre dos etapas: «Checklist de salida» (paso 2) y
«Revisiones por áreas» (paso 3); el stepper dibuja los pasos 1–3 en azul, los pasos
4–5 en gris y una barra de progreso de 575 × 5 bajo los pasos 2–3. Bajo el stepper,
una ficha de 88 px resume al colaborador y el proceso (avatar, «Casual de cese»,
fechas y responsable). Debajo, la tarjeta «Checklist de Salida» dibuja ocho tareas en
dos columnas con casillas vacías y su menú, más «Marcar todas las casillas»; y la
tarjeta «Revisión por áreas» dibuja una tabla de seis columnas —Área, Responsable,
Revisión / Alcance, Estado, Fecha de validación y Observaciones— con cuatro filas y
badges «Confirmado» (verde), «En revisión» (azul) y dos «No aplica» (gris). Al pie,
una nota informativa y la barra Anterior / Guardar Borrador / Continuar. Se replican
literales las erratas «Casual de cese», «SSTS», «CCalculo», «Checklist de Salida»
(mayúscula frente a «Checklist de salida» del stepper), la nota «…los cuadros a
marcar… que este en proceso…» y el nombre «Jesus Vargas» sin tilde; las casillas,
estados y fechas son presentacionales, sin lógica ni cálculos. Medidas de la fuente
en `.cache/p29-render.png` (no versionado). La p. 30 se replica en
`offboarding-liquidacion` y la p. 31 en `offboarding-cierre`.

**Nota sobre la p. 30:** cuarta etapa del proceso (UX-17), lienzo de 1920 × 1176.
Reutiliza el cromo, el azul `#2b48e9`, el rail y la ficha de 88 px de la p. 29; el
círculo activo del stepper mide `#294bee`. El stepper dibuja los pasos 1–4 en azul y
«Cierre» en gris, con una barra de progreso de 202 × 5 bajo «Liquidación» —no bajo los
pasos 2–3 como la p. 29— y sin el botón «Regresar a Offboarding» del hero. Bajo la
ficha, la tarjeta «Detalle de Liquidación» de 1592 × 254 contiene un resumen de 481 ×
173 (`#e8ebfd`) con causal y fechas, y una tabla de 1030 px con cabecera `#eef3fc`
(Concepto / Detalle) y cuatro filas: «Remuneración base» `s/ 2.060.00`, «Vacaciones
pendientes» 15 días `s/1,030.00`, «Descuentos (EPP/ equipos /adelantos)» «EPP no
devuelto» `-  s/ 200.00` y el total `s/ 2,890.00` en azul. Al pie, la nota y la barra
Anterior / Guardar Borrador / Continuar de la etapa anterior. Se replican literales los
artefactos del dibujo: el importe de la primera fila queda dentro de la columna
«Detalle», la columna de importes no tiene rótulo, el primer importe usa punto
(`2.060.00`) y los demás coma, el descuento lleva dos espacios tras el guion y
«Descuentos (EPP/ equipos /adelantos)» conserva sus espacios. Los montos y el total son
los dibujados: no se recalculan ni se añaden conceptos. Medidas de la fuente en
`.cache/p30-render.png` (no versionado). La p. 31 se replica en `offboarding-cierre`.

**Nota sobre la p. 31:** quinta y última etapa del proceso (UX-17), lienzo de 1920 × 1176.
Reutiliza el cromo, el azul `#2b48e9` y el rail de las pp. 28–30; el círculo activo del
stepper mide `#294bee`. El stepper dibuja los cinco pasos en azul —incluido «Cierre»— y la
barra de progreso de 201 × 5 solo bajo «Cierre»; el hero titula «Proceso de offboarding»
con minúscula dibujada y no muestra el botón «Regresar a Offboarding». Bajo él, un panel
blanco de 1570 × 703 contiene la confirmación —halo verde de 78 px con seis confetis,
«¡Proceso de offboarding exitoso!» y el mensaje de registro—, la tarjeta «Datos del
Colaborador» (cabecera `#eef3fc`, avatar azul, badge «Activo» verde y dos columnas con
divisoria) y la tarjeta «Procesos realizados» con cuatro estados («Completo» verde y
«En Proceso» / «Pendiente» ámbar), más la barra «Ver ficha del exColaborador» /
«Registrar otro offboarding» / «Ir a Offboardings». Se replican literales «EPPS», «En
Proceso», «12 / 10 / 2026», «Lima- Sede Principal» y los espacios de «15 /10 /2026
15:22». Los botones y estados son presentacionales: no ejecutan acciones ni redirecciones.
Medidas de la fuente en `.cache/p31-render.png` (no versionado). Con esta pantalla el
bloque Offboarding queda completo (5 pantallas).

**Nota sobre la p. 32:**

**Nota sobre la p. 32:** primera pantalla del bloque Organización y dotación (UX-18/19),
lienzo de 1920 × 1176. La pestaña activa es «Organización y Dotación» —en dos líneas y sin
submenú—; el breadcrumb dibuja «R.R.H.H / Organización y Dotación» y el hero, el título
«Organización y Dotación» con el subtítulo «Consulta la dotación requerida, cubierta y
pendiente por cliente y gestiona los cupos de colaboradores.» y el botón «Agregar Operación».
El azul medido es `#2b48e9`, igual que en las páginas 10–19. Bajo el hero (93 px) se dibujan
una tarjeta de resumen de 82 px con tres indicadores (`1,116 /1,240 Cubiertos`, `124
pendientes` y `7 Operaciones activas`, separados por líneas de 48 px), una tarjeta de filtros
de 131 px con «Empresa», «Cliente», «Área / Subárea», «Periodo», «Contratos por vencer»,
«Personal» y «Nacionalidad», «Más Filtros», «Aplicar Filtros» y «Limpiar», y una rejilla de
seis tarjetas de cliente (Honda, Honda Recall, Zara, JBL, Integra Retail y DSV) de 516 × 218
con cabecera `#333`, badge «Cobertura al 90 %», dos cifras `46/50 Cubiertos` y `4/50
Pendientes`, tres pares a la izquierda y dos a la derecha y el botón «Ver Detalle». El paginador queda
sobre el fondo. El rail dibuja un icono de cierre en «Nuevo Reclutamiento», la lista de
acciones con «Contratos por Vencer» duplicado y «Ver más +». Se replican las erratas y
artefactos literales: «pendientes» en minúscula, el espacio de «Cobertura al 90 %» y el mismo
dato de muestra en las seis tarjetas. Medidas de la fuente en
`.cache/p32-render.png` (no versionado). La p. 33 (UX-19) se replica aparte en el modo
`dotacion-estructura`, la p. 34 en `dotacion-asignados` y la p. 35 en `dotacion-historial`.

**Nota sobre la p. 33:** segunda pantalla del bloque, lienzo de 1920 × 1176. El cromo es el
mismo de la p. 32 (pestaña «Licencias» y «Organización y Dotación» activa sin submenú), pero
el azul medido vuelve al token base `#2249f2`, no al `#2b48e9` de la p. 32. El breadcrumb
dibuja «R.R.H.H / Colaborades» —errata literal—; el hero titula «Detalle de dotación por
cliente, área y cargo» con el subtítulo «Visualiza la dotación requerida y pendiente.» y un
selector «Estado · Activo» a la derecha. Bajo el hero se dibujan una ficha de cliente (Honda)
de 412 × 752 con cabecera oscura, avatar azul, badge «Activo», siete pares de datos, la
píldora «Cobertura al 90 %» y los botones «Editar dotación» y «Ver en organización»; y un
panel de 1143 × 752 con cuatro pestañas —«Resumen», «Dotación por área y cargo» (activa),
«Colaboradores asignados» e «Historial de cambios»—, cuatro indicadores (26 requeridos, 24
cubiertos, 2 pendientes y «92 % Cobertura»), la barra «Ordenar por: Últimos registrados» con
sus cinco controles y la tarjeta «Estructura organizacional». La tarjeta dibuja una jerarquía
de tres niveles (OPERACIONES → Producción / Calidad / Logística → cargos) con filas de grupo
sangradas 11 y 59 px, conectores de despliegue, columnas Requeridos / Cubiertos / Pendientes
/ Cobertura y badges de dos verdes (`#06cc14` y `#22b273`), ámbar (`#f8ad3b`) y amarillo
(`#f9eb21`). Se replican literales el punto «.» en Pendientes de Calidad, el duplicado
«Contratos por Vencer» con la tercera acción vacía y los nombres «Coordinador Logístico» y
«Técnico de Mantenimiento». Medidas de la fuente en `.cache/p33-render.png` (no versionado).

**Nota sobre la p. 34:** tercera pantalla del bloque, lienzo de 1920 × 1176. Reutiliza el
cromo y la ficha de cliente de la p. 33; el azul medido sigue siendo `#2249f2`, aplicado
solo dentro de `.ux19-lienzo`. La pestaña activa dibujada es **«Colaboradores asignados»**
—la tercera, con píldora `#dfe7f9`— y las demás pestañas conservan la posición de la
p. 33. Bajo ella, el panel dibuja cuatro indicadores de 64 px (`Colaboradores Asignados`
26, `Colaboradores Activos` 26, `En Descanso` 1 y `Próximos ingresos` 0), una fila de
cuatro filtros (`Puesto`, `Tipo de Contrato`, `Nacionalidad`, `Estado`, todos en «Todos»)
con «Aplicar Filtros» en azul y «Limpiar» en gris, la barra «Ordenar por: Últimos
registrados» con sus cinco controles y una tabla de siete columnas —Candidato, Documento
de Identidad, Puesto, Tipo de Contrato, Fecha de Ingreso, Estado y acciones— con cabecera
gris de dos líneas y flechas de orden sólidas. Se dibujan cinco filas (Luis Torres, Jaime
Castillo, Emilia Castellano, Diego Fiestas y Luis Torres otra vez) con avatar gris, badge
«Activo» verde y «Descanso» ámbar, y un paginador con «Mostrando 10 de 246», seis páginas
y dos flechas de avance. Se replican literales el breadcrumb «Colaborades», el documento y
la fecha repetidos (`711234567`, `12 / 09 / 2026`) y la fila duplicada; las líneas
verticales de la tabla solo recorren las cuatro primeras filas, como en el dibujo. El
inventario rotula la p. 34 como «colaboradores activos», pero la maqueta dibuja la pestaña
«Colaboradores asignados» y separa «Asignados» de «Activos» en los indicadores; se replica
lo dibujado. Medidas de la fuente en `.cache/p34-render.png` (no versionado).

**Nota sobre la p. 35:** cuarta y última pantalla del bloque, lienzo de 1920 × 1176.
Reutiliza el cromo y la ficha de cliente de la p. 33; el azul medido sigue siendo
`#2249f2`, aplicado solo dentro de `.ux19-lienzo`. La pestaña activa dibujada es
**«Historial de cambios»** —la cuarta, con píldora `#dfe7f9`—; el inventario la rotula
«historial de asignación», pero se replica el rótulo dibujado. Bajo ella, el panel dibuja
cuatro indicadores de 64 px (`Cambios Registrados` 12, `Incrementos` 8, `Reducciones` 3 y
`Ajuste de reasignación` 1, este último con icono morado `#b294f7` y glifo blanco), una
fila de cuatro filtros (`Puesto`, `Tipo de Contrato`, `Nacionalidad`, `Estado`, todos en
«Todos») con «Aplicar Filtros» en azul y «Limpiar» en gris, la barra «Ordenar por: Últimos
registrados» con sus cinco controles y una tabla de ocho columnas más casilla y acciones:
Fecha, Candidato, Estado, Detalle del cambio, Valor Anterior, Valor nuevo, Observación y
menú. Se dibujan cinco filas (Luis Torres, Jaime Castillo, Emilia Castellano, Diego Fiestas
y Luis Torres otra vez) con avatar gris, badges «Incremento» verde, «Reducción» ámbar y
«Reasignación» azul marino; la reasignación deja vacíos Valor Anterior y Valor nuevo, y los
valores numéricos se dibujan en gris y más pequeños que el resto. El paginador repite
«Mostrando 10 de 246», seis páginas y dos flechas de avance. Se replican literales el
breadcrumb «Colaborades», la fecha repetida «15/10/2026», el rótulo «Ajuste de
reasignación» y «Valor nuevo» en minúscula. Medidas de la fuente en
`.cache/p35-render.png` (no versionado).

**Nota sobre la p. 36:** pantalla única del bloque Calendario de asistencia (UX-22),
lienzo de 1920 × 1176. Reutiliza el cromo de la p. 24 —pestaña «Asistencia» activa,
**sin submenú**— y el azul medido `#2249f2`, aplicado a las pestañas, el calendario y el
panel de resumen. El breadcrumb dibuja «R.R.H.H / Licencia y Ausencias / Calendario de
Asistencia» y el hero titula «Calendaria de Asistencia» —errata literal— con el subtítulo
«Consulta y administra las licencias y ausencias de cada colaborador.» y el botón
«Registrar Solicitud». Bajo él, una fila de cuatro pestañas —«Vacaciones», «Licencias y
Ausencias», «Permisos» y «Calendario» activa— de 304/394/304/304 px y una tarjeta de filtros
de 140 px con «Búsqueda», «Empresa», «Área / Subárea», «Tipo de Evento» y «Estado», más
«Más Filtros», «Limpiar Filtros» y «Aplicar Filtros». El cuerpo se reparte en un panel de
calendario de 1130 × 544 y otro de 425 × 544: el primero dibuja la barra «Noviembre 2026»
con dos botones de 48 px, el conmutador Mes / Semana / Día (Mes activo) y «Hoy»; una
rejilla de siete columnas por cinco semanas con cabecera `#f8f7f9`, celdas de 65,5 px y
bordes `#efefef`; y la leyenda «Vacaciones / Licencia / Permisos / Ausencias». Se replican
las marcas dibujadas: doble evento de Rodrigo Ayala el día 3 con contador `+5`, evento verde
el día 6, el día 20 seleccionado con píldora azul y «Luis Torres (1/5)», sus continuaciones
en 21 y 22, 24 y 25, y «Karem Lopez (1/5)» a «(3/5)» en 27–29; no se calculan festivos ni se
inventan eventos. A la derecha, «Viernes, 20 de noviembre» con la tarjeta de vacaciones
(banda `#c9e3fe`, píldora verde «En goce», «Luis Torres», el periodo
«20/11/2026 - 25/11 / 2026 ( 5 días)» y «Ver Detalle»), la barra de desplazamiento y el
«Resumen del periodo» con Vacaciones 12, Licencia 6, Permisos 8 y Ausencias sin cifra. Se
conservan como literales «Calendaria», los iconos de casa, libro, maletín y persona de las
pestañas, la tilde de «Mié» y los espacios del periodo. Medidas de la fuente en
`.cache/p36-render.png` (no versionado).

**Nota sobre la p. 37:** primera pantalla del bloque Gestión documental (UX-23), lienzo de
1920 × 1176. Reutiliza el cromo de la p. 24 —pestaña «Asistencia» inactiva, sin submenú— con
la pestaña **«Gestión Documental»** activa: su píldora mide 182 px y arranca 10 px antes de su
celda; el azul medido en toda la ventana es `#2b48e9`, igual que las pp. 10–19 y 32–35. El
breadcrumb dibuja «R.R.H.H / Gestión Documental» y el hero, el título «Gestión Documental» con
el subtítulo «Centraliza la revisión, consulta archivos y seguimientos de documentos de
colaboradores.» y el botón «Generar Documento» (230 × 47). Bajo él, seis pestañas —«Todos los
documentos» activa, «Firmas pendientes», «Revisiones Pendientes», «Todos los pendientes»,
«Archivado» y «Papelera»— de 51 px; una tarjeta de filtros de 137 px con «Búsqueda», «Empresa»,
«Área / Subárea», «Tipo Documento» y «Estado», más «Más Filtros», «Limpiar Filtros» y «Aplicar
Filtros»; y un panel blanco de 486 px con la barra «Ordenar por: Últimos registrados», los
cuatro controles de la derecha («últimos 30 días») y una tabla de diez columnas —casilla,
Colaborador, Colaborador, Tipo, Versión, Estado, Área, Fecha de Creación, última actualización
y Ubicación lógica, más acciones—. Se dibujan cinco filas con el mismo colaborador y badges
«Pendiente de revisión» (`#b9cffb`), «Pendiente de firma» (`#fcf2c4`), «Vigente» (`#c1fdbf`),
«Archivado» (`#efeff0`) y «En papelera» (`#f5bab9`); el paginador queda sobre el fondo. Se
replican las erratas y artefactos literales: el encabezado «Colaborador» duplicado, «última
actualización» en minúscula frente a «Fecha de Creación», la pestaña «Revisiones Pendientes»
sin tilde, «Jefe de Área» como Área, un `.docx` rotulado «Anexo» en la carpeta «Constancias»,
«Contratos por Vencer» duplicado en Acciones rápidas y «Mostrando 10 de 246» frente a las
cinco filas. El dibujo no muestra el resto del flujo documental: no se añaden estados,
acciones ni formularios. `MarcoDocumental` reserva el slot `stepper` para las etapas de
generación (pp. 38–41, UX-24), que quedan en tareas posteriores. Medidas de la fuente en
`.cache/p37-1920.png` (no versionado).

**Nota sobre la p. 38:** primer paso del flujo de generación documental (UX-24), lienzo de
1920 × 1176. Reutiliza el cromo de la p. 37 —pestaña «Gestión Documental» activa, sin
submenú—, pero el azul medido vuelve al token base `#2249f2` y la píldora activa usa
`#dfe7f9`; el círculo activo del stepper mide `#1c4cf7`. El breadcrumb tiene tres niveles
(«R.R.H.H / Gestión Documental / Generación de documento») y el hero titula «Generación de
Documento» con el subtítulo «Crea un nuevo documento para uno o más colaboradores activos.»
y el botón «Volver a Gestión Documental» (283 × 49). Bajo el hero se dibuja un stepper de
cuatro pasos —«Tipo de Documento» activo, «Información del Documento», «Contenido y
Variables» y «Confirmación»— sobre una banda `#f6f9fe` de 1592 × 49, con conectores de 145 px
y un subrayado azul de 239 × 5 bajo el primer paso. El contenido se reparte en dos tarjetas:
a la izquierda, «Selec. Colaborador» (516 × 694) con «Detalle», «Tipo de Personal», la ficha
verde «Postulante encontrado», «Correo», «Número», la lista de cuatro colaboradores con
badge «Seleccionado» y barra de desplazamiento; a la derecha, «Tipo de Solicitud»
(1054 × 601) con cuatro pestañas —«Contratos» activa—, seis tarjetas de plantilla en dos
filas, el aviso informativo y una barra aparte con Cancelar / Guardar Borrador / Continuar.
Se replican literales las erratas y artefactos del dibujo: «Selec. Colaborador», el buscador
«Buscar por nombre, DNI....» con cuatro puntos, «Nac: Peruano», «Modifiacón» —sin la segunda
«c»—, la descripción de «Otro contrato» sin punto final, el doble espacio y el recorte
«…configuradas en la pantall» del aviso, y las tarjetas con sus saltos de línea dibujados.
La maqueta no añade validaciones, filtros aplicados ni navegación: los controles son
presentacionales. `GeneracionTipo` y `StepperGeneracionDocumental` quedan preparados para
reutilizar el marco en los pasos de las pp. 39–41. Medidas de la fuente en
`.cache/p38-1920.png` (no versionado).

**Nota sobre la p. 39:** segundo paso del flujo de generación documental (UX-24), lienzo de
1920 × 1176. Reutiliza el cromo de la p. 38 y el mismo azul medido `#2249f2`
(`#1c4cf7` en los círculos de paso y en la etiqueta activa). El breadcrumb y el hero repiten
«R.R.H.H / Gestión Documental / Generación de documento», «Generación de Documento» y el
subtítulo, pero **sin el botón «Volver a Gestión Documental»**: la p. 39 no lo dibuja. El
stepper conserva la banda `#f6f9fe` de 1590 × 49 y marca el **paso 2 «Información del
Documento»** como activo —el paso 1 queda completado en azul— con el subrayado de 239 × 5
desplazado bajo el paso 2 (x ≈ 412). Bajo él, una tarjeta blanca de 1590 × 89 resume al
colaborador y el documento en cinco bloques separados por divisores: identidad (avatar,
«Luis Torres», «DNI: 7142123456», «Operario de Almacén»), «Tipo de Documento» /
«Contrato de Trabajo», «Ingreso de Colaborador» / «08/08/2026», «Fecha de Registro» /
«15/10/2026» y «Responsable de revisión» / «Ricardo Cisterna». El panel blanco de
1589 × 512 titula «Información del Documento», dibuja una banda `#dfe7f9` de 1541 × 68 con
«Plantilla seleccionada» / «Contrato de trabajo», «Categoría» / «Contratos» y «Versión de
plantilla» / «V2.0», y reparte dos columnas —separadas por un eje en x ≈ 832— con la misma
marca «Datos del documento». La izquierda dibuja siete campos de 40 px (título, tipo de
contrato, fecha de inicio, área/subárea, puesto, modalidad y jornada); la derecha, tres y
una zona de observaciones. Al pie, la barra informativa `#edf3fd` de 788 × 53 y el panel de
acciones de 776 × 81 con «Anterior» (negro), «Guardar Borrador» (contorno azul) y
«Continuar» (azul). Se replica literal el artefacto del dibujo que muestra «Plazo
indeterminado» en «Remuneración Mensual»; los controles son presentacionales: no hay
validaciones, cálculos ni transición entre pasos. Medidas de la fuente en
`.cache/p39-1920.png` (no versionado). El paso 3 se replica en `documental-contenido` y el
paso 4 en `documental-confirmacion`.

**Nota sobre la p. 40:** tercer paso del flujo de generación documental (UX-24), lienzo de
1920 × 1176. Reutiliza el cromo de la p. 37 y el azul medido `#2249f2`, con el acento
`#1c4cf7` en el círculo y la etiqueta del paso activo. El breadcrumb y el hero repiten los
de la p. 39 y tampoco dibujan el botón «Volver a Gestión Documental». El stepper de cuatro
pasos marca **«Contenido y Variables»** como activo —los pasos 1 y 2 quedan completados en
azul y «Confirmación» en gris— con el subrayado de 212 × 5 desplazado bajo el paso 3
(x ≈ 788). Bajo él, la tarjeta de resumen mide 100 px y repite identidad, tipo de documento,
ingreso, fecha de registro y responsable. El cuerpo se reparte en una tarjeta blanca de
1594 × 511: a la izquierda, «Contenido y Variables» con siete variables marcadas
(«Nombre Completo», «Dni», «Puesto», «Área», «Fecha_Inicio», «Remuneración» y «Tipo de
Contrato»), sus valores y «Marcar todas las casillas»; a la derecha, las pestañas «Vista
Previa» (activa, con subrayado azul) y «Editar documento» (inactiva), y la hoja de vista
previa con el título «CONTRATO DE TRABAJO», el texto de muestra literal y los controles
`<` / «1 de 3» / `>` / «100 %» / pantalla completa. Al pie, la barra informativa y el panel
con «Anterior», «Guardar Borrador» y «Confirmar >». Se replican literales el texto de la
hoja —incluido «cons ectetuer» partido en la última línea— y el valor «s/1,500.00»; el
editor de contenido no se dibuja como pantalla activa y no se añaden variables, párrafos,
validaciones ni transición entre pasos. Medidas de la fuente en `.cache/p40-1920.png` (no
versionado).

**Nota sobre la p. 41:** cuarto y último paso del flujo de generación documental (UX-24),
lienzo de 1920 × 1176 y pantalla de éxito. Reutiliza el cromo de la p. 37 con el azul
`#2b48e9` en navegación, botones y enlaces; el stepper usa un azul propio `#294bee`. **La
página copia el cromo de Alta**: el breadcrumb dibuja «R.R.H.H / Colaborades» —sin la
segunda «o»— y el hero titula «Alta de Colaborador» con el subtítulo «Formaliza el ingreso
del candidato seleccionado y conviértelo en colaborador activo.»; no dibuja el botón
«Volver a Gestión Documental». El stepper conserva la banda `#f6f9fe` de 1592 × 49, pinta
los **cuatro pasos en azul** —los tres anteriores completados y «Confirmación» activo— y
coloca el subrayado de 240 × 5 bajo el paso 4 (x ≈ 1131). Bajo él, una tarjeta blanca de
1570 × 701 contiene el éxito: halo verde de 78 px con círculo `#5d985e` de 56 px, check
blanco y seis confetis de colores; el título «Documento generado exitosamente» y el
subtítulo «El documento ha sido creado y se ha ejecutado la accesión seleccionada.» —con la
errata «accesión»—. El bloque de éxito está centrado 26 px a la derecha del centro de la
tarjeta, como en la maqueta. El resumen del documento es una tarjeta de 1491 × 291 con
cabecera `#eef3fc` de 60 px (avatar azul de 36 px, «Resumen del Documento» y badge verde
«Finalizado» de 142 × 30), el archivo «Contrato de Trabajo.pdf» con icono rojo de 46 × 62,
«Contrato de trabajo (v2.0)» y la píldora «Enviado a firmas» (200 × 29), y dos columnas de
tres filas separadas por divisores: Colaborador / Luis Torres Caycho, Puesto / Operario de
Almacén, Área / Subárea / Operaciones / Almacén; Fecha de generación / 15/10/2026, Código
de Documento / DOC-CTR-0000458 y Versión / V2.0. Al pie, tres botones de 405 / 404 / 402 px
y 40 px de alto: «Ver Documento del Colaborador» y «Generar otro documento» con contorno
azul, e «Ir a Bandeja de Documentos» sólido `#2b48e9`. Solo se replica lo dibujado: no hay
acciones, navegación ni transición reales. Medidas de la fuente en `.cache/p41-1920.png` y
MAE 5,1 / 255 contra la referencia versionada.

## 4. Cómo ejecutarlo

```bash
pnpm install --frozen-lockfile
pnpm dev            # http://localhost:3000/preview/requerimientos
# o, sobre un build de producción:
pnpm build && pnpm start --port 3210
```

El preview escala cada lienzo al ancho disponible (`VistaEscalada`): cada ventana declara su
ancho y alto, de modo que conviven los formatos 1920 × 1176 (RR. HH.) y 1920 × 1080 (acceso)
sin reflow interno. La barra flotante de selección envuelve sus opciones en varias filas cuando
no caben en el ancho de la ventana.

## 5. Estructura del código del prototipo

```
src/app/preview/requerimientos/
├── page.tsx                 # selector de ventanas y modo comparación
├── preview.module.css       # barra flotante y vista de comparación
├── ux02-fiel.css            # tokens, fuentes locales y estilos de todas las ventanas
├── inicio/                  # dashboard (a-04)
├── ux02/                    # bandeja (req-06) + cromo compartido y escalado
├── ux03/                    # alta y confirmación (req-07 y req-08)
├── ux04/                    # detalle (req-09)
├── candidatos/              # bandeja de candidatos (PDF p. 10, UX-05)
├── candidato/               # detalle y evaluación de candidato (PDF p. 11, UX-06)
├── colaboradores/           # bandeja de colaboradores (PDF p. 12, UX-08)
├── colaborador/             # ficha, resumen y boletas (PDF pp. 17-19, UX-08)
├── alta/                    # alta: selección, datos, resumen y confirmación (PDF pp. 13-16, UX-07)
├── onboarding/              # bandeja de onboarding (PDF pp. 20-21, UX-09/10)
├── epp/                     # asignaciones de EPP y equipos (PDF p. 22, UX-11)
├── licencias/               # bandeja, registro y detalle de licencias (PDF pp. 24-26)
├── offboarding/             # bandeja y etapas de offboarding (PDF pp. 27-31, UX-16/17)
├── dotacion/                # resumen y detalle por cliente (PDF pp. 32-35, UX-18/19)
├── calendario/              # calendario de asistencia (PDF p. 36, UX-22)
├── documental/              # bandeja y generación documental (PDF pp. 37-41, UX-23/24)
└── acceso/                  # login, perfiles y módulos (a-01 a a-03)

public/preview/mp360/
├── fonts/                   # Montserrat, Gontserrat y Material Symbols Rounded
└── img/                     # logos, avatares, arte del diseño y renders de referencia
```

- `ux02/Cromo.tsx` concentra cabecera, navegación, rail y pie; las demás ventanas lo reutilizan.
- `ux02-fiel.css` es la única hoja de estilos del prototipo y contiene los tokens medidos
  (azul `#2249f2`, bordes `#efefef`, separadores `#e3e3e3`, etc.).
- Los renders de referencia viven junto a los assets (`referencia-*.jpg`) y alimentan el modo
  comparación; no se usan como implementación.

## 6. Assets y licencias

- Fuentes locales: Montserrat Regular/Bold y Gontserrat Medium/SemiBold.
- Material Symbols Rounded subseteado a los iconos usados.
- `MyriadPro-Regular.otf` **no se versiona** por licencia comercial de Adobe.
- Arte extraído del artboard para las ventanas de acceso: panel de marca (incluye la cita
  «Hoy mejor que ayer…» como parte de la imagen), tres avatares y las cuatro tarjetas de módulo.
  El resto de esas ventanas es CSS.

## 7. Estado de validación

| Ventana | Estado | MAE vs. render (1920 de ancho) |
|---|---|---|
| UX-02 Bandeja | Validada por el usuario | 10,9 / 255 |
| UX-03a Formulario | Sin cambios solicitados | 8,2 / 255 |
| UX-03b Confirmación | Sin cambios solicitados | 7,9 / 255 |
| UX-04 Detalle | Sin cambios solicitados | 10,0 / 255 |
| Candidatos (PDF p. 10) | Pendiente de revisión visual | 8,9 / 255 |
| Candidato (PDF p. 11) | Calibrada; pendiente de revisión visual | 6,3 / 255 |
| Colaboradores (PDF p. 12) | Pendiente de revisión visual | 8,9 / 255 |
| Colaborador (PDF p. 17) | Pendiente de revisión visual | 7,1 / 255 |
| Colaborador boletas (PDF p. 18) | Pendiente de revisión visual | 7,3 / 255 |
| Colaborador boletas · proceso (PDF p. 19) | Pendiente de revisión visual | 7,1 / 255 |
| Alta · selección (PDF p. 13) | Pendiente de revisión visual | 8,1 / 255 |
| Alta · datos (PDF p. 14) | Pendiente de revisión visual | 6,9 / 255 |
| Alta · resumen (PDF p. 15) | Pendiente de revisión visual | 8,0 / 255 |
| Alta · confirmación (PDF p. 16) | Pendiente de revisión visual | 5,3 / 255 |
| Onboarding · En curso (PDF p. 20) | Pendiente de revisión visual | 5,6 / 255 |
| Onboarding · Sin onboarding (PDF p. 21) | Pendiente de revisión visual | 6,2 / 255 |
| EPP (PDF p. 22) | Pendiente de revisión visual | 7,5 / 255 |
| EPP · devolución (PDF p. 23) | Pendiente de revisión visual | 7,9 / 255 |
| Licencias (PDF p. 24) | Pendiente de revisión visual | 7,7 / 255 |
| Licencia · registro (PDF p. 25) | Pendiente de revisión visual | 7,6 / 255 |
| Licencia · detalle (PDF p. 26) | Pendiente de revisión visual | 8,5 / 255 |
| Offboarding · bandeja (PDF p. 27) | Pendiente de revisión visual | 6,4 / 255 |
| Offboarding · datos (PDF p. 28) | Pendiente de revisión visual | 7,5 / 255 |
| Offboarding · checklist (PDF p. 29) | Pendiente de revisión visual | 8,8 / 255 |
| Offboarding · liquidación (PDF p. 30) | Pendiente de revisión visual | 6,6 / 255 |
| Offboarding · cierre (PDF p. 31) | Pendiente de revisión visual | 5,9 / 255 |
| Organización y dotación · resumen (PDF p. 32) | Pendiente de revisión visual | 8,5 / 255 |
| Organización y dotación · estructura (PDF p. 33) | Pendiente de revisión visual | 6,6 / 255 |
| Organización y dotación · asignados (PDF p. 34) | Pendiente de revisión visual | 7,9 / 255 |
| Organización y dotación · historial (PDF p. 35) | Pendiente de revisión visual | 7,4 / 255 |
| Calendario de asistencia (PDF p. 36) | Pendiente de revisión visual | 6,5 / 255 |
| Gestión documental · bandeja (PDF p. 37) | Pendiente de revisión visual | 6,5 / 255 |
| Gestión documental · tipo (PDF p. 38) | Pendiente de revisión visual | 7,4 / 255 |
| Gestión documental · información (PDF p. 39) | Pendiente de revisión visual | 7,0 / 255 |
| Gestión documental · contenido (PDF p. 40) | Pendiente de revisión visual | 8,0 / 255 |
| Gestión documental · confirmación (PDF p. 41) | Pendiente de revisión visual | 5,1 / 255 |
| Inicio | Pendiente de revisión visual | 10,6 / 255 |
| Inicio módulo | Pendiente de revisión visual | 7,2 / 255 |
| Login | Pendiente de revisión visual | 7,2 / 255 |
| Perfiles | Pendiente de revisión visual | 6,9 / 255 |
| Módulos | Pendiente de revisión visual | 8,7 / 255 |

El bloque Offboarding queda completo con cinco pantallas replicadas: bandeja (p. 27),
datos y causal (p. 28), checklist y revisión por áreas (p. 29), liquidación (p. 30) y
cierre (p. 31). El bloque Calendario de asistencia queda completo con su única pantalla
(p. 36, UX-22). El bloque Gestión documental queda completo con cinco pantallas: la bandeja
(p. 37), el tipo de documento (p. 38), la información del documento (p. 39), el contenido
con vista previa (p. 40) y la confirmación (p. 41). Con esta última **el PDF queda agotado:
41 de 41 páginas con ventana replicada**. El MAE es una medida de calibración contra el
render del diseño, no un criterio de aceptación: la validación es visual y la hace el
usuario o el responsable funcional.

## 8. Divergencias conocidas (deliberadas)

El prototipo replica el diseño **tal como está dibujado**; estas diferencias con la spec se
resuelven en la implementación funcional, no aquí:

1. **Erratas del diseño** replicadas literalmente: «fomulario», «Selecionar»,
   «Responsable de Aprobración».
2. **«Enviar por Correo»** en la confirmación: el diseño lo dibuja; la spec §7.2
   (criterio 18) lo excluye.
3. **Formulario**: el dibujo no marca Comentario como obligatorio, muestra «Colaborador a
   reemplazar» sin condicionarlo a Motivo = Reemplazo y usa fecha en lugar de duración
   (D-02 y criterios 3, 20 y 24 de la spec).
4. **Detalle**: el resumen reproduce el escenario de ejemplo 4/2/2 con «Pendiente de
   Aprobación», marcado como inválido en D-04; además el mock rotula la cuarta columna de
   alertas como «Descripción» (duplicado).
5. **Navegación del Inicio**: el mock dibuja todas las pestañas en gris; se mantiene «Inicio»
   activo para no romper el patrón del resto de ventanas.
6. **Ventanas de acceso**: pertenecen al flujo de entrada (core), no a RR. HH.; se generan
   aquí solo como prototipo visual.
7. **Bandeja de candidatos (PDF p. 10)**: la fuente conserva dos artefactos visibles —la
   etiqueta tenue «UX-05» y el encabezado «Requerimientos» con su breadcrumb de detalle—;
   se replican por fidelidad al render. El azul medido en el PDF es `#2b48e9`, ligeramente
   distinto del token `#2249f2`; esta ventana lo adopta solo para sus propios elementos.
8. **Detalle de candidato (PDF p. 11)**: la maqueta es parcial; se replica solo lo dibujado
   (resumen, etapas, evaluación, acciones, documentos, historial y rail), sin añadir acciones
   ni estados ausentes. El azul medido es `#2b48e9`, por lo que la ventana usa su propio
   token, igual que la bandeja de candidatos.
9. **Bandeja de colaboradores (PDF p. 12)**: la pestaña activa es «Colaboradores» —no
   «Inicio»— y su submenú dibuja «Alta a Colaborador» y «Colaboradores». El azul medido es
   `#2b48e9`, igual que en las páginas 10 y 11, y se aplica solo a esta ventana. La maqueta
   no dibuja la etiqueta de arte «UX-08» ni la línea divisoria entre las dos últimas filas de
   la tabla; se replica tal cual.
10. **Ficha de colaborador (PDF p. 17)**: la maqueta mantiene «Colaboradores» como pestaña
    activa pero no dibuja submenú; la navegación se replica sin él. Se conservan las erratas
    del dibujo («Documetnos», «Operador logistico...») y sus datos de muestra. No se añaden
    acciones que la página no dibuje. Además del azul `#2b48e9`, esta ventana ajusta su propio
    fondo (cálido al noroeste, lavanda al sureste) para acercarse al render; el cromo
    compartido no cambia.
11. **Ficha de colaborador · Boletas de Pago (PDF p. 18)**: reutiliza la ficha de la p. 17 con
    la pestaña «Boletas de Pago» activa y sustituye el contenido central por la tabla dibujada.
    Se replican tal cual sus ocho filas de muestra (aunque el pie diga «Mostrando 10 de 246»),
    la barra horizontal bajo las pestañas, los importes con «s/» y las celdas «0.0hrs» y
    «0.0 días». La tabla no dibuja filtros ni acciones de fila; no se añaden. Se mantiene el
    azul `#2b48e9` y el fondo cálido-lavanda de esta ficha.
12. **Ficha de colaborador · Boletas con proceso (PDF p. 19)**: la misma ficha con «Boletas de
    Pago» activa, pero con la tabla desplazada al final de su recorrido horizontal. La medición
    de la página da el tirador de la barra en el extremo derecho (x ≈ 1107–1570 de 1920), la
    columna «Mes» congelada y siete columnas visibles —Mes, Horas Extras, Recargos, Horas no
    Trabajadas, Días no Trabajados, Proceso y Acciones—, sin Sueldo Bruto, Sueldo Neto ni Aporte
    Empleador. Las filas de muestra repiten 10-2026, 0.0hrs, 0.0 días y «Septiembre 2026», y la
    columna Acciones dibuja un ojo y una impresora; no se añaden otras acciones. **Nota de
    divergencia:** el inventario de `main` rotula la p. 19 como «Ficha: asistencia», pero el
    render y el OCR muestran la tabla de boletas descrita; la pestaña «Asistencia» no aparece
    activa en ninguna página revisada (17, 18, 19 y 36). La p. 36 es el calendario de asistencia
    (UX-22) y la cobertura de `main` ya registra UX-20 sin página. Esta rama replica lo dibujado
    y deja la discrepancia documentada aquí; el inventario no se modifica.
13. **Alta · selección (PDF p. 13)**: el inventario la describe como «Parcial; solo
    búsqueda»; se replica únicamente lo dibujado —pasos del alta, búsqueda y resultados de
    colaboradores, selección de requerimiento, tipo de ingreso y acciones—, sin añadir
    campos, validaciones ni estados ausentes. Se conserva la errata «Colaborades» del
    breadcrumb y los datos de muestra (RQ-0222, Luis Torres). El azul medido es `#2b48e9`,
    igual que las páginas 10–12, aplicado solo a esta ventana; la maqueta usa además un
    fondo cálido-lavanda compartido con la ficha (p. 17).
14. **Alta · datos personales y de trabajo (PDF p. 14)**: segundo paso del alta, con el
    mismo cromo, stepper y barra de acciones del primero. Se replica solo lo dibujado: el
    resumen del candidato, la rejilla de datos personales, los métodos de pago, la foto y
    las tallas. Se conservan como literales las erratas del dibujo «Tipo de documetno»,
    «15/10&2026», «RQ - 02222», «Metodos de pago» y «Máx500kbp». El stepper dibuja los
    pasos 1 a 4 en azul y el 5 en gris, con el subrayado de progreso desplazado; se replica
    tal cual, igual que los campos sin desplegable (fecha, forma de pago, tipo de cuenta,
    documento, grado de educación y cant. de hijos). Se mantiene el azul `#2b48e9` solo
    para esta ventana y no se añaden validaciones ni estados ausentes.
15. **Alta · resumen de validaciones (PDF p. 15)**: tercer paso del alta, con el mismo cromo,
    columnas y barra de acciones. El stepper dibuja los cinco pasos en azul y el subrayado
    bajo «Validación Final». Se replica solo lo dibujado: el resumen de datos del colaborador,
    la información adicional con sus tallas y las cuatro validaciones con sus indicadores
    (Completado, En Proceso, Pendiente), fechas y botones; sin validación real ni confirmación
    de alta. Se conservan las erratas «Colaborades», «Documento Ident.», «Deposito a cuenta»,
    «Ahorro», «Talla de Pantalón» y «registradao.», y el doble título «Resumen Final de
    validaciones» de ambas tarjetas. Los datos de muestra (DNI 7142123456, fechas 15/10/2026)
    no son reglas. Se mantiene el azul `#2b48e9` solo para las ventanas del alta.
16. **Alta · confirmación (PDF p. 16)**: cuarto y último paso del alta. El stepper repite
    los cinco pasos en azul con el subrayado bajo «Validación Final»; se replica la pantalla
    de éxito con su icono y confeti, el título y el mensaje, la tarjeta «Datos del
    Colaborador» con la insignia «Activo», el bloque «Procesos Posteriores» con sus cuatro
    indicadores y los tres botones dibujados. No hay redirecciones ni acciones: los botones
    y el enlace «EPP y Equipos» son presentacionales. Se conservan como literales las
    erratas «Colaborades», «en el modulo de Colaboradores» y «Lima- Sede Principal», y los
    datos de muestra (COL-0000125, 12 / 10 / 2026) no son reglas. El azul medido es
    `#2b48e9`, igual que en los pasos 1–3.
17. **Bandeja de licencias y ausencias (PDF p. 24)**: la pestaña activa es «Asistencia» —no
    «Inicio»— y su submenú dibuja «Licencia y Ausencias» y «Registrar»; el dibujo alterna el
    singular en el título, el breadcrumb, el submenú y el botón «Registrar Solicitud» con el
    plural de la pestaña «Licencias y Ausencias». El azul medido en esta página es `#2249f2`
    —el token base del prototipo, no el `#2b48e9` de las páginas 10–19—. Se replican las
    erratas y artefactos literales: «Ultimos 30 dias», «Aprobadas / Registrada», «Sin
    impacto», «Dpt. Adminstración», el buscador «Buscar candidatos por nombre, DNI o
    puesto...» y la repetición de «Contratos por Vencer» en Acciones rápidas. La maqueta no
    dibuja casillas marcadas, filtros aplicados ni más estados: no se añaden. Solo se replica
    la bandeja; el registro (p. 25) y el detalle/subsanación (p. 26) quedan en tareas
    posteriores.
18. **Registro de licencia/ausencia (PDF p. 25)**: formulario de registro con el mismo cromo y
    lenguaje visual del alta y de la bandeja. La pestaña activa vuelve a ser «Asistencia»,
    esta vez **sin submenú**. Se replica solo lo dibujado: selección de colaborador, tipo de
    solicitud, información general, sustento documental, impacto en asistencia y planilla,
    observaciones y la barra Cancelar / Guardar Borrador / Continuar, sin validaciones,
    cálculos, estados de carga ni navegación. Se conservan como literales las erratas
    «Colaborades» y «calendaria», el subtítulo copiado del alta («Formaliza el ingreso del
    candidato seleccionado…»), el placeholder «Buscar por nombre, DNI....» y el dato de
    muestra «7 días» para el rango del 20 al 24 de noviembre. El azul medido es `#2249f2`.
    La maqueta dibuja el formulario 14 px más ancho que la columna compartida; el sobrante
    se replica dentro del bloque de registro y no altera el cromo ni el rail. Los controles
    (selects, fechas, zona de carga y botones) son presentacionales.
19. **Detalle y subsanación de licencia (PDF p. 26)**: tercera pantalla del bloque, con el
    cromo de la bandeja y la pestaña «Asistencia» sin submenú. Se replica solo lo dibujado: la
    ficha de la solicitud con identidad, cinco campos y la línea de tiempo; la información de
    la solicitud; los documentos del postulante con su zona de carga; el impacto en asistencia
    y planilla; las observaciones; las alertas y destinatarios; el resumen de solicitud y las
    tres acciones. No hay lógica de subsanación, validaciones ni transiciones: los botones,
    enlaces y controles son presentacionales. Se conservan como literales las erratas y
    artefactos del dibujo —«Postulante» y «Volver a Postulantes», «Secundaria Completa» como
    motivo, «19 /10 /2026 - 21/10/2026», «Requerimiento aprobado» como tipo de permiso,
    «7 DÍAS» frente a los 3 días del resto de la ficha, «calendaria», «RR.HH» sin punto y
    «Adjunto . PDF» en ambos archivos— y sus datos de muestra no son reglas. El azul medido
    es `#2249f2`, igual que en las páginas 24 y 25.
20. **Asignaciones de EPP y equipos (PDF p. 22)**: la pestaña activa es «EPP y Equipos» y su
    submenú dibuja «Detalle» —resaltado— y «Devolución y Reposición». El cromo compartido
    mantiene «Asistencia» en singular frente al «Asistencias» del render; no se modifica para
    no alterar el resto de ventanas. El azul medido es `#2249f2`. Se replica solo lo dibujado:
    búsqueda y cuatro filtros, cuatro indicadores, barra de orden, tabla de seis filas con
    badges y paginador; sin filtros aplicados, casillas marcadas, acciones ni estados
    adicionales. Se conservan como literales las erratas y artefactos «Stock Minimo», el
    buscador «Buscar candidatos por nombre, DNI o puesto...», los dos badges «Dañado» con
    relleno distinto (ámbar y rojo) y las fechas con espacios irregulares.
21. **Devolución y reposición de EPP (PDF p. 23)**: segunda pantalla del bloque, con el mismo
    cromo y la pestaña «EPP y Equipos» activa, pero **sin submenú dibujado**. Se replica solo lo
    dibujado: breadcrumb de tres niveles, título y subtítulo, botón «Registrar Movimiento»,
    búsqueda y cuatro filtros, cuatro indicadores, barra de orden, tabla de diez columnas con
    badges y paginador. El inventario advierte que es «referencia visual de bandeja; no se
    observa el formulario completo de movimiento»: por eso no se añade modal, panel ni campos
    de alta. Se conservan como literales las erratas y artefactos del dibujo —«Candidato» como
    cabecera de la tabla, «Stock Minimo» sin tilde, la cantidad «L» en las reposiciones y las
    fechas «15 / 10 / 2026» con espacios— y sus datos de muestra no son reglas. El azul medido
    es `#2249f2`, igual que en la p. 22.
22. **Bandeja de onboarding en curso (PDF p. 20)**: primera pantalla del bloque de Onboarding.
    La pestaña resaltada en el dibujo es «Offboarding» —con «Onboarding» inactiva— y no hay
    submenú; el título dice «Onborading» y el hero usa el subtítulo «Gestión de Onboarding de
    Colaboradores». Se replican tal cual, junto con «Sin Responsabless» y el buscador
    «Buscar candidatos por nombre, DNI o puesto...». La maqueta dibuja el rail de la p. 22 algo
    más arriba y con las tarjetas 2 px más altas; el ajuste se limita a `.ux09-lienzo`. No se
    añaden acciones, filtros aplicados ni estados. El azul medido es `#2249f2`.
23. **Bandeja de onboarding «Sin onboarding» (PDF p. 21)**: segunda y última pantalla del bloque.
    Reutiliza la bandeja de la p. 20 con el estado `sin-onboarding`: activa la pestaña «Sin
    Onboarding», añade la fila de vistas «Colaboradores / Colaboradores sin Ficha / Tareas /
    Analítica» —solo la primera dibujada como activa— y estrecha y desplaza los indicadores. El
    cromo no cambia: «Offboarding» sigue resaltada en la navegación y sin submenú, igual que en
    la p. 20. Se conservan las erratas y artefactos literales del dibujo —«Onborading», «Sin
    Responsabless», el buscador de candidatos— y no se añaden tablas, acciones ni estados que la
    página no dibuje. Los datos de muestra (COL-00125, Luis Torres, 12 / 09 / 2026) no son
    reglas. El azul medido es `#2249f2`; el paginador activo, `#1c4cf7`.
24. **Resumen de organización y dotación (PDF p. 32)**: primera pantalla del bloque de
    dotación. El cromo no es idéntico al compartido: el dibujo rotula la pestaña «Licencias»
    —no «Asistencia»—, omite «Gestión Documental» y usa anchos de pestaña más estrechos, de
    modo que la píldora activa queda en 1401–1567. Para no alterar el resto de ventanas,
    `ux02/Cromo.tsx` acepta una lista `tabs` opcional y solo este bloque pasa la suya. El azul
    medido es `#2b48e9` (como las páginas 10–19), aplicado solo dentro de `.ux18-lienzo`. Se
    replica solo lo dibujado: las tres cifras del resumen, los siete filtros, las seis
    tarjetas con su badge y sus pares de muestra, el paginador y el rail; no se añaden estados,
    filtros aplicados ni acciones. Se conservan como literales «pendientes», «Cobertura al
    90 %», el duplicado «Contratos por Vencer» y el icono de cierre de «Nuevo Reclutamiento».
    Las páginas 33–35 (UX-19) quedaban pendientes.
25. **Detalle de dotación por cliente (PDF p. 33)**: el inventario rotula la p. 33 como
    «estructura de puestos», pero el dibujo activa la pestaña «Dotación por área y cargo» y
    titula la tarjeta «Estructura organizacional»; se replican esos literales. El cromo repite
    la pestaña «Licencias» y el azul vuelve a `#2249f2`. Se conservan la errata del breadcrumb
    «Colaborades», el punto «.» en Pendientes de Calidad, la tercera acción vacía del rail y
    los dos verdes de los badges. La maqueta no dibuja interacción entre pestañas ni estados
    de edición: la prop `pestanaActiva` solo cambia el resaltado y el contenido permanece en
    la estructura dibujada.
26. **Colaboradores asignados de la dotación (PDF p. 34)**: el inventario rotula la p. 34 como
    «colaboradores activos», pero la maqueta activa la pestaña «Colaboradores asignados» y
    dibuja dos indicadores distintos, «Colaboradores Asignados» y «Colaboradores Activos»;
    se replican los literales dibujados. El cromo, la ficha de cliente y el azul `#2249f2`
    son los de la p. 33. Las cuatro pestañas mantienen la posición de la p. 33: la píldora
    de la activa crece hacia fuera y no desplaza al resto, por eso esta variante ajusta los
    márgenes solo dentro de `.ux19-pestanas--asignados`. El paginador se dibuja con la página
    activa más alta que los demás botones (46 px frente a 37), y esa diferencia se replica
    con un fondo propio sin mover los números. Se conservan la fila de Luis Torres
    duplicada, el documento y la fecha repetidos y «Mostrando 10 de 246» frente a las cinco
    filas dibujadas. Las líneas verticales de la tabla solo recorren las cuatro primeras
    filas; no se añaden acciones, filtros aplicados ni estados.
27. **Historial de cambios de la dotación (PDF p. 35)**: cuarta y última pantalla del bloque.
    El inventario la rotula «historial de asignación», pero la maqueta dibuja la pestaña
    «Historial de cambios» y se replica ese literal. Reutiliza el cromo, la ficha de cliente
    y el azul `#2249f2` de la p. 33. Se replica solo lo dibujado: cuatro indicadores, cuatro
    filtros, barra de orden, tabla de cinco filas con badges y paginador; no se añaden
    acciones, filtros aplicados ni estados. Se conservan como literales «Colaborades»,
    «Ajuste de reasignación», «Valor nuevo» en minúscula, la fecha repetida y «Mostrando 10
    de 246» frente a las cinco filas dibujadas; la reasignación deja vacíos sus valores y los
    importes numéricos usan gris y cuerpo menor. La maqueta no dibuja interacción de
    pestañas ni edición: la prop `pestanaActiva` solo cambia el resaltado.
28. **Bandeja de offboarding (PDF p. 27)**: primera pantalla del bloque Offboarding. La
    pestaña activa es «Offboarding» —sin submenú— y el azul medido es `#2b48e9`, aplicado
    solo dentro de `.ux16-lienzo`; el paginador activo mide `#294bee`. Se replica solo lo
    dibujado: cabecera de búsqueda y cuatro filtros, pestañas de estado, cuatro indicadores,
    barra de orden, tabla de tres filas y paginador; no se añaden filtros aplicados, acciones
    ni estados. Se conservan como literales las erratas «Casual de cese», el identificador
    «offL-00125», la fila y el documento repetidos y «Mostrando 10 de 246» frente a las tres
    filas. `MarcoOffboarding` deja preparado el contenido para el stepper; las pp. 29–31 se
    replican aparte en `offboarding-checklist`, `offboarding-liquidacion` y `offboarding-cierre`.
29. **Offboarding · datos y causal (PDF p. 28)**: primera etapa del proceso (UX-17). Reutiliza
    el cromo, el azul `#2b48e9` y el rail de la p. 27; la banda del stepper y el subrayado
    activo miden `#2b48e9`, y el círculo activo `#294bee`. Se replica solo lo dibujado:
    búsqueda y selección de colaborador, causal y fecha de cese, motivo con contador, resumen
    del proceso y la barra de acciones. No se añaden validaciones, cálculos, opciones de
    desplegable ni transiciones: los controles y el contador son presentacionales. Se
    conservan como literales «Selec. Colaborador», «Procesos de offboarding», «Liquidicación»
    (frente a «Liquidación» del stepper), «Nac: Peruano», «999 999 99» y «Cese Programado :
    20/10/2026». La p. 29 se replica en `offboarding-checklist` y comparte `StepperOffboarding`;
    la p. 30 se replica en `offboarding-liquidacion` y la p. 31 en `offboarding-cierre`.

30. **Offboarding · checklist y revisión por áreas (PDF p. 29)**: segunda pantalla del
    proceso y la única que cubre dos etapas a la vez. El stepper dibuja «Datos y Causal»,
    «Checklist de salida» y «Revisiones por áreas» en azul, con la barra de progreso bajo
    las etapas 2 y 3; se replica tal cual, sin marcar una etapa como única. Reutiliza el
    cromo, el azul `#2b48e9`, el círculo activo `#294bee` y el rail de la p. 28. Se replica
    solo lo dibujado: ficha del proceso, ocho tareas de checklist con sus casillas y menús,
    «Marcar todas las casillas», tabla de revisión por áreas con cuatro filas y badges, nota
    al pie y la barra Anterior / Guardar Borrador / Continuar. Las casillas, los estados y
    las fechas son presentacionales: no hay lógica de marcado, cálculo ni transición. Se
    conservan como literales «Casual de cese», «SSTS», «CCalculo», «Checklist de Salida», el
    nombre «Jesus Vargas» sin tilde y la nota «…los cuadros a marcar… que este en proceso…».
    La p. 30 se replica en `offboarding-liquidacion` y la p. 31 en `offboarding-cierre`.

31. **Offboarding · liquidación (PDF p. 30)**: cuarta etapa del proceso. Reutiliza el cromo,
    el azul `#2b48e9`, la ficha y el rail de las pp. 28–29; el círculo activo mide `#294bee`.
    El stepper marca los pasos 1–4 en azul y deja «Cierre» en gris, con la barra de progreso
    de 202 × 5 solo bajo «Liquidación», y el hero no dibuja el botón «Regresar a
    Offboarding». Se replica solo lo dibujado: el resumen general, la tabla Concepto /
    Detalle con sus tres conceptos y el total, y la barra Anterior / Guardar Borrador /
    Continuar. Los montos y el total se copian literalmente, sin recalcular; se conservan
    los artefactos del dibujo —el importe de la primera fila en la columna «Detalle», la
    columna de importes sin rótulo, `s/ 2.060.00` con punto frente a `s/1,030.00` con coma,
    el doble espacio de `-  s/ 200.00` y los espacios de «Descuentos (EPP/ equipos
    /adelantos)»—. La p. 31 se replica en `offboarding-cierre`.

32. **Offboarding · cierre (PDF p. 31)**: quinta y última etapa del proceso. Reutiliza el
    cromo, el azul `#2b48e9`, el rail y el stepper de las pp. 28–30; el círculo activo mide
    `#294bee`. El stepper marca los cinco pasos en azul y la barra de progreso de 201 × 5
    queda solo bajo «Cierre». Se replica solo lo dibujado: el halo de confirmación con sus
    seis confetis, el título y el mensaje de éxito, la tarjeta de datos del colaborador con
    badge «Activo» y la tarjeta de procesos realizados con sus cuatro chips y badges, más
    la barra de tres botones. No se añaden acciones, redirecciones, cálculos ni
    persistencia: botones y badges son presentacionales. Se conservan como literales
    «EPPS», «En Proceso», «12 / 10 / 2026», «Lima- Sede Principal» y los espacios sueltos
    de «15 /10 /2026 15:22»; el hero dibuja «Proceso de offboarding» con minúscula y sin
    botón de regreso.
33. **Calendario de asistencia (PDF p. 36)**: pantalla única del bloque (UX-22). Reutiliza
    el cromo y el azul `#2249f2` de la p. 24, con la pestaña «Asistencia» activa y sin
    submenú. Se replica solo lo dibujado: las cuatro pestañas internas, la tarjeta de
    filtros, la barra de mes, el conmutador Mes / Semana / Día, la rejilla de cinco semanas
    con sus marcas y la agenda del día con su resumen. Los eventos, el contador `+5`, el día
    seleccionado y las cifras del resumen son los del dibujo: no se calculan festivos ni se
    generan eventos. Se conservan como literales la errata «Calendaria de Asistencia» del
    título, «Área / Subárea», «Tipo de Evento», «Mié», el periodo
    «20/11/2026 - 25/11 / 2026 ( 5 días)» y la ausencia de cifra en «Ausencias». El icono
    de vacaciones y el libro de licencia se dibujan como SVG porque el subconjunto de
    Material Symbols no reproduce el parasol y el libro cerrado del diseño; el resto usa
    los glifos del subconjunto (maletín «work» y documento con lápiz «edit_document»).
34. **Bandeja global de gestión documental (PDF p. 37)**: primera pantalla del bloque
    Gestión documental (UX-23), con la pestaña «Gestión Documental» activa y el azul medido
    `#2b48e9`. El inventario advierte que la gestión documental completa exige más estados
    de los dibujados: se replica solo esta bandeja —filtros, pestañas, barra de orden, tabla
    de cinco filas, badges, paginador y rail—, sin completar el flujo. Se conservan los
    artefactos literales «Colaborador» duplicado, «última actualización» en minúscula,
    «Revisiones Pendientes», «Jefe de Área» como área, el `.docx` rotulado «Anexo» en
    «Constancias» y la repetición de «Contratos por Vencer». Las etapas de generación
    (pp. 38–41) quedan fuera; `MarcoDocumental` reserva el slot `stepper`.

35. **Generación documental · información del documento (PDF p. 39)**: segundo paso del
    flujo (UX-24). Reutiliza el cromo, el stepper y el azul `#2249f2` de la p. 38, con el
    acento `#1c4cf7` en los círculos de paso y en la etiqueta activa. El hero **no dibuja**
    el botón de regreso de la p. 38 y el subrayado de 239 × 5 se desplaza bajo el paso 2.
    Se replica solo lo dibujado: la tarjeta de resumen de cinco bloques, la banda de la
    plantilla, las dos columnas de campos y el pie con la barra informativa y las tres
    acciones; no se añaden validaciones, cálculos ni transiciones. Se conserva literal el
    valor «Plazo indeterminado» en «Remuneración Mensual», aunque no corresponda con su
    etiqueta. Los controles son presentacionales y los datos de muestra no son reglas.
    Las pp. 40–41 se cubren en los puntos 36 y 37.

36. **Generación documental · contenido y vista previa (PDF p. 40)**: tercer paso del flujo
    (UX-24). Reutiliza el cromo, el stepper y el azul `#2249f2` de las pp. 38–39, con el
    acento `#1c4cf7` en el círculo y la etiqueta del paso activo. El subrayado de 212 × 5
    queda bajo «Contenido y Variables» y el hero no dibuja el botón de regreso. Se replica
    solo lo dibujado: el resumen de la generación, las siete variables con sus casillas y
    valores, «Marcar todas las casillas», las pestañas «Vista Previa» / «Editar documento»,
    la hoja con su texto de muestra y los controles de paginación, zoom y pantalla completa,
    más la barra informativa y las tres acciones. No se añaden variables, párrafos, un editor
    activo, validaciones ni transiciones. Se conservan literales «cons ectetuer» partido en
    la hoja, «s/1,500.00» y «Confirmar >». Los datos de muestra no son reglas.

37. **Generación documental · confirmación (PDF p. 41)**: cuarto y último paso del flujo
    (UX-24). Reutiliza el cromo y el azul `#2b48e9` de las pp. 37–40 para navegación y
    botones, y el stepper con un azul propio `#294bee`. La página arrastra el cromo de Alta
    —breadcrumb «R.R.H.H / Colaborades» y hero «Alta de Colaborador»— y no dibuja el botón de
    regreso. Se replica solo lo dibujado: el éxito con halo, check y confetis; el resumen del
    documento con cabecera, badge «Finalizado», archivo, píldora «Enviado a firmas» y dos
    columnas de datos; y los tres botones finales, con el tercero sólido. Se conserva literal
    «accesión» en el subtítulo. No hay acciones, navegación ni transición reales; los datos
    de muestra no son reglas.

## 9. Cierre y siguiente paso

- Con `alta-seleccion`, `alta-datos`, `alta-resumen` y `alta-confirmacion` quedan
  replicados los **cuatro pasos del alta** (PDF pp. 13–16, UX-07).
- Con `epp` y `epp-devolucion` quedan replicadas las **dos pantallas del bloque de EPP**:
  la **bandeja de asignaciones de EPP y equipos** (PDF p. 22, UX-11) y la **devolución y
  reposición** (PDF p. 23, UX-12).
- Con `onboarding` y `onboarding-sin` queda replicado el **bloque completo de Onboarding**
  (PDF pp. 20-21, UX-09/10): la bandeja «En curso» y su variante «Sin onboarding».
- Con `licencias`, `licencia-registro` y `licencia-detalle` queda replicado el **bloque
  completo de Licencias** (PDF pp. 24-26): la **bandeja de licencias y ausencias** (UX-13), el
  **registro de licencia/ausencia** (UX-14) y el **detalle y subsanación de licencia**
  (UX-15), las tres con el mismo cromo y el azul `#2249f2`.
- Con `offboarding`, `offboarding-datos`, `offboarding-checklist`, `offboarding-liquidacion`
  y `offboarding-cierre` queda replicado el **bloque completo de Offboarding** (PDF pp. 27-31,
  UX-16/17): la bandeja (p. 27), los datos y la causal (p. 28), las etapas 2 y 3 —checklist y
  revisión por áreas— (p. 29), la liquidación (p. 30) y el cierre con la confirmación (p. 31).
- Con `dotacion`, `dotacion-estructura`, `dotacion-asignados` y `dotacion-historial` queda
  replicado el **bloque completo de Organización y dotación** (PDF pp. 32-35, UX-18/19):
  el resumen (p. 32), la estructura organizacional (p. 33), los colaboradores asignados
  (p. 34) y el historial de cambios (p. 35). Las tres variantes del detalle reutilizan
  `MarcoDotacion`, `DetalleDotacion` y la navegación del bloque.
- Con `calendario` queda replicado el **bloque Calendario de asistencia** (PDF p. 36,
  UX-22): una sola pantalla con la rejilla mensual, la leyenda y la agenda del día.
  El bloque queda completo.
- Con `documental` queda replicada la **bandeja global de gestión documental** (PDF p. 37,
  UX-23), primera pantalla del bloque Gestión documental. Con `documental-tipo` queda
  replicado el **primer paso de la generación** —tipo de documento y colaborador— (PDF p. 38,
  UX-24), con `documental-info` el **segundo paso** —información del documento— (PDF p. 39,
  UX-24), con `documental-contenido` el **tercer paso** —contenido y vista previa— (PDF
  p. 40, UX-24) y con `documental-confirmacion` el **cuarto y último paso** —confirmación y
  resumen del documento— (PDF p. 41, UX-24). El bloque Gestión documental queda completo con
  cinco pantallas y **el PDF agotado: 41 de 41 páginas con ventana replicada**.
- El merge de esta rama a `main` es **lineal** y lo hace el usuario tras validar las ventanas.
- `memory.md` se actualiza en `main` cuando el usuario cierre la fase; este documento no
  duplica la bitácora.
- Después del cierre, el trabajo continúa en el repositorio principal con **T-RH-06**
  (persistencia intra-sesión de filtros y apertura de fila con contexto), que requiere
  confirmación explícita del usuario.
