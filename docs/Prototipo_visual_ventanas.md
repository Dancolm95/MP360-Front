# Prototipo visual de ventanas — rama `codex/rh-vis`

**Última actualización:** 17 de noviembre de 2026.
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
| `login` | Acceso a MP 360 | `a-01` | 1920 × 1080 | `?ux=login` |
| `perfiles` | Selección de perfil | `a-02` | 1920 × 1080 | `?ux=perfiles` |
| `modulos` | Selección de módulo | `a-03` | 1920 × 1080 | `?ux=modulos` |

Además, el selector conserva las vistas **funcionales** experimentales (`Funcional UX-03` y
`Funcional UX-04`), que montan los componentes reales del módulo con datos de ejemplo.
No forman parte del prototipo visual: están ahí solo para contraste.

**Nota sobre `a-05`:** es la misma pantalla de Inicio con el **selector de módulo**
abierto —no el filtro de Área/Subárea—. Se replica como modo propio `inicio-modulo` para
compararlo y como interacción del botón «Recursos Humanos» en `inicio`.

## 4. Cómo ejecutarlo

```bash
pnpm install --frozen-lockfile
pnpm dev            # http://localhost:3000/preview/requerimientos
# o, sobre un build de producción:
pnpm build && pnpm start --port 3210
```

El preview escala cada lienzo al ancho disponible (`VistaEscalada`): cada ventana declara su
ancho y alto, de modo que conviven los formatos 1920 × 1176 (RR. HH.) y 1920 × 1080 (acceso)
sin reflow interno.

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

## 9. Cierre y siguiente paso

- El merge de esta rama a `main` es **lineal** y lo hace el usuario tras validar las ventanas.
- `memory.md` se actualiza en `main` cuando el usuario cierre la fase; este documento no
  duplica la bitácora.
- Después del cierre, el trabajo continúa en el repositorio principal con **T-RH-06**
  (persistencia intra-sesión de filtros y apertura de fila con contexto), que requiere
  confirmación explícita del usuario.
