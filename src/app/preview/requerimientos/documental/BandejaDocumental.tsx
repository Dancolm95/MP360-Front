import { Icono } from '../ux02/Cromo'
import { MarcoDocumental } from './MarcoDocumental'
import {
  FILAS_DOCUMENTAL,
  FILTROS_DOCUMENTAL,
  PAGINAS_DOCUMENTAL,
  TABS_DOCUMENTAL,
  type EstadoDocumento,
  type FilaDocumental,
} from './datos'

const ESTADOS: Record<EstadoDocumento, string> = {
  'Pendiente de revisión': 'ux23-estado--revision',
  'Pendiente de firma': 'ux23-estado--firma',
  Vigente: 'ux23-estado--vigente',
  Archivado: 'ux23-estado--archivado',
  'En papelera': 'ux23-estado--papelera',
}

function Casilla() {
  return <span className="ux23-casilla" aria-hidden="true" />
}

function IconoArchivo({ formato }: { formato: FilaDocumental['formato'] }) {
  return (
    <svg
      className={`ux23-archivo ux23-archivo--${formato}`}
      viewBox="0 0 16 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2 3.2A2.2 2.2 0 0 1 4.2 1h5.6L14 5.2v11.6A2.2 2.2 0 0 1 11.8 19H4.2A2.2 2.2 0 0 1 2 16.8z" />
      <path d="M9.8 1v4.2H14" />
      <path d="M5 9h3.2M5 12.2h6M5 15.4h6" />
    </svg>
  )
}

// El subconjunto de Material Symbols no incluye «inventory_2»; la pestaña lo dibuja.
function IconoArchivador() {
  return (
    <svg
      className="ux23-icono-pestana"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3.2" y="2.6" width="13.6" height="6.6" rx="1" />
      <rect x="3.2" y="10.8" width="13.6" height="6.6" rx="1" />
      <path d="M8 5.9h4M8 14.1h4" />
    </svg>
  )
}

function IconoPestana({ nombre }: { nombre: string }) {
  if (nombre === 'inventario') return <IconoArchivador />
  return <Icono nombre={nombre} />
}

function Orden() {
  return (
    <svg
      className="ux23-orden"
      viewBox="0 0 8 13"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 0 7.6 5H.4z" fill="currentColor" />
      <path d="M4 13 .4 8h7.2z" fill="currentColor" />
    </svg>
  )
}

function Avatar() {
  return (
    <span className="ux23-avatar" aria-hidden="true">
      <svg viewBox="0 0 34 34" focusable="false">
        <circle cx="17" cy="17" r="17" fill="#808080" />
        <circle cx="17" cy="12.5" r="6.2" fill="#fff" />
        <path d="M5.8 29.5c.5-6.1 5.2-9.7 11.2-9.7s10.7 3.6 11.2 9.7z" fill="#fff" />
      </svg>
    </span>
  )
}

function Flecha({ sentido }: { sentido: 'izquierda' | 'derecha' }) {
  return (
    <svg
      className="ux23-flecha"
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

function Tabs() {
  return (
    <div className="ux13-tabs ux23-tabs" role="tablist" aria-label="Vistas de documentos">
      {TABS_DOCUMENTAL.map((tab, indice) => (
        <button
          key={tab.etiqueta}
          type="button"
          role="tab"
          aria-selected={indice === 0}
          style={{ width: `${tab.ancho}px`, marginRight: `${tab.separacion}px` }}
          className={`ux13-tab ux23-tab${indice === 0 ? ' ux13-tab--activa' : ''}`}
        >
          <IconoPestana nombre={tab.icono} />
          {tab.etiqueta}
        </button>
      ))}
    </div>
  )
}

function Filtros() {
  return (
    <section className="ux13-filtros ux23-filtros" aria-label="Filtros de documentos">
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

        {FILTROS_DOCUMENTAL.map((filtro) => (
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
          <button type="button" className="ux23-btn-limpiar">Limpiar Filtros</button>
          <button type="button" className="ux23-btn-aplicar">
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
    <div className="ux13-barra ux23-barra">
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

function Ubicacion({ fila }: { fila: FilaDocumental }) {
  const papelera = fila.ubicacionTipo === 'papelera'
  return (
    <span className={`ux23-ubicacion${papelera ? ' ux23-ubicacion--papelera' : ''}`}>
      <Icono nombre={papelera ? 'delete' : 'folder'} />
      {fila.ubicacion}
    </span>
  )
}

function Tabla() {
  return (
    <section className="ux13-tabla ux23-tabla" role="table" aria-label="Documentos de colaboradores">
      <div className="ux13-tabla__fila ux13-tabla__cabecera" role="row">
        <div role="columnheader" className="ux13-th ux13-th--colaborador">
          <Casilla />
          <span className="ux13-th__rotulo">
            Colaborador
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux13-th ux23-th--persona">
          <span className="ux13-th__rotulo">
            Colaborador
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux13-th">
          <span className="ux13-th__rotulo">
            Tipo
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux13-th">
          <span className="ux13-th__rotulo">
            Versión
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
            Área
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux13-th">
          <span className="ux13-th__rotulo ux13-th__rotulo--dos-lineas">
            <span>
              Fecha de
              <br />
              Creación
            </span>
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux13-th">
          <span className="ux13-th__rotulo ux13-th__rotulo--dos-lineas">
            <span>
              última
              <br />
              actualización
            </span>
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux13-th">
          <span className="ux13-th__rotulo">
            Ubicación lógica
            <Orden />
          </span>
        </div>
        <div role="columnheader" className="ux13-th ux13-th--acciones" aria-label="Acciones" />
      </div>

      <div className="ux13-tabla__cuerpo">
        {FILAS_DOCUMENTAL.map((fila, indice) => (
          <div
            key={`${fila.archivo}-${indice}`}
            className="ux13-tabla__fila ux13-fila"
            role="row"
          >
            <div className="ux23-celda-archivo" role="cell">
              <Casilla />
              <IconoArchivo formato={fila.formato} />
              <span className="ux23-archivo__nombre">{fila.archivo}</span>
            </div>
            <div className="ux23-celda-persona" role="cell">
              <Avatar />
              <span className="ux13-datos">
                <span className="ux13-nombre">{fila.colaborador}</span>
                <span className="ux13-cargo">{fila.cargo}</span>
              </span>
            </div>
            <div className="ux13-celda--gris ux23-celda--izquierda" role="cell">
              {fila.tipo}
            </div>
            <div className="ux13-celda--gris ux23-celda--izquierda" role="cell">
              {fila.version}
            </div>
            <div role="cell">
              <span className={`ux23-estado ${ESTADOS[fila.estado]}`}>{fila.estado}</span>
            </div>
            <div className="ux13-celda--gris" role="cell">{fila.area}</div>
            <div className="ux13-celda--gris" role="cell">{fila.fechaCreacion}</div>
            <div className="ux13-celda--gris" role="cell">{fila.ultimaActualizacion}</div>
            <div className="ux23-celda-ubicacion" role="cell">
              <Ubicacion fila={fila} />
            </div>
            <div className="ux13-celda--acciones" role="cell">
              <button
                type="button"
                className="ux13-menu"
                aria-label={`Acciones de ${fila.archivo}`}
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
    <div className="ux13-paginacion ux23-paginacion">
      <span className="ux13-paginacion__texto">Mostrando 10 de 246</span>
      <button type="button" className="ux13-pagina" aria-label="Página anterior">
        <Flecha sentido="izquierda" />
      </button>
      {PAGINAS_DOCUMENTAL.map((pagina) => (
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

export function BandejaDocumental() {
  return (
    <MarcoDocumental>
      <Tabs />
      <Filtros />
      <div className="ux13-panel ux23-panel">
        <Barra />
        <Tabla />
      </div>
      <Paginacion />
    </MarcoDocumental>
  )
}
