import { Icono } from '../ux02/Cromo'
import { MarcoDocumental } from './MarcoDocumental'
import { StepperGeneracionDocumental } from './GeneracionTipo'
import {
  AVISO_INFORMACION,
  LINEAS_HOJA_CONTENIDO,
  RESUMEN_GENERACION_DOCUMENTAL,
  VARIABLES_CONTENIDO,
} from './datos'

const UBICACION_VARIABLE = [
  'nombre',
  'dni',
  'puesto',
  'area',
  'inicio',
  'remuneracion',
  'contrato',
] as const

function AvatarResumen() {
  return (
    <span className="ux24-info__avatar" aria-hidden="true">
      <svg viewBox="0 0 48 48" focusable="false">
        <circle cx="24" cy="24" r="24" fill="#808080" />
        <circle cx="24" cy="17.5" r="8.4" fill="#fff" />
        <path d="M8.4 42c.7-8.6 7.1-13.6 15.6-13.6S38.9 33.4 39.6 42z" fill="#fff" />
      </svg>
    </span>
  )
}

function ResumenDocumento() {
  return (
    <section className="ux24-info__resumen" aria-label="Resumen de la generación">
      <div className="ux24-info__persona">
        <AvatarResumen />
        <div className="ux24-info__identidad">
          <p className="ux24-info__nombre">{RESUMEN_GENERACION_DOCUMENTAL.nombre}</p>
          <p className="ux24-info__meta">{RESUMEN_GENERACION_DOCUMENTAL.documento}</p>
          <p className="ux24-info__meta">{RESUMEN_GENERACION_DOCUMENTAL.cargo}</p>
        </div>
      </div>

      <span className="ux24-info__divisoria ux24-info__divisoria--1" aria-hidden="true" />
      <div className="ux24-info__bloque ux24-info__bloque--tipo">
        <p className="ux24-info__bloque-etiqueta">Tipo de Documento</p>
        <p className="ux24-info__bloque-valor">{RESUMEN_GENERACION_DOCUMENTAL.tipoDocumento}</p>
      </div>

      <span className="ux24-info__divisoria ux24-info__divisoria--2" aria-hidden="true" />
      <div className="ux24-info__bloque ux24-info__bloque--ingreso">
        <p className="ux24-info__bloque-etiqueta">Ingreso de Colaborador</p>
        <p className="ux24-info__bloque-valor">{RESUMEN_GENERACION_DOCUMENTAL.ingreso}</p>
      </div>

      <span className="ux24-info__divisoria ux24-info__divisoria--3" aria-hidden="true" />
      <div className="ux24-info__bloque ux24-info__bloque--registro">
        <p className="ux24-info__bloque-etiqueta">Fecha de Registro</p>
        <p className="ux24-info__bloque-valor">{RESUMEN_GENERACION_DOCUMENTAL.fechaRegistro}</p>
      </div>

      <span className="ux24-info__divisoria ux24-info__divisoria--4" aria-hidden="true" />
      <div className="ux24-info__bloque ux24-info__bloque--responsable">
        <p className="ux24-info__bloque-etiqueta">Responsable de revisión</p>
        <p className="ux24-info__bloque-valor">{RESUMEN_GENERACION_DOCUMENTAL.responsable}</p>
      </div>
    </section>
  )
}

function ListaVariables() {
  return (
    <section className="ux24-contenido__izquierda" aria-labelledby="ux24-contenido-variables">
      <div className="ux24-contenido__marca">
        <span className="ux24-contenido__cuadro" aria-hidden="true" />
        <h2 className="ux24-contenido__titulo">Contenido y Variables</h2>
      </div>

      <p className="ux24-contenido__descripcion">
        Revisa el contenido y valida la información que se completará automáticamente
      </p>

      <h3 className="ux24-contenido__seccion" id="ux24-contenido-variables">
        Variables del contenido
      </h3>
      <p className="ux24-contenido__seccion-desc">
        Campos que se reemplazarán automáticamente en la plantilla.
      </p>

      <ul className="ux24-contenido__variables" aria-label="Variables del contenido">
        {VARIABLES_CONTENIDO.map((variable, indice) => (
          <li
            key={variable.nombre}
            className={`ux24-contenido__variable ux24-contenido__variable--${UBICACION_VARIABLE[indice]}`}
          >
            <span className="ux24-contenido__casilla" aria-hidden="true" />
            <span className="ux24-contenido__variable-nombre">{variable.nombre}</span>
            <span className="ux24-contenido__variable-valor">{variable.valor}</span>
          </li>
        ))}
      </ul>

      <div className="ux24-contenido__marcar">
        <span className="ux24-contenido__casilla" aria-hidden="true" />
        <span className="ux24-contenido__variable-nombre">Marcar todas las casillas</span>
      </div>

      <span className="ux24-contenido__scroll" aria-hidden="true" />
    </section>
  )
}

function IconoAviso() {
  return (
    <svg
      className="ux24-contenido__aviso-icono"
      viewBox="0 0 22 22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="11" cy="11" r="9.6" />
      <path d="M11 5.8v6.8" strokeLinecap="round" />
      <circle cx="11" cy="15.9" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconoPantallaCompleta() {
  return (
    <svg
      className="ux24-contenido__pantalla-icono"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3 7V4a1 1 0 0 1 1-1h3M13 3h3a1 1 0 0 1 1 1v3M17 13v3a1 1 0 0 1-1 1h-3M7 17H4a1 1 0 0 1-1-1v-3" />
    </svg>
  )
}

function VistaPrevia() {
  return (
    <section className="ux24-contenido__preview" aria-label="Vista previa del documento">
      <div className="ux24-contenido__pestanas" role="tablist" aria-label="Contenido del documento">
        <button
          type="button"
          role="tab"
          aria-selected="true"
          className="ux24-contenido__pestana ux24-contenido__pestana--activa"
        >
          <Icono nombre="visibility" />
          Vista Previa
          <span className="ux24-contenido__subrayado" aria-hidden="true" />
        </button>
        <button
          type="button"
          role="tab"
          aria-selected="false"
          className="ux24-contenido__pestana"
        >
          <Icono nombre="edit" />
          Editar documento
        </button>
      </div>

      <div className="ux24-contenido__vista">
        <article className="ux24-contenido__hoja">
          <p className="ux24-contenido__hoja-titulo">CONTRATO DE TRABAJO</p>
          <div className="ux24-contenido__hoja-texto">
            {LINEAS_HOJA_CONTENIDO.map((linea, indice) => (
              <p
                key={indice}
                className={`ux24-contenido__hoja-linea${
                  indice === 4 ? ' ux24-contenido__hoja-linea--final' : ''
                }`}
              >
                {linea}
              </p>
            ))}
          </div>
        </article>
      </div>

      <div className="ux24-contenido__controles">
        <div className="ux24-contenido__paginacion">
          <button type="button" className="ux24-contenido__flecha" aria-label="Página anterior">
            <Icono nombre="chevron_left" />
          </button>
          <span className="ux24-contenido__pagina">1 de 3</span>
          <button type="button" className="ux24-contenido__flecha" aria-label="Página siguiente">
            <Icono nombre="chevron_right" />
          </button>
        </div>

        <button type="button" className="ux24-contenido__zoom" aria-label="Zoom: 100 %">
          <span>100 %</span>
          <Icono nombre="expand_more" />
        </button>

        <button
          type="button"
          className="ux24-contenido__pantalla"
          aria-label="Pantalla completa"
        >
          <IconoPantallaCompleta />
        </button>
      </div>
    </section>
  )
}

function PieContenido() {
  return (
    <div className="ux24-contenido__pie">
      <div className="ux24-contenido__aviso">
        <IconoAviso />
        <p>{AVISO_INFORMACION}</p>
      </div>

      <div className="ux24-contenido__acciones">
        <button type="button" className="ux24-contenido__anterior">
          Anterior
        </button>
        <button type="button" className="ux24-contenido__guardar">
          <Icono nombre="save" />
          Guardar Borrador
        </button>
        <button type="button" className="ux24-contenido__confirmar">
          Confirmar
          <span className="ux24-contenido__chevron" aria-hidden="true">
            &gt;
          </span>
        </button>
      </div>
    </div>
  )
}

export function GeneracionContenido() {
  return (
    <MarcoDocumental
      breadcrumbMedio="Gestión Documental"
      breadcrumbFin="Generación de documento"
      titulo="Generación de Documento"
      subtitulo="Crea un nuevo documento para uno o más colaboradores activos."
      mostrarAccion={false}
      clase="ux24-contenido"
    >
      <StepperGeneracionDocumental activo={2} />
      <ResumenDocumento />
      <div className="ux24-contenido__cuerpo">
        <ListaVariables />
        <VistaPrevia />
      </div>
      <PieContenido />
    </MarcoDocumental>
  )
}
