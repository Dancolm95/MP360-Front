import { Cabecera, Icono, Navegacion, PanelLateral, Pie } from '../ux02/Cromo'
import {
  ETIQUETA_REVISADO,
  FILAS_RESUMEN_DATOS,
  PASOS,
  RESUMEN_INFO,
  RESUMEN_PAGO,
  TITULO_RESUMEN,
  VALIDACIONES_RESUMEN,
  type DatoResumen,
  type EstadoValidacion,
} from './datos'

function Avatar() {
  return (
    <span className="ux07-resumen__avatar" aria-hidden="true">
      <svg viewBox="0 0 56 56" focusable="false">
        <circle cx="28" cy="28" r="28" fill="currentColor" />
        <circle cx="28" cy="21" r="8.5" fill="#fff" />
        <path d="M10 48c.8-9.6 8.2-15.2 18-15.2S45.2 38.4 46 48z" fill="#fff" />
      </svg>
    </span>
  )
}

function Check() {
  return (
    <svg viewBox="0 0 22 22" aria-hidden="true" focusable="false">
      <path
        d="M5.4 11.4l3.7 3.7 7.5-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Revisado() {
  return (
    <span className="ux07-resumen__revisado">
      <span className="ux07-resumen__revisado-icono">
        <span className="ux07-resumen__revisado-circulo" aria-hidden="true">
          <Check />
        </span>
      </span>
      {ETIQUETA_REVISADO}
    </span>
  )
}

function IconoValidacion({ estado }: { estado: EstadoValidacion }) {
  return (
    <span
      className={`ux07-resumen__validacion-icono ux07-resumen__validacion-icono--${estado}`}
      aria-hidden="true"
    >
      {estado === 'completado' ? (
        <Check />
      ) : estado === 'proceso' ? (
        <span className="ux02-i">schedule</span>
      ) : (
        <span className="ux02-i">remove</span>
      )}
    </span>
  )
}

function Dato({ dato }: { dato: DatoResumen }) {
  return (
    <>
      <span className="ux07-resumen__etiqueta">{dato.etiqueta}</span>
      <span className="ux07-resumen__valor">{dato.valor}</span>
    </>
  )
}

function Encabezado() {
  return (
    <header className="ux07-encabezado">
      <p className="ux02-breadcrumb ux07-breadcrumb">
        <span className="ux02-breadcrumb__activo">R.R.H.H</span>
        <span className="ux02-breadcrumb__sep">/</span>
        <span className="ux07-breadcrumb__fin">Colaborades</span>
      </p>

      <h1 className="ux07-titulo">Alta de Colaborador</h1>
      <p className="ux07-subtitulo">
        Formaliza el ingreso del candidato seleccionado y conviértelo en colaborador activo.
      </p>
    </header>
  )
}

function Stepper() {
  return (
    <div
      className="ux07-pasos ux07-resumen__pasos"
      role="list"
      aria-label="Etapas del alta"
    >
      {PASOS.map((paso, indice) => (
        <div
          key={paso}
          role="listitem"
          aria-current={indice === PASOS.length - 1 ? 'step' : undefined}
          className="ux07-paso ux07-paso--activo"
        >
          <span className="ux07-paso__numero">{indice + 1}</span>
          <span className="ux07-paso__etiqueta">{paso}</span>
        </div>
      ))}
      {PASOS.slice(1).map((paso) => (
        <span
          key={`conector-${paso}`}
          className="ux07-pasos__conector ux07-pasos__conector--activo"
          aria-hidden="true"
        />
      ))}
      <span
        className="ux07-pasos__activo ux07-resumen__progreso"
        aria-hidden="true"
      />
    </div>
  )
}

function FilaResumen({
  izquierda,
  derecha,
  media,
}: {
  izquierda: DatoResumen
  derecha?: DatoResumen
  media?: boolean
}) {
  return (
    <div className={`ux07-resumen__fila${media ? ' ux07-resumen__fila--media' : ''}`}>
      <Dato dato={izquierda} />
      {derecha ? <Dato dato={derecha} /> : null}
    </div>
  )
}

function DatosColaborador() {
  return (
    <section className="ux07-card ux07-resumen__datos" aria-label="Resumen de datos del colaborador">
      <div className="ux07-resumen__titulo">
        <span className="ux07-resumen__marca" aria-hidden="true" />
        <h2>{TITULO_RESUMEN}</h2>
      </div>

      <div className="ux07-resumen__banda">
        <h3 className="ux07-resumen__banda-titulo">Datos del Colaborador</h3>
        <Revisado />
      </div>

      <div className="ux07-resumen__persona">
        <Avatar />
        <button type="button" className="ux07-resumen__ver-foto">
          Ver Foto
        </button>
      </div>

      <div className="ux07-resumen__ficha">
        {FILAS_RESUMEN_DATOS.map((fila, indice) => (
          <FilaResumen
            key={fila.izquierda.etiqueta}
            izquierda={fila.izquierda}
            derecha={fila.derecha}
            media={indice === 4 || indice === 5}
          />
        ))}
      </div>

      <button type="button" className="ux07-resumen__editar ux07-resumen__editar--direccion">
        Editar <Icono nombre="edit" />
      </button>

      <div className="ux07-resumen__pago">
        <div className="ux07-resumen__pago-fila">
          <span className="ux07-resumen__etiqueta">{RESUMEN_PAGO.primera.izquierda.etiqueta}</span>
          <span className="ux07-resumen__valor">{RESUMEN_PAGO.primera.izquierda.valor}</span>
          <span className="ux07-resumen__etiqueta">{RESUMEN_PAGO.primera.derecha.etiqueta}</span>
          <span className="ux07-resumen__valor">{RESUMEN_PAGO.primera.derecha.valor}</span>
        </div>
        <div className="ux07-resumen__pago-fila">
          <span className="ux07-resumen__etiqueta">{RESUMEN_PAGO.segunda.etiqueta}</span>
          <span className="ux07-resumen__valor">{RESUMEN_PAGO.segunda.valor}</span>
        </div>
        <div className="ux07-resumen__pago-fila">
          <span className="ux07-resumen__etiqueta">{RESUMEN_PAGO.tercera.etiqueta}</span>
          <span className="ux07-resumen__valor">{RESUMEN_PAGO.tercera.valor}</span>
        </div>
        <button type="button" className="ux07-resumen__editar ux07-resumen__editar--pago">
          {RESUMEN_PAGO.editar} <Icono nombre="edit" />
        </button>
      </div>
    </section>
  )
}

function Tallas({
  datos,
  lado,
}: {
  datos: readonly DatoResumen[]
  lado: 'izquierda' | 'derecha'
}) {
  return (
    <div className={`ux07-resumen__tallas ux07-resumen__tallas--${lado}`}>
      {datos.map((dato) => (
        <div key={dato.etiqueta} className="ux07-resumen__talla">
          <span className="ux07-resumen__talla-etiqueta">{dato.etiqueta}</span>
          <span className="ux07-resumen__talla-valor">{dato.valor}</span>
        </div>
      ))}
    </div>
  )
}

function ResumenValidaciones() {
  return (
    <section className="ux07-card ux07-resumen__info" aria-label="Resumen de información y validaciones">
      <div className="ux07-resumen__titulo">
        <span className="ux07-resumen__marca" aria-hidden="true" />
        <h2>{TITULO_RESUMEN}</h2>
      </div>

      <div className="ux07-resumen__banda">
        <h3 className="ux07-resumen__banda-titulo">Información Adicional</h3>
        <Revisado />
      </div>

      <div className="ux07-resumen__info-persona">
        <Avatar />
        <div className="ux07-resumen__info-datos">
          <span className="ux07-resumen__info-nombre">{RESUMEN_INFO.nombre}</span>
          <span className="ux07-resumen__info-dato">Nac: {RESUMEN_INFO.nacionalidad}</span>
          <span className="ux07-resumen__info-dato">DNI: {RESUMEN_INFO.dni}</span>
        </div>
        <Tallas datos={RESUMEN_INFO.tallasIzquierda} lado="izquierda" />
        <Tallas datos={RESUMEN_INFO.tallasDerecha} lado="derecha" />
      </div>

      <button type="button" className="ux07-resumen__editar ux07-resumen__editar--info">
        {RESUMEN_INFO.editar} <Icono nombre="edit" />
      </button>

      <span className="ux07-resumen__divisor" aria-hidden="true" />

      <div className="ux07-resumen__banda ux07-resumen__banda--validaciones">
        <h3 className="ux07-resumen__banda-titulo">Validaciones Requeridas</h3>
        <Revisado />
      </div>

      <ul className="ux07-resumen__lista">
        {VALIDACIONES_RESUMEN.map((validacion) => (
          <li key={validacion.titulo} className="ux07-resumen__validacion">
            <IconoValidacion estado={validacion.estado} />
            <span className="ux07-resumen__validacion-copia">
              <span className="ux07-resumen__validacion-titulo">{validacion.titulo}</span>
              <span className="ux07-resumen__validacion-descripcion">
                {validacion.descripcion}
              </span>
            </span>
            <span
              className={`ux07-resumen__estado ux07-resumen__estado--${validacion.estado}`}
            >
              {validacion.etiqueta}
            </span>
            <span className="ux07-resumen__fecha">{validacion.fecha}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Acciones() {
  return (
    <div className="ux07-acciones ux07-resumen__acciones">
      <button type="button" className="ux07-btn ux07-btn--cancelar">
        Cancelar
      </button>
      <button type="button" className="ux07-btn ux07-btn--borrador">
        <span className="ux02-i" aria-hidden="true">
          save
        </span>
        Guardar Borrador
      </button>
      <button type="button" className="ux07-btn ux07-btn--continuar">
        Confirmar Alta
        <span className="ux02-i" aria-hidden="true">
          chevron_right
        </span>
      </button>
    </div>
  )
}

export function AltaResumen() {
  return (
    <div className="ux02-lienzo ux07-lienzo">
      <Cabecera />
      <Navegacion activo="Colaboradores" submenu={false} chevronActivo={false} />
      <div className="ux02-main">
        <div className="ux02-columna ux07-columna">
          <Encabezado />
          <Stepper />
          <div className="ux07-columnas ux07-resumen">
            <DatosColaborador />
            <div className="ux07-derecha">
              <ResumenValidaciones />
              <Acciones />
            </div>
          </div>
        </div>
        <PanelLateral iconoAcciones="edit" iconoAccesos={null} iconoEventos="expand_more" />
      </div>
      <Pie />
    </div>
  )
}
