import { Cabecera, Icono, Navegacion, PanelLateral, Pie } from '../ux02/Cromo'
import {
  ESTADISTICAS,
  FILAS_LICENCIAS,
  FILTROS_LICENCIAS,
  PAGINAS,
  TABS_LICENCIAS,
  type EstadoSolicitud,
} from './datos'

const ESTADOS: Record<EstadoSolicitud, string> = {
  Subsanación: 'ux13-estado--subsanacion',
  Aprobada: 'ux13-estado--aprobada',
  Registrada: 'ux13-estado--registrada',
  Rechazada: 'ux13-estado--rechazada',
}

function Casilla() {
  return <span className="ux13-casilla" aria-hidden="true" />
}

function Avatar() {
  return (
    <span className="ux13-avatar" aria-hidden="true">
      <svg viewBox="0 0 34 34" focusable="false">
        <circle cx="17" cy="17" r="17" fill="#808080" />
        <circle cx="17" cy="12.5" r="6.2" fill="#fff" />
        <path d="M5.8 29.5c.5-6.1 5.2-9.7 11.2-9.7s10.7 3.6 11.2 9.7z" fill="#fff" />
      </svg>
    </span>
  )
}

function CajaAbierta() {
  return (
    <svg
      className="ux13-stat__svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2.4 7 9 4l3.2 2-6 3.4z" />
      <path d="M12.2 6l3.2-2L21.6 7l-3.8 2.4z" />
      <path d="M6.2 9.4 12.2 6l5.6 3.4-5.6 3.4z" />
      <path d="M6.2 9.4V15l6 5.4 5.6-5.4V9.4" />
      <path d="M12.2 12.8v7.6" />
    </svg>
  )
}

function Check() {
  return (
    <svg
      className="ux13-stat__svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3.8 12.4l5.7 5.7L20.2 7.2" />
    </svg>
  )
}

function Orden() {
  return (
    <svg
      className="ux13-orden-icono"
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
      className="ux13-flecha"
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
    <section className="ux13-encabezado">
      <p className="ux02-breadcrumb ux13-breadcrumb">
        <span className="ux02-breadcrumb__activo">R.R.H.H</span>
        <span className="ux02-breadcrumb__sep">/</span>
        <span>Licencia y Ausencias</span>
      </p>

      <div className="ux13-titulo-fila">
        <h1 className="ux13-titulo">Licencia y Ausencias</h1>
        <p className="ux13-subtitulo">
          Consulta y administra las licencias y ausencias de cada colaborador.
        </p>
      </div>

      <button type="button" className="ux13-btn-registrar">
        <Icono nombre="description" />
        Registrar Solicitud
      </button>
    </section>
  )
}

function Tabs() {
  return (
    <div className="ux13-tabs" role="tablist" aria-label="Tipos de solicitud">
      {TABS_LICENCIAS.map((tab, indice) => (
        <button
          key={tab.etiqueta}
          type="button"
          role="tab"
          aria-selected={indice === 1}
          style={{ width: `${tab.ancho}px` }}
          className={`ux13-tab${indice === 1 ? ' ux13-tab--activa' : ''}`}
        >
          <Icono nombre={tab.icono} />
          {tab.etiqueta}
        </button>
      ))}
    </div>
  )
}

function Filtros() {
  return (
    <section className="ux13-filtros">
      <div className="ux13-filtros__grid">
        <label className="ux13-campo ux13-campo--busqueda">
          <span className="ux13-titulo-filtro">Búsqueda</span>
          <span className="ux13-busqueda">
            <Icono nombre="search" />
            <input
              type="text"
              placeholder="Buscar candidatos por nombre, DNI o puesto..."
              aria-label="Buscar candidatos por nombre, DNI o puesto"
            />
          </span>
        </label>

        {FILTROS_LICENCIAS.map((filtro) => (
          <label key={filtro.etiqueta} className="ux13-campo">
            <span className="ux13-campo__etiqueta">{filtro.etiqueta}</span>
            <button type="button" className="ux13-select">
              <span>{filtro.valor}</span>
              <Icono nombre="expand_more" />
            </button>
          </label>
        ))}
      </div>

      <div className="ux13-filtros__pie">
        <button type="button" className="ux13-enlace">
          <Icono nombre="filter_alt" />
          Más Filtros
        </button>
        <div className="ux13-filtros__acciones">
          <button type="button" className="ux13-btn-limpiar">
            Limpiar Filtros
          </button>
          <button type="button" className="ux13-btn-aplicar">
            <Icono nombre="filter_alt" />
            Aplicar Filtros
          </button>
        </div>
      </div>
    </section>
  )
}

function Estadisticas() {
  return (
    <div className="ux13-stats">
      {ESTADISTICAS.map((stat) => (
        <div key={stat.etiqueta} className="ux13-stat">
          <span className={`ux13-stat__icono ux13-stat__icono--${stat.tono}`}>
            {stat.tono === 'azul' ? (
              <CajaAbierta />
            ) : stat.tono === 'verde' ? (
              <Check />
            ) : (
              <Icono nombre={stat.icono} />
            )}
          </span>
          <div className="ux13-stat__texto">
            <span className="ux13-stat__etiqueta">{stat.etiqueta}</span>
            <span className="ux13-stat__linea">
              <span className="ux13-stat__valor">{stat.valor}</span>
              {'nota' in stat && stat.nota ? (
                <span className="ux13-stat__nota">{stat.nota}</span>
              ) : null}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

function Barra() {
  return (
    <div className="ux13-barra">
      <span className="ux13-ordenar">Ordenar por:</span>
      <button type="button" className="ux13-chip-orden">
        <Icono nombre="arrow_downward" />
        Últimos registrados
      </button>

      <div className="ux13-barra__derecha">
        <button type="button" className="ux13-boton-icono" aria-label="Capas">
          <Icono nombre="layers" />
        </button>
        <button type="button" className="ux13-boton-icono ux13-boton-icono--texto">
          últimos 30 días
        </button>
        <button type="button" className="ux13-boton-icono" aria-label="Vista de documento">
          <Icono nombre="description" />
        </button>
        <button type="button" className="ux13-boton-icono" aria-label="Descargar">
          <Icono nombre="download" />
        </button>
        <button type="button" className="ux13-boton-icono" aria-label="Ajustar vista">
          <Icono nombre="tune" />
        </button>
      </div>
    </div>
  )
}

function Tabla() {
  return (
    <section className="ux13-tabla" role="table" aria-label="Licencias y ausencias">
      <div className="ux13-tabla__fila ux13-tabla__cabecera" role="row">
        <div role="columnheader" className="ux13-th ux13-th--colaborador">
          <Casilla />
          <span className="ux13-th__rotulo">
            Colaborador
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux13-th">
          <span className="ux13-th__rotulo">
            Tipo de Solicitud
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux13-th">
          <span className="ux13-th__rotulo ux13-th__rotulo--dos-lineas">
            <span>
              Fecha
              <br />
              Inicio
            </span>
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux13-th">
          <span className="ux13-th__rotulo ux13-th__rotulo--dos-lineas">
            <span>
              Fecha
              <br />
              Término
            </span>
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux13-th">
          <span className="ux13-th__rotulo">
            Duración
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux13-th">
          <span className="ux13-th__rotulo">
            Goce
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux13-th">
          <span className="ux13-th__rotulo">
            Estado
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux13-th">
          <span className="ux13-th__rotulo">
            Impacto
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux13-th">
          <span className="ux13-th__rotulo">
            Sustento
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux13-th ux13-th--acciones" aria-label="Acciones" />
      </div>

      <div className="ux13-tabla__cuerpo">
        {FILAS_LICENCIAS.map((fila, indice) => (
          <div
            key={`${fila.colaborador}-${fila.tipo}-${indice}`}
            className="ux13-tabla__fila ux13-fila"
            role="row"
          >
            <div className="ux13-celda-colaborador" role="cell">
              <Casilla />
              <Avatar />
              <span className="ux13-datos">
                <span className="ux13-nombre">{fila.colaborador}</span>
                <span className="ux13-cargo">{fila.cargo}</span>
              </span>
            </div>
            <div className="ux13-celda--gris" role="cell">{fila.tipo}</div>
            <div className="ux13-celda--gris" role="cell">{fila.fechaInicio}</div>
            <div className="ux13-celda--gris" role="cell">{fila.fechaTermino}</div>
            <div className="ux13-celda--gris" role="cell">{fila.duracion}</div>
            <div role="cell">
              <span
                className={`ux13-goce${fila.goce === 'Sin Goce' ? ' ux13-goce--sin' : ''}`}
              >
                {fila.goce}
              </span>
            </div>
            <div role="cell">
              <span className={`ux13-estado ${ESTADOS[fila.estado]}`}>{fila.estado}</span>
            </div>
            <div className="ux13-celda--gris" role="cell">{fila.impacto}</div>
            <div role="cell">
              {fila.sustento ? (
                <button type="button" className="ux13-sustento">
                  {fila.sustento}
                </button>
              ) : (
                <span className="ux13-sustento--vacio" aria-label="Sin sustento">—</span>
              )}
            </div>
            <div className="ux13-celda--acciones" role="cell">
              <button
                type="button"
                className="ux13-menu"
                aria-label={`Acciones de ${fila.colaborador}`}
              >
                <Icono nombre="more_vert" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Paginacion() {
  return (
    <div className="ux13-paginacion">
      <span className="ux13-paginacion__texto">Mostrando 10 de 246</span>
      <button type="button" className="ux13-pagina" aria-label="Página anterior">
        <Flecha sentido="izquierda" />
      </button>
      {PAGINAS.map((pagina) => (
        <button
          key={pagina}
          type="button"
          className={`ux13-pagina${pagina === 1 ? ' ux13-pagina--activa' : ''}`}
          aria-current={pagina === 1 ? 'page' : undefined}
        >
          {pagina}
        </button>
      ))}
      <button type="button" className="ux13-pagina" aria-label="Página siguiente">
        <Flecha sentido="derecha" />
      </button>
      <button type="button" className="ux13-pagina" aria-label="Última página">
        <Flecha sentido="derecha" />
      </button>
    </div>
  )
}

export function BandejaLicencias() {
  return (
    <div className="ux02-lienzo ux13-lienzo">
      <Cabecera />
      <Navegacion
        activo="Asistencia"
        chevronActivo={false}
        submenuContenido={
          <>
            <button type="button">Licencia y Ausencias</button>
            <button type="button">Registrar</button>
          </>
        }
      />
      <div className="ux02-main">
        <div className="ux02-columna">
          <Encabezado />
          <Tabs />
          <Filtros />
          <div className="ux13-panel">
            <Estadisticas />
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
