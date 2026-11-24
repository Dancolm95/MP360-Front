import { Icono } from '../ux02/Cromo'
import { MarcoDocumental } from './MarcoDocumental'
import {
  COLABORADOR_DOCUMENTAL,
  COLABORADORES_DOCUMENTAL,
  PASOS_GENERACION_DOCUMENTAL,
  PESTANAS_TIPO_DOCUMENTO,
  PLANTILLAS_CONTRATOS,
} from './datos'

function MarcaSeccion({ children, id }: { children: string; id?: string }) {
  return (
    <div className="ux24-tipo__marca">
      <span className="ux24-tipo__cuadro" aria-hidden="true" />
      <h2 className="ux24-tipo__titulo" id={id}>
        {children}
      </h2>
    </div>
  )
}

function Avatar({ clase }: { clase: string }) {
  return (
    <span className={`ux24-tipo__avatar ${clase}`} aria-hidden="true">
      <svg viewBox="0 0 48 48" focusable="false">
        <circle cx="24" cy="24" r="24" fill="#808080" />
        <circle cx="24" cy="17.5" r="8.4" fill="#fff" />
        <path d="M8.4 42c.7-8.6 7.1-13.6 15.6-13.6S38.9 33.4 39.6 42z" fill="#fff" />
      </svg>
    </span>
  )
}

export function StepperGeneracionDocumental({ activo = 0 }: { activo?: number }) {
  return (
    <div
      className="ux24-tipo__stepper"
      role="list"
      aria-label="Pasos de la generación documental"
    >
      {PASOS_GENERACION_DOCUMENTAL.map((paso, indice) => {
        const esActivo = indice === activo
        const estado = esActivo ? 'activo' : indice < activo ? 'completado' : ''
        return (
          <div
            key={paso}
            role="listitem"
            aria-current={esActivo ? 'step' : undefined}
            className={`ux24-tipo__paso ux24-tipo__paso--${indice + 1}${
              estado ? ` ux24-tipo__paso--${estado}` : ''
            }`}
          >
            <span className="ux24-tipo__numero">{indice + 1}</span>
            <span className="ux24-tipo__etiqueta-paso">{paso}</span>
          </div>
        )
      })}

      {[1, 2, 3].map((numero) => (
        <span
          key={numero}
          className={`ux24-tipo__conector ux24-tipo__conector--${numero}`}
          aria-hidden="true"
        />
      ))}
      <span className="ux24-tipo__progreso" aria-hidden="true" />
    </div>
  )
}

function SelectorColaborador() {
  return (
    <section
      className="ux24-tipo__panel ux24-tipo__panel--colaborador"
      aria-labelledby="ux24-tipo-colaborador"
    >
      <MarcaSeccion id="ux24-tipo-colaborador">Selec. Colaborador</MarcaSeccion>

      <div className="ux24-tipo__campos">
        <label className="ux24-tipo__campo ux24-tipo__campo--detalle">
          <span className="ux24-tipo__etiqueta">Detalle</span>
          <span className="ux24-tipo__busqueda">
            <Icono nombre="search" />
            <input
              type="text"
              placeholder="Buscar por nombre, DNI...."
              aria-label="Buscar por nombre, DNI"
            />
          </span>
        </label>

        <div className="ux24-tipo__campo ux24-tipo__campo--personal">
          <span className="ux24-tipo__etiqueta">Tipo de Personal</span>
          <button type="button" className="ux24-tipo__select">
            <span>Todos</span>
            <Icono nombre="expand_more" />
          </button>
        </div>
      </div>

      <div className="ux24-tipo__ficha">
        <Avatar clase="ux24-tipo__avatar--ficha" />

        <div className="ux24-tipo__identidad">
          <p className="ux24-tipo__nombre">{COLABORADOR_DOCUMENTAL.nombre}</p>
          <p className="ux24-tipo__meta">{COLABORADOR_DOCUMENTAL.nacionalidad}</p>
          <p className="ux24-tipo__meta">{COLABORADOR_DOCUMENTAL.documento}</p>
        </div>

        <span className="ux24-tipo__insignia">Postulante encontrado</span>

        <div className="ux24-tipo__contacto">
          <div className="ux24-tipo__contacto-bloque">
            <span className="ux24-tipo__contacto-etiqueta">Correo</span>
            <span className="ux24-tipo__contacto-valor">
              {COLABORADOR_DOCUMENTAL.correo}
            </span>
          </div>
          <span className="ux24-tipo__divisoria" aria-hidden="true" />
          <div className="ux24-tipo__contacto-bloque ux24-tipo__contacto-bloque--numero">
            <span className="ux24-tipo__contacto-etiqueta">Número</span>
            <span className="ux24-tipo__contacto-valor">
              {COLABORADOR_DOCUMENTAL.telefono}
            </span>
          </div>
        </div>
      </div>

      <p className="ux24-tipo__lista-titulo">Colaboradores encontrados</p>

      <ul className="ux24-tipo__lista">
        {COLABORADORES_DOCUMENTAL.map((colaborador, indice) => (
          <li key={indice} className="ux24-tipo__fila">
            <Avatar clase="ux24-tipo__avatar--fila" />
            <div className="ux24-tipo__fila-identidad">
              <p className="ux24-tipo__nombre">{colaborador.nombre}</p>
              <p className="ux24-tipo__meta">{colaborador.cargo}</p>
              <p className="ux24-tipo__meta">{colaborador.documento}</p>
            </div>
            <button
              type="button"
              className={`ux24-tipo__seleccionar${
                indice === 0 ? ' ux24-tipo__seleccionar--activo' : ''
              }`}
            >
              {indice === 0 ? 'Seleccionado' : 'Seleccionar'}
            </button>
          </li>
        ))}
      </ul>

      <span className="ux24-tipo__scroll" aria-hidden="true" />
    </section>
  )
}

function IconoAviso() {
  return (
    <svg
      className="ux24-tipo__aviso-icono"
      viewBox="0 0 22 22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="11" cy="11" r="9.6" />
      <path d="M11 6.2v6.1" strokeLinecap="round" />
      <circle cx="11" cy="15.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

function TipoSolicitud() {
  return (
    <section
      className="ux24-tipo__panel ux24-tipo__panel--solicitud"
      aria-labelledby="ux24-tipo-solicitud"
    >
      <MarcaSeccion id="ux24-tipo-solicitud">Tipo de Solicitud</MarcaSeccion>

      <p className="ux24-tipo__indicacion">
        Selecciona la plantilla o el tipo de documento a generar.
      </p>

      <div
        className="ux24-tipo__pestanas"
        role="tablist"
        aria-label="Tipos de documento"
      >
        {PESTANAS_TIPO_DOCUMENTO.map((pestana, indice) => (
          <button
            key={pestana.etiqueta}
            type="button"
            role="tab"
            aria-selected={indice === 0}
            style={{ width: `${pestana.ancho}px` }}
            className={`ux24-tipo__pestana${
              indice === 0 ? ' ux24-tipo__pestana--activa' : ''
            }`}
          >
            <Icono nombre="description" />
            {pestana.etiqueta}
          </button>
        ))}
      </div>

      <div className="ux24-tipo__plantillas">
        {PLANTILLAS_CONTRATOS.map((plantilla) => (
          <button
            key={plantilla.nombre}
            type="button"
            aria-pressed={Boolean(plantilla.seleccionada)}
            className={`ux24-tipo__plantilla${
              plantilla.seleccionada ? ' ux24-tipo__plantilla--activa' : ''
            }`}
          >
            <span className="ux24-tipo__radio" aria-hidden="true" />
            <Icono nombre="description" />
            <span className="ux24-tipo__plantilla-nombre">{plantilla.nombre}</span>
            <span className="ux24-tipo__plantilla-desc">{plantilla.descripcion}</span>
          </button>
        ))}
      </div>

      <div className="ux24-tipo__aviso">
        <IconoAviso />
        <p>
          El documento se generará{'  '}con la información del colaborador
          seleccionado y las variables configuradas en la pantall
        </p>
      </div>
    </section>
  )
}

function Acciones() {
  return (
    <div className="ux24-tipo__acciones">
      <button type="button" className="ux24-tipo__cancelar">
        Cancelar
      </button>

      <div className="ux24-tipo__acciones-grupo">
        <button type="button" className="ux24-tipo__guardar">
          <Icono nombre="save" />
          Guardar Borrador
        </button>
        <button type="button" className="ux24-tipo__continuar">
          Continuar
          <span className="ux24-tipo__chevron" aria-hidden="true">
            &gt;
          </span>
        </button>
      </div>
    </div>
  )
}

export function GeneracionTipo() {
  return (
    <MarcoDocumental
      breadcrumbMedio="Gestión Documental"
      breadcrumbFin="Generación de documento"
      titulo="Generación de Documento"
      subtitulo="Crea un nuevo documento para uno o más colaboradores activos."
      accionEtiqueta="Volver a Gestión Documental"
      accionIcono="chevron_left"
      clase="ux24-tipo"
    >
      <StepperGeneracionDocumental />

      <div className="ux24-tipo__cuerpo">
        <SelectorColaborador />

        <div className="ux24-tipo__derecha">
          <TipoSolicitud />
          <Acciones />
        </div>
      </div>
    </MarcoDocumental>
  )
}
