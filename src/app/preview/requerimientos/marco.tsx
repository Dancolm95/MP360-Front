import type { ReactNode } from 'react'

const MODULOS_TABS = [
  'Inicio',
  'Requerimientos',
  'Reclutamiento',
  'Colaboradores',
  'Onboarding',
  'EPP y Equipos',
  'Asistencia',
  'Offboarding',
  'Organización y Dotación',
  'Gestión Documental',
] as const

function Logo() {
  return (
    <span className="ux02-logo" aria-hidden="true">
      <span className="ux02-logo__rombo" />
      <span className="ux02-logo__barra" />
      <span className="ux02-logo__rombo" />
    </span>
  )
}

function Cabecera() {
  return (
    <header className="ux02-cabecera">
      <div className="ux02-cabecera__izquierda">
        <span className="ux02-marca">
          <Logo />
          MP 360
        </span>
        <span className="ux02-reloj">
          <span className="ux02-reloj__hora">15:22</span>
          <span className="ux02-reloj__fecha">· Martes 15 de octubre</span>
        </span>
      </div>
      <div className="ux02-cabecera__derecha">
        <div className="ux02-busqueda">
          <span className="ux02-busqueda__icono" aria-hidden="true" />
          <span className="ux02-busqueda__texto">Buscar en MP 360</span>
        </div>
        <div className="ux02-botones-icono">
          <button type="button" className="ux02-icono-boton" aria-label="Notificaciones">
            <span aria-hidden="true">🔔</span>
            <span className="ux02-notificacion" aria-hidden="true">
              1
            </span>
          </button>
          <button type="button" className="ux02-icono-boton" aria-label="Aplicaciones">
            <span aria-hidden="true">⊞</span>
          </button>
          <button type="button" className="ux02-icono-boton" aria-label="Ayuda">
            <span aria-hidden="true">?</span>
          </button>
        </div>
        <div className="ux02-usuario">
          <span className="ux02-usuario__avatar" aria-hidden="true">
            RA
          </span>
          <span className="ux02-usuario__datos">
            <span className="ux02-usuario__nombre">Rodrigo Ayala</span>
            <span className="ux02-usuario__rol">Colaborador</span>
          </span>
        </div>
      </div>
    </header>
  )
}

function Navegacion() {
  return (
    <nav className="ux02-nav" aria-label="Navegación de módulos y secciones">
      <div className="ux02-nav__modulo">
        <button type="button" aria-label="Módulo activo: Recursos Humanos">
          Recursos Humanos
        </button>
      </div>
      <ul className="ux02-nav__tabs">
        {MODULOS_TABS.map((tab) => {
          const activa = tab === 'Requerimientos'
          return (
            <li
              key={tab}
              className={`ux02-nav__tab${activa ? ' ux02-nav__tab--activo' : ''}`}
            >
              <button
                type="button"
                aria-current={activa ? 'page' : undefined}
              >
                {tab}
              </button>
              {activa ? (
                <div className="ux02-submenu">
                  <button type="button" className="ux02-submenu__opcion">
                    Nuevo
                  </button>
                  <button type="button" className="ux02-submenu__opcion">
                    Detalle
                  </button>
                </div>
              ) : null}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function PanelLateral() {
  return (
    <aside className="ux02-panel" aria-label="Accesos y eventos">
      <section className="ux02-panel__tarjeta">
        <h3 className="ux02-panel__titulo">Acciones rápidas</h3>
        <button type="button" className="ux02-panel__boton">
          Nuevo Reclutamiento
        </button>
        <button type="button" className="ux02-panel__boton">
          Contratos por Vencer
        </button>
        <button type="button" className="ux02-panel__boton">
          Retirar Colaborador
        </button>
      </section>
      <section className="ux02-panel__tarjeta">
        <h3 className="ux02-panel__titulo">Mis accesos</h3>
        <div className="ux02-panel__fila">Boletas de Pago</div>
        <div className="ux02-panel__fila">Documentos</div>
        <div className="ux02-panel__fila">Solicitar Permiso</div>
        <div className="ux02-panel__fila">Beneficios</div>
      </section>
      <section className="ux02-panel__tarjeta">
        <h3 className="ux02-panel__titulo">Próximos Eventos</h3>
        <div className="ux02-panel__evento">Cumpleaños / Agosto</div>
        <div className="ux02-panel__fila">
          <span>Mirella Lazo</span>
          <span className="ux02-panel__evento-fecha">10 agosto</span>
        </div>
        <div className="ux02-panel__fila">
          <span>Francisco Schen…</span>
          <span className="ux02-panel__evento-fecha">15 agosto</span>
        </div>
        <button type="button" className="ux02-panel__ver-mas">
          Ver más
        </button>
      </section>
    </aside>
  )
}

function Pie() {
  return (
    <footer className="ux02-pie">
      <Logo />
      <p className="ux02-pie__eslogan">
        Un nuevo sistema que unifica, planifica y ejecuta. © 2026 Manpower SAC.
        Derechos Reservados
      </p>
    </footer>
  )
}

export function MarcoPagina6({ children }: { readonly children: ReactNode }) {
  return (
    <div className="ux02-preview">
      <div className="ux02-contenedor">
        <Cabecera />
        <Navegacion />
        <div className="ux02-contenido">
          <header className="ux02-encabezado">
            <p className="ux02-breadcrumb">
              R.R.H.H&nbsp;{'/'}&nbsp;
              <span className="ux02-breadcrumb__segmento">Requerimientos</span>
            </p>
            <div className="ux02-encabezado__fila">
              <div>
                <h2 className="ux02-titulo">Bandeja de Requerimientos</h2>
                <p className="ux02-subtitulo">
                  Consulta y seguimiento de requerimientos de Personal
                </p>
              </div>
              <button type="button" className="ux02-btn-primario">
                Nuevo Requerimiento
              </button>
            </div>
          </header>
          <div className="ux02-columna">{children}</div>
          <PanelLateral />
        </div>
        <Pie />
      </div>
    </div>
  )
}
