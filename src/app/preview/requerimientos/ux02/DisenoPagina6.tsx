import type { ReactNode } from 'react'
import {
  ACCIONES_RAPIDAS,
  COLABORADORES_PANEL,
  FILAS,
  FILTROS,
  MIS_ACCESOS,
  NAVEGACION,
} from './datos'

function Icono({ nombre }: { nombre: string }) {
  return (
    <span className="ux02-i" aria-hidden="true">
      {nombre}
    </span>
  )
}

function Cabecera() {
  return (
    <header className="ux02-cabecera">
      <span className="ux02-marca">
        <img src="/preview/mp360/img/logo-mp-dark.png" alt="MP 360" />
      </span>
      <span className="ux02-divisor" aria-hidden="true" />
      <div className="ux02-reloj">
        <span className="ux02-reloj__hora">15:22</span>
        <span className="ux02-reloj__fecha">
          <span className="ux02-reloj__dia">Martes</span>
          <span className="ux02-reloj__fecha-dia">15 de octubre</span>
        </span>
      </div>

      <div className="ux02-busqueda">
        <Icono nombre="search" />
        <input type="text" placeholder="Buscar en MP 360" aria-label="Buscar en MP 360" />
      </div>

      <div className="ux02-acciones">
        <button type="button" className="ux02-cuadro" aria-label="Mensajes">
          <Icono nombre="chat_bubble" />
        </button>
        <button type="button" className="ux02-cuadro" aria-label="Configuración">
          <Icono nombre="settings" />
        </button>
        <button type="button" className="ux02-cuadro ux02-cuadro--notif" aria-label="Notificaciones">
          <Icono nombre="notifications" />
          <span className="ux02-notificacion">1</span>
        </button>

        <button type="button" className="ux02-usuario">
          <span className="ux02-usuario__avatar">
            <img src="/preview/mp360/img/rodrigo.jpg" alt="" />
          </span>
          <span className="ux02-usuario__datos">
            <span className="ux02-usuario__nombre">Rodrigo Ayala</span>
            <span className="ux02-usuario__rol">Colaborador</span>
          </span>
        </button>
      </div>
    </header>
  )
}

function Navegacion() {
  return (
    <nav className="ux02-nav" aria-label="Secciones de RR. HH.">
      <button type="button" className="ux02-nav__modulo">
        <span>Recursos Humanos</span>
        <Icono nombre="expand_more" />
      </button>

      <ul className="ux02-nav__tabs">
        {NAVEGACION.map((item) => (
          <li
            key={item.etiqueta}
            style={{ width: `${item.ancho}px` }}
            className={[
              'ux02-nav__tab',
              item.activo ? 'ux02-nav__tab--activo' : '',
              item.dosLineas ? 'ux02-nav__tab--dos-lineas' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <button type="button">
              <Icono nombre={item.icono} />
              <span>{item.etiqueta}</span>
              {item.activo ? (
                <span className="ux02-i ux02-nav__chevron" aria-hidden="true">
                  expand_more
                </span>
              ) : null}
            </button>

            {item.activo ? (
              <div className="ux02-submenu">
                <button type="button">Nuevo</button>
                <button type="button">Detalle</button>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </nav>
  )
}

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

function PanelLateral() {
  return (
    <aside className="ux02-rail" aria-label="Panel contextual">
      <div className="ux02-rail__titulo">
        Acciones rápidas
        <Icono nombre="add" />
      </div>
      <div className="ux02-rail__tarjeta ux02-rail__tarjeta--acciones">
        {ACCIONES_RAPIDAS.map((accion, indice) => (
          <button key={`${accion}-${indice}`} type="button" className="ux02-rail__boton">
            {accion}
          </button>
        ))}
      </div>

      <div className="ux02-rail__accesos">
        <div className="ux02-rail__titulo">
          Mis accesos
          <Icono nombre="chevron_right" />
        </div>
        <div className="ux02-rail__accesos-lista">
          {MIS_ACCESOS.map((acceso) => (
            <button key={acceso} type="button" className="ux02-rail__acceso">
              {acceso}
            </button>
          ))}
        </div>
      </div>

      <div className="ux02-rail__eventos">
        <div className="ux02-rail__titulo ux02-rail__titulo--eventos">
          Próximos Eventos
          <Icono nombre="calendar_month" />
        </div>
        <div className="ux02-rail__tarjeta ux02-rail__tarjeta--eventos">
          <span className="ux02-rail__evento-titulo">Cumpleaños / Agosto</span>
          {COLABORADORES_PANEL.map((persona) => (
            <span key={persona.nombre} className="ux02-rail__evento">
              <span className="ux02-rail__evento-avatar">
                <img src={`/preview/mp360/img/${persona.foto}`} alt="" />
              </span>
              <span className="ux02-rail__evento-datos">
                <span>{persona.nombre}</span>
                <span className="ux02-rail__evento-fecha">{persona.fecha}</span>
              </span>
            </span>
          ))}
          <button type="button" className="ux02-rail__ver-mas">Ver más</button>
        </div>
      </div>
    </aside>
  )
}

function Pie() {
  return (
    <footer className="ux02-pie">
      <span className="ux02-pie__marca">
        <img src="/preview/mp360/img/logo-mp-white.png" alt="MP 360" />
      </span>
      <p className="ux02-pie__eslogan">
        Un nuevo sistema que unifica, planifica y ejecuta.
      </p>
      <span className="ux02-pie__derechos">
        © 2026 Manpower SAC. Derechos Reservados
      </span>
    </footer>
  )
}

export function DisenoPagina6() {
  return (
    <div className="ux02-lienzo">
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
    </div>
  )
}
