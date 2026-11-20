import type { ReactNode } from 'react'
import { Cabecera, Icono, Navegacion, PanelLateral, Pie } from '../ux02/Cromo'
import {
  FILAS_OFFBOARDING,
  FILTROS_OFFBOARDING,
  INDICADORES_OFFBOARDING,
  PAGINAS_OFFBOARDING,
} from './datos'
import type { EstadoOffboarding } from './datos'

const PESTANAS = ['En proceso', 'Pendiente de regularización', 'Cerrados'] as const
const COLUMNAS = 9
const VARIANTE_ESTADO: Record<EstadoOffboarding, string> = {
  Cerrado: 'ux16-estado--cerrado',
  Pendiente: 'ux16-estado--pendiente',
  'En proceso': 'ux16-estado--proceso',
}

function Casilla() {
  return <span className="ux16-casilla" aria-hidden="true" />
}

function Avatar() {
  return (
    <span className="ux16-avatar" aria-hidden="true">
      <svg viewBox="0 0 34 34" focusable="false">
        <circle cx="17" cy="17" r="17" fill="#808080" />
        <circle cx="17" cy="12.5" r="6.2" fill="#fff" />
        <path d="M5.8 29.5c.5-6.1 5.2-9.7 11.2-9.7s10.7 3.6 11.2 9.7z" fill="#fff" />
      </svg>
    </span>
  )
}

function Orden() {
  return (
    <svg
      className="ux16-orden-icono"
      viewBox="0 0 10 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M1.6 4.6 5 1.4l3.4 3.2" />
      <path d="M1.6 9.4 5 12.6l3.4-3.2" />
    </svg>
  )
}

function Flecha({ sentido }: { sentido: 'izquierda' | 'derecha' }) {
  return (
    <svg
      className="ux16-flecha"
      viewBox="0 0 8 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={sentido === 'izquierda' ? 'M6.6 1 1.2 7l5.4 6' : 'M1.4 1l5.4 6-5.4 6'} />
    </svg>
  )
}

export function MarcoOffboarding({
  children,
  breadcrumbFin = 'Offboarding',
  titulo = 'Offboarding',
  subtitulo = 'Gestión de procesos de cese de colaboradores',
  accionEtiqueta = 'Iniciar Offboarding',
  accionIcono = 'post_add',
  clase,
}: {
  children: ReactNode
  breadcrumbFin?: string
  titulo?: string
  subtitulo?: string
  accionEtiqueta?: string
  accionIcono?: string
  clase?: string
}) {
  return (
    <div className={`ux02-lienzo ux16-lienzo${clase ? ` ${clase}` : ''}`}>
      <Cabecera />
      <Navegacion activo="Offboarding" submenu={false} chevronActivo={false} />
      <div className="ux02-main">
        <div className="ux02-columna">
          <section className="ux16-encabezado">
            <p className="ux02-breadcrumb ux16-breadcrumb">
              <span className="ux02-breadcrumb__activo">R.R.H.H</span>
              <span className="ux02-breadcrumb__sep">/</span>
              <span>{breadcrumbFin}</span>
            </p>

            <div className="ux16-titulo-fila">
              <h1 className="ux16-titulo">{titulo}</h1>
              <p className="ux16-subtitulo">{subtitulo}</p>
            </div>

            <button type="button" className="ux16-btn-accion">
              <Icono nombre={accionIcono} />
              {accionEtiqueta}
            </button>
          </section>

          {children}
        </div>

        <PanelLateral iconoAcciones="edit" iconoAccesos={null} iconoEventos="expand_more" />
      </div>
      <Pie />
    </div>
  )
}

function Filtros() {
  return (
    <section className="ux16-filtros">
      <div className="ux16-filtros__grid">
        <label className="ux16-campo ux16-campo--busqueda">
          <span className="ux16-campo__etiqueta ux16-campo__etiqueta--busqueda">Búsqueda</span>
          <span className="ux16-busqueda">
            <Icono nombre="search" />
            <input
              type="text"
              placeholder="Buscar candidatos por nombre, DNI o puesto..."
              aria-label="Buscar candidatos por nombre, DNI o puesto"
            />
          </span>
        </label>

        {FILTROS_OFFBOARDING.map((filtro) => (
          <label key={filtro.etiqueta} className="ux16-campo">
            <span className="ux16-campo__etiqueta">{filtro.etiqueta}</span>
            <button type="button" className="ux16-select">
              <span>{filtro.valor}</span>
              <Icono nombre="expand_more" />
            </button>
          </label>
        ))}
      </div>

      <div className="ux16-filtros__pie">
        <button type="button" className="ux16-enlace">
          <Icono nombre="filter_alt" />
          Más Filtros
        </button>
        <div className="ux16-filtros__acciones">
          <button type="button" className="ux16-btn-limpiar">
            Limpiar Filtros
          </button>
          <button type="button" className="ux16-btn-aplicar">
            <Icono nombre="filter_alt" />
            Aplicar Filtros
          </button>
        </div>
      </div>
    </section>
  )
}

function Pestanas() {
  return (
    <div className="ux16-tabs" role="group" aria-label="Estado del offboarding">
      {PESTANAS.map((pestana, indice) => (
        <button
          key={pestana}
          type="button"
          className={`ux16-tab${indice === 0 ? ' ux16-tab--activa' : ''}`}
          aria-pressed={indice === 0}
        >
          {pestana}
        </button>
      ))}
    </div>
  )
}

function Indicadores() {
  return (
    <div className="ux16-stats">
      {INDICADORES_OFFBOARDING.map((indicador) => (
        <div key={indicador.etiqueta} className="ux16-stat">
          <span className="ux16-stat__etiqueta">{indicador.etiqueta}</span>
          <span className="ux16-stat__valor">{indicador.valor}</span>
        </div>
      ))}
    </div>
  )
}

function Barra() {
  return (
    <div className="ux16-barra">
      <span className="ux16-ordenar">Ordenar por:</span>
      <button type="button" className="ux16-chip-orden">
        <Icono nombre="arrow_downward" />
        Últimos registrados
      </button>

      <div className="ux16-barra__derecha">
        <button type="button" className="ux16-boton-icono" aria-label="Capas">
          <Icono nombre="layers" />
        </button>
        <button type="button" className="ux16-boton-icono ux16-boton-fecha">
          últimos 30 días
        </button>
        <button type="button" className="ux16-boton-icono" aria-label="Vista de documento">
          <Icono nombre="description" />
        </button>
        <button type="button" className="ux16-boton-icono" aria-label="Descargar">
          <Icono nombre="download" />
        </button>
        <button type="button" className="ux16-boton-icono" aria-label="Ajustar vista">
          <Icono nombre="tune" />
        </button>
      </div>
    </div>
  )
}

function Tabla() {
  return (
    <section className="ux16-tabla" role="table" aria-label="Bandeja de offboarding">
      <div className="ux16-tabla__fila ux16-tabla__cabecera" role="row">
        <div role="columnheader" className="ux16-th ux16-th--candidato">
          <Casilla />
          <span className="ux16-th__rotulo">
            Candidato
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux16-th">
          <span className="ux16-th__rotulo ux16-th__rotulo--doble">
            <span>
              ID de
              <br />
              Proceso
            </span>
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux16-th">
          <span className="ux16-th__rotulo">
            Causal de cese
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux16-th">
          <span className="ux16-th__rotulo">
            Fecha de cese
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux16-th">
          <span className="ux16-th__rotulo">
            Empresa
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux16-th">
          <span className="ux16-th__rotulo">
            Área
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux16-th">
          <span className="ux16-th__rotulo">
            Responsable
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux16-th">
          <span className="ux16-th__rotulo">
            Estado
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux16-th ux16-th--acciones" aria-label="Acciones" />
      </div>

      <div className="ux16-tabla__cuerpo">
        {FILAS_OFFBOARDING.map((fila, indice) => (
          <div key={`${fila.idProceso}-${indice}`} className="ux16-tabla__fila ux16-fila" role="row">
            <div className="ux16-celda--candidato" role="cell">
              <Casilla />
              <Avatar />
              <span className="ux16-nombre">{fila.candidato}</span>
            </div>
            <div className="ux16-celda--gris" role="cell">
              {fila.idProceso}
            </div>
            <div className="ux16-celda--gris" role="cell">
              {fila.causal}
            </div>
            <div className="ux16-celda--fuerte" role="cell">
              {fila.fechaCese}
            </div>
            <div className="ux16-celda--fuerte" role="cell">
              {fila.empresa}
            </div>
            <div className="ux16-celda--fuerte" role="cell">
              {fila.area}
            </div>
            <div className="ux16-celda--gris" role="cell">
              {fila.responsable}
            </div>
            <div className="ux16-celda--estado" role="cell">
              <span className={`ux16-estado ${VARIANTE_ESTADO[fila.estado]}`}>{fila.estado}</span>
            </div>
            <div className="ux16-celda--acciones" role="cell">
              <button
                type="button"
                className="ux16-menu"
                aria-label={`Acciones de ${fila.candidato}`}
              >
                <Icono nombre="more_vert" />
              </button>
            </div>
          </div>
        ))}

        {[0, 1].map((vacia) => (
          <div key={`vacia-${vacia}`} className="ux16-tabla__fila ux16-fila" aria-hidden="true">
            {Array.from({ length: COLUMNAS }, (_, columna) => (
              <div key={columna} />
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

function Paginacion() {
  return (
    <div className="ux16-paginacion">
      <span className="ux16-paginacion__texto">Mostrando 10 de 246</span>
      <button type="button" className="ux16-pagina" aria-label="Página anterior">
        <Flecha sentido="izquierda" />
      </button>
      {PAGINAS_OFFBOARDING.map((pagina) => (
        <button
          key={pagina}
          type="button"
          className={`ux16-pagina${pagina === 1 ? ' ux16-pagina--activa' : ''}`}
          aria-current={pagina === 1 ? 'page' : undefined}
        >
          {pagina}
        </button>
      ))}
      <button type="button" className="ux16-pagina" aria-label="Página siguiente">
        <Flecha sentido="derecha" />
      </button>
      <button type="button" className="ux16-pagina" aria-label="Última página">
        <Flecha sentido="derecha" />
      </button>
    </div>
  )
}

export function BandejaOffboarding() {
  return (
    <MarcoOffboarding>
      <Filtros />
      <div className="ux16-panel">
        <Pestanas />
        <Indicadores />
        <Barra />
        <Tabla />
      </div>
      <Paginacion />
    </MarcoOffboarding>
  )
}
