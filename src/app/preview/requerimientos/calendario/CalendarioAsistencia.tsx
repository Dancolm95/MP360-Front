import { Cabecera, Icono, Navegacion, PanelLateral, Pie } from '../ux02/Cromo'
import {
  DETALLE_DIA,
  DIAS_SEMANA,
  FILTROS_CALENDARIO,
  ICONO_EVENTO,
  LEYENDA,
  RESUMEN_PERIODO,
  SEMANAS,
  TABS_CALENDARIO,
  type TipoEvento,
} from './datos'

const VISTAS = ['Mes', 'Semana', 'Día'] as const

function IconoVacaciones() {
  return (
    <svg
      className="ux22-svg"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M1.8 9.4a8.2 8.2 0 0 1 16.4 0z" />
      <path d="M10 1.2v8.2M4.4 3.3l5.6 6.1M15.6 3.3 10 9.4M10 9.4v7.9" />
    </svg>
  )
}

function IconoLibro() {
  return (
    <svg
      className="ux22-svg"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="4.1" y="2.1" width="11.8" height="15.8" rx="2.3" />
      <path d="M7.2 2.1v15.8" />
    </svg>
  )
}

function IconoEvento({ tipo }: { tipo: TipoEvento }) {
  if (tipo === 'vacaciones') return <IconoVacaciones />
  if (tipo === 'licencia') return <IconoLibro />
  return <Icono nombre={ICONO_EVENTO[tipo]} />
}

function Flecha({ sentido }: { sentido: 'izquierda' | 'derecha' }) {
  return (
    <svg
      className="ux22-flecha"
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
      <p className="ux02-breadcrumb ux13-breadcrumb ux22-breadcrumb">
        <span className="ux02-breadcrumb__activo">R.R.H.H</span>
        <span className="ux02-breadcrumb__sep">/</span>
        <span className="ux22-breadcrumb__nivel">Licencia y Ausencias</span>
        <span className="ux02-breadcrumb__sep">/</span>
        <span className="ux22-breadcrumb__nivel">Calendario de Asistencia</span>
      </p>

      <div className="ux13-titulo-fila">
        <h1 className="ux13-titulo">Calendaria de Asistencia</h1>
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
    <div className="ux22-tabs" role="tablist" aria-label="Vistas de asistencia">
      {TABS_CALENDARIO.map((tab, indice) => {
        const activa = indice === TABS_CALENDARIO.length - 1
        return (
          <button
            key={tab.etiqueta}
            type="button"
            role="tab"
            aria-selected={activa}
            className={`ux22-tab${activa ? ' ux22-tab--activa' : ''}`}
            style={{ width: `${tab.ancho}px`, marginRight: `${tab.separacion}px` }}
          >
            <Icono nombre={tab.icono} />
            {tab.etiqueta}
          </button>
        )
      })}
    </div>
  )
}

function Filtros() {
  return (
    <section className="ux13-filtros" aria-label="Filtros del calendario">
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

        {FILTROS_CALENDARIO.map((filtro) => (
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

function Calendario() {
  return (
    <section className="ux22-calendario" aria-label="Calendario de asistencia">
      <div className="ux22-barra">
        <button type="button" className="ux22-nav-btn" aria-label="Mes anterior">
          <Flecha sentido="izquierda" />
        </button>
        <button type="button" className="ux22-nav-btn" aria-label="Mes siguiente">
          <Flecha sentido="derecha" />
        </button>

        <h2 className="ux22-mes">Noviembre 2026</h2>

        <div className="ux22-vistas" role="tablist" aria-label="Vista del calendario">
          {VISTAS.map((vista, indice) => (
            <button
              key={vista}
              type="button"
              role="tab"
              aria-selected={indice === 0}
              className={`ux22-vista${indice === 0 ? ' ux22-vista--activa' : ''}`}
            >
              {vista}
            </button>
          ))}
        </div>

        <button type="button" className="ux22-hoy">
          Hoy
        </button>
      </div>

      <div className="ux22-grid" role="grid" aria-label="Noviembre 2026">
        <div className="ux22-grid__fila ux22-grid__fila--cabecera" role="row">
          {DIAS_SEMANA.map((dia) => (
            <div key={dia} role="columnheader" className="ux22-grid__dia">
              {dia}
            </div>
          ))}
        </div>

        {SEMANAS.map((semana, indiceSemana) => (
          <div className="ux22-grid__fila" role="row" key={indiceSemana}>
            {semana.map((dia, indiceDia) => {
              const clases = [
                'ux22-celda',
                dia.otroMes ? 'ux22-celda--otro-mes' : '',
                dia.seleccionado ? 'ux22-celda--seleccionada' : '',
                dia.compacto ? 'ux22-celda--compacta' : '',
              ]
                .filter(Boolean)
                .join(' ')

              return (
                <div
                  key={`${indiceSemana}-${indiceDia}`}
                  role="gridcell"
                  aria-selected={dia.seleccionado || undefined}
                  className={clases}
                >
                  <span className="ux22-celda__numero">{dia.numero}</span>
                  {dia.extra ? <span className="ux22-celda__extra">{dia.extra}</span> : null}

                  {dia.eventos ? (
                    <div className="ux22-celda__eventos">
                      {dia.eventos.map((evento, indiceEvento) => (
                        <span
                          key={`${evento.tipo}-${indiceEvento}`}
                          className={`ux22-evento ux22-evento--${evento.tipo}`}
                        >
                          <IconoEvento tipo={evento.tipo} />
                          {evento.texto}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <div className="ux22-leyenda">
        <span className="ux22-leyenda__titulo">Leyenda</span>
        <div className="ux22-leyenda__chips">
          {LEYENDA.map((item) => (
            <span key={item.tipo} className={`ux22-leyenda__chip ux22-evento--${item.tipo}`}>
              <IconoEvento tipo={item.tipo} />
              {item.etiqueta}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function Agenda() {
  return (
    <aside className="ux22-agenda" aria-label="Detalle del día y resumen del periodo">
      <div className="ux22-agenda__cabecera">
        <span className="ux22-agenda__cuadro" aria-hidden="true" />
        <h2 className="ux22-agenda__titulo">{DETALLE_DIA.titulo}</h2>
      </div>

      <article className="ux22-agenda__card">
        <div className={`ux22-agenda__banda ux22-evento--${DETALLE_DIA.tipo}`}>
          <span className="ux22-agenda__banda-titulo">
            <IconoEvento tipo={DETALLE_DIA.tipo} />
            {DETALLE_DIA.etiqueta}
          </span>
          <span className="ux22-agenda__estado">{DETALLE_DIA.estado}</span>
        </div>

        <div className="ux22-agenda__cuerpo">
          <p className="ux22-agenda__nombre">{DETALLE_DIA.nombre}</p>
          <p className="ux22-agenda__linea">{DETALLE_DIA.periodo}</p>
          <p className="ux22-agenda__linea">{DETALLE_DIA.area}</p>
        </div>

        <button type="button" className="ux22-agenda__detalle">
          <Icono nombre="visibility" />
          Ver Detalle
        </button>
      </article>

      <span className="ux22-agenda__scroll" aria-hidden="true" />

      <div className="ux22-agenda__resumen">
        <span className="ux22-agenda__cuadro" aria-hidden="true" />
        <h2 className="ux22-agenda__titulo">Resumen del periodo</h2>
      </div>

      <div className="ux22-agenda__periodo">
        {RESUMEN_PERIODO.map((item) => (
          <div key={item.tipo} className={`ux22-resumen-item ux22-evento--${item.tipo}`}>
            <IconoEvento tipo={item.tipo} />
            <span className="ux22-resumen-item__etiqueta">{item.etiqueta}</span>
            {item.valor ? <strong className="ux22-resumen-item__valor">{item.valor}</strong> : null}
          </div>
        ))}
      </div>
    </aside>
  )
}

export function CalendarioAsistencia() {
  return (
    <div className="ux02-lienzo ux13-lienzo ux22-lienzo">
      <Cabecera />
      <Navegacion activo="Asistencia" submenu={false} chevronActivo={false} />
      <div className="ux02-main">
        <div className="ux02-columna">
          <Encabezado />
          <Tabs />
          <Filtros />
          <div className="ux22-contenido">
            <Calendario />
            <Agenda />
          </div>
        </div>
        <PanelLateral
          iconoAcciones="edit"
          iconoAccesos={null}
          iconoEventos="expand_more"
          iconoAccionPrincipal={null}
        />
      </div>
      <Pie />
    </div>
  )
}
