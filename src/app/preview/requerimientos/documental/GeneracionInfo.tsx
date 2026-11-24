import { Icono } from '../ux02/Cromo'
import { MarcoDocumental } from './MarcoDocumental'
import { StepperGeneracionDocumental } from './GeneracionTipo'
import {
  AVISO_INFORMACION,
  CAMPOS_INFORMACION_DERECHA,
  CAMPOS_INFORMACION_IZQUIERDA,
  DATOS_PLANTILLA,
  OBSERVACIONES_INFORMACION,
  RESUMEN_GENERACION_DOCUMENTAL,
} from './datos'

const UBICACION_IZQUIERDA = [
  'titulo',
  'contrato',
  'inicio',
  'area',
  'puesto',
  'modalidad',
  'jornada',
] as const

const UBICACION_DERECHA = ['remuneracion', 'periodo', 'moneda'] as const

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

function IconoAviso() {
  return (
    <svg
      className="ux24-info__aviso-icono"
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

function MarcaSeccion({ children }: { children: string }) {
  return (
    <div className="ux24-info__marca">
      <span className="ux24-info__cuadro" aria-hidden="true" />
      <h2 className="ux24-info__titulo">{children}</h2>
    </div>
  )
}

function ControlCampo({
  etiqueta,
  valor,
  tipo,
  posicion,
}: (typeof CAMPOS_INFORMACION_IZQUIERDA)[number] & { posicion: string }) {
  const contenido = <span className="ux24-info__valor">{valor}</span>

  return (
    <div className={`ux24-info__campo ux24-info__campo--${posicion}`}>
      <span className="ux24-info__etiqueta">{etiqueta}</span>
      {tipo === 'select' ? (
        <button
          type="button"
          className="ux24-info__control ux24-info__control--select"
          aria-label={`${etiqueta}: ${valor}`}
        >
          {contenido}
          <Icono nombre="expand_more" />
        </button>
      ) : (
        <div className="ux24-info__control">{contenido}</div>
      )}
    </div>
  )
}

function DatosPlantilla() {
  return (
    <div className="ux24-info__plantilla">
      <Icono nombre="description" />
      {DATOS_PLANTILLA.map((dato, indice) => (
        <div key={dato.etiqueta} className={`ux24-info__pliegue ux24-info__pliegue--${indice + 1}`}>
          <p className="ux24-info__pliegue-etiqueta">{dato.etiqueta}</p>
          <p className="ux24-info__pliegue-valor">{dato.valor}</p>
          {indice < 2 ? (
            <span
              className={`ux24-info__separador ux24-info__separador--${indice + 1}`}
              aria-hidden="true"
            />
          ) : null}
        </div>
      ))}
    </div>
  )
}

function PanelInformacion() {
  return (
    <section className="ux24-info__panel" aria-label="Información del Documento">
      <MarcaSeccion>Información del Documento</MarcaSeccion>
      <DatosPlantilla />

      <div className="ux24-info__columna ux24-info__columna--izquierda">
        <MarcaSeccion>Datos del documento</MarcaSeccion>
        {CAMPOS_INFORMACION_IZQUIERDA.map((campo, indice) => (
          <ControlCampo
            key={campo.etiqueta}
            {...campo}
            posicion={UBICACION_IZQUIERDA[indice]}
          />
        ))}
      </div>

      <span className="ux24-info__eje" aria-hidden="true" />

      <div className="ux24-info__columna ux24-info__columna--derecha">
        <MarcaSeccion>Datos del documento</MarcaSeccion>
        {CAMPOS_INFORMACION_DERECHA.map((campo, indice) => (
          <ControlCampo
            key={campo.etiqueta}
            {...campo}
            posicion={UBICACION_DERECHA[indice]}
          />
        ))}

        <div className="ux24-info__campo ux24-info__campo--observaciones">
          <span className="ux24-info__etiqueta">Observaciones</span>
          <div className="ux24-info__area">{OBSERVACIONES_INFORMACION}</div>
        </div>
      </div>
    </section>
  )
}

function PieInformacion() {
  return (
    <div className="ux24-info__pie">
      <div className="ux24-info__aviso">
        <IconoAviso />
        <p>{AVISO_INFORMACION}</p>
      </div>

      <div className="ux24-info__acciones">
        <button type="button" className="ux24-info__anterior">
          Anterior
        </button>
        <button type="button" className="ux24-info__guardar">
          <Icono nombre="save" />
          Guardar Borrador
        </button>
        <button type="button" className="ux24-info__continuar">
          Continuar
          <span className="ux24-info__chevron" aria-hidden="true">
            &gt;
          </span>
        </button>
      </div>
    </div>
  )
}

export function GeneracionInfo() {
  return (
    <MarcoDocumental
      breadcrumbMedio="Gestión Documental"
      breadcrumbFin="Generación de documento"
      titulo="Generación de Documento"
      subtitulo="Crea un nuevo documento para uno o más colaboradores activos."
      mostrarAccion={false}
      clase="ux24-info"
    >
      <StepperGeneracionDocumental activo={1} />
      <ResumenDocumento />
      <PanelInformacion />
      <PieInformacion />
    </MarcoDocumental>
  )
}
