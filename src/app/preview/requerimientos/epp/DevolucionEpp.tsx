import { Cabecera, Icono, Navegacion, PanelLateral, Pie } from '../ux02/Cromo'
import {
  Avatar,
  Barra,
  Casilla,
  IconoEstadistica,
  Orden,
  Paginacion,
} from './AsignacionesEpp'
import {
  ESTADISTICAS_DEVOLUCION,
  FILAS_DEVOLUCION,
  FILTROS_DEVOLUCION,
} from './datos'

function Encabezado() {
  return (
    <section className="ux11-encabezado">
      <p className="ux02-breadcrumb ux11-breadcrumb ux11-devolucion__breadcrumb">
        <span className="ux02-breadcrumb__activo">R.R.H.H</span>
        <span className="ux02-breadcrumb__sep">/</span>
        <span>EPP y equipos</span>
        <span className="ux02-breadcrumb__sep">/</span>
        <span>Devolución y Reposición</span>
      </p>

      <div className="ux11-titulo-fila">
        <h1 className="ux11-titulo">Devolución / Reposición de EPP</h1>
        <p className="ux11-subtitulo">
          Consulta y administra los implementos asignados a cada colaborador
        </p>
      </div>

      <button type="button" className="ux11-btn-entrega">
        <Icono nombre="verified_user" />
        Registrar Movimiento
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

        {FILTROS_DEVOLUCION.map((filtro) => (
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
      {ESTADISTICAS_DEVOLUCION.map((stat) => (
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

function Tabla() {
  return (
    <section
      className="ux11-tabla ux11-devolucion__tabla"
      role="table"
      aria-label="Devolución y reposición de EPP"
    >
      <div className="ux11-tabla__fila ux11-tabla__cabecera" role="row">
        <div role="columnheader" className="ux11-th ux11-th--colaborador">
          <Casilla />
          <span className="ux11-th__rotulo">
            Candidato
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux11-th">Tipo de Movimiento</div>
        <div role="columnheader" className="ux11-th">Implemento</div>
        <div role="columnheader" className="ux11-th">Cantidad</div>
        <div role="columnheader" className="ux11-th">Fecha</div>
        <div role="columnheader" className="ux11-th">Motivo</div>
        <div role="columnheader" className="ux11-th">Vida útil estimada</div>
        <div role="columnheader" className="ux11-th">Descuento</div>
        <div role="columnheader" className="ux11-th">Estado</div>
        <div role="columnheader" className="ux11-th ux11-th--acciones" aria-label="Acciones" />
      </div>

      <div className="ux11-tabla__cuerpo">
        {FILAS_DEVOLUCION.map((fila, indice) => (
          <div
            key={`${fila.colaborador}-${fila.tipo}-${indice}`}
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
            <div role="cell">
              <span className={`ux11-devolucion__tipo ux11-devolucion__tipo--${fila.tonoTipo}`}>
                {fila.tipo}
              </span>
            </div>
            <div className="ux11-celda--gris ux11-devolucion__implemento" role="cell">
              {fila.implemento}
            </div>
            <div className="ux11-celda--gris" role="cell">{fila.cantidad}</div>
            <div className="ux11-celda--gris" role="cell">{fila.fecha}</div>
            <div className="ux11-celda--gris ux11-devolucion__motivo" role="cell">
              <span className="ux11-devolucion__motivo-texto">{fila.motivo}</span>
            </div>
            <div className="ux11-celda--gris" role="cell">{fila.vidaUtil}</div>
            <div className="ux11-celda--gris" role="cell">{fila.descuento}</div>
            <div role="cell">
              <span className={`ux11-estado ux11-devolucion__estado--${fila.tonoEstado}`}>
                {fila.estado}
              </span>
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

export function DevolucionEpp() {
  return (
    <div className="ux02-lienzo ux11-lienzo ux11-devolucion">
      <Cabecera />
      <Navegacion activo="EPP y Equipos" submenu={false} chevronActivo={false} />
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
