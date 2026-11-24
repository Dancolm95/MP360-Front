import type { ReactNode } from 'react'
import { Cabecera, PanelLateral, Pie, Navegacion } from '../ux02/Cromo'
import {
  FILAS_DATOS_PERSONALES,
  FILAS_PAGO,
  FILAS_TALLAS,
  FOTO_COLABORADOR,
  PASOS,
  RESUMEN_DATOS,
  type CampoAlta,
} from './datos'

const CLASE_ANCHO: Record<NonNullable<CampoAlta['ancho']>, string> = {
  normal: '',
  medio: ' ux07-datos__campo--medio',
  correo: ' ux07-datos__campo--correo',
  direccion: ' ux07-datos__campo--direccion',
  cuenta: ' ux07-datos__campo--cuenta',
}

function Avatar() {
  return (
    <span className="ux07-avatar" aria-hidden="true">
      <svg viewBox="0 0 46 46" focusable="false">
        <circle cx="23" cy="23" r="23" fill="#808080" />
        <circle cx="23" cy="17" r="8" fill="#f7fbf9" />
        <path d="M8 40c.7-8.2 6.8-13 15-13s14.3 4.8 15 13z" fill="#f7fbf9" />
      </svg>
    </span>
  )
}

function TituloSeccion({ children, clase }: { children: ReactNode; clase?: string }) {
  return (
    <div className={`ux07-seccion__cabecera${clase ? ` ${clase}` : ''}`}>
      <span className="ux07-seccion__marca" aria-hidden="true" />
      <h2 className="ux07-seccion__titulo">{children}</h2>
    </div>
  )
}

function Campo({ campo }: { campo: CampoAlta }) {
  const clase = campo.ancho ? CLASE_ANCHO[campo.ancho] : ''
  return (
    <label className={`ux07-campo ux07-datos__campo${clase}`}>
      <span className="ux07-campo__etiqueta">{campo.etiqueta}</span>
      {campo.control === 'select' ? (
        <button type="button" className="ux07-select ux07-datos__selector">
          <span>{campo.valor}</span>
          <span className="ux02-i" aria-hidden="true">
            expand_more
          </span>
        </button>
      ) : (
        <span className="ux07-input ux07-datos__entrada">{campo.valor}</span>
      )}
    </label>
  )
}

function Filas({
  filas,
  clase,
}: {
  filas: readonly (readonly CampoAlta[])[]
  clase?: string
}) {
  return (
    <div className={`ux07-datos__filas${clase ? ` ${clase}` : ''}`}>
      {filas.map((fila, indice) => (
        <div key={indice} className="ux07-datos__fila">
          {fila.map((campo) => (
            <Campo key={campo.etiqueta} campo={campo} />
          ))}
        </div>
      ))}
    </div>
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
    <div className="ux07-pasos ux07-pasos--datos" role="list" aria-label="Etapas del alta">
      {PASOS.map((paso, indice) => {
        const completado = indice < 4
        return (
          <div
            key={paso}
            role="listitem"
            aria-current={indice === 1 ? 'step' : undefined}
            className={`ux07-paso${completado ? ' ux07-paso--activo' : ''}`}
          >
            <span className="ux07-paso__numero">{indice + 1}</span>
            <span className="ux07-paso__etiqueta">{paso}</span>
          </div>
        )
      })}
      <span className="ux07-pasos__conector ux07-pasos__conector--activo" aria-hidden="true" />
      <span className="ux07-pasos__conector ux07-pasos__conector--activo" aria-hidden="true" />
      <span className="ux07-pasos__conector ux07-pasos__conector--activo" aria-hidden="true" />
      <span className="ux07-pasos__conector" aria-hidden="true" />
      <span className="ux07-pasos__activo ux07-pasos__activo--datos" aria-hidden="true" />
    </div>
  )
}

function Resumen() {
  return (
    <div className="ux07-datos__resumen">
      <div className="ux07-datos__persona">
        <Avatar />
        <div className="ux07-persona">
          <span className="ux07-persona__nombre">{RESUMEN_DATOS.nombre}</span>
          <span className="ux07-persona__dato">Nac: {RESUMEN_DATOS.nacionalidad}</span>
          <span className="ux07-persona__dato">DNI: {RESUMEN_DATOS.dni}</span>
        </div>
      </div>

      <span className="ux07-badge-verde ux07-datos__badge">{RESUMEN_DATOS.badge}</span>

      <div className="ux07-datos__resumen-datos">
        <div className="ux07-datos__resumen-dato">
          <span className="ux07-datos__resumen-etiqueta">Puesto</span>
          <span className="ux07-datos__resumen-valor">{RESUMEN_DATOS.puesto}</span>
        </div>
        <div className="ux07-datos__resumen-dato">
          <span className="ux07-datos__resumen-etiqueta">Requerimiento</span>
          <span className="ux07-datos__resumen-valor">{RESUMEN_DATOS.requerimiento}</span>
        </div>
        <div className="ux07-datos__resumen-dato">
          <span className="ux07-datos__resumen-etiqueta">Origen</span>
          <span className="ux07-datos__resumen-valor ux07-datos__resumen-valor--azul">
            {RESUMEN_DATOS.origen}
          </span>
        </div>
      </div>
    </div>
  )
}

function Foto() {
  return (
    <div className="ux07-datos__foto">
      <span className="ux07-datos__foto-muestra" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path
            d="M4 8.5a2 2 0 0 1 2-2h1.1l1-1.5a1 1 0 0 1 .8-.4h6.2a1 1 0 0 1 .8.4l1 1.5H18a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="13" r="3.1" fill="none" stroke="currentColor" strokeWidth="1.9" />
        </svg>
      </span>
      <span className="ux07-datos__foto-datos">
        <span className="ux07-datos__foto-titulo">{FOTO_COLABORADOR.titulo}</span>
        <span className="ux07-datos__foto-accion">{FOTO_COLABORADOR.accion}</span>
        <span className="ux07-datos__foto-formato">{FOTO_COLABORADOR.formato}</span>
      </span>
    </div>
  )
}

function Acciones() {
  return (
    <div className="ux07-acciones ux07-datos__acciones">
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
        Continuar
        <span className="ux02-i" aria-hidden="true">
          chevron_right
        </span>
      </button>
    </div>
  )
}

export function AltaDatos() {
  return (
    <div className="ux02-lienzo ux07-lienzo">
      <Cabecera />
      <Navegacion activo="Colaboradores" submenu={false} chevronActivo={false} />
      <div className="ux02-main">
        <div className="ux02-columna ux07-columna">
          <Encabezado />
          <Stepper />
          <div className="ux07-columnas ux07-datos">
            <section className="ux07-card ux07-datos__personales" aria-label="Datos personales">
              <Resumen />
              <TituloSeccion clase="ux07-datos__titulo">Datos Personales</TituloSeccion>
              <Filas filas={FILAS_DATOS_PERSONALES} clase="ux07-datos__filas--personales" />
            </section>

            <div className="ux07-derecha">
              <section className="ux07-card ux07-datos__pago" aria-label="Métodos de pago">
                <TituloSeccion>Metodos de pago</TituloSeccion>
                <Filas filas={FILAS_PAGO} />
              </section>

              <section className="ux07-card ux07-datos__adicional" aria-label="Información adicional">
                <TituloSeccion>Información Adicional</TituloSeccion>
                <Foto />
                <Filas filas={FILAS_TALLAS} clase="ux07-datos__tallas" />
              </section>

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
