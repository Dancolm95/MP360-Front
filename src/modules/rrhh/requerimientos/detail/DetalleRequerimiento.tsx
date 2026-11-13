'use client'

import { useId, useState } from 'react'
import type { ReactNode } from 'react'
import type {
  AccionHistorial,
  DetalleRequerimiento,
  DetalleRequerimientoCanceladoCompleto,
  DetalleRequerimientoCompleto,
  EstadoRequerimiento,
  EventoHistorial,
  NivelAlerta,
  PlazoRequerimiento,
} from '../contracts'
import {
  ALERTA_LABELS,
  ESTADO_LABELS,
  MOTIVO_LABELS,
  formatearFecha,
} from '../tray/formato'
import styles from './DetalleRequerimiento.module.css'

export interface DetalleRequerimientoProps {
  readonly detalle: DetalleRequerimiento
  readonly onAsociarCandidato?: () => void
  readonly onVolver?: () => void
}

type DetalleConDatosCompletos =
  | DetalleRequerimientoCompleto
  | DetalleRequerimientoCanceladoCompleto

const ACCION_LABELS: Readonly<Record<AccionHistorial, string>> = {
  creacion: 'Creación',
  edicion: 'Edición',
  envio: 'Envío',
  reenvio: 'Reenvío',
  aprobacion: 'Aprobación',
  observacion: 'Observación',
  cancelacion: 'Cancelación',
  'fijacion-plazo': 'Fijación de plazo',
  'ajuste-plazo': 'Ajuste de plazo',
  alerta: 'Alerta de plazo',
  vencimiento: 'Vencimiento',
  'apertura-proceso': 'Apertura de proceso de selección',
  'solicitud-reversion': 'Solicitud de reversión',
  'reversion-cobertura': 'Reversión de cobertura',
  'primer-dia-real': 'Primer día real',
}

const AVISO_FECHA_OBJETIVO = 'La fecha objetivo se calcula al aprobar.'

function tieneDatosCompletos(
  detalle: DetalleRequerimiento,
): detalle is DetalleConDatosCompletos {
  if (detalle.estado === 'borrador') return false
  if (detalle.estado === 'cancelado') return detalle.datos === 'completos'
  return true
}

function formatearFechaHora(valor: string): string {
  const [fecha, hora] = valor.split('T')
  const fechaFormateada = formatearFecha(fecha)
  if (!hora) return fechaFormateada
  return `${fechaFormateada} ${hora.slice(0, 5)}`
}

function formatearMonto(monto: number): string {
  return `S/ ${monto.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function textoDiasHabiles(plazo: PlazoRequerimiento): string {
  return plazo.duracionDiasHabiles === null
    ? 'Plazo pendiente de definir'
    : `${plazo.duracionDiasHabiles} días hábiles`
}

function textoAreaSubarea(detalle: DetalleConDatosCompletos): string {
  return detalle.subarea
    ? `${detalle.area.nombre} / ${detalle.subarea.nombre}`
    : detalle.area.nombre
}

function textoUbicacion(detalle: DetalleConDatosCompletos): string {
  const { departamento, provincia, distrito } = detalle.ubicacion
  return `${departamento.nombre} / ${provincia.nombre} / ${distrito.nombre}`
}

function ValorAusente() {
  return (
    <span className={styles['rrhh-detail__ausente']}>
      —<span className="sr-only"> Sin dato</span>
    </span>
  )
}

function BadgeEstado({ estado }: { readonly estado: EstadoRequerimiento }) {
  return (
    <span
      className={`${styles['rrhh-detail__estado']} ${styles[`rrhh-detail__estado--${estado}`]}`}
    >
      {ESTADO_LABELS[estado]}
    </span>
  )
}

function AlertaPlazo({ nivel }: { readonly nivel: NivelAlerta }) {
  return (
    <span
      className={`${styles['rrhh-detail__alerta']} ${styles[`rrhh-detail__alerta--${nivel}`]}`}
    >
      <span aria-hidden="true">▲</span> Alerta: {ALERTA_LABELS[nivel]}
    </span>
  )
}

function Item({
  etiqueta,
  valor,
}: {
  readonly etiqueta: string
  readonly valor: ReactNode
}) {
  return (
    <div className={styles['rrhh-detail__item']}>
      <span className={styles['rrhh-detail__item-etiqueta']}>{etiqueta}</span>
      <span className={styles['rrhh-detail__item-valor']}>{valor}</span>
    </div>
  )
}

function HistorialItem({ evento }: { readonly evento: EventoHistorial }) {
  return (
    <li className={styles['rrhh-detail__historial-item']}>
      <span className={styles['rrhh-detail__historial-accion']}>
        {ACCION_LABELS[evento.accion]}
      </span>
      <span className={styles['rrhh-detail__historial-meta']}>
        {evento.usuario.nombre} · {formatearFechaHora(evento.fechaHora)}
      </span>
    </li>
  )
}

export function DetalleRequerimiento({
  detalle,
  onAsociarCandidato = () => {},
  onVolver = () => {},
}: DetalleRequerimientoProps) {
  const idBase = useId()
  const [historialVisible, setHistorialVisible] = useState(true)

  const datosCompletos = tieneDatosCompletos(detalle) ? detalle : null
  const alerta = detalle.plazo?.alerta ?? null
  const cobertura = detalle.cobertura
  const plazo = detalle.plazo

  const idTitulo = `${idBase}-titulo`
  const idResumen = `${idBase}-resumen`
  const idCobertura = `${idBase}-cobertura`
  const idPlazo = `${idBase}-plazo`
  const idHistorial = `${idBase}-historial`
  const idHistorialLista = `${idBase}-historial-lista`
  const idPostulantes = `${idBase}-postulantes`

  return (
    <section className={styles['rrhh-detail']} aria-labelledby={idTitulo}>
      <header className={styles['rrhh-detail__cabecera']}>
        <div>
          <p className={styles['rrhh-detail__breadcrumb']}>
            R.R.H.H / Requerimiento / Detalle
          </p>
          <h1 id={idTitulo} className={styles['rrhh-detail__titulo']}>
            Detalle de requerimiento
          </h1>
          <p className={styles['rrhh-detail__subtitulo']}>
            Requerimiento {String(detalle.id)}
          </p>
          <div className={styles['rrhh-detail__estado-linea']}>
            <BadgeEstado estado={detalle.estado} />
            {alerta ? <AlertaPlazo nivel={alerta.nivel} /> : null}
          </div>
        </div>
        <button
          type="button"
          className={styles['rrhh-detail__volver']}
          onClick={onVolver}
          aria-label="Volver a la bandeja de requerimientos"
        >
          <span aria-hidden="true">←</span> Volver a bandeja
        </button>
      </header>

      <section
        className={styles['rrhh-detail__tarjeta']}
        aria-labelledby={idResumen}
      >
        <div className={styles['rrhh-detail__tarjeta-cabecera']}>
          <div>
            <h2 id={idResumen} className={styles['rrhh-detail__tarjeta-titulo']}>
              Resumen
            </h2>
            <p className={styles['rrhh-detail__tarjeta-subtitulo']}>
              Detalle de requerimiento seleccionado
            </p>
          </div>
        </div>
        <div className={styles['rrhh-detail__resumen-grid']}>
          <Item
            etiqueta="Motivo"
            valor={
              datosCompletos ? MOTIVO_LABELS[datosCompletos.motivo] : <ValorAusente />
            }
          />
          <Item
            etiqueta="Empresa"
            valor={
              datosCompletos ? (
                <span className={styles['rrhh-detail__badge-empresa']}>
                  {datosCompletos.empresa.nombre}
                </span>
              ) : (
                <ValorAusente />
              )
            }
          />
          <Item
            etiqueta="Colaborador a reemplazar"
            valor={
              datosCompletos && datosCompletos.colaboradorAReemplazar
                ? datosCompletos.colaboradorAReemplazar.nombre
                : (
                    <ValorAusente />
                  )
            }
          />
          <Item
            etiqueta="Departamento"
            valor={
              datosCompletos ? datosCompletos.departamento.nombre : <ValorAusente />
            }
          />
          <Item
            etiqueta="Área / Subárea"
            valor={
              datosCompletos ? textoAreaSubarea(datosCompletos) : <ValorAusente />
            }
          />
          <Item
            etiqueta="Puesto solicitado"
            valor={
              datosCompletos ? datosCompletos.puesto.nombre : <ValorAusente />
            }
          />
          <Item
            etiqueta="Remuneración mensual"
            valor={
              datosCompletos ? (
                formatearMonto(datosCompletos.remuneracion.monto)
              ) : (
                <ValorAusente />
              )
            }
          />
          <Item
            etiqueta="Ubicación"
            valor={
              datosCompletos ? textoUbicacion(datosCompletos) : <ValorAusente />
            }
          />
        </div>
      </section>

      <section
        className={styles['rrhh-detail__tarjeta']}
        aria-labelledby={idCobertura}
      >
        <h2 id={idCobertura} className={styles['rrhh-detail__tarjeta-titulo']}>
          Cobertura
        </h2>
        <div className={styles['rrhh-detail__cobertura']}>
          <Item
            etiqueta="Vacantes solicitadas"
            valor={
              cobertura ? cobertura.solicitadas : <ValorAusente />
            }
          />
          <Item
            etiqueta="Cubiertas"
            valor={cobertura ? cobertura.cubiertas : <ValorAusente />}
          />
          <Item
            etiqueta="Pendientes"
            valor={cobertura ? cobertura.pendientes : <ValorAusente />}
          />
        </div>
      </section>

      <section
        className={styles['rrhh-detail__tarjeta']}
        aria-labelledby={idPlazo}
      >
        <h2 id={idPlazo} className={styles['rrhh-detail__tarjeta-titulo']}>
          Plazo
        </h2>
        <div className={styles['rrhh-detail__plazo']}>
          <Item
            etiqueta="Días hábiles"
            valor={plazo ? textoDiasHabiles(plazo) : <ValorAusente />}
          />
          <Item
            etiqueta="Fecha objetivo"
            valor={
              plazo && plazo.fechaObjetivo ? (
                <span className={styles['rrhh-detail__badge-fecha']}>
                  {formatearFecha(plazo.fechaObjetivo)}
                </span>
              ) : (
                <ValorAusente />
              )
            }
          />
          {!plazo?.fechaObjetivo ? (
            <p className={styles['rrhh-detail__aviso']}>{AVISO_FECHA_OBJETIVO}</p>
          ) : null}
        </div>
      </section>

      <section
        className={styles['rrhh-detail__tarjeta']}
        aria-labelledby={idHistorial}
      >
        <div className={styles['rrhh-detail__tarjeta-cabecera']}>
          <h2 id={idHistorial} className={styles['rrhh-detail__tarjeta-titulo']}>
            Historial
          </h2>
          <button
            type="button"
            className={styles['rrhh-detail__toggle']}
            onClick={() => setHistorialVisible((visible) => !visible)}
            aria-expanded={historialVisible}
            aria-controls={idHistorialLista}
          >
            {historialVisible ? 'Ocultar historial' : 'Mostrar historial'}
          </button>
        </div>
        {historialVisible ? (
          detalle.historial.length === 0 ? (
            <p className={styles['rrhh-detail__vacio']}>
              Sin eventos registrados.
            </p>
          ) : (
            <ul id={idHistorialLista} className={styles['rrhh-detail__historial']}>
              {detalle.historial.map((evento) => (
                <HistorialItem key={String(evento.id)} evento={evento} />
              ))}
            </ul>
          )
        ) : null}
      </section>

      <section
        className={styles['rrhh-detail__tarjeta']}
        aria-labelledby={idPostulantes}
      >
        <div className={styles['rrhh-detail__tarjeta-cabecera']}>
          <div>
            <h2
              id={idPostulantes}
              className={styles['rrhh-detail__tarjeta-titulo']}
            >
              Postulantes
            </h2>
            <p className={styles['rrhh-detail__tarjeta-subtitulo']}>
              Lista de candidatos asociados al requerimiento
            </p>
          </div>
          <button
            type="button"
            className={styles['rrhh-detail__accion-primaria']}
            onClick={onAsociarCandidato}
            aria-label="Asociar candidato al requerimiento"
          >
            <span aria-hidden="true">＋</span> Asociar candidato
          </button>
        </div>
      </section>
    </section>
  )
}
