import type { ReactNode } from 'react'
import { Cabecera, Icono, Navegacion, PanelLateral, Pie } from './Cromo'
import { FILAS, FILTROS } from './datos'

function Encabezado() {
  return (
    <section className="ux02-encabezado">
      <p className="ux02-breadcrumb">
        <span>R.R.H.H</span>
        <span className="ux02-breadcrumb__sep">/</span>
        <span className="ux02-breadcrumb__activo">Requerimientos</span>
      </p>

      <div className="ux02-encabezado__fila">
        <h1 className="ux02-titulo">Bandeja de Requerimientos</h1>
        <p className="ux02-subtitulo">Consulta y seguimiento de requerimientos de Personal</p>
      </div>

      <button type="button" className="ux02-btn-primario">
        <Icono nombre="add" />
        Nuevo Requerimiento
      </button>
    </section>
  )
}

function Filtros() {
  return (
    <section className="ux02-filtros">
      <div className="ux02-filtros__grid">
        {FILTROS.map((filtro) => (
          <label key={filtro.etiqueta} className="ux02-campo">
            <span className="ux02-campo__etiqueta">{filtro.etiqueta}</span>
            <button type="button" className="ux02-select">
              <span>{filtro.valor}</span>
              <Icono nombre="expand_more" />
            </button>
          </label>
        ))}

        <label className="ux02-campo">
          <span className="ux02-campo__etiqueta">Fecha / Periodo</span>
          <button type="button" className="ux02-select ux02-select--fecha">
            <Icono nombre="calendar_today" />
            <span>Selecciona rango</span>
          </button>
        </label>
      </div>

      <div className="ux02-filtros__pie">
        <button type="button" className="ux02-enlace">
          <Icono nombre="add" />
          Más Filtros
        </button>
        <div className="ux02-filtros__acciones">
          <button type="button" className="ux02-btn-chico">
            <Icono nombre="filter_alt" />
            Aplicar Filtros
          </button>
          <button type="button" className="ux02-btn-chico ux02-btn-chico--fantasma">
            Limpiar
          </button>
        </div>
      </div>
    </section>
  )
}

const COLUMNAS: readonly { clave: string; etiqueta: ReactNode; clase?: string }[] = [
  { clave: 'id', etiqueta: 'ID' },
  { clave: 'fecha', etiqueta: 'Fecha de Generación' },
  { clave: 'motivo', etiqueta: 'Motivo' },
  { clave: 'empresa', etiqueta: 'Empresa' },
  { clave: 'puesto', etiqueta: 'Puesto' },
  { clave: 'vacantes', etiqueta: 'Vacantes Solicitadas' },
  { clave: 'pendientes', etiqueta: 'Pendientes' },
  { clave: 'estado', etiqueta: 'Estado' },
  {
    clave: 'objetivo',
    etiqueta: (
      <>
        Fecha
        <br />
        Objetivo
      </>
    ),
  },
  { clave: 'solicitante', etiqueta: 'Solicitante' },
  { clave: 'candidatos', etiqueta: 'Candidatos', clase: 'ux02-celda--candidatos' },
  { clave: 'acciones', etiqueta: null },
]

function Lista() {
  return (
    <>
      <section className="ux02-lista">
        <div className="ux02-lista__barra">
          <span className="ux02-ordenar">Ordenar por:</span>
          <button type="button" className="ux02-chip ux02-chip--activo">
            <Icono nombre="sort" />
            Últimos registrados
          </button>
          <button type="button" className="ux02-chip">
            <span>Área</span>
            <Icono nombre="expand_more" />
          </button>

          <div className="ux02-barra__derecha">
            <button type="button" className="ux02-boton-icono ux02-boton-icono--texto">
              <Icono nombre="calendar_month" />
              últimos 30 días
            </button>
            <button type="button" className="ux02-boton-icono" aria-label="Vista de lista">
              <Icono nombre="view_list" />
            </button>
            <button type="button" className="ux02-boton-icono" aria-label="Vista de cuadrícula">
              <Icono nombre="grid_view" />
            </button>
            <button type="button" className="ux02-boton-icono" aria-label="Capas">
              <Icono nombre="layers" />
            </button>
            <button type="button" className="ux02-boton-icono" aria-label="Imprimir">
              <Icono nombre="print" />
            </button>
          </div>
        </div>

        <div className="ux02-tabla" role="table" aria-label="Requerimientos">
          <div className="ux02-tabla__fila ux02-tabla__cabecera" role="row">
            {COLUMNAS.map((columna) => (
              <div key={columna.clave} role="columnheader" className={columna.clase}>
                {columna.etiqueta ?? <Icono nombre="more_vert" />}
              </div>
            ))}
          </div>

          <div className="ux02-tabla__cuerpo">
            {FILAS.map((fila) => (
              <div key={fila.id} className="ux02-tabla__fila" role="row">
                <div className="ux02-tabla__id" role="cell">{fila.id}</div>
                <div role="cell">{fila.fecha}</div>
                <div role="cell"><span className="ux02-tabla__motivo">{fila.motivo}</span></div>
                <div className="ux02-celda--empresa" role="cell">
                  <span data-empresa={fila.empresa}>{fila.empresa}</span>
                </div>
                <div role="cell"><span className="ux02-tabla__puesto">{fila.puesto}</span></div>
                <div role="cell">{fila.vacantes}</div>
                <div role="cell">{fila.pendientes}</div>
                <div className="ux02-celda--estado" role="cell">
                  <span data-estado={fila.estado}>{fila.estado}</span>
                </div>
                <div className="ux02-celda--fecha" role="cell">
                  <span data-alerta={fila.fechaConAlerta ? 'true' : undefined}>{fila.fechaObjetivo}</span>
                </div>
                <div role="cell"><span className="ux02-tabla__solicitante">{fila.solicitante}</span></div>
                <div className="ux02-celda--candidatos" role="cell">
                  <button type="button" className="ux02-enlace-tabla">Ver Candidatos</button>
                </div>
                <div role="cell">
                  <button type="button" className="ux02-menu-puntos" aria-label={`Acciones de ${fila.id}`}>
                    <Icono nombre="more_vert" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="ux02-paginacion">
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

export function PaginaBandeja() {
  return (
    <>
      <Cabecera />
      <Navegacion />
      <div className="ux02-main">
        <div className="ux02-columna">
          <Encabezado />
          <Filtros />
          <hr className="ux02-divisor-seccion" />
          <div className="ux02-subseccion">
            <p className="ux02-breadcrumb ux02-breadcrumb--detalle">
              <span>R.R.H.H</span>
              <span className="ux02-breadcrumb__sep">/</span>
              <span>Requerimientos</span>
              <span className="ux02-breadcrumb__sep">/</span>
              <span className="ux02-breadcrumb__fin">Detalle</span>
            </p>
            <h2 className="ux02-titulo">Requerimientos</h2>
          </div>
          <Lista />
        </div>
        <PanelLateral />
      </div>
      <Pie />
    </>
  )
}

export function DisenoPagina6() {
  return (
    <div className="ux02-lienzo">
      <PaginaBandeja />
    </div>
  )
}
