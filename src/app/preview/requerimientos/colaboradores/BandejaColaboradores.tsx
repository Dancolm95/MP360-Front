import { Cabecera, Icono, Navegacion, PanelLateral, Pie } from '../ux02/Cromo'
import { COLABORADORES, FILTROS_COLABORADORES, PAGINAS } from './datos'

const COLUMNAS = [
  { clave: 'candidato', etiqueta: 'Candidato' },
  { clave: 'codigo', etiqueta: 'Código' },
  { clave: 'documento', etiqueta: 'Documento' },
  { clave: 'cargo', etiqueta: 'Cargo' },
  { clave: 'gerencia', etiqueta: 'Gerencia' },
  { clave: 'area', etiqueta: 'Área' },
  { clave: 'sede', etiqueta: 'Sede' },
  { clave: 'fechaIngreso', etiqueta: <>Fecha de<br />Ingreso</> },
  { clave: 'sueldo', etiqueta: 'Sueldo Neto' },
  { clave: 'estado', etiqueta: 'Estado' },
] as const

function Casilla() {
  return <span className="ux08-casilla" aria-hidden="true" />
}

function Avatar() {
  return (
    <span className="ux08-avatar" aria-hidden="true">
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
    <section className="ux02-encabezado ux08-encabezado">
      <p className="ux02-breadcrumb ux08-breadcrumb">
        <span className="ux02-breadcrumb__activo">R.R.H.H</span>
        <span className="ux02-breadcrumb__sep">/</span>
        <span>Colaboradores</span>
      </p>

      <div className="ux02-encabezado__fila ux08-titulo-fila">
        <h1 className="ux02-titulo ux08-titulo">Colaboradores</h1>
        <p className="ux02-subtitulo ux08-subtitulo">
          Consulta, crea y administrado la información de los colaboradores
        </p>
      </div>

      <button type="button" className="ux02-btn-primario ux08-btn-crear">
        <Icono nombre="note_add" />
        Crear Colaborador
      </button>
    </section>
  )
}

function Filtros() {
  return (
    <section className="ux02-filtros ux08-filtros">
      <div className="ux08-filtros__grid">
        <label className="ux02-campo ux08-campo--busqueda">
          <span className="ux08-titulo-filtro">Búsqueda</span>
          <span className="ux08-busqueda">
            <Icono nombre="search" />
            <input
              type="text"
              placeholder="Buscar candidatos por nombre, DNI o puesto..."
              aria-label="Buscar candidatos por nombre, DNI o puesto"
            />
          </span>
        </label>

        {FILTROS_COLABORADORES.map((filtro) => (
          <label key={filtro.etiqueta} className="ux02-campo">
            <span className="ux02-campo__etiqueta">{filtro.etiqueta}</span>
            <button type="button" className="ux02-select ux08-select">
              <span>{filtro.valor}</span>
              <Icono nombre="expand_more" />
            </button>
          </label>
        ))}
      </div>

      <div className="ux02-filtros__pie ux08-filtros__pie">
        <button type="button" className="ux02-enlace ux08-enlace">
          <Icono nombre="filter_alt" />
          Más Filtros
        </button>
        <div className="ux02-filtros__acciones ux08-filtros__acciones">
          <button type="button" className="ux02-btn-chico ux02-btn-chico--fantasma ux08-btn-limpiar">
            Limpiar Filtros
          </button>
          <button type="button" className="ux02-btn-chico ux08-btn-aplicar">
            <Icono nombre="filter_alt" />
            Aplicar Filtros
          </button>
        </div>
      </div>
    </section>
  )
}

function Barra() {
  return (
    <div className="ux08-barra">
      <span className="ux02-ordenar ux08-ordenar">Ordenar por:</span>
      <button type="button" className="ux02-chip ux02-chip--activo ux08-chip-orden">
        <Icono nombre="arrow_downward" />
        Últimos registrados
      </button>
      <button type="button" className="ux02-chip ux08-chip-area">
        <Icono nombre="arrow_downward" />
        <span>Área</span>
      </button>

      <div className="ux02-barra__derecha ux08-barra__derecha">
        <button type="button" className="ux02-boton-icono" aria-label="Capas">
          <Icono nombre="layers" />
        </button>
        <button type="button" className="ux02-boton-icono ux02-boton-icono--texto ux08-boton-fecha">
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
  )
}

function Tabla() {
  return (
    <section className="ux08-tarjeta">
      <div className="ux08-tabla" role="table" aria-label="Colaboradores">
        <div className="ux08-tabla__fila ux08-tabla__cabecera" role="row">
          <div role="columnheader" className="ux08-th ux08-th--candidato">
            <Casilla />
            <span className="ux08-th__rotulo">
              Candidato
              <Icono nombre="unfold_more" />
            </span>
          </div>
          {COLUMNAS.slice(1).map((columna) => (
            <div key={columna.clave} role="columnheader" className="ux08-th">
              <span className="ux08-th__rotulo">
                {columna.etiqueta}
                <Icono nombre="unfold_more" />
              </span>
            </div>
          ))}
          <div role="columnheader" className="ux08-th ux08-th--acciones" aria-label="Acciones" />
        </div>

        <div className="ux08-tabla__cuerpo">
          {COLABORADORES.map((colaborador, indice) => (
            <div key={`${colaborador.codigo}-${indice}`} className="ux08-tabla__fila ux08-fila" role="row">
              <div className="ux08-celda-candidato" role="cell">
                <Casilla />
                <Avatar />
                <span className="ux08-datos">
                  <span className="ux08-nombre">{colaborador.nombre}</span>
                  <span className="ux08-cargo-sub">{colaborador.cargo}</span>
                </span>
              </div>
              <div className="ux08-celda--codigo" role="cell">{colaborador.codigo}</div>
              <div className="ux08-celda--documento" role="cell">
                <span className="ux08-documento__tipo">DNI</span>
                <span>{colaborador.dni}</span>
              </div>
              <div className="ux08-celda--cargo" role="cell">
                <span className="ux08-cargo">{colaborador.puesto}</span>
              </div>
              <div className="ux08-celda--fuerte" role="cell">{colaborador.gerencia}</div>
              <div className="ux08-celda--fuerte" role="cell">{colaborador.area}</div>
              <div className="ux08-celda--fuerte" role="cell">{colaborador.sede}</div>
              <div className="ux08-celda--gris" role="cell">{colaborador.fechaIngreso}</div>
              <div className="ux08-celda--gris" role="cell">{colaborador.sueldo}</div>
              <div role="cell">
                <span className="ux08-estado">{colaborador.estado}</span>
              </div>
              <div className="ux08-celda--acciones" role="cell">
                <button
                  type="button"
                  className="ux02-menu-puntos"
                  aria-label={`Acciones de ${colaborador.nombre}`}
                >
                  <Icono nombre="more_vert" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Paginacion() {
  return (
    <div className="ux02-paginacion ux08-paginacion">
      <span className="ux02-paginacion__texto ux08-paginacion__texto">Mostrando 10 de 246</span>
      <button type="button" className="ux02-pagina ux08-pagina ux08-pagina--anterior" aria-label="Página anterior">
        <Icono nombre="chevron_left" />
      </button>
      {PAGINAS.map((pagina) => (
        <button
          key={pagina}
          type="button"
          className={`ux02-pagina ux08-pagina${pagina === 1 ? ' ux08-pagina--activa' : ''}`}
          aria-current={pagina === 1 ? 'page' : undefined}
        >
          {pagina}
        </button>
      ))}
      <button type="button" className="ux02-pagina ux08-pagina" aria-label="Página siguiente">
        <Icono nombre="chevron_right" />
      </button>
      <button type="button" className="ux02-pagina ux08-pagina" aria-label="Última página">
        <Icono nombre="chevron_right" />
      </button>
    </div>
  )
}

export function BandejaColaboradores() {
  return (
    <div className="ux02-lienzo ux08-lienzo">
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
        <div className="ux02-columna">
          <Encabezado />
          <Filtros />
          <Barra />
          <Tabla />
          <Paginacion />
        </div>
        <PanelLateral iconoAcciones="edit" iconoAccesos={null} iconoEventos="expand_more" />
      </div>
      <Pie />
    </div>
  )
}
