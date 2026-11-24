import type { ReactNode } from 'react'
import { Cabecera, Icono, Navegacion, PanelLateral, Pie } from '../ux02/Cromo'
import {
  CANDIDATOS,
  CANDIDATO_ENCONTRADO,
  PASOS,
  REQUERIMIENTO,
  TIPOS_INGRESO,
} from './datos'

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

function TituloSeccion({ children }: { children: ReactNode }) {
  return (
    <div className="ux07-seccion__cabecera">
      <span className="ux07-seccion__marca" aria-hidden="true" />
      <h2 className="ux07-seccion__titulo">{children}</h2>
    </div>
  )
}

function Campo({
  etiqueta,
  children,
  clase,
}: {
  etiqueta: string
  children: ReactNode
  clase?: string
}) {
  return (
    <label className={`ux07-campo${clase ? ` ${clase}` : ''}`}>
      <span className="ux07-campo__etiqueta">{etiqueta}</span>
      {children}
    </label>
  )
}

function Selector({ valor }: { valor: string }) {
  return (
    <button type="button" className="ux07-select">
      <span>{valor}</span>
      <Icono nombre="expand_more" />
    </button>
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
          aria-current={indice === 0 ? 'step' : undefined}
          className={`ux07-paso${indice === 0 ? ' ux07-paso--activo' : ''}`}
        >
          <span className="ux07-paso__numero">{indice + 1}</span>
          <span className="ux07-paso__etiqueta">{paso}</span>
        </div>
      ))}
      <span className="ux07-pasos__conector" aria-hidden="true" />
      <span className="ux07-pasos__conector" aria-hidden="true" />
      <span className="ux07-pasos__conector" aria-hidden="true" />
      <span className="ux07-pasos__conector" aria-hidden="true" />
      <span className="ux07-pasos__activo" aria-hidden="true" />
    </div>
  )
}

function SeleccionColaborador() {
  return (
    <section className="ux07-card ux07-seleccion" aria-label="Selección de colaborador">
      <TituloSeccion>Selec. Colaborador</TituloSeccion>

      <div className="ux07-campos-colaborador">
        <Campo etiqueta="Detalle" clase="ux07-campo--detalle">
          <span className="ux07-input ux07-input--busqueda">
            <Icono nombre="search" />
            <input
              type="text"
              placeholder="Buscar por nombre, DNI...."
              aria-label="Buscar por nombre, DNI"
            />
          </span>
        </Campo>

        <Campo etiqueta="Tipo de documento" clase="ux07-campo--documento">
          <Selector valor="Todos" />
        </Campo>

        <Campo etiqueta="Número de documento" clase="ux07-campo--numero">
          <span className="ux07-input" />
        </Campo>
      </div>

      <div className="ux07-encontrado">
        <div className="ux07-encontrado__fila">
          <Avatar />
          <div className="ux07-persona">
            <span className="ux07-persona__nombre">{CANDIDATO_ENCONTRADO.nombre}</span>
            <span className="ux07-persona__dato">Nac: {CANDIDATO_ENCONTRADO.nacionalidad}</span>
            <span className="ux07-persona__dato">DNI: {CANDIDATO_ENCONTRADO.dni}</span>
          </div>
          <span className="ux07-badge-verde">Postulante encontrado</span>
        </div>

        <div className="ux07-encontrado__datos">
          <div className="ux07-encontrado__dato">
            <span className="ux07-encontrado__etiqueta">Correo</span>
            <span className="ux07-encontrado__valor">{CANDIDATO_ENCONTRADO.correo}</span>
          </div>
          <div className="ux07-encontrado__dato">
            <span className="ux07-encontrado__etiqueta">Número</span>
            <span className="ux07-encontrado__valor">{CANDIDATO_ENCONTRADO.numero}</span>
          </div>
          <div className="ux07-encontrado__dato">
            <span className="ux07-encontrado__etiqueta">Estado en proceso</span>
            <span className="ux07-encontrado__valor ux07-encontrado__valor--azul">
              {CANDIDATO_ENCONTRADO.estado}
            </span>
          </div>
        </div>
      </div>

      <p className="ux07-lista__titulo">Colaboradores encontrados</p>

      <div className="ux07-lista">
        {CANDIDATOS.map((candidato, indice) => {
          const seleccionado = indice === 0
          return (
            <div key={indice} className="ux07-candidato">
              <Avatar />
              <div className="ux07-candidato__persona">
                <span className="ux07-persona__nombre">{candidato.nombre}</span>
                <span className="ux07-persona__dato">Nac: {candidato.nacionalidad}</span>
                <span className="ux07-persona__dato">DNI: {candidato.dni}</span>
              </div>
              <div className="ux07-candidato__datos">
                <span className="ux07-candidato__etiqueta">Datos</span>
                <span className="ux07-candidato__valor">{candidato.telefono}</span>
                <span className="ux07-candidato__valor">{candidato.correo}</span>
              </div>
              <button
                type="button"
                className={seleccionado ? 'ux07-btn-seleccionado' : 'ux07-btn-seleccionar'}
              >
                {seleccionado ? 'Seleccionado' : 'Seleccionar'}
              </button>
            </div>
          )
        })}
      </div>

      <span className="ux07-scroll" aria-hidden="true" />
    </section>
  )
}

function SeleccionRequerimiento() {
  return (
    <section className="ux07-card ux07-requerimiento" aria-label="Selección de requerimiento">
      <TituloSeccion>Selec. requerimiento</TituloSeccion>

      <div className="ux07-campos-requerimiento">
        <Campo etiqueta="Requerimiento">
          <Selector valor={REQUERIMIENTO.referencia} />
        </Campo>
        <Campo etiqueta="Puesto">
          <Selector valor={REQUERIMIENTO.puesto} />
        </Campo>
        <Campo etiqueta="Área">
          <Selector valor={REQUERIMIENTO.area} />
        </Campo>
        <Campo etiqueta="Sede">
          <Selector valor={REQUERIMIENTO.sede} />
        </Campo>
      </div>

      <div className="ux07-rq">
        <span className="ux07-rq__icono">
          <Icono nombre="edit_document" />
        </span>
        <div className="ux07-rq__datos">
          <span className="ux07-rq__codigo">{REQUERIMIENTO.codigo}</span>
          <span className="ux07-rq__detalle">{REQUERIMIENTO.puestoDetalle}</span>
          <span className="ux07-rq__detalle">{REQUERIMIENTO.sedeDetalle}</span>
        </div>
        <button type="button" className="ux07-rq__boton">
          RQ encontrado
        </button>
        <span className="ux07-rq__divisor" aria-hidden="true" />
        <p className="ux07-rq__nota">
          Se requieren validar
          <br />
          datos en las siguientes etapas
        </p>
      </div>
    </section>
  )
}

function TipoIngreso() {
  return (
    <section className="ux07-card ux07-ingreso" aria-label="Tipo de ingreso">
      <TituloSeccion>Tipo de Ingreso</TituloSeccion>

      <div className="ux07-opciones">
        {TIPOS_INGRESO.map((tipo, indice) => (
          <label
            key={tipo.titulo}
            className={`ux07-opcion${indice === 0 ? ' ux07-opcion--activa' : ''}`}
          >
            <input
              type="radio"
              name="tipo-ingreso"
              className="ux07-opcion__radio"
              defaultChecked={indice === 0}
            />
            <span className="ux07-opcion__texto">
              <span className="ux07-opcion__titulo">{tipo.titulo}</span>
              <span className="ux07-opcion__descripcion">{tipo.descripcion}</span>
            </span>
          </label>
        ))}
      </div>
    </section>
  )
}

function Acciones() {
  return (
    <div className="ux07-acciones">
      <button type="button" className="ux07-btn ux07-btn--cancelar">
        Cancelar
      </button>
      <button type="button" className="ux07-btn ux07-btn--borrador">
        <Icono nombre="save" />
        Guardar Borrador
      </button>
      <button type="button" className="ux07-btn ux07-btn--continuar">
        Continuar
        <Icono nombre="chevron_right" />
      </button>
    </div>
  )
}

export function AltaSeleccion() {
  return (
    <div className="ux02-lienzo ux07-lienzo">
      <Cabecera />
      <Navegacion
        activo="Colaboradores"
        chevronActivo={false}
        submenuContenido={
          <>
            <button type="button">Alta a Colaborador</button>
            <button type="button">Colaboradores</button>
          </>
        }
      />
      <div className="ux02-main">
        <div className="ux02-columna ux07-columna">
          <Encabezado />
          <Stepper />
          <div className="ux07-columnas">
            <SeleccionColaborador />
            <div className="ux07-derecha">
              <SeleccionRequerimiento />
              <TipoIngreso />
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
