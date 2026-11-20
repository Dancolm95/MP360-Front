import type { ReactNode } from 'react'
import { Icono } from '../ux02/Cromo'
import { MarcoOffboarding } from './BandejaOffboarding'
import {
  CAUSAL_OFFBOARDING,
  CESE_PROGRAMADO_OFFBOARDING,
  COLABORADOR_SELECCIONADO,
  COLABORADORES_ENCONTRADOS,
  CONTADOR_MOTIVO_OFFBOARDING,
  FECHA_CESE_OFFBOARDING,
  MOTIVO_OFFBOARDING,
  PASOS_OFFBOARDING,
  RESUMEN_OFFBOARDING,
  type ColaboradorOffboarding,
} from './datos'

function Avatar() {
  return (
    <span className="ux16-datos__avatar" aria-hidden="true">
      <svg viewBox="0 0 46 46" focusable="false">
        <circle cx="23" cy="23" r="23" fill="#808080" />
        <circle cx="23" cy="17" r="8" fill="#fff" />
        <path d="M8 40c.7-8.2 6.8-13 15-13s14.3 4.8 15 13z" fill="#fff" />
      </svg>
    </span>
  )
}

function TituloSeccion({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <div className="ux16-datos__titulo-seccion">
      <span className="ux16-datos__marca" aria-hidden="true" />
      <h2 className="ux16-datos__titulo" id={id}>
        {children}
      </h2>
    </div>
  )
}

function NumeroPaso({ numero, activo }: { numero: number; activo: boolean }) {
  return (
    <span
      className={`ux16-datos__numero${activo ? ' ux16-datos__numero--activo' : ''}`}
    >
      {numero}
    </span>
  )
}

export function StepperOffboarding({ activo }: { activo: number }) {
  return (
    <div className="ux16-datos__stepper" role="list" aria-label="Etapas del offboarding">
      {PASOS_OFFBOARDING.map((paso, indice) => {
        const numero = indice + 1
        const esActivo = numero === activo
        return (
          <div
            key={paso}
            role="listitem"
            aria-current={esActivo ? 'step' : undefined}
            className={`ux16-datos__paso ux16-datos__paso--${numero}${
              esActivo ? ' ux16-datos__paso--activo' : ''
            }`}
          >
            <NumeroPaso numero={numero} activo={esActivo} />
            <span className="ux16-datos__etiqueta">{paso}</span>
          </div>
        )
      })}

      {[1, 2, 3, 4].map((numero) => (
        <span
          key={numero}
          className={`ux16-datos__conector ux16-datos__conector--${numero}`}
          aria-hidden="true"
        />
      ))}
      <span className="ux16-datos__progreso" aria-hidden="true" />
    </div>
  )
}

function Identidad({ colaborador }: { colaborador: ColaboradorOffboarding }) {
  return (
    <div className="ux16-datos__identidad">
      <Avatar />
      <div className="ux16-datos__identidad-texto">
        <p className="ux16-datos__nombre">{colaborador.nombre}</p>
        <p className="ux16-datos__meta">{colaborador.nacionalidad}</p>
        <p className="ux16-datos__meta">{colaborador.documento}</p>
      </div>
    </div>
  )
}

function SeleccionColaborador() {
  return (
    <section className="ux16-datos__panel" aria-labelledby="ux16-datos-colaborador">
      <TituloSeccion id="ux16-datos-colaborador">Selec. Colaborador</TituloSeccion>

      <div className="ux16-datos__campos">
        <label className="ux16-datos__campo ux16-datos__campo--detalle">
          <span className="ux16-datos__campo-etiqueta">Detalle</span>
          <span className="ux16-datos__busqueda">
            <Icono nombre="search" />
            <input
              type="text"
              placeholder="Buscar por nombre, DNI...."
              aria-label="Buscar por nombre, DNI"
            />
          </span>
        </label>

        <div className="ux16-datos__campo">
          <span className="ux16-datos__campo-etiqueta">Tipo de documento</span>
          <button type="button" className="ux16-datos__select">
            <span>Todos</span>
            <Icono nombre="expand_more" />
          </button>
        </div>

        <label className="ux16-datos__campo">
          <span className="ux16-datos__campo-etiqueta">Número de documento</span>
          <input
            className="ux16-datos__entrada"
            type="text"
            aria-label="Número de documento"
          />
        </label>
      </div>

      <div className="ux16-datos__seleccionado">
        <Identidad colaborador={COLABORADOR_SELECCIONADO} />
        <span className="ux16-datos__insignia">Postulante encontrado</span>

        <div className="ux16-datos__seleccionado-detalle">
          <div>
            <span className="ux16-datos__detalle-etiqueta">Correo</span>
            <span className="ux16-datos__detalle-valor">
              {COLABORADOR_SELECCIONADO.correo}
            </span>
          </div>
          <div>
            <span className="ux16-datos__detalle-etiqueta">Número</span>
            <span className="ux16-datos__detalle-valor">
              {COLABORADOR_SELECCIONADO.telefono}
            </span>
          </div>
          <div>
            <span className="ux16-datos__detalle-etiqueta">Estado en proceso</span>
            <span className="ux16-datos__detalle-enlace">
              Seleccionado para Offboarding
            </span>
          </div>
        </div>
      </div>

      <p className="ux16-datos__lista-titulo">Colaboradores encontrados</p>

      <ul className="ux16-datos__lista">
        {COLABORADORES_ENCONTRADOS.map((colaborador, indice) => (
          <li key={indice} className="ux16-datos__fila">
            <Avatar />
            <div className="ux16-datos__fila-identidad">
              <p className="ux16-datos__nombre">{colaborador.nombre}</p>
              <p className="ux16-datos__meta">{colaborador.nacionalidad}</p>
              <p className="ux16-datos__meta">{colaborador.documento}</p>
            </div>
            <div className="ux16-datos__fila-datos">
              <span className="ux16-datos__detalle-etiqueta">Datos</span>
              <span className="ux16-datos__fila-valor">{colaborador.telefono}</span>
              <span className="ux16-datos__fila-valor">{colaborador.correo}</span>
            </div>
            <button
              type="button"
              className={`ux16-datos__seleccionar${
                indice === 0 ? ' ux16-datos__seleccionar--activo' : ''
              }`}
            >
              {indice === 0 ? 'Seleccionado' : 'Seleccionar'}
            </button>
          </li>
        ))}
      </ul>

      <span className="ux16-datos__scroll" aria-hidden="true" />
    </section>
  )
}

function CausalYFecha() {
  return (
    <section className="ux16-datos__card ux16-datos__card--causal">
      <TituloSeccion>Causal y fecha de cese</TituloSeccion>

      <div className="ux16-datos__fila-campos">
        <div className="ux16-datos__campo">
          <span className="ux16-datos__campo-etiqueta">Causal de cese</span>
          <button type="button" className="ux16-datos__select">
            <span>{CAUSAL_OFFBOARDING}</span>
            <Icono nombre="expand_more" />
          </button>
        </div>

        <div className="ux16-datos__campo">
          <span className="ux16-datos__campo-etiqueta">
            Fecha de último día de labores
          </span>
          <button type="button" className="ux16-datos__select">
            <span>{FECHA_CESE_OFFBOARDING}</span>
            <Icono nombre="expand_more" />
          </button>
        </div>
      </div>

      <label className="ux16-datos__campo ux16-datos__campo--motivo">
        <span className="ux16-datos__campo-etiqueta">Motivo / Observaciones</span>
        <span className="ux16-datos__motivo">
          <textarea readOnly defaultValue={MOTIVO_OFFBOARDING} />
          <span className="ux16-datos__contador" aria-hidden="true">
            {CONTADOR_MOTIVO_OFFBOARDING}
          </span>
        </span>
      </label>
    </section>
  )
}

function Resumen() {
  return (
    <section className="ux16-datos__card ux16-datos__card--resumen">
      <TituloSeccion>Resumen del proceso</TituloSeccion>

      <p className="ux16-datos__cese">{CESE_PROGRAMADO_OFFBOARDING}</p>

      <div className="ux16-datos__resumen-fila">
        {RESUMEN_OFFBOARDING.map((dato, indice) => (
          <div
            key={dato.etiqueta}
            className={`ux16-datos__resumen-dato ux16-datos__resumen-dato--${
              indice + 1
            }`}
          >
            <span className="ux16-datos__resumen-etiqueta">{dato.etiqueta}</span>
            <span
              className={`ux16-datos__resumen-valor${
                dato.tono === 'azul' ? ' ux16-datos__resumen-valor--azul' : ''
              }`}
            >
              {dato.valor}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

function Acciones() {
  return (
    <div className="ux16-datos__acciones">
      <button type="button" className="ux16-datos__cancelar">
        Cancelar
      </button>

      <div className="ux16-datos__acciones-grupo">
        <button type="button" className="ux16-datos__guardar">
          <Icono nombre="save" />
          Guardar Borrador
        </button>
        <button type="button" className="ux16-datos__continuar">
          Continuar
          <span className="ux16-datos__chevron" aria-hidden="true">
            &gt;
          </span>
        </button>
      </div>
    </div>
  )
}

export function OffboardingDatos() {
  return (
    <MarcoOffboarding
      breadcrumbFin="Procesos de offboarding"
      titulo="Proceso de Offboarding"
      subtitulo="Registra la causal de cese y gestiona la hoja de ruta de salida del colaborador."
      accionEtiqueta="Regresar a Offboarding"
      clase="ux16-lienzo--datos"
    >
      <StepperOffboarding activo={1} />

      <div className="ux16-datos__rejilla">
        <SeleccionColaborador />

        <div className="ux16-datos__columna">
          <CausalYFecha />
          <Resumen />
          <Acciones />
        </div>
      </div>
    </MarcoOffboarding>
  )
}
