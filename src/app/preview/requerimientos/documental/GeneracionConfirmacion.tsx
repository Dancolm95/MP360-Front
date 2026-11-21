import { Icono } from '../ux02/Cromo'
import { MarcoDocumental } from './MarcoDocumental'
import { StepperGeneracionDocumental } from './GeneracionTipo'
import {
  CONFIRMACION_GENERACION_DOCUMENTAL,
  type DatoConfirmacion,
} from './datos'

const CONFETTI = ['azul', 'naranja', 'rojo', 'azul', 'verde', 'naranja'] as const

function Check({ trazo = '#5d985e', fondo }: { trazo?: string; fondo?: string }) {
  return (
    <svg viewBox="0 0 22 22" aria-hidden="true" focusable="false">
      {fondo ? <circle cx="11" cy="11" r="11" fill={fondo} /> : null}
      <path
        d="M6.1 11.3l3.2 3.2 6.6-6.6"
        fill="none"
        stroke={trazo}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconoDocumento() {
  return (
    <svg
      className="ux24-confirmacion__icono-documento"
      viewBox="0 0 46 62"
      fill="none"
      stroke="#e92514"
      strokeWidth="4"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M2 7a5 5 0 0 1 5-5h20l17 17v38a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5z"
        strokeLinejoin="round"
      />
      <path d="M27 2v13h17" strokeLinejoin="round" />
      <path d="M12 27h14M12 37h20M12 47h20" strokeLinecap="round" />
    </svg>
  )
}

function AvatarResumen() {
  return (
    <span className="ux24-confirmacion__avatar" aria-hidden="true">
      <svg viewBox="0 0 36 36" focusable="false">
        <circle cx="18" cy="13.6" r="6.2" fill="#ececec" />
        <path d="M5.4 31.2c.5-6.9 5.7-10.7 12.6-10.7s12.1 3.8 12.6 10.7z" fill="#ececec" />
      </svg>
    </span>
  )
}

function Exito() {
  return (
    <section
      className="ux24-confirmacion__exito"
      aria-labelledby="ux24-confirmacion-titulo"
    >
      <div className="ux24-confirmacion__halo" aria-hidden="true">
        {CONFETTI.map((color, indice) => (
          <span
            key={indice}
            className={`ux24-confirmacion__confeti ux24-confirmacion__confeti--${indice + 1} ux24-confirmacion__confeti--${color}`}
          />
        ))}
        <span className="ux24-confirmacion__circulo">
          <svg viewBox="0 0 56 56" focusable="false">
            <path
              d="M16.4 29.2l8.2 8.2 15.2-16"
              fill="none"
              stroke="#fff"
              strokeWidth="3.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      <h2 className="ux24-confirmacion__titulo" id="ux24-confirmacion-titulo">
        {CONFIRMACION_GENERACION_DOCUMENTAL.titulo}
      </h2>
      <p className="ux24-confirmacion__subtitulo">
        {CONFIRMACION_GENERACION_DOCUMENTAL.subtitulo}
      </p>
    </section>
  )
}

function BloqueDatos({
  datos,
  columna,
}: {
  readonly datos: readonly DatoConfirmacion[]
  readonly columna: 1 | 2
}) {
  return (
    <dl className={`ux24-confirmacion__datos ux24-confirmacion__datos--${columna}`}>
      {datos.map((dato) => (
        <div key={dato.etiqueta} className="ux24-confirmacion__fila">
          <dt className="ux24-confirmacion__etiqueta">{dato.etiqueta}</dt>
          <dd className="ux24-confirmacion__valor">{dato.valor}</dd>
        </div>
      ))}
    </dl>
  )
}

function Resumen() {
  const datos = CONFIRMACION_GENERACION_DOCUMENTAL
  return (
    <section
      className="ux24-confirmacion__resumen"
      aria-label="Resumen del Documento"
    >
      <header className="ux24-confirmacion__resumen-cabecera">
        <AvatarResumen />
        <h3 className="ux24-confirmacion__resumen-titulo">Resumen del Documento</h3>
        <span className="ux24-confirmacion__estado">
          <span className="ux24-confirmacion__estado-icono">
            <Check trazo="#5d985e" fondo="#fff" />
          </span>
          {datos.estado}
        </span>
      </header>

      <div className="ux24-confirmacion__archivo">
        <IconoDocumento />
        <div className="ux24-confirmacion__archivo-datos">
          <p className="ux24-confirmacion__archivo-nombre">{datos.archivo}</p>
          <p className="ux24-confirmacion__archivo-version">{datos.version}</p>
          <span className="ux24-confirmacion__envio">
            <span className="ux24-confirmacion__envio-icono">
              <Check trazo="#5d985e" fondo="#fff" />
            </span>
            {datos.envio}
          </span>
        </div>
      </div>

      <span
        className="ux24-confirmacion__divisoria ux24-confirmacion__divisoria--1"
        aria-hidden="true"
      />
      <BloqueDatos datos={datos.colaborador} columna={1} />
      <span
        className="ux24-confirmacion__divisoria ux24-confirmacion__divisoria--2"
        aria-hidden="true"
      />
      <BloqueDatos datos={datos.documento} columna={2} />
    </section>
  )
}

function Acciones() {
  return (
    <div className="ux24-confirmacion__acciones" role="group" aria-label="Acciones del documento">
      <button type="button" className="ux24-confirmacion__accion">
        <Icono nombre="person" />
        Ver Documento del Colaborador
      </button>
      <button type="button" className="ux24-confirmacion__accion">
        <Icono nombre="edit_document" />
        Generar otro documento
      </button>
      <button
        type="button"
        className="ux24-confirmacion__accion ux24-confirmacion__accion--solida"
      >
        <Icono nombre="assignment" />
        Ir a Bandeja de Documentos
      </button>
    </div>
  )
}

export function GeneracionConfirmacion() {
  return (
    <MarcoDocumental
      breadcrumbFin="Colaborades"
      titulo="Alta de Colaborador"
      subtitulo="Formaliza el ingreso del candidato seleccionado y conviértelo en colaborador activo."
      mostrarAccion={false}
      clase="ux24-confirmacion"
    >
      <StepperGeneracionDocumental activo={3} />
      <div className="ux24-confirmacion__cuerpo">
        <Exito />
        <Resumen />
        <Acciones />
      </div>
    </MarcoDocumental>
  )
}
