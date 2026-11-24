import { Icono } from '../ux02/Cromo'
import { PaginaBandeja } from '../ux02/DisenoPagina6'
import {
  CODIGO_CONFIRMACION,
  CONFIRMACION_DERECHA,
  CONFIRMACION_IZQUIERDA,
  ESTADO_CONFIRMACION,
  type ParResumen,
} from './datos'

function Par({ par }: { par: ParResumen }) {
  return (
    <div className="ux03-par">
      <span className="ux03-par__etiqueta">{par.etiqueta}</span>
      <span
        className={
          par.enlace ? 'ux03-par__valor ux03-par__valor--enlace' : 'ux03-par__valor'
        }
      >
        {par.valor}
      </span>
    </div>
  )
}

export function DisenoConfirmacion() {
  return (
    <div className="ux02-lienzo">
      <div className="ux03-fondo" inert>
        <PaginaBandeja />
      </div>
      <div className="ux03-velo" aria-hidden="true" />

      <section
        className="ux03-modal ux03-modal--confirmacion"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ux03-confirmacion-titulo"
      >
        <div className="ux03-exito" aria-hidden="true">
          <span className="ux03-exito__circulo">
            <Icono nombre="check" />
          </span>
          <span className="ux03-exito__confeti ux03-exito__confeti--azul" />
          <span className="ux03-exito__confeti ux03-exito__confeti--ambar" />
          <span className="ux03-exito__confeti ux03-exito__confeti--rojo" />
          <span className="ux03-exito__confeti ux03-exito__confeti--verde" />
        </div>

        <h2
          id="ux03-confirmacion-titulo"
          className="ux03-modal__titulo ux03-modal__titulo--centrado"
        >
          ¡Requerimiento enviado para aprobar!
        </h2>
        <p className="ux03-modal__texto">
          La solicitud se registró correctamente y fue enviado al responsable.
        </p>
        <p className="ux03-modal__texto">
          Te detallamos el resumen del requerimiento:
        </p>

        <div className="ux03-resumen">
          <div className="ux03-resumen__cabecera">
            <span className="ux03-par__etiqueta">{CODIGO_CONFIRMACION.etiqueta}</span>
            <span className="ux03-resumen__codigo">{CODIGO_CONFIRMACION.valor}</span>
          </div>
          <hr className="ux03-resumen__divisoria" />

          <div className="ux03-resumen__columnas">
            <div className="ux03-resumen__columna">
              {CONFIRMACION_IZQUIERDA.map((par) => (
                <Par key={par.etiqueta} par={par} />
              ))}
            </div>
            <div className="ux03-resumen__columna">
              {CONFIRMACION_DERECHA.map((par) => (
                <Par key={par.etiqueta} par={par} />
              ))}
            </div>
          </div>

          <div className="ux03-resumen__estado">
            <span className="ux03-par__etiqueta">{ESTADO_CONFIRMACION.etiqueta}</span>
            <span className="ux03-par__estado">
              <Icono nombre="hourglass_empty" />
              {ESTADO_CONFIRMACION.valor}
            </span>
          </div>
        </div>

        <div className="ux03-nota">
          <Icono nombre="info" />
          <span>
            Recibirás una actualización cuando el responsable revise la solicitud,
          </span>
        </div>

        <footer className="ux03-modal__pie ux03-modal__pie--confirmacion">
          <button type="button" className="ux03-btn ux03-btn--correo">
            <Icono nombre="mail" />
            Enviar por Correo
          </button>
          <button type="button" className="ux03-btn ux03-btn--enviar">
            Volver a la Bandeja
          </button>
        </footer>
      </section>
    </div>
  )
}
