import { Cabecera, Icono, Navegacion, PanelLateral, Pie } from '../ux02/Cromo'
import {
  ACCIONES_CONFIRMACION,
  CONFIRMACION_ALTA,
  CONFIRMACION_DATOS,
  PASOS,
  PROCESOS_POSTERIORES,
  type DatoResumen,
} from './datos'

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

function Avatar() {
  return (
    <span className="ux07-confirmacion__avatar" aria-hidden="true">
      <svg viewBox="0 0 36 36" focusable="false">
        <circle cx="18" cy="18" r="18" fill="currentColor" />
        <circle cx="18" cy="13.6" r="5.4" fill="#fff" />
        <path d="M6.5 32.4c.9-6.6 5.5-10.2 11.5-10.2s10.6 3.6 11.5 10.2z" fill="#fff" />
      </svg>
    </span>
  )
}

function Exito() {
  return (
    <svg
      className="ux07-confirmacion__icono"
      viewBox="0 0 200 76"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="100" cy="38" r="38" fill="#e6f8ea" />
      <circle cx="100" cy="38" r="27.5" fill="#53ab5f" />
      <path
        d="M88.5 38.5l8 8 15-16"
        fill="none"
        stroke="#fff"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M9 35.5c4-2.5 7-5.5 9-9.5"
        fill="none"
        stroke="#0071b9"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M36 29c4.5-1.5 8.5-4 12-8"
        fill="none"
        stroke="#f8ad3b"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M38 54c3.5 2.5 7.5 3.5 12 3.5"
        fill="none"
        stroke="#ff0000"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M161 20c5-.5 9.5-2.5 13.5-6"
        fill="none"
        stroke="#0071b9"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M182 36c5.5.5 10.5 2 15 5"
        fill="none"
        stroke="#22b273"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M165 49c5.5 1.5 10 4 13.5 8.5"
        fill="none"
        stroke="#f8ad3b"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
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
    <div className="ux07-pasos" role="list" aria-label="Etapas del alta">
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
      <span className="ux07-confirmacion__progreso" aria-hidden="true" />
    </div>
  )
}

function Dato({ dato }: { dato: DatoResumen }) {
  return (
    <>
      <span className="ux07-confirmacion__etiqueta">{dato.etiqueta}</span>
      <span className="ux07-confirmacion__valor">{dato.valor}</span>
    </>
  )
}

function DatosColaborador() {
  return (
    <section className="ux07-confirmacion__datos" aria-label="Datos del colaborador">
      <div className="ux07-confirmacion__banda">
        <Avatar />
        <h2 className="ux07-confirmacion__banda-titulo">Datos del Colaborador</h2>
        <span className="ux07-confirmacion__estado">
          <span className="ux07-confirmacion__estado-circulo">
            <Check />
          </span>
          {CONFIRMACION_ALTA.estado}
        </span>
      </div>

      <span className="ux07-confirmacion__divisor" aria-hidden="true" />

      <div className="ux07-confirmacion__rejilla">
        <div className="ux07-confirmacion__columna">
          {CONFIRMACION_DATOS.map((fila) => (
            <div key={fila.izquierda.etiqueta} className="ux07-confirmacion__fila">
              <Dato dato={fila.izquierda} />
            </div>
          ))}
        </div>
        <div className="ux07-confirmacion__columna">
          {CONFIRMACION_DATOS.map((fila) => (
            <div key={fila.derecha.etiqueta} className="ux07-confirmacion__fila">
              <Dato dato={fila.derecha} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Procesos() {
  return (
    <section className="ux07-confirmacion__procesos" aria-label="Procesos posteriores">
      <h3 className="ux07-confirmacion__procesos-titulo">Procesos Posteriores</h3>
      <ul className="ux07-confirmacion__procesos-lista">
        {PROCESOS_POSTERIORES.map((proceso) => (
          <li key={proceso.titulo} className="ux07-confirmacion__proceso">
            <span
              className={`ux07-confirmacion__proceso-icono ux07-confirmacion__proceso-icono--${proceso.estado}`}
              aria-hidden="true"
            >
              {proceso.estado === 'completado' ? (
                <Check />
              ) : (
                <svg viewBox="0 0 32 32" focusable="false">
                  <circle cx="16" cy="16" r="16" fill="#fef0cb" />
                  <circle cx="16" cy="16" r="12" fill="#f4901e" />
                  <path
                    d="M16 9.5V16l4.6 3.2"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>

            <span className="ux07-confirmacion__proceso-texto">
              <span className="ux07-confirmacion__proceso-titulo">{proceso.titulo}</span>
              <span className="ux07-confirmacion__proceso-detalle">
                {proceso.detalle}
                {proceso.enlace ? (
                  <span className="ux07-confirmacion__proceso-enlace">{proceso.enlace}</span>
                ) : null}
              </span>
            </span>

            <span
              className={`ux07-confirmacion__proceso-estado ux07-confirmacion__proceso-estado--${proceso.estado}`}
            >
              {proceso.etiqueta}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Acciones() {
  return (
    <div className="ux07-confirmacion__acciones">
      {ACCIONES_CONFIRMACION.map((accion) => (
        <button
          key={accion.etiqueta}
          type="button"
          className={`ux07-confirmacion__btn${
            accion.primaria ? ' ux07-confirmacion__btn--primaria' : ''
          }`}
        >
          <Icono nombre={accion.icono} />
          {accion.etiqueta}
        </button>
      ))}
    </div>
  )
}

export function AltaConfirmacion() {
  return (
    <div className="ux02-lienzo ux07-lienzo">
      <Cabecera />
      <Navegacion activo="Colaboradores" submenu={false} chevronActivo={false} />
      <div className="ux02-main">
        <div className="ux02-columna ux07-columna">
          <Encabezado />
          <Stepper />
          <div className="ux07-confirmacion">
            <div className="ux07-confirmacion__exito">
              <Exito />
              <h2 className="ux07-confirmacion__titulo">{CONFIRMACION_ALTA.titulo}</h2>
              <p className="ux07-confirmacion__mensaje">
                {CONFIRMACION_ALTA.mensaje}
                <br />
                {CONFIRMACION_ALTA.mensajeFinal}
              </p>
            </div>

            <DatosColaborador />
            <Procesos />
            <Acciones />
          </div>
        </div>
        <PanelLateral iconoAcciones="edit" iconoAccesos={null} iconoEventos="expand_more" />
      </div>
      <Pie />
    </div>
  )
}
