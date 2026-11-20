import { Icono } from '../ux02/Cromo'
import { MarcoOffboarding } from './BandejaOffboarding'
import { StepperOffboarding } from './OffboardingDatos'
import {
  DATOS_EX_COLABORADOR_OFFBOARDING,
  MENSAJE_EXITO_OFFBOARDING,
  PROCESOS_REALIZADOS_OFFBOARDING,
  TITULO_EXITO_OFFBOARDING,
  type EstadoProcesoRealizado,
} from './datos'

const VARIANTE_ESTADO: Record<EstadoProcesoRealizado, string> = {
  Completo: 'ux16-cierre__badge--completo',
  'En Proceso': 'ux16-cierre__badge--proceso',
  Pendiente: 'ux16-cierre__badge--pendiente',
}

function Avatar() {
  return (
    <span className="ux16-cierre__avatar" aria-hidden="true">
      <svg viewBox="0 0 38 38" focusable="false">
        <circle cx="19" cy="19" r="19" fill="#1e4bf2" />
        <circle cx="19" cy="14" r="6.4" fill="#fff" />
        <path d="M6.6 32.6c.6-6.9 5.8-11 12.4-11s11.8 4.1 12.4 11z" fill="#fff" />
      </svg>
    </span>
  )
}

function Exito() {
  return (
    <div className="ux16-cierre__exito">
      <div className="ux16-cierre__halo" aria-hidden="true">
        <span className="ux16-cierre__circulo">
          <Icono nombre="check" />
        </span>
        <span className="ux16-cierre__confeti ux16-cierre__confeti--azul-izq" />
        <span className="ux16-cierre__confeti ux16-cierre__confeti--ambar-izq" />
        <span className="ux16-cierre__confeti ux16-cierre__confeti--rojo" />
        <span className="ux16-cierre__confeti ux16-cierre__confeti--azul-der" />
        <span className="ux16-cierre__confeti ux16-cierre__confeti--verde" />
        <span className="ux16-cierre__confeti ux16-cierre__confeti--ambar-der" />
      </div>

      <h2 className="ux16-cierre__titulo" id="ux16-cierre-titulo">
        {TITULO_EXITO_OFFBOARDING}
      </h2>
      <p className="ux16-cierre__mensaje">{MENSAJE_EXITO_OFFBOARDING}</p>
    </div>
  )
}

function DatosColaborador() {
  return (
    <section className="ux16-cierre__datos" aria-labelledby="ux16-cierre-datos">
      <div className="ux16-cierre__datos-cabecera">
        <Avatar />
        <h3 className="ux16-cierre__datos-titulo" id="ux16-cierre-datos">
          Datos del Colaborador
        </h3>
        <span className="ux16-cierre__activo">
          <span className="ux16-cierre__activo-check">
            <Icono nombre="check" />
          </span>
          Activo
        </span>
      </div>

      <div className="ux16-cierre__datos-cuerpo">
        <dl className="ux16-cierre__datos-lista ux16-cierre__datos-lista--izquierda">
          {DATOS_EX_COLABORADOR_OFFBOARDING.slice(0, 4).map((dato) => (
            <div key={dato.etiqueta} className="ux16-cierre__dato">
              <dt>{dato.etiqueta}</dt>
              <dd>{dato.valor}</dd>
            </div>
          ))}
        </dl>

        <dl className="ux16-cierre__datos-lista ux16-cierre__datos-lista--derecha">
          {DATOS_EX_COLABORADOR_OFFBOARDING.slice(4).map((dato) => (
            <div key={dato.etiqueta} className="ux16-cierre__dato">
              <dt>{dato.etiqueta}</dt>
              <dd>{dato.valor}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

function Procesos() {
  return (
    <section className="ux16-cierre__procesos" aria-labelledby="ux16-cierre-procesos">
      <h3 className="ux16-cierre__procesos-titulo" id="ux16-cierre-procesos">
        Procesos realizados
      </h3>

      <div className="ux16-cierre__chips">
        {PROCESOS_REALIZADOS_OFFBOARDING.map((proceso) => (
          <div key={proceso.titulo} className="ux16-cierre__chip">
            <span
              className={`ux16-cierre__chip-icono${
                proceso.estado === 'Completo'
                  ? ' ux16-cierre__chip-icono--completo'
                  : ' ux16-cierre__chip-icono--pendiente'
              }`}
              aria-hidden="true"
            >
              <Icono nombre={proceso.estado === 'Completo' ? 'check' : 'schedule'} />
            </span>

            <div className="ux16-cierre__chip-texto">
              <p className="ux16-cierre__chip-titulo">{proceso.titulo}</p>
              {proceso.detalle ? (
                <p className="ux16-cierre__chip-detalle">{proceso.detalle}</p>
              ) : null}
            </div>

            <span className={`ux16-cierre__badge ${VARIANTE_ESTADO[proceso.estado]}`}>
              {proceso.estado}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

export function OffboardingCierre() {
  return (
    <MarcoOffboarding
      breadcrumbFin="Procesos de offboarding"
      titulo="Proceso de offboarding"
      subtitulo="Registra la causal de cese y gestiona la hoja de ruta de salida del colaborador."
      clase="ux16-lienzo--cierre"
    >
      <div className="ux16-cierre">
        <div className="ux16-cierre__stepper">
          <StepperOffboarding activo={5} activos={[1, 2, 3, 4, 5]} />
        </div>

        <section className="ux16-cierre__panel" aria-labelledby="ux16-cierre-titulo">
          <Exito />
          <DatosColaborador />
          <Procesos />

          <div className="ux16-cierre__acciones">
            <button type="button" className="ux16-cierre__boton">
              <Icono nombre="person" />
              Ver ficha del exColaborador
            </button>
            <button type="button" className="ux16-cierre__boton">
              <Icono nombre="description" />
              Registrar otro offboarding
            </button>
            <button
              type="button"
              className="ux16-cierre__boton ux16-cierre__boton--primario"
            >
              <Icono nombre="assignment" />
              Ir a Offboardings
            </button>
          </div>
        </section>
      </div>
    </MarcoOffboarding>
  )
}
