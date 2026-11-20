import { Icono } from '../ux02/Cromo'
import { MarcoOffboarding } from './BandejaOffboarding'
import { StepperOffboarding } from './OffboardingDatos'
import {
  CHECKLIST_SALIDA_OFFBOARDING,
  COLABORADOR_CHECKLIST_OFFBOARDING,
  FICHA_CHECKLIST_OFFBOARDING,
  NOTA_CHECKLIST_OFFBOARDING,
  PUESTO_CHECKLIST_OFFBOARDING,
  REVISIONES_AREAS_OFFBOARDING,
  type EstadoRevisionArea,
  type TareaChecklistOffboarding,
} from './datos'

const VARIANTE_ESTADO: Record<EstadoRevisionArea, string> = {
  Confirmado: 'ux16-checklist__badge--confirmado',
  'En revisión': 'ux16-checklist__badge--revision',
  'No aplica': 'ux16-checklist__badge--no-aplica',
}

function Avatar() {
  return (
    <span className="ux16-checklist__avatar" aria-hidden="true">
      <svg viewBox="0 0 34 34" focusable="false">
        <circle cx="17" cy="17" r="17" fill="#808080" />
        <circle cx="17" cy="12.5" r="6.2" fill="#fff" />
        <path d="M5.8 29.5c.5-6.1 5.2-9.7 11.2-9.7s10.7 3.6 11.2 9.7z" fill="#fff" />
      </svg>
    </span>
  )
}

function IconoAviso() {
  return (
    <svg
      className="ux16-checklist__aviso"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 7v6" />
      <path d="M12 16.5v.5" />
    </svg>
  )
}

function Ficha() {
  const colaborador = COLABORADOR_CHECKLIST_OFFBOARDING

  return (
    <section className="ux16-checklist__ficha" aria-label="Datos del proceso de offboarding">
      <div className="ux16-checklist__persona">
        <Avatar />
        <div className="ux16-checklist__persona-texto">
          <p className="ux16-checklist__nombre">{colaborador.nombre}</p>
          <p className="ux16-checklist__meta">{colaborador.documento}</p>
          <p className="ux16-checklist__meta">{PUESTO_CHECKLIST_OFFBOARDING}</p>
        </div>
      </div>

      {FICHA_CHECKLIST_OFFBOARDING.map((dato, indice) => (
        <div
          key={dato.etiqueta}
          className={`ux16-checklist__dato ux16-checklist__dato--${indice + 1}`}
        >
          <span className="ux16-checklist__dato-etiqueta">{dato.etiqueta}</span>
          <span className="ux16-checklist__dato-valor">{dato.valor}</span>
        </div>
      ))}
    </section>
  )
}

function Tarea({ tarea }: { tarea: TareaChecklistOffboarding }) {
  return (
    <div className="ux16-checklist__tarea">
      <span className="ux16-checklist__casilla" aria-hidden="true" />
      <div className="ux16-checklist__tarea-texto">
        <p className="ux16-checklist__tarea-titulo">{tarea.titulo}</p>
        <p className="ux16-checklist__tarea-descripcion">{tarea.descripcion}</p>
      </div>
      <button
        type="button"
        className="ux16-checklist__menu"
        aria-label={`Acciones de ${tarea.titulo}`}
      >
        <Icono nombre="more_vert" />
      </button>
    </div>
  )
}

function Checklist() {
  return (
    <section className="ux16-checklist__card ux16-checklist__card--tareas" aria-labelledby="ux16-checklist-titulo">
      <div className="ux16-checklist__cabecera">
        <span className="ux16-checklist__marca" aria-hidden="true" />
        <h2 className="ux16-checklist__titulo" id="ux16-checklist-titulo">
          Checklist de Salida
        </h2>

        <div className="ux16-checklist__marcar">
          <span className="ux16-checklist__casilla" aria-hidden="true" />
          <span>Marcar todas las casillas</span>
        </div>
      </div>

      <div className="ux16-checklist__columnas">
        {[0, 1].map((columna) => (
          <div key={columna} className="ux16-checklist__grupo">
            {CHECKLIST_SALIDA_OFFBOARDING.slice(columna * 4, columna * 4 + 4).map((tarea) => (
              <Tarea key={tarea.titulo} tarea={tarea} />
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

function Revisiones() {
  return (
    <section className="ux16-checklist__card ux16-checklist__card--areas" aria-labelledby="ux16-areas-titulo">
      <div className="ux16-checklist__cabecera">
        <span className="ux16-checklist__marca" aria-hidden="true" />
        <h2 className="ux16-checklist__titulo" id="ux16-areas-titulo">
          Revisión por áreas
        </h2>
      </div>

      <div className="ux16-checklist__tabla" role="table" aria-label="Revisión por áreas">
        <div className="ux16-checklist__fila ux16-checklist__fila--cabecera" role="row">
          <span role="columnheader">Área</span>
          <span role="columnheader">Responsable</span>
          <span role="columnheader">Revisión / Alcance</span>
          <span role="columnheader">Estado</span>
          <span role="columnheader">Fecha de validación</span>
          <span role="columnheader">Observaciones</span>
          <span role="columnheader" aria-label="Acciones" />
        </div>

        {REVISIONES_AREAS_OFFBOARDING.map((fila) => (
          <div key={fila.area} className="ux16-checklist__fila" role="row">
            <span role="cell" className="ux16-checklist__celda--fuerte">
              {fila.area}
            </span>
            <span role="cell" className="ux16-checklist__celda--fuerte">
              {fila.responsable}
            </span>
            <span role="cell" className="ux16-checklist__celda--fuerte">
              {fila.alcance}
            </span>
            <span role="cell">
              <span className={`ux16-checklist__badge ${VARIANTE_ESTADO[fila.estado]}`}>
                {fila.estado}
              </span>
            </span>
            <span role="cell" className="ux16-checklist__celda--gris">
              {fila.fecha}
            </span>
            <span role="cell" className="ux16-checklist__celda--gris">
              {fila.observaciones}
            </span>
            <span role="cell" className="ux16-checklist__acciones-celda">
              <button
                type="button"
                className="ux16-checklist__menu"
                aria-label={`Acciones de ${fila.area}`}
              >
                <Icono nombre="more_vert" />
              </button>
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

function Pie() {
  return (
    <div className="ux16-checklist__pie">
      <p className="ux16-checklist__nota">
        <IconoAviso />
        <span>{NOTA_CHECKLIST_OFFBOARDING}</span>
      </p>

      <div className="ux16-checklist__acciones">
        <button type="button" className="ux16-checklist__anterior">
          Anterior
        </button>

        <div className="ux16-checklist__acciones-grupo">
          <button type="button" className="ux16-checklist__guardar">
            <Icono nombre="save" />
            Guardar Borrador
          </button>
          <button type="button" className="ux16-checklist__continuar">
            Continuar
            <span className="ux16-checklist__chevron" aria-hidden="true">
              &gt;
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export function OffboardingChecklist() {
  return (
    <MarcoOffboarding
      breadcrumbFin="Procesos de offboarding"
      titulo="Proceso de Offboarding"
      subtitulo="Registra la causal de cese y gestiona la hoja de ruta de salida del colaborador."
      accionEtiqueta="Regresar a Offboarding"
      clase="ux16-lienzo--checklist"
    >
      <div className="ux16-checklist">
        <div className="ux16-checklist__stepper">
          <StepperOffboarding activo={2} activos={[1, 2, 3]} />
        </div>

        <Ficha />
        <Checklist />
        <Revisiones />
        <Pie />
      </div>
    </MarcoOffboarding>
  )
}
