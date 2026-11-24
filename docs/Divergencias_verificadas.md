# Divergencias verificadas contra el PDF

> **Estado tras T-RH-27 (24-nov-2026):** solo sobreviven las ventanas `ux02`, `ux03`,
> `ux04`, `inicio` y `acceso`; las doce áreas restantes se podaron y este documento conserva
> la auditoría del estado anterior. T-RH-06 está cerrada; el siguiente paso es T-RH-23.

**Fecha:** 23 de noviembre de 2026.
**Carácter:** documento de rama (`codex/rh-vis`). **No es una spec, no añade requisitos** y no
sustituye a `docs/constitution.md`, a `docs/specs/`, a `memory.md` ni a
`docs/Prototipo_visual_ventanas.md`. Su único objeto es auditar, una por una, las
discrepancias que se documentaron al replicar las ventanas.

**Fuente:** `.cache/visual-sources/MP360PantallasRRHH.pdf` (41 páginas, 1920 × 1176 pt).

**Método:** render con `.cache/pdfrender` (PDFKit) a 1920 px de ancho; OCR con `.cache/ocr`
(Apple Vision, `usesLanguageCorrection = false`, idiomas `es-ES`/`en-US`); muestreo de píxeles
con Pillow (`PYTHONPATH=$PWD/.cache/pylibs`). Las coordenadas son píxeles sobre el render de
1920 × 1176, con origen en la esquina superior izquierda; en el `.ai` (1344 × 822) se indica
la escala. Los renders de trabajo viven en `.cache/audit1920/` y `.cache/audit/`, no
versionados.

**Nota sobre el color.** El PDF declara un único azul primario en los operadores `rg` y `RG`
de sus páginas: `34 73 242` = **#2249f2**, presente en las 41 páginas; el acento de los
pasos es `28 76 247` = **#1c4cf7**. No aparece `#2b48e9` en ningún flujo de contenido del
PDF. PDFKit, al rasterizar, desplaza esos valores: #2249f2 se muestra como **#2c48e9** y
#1c4cf7 como **#294bee** (≈ +10/−1/−9 por gestión de color). Por eso, cuando una ficha cita
un color se distingue **fuente** (lo declarado en el PDF) de **render** (el píxel muestreado).
Las imágenes `referencia-*.jpg` versionadas alternan #2349f2 y #2b49e9 según la página —ese es
el origen probable de la distinción por páginas del documento de rama—, pero el PDF no
contiene el par #2249f2/#2b48e9 que sugiere el documento.

**Resultado:** **21 CONFIRMADOS, 4 PARCIALES, 0 DESMENTIDOS** de las afirmaciones del
documento de rama. Además, el inventario de `main` queda **desmentido** en la p. 19
(«Ficha: asistencia»), como ya adelantaba §8.12 del documento de rama; y en las pp. 33–35 sus
rótulos de pestaña tampoco coinciden con lo dibujado, también según §8.

**Resueltos en la implementación (23-nov-2026, commit de este lote):** el ítem 14 (azul único
`#2249f2`/`#1c4cf7`) y el ítem 25 (monograma «MP» del pie sin recuadro) ya no son divergencias
abiertas.

## Tabla resumen

Las cuatro fichas parciales van primero, para que se vean antes que el resto.

| # | Página | Afirmación | Veredicto | Evidencia |
|---|---|---|---|---|
| 7 | 24 | «Licencia y Ausencias» singular; «Ultimos 30 dias»; «Aprobradas / Registrada»; «Dpt. Adminstración»; azul #2249f2 | **PARCIAL** | Singular, «Aprobradas / Registrada», «Dpt. Adminstración» y #2249f2 confirmados. El literal es **«Últimos 30 días»**, con tildes (dos veces), no «Ultimos 30 dias» |
| 10 | 28 | Stepper de 5 pasos; «Liquidicación» vs «Liquidación»; «Nac: Peruano»; DNI distinto entre ficha y lista | **PARCIAL** | Pasos, «Liquidicación» y «Nac: Peruano» confirmados. El DNI es **7142123456 en ficha y en las cuatro filas**; no hay diferencia. La diferencia real está en el teléfono (999 999 999 vs 999 999 99) |
| 14 | 32 | Pestaña en dos líneas; «Licencias»; sin «Gestión Documental»; azul #2b48e9 | **RESUELTO** (era PARCIAL) | Lo textual, confirmado. El PDF declara **#2249f2**, el mismo de la p. 24; el render da #2c48e9, no #2b48e9. No hay dos azules por página. Unificado a `#2249f2`/`#1c4cf7` el 23-nov-2026 (commit de este lote) |
| 20 | 38 | «Selec. Colaborador»; «Nac: Peruano»; «Modifiacón» sin la segunda «c»; recorte «…en la pantall» | **PARCIAL** | «Selec. Colaborador», «Nac: Peruano» y «…pantall», confirmados. El literal es **«Modifiación»**, al que le falta la primera «c» (tras «Modifi»), no la segunda |
| 1 | 19 | ¿Pestaña de Asistencia o «Boletas de Pago» al final de su tabla, con «Proceso» y «Acciones»? | **CONFIRMADO** | Píldora de nav en «Colaboradores» (182 × 51, 637,127) y píldora de subpestaña en **«Boletas de Pago»** (173 × 51, 652,313). Columnas: Mes, Horas Extras, Recargos, Horas no Trabajadas, Días no Trabajados, Proceso, Acciones. El inventario de `main` («Ficha: asistencia») queda desmentido |
| 2 | 20–21 | Pestaña resaltada «Offboarding», no «Onboarding»; sin submenú | **CONFIRMADO** | Píldora «Offboarding» 182 × 51 en (1311,127); «Onboarding» gris en (831,140). Breadcrumb en y = 220/216 sin fila de submenú intermedia |
| 3 | 20 | Título «Onborading» y «Sin Responsabless» | **CONFIRMADO** | «Onborading» en (39,256); «Sin Responsabless» con doble «s» en (390,526) |
| 4 | 21 | Fila de vistas a la derecha de las tabs | **CONFIRMADO** | En y ≈ 470: «Colaboradores» (960,473, píldora 130 × 44 en 950,456), «Colaboradores sin Ficha» (1113,470), «Tareas» (1353,470), «Analítica» (1476,470) |
| 5 | 22 | Submenú «Detalle» resaltado; dos «Dañado» con relleno distinto; «Stock Minimo»; buscador «candidatos»; «Asistencia» vs «Asistencias» | **CONFIRMADO** | «Detalle» en píldora gris 169 × 32 (942,192); «Devolución y Reposición» (976,230) sin píldora. «Dañado» con relleno #fffdbb (1359,763) y #f4b9b8 (1359,816). «Stock Minimo» (962,484); «Buscar candidatos…» (80,348); nav **«Asistencias»** (1197,144) frente a «Asistencia» de la p. 24 |
| 6 | 23 | ¿Submenú bajo «EPP y Equipos»? ¿Formulario o modal de movimiento? | **CONFIRMADO** | Sin submenú: el breadcrumb de tres niveles está en (41,220), inmediatamente bajo el cromo. Solo se dibuja la bandeja y el botón «Registrar Movimiento» (1406,236); no hay formulario ni modal |
| 8 | 25 | Stepper de 4 pasos; «calendaria»; «Selec. Colaborador»; «7 días» para el 20–24 de noviembre | **CONFIRMADO** | Pasos 1–3 azules y «4 Confirmación» gris (100/432/781/1146, ~303). «Selec. Colaborador» (61,365). «Tu solicitud abarca 7 días calendaria del 20 al 24 de noviembre del 2026» (653,896). Del 20 al 24 son 5 días, no 7 |
| 9 | 26 | «Postulante» / «Volver a Postulantes»; «Secundaria Completa» como motivo; «7 DÍAS» frente a 3; «calendaria»; «RR.HH» sin punto | **CONFIRMADO** | Breadcrumb «… / Detalle / Postulante» (41,219); botón «Volver a Postulantes» (1409,242); motivo «Secundaria Completa» (92,570); «3 días» (920,333) frente a «7 DÍAS» (625,570); «La licencia abarca 7 días calendaria…» (655,983); «RR.HH, jefatura directa,» (853,860) |
| 11 | 29 | ¿Dos etapas? Pasos 1–3 en azul y barra de 575 px bajo 2–3 | **CONFIRMADO** | «Checklist de Salida» (64,459) y «Revisión por áreas» (89,707). Pasos 1–3 con azul (1 221 / 5 433 / 2 322 px); pasos 4–5, 0. Barra x = 384–958 en y = 330–334: **575 × 5** |
| 12 | 30 | Barra solo bajo «Liquidación»; sin «Regresar a Offboarding»; punto y coma mezclados; importe de la 1.ª fila en «Detalle» | **CONFIRMADO** | «4 Liquidación» azul (1130,303), «Cierre» gris (1453,309). Barra x = 1064–1265, y = 330–334 (202 × 5). El hero no dibuja botón de regreso. «s/ 2.060.00» (1077,532), dentro de «Detalle» (1074,501); «s/1,030.00» (1423,574); total «s/ 2,890.00» (1420,646) |
| 13 | 31 | Cinco pasos en azul; «EPPS»; «En Proceso»; halo verde de ~78 px | **CONFIRMADO** | Los cinco tramos tienen azul. «Entrega de EPPS» (156,899); «En Proceso» con mayúscula (1074,905). Halo verde: 816–891 × 370–446 = **76 × 77 px** (el documento dice ~78; diferencia de 1–2 px) |
| 15 | 33 | Pestaña «Dotación por área y cargo» (no «estructura de puestos»); tarjeta «Estructura organizacional»; azul #2249f2 | **CONFIRMADO** | «Dotación por área y cargo» activa (664,328); «Estructura organizacional» (535,535). Fuente del azul: **#2249f2** (9 usos `rg`); render #2c48e9 |
| 16 | 34 | Pestaña «Colaboradores asignados» (no «activos»); filas duplicadas; «Mostrando 10 de 246» con 5 filas | **CONFIRMADO** | «Colaboradores asignados» (893,328); los KPI separan «Colaboradores Asignados» (574,395) y «Colaboradores Activos» (837,395). Filas: Luis Torres, Jaime Castillo, Emilia Castellano, Diego Fiestas y Luis Torres otra vez (y ≈ 600–910). «Mostrando 10 de 246» (993,988) |
| 17 | 35 | ¿Tabla o línea de tiempo? «Valor nuevo» en minúscula; reasignación con valores vacíos | **CONFIRMADO** | Es una tabla con cabecera: Fecha, Candidato, Estado, Detalle del cambio, **Valor Anterior**, **Valor nuevo**, Observación. La fila «Reasignación» de Emilia Castellano deja vacías ambas celdas de valor |
| 18 | 36 | «Calendaria de Asistencia»; «Mié»; leyenda de cuatro categorías | **CONFIRMADO** | Título «Calendaria de Asistencia» (39,253); «Mié» (443,607); bajo «Leyenda» (94,994): «Vacaciones» (217,994), «Licencia» (393,991), «Permisos» (552,994) y «Ausencias» (717,994). El prototipo lo rotula «Calendario de Asistencia» por decisión del revisor (lote 2C) |
| 19 | 37 | Dos columnas «Colaborador»; «última actualización» en minúscula; «Jefe de Área» como Área; `.docx` rotulado «Anexo» | **CONFIRMADO** | Cabecera (122,593) y (332,593); «Fecha de Creación» con mayúscula frente a **«última actualización»** (minúsculas). En Área, valor «Jefe de Área» (932,701). «Contrato de trabajo.docx» con Tipo **«Anexo»** (535,755) y Ubicación «Constancias» (1395,755) |
| 21 | 39 | «Remuneración Mensual» con «Plazo indeterminado»; sin «Volver a Gestión Documental» | **CONFIRMADO** | Etiqueta «Remuneración Mensual» (884,618) y valor «Plazo indeterminado» (884,652). El hero (y 210–280) no dibuja el botón de regreso de la p. 38 |
| 22 | 40 | «Vista Previa» activa y «Editar documento» inactiva; siete variables con casilla; «Confirmar», no «Continuar»; DNI distinto entre variable y resumen | **CONFIRMADO** | «Vista Previa» azul con subrayado (823,484); «Editar documento» gris (1294,482). Siete variables marcadas (Nombre Completo, Dni, Puesto, Área, Fecha_Inicio, Remuneración, Tipo de Contrato). «Confirmar >» (1445,992). DNI de la variable **712123456** (387,649) frente a **7142123456** del resumen (103,387) |
| 23 | 41 | Cromo de Alta en la confirmación documental; «accesión»; convivencia de #2b48e9, #294bee y #1e4bf2 | **CONFIRMADO** | Breadcrumb «R.R.H.H / Colaborades» (41,219); hero «Alta de Colaborador» (41,256). «…la accesión seleccionada» (583,489). Tres azules en el render: #2c48e9 (17 266 px; fuente #2249f2), #294bee (1 841 px; fuente #1c4cf7, círculos del stepper) y #1e4bf1 (511 px, avatar en 95,559; Δ1 de #1e4bf2) |
| 24 | `a-05` | Selector de módulo abierto (popover oscuro con cuatro teselas y scrim), no el filtro de Área/Subárea | **CONFIRMADO** | Popover #1c1c1c de 205 × 205 en (20,146), con teselas RH #2b48e9, Operaciones #f0963e, Contabilidad #5d985e y Finanzas #4911ef. Scrim bajo la cabecera: (1000,700) pasa de #ffffff en `a-04` a #8e9799 en `a-05`; la cabecera (700,40) sigue blanca |
| 25 | pie | ¿«MP» sobre la barra sin recuadro propio o dentro de un cuadrado? | **RESUELTO** (era CONFIRMADO) | Sin recuadro en ambas fuentes: monograma blanco directamente sobre #1c1c1c. PDF 68 × 30 en (74,1113) de 1920; `a-04` 48 × 21 en (51,778) de 1344. Misma proporción (3,5 % del ancho y 2,55 % del alto). Solo hay una línea divisoria fina debajo. Pie corregido el 23-nov-2026 (commit de este lote) |

## Fichas

### 1. p. 19 — Asistencia o «Boletas de Pago»

**Afirmación del documento de rama:** la p. 19 no es la pestaña de Asistencia; es la ficha con
«Boletas de Pago» activa y la tabla desplazada al final, con «Proceso» y «Acciones».

**Veredicto: CONFIRMADO.** La pestaña de navegación activa es **«Colaboradores»**: píldora de
182 × 51 px en (637,127), relleno declarado #dfe7f9 (render #e0e7f7). «Asistencia» queda
inactiva tanto en la navegación superior (1186,144) como en la fila de subpestañas (1177,325).
La subpestaña activa es **«Boletas de Pago»**: píldora de 173 × 51 px en (652,313), mismo
relleno; su texto OCR está en (675,328).

Cabecera de tabla (y ≈ 411–423): «Mes», «Horas Extras», «Recargos», «Horas no Trabajadas»,
«Días no Trabajados», «Proceso» y «Acciones». No aparecen «Sueldo Bruto», «Sueldo Neto» ni
«Aporte Empleador». El tirador de la barra horizontal ocupa x = 1107–1570 en y = 374–377, al
final de su recorrido (pista desde x = 520); filas con «10-2026», «0.0hrs», «0.0 días» y
«Septiembre 2026».

El **inventario de `main`** rotula esta página como «Ficha: asistencia»
(`docs/Inventario_y_conciliacion_RRHH.md`, fila 19); esa etiqueta queda **desmentida** por el
render y el OCR. El documento de rama replica lo dibujado.

### 2. pp. 20 y 21 — «Offboarding» resaltada y sin submenú

**Veredicto: CONFIRMADO.** En ambas páginas la píldora activa del cromo es **«Offboarding»**:
182 × 51 px en (1311,127), relleno #dfe7f9. «Onboarding» queda en gris en (831,140). No hay
submenú: el breadcrumb «R.R.H.H / Onboarding» está en (41,220) en la p. 20 y en (41,216) en la
p. 21, sin fila intermedia entre el cromo (y 139–177) y el breadcrumb. Ambas páginas comparten
el mismo cromo.

### 3. p. 20 — «Onborading» y «Sin Responsabless»

**Veredicto: CONFIRMADO.** El título se dibuja **«Onborading»** en (39,256), con el subtítulo
«Gestión de Onboarding de Colaboradores» a su derecha. El primer indicador dice **«Sin
Responsabless»**, con doble «s», en (390,526). Se conservan ambos literales.

### 4. p. 21 — Fila de vistas a la derecha de las tabs

**Veredicto: CONFIRMADO.** En la misma franja de las tabs de estado (y ≈ 470) se dibuja, a la
derecha: «Colaboradores» (960,473), con icono de casa y píldora de 130 × 44 px en (950,456)
(#dfe7f9); «Colaboradores sin Ficha» (1113,470); «Tareas» (1353,470); «Analítica» (1476,470).
Las tres últimas van en gris.

### 5. p. 22 — Submenú, badges, «Stock Minimo», buscador y «Asistencias»

**Veredicto: CONFIRMADO.**
- Submenú vertical: **«Detalle»** (976,200) dentro de una píldora gris de 169 × 32 px en
  (942,192), relleno #efeff0; «Devolución y Reposición» (976,230) sin píldora.
- Dos badges **«Dañado»**: el primero en (1359,763) con relleno **#fffdbb** (255,253,187); el
  segundo en (1359,816) con relleno **#f4b9b8** (244,185,184). Son pasteles distintos, no
  ámbar/rojo saturados.
- **«Stock Minimo»** sin tilde en (962,484).
- Buscador literal «Buscar candidatos por nombre, DNI o puesto...» (80,348).
- El rótulo de navegación de esta página es **«Asistencias»** (1197,144), en plural; en la
  p. 24 el mismo rótulo es «Asistencia» (1182,144), en singular.

### 6. p. 23 — Sin submenú y sin formulario de movimiento

**Veredicto: CONFIRMADO.** Bajo el cromo no hay submenú: el breadcrumb de tres niveles
«R.R.H.H / EPP y equipos / Devolución y Reposición» está en (41,220). La página dibuja la
bandeja (filtros en y ≈ 311–348, cuatro indicadores en y ≈ 467, tabla de seis filas) y el
botón **«Registrar Movimiento»** (1406,236), pero **no** dibuja formulario, panel ni modal de
movimiento. La p. 22 sí tiene submenú; la p. 23 no.

### 7. p. 24 — Licencias: singular, KPI, «Dpt.» y azul

**Veredicto: PARCIAL.** Confirmados: el submenú «Licencia y Ausencias» (1158,203, píldora
activa) frente a «Registrar» (1160,234); el título y breadcrumb en singular (39,256 / 41,219);
el KPI **«Aprobradas / Registrada»** (1236,532); **«Dpt. Adminstración»**, sin la «i» tras
«Admin», en (1172,721) y (1172,882); y el azul de fuente **#2249f2** (15 usos `rg`; el botón
renderiza #2c48e9).

No se confirma el literal «Ultimos 30 dias»: el PDF escribe **«Últimos 30 días»** con tildes
en (184,548), y **«últimos 30 días»** en (1370,604). La errata solo existe si se omiten las
tildes.

### 8. p. 25 — Stepper de 4 pasos, erratas y duración

**Veredicto: CONFIRMADO.** El stepper dibuja cuatro pasos: «1 Tipo de Solicitud» (100,300),
«2 Información General» (432,303), «3 Sustento Documental» (781,303) y «4 Confirmación»
(1146,303); los tres primeros en azul y el cuarto en gris (0 px de azul). «Selec. Colaborador»
en (61,365). El aviso dice literalmente **«Tu solicitud abarca 7 días calendaria del 20 al 24
de noviembre del 2026»** (653,896): «calendaria» por «calendarios» y 7 días para un rango de
5 días inclusive (20, 21, 22, 23 y 24).

### 9. p. 26 — «Postulante», motivo, «7 DÍAS», «calendaria» y «RR.HH»

**Veredicto: CONFIRMADO.** Breadcrumb «R.R.H.H / Asistencia / Detalle / **Postulante**»
(41,219) y botón «**Volver a Postulantes**» (1409,242). En «Motivo» se lee **«Secundaria
Completa»** (92,570). La ficha muestra «3 días» (920,333) y «3 DÍAS» (1367,648 y 1364,699),
pero el aviso dibuja **«7 DÍAS»** (625,570) y «La licencia abarca 7 días **calendaria** del 20
al 24 de» (655,983). Los destinatarios dicen **«RR.HH, jefatura directa,»** (853,860), sin
punto final tras «HH».

### 10. p. 28 — Cinco pasos, «Liquidicación», «Nac» y DNI

**Veredicto: PARCIAL.** El stepper tiene cinco pasos: «1 Datos y Causal» (100,300),
«2 Checklist de salida» (429,303), «3 Revisiones por áreas» (778,300), «4 Liquidación»
(1149,303) y «5 Cierre» (1453,309). El resumen lateral escribe **«Liquidicación»** (1434,802)
frente a «Liquidación» del stepper. «Nac: Peruano» aparece sin punto en (142,520) y en las
cuatro filas de la lista.

El DNI **no** cambia entre ficha y lista: la ficha dice «DNI: 7142123456» (136,534) y las
cuatro filas repiten «DNI: 7142123456» (139,707; 139,782; 139,876; 139,971). La diferencia
que sí dibuja la página es el **teléfono**: «999 999 999» en la ficha (360,576) frente a
«999 999 99» en la lista (343,690 y siguientes).

### 11. p. 29 — Dos etapas, pasos 1–3 y barra de 575 px

**Veredicto: CONFIRMADO.** La página cubre dos etapas: «Checklist de Salida» (64,459) y
«Revisión por áreas» (89,707). El stepper pinta «Datos y Causal», «Checklist de salida» y
«Revisiones por áreas» en azul (1 221, 5 433 y 2 322 px azules en sus tramos), y «Liquidación»
y «Cierre» en gris (0 px). La barra de progreso mide x = 384–958 (575 px) y ocupa y = 330–334
(5 px), justo bajo los pasos 2 y 3.

### 12. p. 30 — Barra bajo «Liquidación», sin botón y con importes mezclados

**Veredicto: CONFIRMADO.** «4 Liquidación» está en azul (1130,303) y «Cierre» en gris
(1453,309); la barra de progreso queda solo bajo «Liquidación», en x = 1064–1265, y = 330–334
(**202 × 5 px**). El hero no dibuja «Regresar a Offboarding» (solo breadcrumb, título y
«Acciones rápidas»). En la tabla «Concepto / Detalle», el primer importe **«s/ 2.060.00»**
(1077,532) cae dentro de la columna «Detalle» (cabecera en 1074,501) y usa punto de millar;
los demás usan coma: «s/1,030.00» (1423,574), «- s/ 200.00» (1414,610) y el total
«s/ 2,890.00» (1420,646).

### 13. p. 31 — Cinco pasos azules, «EPPS», «En Proceso» y halo

**Veredicto: CONFIRMADO.** Los cinco tramos del stepper contienen azul. La tarjeta «Procesos
realizados» escribe **«Entrega de EPPS»** (156,899) y **«En Proceso»** con mayúscula inicial en
la segunda palabra (1074,905). El halo de confirmación es un anillo verde claro de
**76 × 77 px** (x 816–891, y 370–446), con círculo verde sólido y check blanco; el documento
dice ~78 px, dentro del margen de medición.

### 14. p. 32 — Pestaña en dos líneas, «Licencias», sin Documental y azul

**Veredicto: PARCIAL.** Confirmado lo textual: la pestaña activa «Organización y Dotación» se
dibuja en **dos líneas** («Organización y» en 1445,138 y «Dotación» en 1439,149, con píldora);
el rótulo de navegación es **«Licencias»** (1144,144), no «Asistencia»; y **no** se dibuja
«Gestión Documental» en la navegación (la lista termina en «Organización y Dotación»).

El azul **no** es #2b48e9: el PDF declara **#2249f2** en esta página (14 usos `rg`), el mismo
token que la p. 24, y PDFKit lo muestra como **#2c48e9**. No hay un azul distinto por página en
el PDF; la diferencia que cita el documento proviene de las referencias JPG, que alternan
#2349f2 y #2b49e9.

**Estado: RESUELTO el 23-nov-2026.** El CSS usa el azul primario `#2249f2` y el acento
`#1c4cf7` en todas las ventanas; el commit de este lote retira los valores derivados de los JPG.

### 15. p. 33 — Pestaña dibujada y tarjeta

**Veredicto: CONFIRMADO.** La pestaña activa es **«Dotación por área y cargo»** (664,328), no
«estructura de puestos»; a su lado se dibujan «Colaboradores asignados» (893,328) y «Historial
de cambios» (1127,325). La tarjeta se titula **«Estructura organizacional»** (535,535). El PDF
declara el azul **#2249f2** (9 usos `rg`); el render lo muestra como #2c48e9.

### 16. p. 34 — «Colaboradores asignados», duplicado y paginador

**Veredicto: CONFIRMADO.** La pestaña activa es **«Colaboradores asignados»** (893,328), y los
indicadores separan «Colaboradores Asignados» (574,395) de «Colaboradores Activos» (837,395).
Se dibujan cinco filas: Luis Torres, Jaime Castillo, Emilia Castellano, Diego Fiestas y **Luis
Torres otra vez** (y ≈ 600, 660, 715, 779, 841/910). El paginador dice «Mostrando 10 de 246»
(993,988) con solo esas cinco filas visibles.

### 17. p. 35 — Tabla, «Valor nuevo» y reasignación vacía

**Veredicto: CONFIRMADO.** Es una **tabla**, no una línea de tiempo: cabecera Fecha,
Candidato, Estado, Detalle del cambio, **Valor Anterior**, **Valor nuevo** (la «n» en
minúscula), Observación. La fila de Emilia Castellano con badge «Reasignación» deja vacías las
celdas de Valor Anterior y Valor nuevo; solo describe «Técnico de Mantenimiento» y «Traslado de
colaborador».

### 18. p. 36 — «Calendaria», «Mié» y leyenda

**Veredicto: CONFIRMADO.** El hero titula **«Calendaria de Asistencia»** (39,253). La rejilla
usa **«Mié»** con tilde (443,607). Bajo «Leyenda» (94,994) hay cuatro categorías:
«Vacaciones» (217,994), «Licencia» (393,991), «Permisos» (552,994) y «Ausencias» (717,994).

**Desviación consciente (23-nov-2026).** Por decisión del revisor, el prototipo rotula
**«Calendario de Asistencia»** en lugar de replicar la errata del dibujo. Es una corrección
sobre la fuente, no una errata de réplica; el resto de literales de la ventana se mantiene.

### 19. p. 37 — Columnas, «última actualización», «Jefe de Área» y «Anexo»

**Veredicto: CONFIRMADO.** La cabecera repite **«Colaborador»** en (122,593) y (332,593).
«Fecha de Creación» va con mayúscula, mientras que **«última actualización»** va en minúsculas.
En la columna Área se lee **«Jefe de Área»** (932,701). La fila de «Contrato de trabajo.docx»
tiene Tipo **«Anexo»** (535,755) y Ubicación lógica **«Constancias»** (1395,755).

### 20. p. 38 — «Selec.», «Nac», «Modifiación» y recorte

**Veredicto: PARCIAL.** Confirmados «Selec. Colaborador» (61,365), «Nac: Peruano» (142,520) y
el aviso cortado «…configuradas en la pantall» (655,897).

La errata existe, pero el literal no es «Modifiacón»: el PDF escribe **«Modifiación o
actualización»** en (999,588), es decir, omite la **primera** «c» (la de «Modifi-c-ación»),
no la segunda.

### 21. p. 39 — «Plazo indeterminado» y sin botón de regreso

**Veredicto: CONFIRMADO.** La etiqueta «Remuneración Mensual» (884,618) tiene como valor
**«Plazo indeterminado»** (884,652), que no corresponde a la etiqueta. El hero de la p. 39
(y 210–280) no dibuja el botón «Volver a Gestión Documental» que sí aparece en la p. 38.

### 22. p. 40 — Vista previa, siete variables, «Confirmar» y DNI

**Veredicto: CONFIRMADO.** «Vista Previa» está activa, en azul y con subrayado (823,484);
«Editar documento» está inactiva, en gris (1294,482). Se dibujan **siete** variables con
casilla marcada: Nombre Completo, Dni, Puesto, Área, Fecha_Inicio, Remuneración y Tipo de
Contrato (y 607–875). El botón final dice **«Confirmar >»** (1445,992), no «Continuar». El DNI
de la variable es **712123456** (387,649) y el del resumen es **7142123456** (103,387): son
cadenas distintas.

### 23. p. 41 — Cromo de Alta, «accesión» y tres azules

**Veredicto: CONFIRMADO.** La confirmación documental arrastra el cromo de Alta: breadcrumb
**«R.R.H.H / Colaborades»** (41,219) y hero **«Alta de Colaborador»** con el subtítulo de alta
(41,256). El mensaje dice «…se ha ejecutado la **accesión** seleccionada» (583,489).

Conviven tres azules en el render: **#2c48e9** (17 266 px; fuente #2249f2), **#294bee**
(1 841 px; fuente #1c4cf7, en los círculos del stepper) y **#1e4bf1** (511 px, en el avatar
azul de la tarjeta de resumen, x 95, y 559); este último está a Δ1 de **#1e4bf2**. La
coexistencia es real: el avatar tiene su propio relleno en la fuente (**#014cfb**), distinto
del azul de navegación y del de los pasos.

### 24. `a-05` — Selector de módulo abierto

**Veredicto: CONFIRMADO.** `a-05` es la misma pantalla de Inicio con el **selector de módulo**
abierto, no el filtro de Área/Subárea. El popover es un cuadrado oscuro **#1c1c1c** de
**205 × 205 px** en (20,146) de 1344 × 822, con cuatro teselas: «Recursos Humanos» **#2b48e9**,
«Operaciones» **#f0963e**, «Contabilidad» **#5d985e** y «Finanzas» **#4911ef**. Hay scrim bajo
la cabecera: el mismo punto (1000,700) pasa de #ffffff en `a-04` a **#8e9799** en `a-05`
(~44 % de negro); la cabecera (700,40) permanece blanca. El filtro «Área/Subárea» sigue
visible en la pantalla de fondo, cubierto en parte por el popover.

### 25. Pie — el «MP» sobre la barra, sin recuadro

**Veredicto: CONFIRMADO: no hay recuadro ni cuadrado.** En las dos fuentes el símbolo «MP» es
un monograma blanco con una estrella de cuatro puntas arriba a la derecha, dibujado
directamente sobre la barra oscura del pie, sin fondo propio, sin borde y sin caja.

- **PDF (p. 20 y p. 37, idénticas):** barra desde y = 1079, relleno **#1c1c1c**. Monograma de
  **68 × 30 px** en x = 74–141, y = 1113–1142, sobre 1920 × 1176. Los píxeles inmediatamente a
  la izquierda, derecha y arriba del logo son #1c1c1c.
- **`a-04` (1344 × 822):** barra desde y = 754, relleno **#1c1c1c**. Monograma de **48 × 21 px**
  en x = 51–98, y = 778–798. Mismo entorno #1c1c1c.
- **Tamaño relativo:** 3,54 % del ancho y 2,55 % del alto en el PDF; 3,57 % y 2,55 % en `a-04`.
  Es la misma proporción, no un logo "más pequeño" en el `.ai`.
- **Único elemento adicional:** una línea divisoria horizontal muy fina bajo el logo
  (y = 1158, #555555 en el PDF; y = 809–810, #363636 en `a-04`), que recorre la barra y no
  forma caja.

La corrección pendiente del revisor, por tanto, no debe añadir un cuadrado: la fuente dibuja
el monograma suelto sobre la barra.

**Estado: RESUELTO el 23-nov-2026.** El pie compartido usa ahora el monograma de 68 × 30 px en
(74, 1113), sin recuadro ni fondo propio; el entorno medido es `#1c1c1c` continuo en `inicio`,
`candidatos` y `documental`. El commit de este lote sustituye el PNG con velo por el glifo
transparente invertido a blanco.
