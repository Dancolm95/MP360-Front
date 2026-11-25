'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { ReactNode, RefObject } from 'react'
import type {
  AccionHistorial,
  DetalleRequerimiento as DetalleRequerimientoContrato,
  DetalleRequerimientoCanceladoCompleto,
  DetalleRequerimientoCompleto,
  EstadoRequerimiento,
  NivelAlerta,
  PlazoRequerimiento,
} from '../contracts'
import {
  ALERTA_LABELS,
  AVISO_DURACION,
  ESTADO_LABELS,
  MOTIVO_LABELS,
} from '../model/etiquetas'
import { formatearFecha } from '../model/formato'
import { crearDetalleUx04, type EntradaHistorial } from './model'
import styles from './DetalleRequerimiento.module.css'

interface DetalleRequerimientoPropsComunes {
  readonly onAsociarCandidato?: () => void
  readonly onVolver?: () => void
}

export type DetalleRequerimientoProps =
  | (DetalleRequerimientoPropsComunes & {
      readonly estado?: 'listo'
      readonly detalle: DetalleRequerimientoContrato
    })
  | (DetalleRequerimientoPropsComunes & { readonly estado: 'cargando' })
  | (DetalleRequerimientoPropsComunes & {
      readonly estado: 'error'
      readonly mensajeError?: string
      readonly onReintentar?: () => void
    })
  | (DetalleRequerimientoPropsComunes & { readonly estado: 'sin-permisos' })

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

function tieneDatosCompletos(
  detalle: DetalleRequerimientoContrato,
): detalle is DetalleConDatosCompletos {
  if (detalle.estado === 'borrador') return false
  if (detalle.estado === 'cancelado') return detalle.datos === 'completos'
  return true
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
      <dt className={styles['rrhh-detail__item-etiqueta']}>{etiqueta}</dt>
      <dd className={styles['rrhh-detail__item-valor']}>{valor}</dd>
    </div>
  )
}

function DatoHistorial({
  etiqueta,
  valor,
}: {
  readonly etiqueta: string
  readonly valor: string
}) {
  return (
    <div className={styles['rrhh-detail__historial-dato']}>
      <dt>{etiqueta}</dt>
      <dd>{valor}</dd>
    </div>
  )
}

function textoEstado(entrada: EntradaHistorial): string | null {
  if (entrada.estadoAnteriorEtiqueta === null) {
    return entrada.estadoNuevoEtiqueta
  }
  return `${entrada.estadoAnteriorEtiqueta} → ${
    entrada.estadoNuevoEtiqueta ?? 'Sin estado'
  }`
}

function HistorialItem({ entrada }: { readonly entrada: EntradaHistorial }) {
  const estado = textoEstado(entrada)
  const tieneDetalles =
    estado !== null || entrada.comentario !== null || entrada.detalles.length > 0

  return (
    <li className={styles['rrhh-detail__historial-item']}>
      <div className={styles['rrhh-detail__historial-cabecera']}>
        <span className={styles['rrhh-detail__historial-accion']}>
          <span className="sr-only">Acción: </span>
          {ACCION_LABELS[entrada.accion]}
        </span>
        <span className={styles['rrhh-detail__historial-meta']}>
          <span className="sr-only">Usuario: </span>
          {entrada.usuario.nombre}
          <span aria-hidden="true"> · </span>
          <span className="sr-only">Fecha y hora: </span>
          {entrada.fechaHoraTexto}
        </span>
      </div>
      {tieneDetalles ? (
        <dl className={styles['rrhh-detail__historial-datos']}>
          {estado !== null ? <DatoHistorial etiqueta="Estado" valor={estado} /> : null}
          {entrada.comentario !== null ? (
            <DatoHistorial etiqueta="Comentario" valor={entrada.comentario} />
          ) : null}
          {entrada.detalles.map((detalle) => (
            <DatoHistorial
              key={`${String(entrada.id)}-${detalle.etiqueta}`}
              etiqueta={detalle.etiqueta}
              valor={detalle.valor}
            />
          ))}
        </dl>
      ) : null}
    </li>
  )
}

function textoInvarianteCobertura(
  invariante: { readonly esperado: number; readonly consistente: boolean },
): string {
  return invariante.consistente
    ? `Cobertura consistente: pendientes = solicitadas − cubiertas (${invariante.esperado}).`
    : `Cobertura inconsistente: pendientes no coincide con solicitadas − cubiertas (${invariante.esperado}).`
}

function CabeceraEstado({
  idTitulo,
  tituloRef,
  onVolver,
}: {
  readonly idTitulo: string
  readonly tituloRef: RefObject<HTMLHeadingElement | null>
  readonly onVolver: () => void
}) {
  return (
    <header className={styles['rrhh-detail__cabecera']}>
      <div>
        <p className={styles['rrhh-detail__breadcrumb']}>
          R.R.H.H / Requerimiento / Detalle
        </p>
        <h1
          id={idTitulo}
          ref={tituloRef}
          tabIndex={-1}
          className={styles['rrhh-detail__titulo']}
        >
          Detalle de requerimiento
        </h1>
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
  )
}

export function DetalleRequerimiento(props: DetalleRequerimientoProps) {
  const { onAsociarCandidato = () => {}, onVolver = () => {} } = props
  const idBase = useId()
  const tituloRef = useRef<HTMLHeadingElement>(null)
  const [historialVisible, setHistorialVisible] = useState(true)

  useEffect(() => {
    tituloRef.current?.focus()
  }, [props.estado])

  const idTitulo = `${idBase}-titulo`

  if (props.estado === 'cargando') {
    return (
      <section className={styles['rrhh-detail']} aria-labelledby={idTitulo}>
        <CabeceraEstado
          idTitulo={idTitulo}
          tituloRef={tituloRef}
          onVolver={onVolver}
        />
        <p role="status" aria-live="polite" className={styles['rrhh-detail__vacio']}>
          Cargando requerimiento…
        </p>
      </section>
    )
  }

  if (props.estado === 'error') {
    return (
      <section className={styles['rrhh-detail']} aria-labelledby={idTitulo}>
        <CabeceraEstado
          idTitulo={idTitulo}
          tituloRef={tituloRef}
          onVolver={onVolver}
        />
        <div role="alert" className={styles['rrhh-detail__tarjeta']}>
          <h2 className={styles['rrhh-detail__tarjeta-titulo']}>
            No se pudo cargar el requerimiento
          </h2>
          <p>{props.mensajeError ?? 'Inténtalo de nuevo.'}</p>
          {props.onReintentar ? (
            <button
              type="button"
              className={styles['rrhh-detail__volver']}
              onClick={props.onReintentar}
            >
              Reintentar
            </button>
          ) : null}
        </div>
      </section>
    )
  }

  if (props.estado === 'sin-permisos') {
    return (
      <section className={styles['rrhh-detail']} aria-labelledby={idTitulo}>
        <CabeceraEstado
          idTitulo={idTitulo}
          tituloRef={tituloRef}
          onVolver={onVolver}
        />
        <div role="alert" className={styles['rrhh-detail__tarjeta']}>
          <h2 className={styles['rrhh-detail__tarjeta-titulo']}>Sin permisos</h2>
          <p>No tienes acceso de lectura a este requerimiento.</p>
        </div>
      </section>
    )
  }

  const detalle = props.detalle
  const modelo = crearDetalleUx04(detalle)
  const datosCompletos = tieneDatosCompletos(detalle) ? detalle : null
  const alerta = detalle.plazo?.alerta ?? null
  const cobertura = detalle.cobertura
  const plazo = detalle.plazo

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
          <h1
            id={idTitulo}
            ref={tituloRef}
            tabIndex={-1}
            className={styles['rrhh-detail__titulo']}
          >
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
        <dl className={styles['rrhh-detail__resumen-grid']}>
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
        </dl>
      </section>

      <section
        className={styles['rrhh-detail__tarjeta']}
        aria-labelledby={idCobertura}
      >
        <h2 id={idCobertura} className={styles['rrhh-detail__tarjeta-titulo']}>
          Cobertura
        </h2>
        <dl className={styles['rrhh-detail__cobertura']}>
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
        </dl>
        {modelo.cobertura.invariante ? (
          <p className={styles['rrhh-detail__nota']}>
            {textoInvarianteCobertura(modelo.cobertura.invariante)}
          </p>
        ) : null}
      </section>

      <section
        className={styles['rrhh-detail__tarjeta']}
        aria-labelledby={idPlazo}
      >
        <h2 id={idPlazo} className={styles['rrhh-detail__tarjeta-titulo']}>
          Plazo
        </h2>
        <dl className={styles['rrhh-detail__plazo']}>
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
          <Item
            etiqueta="Cumplimiento"
            valor={plazo ? modelo.plazo.cumplimientoEtiqueta : <ValorAusente />}
          />
        </dl>
        {!plazo?.fechaObjetivo ? (
          <p className={styles['rrhh-detail__aviso']}>{AVISO_DURACION}</p>
        ) : null}
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
          modelo.historial.vacio ? (
            <p className={styles['rrhh-detail__vacio']}>
              Sin eventos registrados.
            </p>
          ) : (
            <>
              <p className={styles['rrhh-detail__nota']}>
                Orden: del más reciente al más antiguo.
              </p>
              <ul
                id={idHistorialLista}
                className={styles['rrhh-detail__historial']}
              >
                {modelo.historial.entradas.map((entrada) => (
                  <HistorialItem key={String(entrada.id)} entrada={entrada} />
                ))}
              </ul>
            </>
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
