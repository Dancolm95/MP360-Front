import { Cabecera, Icono, Navegacion, PanelLateral, Pie } from '../ux02/Cromo'
import { CANDIDATOS, FILTROS_CANDIDATOS } from './datos'

function Casilla() {
  return <span className="ux05-casilla" aria-hidden="true" />
}

function Avatar() {
  return (
    <span className="ux05-avatar" aria-hidden="true">
      <svg viewBox="0 0 34 34" focusable="false">
        <circle cx="17" cy="17" r="17" fill="#808080" />
        <circle cx="17" cy="12.5" r="6.2" fill="#fff" />
        <path d="M5.8 29.5c.5-6.1 5.2-9.7 11.2-9.7s10.7 3.6 11.2 9.7z" fill="#fff" />
      </svg>
    </span>
  )
}

function Encabezado() {
  return (
    <section className="ux02-encabezado">
      <p className="ux02-breadcrumb ux05-breadcrumb">
        <span className="ux02-breadcrumb__activo">R.R.H.H</span>
        <span className="ux02-breadcrumb__sep">/</span>
        <span>Reclutamiento</span>
      </p>

      <div className="ux02-encabezado__fila">
        <h1 className="ux02-titulo ux05-titulo">Filtrar postulante</h1>
        <p className="ux02-subtitulo ux05-subtitulo">Consulta a detalle por un postulante</p>
      </div>

      <button type="button" className="ux02-btn-primario ux05-btn-primario">
        <Icono nombre="note_add" />
        Agregar postulante
      </button>
    </section>
  )
}

function Filtros() {
  return (
    <section className="ux02-filtros ux05-filtros">
      <div className="ux05-filtros__grid">
        <label className="ux02-campo ux05-campo--busqueda">
          <span className="ux05-titulo-filtro">Búsqueda</span>
          <span className="ux05-busqueda">
            <Icono nombre="search" />
            <input
              type="text"
              placeholder="Buscar candidatos por nombre, DNI o puesto..."
              aria-label="Buscar candidatos por nombre, DNI o puesto"
            />
          </span>
        </label>

        {FILTROS_CANDIDATOS.map((filtro) => (
          <label key={filtro.etiqueta} className="ux02-campo">
            <span className="ux02-campo__etiqueta">{filtro.etiqueta}</span>
            <button type="button" className="ux02-select">
              <span>{filtro.valor}</span>
              <Icono nombre="expand_more" />
            </button>
          </label>
        ))}
      </div>

      <div className="ux02-filtros__pie ux05-filtros__pie">
        <button type="button" className="ux02-enlace">
          <Icono nombre="filter_alt" />
          Más Filtros
        </button>
        <div className="ux02-filtros__acciones">
          <button type="button" className="ux02-btn-chico ux05-btn-aplicar">
            <Icono nombre="filter_alt" />
            Aplicar Filtros
          </button>
          <button type="button" className="ux02-btn-chico ux02-btn-chico--fantasma ux05-btn-limpiar">
            <Icono nombre="undo" />
            Limpiar
          </button>
        </div>
      </div>
    </section>
  )
}

const COLUMNAS = [
  { clave: 'candidato', etiqueta: 'Candidato', orden: true },
  { clave: 'documento', etiqueta: <>Documento<br />de Identidad</>, orden: true },
  { clave: 'puesto', etiqueta: 'Puesto', orden: true },
  { clave: 'aptitud', etiqueta: <>Aptitud para<br />Requerimiento</>, orden: true },
  { clave: 'estado', etiqueta: 'Estado', orden: true },
  { clave: 'actualizacion', etiqueta: <>Última<br />Actualización</>, orden: true },
  { clave: 'requerimiento', etiqueta: 'Requerimiento', orden: true },
  { clave: 'detalle', etiqueta: 'Detalle', orden: false },
] as const

function Lista() {
  return (
    <>
      <section className="ux02-lista ux05-lista">
        <div className="ux02-lista__barra ux05-lista__barra">
          <span className="ux02-ordenar">Ordenar por:</span>
          <button type="button" className="ux02-chip ux02-chip--activo ux05-chip-orden">
            <Icono nombre="arrow_downward" />
            Últimos registrados
          </button>
          <button type="button" className="ux02-chip ux05-chip-area">
            <Icono nombre="arrow_downward" />
            <span>Área</span>
          </button>

          <div className="ux02-barra__derecha ux05-barra__derecha">
            <button type="button" className="ux02-boton-icono" aria-label="Capas">
              <Icono nombre="layers" />
            </button>
            <button type="button" className="ux02-boton-icono ux05-boton-fecha">
              últimos 30 días
            </button>
            <button type="button" className="ux02-boton-icono" aria-label="Vista de documento">
              <Icono nombre="description" />
            </button>
            <button type="button" className="ux02-boton-icono" aria-label="Descargar">
              <Icono nombre="download" />
            </button>
            <button type="button" className="ux02-boton-icono" aria-label="Ajustar vista">
              <Icono nombre="tune" />
            </button>
          </div>
        </div>

        <div className="ux02-tabla ux05-tabla" role="table" aria-label="Candidatos">
          <div className="ux02-tabla__fila ux02-tabla__cabecera ux05-tabla__cabecera" role="row">
            <div role="columnheader" className="ux05-th--candidato">
              <Casilla />
              <span className="ux05-th__rotulo">
                Candidato
                <Icono nombre="unfold_more" />
              </span>
            </div>
            {COLUMNAS.slice(1).map((columna) => (
              <div
                key={columna.clave}
                role="columnheader"
                className={columna.clave === 'detalle' ? 'ux02-celda--candidatos' : undefined}
              >
                <span className="ux05-th__rotulo">
                  {columna.etiqueta}
                  {columna.orden ? <Icono nombre="unfold_more" /> : null}
                </span>
              </div>
            ))}
            <div role="columnheader" aria-label="Acciones" />
          </div>

          <div className="ux02-tabla__cuerpo ux05-tabla__cuerpo">
            {CANDIDATOS.map((candidato) => (
              <div key={`${candidato.nombre}-${candidato.requerimiento}`} className="ux02-tabla__fila" role="row">
                <div className="ux05-celda-candidato" role="cell">
                  <Casilla />
                  <Avatar />
                  <span className="ux05-datos">
                    <span className="ux05-nombre">{candidato.nombre}</span>
                    <span className="ux05-nacionalidad">{candidato.nacionalidad}</span>
                  </span>
                </div>
                <div className="ux05-celda--documento" role="cell">{candidato.documento}</div>
                <div className="ux05-celda--puesto" role="cell">{candidato.puesto}</div>
                <div role="cell">
                  <span className="ux05-aptitud">{candidato.aptitud}</span>
                </div>
                <div role="cell">
                  <span className="ux05-estado" data-estado={candidato.estado}>
                    {candidato.estado}
                  </span>
                </div>
                <div className="ux05-celda--actualizacion" role="cell">{candidato.actualizacion}</div>
                <div className="ux05-celda--requerimiento" role="cell">{candidato.requerimiento}</div>
                <div role="cell">
                  <button type="button" className="ux02-enlace-tabla">Ver Detalle</button>
                </div>
                <div role="cell">
                  <button type="button" className="ux02-menu-puntos" aria-label={`Acciones de ${candidato.nombre}`}>
                    <Icono nombre="more_vert" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="ux02-paginacion ux05-paginacion">
        <span className="ux02-paginacion__texto">Mostrando 5 de 5</span>
        <button type="button" className="ux02-pagina" aria-label="Página anterior">
          <Icono nombre="chevron_left" />
        </button>
        <button type="button" className="ux02-pagina ux02-pagina--activa">1</button>
        <button type="button" className="ux02-pagina" aria-label="Página siguiente">
          <Icono nombre="chevron_right" />
        </button>
      </div>
    </>
  )
}

export function BandejaCandidatos() {
  return (
    <div className="ux02-lienzo ux05-lienzo">
      <span className="ux05-marca-arte" aria-hidden="true">UX-05</span>
      <Cabecera />
      <Navegacion
        activo="Reclutamiento"
        chevronActivo={false}
        submenuContenido={
          <button type="button">Agregar postulante</button>
        }
      />
      <div className="ux02-main">
        <div className="ux02-columna">
          <Encabezado />
          <Filtros />
          <hr className="ux02-divisor-seccion ux05-divisor-seccion" />
          <div className="ux02-subseccion ux05-subseccion">
            <p className="ux02-breadcrumb ux02-breadcrumb--detalle ux05-sub-breadcrumb">
              <span className="ux02-breadcrumb__activo">R.R.H.H</span>
              <span className="ux02-breadcrumb__sep">/</span>
              <span>Reclutamiento</span>
              <span className="ux02-breadcrumb__sep">/</span>
              <span className="ux02-breadcrumb__fin">Detalle</span>
            </p>
            <h2 className="ux02-titulo ux05-titulo">Requerimientos</h2>
          </div>
          <Lista />
        </div>
        <PanelLateral iconoAcciones="edit" iconoAccesos={null} iconoEventos="expand_more" />
      </div>
      <Pie />
    </div>
  )
}
