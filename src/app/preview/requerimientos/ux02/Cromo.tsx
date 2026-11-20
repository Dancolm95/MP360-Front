import type { ReactNode } from 'react'
import {
  ACCIONES_RAPIDAS,
  COLABORADORES_PANEL,
  MIS_ACCESOS,
  NAVEGACION,
} from './datos'

export function Icono({ nombre }: { nombre: string }) {
  return (
    <span className="ux02-i" aria-hidden="true">
      {nombre}
    </span>
  )
}

export function Cabecera() {
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

export interface TabNavegacion {
  readonly etiqueta: string
  readonly icono: string
  readonly dosLineas: boolean
  readonly ancho: number
}

export function Navegacion({
  submenu = true,
  activo = 'Requerimientos',
  moduloAbierto = false,
  onModulo,
  submenuContenido,
  chevronActivo = true,
  tabs = NAVEGACION,
}: {
  submenu?: boolean
  activo?: string
  moduloAbierto?: boolean
  onModulo?: () => void
  submenuContenido?: ReactNode
  chevronActivo?: boolean
  tabs?: readonly TabNavegacion[]
}) {
  return (
    <nav className="ux02-nav" aria-label="Secciones de RR. HH.">
      <button
        type="button"
        className="ux02-nav__modulo"
        aria-expanded={moduloAbierto}
        aria-haspopup="menu"
        onClick={onModulo}
      >
        <span>Recursos Humanos</span>
        <Icono nombre="expand_more" />
      </button>

      <ul className="ux02-nav__tabs">
        {tabs.map((item) => {
          const esActivo = item.etiqueta === activo
          return (
          <li
            key={item.etiqueta}
            style={{ width: `${item.ancho}px` }}
            className={[
              'ux02-nav__tab',
              esActivo ? 'ux02-nav__tab--activo' : '',
              item.dosLineas ? 'ux02-nav__tab--dos-lineas' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <button type="button">
              <Icono nombre={item.icono} />
              <span>{item.etiqueta}</span>
              {esActivo && chevronActivo ? (
                <span className="ux02-i ux02-nav__chevron" aria-hidden="true">
                  expand_more
                </span>
              ) : null}
            </button>

            {esActivo && submenu ? (
              <div className="ux02-submenu">
                {submenuContenido ?? (
                  <>
                    <button type="button">Nuevo</button>
                    <button type="button">Detalle</button>
                  </>
                )}
              </div>
            ) : null}
          </li>
          )
        })}
      </ul>
    </nav>
  )
}

export function PanelLateral({
  iconoAcciones = 'add',
  iconoAccesos = 'chevron_right',
  iconoEventos = 'calendar_month',
  iconoAccionPrincipal,
}: {
  iconoAcciones?: string
  iconoAccesos?: string | null
  iconoEventos?: string
  iconoAccionPrincipal?: string
} = {}) {
  return (
    <aside className="ux02-rail" aria-label="Panel contextual">
      <div className="ux02-rail__titulo">
        Acciones rápidas
        <Icono nombre={iconoAcciones} />
      </div>
      <div className="ux02-rail__tarjeta ux02-rail__tarjeta--acciones">
        {ACCIONES_RAPIDAS.map((accion, indice) => (
          <button key={`${accion}-${indice}`} type="button" className="ux02-rail__boton">
            {accion}
            {indice === 0 && iconoAccionPrincipal ? (
              <Icono nombre={iconoAccionPrincipal} />
            ) : null}
          </button>
        ))}
      </div>

      <div className="ux02-rail__accesos">
        <div className="ux02-rail__titulo">
          Mis accesos
          {iconoAccesos ? <Icono nombre={iconoAccesos} /> : null}
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
          <Icono nombre={iconoEventos} />
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

export function Pie() {
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
