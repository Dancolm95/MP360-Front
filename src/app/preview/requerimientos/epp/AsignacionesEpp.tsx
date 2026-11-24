import { Cabecera, Icono, Navegacion, PanelLateral, Pie } from '../ux02/Cromo'
import {
  ESTADISTICAS_EPP,
  FILAS_EPP,
  FILTROS_EPP,
  PAGINAS_EPP,
  type IconoEstadistica,
} from './datos'

export function Casilla() {
  return <span className="ux11-casilla" aria-hidden="true" />
}

export function Avatar() {
  return (
    <span className="ux11-avatar" aria-hidden="true">
      <svg viewBox="0 0 34 34" focusable="false">
        <circle cx="17" cy="17" r="17" fill="#808080" />
        <circle cx="17" cy="12.5" r="6.2" fill="#fff" />
        <path d="M5.8 29.5c.5-6.1 5.2-9.7 11.2-9.7s10.7 3.6 11.2 9.7z" fill="#fff" />
      </svg>
    </span>
  )
}

export function Orden() {
  return (
    <svg
      className="ux11-orden-icono"
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

export function Flecha({ sentido }: { sentido: 'izquierda' | 'derecha' }) {
  return (
    <svg
      className="ux11-flecha"
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

export function IconoEstadistica({ tipo }: { tipo: IconoEstadistica }) {
  if (tipo === 'caja') {
    return (
      <svg
        className="ux11-stat__svg"
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

  if (tipo === 'persona') {
    return (
      <svg
        className="ux11-stat__svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="12" cy="7.6" r="3.2" />
        <path d="M5.6 20.4c.5-4.5 3-6.9 6.4-6.9s5.9 2.4 6.4 6.9" />
      </svg>
    )
  }

  if (tipo === 'alerta') {
    return (
      <svg
        className="ux11-stat__svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="12" cy="12" r="8.4" />
        <path d="M12 7.5v5.4" />
        <circle cx="12" cy="16.4" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    )
  }

  return (
    <svg
      className="ux11-stat__svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 4.1 20.4 19a1.35 1.35 0 0 1-1.2 2H4.8A1.35 1.35 0 0 1 3.6 19Z" />
      <path d="M12 9.1v4.4" />
      <circle cx="12" cy="16.9" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

function Encabezado() {
  return (
    <section className="ux11-encabezado">
      <p className="ux02-breadcrumb ux11-breadcrumb">
        <span className="ux02-breadcrumb__activo">R.R.H.H</span>
        <span className="ux02-breadcrumb__sep">/</span>
        <span>EPP y equipos</span>
      </p>

      <div className="ux11-titulo-fila">
        <h1 className="ux11-titulo">EPP y Equipos</h1>
        <p className="ux11-subtitulo">
          Consulta y administra los implementos asignados a cada colaborador
        </p>
      </div>

      <button type="button" className="ux11-btn-entrega">
        <Icono nombre="verified_user" />
        Registrar Entrega
      </button>
    </section>
  )
}

function Filtros() {
  return (
    <section className="ux11-filtros">
      <div className="ux11-filtros__grid">
        <label className="ux11-campo ux11-campo--busqueda">
          <span className="ux11-campo__etiqueta ux11-campo__etiqueta--busqueda">
            Búsqueda
          </span>
          <span className="ux11-busqueda">
            <Icono nombre="search" />
            <input
              type="text"
              placeholder="Buscar candidatos por nombre, DNI o puesto..."
              aria-label="Buscar candidatos por nombre, DNI o puesto"
            />
          </span>
        </label>

        {FILTROS_EPP.map((filtro) => (
          <label key={filtro.etiqueta} className="ux11-campo">
            <span className="ux11-campo__etiqueta">{filtro.etiqueta}</span>
            <button type="button" className="ux11-select">
              <span>{filtro.valor}</span>
              <Icono nombre="expand_more" />
            </button>
          </label>
        ))}
      </div>

      <div className="ux11-filtros__pie">
        <button type="button" className="ux11-enlace">
          <Icono nombre="filter_alt" />
          Más Filtros
        </button>
        <div className="ux11-filtros__acciones">
          <button type="button" className="ux11-btn-limpiar">
            Limpiar Filtros
          </button>
          <button type="button" className="ux11-btn-aplicar">
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
    <div className="ux11-stats">
      {ESTADISTICAS_EPP.map((stat) => (
        <div key={stat.etiqueta} className="ux11-stat">
          <span className={`ux11-stat__icono ux11-stat__icono--${stat.tono}`}>
            <IconoEstadistica tipo={stat.icono} />
          </span>
          <div className="ux11-stat__texto">
            <span className="ux11-stat__etiqueta">{stat.etiqueta}</span>
            <span className="ux11-stat__valor">{stat.valor}</span>
            <span className="ux11-stat__nota">{stat.nota}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export function Barra() {
  return (
    <div className="ux11-barra">
      <span className="ux11-ordenar">Ordenar por:</span>
      <button type="button" className="ux11-chip-orden">
        <Icono nombre="arrow_downward" />
        Últimos registrados
      </button>

      <div className="ux11-barra__derecha">
        <button type="button" className="ux11-boton-icono" aria-label="Capas">
          <Icono nombre="layers" />
        </button>
        <button type="button" className="ux11-boton-icono ux11-boton-fecha">
          últimos 30 días
        </button>
        <button type="button" className="ux11-boton-icono" aria-label="Vista de documento">
          <Icono nombre="description" />
        </button>
        <button type="button" className="ux11-boton-icono" aria-label="Descargar">
          <Icono nombre="download" />
        </button>
        <button type="button" className="ux11-boton-icono" aria-label="Ajustar vista">
          <Icono nombre="tune" />
        </button>
      </div>
    </div>
  )
}

function Tabla() {
  return (
    <section className="ux11-tabla" role="table" aria-label="Asignaciones de EPP y equipos">
      <div className="ux11-tabla__fila ux11-tabla__cabecera" role="row">
        <div role="columnheader" className="ux11-th ux11-th--colaborador">
          <Casilla />
          <span className="ux11-th__rotulo">
            Colaborador
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux11-th">
          <span className="ux11-th__rotulo">
            Implemento
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux11-th">
          <span className="ux11-th__rotulo">
            Categoría
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux11-th">
          <span className="ux11-th__rotulo">
            Talla
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux11-th">
          <span className="ux11-th__rotulo">
            Cantidad
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux11-th">
          <span className="ux11-th__rotulo">
            Fecha de Entrega
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux11-th">
          <span className="ux11-th__rotulo">
            Responsable
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux11-th">
          <span className="ux11-th__rotulo">
            Estado
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux11-th ux11-th--acciones" aria-label="Acciones" />
      </div>

      <div className="ux11-tabla__cuerpo">
        {FILAS_EPP.map((fila, indice) => (
          <div
            key={`${fila.colaborador}-${fila.implemento}-${indice}`}
            className="ux11-tabla__fila ux11-fila"
            role="row"
          >
            <div className="ux11-celda-colaborador" role="cell">
              <Casilla />
              <Avatar />
              <span className="ux11-datos">
                <span className="ux11-nombre">{fila.colaborador}</span>
                <span className="ux11-cargo">{fila.cargo}</span>
              </span>
            </div>
            <div className="ux11-celda--gris" role="cell">{fila.implemento}</div>
            <div className="ux11-celda--gris" role="cell">{fila.categoria}</div>
            <div className="ux11-celda--gris" role="cell">{fila.talla}</div>
            <div className="ux11-celda--gris" role="cell">{fila.cantidad}</div>
            <div className="ux11-celda--gris" role="cell">{fila.fechaEntrega}</div>
            <div className="ux11-celda--gris" role="cell">{fila.responsable}</div>
            <div role="cell">
              <span className={`ux11-estado ux11-estado--${fila.tono}`}>{fila.estado}</span>
            </div>
            <div className="ux11-celda--acciones" role="cell">
              <button
                type="button"
                className="ux11-menu"
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

export function Paginacion() {
  return (
    <div className="ux11-paginacion">
      <span className="ux11-paginacion__texto">Mostrando 10 de 246</span>
      <button type="button" className="ux11-pagina" aria-label="Página anterior">
        <Flecha sentido="izquierda" />
      </button>
      {PAGINAS_EPP.map((pagina) => (
        <button
          key={pagina}
          type="button"
          className={`ux11-pagina${pagina === 1 ? ' ux11-pagina--activa' : ''}`}
          aria-current={pagina === 1 ? 'page' : undefined}
        >
          {pagina}
        </button>
      ))}
      <button type="button" className="ux11-pagina" aria-label="Página siguiente">
        <Flecha sentido="derecha" />
      </button>
      <button type="button" className="ux11-pagina" aria-label="Última página">
        <Flecha sentido="derecha" />
      </button>
    </div>
  )
}

export function AsignacionesEpp() {
  return (
    <div className="ux02-lienzo ux11-lienzo">
      <Cabecera />
      <Navegacion
        activo="EPP y Equipos"
        chevronActivo={false}
        submenuContenido={
          <>
            <button type="button">Detalle</button>
            <button type="button">Devolución y Reposición</button>
          </>
        }
      />
      <div className="ux02-main">
        <div className="ux02-columna">
          <Encabezado />
          <Filtros />
          <div className="ux11-panel">
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
