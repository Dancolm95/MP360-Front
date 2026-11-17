import { Icono } from '../ux02/Cromo'
import { PaginaBandeja } from '../ux02/DisenoPagina6'
import { CAMPOS, COMENTARIO, PASOS, type CampoRequerimiento } from './datos'

function Etiqueta({
  htmlFor,
  children,
  obligatorio,
}: {
  htmlFor?: string
  children: string
  obligatorio?: boolean
}) {
  return (
    <span className="ux03-etiqueta">
      <label htmlFor={htmlFor}>{children}</label>
      {obligatorio ? (
        <span className="ux03-obligatorio" aria-hidden="true">
          *
        </span>
      ) : null}
    </span>
  )
}

function Control({ campo, indice }: { campo: CampoRequerimiento; indice: number }) {
  const id = `ux03-campo-${indice}`

  return (
    <div className="ux03-campo">
      <Etiqueta htmlFor={id} obligatorio={campo.obligatorio}>
        {campo.etiqueta}
      </Etiqueta>

      {campo.tipo === 'select' ? (
        <button
          id={id}
          type="button"
          className="ux03-control ux03-control--select"
          aria-haspopup="listbox"
        >
          <span className="ux03-control__marcador">{campo.marcador}</span>
          <Icono nombre="expand_more" />
        </button>
      ) : (
        <span className="ux03-control">
          {campo.icono ? <Icono nombre={campo.icono} /> : null}
          <input
            id={id}
            type="text"
            inputMode={campo.tipo === 'numero' ? 'decimal' : undefined}
            defaultValue={campo.tipo === 'numero' ? campo.marcador : undefined}
            placeholder={campo.tipo === 'fecha' ? campo.marcador : undefined}
            aria-label={campo.etiqueta}
          />
        </span>
      )}
    </div>
  )
}

export function DisenoFormulario() {
  return (
    <div className="ux02-lienzo">
      <div className="ux03-fondo" inert>
        <PaginaBandeja />
      </div>
      <div className="ux03-velo" aria-hidden="true" />

      <section
        className="ux03-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ux03-formulario-titulo"
      >
        <header className="ux03-modal__cabecera">
          <span className="ux03-modal__icono">
            <Icono nombre="description" />
          </span>
          <div className="ux03-modal__titulos">
            <h2 id="ux03-formulario-titulo" className="ux03-modal__titulo">
              Nuevo requerimiento de personal
            </h2>
            <p className="ux03-modal__subtitulo">
              Llena el fomulario y solicita su revisión
            </p>
          </div>
          <button type="button" className="ux03-modal__cerrar" aria-label="Cerrar">
            <svg viewBox="0 0 18 18" width="18" height="18" aria-hidden="true" focusable="false">
              <path d="M1 1 17 17M17 1 1 17" stroke="currentColor" strokeWidth="1.1" />
            </svg>
          </button>
        </header>

        <ol className="ux03-pasos">
          <li className="ux03-paso ux03-paso--activo">
            <span className="ux03-paso__numero">1</span>
            <span className="ux03-paso__texto">{PASOS[0]}</span>
          </li>
          <li aria-hidden="true" className="ux03-pasos__conector" />
          <li className="ux03-paso">
            <span className="ux03-paso__numero">2</span>
            <span className="ux03-paso__texto">{PASOS[1]}</span>
          </li>
        </ol>

        <div className="ux03-campos">
          {CAMPOS.map((campo, indice) => (
            <Control key={campo.etiqueta} campo={campo} indice={indice} />
          ))}
        </div>

        <div className="ux03-campo ux03-campo--ancho">
          <Etiqueta htmlFor="ux03-comentario">{COMENTARIO.etiqueta}</Etiqueta>
          <span className="ux03-control ux03-control--area">
            <textarea id="ux03-comentario" placeholder={COMENTARIO.marcador} rows={3} />
          </span>
        </div>

        <footer className="ux03-modal__pie">
          <button type="button" className="ux03-btn ux03-btn--borrador">
            <Icono nombre="bookmark" />
            Guardar borrador
          </button>
          <button type="button" className="ux03-btn ux03-btn--enviar">
            <Icono nombre="send" />
            Enviar requerimiento
          </button>
        </footer>
      </section>
    </div>
  )
}
