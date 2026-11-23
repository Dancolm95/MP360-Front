import { Cabecera, Icono, Navegacion, PanelLateral, Pie } from '../ux02/Cromo'
import {
  CANDIDATOS,
  FILTROS_POSTULANTES,
  RESUMEN,
  type CeldaResumen,
} from './datos'

function Valor({ celda }: { celda: CeldaResumen }) {
  if (celda.tipo === 'empresa') {
    return <span className="ux04-badge-empresa">{celda.valor}</span>
  }
  if (celda.tipo === 'fecha') {
    return <span className="ux04-badge-fecha">{celda.valor}</span>
  }
  return <span className="ux04-valor">{celda.valor}</span>
}

function Migas() {
  return (
    <p className="ux04-migas">
      <span className="ux04-migas__activo">R.R.H.H</span>
      <span className="ux04-migas__sep">/</span>
      <span>Requerimiento</span>
      <span className="ux04-migas__sep">/</span>
      <span>Detalle</span>
    </p>
  )
}

function Resumen() {
  return (
    <section className="ux04-resumen" aria-labelledby="ux04-resumen-titulo">
      <div className="ux04-resumen__cabecera">
        <div>
          <h2 id="ux04-resumen-titulo" className="ux04-tarjeta__titulo">
            Resumen
          </h2>
          <p className="ux04-tarjeta__subtitulo">
            Detalle de requerimiento seleccionado
          </p>
        </div>
        <button type="button" className="ux04-btn-contorno">
          Ver Detalle Completo
          <Icono nombre="chevron_right" />
        </button>
      </div>

      <div className="ux04-grid">
        {RESUMEN.map((celda) => (
          <div
            key={celda.etiqueta}
            className={[
              'ux04-celda',
              celda.primera ? 'ux04-celda--primera' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <span className="ux04-celda__etiqueta">{celda.etiqueta}</span>
            <Valor celda={celda} />
          </div>
        ))}
      </div>
    </section>
  )
}

function Postulantes() {
  return (
    <section className="ux04-postulantes" aria-labelledby="ux04-postulantes-titulo">
      <div className="ux04-postulantes__cabecera">
        <div>
          <h2 id="ux04-postulantes-titulo" className="ux04-tarjeta__titulo">
            Postulante (6)
          </h2>
          <p className="ux04-tarjeta__subtitulo">
            Lista de candidatos asociados al requerimiento
          </p>
        </div>
        <button type="button" className="ux04-btn-primario">
          <Icono nombre="add" />
          Asociar Candidato
        </button>
      </div>

      <div className="ux04-filtros">
        <div className="ux04-buscador">
          <Icono nombre="search" />
          <span>Buscar candidatos por nombre, DNI o puesto...</span>
        </div>

        {FILTROS_POSTULANTES.map((filtro) => (
          <label key={filtro} className="ux04-filtro">
            <span className="ux04-filtro__etiqueta">{filtro}</span>
            <button type="button" className="ux04-select">
              <span>Todos</span>
              <Icono nombre="expand_more" />
            </button>
          </label>
        ))}
      </div>

      <div className="ux04-tabla" role="table" aria-label="Postulantes del requerimiento">
        <div className="ux04-tabla__fila ux04-tabla__cabecera" role="row">
          <div className="ux04-col-candidato" role="columnheader">
            Candidato
          </div>
          <div className="ux04-col-documento" role="columnheader">
            Documento de Identidad
          </div>
          <div className="ux04-col-puesto" role="columnheader">
            Puesto
          </div>
          <div role="columnheader">Aptitud para el Requerimiento</div>
          <div role="columnheader">Estado</div>
          <div className="ux04-col-actualizado" role="columnheader">
            Última
            <br />
            Actualización
          </div>
          <div role="columnheader">Requerimiento</div>
          <div className="ux04-col-detalle" role="columnheader">
            Detalle
          </div>
          <div className="ux04-col-menu" role="columnheader">
            <Icono nombre="more_vert" />
          </div>
        </div>

        {CANDIDATOS.map((candidato) => (
          <div key={candidato.nombre} className="ux04-tabla__fila" role="row">
            <div className="ux04-col-candidato" role="cell">
              <span className="ux04-check" aria-hidden="true" />
              <span className="ux04-avatar">
                <Icono nombre="person" />
              </span>
              <span className="ux04-candidato">
                <span className="ux04-candidato__nombre">{candidato.nombre}</span>
                <span className="ux04-candidato__nac">
                  Nac: {candidato.nacionalidad}
                </span>
              </span>
            </div>
            <div className="ux04-col-documento" role="cell">
              {candidato.documento}
            </div>
            <div className="ux04-col-puesto" role="cell">
              {candidato.puesto}
            </div>
            <div role="cell">
              <span className="ux04-badge ux04-badge--azul">{candidato.aptitud}</span>
            </div>
            <div role="cell">
              <span className={`ux04-badge ux04-badge--${candidato.estado.toLowerCase()}`}>
                {candidato.estado}
              </span>
            </div>
            <div className="ux04-col-actualizado" role="cell">
              {candidato.actualizado}
            </div>
            <div role="cell">{candidato.requerimiento}</div>
            <div className="ux04-col-detalle" role="cell">
              <button type="button" className="ux04-enlace">
                Ver Detalle
              </button>
            </div>
            <div className="ux04-col-menu" role="cell">
              <button
                type="button"
                className="ux04-menu-puntos"
                aria-label={`Acciones de ${candidato.nombre}`}
              >
                <Icono nombre="more_vert" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="ux04-paginacion">
        <span className="ux04-paginacion__texto">Mostrando 4 de 6</span>
        <button type="button" className="ux04-pagina" aria-label="Página anterior">
          <Icono nombre="chevron_left" />
        </button>
        <button type="button" className="ux04-pagina ux04-pagina--activa">1</button>
        <button type="button" className="ux04-pagina" aria-label="Página siguiente">
          <Icono nombre="chevron_right" />
        </button>
      </div>
    </section>
  )
}

export function DisenoDetalle() {
  return (
    <div className="ux02-lienzo">
      <Cabecera />
      <Navegacion submenu={false} />
      <main className="ux02-main ux04-main">
        <div className="ux02-columna">
          <header className="ux04-cabecera">
            <Migas />
            <div className="ux04-cabecera__fila">
              <h1 className="ux04-titulo">Requerimiento RQ - 0221</h1>
              <span className="ux04-badge-estado">
                <Icono nombre="hourglass_empty" />
                Pendiente de Aprobación
              </span>
            </div>
            <button type="button" className="ux04-btn-volver">
              <Icono nombre="arrow_back" />
              Volver a Requerimientos
            </button>
          </header>

          <Resumen />
          <Postulantes />
        </div>
        <PanelLateral />
      </main>
      <Pie />
    </div>
  )
}
