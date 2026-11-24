import type { ReactNode } from 'react'
import { Cabecera, Icono, Navegacion, PanelLateral, Pie } from '../ux02/Cromo'
import {
  CAMPOS_DETALLE,
  DETALLE_LICENCIA,
  DOCUMENTOS_DETALLE,
  PASOS_DETALLE,
  RESUMEN_DETALLE,
} from './datos'

function Avatar() {
  return (
    <span className="ux13-detalle__avatar" aria-hidden="true">
      <svg viewBox="0 0 34 34" focusable="false">
        <circle cx="17" cy="17" r="17" fill="#808080" />
        <circle cx="17" cy="12.5" r="6.2" fill="#fff" />
        <path d="M5.8 29.5c.5-6.1 5.2-9.7 11.2-9.7s10.7 3.6 11.2 9.7z" fill="#fff" />
      </svg>
    </span>
  )
}

function Check() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="m5.4 12.4 4.3 4.3 8.9-8.9"
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Calendario() {
  return (
    <svg
      className="ux13-detalle__impacto-icono"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M4 10h16M8 3v4M16 3v4M7 14h.2M11 14h.2M15 14h.2M7 17.5h.2M11 17.5h.2M15 17.5h.2" />
    </svg>
  )
}

function Documento() {
  return (
    <svg
      className="ux13-detalle__impacto-icono"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6 2h8l5 5v15H6z" />
      <path d="M14 2v5h5M9 12h6M9 16h6" />
    </svg>
  )
}

function ArchivoIcono() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M7 3.5h7l4 4V20a.8.8 0 0 1-.8.8H7a.8.8 0 0 1-.8-.8V4.3a.8.8 0 0 1 .8-.8z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path d="M14 3.5v4h4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M9.4 11.4h.2M9.4 14.4h5.2M9.4 17.2h5.2" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  )
}

function Nube() {
  return (
    <svg
      className="ux13-detalle__nube"
      viewBox="0 0 34 34"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M11 24.4a7.2 7.2 0 0 1-.9-14.3A9.2 9.2 0 0 1 27.2 13.6a6.2 6.2 0 0 1-1.5 10.8" />
      <path d="M17 14.2v16.4" />
      <path d="m12.4 25.8 4.6 4.6 4.6-4.6" />
    </svg>
  )
}

function SinEntrada() {
  return (
    <svg
      className="ux13-detalle__sin-entrada"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="10" cy="10" r="7.6" />
      <path d="m4.6 15.4 10.8-10.8" />
    </svg>
  )
}

function Seccion({
  children,
  clase,
}: {
  children: ReactNode
  clase?: string
}) {
  return (
    <div className={`ux13-detalle__seccion${clase ? ` ${clase}` : ''}`}>
      <span className="ux13-detalle__marca" aria-hidden="true" />
      <h2 className="ux13-detalle__seccion-titulo">{children}</h2>
    </div>
  )
}

function Hero() {
  return (
    <header className="ux13-detalle__hero">
      <p className="ux02-breadcrumb ux13-detalle__breadcrumb">
        <span className="ux02-breadcrumb__activo">R.R.H.H</span>
        <span className="ux02-breadcrumb__sep">/</span>
        <span>Asistencia</span>
        <span className="ux02-breadcrumb__sep">/</span>
        <span>Detalle</span>
        <span className="ux02-breadcrumb__sep">/</span>
        <span>Postulante</span>
      </p>

      <div className="ux13-detalle__titulo-fila">
        <h1 className="ux13-titulo">Detalle de Licencia o Ausencia</h1>
        <span className="ux13-detalle__badge">{DETALLE_LICENCIA.estadoActual}</span>
      </div>

      <button type="button" className="ux13-detalle__volver">
        <Icono nombre="chevron_left" />
        Volver a Postulantes
      </button>
    </header>
  )
}

function Ficha() {
  return (
    <section className="ux13-detalle__ficha" aria-label="Resumen de la licencia">
      <div className="ux13-detalle__identidad">
        <Avatar />
        <span className="ux13-detalle__colaborador">
          <span className="ux13-detalle__nombre">{DETALLE_LICENCIA.colaborador}</span>
          <span className="ux13-detalle__identidad-dato">DNI: {DETALLE_LICENCIA.dni}</span>
          <span className="ux13-detalle__identidad-dato">{DETALLE_LICENCIA.cargo}</span>
        </span>
      </div>

      {CAMPOS_DETALLE.map((campo, indice) => (
        <div key={campo.etiqueta} className={`ux13-detalle__campo ux13-detalle__campo--${indice + 1}`}>
          <span className="ux13-detalle__campo-etiqueta">{campo.etiqueta}</span>
          <span className="ux13-detalle__campo-valor">{campo.valor}</span>
        </div>
      ))}

      <span className="ux13-detalle__divisor ux13-detalle__divisor--1" aria-hidden="true" />
      <span className="ux13-detalle__divisor ux13-detalle__divisor--2" aria-hidden="true" />
      <span className="ux13-detalle__divisor ux13-detalle__divisor--3" aria-hidden="true" />
      <span className="ux13-detalle__divisor ux13-detalle__divisor--4" aria-hidden="true" />
      <span className="ux13-detalle__divisor ux13-detalle__divisor--5" aria-hidden="true" />

      <div className="ux13-detalle__etapas" role="list" aria-label="Etapas de la solicitud">
        <span className="ux13-detalle__tramo ux13-detalle__tramo--1" aria-hidden="true" />
        <span className="ux13-detalle__tramo ux13-detalle__tramo--2" aria-hidden="true" />
        <span className="ux13-detalle__tramo ux13-detalle__tramo--3" aria-hidden="true" />

        {PASOS_DETALLE.map((paso, indice) => (
          <div
            key={paso.etiqueta}
            role="listitem"
            className={`ux13-detalle__etapa ux13-detalle__etapa--${indice + 1} ux13-detalle__etapa--${paso.estado}`}
            aria-current={paso.estado === 'actual' ? 'step' : undefined}
          >
            <span className="ux13-detalle__circulo" aria-hidden="true">
              {paso.estado === 'completado' || paso.estado === 'actual' ? <Check /> : null}
            </span>
            <span className="ux13-detalle__etapa-texto">
              <strong>{paso.etiqueta}</strong>
              {paso.fecha ? <span className="ux13-detalle__etapa-fecha">{paso.fecha}</span> : null}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

function Informacion() {
  return (
    <section className="ux13-detalle__card ux13-detalle__info" aria-label="Información de la solicitud">
      <Seccion>Información de la solicitud</Seccion>

      <div className="ux13-detalle__info-caja">
        <div className="ux13-detalle__info-fila">
          <span className="ux13-detalle__dato-etiqueta ux13-detalle__dato-etiqueta--motivo">
            Motivo
          </span>
          <span className="ux13-detalle__dato-valor ux13-detalle__dato-valor--motivo">
            {DETALLE_LICENCIA.motivo}
          </span>
          <span className="ux13-detalle__dato-etiqueta ux13-detalle__dato-etiqueta--periodo">
            Periodo de Licencia
          </span>
          <span className="ux13-detalle__dato-valor ux13-detalle__dato-valor--periodo">
            {DETALLE_LICENCIA.periodoDetalle}
          </span>
          <span className="ux13-detalle__info-divisor" aria-hidden="true" />
        </div>

        <span className="ux13-detalle__dato-etiqueta ux13-detalle__dato-etiqueta--comentarios">
          Comentarios
        </span>
        <p className="ux13-detalle__comentario">{DETALLE_LICENCIA.comentario}</p>
      </div>
    </section>
  )
}

function Documentos() {
  return (
    <section className="ux13-detalle__card ux13-detalle__documentos" aria-label="Documentos del postulante">
      <Seccion>Documentos del postulante</Seccion>

      {DOCUMENTOS_DETALLE.map((documento, indice) => (
        <div key={documento.archivo} className={`ux13-detalle__archivo ux13-detalle__archivo--${indice + 1}`}>
          <span className={`ux13-detalle__archivo-chip ux13-detalle__archivo-chip--${documento.tipo}`}>
            <ArchivoIcono />
          </span>
          <span className="ux13-detalle__archivo-datos">
            <span className="ux13-detalle__archivo-nombre">{documento.archivo}</span>
            <span className="ux13-detalle__archivo-peso">
              Adjunto . {documento.formato} . {documento.peso}
            </span>
          </span>
          <button
            type="button"
            className="ux13-detalle__archivo-ver"
            aria-label={`Ver archivo ${documento.archivo}`}
          >
            Ver Archivo
            <Icono nombre="visibility" />
          </button>
          <button
            type="button"
            className="ux13-detalle__archivo-menu"
            aria-label={`Acciones de ${documento.archivo}`}
          >
            <Icono nombre="more_vert" />
          </button>
        </div>
      ))}

      <button type="button" className="ux13-detalle__dropzone" aria-label="Adjuntar sustento documental">
        <Nube />
        <span className="ux13-detalle__drop-texto">
          Arrastra tus archivos aquí o <span>selecciona</span>
        </span>
        <span className="ux13-detalle__drop-formatos">
          Formatos permitidos: PDF, JPG, PNG (Max 1MB)
        </span>
      </button>
    </section>
  )
}

function Impacto() {
  return (
    <section
      className="ux13-detalle__card ux13-detalle__impacto"
      aria-label="Impacto en asistencia y planilla"
    >
      <Seccion>Impacto en asistencia y planilla</Seccion>

      <div className="ux13-detalle__impacto-caja">
        <Calendario />
        <span className="ux13-detalle__impacto-dato ux13-detalle__impacto-dato--dias">
          <span className="ux13-detalle__impacto-etiqueta">Días de ausencia</span>
          <span className="ux13-detalle__impacto-valor">{DETALLE_LICENCIA.diasAusencia}</span>
        </span>
        <span className="ux13-detalle__impacto-divisor" aria-hidden="true" />
        <Documento />
        <span className="ux13-detalle__impacto-dato ux13-detalle__impacto-dato--planilla">
          <span className="ux13-detalle__impacto-etiqueta">Impacto en planilla</span>
          <span className="ux13-detalle__pill ux13-detalle__pill--planilla">
            {DETALLE_LICENCIA.impactoPlanilla}
          </span>
        </span>
      </div>

      <Seccion clase="ux13-detalle__seccion--obs">
        Observaciones <span className="ux13-detalle__opcional">(opcional)</span>
      </Seccion>

      <div className="ux13-detalle__obs-caja">
        <p className="ux13-detalle__obs-texto">{DETALLE_LICENCIA.observaciones}</p>
        <span className="ux13-detalle__obs-contador">60/200</span>
      </div>

      <Seccion clase="ux13-detalle__seccion--alertas">Alertas y destinatarios</Seccion>

      <div className="ux13-detalle__alertas">
        <span className="ux13-detalle__alerta-etiqueta ux13-detalle__alerta-etiqueta--estado">
          Estado de Notificación
        </span>
        <span className="ux13-detalle__pill ux13-detalle__pill--notificacion">
          {DETALLE_LICENCIA.notificacion}
        </span>
        <span className="ux13-detalle__alerta-divisor" aria-hidden="true" />
        <span className="ux13-detalle__alerta-etiqueta ux13-detalle__alerta-etiqueta--destinatarios">
          Destinatarios autorizados
        </span>
        <span className="ux13-detalle__alerta-valor">{DETALLE_LICENCIA.destinatarios}</span>
      </div>

      <div className="ux13-detalle__aviso">
        <Icono nombre="info" />
        <span>{DETALLE_LICENCIA.aviso}</span>
      </div>
    </section>
  )
}

function Resumen() {
  return (
    <section className="ux13-detalle__card ux13-detalle__resumen" aria-label="Resumen de solicitud">
      <Seccion>Resumen de solicitud</Seccion>

      {RESUMEN_DETALLE.map((fila, indice) => (
        <div key={fila.etiqueta} className={`ux13-detalle__resumen-fila ux13-detalle__resumen-fila--${indice + 1}`}>
          <span className="ux13-detalle__resumen-etiqueta">{fila.etiqueta}</span>
          <span
            className={`ux13-detalle__resumen-valor${
              fila.tono === 'azul' ? ' ux13-detalle__resumen-valor--azul' : ''
            }`}
          >
            {fila.valor}
          </span>
        </div>
      ))}

      <span className="ux13-detalle__resumen-sep ux13-detalle__resumen-sep--1" aria-hidden="true" />
      <span className="ux13-detalle__resumen-sep ux13-detalle__resumen-sep--2" aria-hidden="true" />
      <span className="ux13-detalle__resumen-sep ux13-detalle__resumen-sep--3" aria-hidden="true" />
      <span className="ux13-detalle__resumen-sep ux13-detalle__resumen-sep--4" aria-hidden="true" />
    </section>
  )
}

function Acciones() {
  return (
    <section className="ux13-detalle__card ux13-detalle__acciones" aria-label="Acciones de solicitud">
      <Seccion>Acciones de solicitud</Seccion>

      <button type="button" className="ux13-detalle__accion ux13-detalle__accion--aprobar">
        Aprobar / Registrar
      </button>
      <button type="button" className="ux13-detalle__accion ux13-detalle__accion--subsanar">
        Solicitar Subsanación
      </button>
      <button type="button" className="ux13-detalle__accion ux13-detalle__accion--rechazar">
        <SinEntrada />
        Rechazar / Anular
      </button>
    </section>
  )
}

export function DetalleLicencia() {
  return (
    <div className="ux02-lienzo ux13-lienzo ux13-detalle">
      <Cabecera />
      <Navegacion activo="Asistencia" submenu={false} chevronActivo={false} />
      <div className="ux02-main">
        <div className="ux02-columna ux13-detalle__columna">
          <Hero />
          <Ficha />
          <div className="ux13-detalle__rejilla">
            <div className="ux13-detalle__col-izq">
              <Informacion />
              <Documentos />
            </div>
            <div className="ux13-detalle__col-mid">
              <Impacto />
            </div>
            <div className="ux13-detalle__col-der">
              <Resumen />
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
