import { Cabecera, Icono, Navegacion, PanelLateral, Pie } from '../ux02/Cromo'
import {
  FILAS_ONBOARDING,
  FILTROS_ONBOARDING,
  INDICADORES_ONBOARDING,
  PAGINAS_ONBOARDING,
} from './datos'

export type PestanaOnboarding = 'En curso' | 'Sin Onboarding' | 'Finalizados'
export type EstadoOnboarding = 'en-curso' | 'sin-onboarding'

const PESTANAS: readonly PestanaOnboarding[] = ['En curso', 'Sin Onboarding', 'Finalizados']
const PESTANA_POR_ESTADO: Record<EstadoOnboarding, PestanaOnboarding> = {
  'en-curso': 'En curso',
  'sin-onboarding': 'Sin Onboarding',
}
const COLUMNAS = 10

function Casilla() {
  return <span className="ux09-casilla" aria-hidden="true" />
}

function Avatar() {
  return (
    <span className="ux09-avatar" aria-hidden="true">
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
      className="ux09-orden-icono"
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
      className="ux09-flecha"
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

function Encabezado() {
  return (
    <section className="ux09-encabezado">
      <p className="ux02-breadcrumb ux09-breadcrumb">
        <span className="ux02-breadcrumb__activo">R.R.H.H</span>
        <span className="ux02-breadcrumb__sep">/</span>
        <span>Onboarding</span>
      </p>

      <div className="ux09-titulo-fila">
        <h1 className="ux09-titulo">Onborading</h1>
        <p className="ux09-subtitulo">Gestión de Onboarding de Colaboradores</p>
      </div>

      <button type="button" className="ux09-btn-crear">
        <Icono nombre="post_add" />
        Crear Proceso
      </button>
    </section>
  )
}

function Filtros() {
  return (
    <section className="ux09-filtros">
      <div className="ux09-filtros__grid">
        <label className="ux09-campo ux09-campo--busqueda">
          <span className="ux09-campo__etiqueta ux09-campo__etiqueta--busqueda">
            Búsqueda
          </span>
          <span className="ux09-busqueda">
            <Icono nombre="search" />
            <input
              type="text"
              placeholder="Buscar candidatos por nombre, DNI o puesto..."
              aria-label="Buscar candidatos por nombre, DNI o puesto"
            />
          </span>
        </label>

        {FILTROS_ONBOARDING.map((filtro) => (
          <label key={filtro.etiqueta} className="ux09-campo">
            <span className="ux09-campo__etiqueta">{filtro.etiqueta}</span>
            <button type="button" className="ux09-select">
              <span>{filtro.valor}</span>
              <Icono nombre="expand_more" />
            </button>
          </label>
        ))}
      </div>

      <div className="ux09-filtros__pie">
        <button type="button" className="ux09-enlace">
          <Icono nombre="filter_alt" />
          Más Filtros
        </button>
        <div className="ux09-filtros__acciones">
          <button type="button" className="ux09-btn-limpiar">
            Limpiar Filtros
          </button>
          <button type="button" className="ux09-btn-aplicar">
            <Icono nombre="filter_alt" />
            Aplicar Filtros
          </button>
        </div>
      </div>
    </section>
  )
}

function Pestanas({ activa }: { activa: PestanaOnboarding }) {
  return (
    <div className="ux09-tabs__grupo" role="group" aria-label="Estado del onboarding">
      {PESTANAS.map((pestana) => (
        <button
          key={pestana}
          type="button"
          className={`ux09-tab${pestana === activa ? ' ux09-tab--activa' : ''}`}
          aria-pressed={pestana === activa}
        >
          {pestana}
        </button>
      ))}
    </div>
  )
}

function Subtabs() {
  return (
    <div className="ux09-sin__subtabs" role="group" aria-label="Vistas de onboarding">
      <button
        type="button"
        className="ux09-sin__sub ux09-sin__sub--activa"
        aria-pressed="true"
      >
        <Icono nombre="home" />
        Colaboradores
      </button>
      <button type="button" className="ux09-sin__sub" aria-pressed="false">
        <Icono nombre="edit_document" />
        Colaboradores sin Ficha
      </button>
      <button type="button" className="ux09-sin__sub" aria-pressed="false">
        <Icono nombre="business_center" />
        Tareas
      </button>
      <button type="button" className="ux09-sin__sub" aria-pressed="false">
        <Icono nombre="person" />
        Analítica
      </button>
    </div>
  )
}

function Indicadores({ estrecho }: { estrecho: boolean }) {
  return (
    <div className={`ux09-stats${estrecho ? ' ux09-sin__stats' : ''}`}>
      {INDICADORES_ONBOARDING.map((indicador) => (
        <div key={indicador.etiqueta} className="ux09-stat">
          <span className="ux09-stat__etiqueta">{indicador.etiqueta}</span>
          <span className="ux09-stat__valor">{indicador.valor}</span>
        </div>
      ))}
    </div>
  )
}

function Barra() {
  return (
    <div className="ux09-barra">
      <span className="ux09-ordenar">Ordenar por:</span>
      <button type="button" className="ux09-chip-orden">
        <Icono nombre="arrow_downward" />
        Últimos registrados
      </button>

      <div className="ux09-barra__derecha">
        <button type="button" className="ux09-boton-icono" aria-label="Capas">
          <Icono nombre="layers" />
        </button>
        <button type="button" className="ux09-boton-icono ux09-boton-fecha">
          últimos 30 días
        </button>
        <button type="button" className="ux09-boton-icono" aria-label="Vista de documento">
          <Icono nombre="description" />
        </button>
        <button type="button" className="ux09-boton-icono" aria-label="Descargar">
          <Icono nombre="download" />
        </button>
        <button type="button" className="ux09-boton-icono" aria-label="Ajustar vista">
          <Icono nombre="tune" />
        </button>
      </div>
    </div>
  )
}

function Tabla() {
  return (
    <section className="ux09-tabla" role="table" aria-label="Bandeja de onboarding">
      <div className="ux09-tabla__fila ux09-tabla__cabecera" role="row">
        <div role="columnheader" className="ux09-th ux09-th--candidato">
          <Casilla />
          <span className="ux09-th__rotulo">
            Candidato
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux09-th">
          <span className="ux09-th__rotulo ux09-th__rotulo--doble">
            <span>
              ID de
              <br />
              Proceso
            </span>
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux09-th">
          <span className="ux09-th__rotulo">
            Documento
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux09-th">
          <span className="ux09-th__rotulo">
            Email
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux09-th">
          <span className="ux09-th__rotulo">
            Cargo
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux09-th">
          <span className="ux09-th__rotulo">
            Área
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux09-th">
          <span className="ux09-th__rotulo">
            Sede
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux09-th">
          <span className="ux09-th__rotulo ux09-th__rotulo--doble">
            <span>
              Inicio de
              <br />
              Onboarding
            </span>
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux09-th">
          <span className="ux09-th__rotulo">
            Estado
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux09-th ux09-th--acciones" aria-label="Acciones" />
      </div>

      <div className="ux09-tabla__cuerpo">
        {FILAS_ONBOARDING.map((fila) => (
          <div key={fila.idProceso} className="ux09-tabla__fila ux09-fila" role="row">
            <div className="ux09-celda--candidato" role="cell">
              <Casilla />
              <Avatar />
              <span className="ux09-nombre">{fila.candidato}</span>
            </div>
            <div className="ux09-celda--gris" role="cell">
              {fila.idProceso}
            </div>
            <div role="cell">
              <span className="ux09-documento">
                <span className="ux09-documento__tipo">{fila.documento}</span>
                <span className="ux09-documento__numero">{fila.documentoNumero}</span>
              </span>
            </div>
            <div className="ux09-celda--fuerte" role="cell">
              {fila.email}
            </div>
            <div className="ux09-celda--fuerte" role="cell">
              {fila.cargo}
            </div>
            <div className="ux09-celda--fuerte" role="cell">
              {fila.area}
            </div>
            <div className="ux09-celda--fuerte" role="cell">
              {fila.sede}
            </div>
            <div className="ux09-celda--gris" role="cell">
              {fila.inicio}
            </div>
            <div className="ux09-celda--estado" role="cell">
              <span className="ux09-estado">{fila.estado}</span>
            </div>
            <div className="ux09-celda--acciones" role="cell">
              <button
                type="button"
                className="ux09-menu"
                aria-label={`Acciones de ${fila.candidato}`}
              >
                <Icono nombre="more_vert" />
              </button>
            </div>
          </div>
        ))}

        {[0, 1, 2, 3].map((vacia) => (
          <div key={`vacia-${vacia}`} className="ux09-tabla__fila ux09-fila" aria-hidden="true">
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
    <div className="ux09-paginacion">
      <span className="ux09-paginacion__texto">Mostrando 10 de 246</span>
      <button type="button" className="ux09-pagina" aria-label="Página anterior">
        <Flecha sentido="izquierda" />
      </button>
      {PAGINAS_ONBOARDING.map((pagina) => (
        <button
          key={pagina}
          type="button"
          className={`ux09-pagina${pagina === 1 ? ' ux09-pagina--activa' : ''}`}
          aria-current={pagina === 1 ? 'page' : undefined}
        >
          {pagina}
        </button>
      ))}
      <button type="button" className="ux09-pagina" aria-label="Página siguiente">
        <Flecha sentido="derecha" />
      </button>
      <button type="button" className="ux09-pagina" aria-label="Última página">
        <Flecha sentido="derecha" />
      </button>
    </div>
  )
}

export function BandejaOnboarding({
  estado = 'en-curso',
}: {
  estado?: EstadoOnboarding
} = {}) {
  const sinOnboarding = estado === 'sin-onboarding'

  return (
    <div className={`ux02-lienzo ux09-lienzo${sinOnboarding ? ' ux09-sin' : ''}`}>
      <Cabecera />
      <Navegacion activo="Offboarding" submenu={false} chevronActivo={false} />
      <div className="ux02-main">
        <div className="ux02-columna">
          <Encabezado />
          <Filtros />
          <div className="ux09-panel">
            <div className="ux09-tabs">
              <Pestanas activa={PESTANA_POR_ESTADO[estado]} />
              {sinOnboarding ? <Subtabs /> : null}
            </div>
            <Indicadores estrecho={sinOnboarding} />
            <Barra />
            <Tabla />
          </div>
          <Paginacion />
        </div>
        <PanelLateral iconoAcciones="edit" iconoAccesos={null} iconoEventos="expand_more" />
      </div>
      <Pie />
    </div>
  )
}
