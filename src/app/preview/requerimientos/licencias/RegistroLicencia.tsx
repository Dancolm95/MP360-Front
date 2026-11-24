import type { ReactNode } from 'react'
import { Cabecera, Icono, Navegacion, PanelLateral, Pie } from '../ux02/Cromo'
import {
  COLABORADOR_ENCONTRADO,
  COLABORADORES_REGISTRO,
  PASOS_REGISTRO,
  SUSTENTOS,
  TIPOS_SOLICITUD,
} from './datos'

function Avatar() {
  return (
    <span className="ux13-registro__avatar" aria-hidden="true">
      <svg viewBox="0 0 46 46" focusable="false">
        <circle cx="23" cy="23" r="23" fill="#808080" />
        <circle cx="23" cy="17" r="8" fill="#fff" />
        <path d="M8 40c.7-8.2 6.8-13 15-13s14.3 4.8 15 13z" fill="#fff" />
      </svg>
    </span>
  )
}

function Nube() {
  return (
    <svg
      className="ux13-registro__nube"
      viewBox="0 0 34 34"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
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

function IconoPdf() {
  return (
    <svg className="ux13-registro__archivo-icono" viewBox="0 0 20 24" aria-hidden="true" focusable="false">
      <path d="M2 1h10.5L19 7.5V22a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" fill="#e8241f" />
      <path d="M12.5 1v6.5H19" fill="#fff" opacity="0.85" />
      <path
        d="M4.6 15.6c1.8-1.5 3.3-3.1 4.6-4.8 1.2-1.6 2.2-3.2 2.8-4.1.5 2.3.9 4.7 2 6.6.7 1.2 1.6 2.2 2.6 2.9-1.9.2-3.8.7-5.7.3-1.6-.3-3.2-1-4.6-1-.6 0-1.2 0-1.7.1z"
        fill="#fff"
      />
    </svg>
  )
}

function IconoPng() {
  return (
    <svg className="ux13-registro__archivo-icono" viewBox="0 0 20 24" aria-hidden="true" focusable="false">
      <path d="M2 1h10.5L19 7.5V22a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" fill="#3f9a52" />
      <path d="M12.5 1v6.5H19" fill="#fff" opacity="0.85" />
      <circle cx="6.6" cy="14.2" r="1.5" fill="#fff" />
      <path d="M3.8 20.2 8 16l2.4 2.5 1.8-1.7 3.4 3.4z" fill="#fff" />
    </svg>
  )
}

function Aspa() {
  return (
    <svg
      className="ux13-registro__aspa"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m1 1 12 12M13 1 1 13" />
    </svg>
  )
}

function Calendario() {
  return (
    <svg
      className="ux13-registro__impacto-icono ux13-registro__impacto-icono--calendario"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  )
}

function Documento() {
  return (
    <svg
      className="ux13-registro__impacto-icono ux13-registro__impacto-icono--documento"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
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

function Alerta() {
  return (
    <svg
      className="ux13-registro__aviso-icono"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.4v6.2M12 16.6v.2" />
    </svg>
  )
}

function Seccion({ children, clase }: { children: ReactNode; clase?: string }) {
  return (
    <div className={`ux13-registro__seccion${clase ? ` ${clase}` : ''}`}>
      <span className="ux13-registro__marca" aria-hidden="true" />
      <h2 className="ux13-registro__seccion-titulo">{children}</h2>
    </div>
  )
}

function Stepper() {
  return (
    <div className="ux13-registro__pasos" role="list" aria-label="Etapas de la solicitud">
      {PASOS_REGISTRO.map((paso, indice) => {
        const activo = indice < 3
        return (
          <div
            key={paso}
            role="listitem"
            aria-current={indice === 0 ? 'step' : undefined}
            className={`ux13-registro__paso${activo ? ' ux13-registro__paso--activo' : ''}`}
          >
            <span className="ux13-registro__paso-numero">{indice + 1}</span>
            <span className="ux13-registro__paso-etiqueta">{paso}</span>
          </div>
        )
      })}
      <span className="ux13-registro__conector" aria-hidden="true" />
      <span className="ux13-registro__conector" aria-hidden="true" />
      <span className="ux13-registro__conector" aria-hidden="true" />
      <span className="ux13-registro__progreso" aria-hidden="true" />
    </div>
  )
}

function SeleccionColaborador() {
  return (
    <section className="ux13-registro__card ux13-registro__col-izq" aria-label="Selección de colaborador">
      <Seccion clase="ux13-registro__seccion--izq">Selec. Colaborador</Seccion>

      <span className="ux13-registro__etiqueta ux13-registro__etiqueta--detalle">Detalle</span>
      <span className="ux13-registro__etiqueta ux13-registro__etiqueta--tipo-personal">
        Tipo de Personal
      </span>

      <label className="ux13-registro__buscador">
        <Icono nombre="search" />
        <input
          type="text"
          placeholder="Buscar por nombre, DNI...."
          aria-label="Buscar por nombre, DNI"
        />
      </label>

      <button
        type="button"
        className="ux13-registro__select ux13-registro__select--tipo-personal"
        aria-label="Tipo de Personal: Todos"
      >
        <span>Todos</span>
        <Icono nombre="expand_more" />
      </button>

      <div className="ux13-registro__encontrado">
        <Avatar />
        <span className="ux13-registro__nombre">{COLABORADOR_ENCONTRADO.nombre}</span>
        <span className="ux13-registro__persona-dato ux13-registro__persona-dato--nac">
          Nac: {COLABORADOR_ENCONTRADO.nacionalidad}
        </span>
        <span className="ux13-registro__persona-dato ux13-registro__persona-dato--dni">
          DNI: {COLABORADOR_ENCONTRADO.dni}
        </span>
        <span className="ux13-registro__badge">Postulante encontrado</span>

        <span className="ux13-registro__dato-etiqueta ux13-registro__dato-etiqueta--correo">
          Correo
        </span>
        <span className="ux13-registro__dato-valor ux13-registro__dato-valor--correo">
          {COLABORADOR_ENCONTRADO.correo}
        </span>
        <span className="ux13-registro__encontrado-sep" aria-hidden="true" />
        <span className="ux13-registro__dato-etiqueta ux13-registro__dato-etiqueta--numero">
          Número
        </span>
        <span className="ux13-registro__dato-valor ux13-registro__dato-valor--numero">
          {COLABORADOR_ENCONTRADO.numero}
        </span>
      </div>

      <p className="ux13-registro__lista-titulo">Colaboradores encontrados</p>

      <div className="ux13-registro__lista">
        {COLABORADORES_REGISTRO.map((colaborador, indice) => (
          <div key={indice} className="ux13-registro__fila" role="group">
            <Avatar />
            <span className="ux13-registro__nombre ux13-registro__nombre--fila">
              {colaborador.nombre}
            </span>
            <span className="ux13-registro__fila-cargo">{colaborador.cargo}</span>
            <span className="ux13-registro__fila-dni">DNI: {colaborador.dni}</span>
            <button
              type="button"
              className={
                indice === 0
                  ? 'ux13-registro__seleccion ux13-registro__seleccion--activa'
                  : 'ux13-registro__seleccion'
              }
            >
              {indice === 0 ? 'Seleccionado' : 'Seleccionar'}
            </button>
          </div>
        ))}
      </div>

      <span className="ux13-registro__lista-sep ux13-registro__lista-sep--1" aria-hidden="true" />
      <span className="ux13-registro__lista-sep ux13-registro__lista-sep--2" aria-hidden="true" />
      <span className="ux13-registro__lista-sep ux13-registro__lista-sep--3" aria-hidden="true" />
      <span className="ux13-registro__scroll" aria-hidden="true" />
    </section>
  )
}

function TipoSolicitud() {
  return (
    <section className="ux13-registro__card ux13-registro__card--tipo" aria-label="Tipo de solicitud">
      <Seccion>Tipo de Solicitud</Seccion>

      <div className="ux13-registro__tipos" role="radiogroup" aria-label="Tipo de solicitud">
        {TIPOS_SOLICITUD.map((tipo, indice) => (
          <label
            key={tipo.titulo}
            className={`ux13-registro__tipo${indice === 0 ? ' ux13-registro__tipo--activa' : ''}`}
          >
            <input
              type="radio"
              name="tipo-solicitud"
              className="ux13-registro__radio"
              defaultChecked={indice === 0}
            />
            <span className="ux13-registro__tipo-texto">
              <span className="ux13-registro__tipo-titulo">{tipo.titulo}</span>
              <span className="ux13-registro__tipo-desc">{tipo.descripcion}</span>
            </span>
          </label>
        ))}
      </div>
    </section>
  )
}

function InformacionGeneral() {
  return (
    <section className="ux13-registro__card ux13-registro__card--info" aria-label="Información general">
      <Seccion>Información General</Seccion>

      <span className="ux13-registro__etiqueta ux13-registro__etiqueta--tipo-especifico">
        Tipo específico
      </span>
      <button
        type="button"
        className="ux13-registro__select ux13-registro__select--tipo-especifico"
        aria-label="Tipo específico: Vacaciones"
      >
        <span>Vacaciones</span>
        <Icono nombre="expand_more" />
      </button>

      <span className="ux13-registro__etiqueta ux13-registro__etiqueta--modalidad">Modalidad</span>
      <button
        type="button"
        className="ux13-registro__select ux13-registro__select--modalidad"
        aria-label="Modalidad: Día Completo"
      >
        <span>Día Completo</span>
        <Icono nombre="expand_more" />
      </button>

      <span className="ux13-registro__etiqueta ux13-registro__etiqueta--fechas">Fechas</span>
      <div className="ux13-registro__fechas">
        <span className="ux13-registro__fecha">
          <span>Vie, 20nov</span>
          <Icono nombre="chevron_left" />
          <Icono nombre="chevron_right" />
        </span>
        <span className="ux13-registro__fecha-divisor" aria-hidden="true" />
        <span className="ux13-registro__fecha">
          <span>Mar, 24nov</span>
          <Icono nombre="chevron_left" />
          <Icono nombre="chevron_right" />
        </span>
      </div>

      <span className="ux13-registro__etiqueta ux13-registro__etiqueta--area">Área</span>
      <button
        type="button"
        className="ux13-registro__select ux13-registro__select--area"
        aria-label="Área: Operaciones"
      >
        <span>Operaciones</span>
        <Icono nombre="expand_more" />
      </button>

      <div className="ux13-registro__aviso">
        <Alerta />
        <span className="ux13-registro__aviso-texto">
          Tu solicitud abarca 7 días calendaria del 20 al 24 de noviembre del 2026
        </span>
      </div>
    </section>
  )
}

function SustentoDocumental() {
  return (
    <section className="ux13-registro__card ux13-registro__card--sustento" aria-label="Sustento documental">
      <Seccion>Sustento Documental</Seccion>

      <button
        type="button"
        className="ux13-registro__dropzone"
        aria-label="Adjuntar sustento documental"
      >
        <Nube />
        <span className="ux13-registro__drop-texto">
          Arrastra tus archivos aquí o{' '}
          <span className="ux13-registro__drop-enlace">selecciona</span>
        </span>
        <span className="ux13-registro__drop-formatos">
          Formatos permitidos: PDF, JPG, PNG (Max 1MB)
        </span>
      </button>

      {SUSTENTOS.map((sustento, indice) => (
        <div
          key={sustento.archivo}
          className={`ux13-registro__archivo ux13-registro__archivo--${indice + 1}`}
        >
          {sustento.tipo === 'pdf' ? <IconoPdf /> : <IconoPng />}
          <span className="ux13-registro__archivo-datos">
            <span className="ux13-registro__archivo-nombre">{sustento.archivo}</span>
            <span className="ux13-registro__archivo-peso">{sustento.peso}</span>
          </span>
          <button
            type="button"
            className="ux13-registro__archivo-quitar"
            aria-label={`Quitar ${sustento.archivo}`}
          >
            <Aspa />
          </button>
        </div>
      ))}
    </section>
  )
}

function ImpactoObservaciones() {
  return (
    <section
      className="ux13-registro__card ux13-registro__card--impacto"
      aria-label="Impacto y observaciones"
    >
      <Seccion>Impacto en asistencia y planilla</Seccion>

      <div className="ux13-registro__impacto">
        <Calendario />
        <span className="ux13-registro__impacto-dato ux13-registro__impacto-dato--dias">
          <span className="ux13-registro__impacto-etiqueta">Días de ausencia</span>
          <span className="ux13-registro__impacto-valor">7 DÍAS</span>
        </span>
        <span className="ux13-registro__impacto-sep" aria-hidden="true" />
        <Documento />
        <span className="ux13-registro__impacto-dato ux13-registro__impacto-dato--planilla">
          <span className="ux13-registro__impacto-etiqueta">Impacto en planilla</span>
          <span className="ux13-registro__pill">Sin Descuento</span>
        </span>
      </div>

      <Seccion clase="ux13-registro__seccion--obs">
        Observaciones <span className="ux13-registro__opcional">(opcional)</span>
      </Seccion>

      <div className="ux13-registro__obs-caja">
        <p className="ux13-registro__obs-texto">
          Las vacaciones fueron consultadas personalmente con el encargado del almacén
          previamente.
        </p>
        <span className="ux13-registro__obs-contador">60/200</span>
      </div>
    </section>
  )
}

function Acciones() {
  return (
    <div className="ux13-registro__acciones">
      <button
        type="button"
        className="ux13-registro__btn ux13-registro__btn--cancelar"
      >
        Cancelar
      </button>
      <button type="button" className="ux13-registro__btn ux13-registro__btn--borrador">
        <Icono nombre="save" />
        Guardar Borrador
      </button>
      <button type="button" className="ux13-registro__btn ux13-registro__btn--continuar">
        Continuar
        <Icono nombre="chevron_right" />
      </button>
    </div>
  )
}

function Hero() {
  return (
    <header className="ux13-registro__hero">
      <p className="ux02-breadcrumb ux13-breadcrumb">
        <span className="ux02-breadcrumb__activo">R.R.H.H</span>
        <span className="ux02-breadcrumb__sep">/</span>
        <span>Colaborades</span>
      </p>

      <div className="ux13-titulo-fila">
        <h1 className="ux13-titulo">Solicitud de Licencia</h1>
        <p className="ux13-subtitulo">
          Formaliza el ingreso del candidato seleccionado y conviértelo en colaborador activo.
        </p>
      </div>

      <button type="button" className="ux13-registro__volver">
        <Icono nombre="chevron_left" />
        Volver a Asistencia
      </button>
    </header>
  )
}

export function RegistroLicencia() {
  return (
    <div className="ux02-lienzo ux13-lienzo ux13-registro">
      <Cabecera />
      <Navegacion activo="Asistencia" submenu={false} chevronActivo={false} />
      <div className="ux02-main">
        <div className="ux02-columna ux13-registro__columna">
          <Hero />
          <Stepper />
          <div className="ux13-registro__cuerpo">
            <SeleccionColaborador />
            <div className="ux13-registro__col-med">
              <TipoSolicitud />
              <InformacionGeneral />
            </div>
            <div className="ux13-registro__col-der">
              <SustentoDocumental />
              <ImpactoObservaciones />
            </div>
            <Acciones />
          </div>
        </div>
        <PanelLateral iconoAcciones="edit" iconoAccesos={null} iconoEventos="expand_more" />
      </div>
      <Pie />
    </div>
  )
}
