# Prototipo visual de ventanas — rama `codex/rh-vis`

**Última actualización:** 20 de noviembre de 2026.
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
| `dotacion` | Organización y dotación · resumen | PDF p. 32 (UX-18) | 1920 × 1176 | `?ux=dotacion` |
| `dotacion-estructura` | Dotación por cliente · estructura de puestos | PDF p. 33 (UX-19) | 1920 × 1176 | `?ux=dotacion-estructura` |
| `dotacion-asignados` | Dotación por cliente · colaboradores asignados | PDF p. 34 (UX-19) | 1920 × 1176 | `?ux=dotacion-asignados` |
| `dotacion-historial` | Dotación por cliente · historial de cambios | PDF p. 35 (UX-19) | 1920 × 1176 | `?ux=dotacion-historial` |
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
`.cache/pdfp-27.png` (no versionado). Las etapas 28–31 (UX-17) quedan en tareas posteriores;
`MarcoOffboarding` reserva el slot de contenido para su stepper.

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
├── offboarding/             # bandeja de offboarding (PDF p. 27, UX-16)
├── dotacion/                # resumen y detalle por cliente (PDF pp. 32-35, UX-18/19)
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
| Organización y dotación · resumen (PDF p. 32) | Pendiente de revisión visual | 8,5 / 255 |
| Organización y dotación · estructura (PDF p. 33) | Pendiente de revisión visual | 6,6 / 255 |
| Organización y dotación · asignados (PDF p. 34) | Pendiente de revisión visual | 7,9 / 255 |
| Organización y dotación · historial (PDF p. 35) | Pendiente de revisión visual | 7,4 / 255 |
| Inicio | Pendiente de revisión visual | 10,6 / 255 |
| Inicio módulo | Pendiente de revisión visual | 7,2 / 255 |
| Login | Pendiente de revisión visual | 7,2 / 255 |
| Perfiles | Pendiente de revisión visual | 6,9 / 255 |
| Módulos | Pendiente de revisión visual | 8,7 / 255 |

El MAE es una medida de calibración contra el render del diseño, no un criterio de
aceptación: la validación es visual y la hace el usuario o el responsable funcional.

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
    filas. `MarcoOffboarding` deja preparado el contenido para el stepper de las etapas 28–31
    (UX-17), que no se implementan en esta tarea.

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
- Con `offboarding` queda replicada la **bandeja de offboarding** (PDF p. 27, UX-16) y su
  modo con render de referencia; las etapas del proceso (PDF pp. 28-31, UX-17) quedan
  pendientes en tareas posteriores.
- Con `dotacion`, `dotacion-estructura`, `dotacion-asignados` y `dotacion-historial` queda
  replicado el **bloque completo de Organización y dotación** (PDF pp. 32-35, UX-18/19):
  el resumen (p. 32), la estructura organizacional (p. 33), los colaboradores asignados
  (p. 34) y el historial de cambios (p. 35). Las tres variantes del detalle reutilizan
  `MarcoDotacion`, `DetalleDotacion` y la navegación del bloque.
- El merge de esta rama a `main` es **lineal** y lo hace el usuario tras validar las ventanas.
- `memory.md` se actualiza en `main` cuando el usuario cierre la fase; este documento no
  duplica la bitácora.
- Después del cierre, el trabajo continúa en el repositorio principal con **T-RH-06**
  (persistencia intra-sesión de filtros y apertura de fila con contexto), que requiere
  confirmación explícita del usuario.
