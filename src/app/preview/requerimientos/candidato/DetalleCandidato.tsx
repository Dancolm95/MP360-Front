import { Cabecera, Icono, Navegacion, PanelLateral, Pie } from '../ux02/Cromo'
import {
  ACCIONES,
  CANDIDATO,
  DOCUMENTOS,
  ETAPAS,
  EVALUACION,
  FICHA,
  HISTORIAL,
} from './datos'

function Avatar() {
  return (
    <span className="ux06-avatar" aria-hidden="true">
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
    <header className="ux06-cabecera">
      <p className="ux02-breadcrumb ux06-breadcrumb">
        <span className="ux02-breadcrumb__activo">R.R.H.H</span>
        <span className="ux02-breadcrumb__sep">/</span>
        <span>Requerimientos</span>
        <span className="ux02-breadcrumb__sep">/</span>
        <span>Detalle</span>
        <span className="ux02-breadcrumb__sep">/</span>
        <span>Postulante</span>
      </p>

      <div className="ux06-cabecera__fila">
        <h1 className="ux06-titulo">Detalle del Postulante</h1>
        <span className="ux06-badge-estado">{CANDIDATO.estado}</span>
      </div>

      <button type="button" className="ux06-btn-volver">
        <Icono nombre="chevron_left" />
        Volver a Postulantes
      </button>
    </header>
  )
}

function Resumen() {
  return (
    <section className="ux06-tarjeta ux06-resumen" aria-label="Resumen del postulante">
      <div className="ux06-persona">
        <Avatar />
        <span className="ux06-persona__datos">
          <span className="ux06-persona__nombre">{CANDIDATO.nombre}</span>
          <span className="ux06-persona__dni">
            DNI: {CANDIDATO.documento} Nacionalidad: {CANDIDATO.nacionalidad}
          </span>
        </span>
      </div>

      <dl className="ux06-ficha">
        {FICHA.map((dato) => (
          <div key={dato.clave} className={`ux06-dato ux06-dato--${dato.clave}`}>
            <dt>{dato.etiqueta}</dt>
            <dd>{dato.insignia ? <span className="ux06-badge-empresa">{dato.valor}</span> : dato.valor}</dd>
          </div>
        ))}
        {FICHA.slice(0, -1).map((dato) => (
          <span
            key={`divisor-${dato.clave}`}
            className={`ux06-ficha__divisor ux06-ficha__divisor--${dato.clave}`}
            aria-hidden="true"
          />
        ))}
      </dl>

      <div className="ux06-progreso">
        <span className="ux06-progreso__linea" aria-hidden="true" />
        <span className="ux06-progreso__linea ux06-progreso__linea--hecha" aria-hidden="true" />
        <ol className="ux06-pasos" aria-label="Etapas del postulante">
          {ETAPAS.map((etapa) => (
            <li key={etapa.etiqueta} className="ux06-paso" data-estado={etapa.estado}>
              <span className="ux06-paso__marca">
                {etapa.estado === 'pendiente' ? null : <Icono nombre="check" />}
              </span>
              <span className="ux06-paso__etiqueta">{etapa.etiqueta}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Evaluacion() {
  return (
    <section className="ux06-tarjeta ux06-evaluacion" aria-label="Evaluación y entrevista">
      <div className="ux06-evaluacion__cabecera">
        <h2 className="ux06-titulo-tarjeta">Evaluación y entrevista</h2>
        <span className="ux06-evaluacion__meta">{EVALUACION.entrevista}</span>
        <button type="button" className="ux06-btn-contorno">
          <Icono nombre="edit" />
          Editar evaluación
        </button>
      </div>

      <div className="ux06-evaluacion__tabla">
        <dl className="ux06-evaluacion__campos">
          {EVALUACION.campos.map((campo) => (
            <div key={campo.etiqueta} className="ux06-evaluacion__celda">
              <dt>{campo.etiqueta}</dt>
              <dd>{campo.valor}</dd>
            </div>
          ))}
        </dl>
        <div className="ux06-evaluacion__comentario">
          <span className="ux06-evaluacion__rotulo">Comentarios</span>
          <p className="ux06-evaluacion__texto">{EVALUACION.comentario}</p>
        </div>
      </div>
    </section>
  )
}

function Acciones() {
  return (
    <section className="ux06-tarjeta ux06-acciones" aria-label="Acciones del postulante">
      <h2 className="ux06-titulo-tarjeta">Acciones del postulante</h2>
      <div className="ux06-acciones__lista">
        {ACCIONES.map((accion) => (
          <button
            key={accion.etiqueta}
            type="button"
            className={`ux06-btn-accion ux06-btn-accion--${accion.variante}`}
          >
            {accion.icono ? <Icono nombre={accion.icono} /> : null}
            {accion.etiqueta}
          </button>
        ))}
      </div>
    </section>
  )
}

function Documentos() {
  return (
    <section className="ux06-tarjeta ux06-documentos" aria-label="Documentos del postulante">
      <h2 className="ux06-titulo-tarjeta">Documentos del postulante</h2>
      <div className="ux06-documentos__tabla">
        {DOCUMENTOS.map((documento) => (
          <div key={documento.nombre} className="ux06-documentos__fila">
            <span className="ux06-documentos__icono" aria-hidden="true">
              <Icono nombre="description" />
            </span>
            <span className="ux06-documentos__datos">
              <span className="ux06-documentos__nombre">{documento.nombre}</span>
              <span className="ux06-documentos__detalle">{documento.detalle}</span>
            </span>
            <span className="ux06-badge-validado">{documento.estado}</span>
            <button type="button" className="ux06-enlace">
              <Icono nombre="visibility" />
              Ver Archivo
            </button>
            <button
              type="button"
              className="ux06-menu-puntos"
              aria-label={`Acciones de ${documento.nombre}`}
            >
              <Icono nombre="more_vert" />
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

function Historial() {
  return (
    <section className="ux06-tarjeta ux06-historial" aria-label="Historial del postulante">
      <h2 className="ux06-titulo-tarjeta">Historial - Etapa 1</h2>

      <span className="ux06-historial__linea" aria-hidden="true" />
      {HISTORIAL.map((hito, indice) => (
        <span
          key={`marca-${hito.titulo}`}
          className="ux06-historial__marca"
          data-estado={hito.completado ? 'hecha' : 'pendiente'}
          data-indice={indice + 1}
          aria-hidden="true"
        >
          {hito.completado ? <Icono nombre="check" /> : null}
        </span>
      ))}

      <ol className="ux06-historial__hitos">
        {HISTORIAL.map((hito, indice) => (
          <li key={hito.titulo} className="ux06-hito" data-indice={indice + 1}>
            <span className="ux06-hito__fecha">{hito.fecha}</span>
            <span className="ux06-hito__titulo">{hito.titulo}</span>
          </li>
        ))}
      </ol>

      <div className="ux06-paginacion" role="group" aria-label="Páginas del historial">
        <button type="button" className="ux06-pagina" aria-label="Página anterior">
          <Icono nombre="chevron_left" />
        </button>
        <button type="button" className="ux06-pagina ux06-pagina--activa" aria-current="page">
          1
        </button>
        <button type="button" className="ux06-pagina" aria-label="Página siguiente">
          <Icono nombre="chevron_right" />
        </button>
      </div>
    </section>
  )
}

export function DetalleCandidato() {
  return (
    <div className="ux02-lienzo ux06-lienzo">
      <Cabecera />
      <Navegacion activo="Reclutamiento" submenu={false} />
      <div className="ux02-main ux06-main">
        <div className="ux06-columna">
          <Encabezado />
          <div className="ux06-tablero">
            <Resumen />
            <Evaluacion />
            <Acciones />
            <Documentos />
            <Historial />
          </div>
        </div>
        <PanelLateral iconoAcciones="edit" iconoAccesos={null} iconoEventos="expand_more" />
      </div>
      <Pie />
    </div>
  )
}
