# Referencia visual documental — UX-02, UX-03 y UX-04 (RH-REQ-01)

> **Estado tras T-RH-27 (24-nov-2026):** solo sobreviven las ventanas `ux02`, `ux03`,
> `ux04`, `inicio` y `acceso`; esta referencia cubre las tres primeras y las doce áreas
> restantes se podaron. T-RH-06 está cerrada; el siguiente paso es T-RH-23.

**Fecha:** 13 de noviembre de 2026.
**Carácter:** experimental. Este archivo es una **referencia visual documental**: describe cómo se ven
UX-02, UX-03 y UX-04 según las fuentes aprobadas. **No es una spec ni un requisito nuevo**: no añade
reglas, acciones, estados, contratos ni criterios de aceptación. La especificación vigente de esta
capacidad es [spec.md](spec.md) (RH-REQ-01 v0.7) y prevalece sobre este documento ante cualquier
conflicto. Los datos de ejemplo del PDF (IDs, nombres, fechas, cifras, empresas, estados y textos)
**no son reglas**; solo ilustran composición y jerarquía.

**Alcance:** UX-02 — Bandeja (PDF p. 6); UX-03 — Crear/editar y confirmación (PDF pp. 7–8);
UX-04 — Detalle (PDF p. 9). Referencia de 1920 × 1080 puntos por página.

## Fuentes

| Fuente | Uso en este documento |
|---|---|
| **MP360PantallasRRHH.pdf** (canónico), pp. 6–9 — cacheado en `.cache/visual-sources/MP360PantallasRRHH.pdf` | Composición, regiones, columnas y orden, alineaciones, jerarquía visual, colores hex, acciones visibles y estados dibujados. Inspeccionada a partir de su contenido vectorial y textual (posición, tamaño, color y tipografía de cada elemento), con render de referencia en `.cache/visual-sources/render/`. |
| **Especificación UX/UI RR. HH. V1.2** (canónica), §3, §7 (UX-02, UX-03, UX-04), §8, §12 — cacheada en `.cache/visual-sources/Especificacion_UXUI_Modulo_RRHH_V1_2.docx` | Contraste página por página: estructura, acciones, estados visibles y patrones transversales que la vista debe cumplir. |
| RH-REQ-01 `spec.md` v0.7, §4–§7 y §10 | Reglas vigentes y criterios de aceptación con los que esta referencia se concilia; donde el PDF diverge, manda la spec. |
| `docs/Inventario_y_conciliacion_RRHH.md` | Diferencias registradas D-01…D-05 citadas en cada punto que aplica. |

## Método y convenciones

- Las posiciones se expresan en puntos desde la esquina superior izquierda de la página
  (x hacia la derecha, y hacia abajo). El origen vertical del PDF se convirtió a «desde arriba».
- Los colores se citan en hex tal como están definidos en el PDF. Coexisten varios azules
  próximos (primario `#2249f2`; paginación activa `#1c4cf7`; punto de notificación `#0049ff`):
  se documentan por separado y no se unifican.
- Tipografías embebidas: **Montserrat** (Bold/Regular) y **Gontserrat** (Medium/SemiBold), familia
  evidentemente embebida con ese nombre en el PDF. Jerarquía observada: título de vista 20 pt
  Montserrat-Bold; título de modal 21,2 pt; cuerpo y celdas 13–15 pt; etiquetas de campo y de filtro
  13 pt Montserrat-Bold; marcas de tiempo 10 pt.
- Toda medida que no puede verificarse desde el PDF se marca **«aprox.»**. Los textos con erratas
  del original («Llena el fomulario», «Selecionar», «Nuevo Coolaborador», «Responsable de
  Aprobración») se transcriben entre comillas solo como evidencia y no se corrigen en silencio.
- Cada vista incluye: wireframe de baja fidelidad, descripción de regiones con medidas y colores,
  y contraste con su contraparte del docx V1.2 con las divergencias PDF↔docx anotadas.

## 1. UX-02 — Bandeja de requerimientos (PDF p. 6)

### Wireframe de baja fidelidad

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│ ▪▪ logo   (fecha/hora 55,7 pt)   [ Buscar en MP 360 ]     ⊙ ⊙ ⊙   ▐ Rodrigo Ayala ▌ │ barra superior
├────────────────────────────────────────────────────────────────────────────────────┤   #1c1c1c
│ ▐Recursos Humanos▌ Inicio ▸Requerimientos▾ Reclutamiento Colaboradores Onboarding   │ nav horizontal
│                             ┌──────────┐        EPP y Equipos · Asistencia ·        │ (ver §4)
│                             │ Nuevo    │        Offboarding · Organización y        │
│                             │ Detalle  │        Dotación · Gestión Documental       │
│                             └──────────┘                                           │
├────────────────────────────────────────────────────────────────────────┬───────────┤
│ R.R.H.H / Requerimientos                        [ ＋ Nuevo Requerimiento ] (azul)   │ ┌─────────┐
│ Bandeja de Requerimientos — Consulta y seguimiento                     │ │Acciones │
│ ┌────────────────────────────────────────────────────────────────────┐ │ │rápidas  │
│ │ Estado▾ Motivo▾ Empresa▾ Área/Subárea▾ Puesto▾ Solicitante▾        │ │ ├─────────┤
│ │                                Fecha / Periodo [Selecciona rango]  │ │ │Nuevo    │
│ │ [Aplicar Filtros](azul) [Limpiar]      Más Filtros(enlace azul)    │ │ │Recluta- │
│ └────────────────────────────────────────────────────────────────────┘ │ │miento…  │
│ R.R.H.H / Requerimientos / Detalle                                     │ ├─────────┤
│ Requerimientos                                                         │ │Mis      │
│ ┌────────────────────────────────────────────────────────────────────┐ │ │accesos  │
│ │ Ordenar por: [⇅ Últimos registrados] [Área▾]   últimos 30 días  ⧉⧉⧉⧉ │ │Boletas… │
│ │┌────┬─────────┬────────┬─────────┬─────────┬──────┬──────┬────────┬──────┬────────┬──────────┬───┐│
│ ││ ID │ Fecha de│ Motivo │ Empresa │ Puesto  │ Vac. │ Vac. │ Estado │Fecha │Solicit.│CANDIDATOS│ ⋮ ││
│ ││    │Generació│        │ (badge) │         │solic.│pend. │ (badge)│objet.│        │(cab. azul│   ││
│ ││    │         │        │         │         │      │      │        │      │        │+enlace)  │   ││
│ ││RQ-…│12/09/26 │Reempla-│ ▐Honda▌ │Operario │  4   │  2   │▐Recluta│15/09 │Francis.│Ver Candi.│ ⋮ ││
│ ││    │         │ zo     │         │de Almac.│      │      │  ndo ▌ │ /2026│        │(subrayado│   ││
│ ││ …4 filas más (RQ-0220, RQ-0219, RQ-0218, RQ-0217)…                     │        │          │   ││
│ │└────┴─────────┴────────┴─────────┴─────────┴──────┴──────┴────────┴──────┴────────┴──────────┴───┘│
│ │                                     Mostrando 5 de 5      ‹ [1] ›  (activa #1c4cf7)│
│ └────────────────────────────────────────────────────────────────────┘ │ └─────────┘
├────────────────────────────────────────────────────────────────────────┴───────────┤
│ ▪▪ logo  «Un nuevo sistema que unifica, planifica y ejecuta. © 2026 Manpower SAC.»  │ pie #1c1c1c
└────────────────────────────────────────────────────────────────────────────────────┘
```

### Regiones, medidas y colores

- **Barra superior** (`#1c1c1c`, alto aprox. 110 pt): logo blanco a la izquierda; texto de
  fecha/hora de 55,7 pt `#1a1a1a` (aprox., sobre la imagen de cabecera); buscador global
  «Buscar en MP 360» centrado; tres botones grises `#c9c9c9` (62,5 × 60,5) y chip de usuario
  oscuro `#1c1c1c` con nombre (15,7 pt bold) y rol «Colaborador» (12,1 pt); punto de
  notificación `#0049ff`.
- **Navegación horizontal** (y 127–183): pastilla azul sólida `#2249f2` (157,5 × 51,6) con
  «Recursos Humanos» en blanco = selector de módulo activo; pestañas «Inicio, Requerimientos,
  Reclutamiento, Colaboradores, Onboarding, EPP y Equipos, Asistencia, Offboarding, Organización
  y Dotación, Gestión Documental» en 13 pt; la activa («Requerimientos») lleva pastilla
  `#dfe7f9` (182,1 × 51,6) e icono azul `#2249f2`; las inactivas, texto `#b0b0b0`. Bajo la
  pestaña activa hay un submenú abierto (`#efefef`, 137,2 × 28,5) con las opciones «Nuevo» y
  «Detalle».
- **Zona de título**: breadcrumb «R.R.H.H / Requerimientos» en azul `#2249f2` 13 pt con segmento
  subrayado del mismo azul (51,3 pt); título «Bandeja de Requerimientos» 20 pt Montserrat-Bold;
  subtítulo «Consulta y seguimiento de requerimientos de Personal» 13 pt. Botón primario
  **«Nuevo Requerimiento»** `#2249f2` (231,1 × 49,9) con icono y texto blancos, alineado a la
  derecha sobre la tarjeta de filtros.
- **Tarjeta de filtros** (blanca, 1573,1 × 141,8, borde `#efefef`, y 291,7): seis selects con
  etiqueta 13 pt Montserrat-Bold — **Estado, Motivo, Empresa, Área / Subárea, Puesto,
  Solicitante** — cada uno de 199,7 × 37,2 (blanco, borde `#efefef`, chevron `#666666`) con
  marcador «Todos» (15 pt); séptimo campo **«Fecha / Periodo»** (222,5 × 37,2) con marcador
  «Selecciona rango»; botones **«Aplicar Filtros»** (`#2249f2`, 130,6 × 26,4) y **«Limpiar»**
  (blanco con borde, texto `#b0b0b0`); enlace **«Más Filtros»** en azul `#2249f2`.
- **Segunda sección de tabla**: repite un breadcrumb «R.R.H.H / Requerimientos / Detalle» y el
  título «Requerimientos» (20 pt) antes de la tarjeta de tabla; es una inconsistencia del mock
  (la página es la bandeja), no una regla.
- **Tarjeta de tabla** (blanca, 1572 × 465,7, radio 8 aprox.):
  - *Barra de herramientas*: «Ordenar por:» 13 pt; pastilla de orden `#dfe7f9` (172,4 × 35,8)
    «Últimos registrados» con icono azul `#2249f2`; select secundario «Área» (88,9 × 35,8);
    control de texto «últimos 30 días» (129,3 × 31,8, `#808080`); cuatro botones de icono
    31,8 × 31,8 (blanco, borde `#efefef`, iconos `#666666`).
  - *Cabecera de tabla*: fila `#f8f7f9` (alto 54,1); separadores verticales `#e3e3e3`;
    **la cabecera de la columna de acción («Candidatos») es un bloque azul `#2249f2`
    (132,2 × 54,5) con texto blanco**.
  - *Columnas y orden*: **ID · Fecha de Generación · Motivo · Empresa · Puesto · Vacantes
    Solicitadas · Pendientes · Estado · Fecha Objetivo · Solicitante · Candidatos ·
    menú por fila**. Separadores en x = 159, 255, 379, 519, 666, 797, 935, 1091, 1238, 1375 y
    1507.
  - *Alineación*: ID, fecha, motivo, empresa y puesto alineados a la izquierda; vacantes,
    fecha objetivo, estado y solicitante centrados en su columna; el enlace de acción centrado
    bajo su cabecera azul.
  - *Contenido por fila* (ejemplo del mock): ID y fechas en 13 pt Montserrat-Bold; empresa como
    badge de color con texto blanco (Honda `#2249f2`, DSV `#262a69`, Integra Retail `#29a8df`,
    aprox. 97,7 × 22,5); estado como badge sólido (ver abajo); **enlace «Ver Candidatos»**
    subrayado `#2249f2` (103,5 pt de subrayado) en cada fila; menú de tres puntos `#333333`
    (4,6 × 4,6) por fila.
  - *Badges de estado dibujados*: «Reclutando» y «Pendiente de Aprobación» en ámbar `#f8ad3b`
    (101,2 × 30,6; el segundo a dos líneas, 37,6 de alto), «Urgente» en rojo `#be272d`,
    «Cubierto» en verde `#489a57`. Texto blanco 13 pt Montserrat-Bold.
  - *Paginación*: «Mostrando 5 de 5» 13 pt a la derecha; botones de página 47,6 × 47,6
    (blancos con borde `#efefef`, chevrons `#666666`); **página activa rellena `#1c4cf7`**
    con número blanco 20 pt.
- **Panel contextual derecho** (blanco, 230,2 de ancho, y 226–1051): «Acciones rápidas»
  (13 pt Montserrat-Bold) con botones blancos 174,3 × 35,9 con borde («Nuevo Reclutamiento»,
  «Contratos por Vencer», «Retirar Colaborador», «Contratos por Vencer» — repetido en el mock);
  «Mis accesos» con filas blancas 206,6 × 33,5 («Boletas de Pago», «Documentos», «Solicitar
  Permiso», «Beneficios»); «Próximos Eventos» («Cumpleaños / Agosto»: Mirella Lazo — 10 agosto,
  Francisco Schen… — 15 agosto) y enlace «Ver más».
- **Pie** (`#1c1c1c`, 1920 × 97,3): logo blanco y eslogan «Un nuevo sistema que unifica,
  planifica y ejecuta. © 2026 Manpower SAC. Derechos Reservados».

### Contraste con el docx V1.2 (§7 UX-02) y divergencias

| Aspecto | docx UX-02 | PDF p. 6 | Divergencia |
|---|---|---|---|
| Filtros | Estado, Motivo, Empresa, Área/Subárea, Puesto, Solicitante, fecha/periodo | Idénticos, más «Más Filtros», «Aplicar Filtros» y «Limpiar» | Coincide; el PDF añade botones no definidos en el docx |
| Columnas | ID, Fecha, Motivo, Empresa, Puesto, Vacantes solicitadas, **Cubiertas**, Pendientes, Estado, Fecha objetivo, **Responsable** | ID, Fecha de Generación, Motivo, Empresa, Puesto, Vacantes Solicitadas, Pendientes, Estado, Fecha Objetivo, **Solicitante**, **Candidatos** (+ menú por fila) | El PDF omite «Cubiertas», usa «Solicitante» en vez de «Responsable» y añade la columna de acción «Candidatos». La spec §7.1 adopta las columnas del docx (con Cubiertas y Responsable) conservando el patrón visual |
| Estados visibles | Borrador, Pendiente de aprobación, Observado, Aprobado, En reclutamiento, Cubierto, Cancelado | «Reclutando», «Pendiente de Aprobación», «Urgente», «Cubierto» | **D-03**: estados no canónicos; «Urgente» es nivel de alerta, no estado. La spec §6 exige los 7 estados canónicos |
| Acciones | Nuevo requerimiento, Abrir detalle, Editar, Cancelar | «Nuevo»/«Detalle» en el submenú del nav, «Nuevo Requerimiento» (botón), «Ver Candidatos» por fila | Editar y Cancelar no están dibujados (el menú de fila está cerrado); «Ver Candidatos» no es la acción «Abrir detalle» de la spec |
| Alerta de plazo | «Badge de estado y señal de alerta por plazo» | Solo badge de estado; no hay señal de alerta dibujada | La alerta (spec §5.2, criterio 19) requerirá texto + icono además de color |
| Layout | §3: barra lateral izquierda persistente | Barra superior + navegación horizontal + panel derecho | **D-01**: el PDF gobierna visualmente por decisión del usuario |

## 2. UX-03 — Crear/editar requerimiento (PDF p. 7) y confirmación (PDF p. 8)

Ambas páginas dibujan la bandeja de la p. 6 de fondo, cubierta por un **velo translúcido**
(relleno `#182f33` con baja opacidad; 1928 × 887, aprox. toda el área de contenido) sobre el que se abre un **modal** centrado
(aprox.): tarjeta de 651,8 × 682,8 con fondo `#efefef` de radio 8 aprox. y cara blanca (650,4 × 681,4).

### 2.1 Formulario «Nuevo requerimiento de personal» (p. 7)

```
┌───────────────── velo #182f33 (bandeja de la p. 6 atenuada al fondo) ─────────────────┐
│                                                                                      │
│                    ┌────────────────────────────────────────────┐                    │
│                    │ (icono)  Nuevo requerimiento de personal ✕ │                    │
│                    │           Llena el fomulario y solicita    │                    │
│                    │           su revisión                      │                    │
│                    │ ① Datos del requerimiento ── ② Revisión y  │                    │
│                    │ (azul, activo)      (gris)     envío        │                    │
│                    │ Motivo*                │ Empresa*           │                    │
│                    │ [Seleccionar motivo ▾] │ [Seleccionar       │                    │
│                    │                        │  empresa ▾]       │                    │
│                    │ Departamento*          │ Área / Subárea*    │                    │
│                    │ [Seleccionar           │ [Selecionar ▾]     │                    │
│                    │  departamento ▾]       │                    │                    │
│                    │ Puesto solicitado*     │ Cant. de vacantes* │                    │
│                    │ [Seleccionar puesto ▾] │ [ 1 ]              │                    │
│                    │ Colaborador a          │ Remuneración       │                    │
│                    │  reemplazar            │  mensual (S/)*     │                    │
│                    │ [Seleccionar           │ [0.00]             │                    │
│                    │  colaborador ▾]        │                    │                    │
│                    │ Fecha objetivo*        │ Responsable de     │                    │
│                    │ [📅 dd/mm/aaaa]        │  Aprobación*       │                    │
│                    │                        │ [Selecciona a un   │                    │
│                    │                        │  responsable ▾]    │                    │
│                    │ Comentario                                 │                    │
│                    │ [Añade información sobre el                 │                    │
│                    │  requerimiento...]                          │                    │
│                    │         [Guardar borrador] [Enviar          │                    │
│                    │          (blanco, borde)    requerimiento]  │                    │
│                    │                            (azul #2249f2)   │                    │
│                    └────────────────────────────────────────────┘                    │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

**Cabecera del modal:** icono dentro de círculo `#e4e9fd` (47,9 × 47,9) con pictograma azul
`#2249f2`; título «Nuevo requerimiento de personal» 21,2 pt; subtítulo «Llena el fomulario y
solicita su revisión» 13 pt (errata del original); cierre ✕ gris `#c9c9c9` (18,3 × 18,3) en la
esquina superior derecha.

**Asistente de dos pasos** (y 344–360): paso **① «Datos del requerimiento»** con círculo azul
`#2249f2` (20,8 × 20,8) y número blanco — paso activo —, conector gris `#c9c9c9` (87,8 × 2,7), y
paso **② «Revisión y envío»** con círculo gris `#c9c9c9` y número `#1c1c1c`. La pantalla del paso
2 **no está dibujada** en el PDF.

**Campos** — grid de dos columnas (controles de 285,6 × 37,2, blanco con borde `#efefef`;
etiqueta 13 pt Montserrat-Bold; asterisco rojo `#ff0000` en obligatorios; marcadores 15 pt):

| Fila | Columna izquierda | Columna derecha |
|---|---|---|
| 1 | **Motivo\*** — select «Seleccionar motivo» | **Empresa\*** — select «Seleccionar empresa» |
| 2 | **Departamento\*** — select «Seleccionar departamento» | **Área / Subárea\*** — select «Selecionar» (errata) |
| 3 | **Puesto solicitado\*** — select «Seleccionar puesto» | **Cant. de vacantes\*** — numérico, valor «1» `#666666` |
| 4 | Colaborador a reemplazar — select «Seleccionar colaborador» (sin asterisco) | **Remuneración mensual (S/)\*** — valor «0.00» `#666666` |
| 5 | **Fecha objetivo\*** — fecha con icono de calendario `#000000`, marcador «dd/mm/aaaa» | **Responsable de Aprobación\*** — select «Selecciona a un responsable» |
| 6 | Comentario — textarea a ancho completo (591,8 × 71,8), marcador «Añade información sobre el requerimiento...» (sin asterisco) | — |

**Pie del modal:** a la derecha, **«Guardar borrador»** (blanco con borde `#efefef`, 171 × 49,6,
icono gris `#b0b0b0`, texto Montserrat-Bold) y **«Enviar requerimiento»** (`#2249f2`, 173,1 ×
49,9, icono y texto blancos).

### 2.2 Confirmación de envío (p. 8)

```
┌───────────────── velo #182f33 (bandeja de la p. 6 atenuada al fondo) ─────────────────┐
│                          ┌────────────────────────────────────┐                      │
│                          │      ( ✓ verde sobre círculo       │                      │
│                          │        #e6f8ea, con confeti)       │                      │
│                          │  ¡Requerimiento enviado para       │                      │
│                          │  aprobar!                          │                      │
│                          │  La solicitud se registró          │                      │
│                          │  correctamente y fue enviado al    │                      │
│                          │  responsable. Te detallamos el     │                      │
│                          │  resumen del requerimiento:        │                      │
│                          │ ┌────────────────────────────────┐ │                      │
│                          │ │ Código de requerimiento RQ- 0222│ │                      │
│                          │ │ ──────────────────────────────  │ │                      │
│                          │ │ Puesto Solicitado  Operario de  │ │                      │
│                          │ │ Área / Subárea     Despacho     │ │                      │
│                          │ │ Motivo             Nuevo        │ │                      │
│                          │ │                    Coolaborador │ │  (panel             │
│                          │ │ Cantidad de Vacantes   1        │ │   #f3f4f9)          │
│                          │ │ Empresa            Honda        │ │                      │
│                          │ │ Responsable de     Ricardo      │ │                      │
│                          │ │  Aprobración       Cisterna     │ │                      │
│                          │ │ Remuneración mensual (S/) 1300.00│ │                      │
│                          │ │ Estado Actual      Pendiente de │ │                      │
│                          │ │                    Aprobación   │ │                      │
│                          │ └────────────────────────────────┘ │                      │
│                          │ (i) Recibirás una actualización    │ │                      │
│                          │     cuando el responsable revise…  │ │                      │
│                          │ [Enviar por Correo] [Volver a la   │ │                      │
│                          │                     Bandeja](azul) │ │                      │
│                          └────────────────────────────────────┘                      │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

- **Icono de éxito**: círculo `#e6f8ea` (77,3 × 77,3) con pictograma verde `#53ab5f`
  (57,3 × 57,3) y acentos de confeti en `#f8ad3b`, `#0071b9`, `#22b273` y `#ff0000`.
- **Título** «¡Requerimiento enviado para aprobar!» 21,2 pt, centrado; cuerpo «La solicitud se
  registró correctamente y fue enviado  al responsable.» y «Te detallamos el resumen del
  requerimiento:» (doble espacio del original).
- **Panel de resumen** `#f3f4f9` (591,6 × 325,5) con pares etiqueta/valor en dos columnas
  (etiqueta 13 pt, algunas `#808080`; valor 15 pt Gontserrat-SemiBold `#1c1c1c`, salvo
  «Ricardo Cisterna» en «Responsable de Aprobación», que se dibuja en azul `#2249f2` como
  enlace): Código de requerimiento («RQ- 0222», con divisoria `#808080`), Puesto Solicitado,
  Área / Subárea, Motivo, Cantidad de Vacantes, Empresa, Responsable de Aprobración (errata),
  Remuneración mensual (S/) y **Estado Actual**, que se muestra como badge ámbar claro con
  icono de reloj de arena («Pendiente de Aprobación»).
- **Nota informativa** en un panel `#f3f4f9` (591,6 × 51,5): «Recibirás una actualización cuando
  el responsable revise la solicitud,» con icono informativo azul `#2249f2` (círculo 25,2 × 25,2).
- **Pie**: **«Enviar por Correo»** (blanco, borde `#2249f2`, icono azul, 171 × 49,6) a la
  izquierda y **«Volver a la Bandeja»** (`#2249f2`, 173,1 × 49,9) a la derecha.

### Contraste con el docx V1.2 (§7 UX-03) y divergencias

| Aspecto | docx UX-03 | PDF pp. 7–8 | Divergencia |
|---|---|---|---|
| Campos | Motivo, Empresa, Colaborador a reemplazar (si Reemplazo), Departamento→Área/Subárea→Puesto, Cantidad, Remuneración, **Ubicación** (Dep.→Prov.→Distrito), Usuario de próxima tarea, Comentario/justificación, Fecha objetivo | Mismos menos **Ubicación**; «Responsable de Aprobación» equivale al usuario de próxima tarea; «Colaborador a reemplazar» visible aunque el Motivo esté sin elegir | **D-02**: el PDF omite ubicación. La spec §4 la exige y la vista debe añadirla respetando el patrón visual |
| Obligatoriedad | Comentario/justificación (sin marca explícita de obligatorio en el docx); colaborador obligatorio si Reemplazo | «Comentario» sin asterisco; «Colaborador a reemplazar» sin asterisco | **D-02**: la spec §4 hace obligatorio el comentario y §7.2 muestra el colaborador solo cuando Motivo = Reemplazo |
| Fecha objetivo | Automática para operativo; definida por RR. HH. (15–30 días) para administrativo | Campo de fecha editable obligatorio «dd/mm/aaaa» | La spec §5.1/§7.2 (criterio 24) la sustituye por **duración** antes de aprobar; sin fecha hipotética |
| Remuneración | Obligatoria y mayor que cero | Valor de ejemplo «0.00» | Dato de ejemplo, no regla; la spec §4 admite `0.00` solo para Practicante (criterio 3) |
| Acciones | Guardar borrador, Enviar a aprobación, **Cancelar edición** | «Guardar borrador» + «Enviar requerimiento» (rótulo propio); sin «Cancelar edición» dibujada (solo el ✕ del modal) | Rótulos divergentes; la spec §7.2 exige «Cancelar edición» con confirmación de descarte (criterio 20) |
| Revisión previa | (no descrita como pantalla separada) | El asistente anuncia el paso 2 «Revisión y envío» pero no lo dibuja | La spec §7.2 (criterio 2) exige la revisión como única pantalla de envío |
| Confirmación | No descrita en el docx | Modal de éxito con resumen y «Enviar por Correo» | La spec §7.2 retoma la confirmación (ID, resumen, responsable y estado) y **excluye «Enviar por correo»** (criterio 18) |
| Modal | §3: «estándar único de modal/pop-up para todo el ERP» | Modal centrado con velo, cabecera con icono, cierre ✕ y pie de botones a la derecha | Patrón visual utilizable como base del estándar |

## 3. UX-04 — Detalle de requerimiento (PDF p. 9)

Página completa (sin modal): mismo contenedor que la p. 6 (barra superior, navegación con
«Requerimientos» activo, panel contextual derecho y pie).

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│ (contenedor transversal: barra superior + nav horizontal + panel derecho, como p. 6)│
├────────────────────────────────────────────────────────────────────────────────────┤
│ R.R.H.H / Requerimiento / Detalle                     [← Volver a Requerimientos]   │
│ Requerimiento RQ - 0221  ▐ Pendiente de Aprobación ▌(ámbar #f8ad3b)   (botón azul)   │
│ ┌────────────────────────────────────────────────────────────────────────────┐     │
│ │ Resumen                                    [Ver Detalle Completo](bordeado)│     │
│ │ Detalle de requerimiento seleccionado                                      │     │
│ │ ┌──────────┬──────────┬──────────┬──────────┬──────────┬──────────────────┐ │     │
│ │ │ Puesto   │ Empresa  │ Motivo   │ Vacantes │ Cubiertas│ Pendientes       │ │     │
│ │ │ solicitado│ ▐Honda▌ │Reemplazo │ solicit.:│    2     │    2             │ │     │
│ │ │ Operario │ (badge   │          │    4     │          │                  │ │     │
│ │ │ de Almacén│  azul)  │          │          │          │                  │ │     │
│ │ ├──────────┼──────────┼──────────┼──────────┼──────────┼──────────────────┤ │     │
│ │ │Departamen│ Área /   │Ubicación │Solicitante│Fecha     │Remuneración     │ │     │
│ │ │to        │ Subárea  │          │          │Objetivo  │mensual          │ │     │
│ │ │Operaciones│ Almacén │Callao /  │Francisco │▐15/09/26▌│s/ 1,800         │ │     │
│ │ │          │          │Callao    │Schenone  │(badge    │                 │ │     │
│ │ │          │          │          │          │ ámbar)   │                 │ │     │
│ │ └──────────┴──────────┴──────────┴──────────┴──────────┴──────────────────┘ │     │
│ └────────────────────────────────────────────────────────────────────────────┘     │
│ ┌────────────────────────────────────────────────────────────────────────────┐     │
│ │ Postulante (6)                             [＋ Asociar Candidato](azul)   │     │
│ │ Lista de candidatos asociados al requerimiento                            │     │
│ │ [🔍 Buscar candidatos por nombre, DNI o puesto...]                        │     │
│ │ [Estado▾] [Puesto▾] [Tipo de personal▾] [Responsable▾]                    │     │
│ │┌─┬───────────────┬──────────┬─────────┬────────┬────────┬─────────┬───────┬──┐│     │
│ │ │☑│ Candidato     │Documento │ Puesto  │Aptitud │ Estado │  Última │Requer.│DETALLE│⋮││
│ │ │ │ (avatar+nombre│de identi-│         │para el │(badge  │actualiza│       │(cab. │││
│ │ │ │  +nacionalidad)│dad      │         │require.│pastel) │  ción   │       │azul) │││
│ │ │├─┼───────────────┼──────────┼─────────┼────────┼────────┼─────────┼───────┼──┤│     │
│ │ │☑│ ◯ Luis Torres  │711234567 │Operario │Operativo│Preselec.│12/09/26 │RQ-0221│Ver  │⋮││     │
│ │ │ │  Nac: Peruano │          │de Almacén│(badge)│(badge)  │10:30    │       │Detalle│││
│ │ │☑│ ◯ Jaime Castillo│711234567│Operario │Operativo│Seleccio.│…        │RQ-0221│Ver  │⋮││     │
│ │ │ │  Nac: Extranjero│         │de Almacén│       │(badge)  │         │       │Detalle│││
│ │ │☑│ ◯ Emilia…/ ◯ Diego…   ( … 2 filas más: Finalista, Contratado … )      │      ││     │
│ │ │└─┴───────────────┴──────────┴─────────┴────────┴────────┴─────────┴───────┴──┘││     │
│ │ Mostrando 4 de 6                                      ‹ [1] › (activa #1c4cf7) │     │
│ └────────────────────────────────────────────────────────────────────────────┘     │
└────────────────────────────────────────────────────────────────────────────────────┘
```

### Regiones, medidas y colores

- **Cabecera de la vista** (y 225–330): breadcrumb «R.R.H.H / Requerimiento / Detalle» azul
  `#2249f2` 13 pt con segmento subrayado; título **«Requerimiento RQ - 0221»** 20 pt
  Montserrat-Bold con el **badge de estado junto al título** («Pendiente de Aprobación»,
  `#f8ad3b`, 206,3 × 30,6, texto blanco 13 pt Montserrat-Bold, icono interior `#f4901e`);
  botón primario **«Volver a Requerimientos»** `#2249f2` (255,1 × 49,9, icono flecha blanco)
  arriba a la derecha.
- **Tarjeta «Resumen»** (blanca, 1573,1 × 204,4, borde `#efefef`): título «Resumen» 20 pt
  Montserrat-Bold + subtítulo «Detalle de requerimiento seleccionado» 13 pt; botón secundario
  **«Ver Detalle Completo»** (blanco, borde `#2249f2`, 202,6 × 35,8, icono y texto azules) en la
  esquina superior derecha de la tarjeta. Panel interior blanco (1551,6 × 128,2) con **grid de
  6 columnas × 2 filas** (separadores verticales `#e3e3e3` en x = 283, 542, 815, 1088 y 1361):
  - Fila 1: Puesto solicitado («Operario de Almacén») · Empresa como badge azul `#2249f2`
    (97,7 × 22,5, texto blanco) · Motivo · Vacantes solicitadas · Cubiertas · Pendientes.
  - Fila 2: Departamento · Área / Subárea · Ubicación · Solicitante · **Fecha Objetivo con
    badge ámbar `#f8ad3b`** (90,7 × 30,6, «15/09/2026») · Remuneración mensual («s/ 1,800»).
  - Etiquetas 13 pt (algunas `#808080`), valores 15 pt Gontserrat-SemiBold `#1c1c1c`; **sin
    controles de edición** en ninguna celda.
- **Tarjeta «Postulante (6)»** (blanca, 1572 × 536,2, radio 8 aprox.): título 20 pt Montserrat-Bold con
  contador entre paréntesis + subtítulo «Lista de candidatos asociados al requerimiento»;
  botón primario **«Asociar Candidato»** `#2249f2` (202,6 × 38,1, icono blanco) arriba a la
  derecha.
  - *Filtros*: buscador ancho (612 × 36,9) «Buscar candidatos por nombre, DNI o puesto...» con
    lupa `#969696`; cuatro selects de 199,7 × 37,2 con marcador «Todos»: **Estado, Puesto,
    Tipo de personal, Responsable**.
  - *Tabla*: cabecera `#f8f7f9` (54,1) con separadores `#e3e3e3` y **columna de acción
    («Detalle») con cabecera azul `#2249f2`** (132,2 × 54,5); casilla de selección por fila
    (21,1 × 21,1, borde `#efefef`); columnas: Candidato (avatar gris `#808080` 34 × 34, nombre
    15 pt Montserrat-Bold, subtexto «Nac: …» `#808080` 13 pt) · Documento de Identidad ·
    Puesto · Aptitud para el requerimiento («Operativo», badge `#dfe7f9` 143,8 × 31,4) ·
    Estado · Última Actualización · Requerimiento · **«Ver Detalle»** (enlace subrayado
    `#2249f2`, 78,1 pt de subrayado, centrado bajo su cabecera azul) · menú de tres puntos
    `#333333`.
  - *Badges de estado de candidato* (colores ámbar y pastel, 128,6 × 30,6, texto 13 pt Montserrat-Bold):
    «Preseleccionado» `#dfe7f9`, «Seleccionado» `#f8ad3b`, «Finalista» `#b0ffb9`,
    «Contratado» `#ffbbc3`.
  - *Paginación*: «Mostrando 4 de 6» a la **izquierda**; botones de página 47,6 × 47,6 a la
    derecha con la activa rellena `#1c4cf7` (número blanco 20 pt).

### Contraste con el docx V1.2 (§7 UX-04) y divergencias

| Aspecto | docx UX-04 | PDF p. 9 | Divergencia |
|---|---|---|---|
| Estructura | Resumen en lectura, historial, cobertura parcial, remuneración en el resumen, panel de plazo y alerta, área de observación/comentario | Resumen en lectura con cobertura y remuneración; **sin historial, sin panel de plazo/alerta y sin área de observación** | La spec §7.3 exige historial, plazo/alerta y observación según capacidades; el PDF no los dibuja |
| Acciones | Aprobar, Observar, Cancelar, Volver a bandeja | Solo «Volver a Requerimientos» (rótulo propio), «Ver Detalle Completo» y «Asociar Candidato» | **Aprobar/Observar/Cancelar no están dibujados**; su presentación sigue estado y capacidades (spec §7.3). «Volver a bandeja» existe con otro rótulo y debe restaurar contexto (criterio 22) |
| Postulantes | No forman parte de UX-04 en el docx (la tabla de candidatos se define en UX-05) | Tarjeta «Postulante (6)» con filtros, tabla y «Asociar Candidato» | La zona de candidatos solo consume lo que permita el contrato de Selección (spec §7.3); los vínculos y su auditoría pertenecen a Selección. **D-05** (ver §6) |
| Cobertura | Cobertura parcial cuando aplica | 4 solicitadas / 2 cubiertas / 2 pendientes con estado «Pendiente de Aprobación» | **D-04**: escenario de ejemplo inválido (RN-REQ-02 exige aprobación antes de reclutar); las cifras no se usan como caso de prueba |
| Estados de candidato | UX-05 define entre otros Preseleccionado y Seleccionado | Preseleccionado, Seleccionado, Finalista, Contratado | «Finalista» y «Contratado» no se convierten en regla de esta capacidad; pertenecen al proceso de Selección |
| Historial | «Mostrar usuario, fecha/hora, acción, estado anterior/nuevo y observación» (§8) | No dibujado | El historial debe seguir el patrón transversal del docx §8 y la spec §7.3 |

## 4. Paleta y tipografía transversal (pp. 6–9)

| Color | Uso observado en las páginas |
|---|---|
| `#1c1c1c` | Barra superior, pie, chip de usuario; número del paso inactivo del asistente |
| `#2249f2` | Azul primario: botones («Nuevo Requerimiento», «Enviar requerimiento», «Asociar Candidato», «Volver a Requerimientos», «Aplicar Filtros»), enlaces y subrayados, pastilla del módulo, iconos activos, badge Honda, cabecera de columna de acción, círculo del paso activo, borde de «Enviar por Correo» |
| `#1c4cf7` | Botón de página activa en la paginación |
| `#0049ff` | Punto de notificación de la barra superior |
| `#dfe7f9` | Pastilla de pestaña activa, pastilla de orden, badge Preseleccionado, badge «Operativo» |
| `#f8ad3b` | Badges ámbar: «Pendiente de Aprobación», «Reclutando», fecha objetivo del resumen, «Seleccionado» (candidato) |
| `#f4901e` | Icono interior de los badges ámbar |
| `#be272d` | Badge rojo «Urgente» |
| `#489a57` | Badge verde «Cubierto» |
| `#b0ffb9` / `#ffbbc3` | Badges pastel «Finalista» / «Contratado» |
| `#e6f8ea` / `#53ab5f` | Fondo e icono del éxito de la confirmación |
| `#efefef` | Bordes de controles y tarjetas, botón secundario, submenú del nav, casillas |
| `#e3e3e3` | Separadores de columnas y filas de tabla |
| `#f8f7f9` | Fila de cabecera de tabla |
| `#f3f4f9` | Panel de resumen y nota de la confirmación |
| `#182f33` | Relleno del velo translúcido tras el modal (pp. 7–8) |
| `#c9c9c9` | Círculo del paso 2 del asistente, cierre ✕ del modal, conectores |
| `#b0b0b0` | Texto de pestañas inactivas, iconos atenuados, «Limpiar» |
| `#666666` | Iconos secundarios (chevrons, herramientas), valores precargados («1», «0.00») |
| `#808080` | Texto terciario («últimos 30 días», etiquetas y subtextos), divisoria del panel de resumen |
| `#333333` | Texto de cabecera «ID», menú de tres puntos por fila |
| `#ff0000` | Asterisco de campo obligatorio |
| `#262a69` / `#29a8df` | Badges de empresa de ejemplo (DSV / Integra Retail) |
| `#e4e9fd` | Círculo del icono de cabecera del modal |
| `#1a1a1a` | Texto de fecha/hora de la cabecera (aprox.) |

Tipografía: **Montserrat** (Bold para títulos de vista/tarjeta, cabeceras de tabla y celdas de
datos; Regular para pie y marcas de tiempo) y **Gontserrat** (Medium para cuerpo, pestañas,
títulos de modal/confirmación, subtítulos, marcadores y varios botones; SemiBold para valores
del resumen). Tamaños: 20 pt títulos de vista/tarjeta; 21,2 pt títulos de modal y confirmación;
15–15,7 pt marcadores y nombre de usuario; 13 pt cuerpo, etiquetas, celdas y botones;
12–12,1 pt asteriscos y rol; 10 pt marcas de tiempo; 55,7 pt fecha/hora de cabecera (aprox.).

## 5. Criterios visuales objetivos (CV-01…CV-12)

Cada criterio es verificable sin subjetividad contra la implementación renderizada a 1920 × 1080.
Donde la spec corrige al PDF, el criterio lo dice expresamente: **manda la spec**; el PDF aporta
la composición.

| ID | Criterio visual objetivo | Trazabilidad |
|---|---|---|
| CV-01 | El contenedor de las tres vistas presenta barra superior `#1c1c1c` con logo, búsqueda global y chip de usuario; navegación horizontal con las diez pestañas del módulo, la activa («Requerimientos») con pastilla `#dfe7f9` e icono/texto azul `#2249f2` y las inactivas en `#b0b0b0`; panel contextual derecho blanco; pie `#1c1c1c`. | PDF pp. 6–9; docx §3; inventario D-01; spec RH-REQ-01 §1 (fuente 3) y criterio 18 |
| CV-02 | La bandeja muestra la barra de filtros con los seis selects Estado, Motivo, Empresa, Área/Subárea, Puesto y Solicitante (etiqueta 13 pt Montserrat-Bold, control 199,7 × 37,2 con borde `#efefef`), el campo Fecha/Periodo con marcador «Selecciona rango», los botones «Aplicar Filtros» (`#2249f2`) y «Limpiar» (neutro) y el enlace azul «Más Filtros». | PDF p. 6; docx §7 UX-02 (barra de filtros); spec §7.1 y criterios 13–14 |
| CV-03 | La tabla de la bandeja mantiene el orden de columnas del PDF — ID, Fecha de Generación, Motivo, Empresa, Puesto, vacantes, Estado, Fecha Objetivo, responsable/acción, menú — con las columnas canónicas de la spec (incluye Cubiertas; Responsable en la posición de Solicitante), cabecera `#f8f7f9`, separadores `#e3e3e3` y celdas de texto (ID, fecha, motivo, empresa, puesto) alineadas a la izquierda y números, fechas, estado y acción centrados. | PDF p. 6; docx §7 UX-02 (tabla); spec §7.1 |
| CV-04 | El estado de cada fila de la bandeja se representa como badge sólido con texto blanco 13 pt; el PDF solo dibuja tres colores (ámbar `#f8ad3b`, rojo `#be272d`, verde `#489a57`) y la spec no define el mapeo estado→color para los siete estados canónicos, por lo que ese mapeo queda **pendiente de decisión**. «Urgente» nunca aparece como estado: solo como alerta con texto e icono además de color. | PDF p. 6; docx §7 UX-02 y §8 (badges, alertas); spec §7.1 y criterio 19; inventario D-03 |
| CV-05 | La columna de acción por fila («Candidatos» en la bandeja; «Detalle» en postulantes) tiene su cabecera rellena en azul `#2249f2` con texto blanco, y la acción por fila es un enlace subrayado `#2249f2` centrado bajo esa cabecera. | PDF pp. 6 y 9; docx §8 (tablas operativas, acceso al detalle desde la fila); spec §7.1 y criterio 23 |
| CV-06 | La bandeja ofrece el botón primario «Nuevo Requerimiento» `#2249f2` con icono y texto blancos arriba a la derecha de los filtros, menú de tres puntos `#333333` por fila, y pie de tabla con «Mostrando X de Y» más paginación cuyos botones son 47,6 × 47,6 y la página activa se rellena en `#1c4cf7` con número blanco. | PDF p. 6; docx §7 UX-02 (acciones); spec §7.1 (Nuevo/Detalle/Editar/Cancelar por capacidades) y criterio 13 |
| CV-07 | El formulario UX-03 es un modal centrado sobre velo translúcido (relleno `#182f33`): tarjeta blanca aprox. 652 × 683 con radio 8 aprox., cabecera con icono en círculo `#e4e9fd` + pictograma azul, título 21,2 pt, subtítulo 13 pt y cierre ✕; pie con «Guardar borrador» (blanco con borde) a la izquierda del primario de envío `#2249f2`, ambos alineados a la derecha del modal. | PDF p. 7; docx §3 (estándar único de modal) y §7 UX-03 (acciones); spec §7.2 y criterios 17, 20 |
| CV-08 | Los campos del formulario se disponen en grid de dos columnas con controles de 285,6 × 37,2 y borde `#efefef`, etiqueta 13 pt Montserrat-Bold y asterisco rojo `#ff0000` solo en obligatorios; la spec exige añadir Ubicación (Dep.→Prov.→Distrito), marcar Comentario como obligatorio, mostrar «Colaborador a reemplazar» solo con Motivo = Reemplazo y presentar el plazo como duración en lugar del campo de fecha del PDF. | PDF p. 7; docx §7 UX-03 (estructura); spec §4, §7.2 y criterios 3, 24; inventario D-02 |
| CV-09 | El asistente del modal muestra dos pasos: ① «Datos del requerimiento» con círculo `#2249f2` y número blanco (activo) y ② «Revisión y envío» con círculo `#c9c9c9` y número `#1c1c1c`, unidos por conector gris; la spec §7.2 exige la pantalla de revisión (criterio 2) aunque el PDF no la dibuje, y es el único punto de envío. | PDF p. 7; docx §7 UX-03; spec §7.2 y criterios 2, 18 |
| CV-10 | La confirmación de envío es un modal de éxito con icono `#53ab5f` sobre círculo `#e6f8ea`, título «¡Requerimiento enviado para aprobar!» 21,2 pt, panel `#f3f4f9` con pares etiqueta/valor en dos columnas (código, puesto, área, motivo, cantidad, empresa, responsable, remuneración y estado), nota informativa con icono azul y botones «Enviar por Correo» (bordeado) y «Volver a la Bandeja» (`#2249f2`); en el corte **no se ofrece «Enviar por Correo»**. | PDF p. 8; docx §7 UX-03 (acciones); spec §7.2 (confirmación sin correo) y criterio 18 |
| CV-11 | El detalle presenta breadcrumb azul con segmento subrayado, título «Requerimiento <ID>» 20 pt Montserrat-Bold con el badge de estado inmediatamente a su derecha, botón «Volver a Requerimientos» `#2249f2` arriba a la derecha, tarjeta «Resumen» con botón bordeado «Ver Detalle Completo» y grid de 6 columnas × 2 filas en solo lectura (empresa como badge `#2249f2`; fecha objetivo con badge `#f8ad3b`), sin controles de edición. | PDF p. 9; docx §7 UX-04 (resumen en lectura, remuneración en el resumen); spec §7.3 y criterio 22; inventario D-04 |
| CV-12 | La zona de postulantes del detalle es una tarjeta «Postulante (N)» con botón `#2249f2` «Asociar Candidato», buscador y cuatro selects (Estado, Puesto, Tipo de personal, Responsable), y tabla con selección, avatar + nombre + nacionalidad, documento, puesto, tipo (`#dfe7f9`), estado en badges pastel (`#dfe7f9`, `#f8ad3b`, `#b0ffb9`, `#ffbbc3`), última actualización, requerimiento, enlace «Ver Detalle» bajo cabecera azul, menú por fila y «Mostrando X de Y» a la izquierda con paginación a la derecha; Aprobar/Observar/Cancelar y el historial no están dibujados en el PDF y se rigen por estado y capacidades. | PDF p. 9; docx §7 UX-04 y §7 UX-05 (tabla de candidatos); spec §7.3 y criterios 11 y 26; inventario D-04, D-05 |

## 6. Nota sobre D-05 — «Asociar candidato»

El botón **«Asociar Candidato» es visible en el PDF p. 9**: botón primario `#2249f2`
(202,6 × 38,1) con icono blanco, en la esquina superior derecha de la tarjeta «Postulante (6)»,
junto al contador de postulantes y sobre los filtros de la tabla de candidatos.

Esta referencia **documenta la evidencia visual, no resuelve su significado funcional**. Según el
inventario (D-05), el tratamiento propuesto es «especificar el significado de esa acción antes de
implementarla; no crear una vinculación formal anticipada», y su estado sigue siendo
**«pendiente de detalle funcional»**. La regla vigente de la spec (§7.3, criterios 11 y 26) es
que «Asociar candidato» no crea preasignación, proceso ni vínculo en Requerimientos: para RR. HH.
con capacidad y solo cuando el requerimiento está **En reclutamiento**, navega al proceso de
Selección ya creado; RN-SEL-07 regula el vínculo formal y su auditoría pertenece a Selección.

---

*Documento experimental de referencia visual. No modifica `spec.md`, `plan.md`, `tasks.md` ni
los criterios de aceptación; en caso de conflicto prevalecen la constitución, la spec
RH-REQ-01 v0.7 y las decisiones registradas en el inventario.*
