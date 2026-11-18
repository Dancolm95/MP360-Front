import type { LogicalDestination } from '../../../../container/contracts'
import { DEST_RRHH_SELECCION } from '../../identifiers'
import type {
  DetalleRequerimiento,
  EstadoRequerimiento,
  MotivoDenegacion,
  ProcesoSeleccionRef,
} from '../contracts'
import { accionConcedida } from '../model'
import { MENSAJES_RECHAZO } from './maquina'

export type ResultadoNavegacionAsociarCandidato =
  | {
      readonly status: 'navegar'
      readonly proceso: ProcesoSeleccionRef
      readonly destino: LogicalDestination
    }
  | {
      readonly status: 'sin-autorizacion'
      /** El ámbito lo resuelve el backend en `accionesPermitidas`; aquí solo consta la capacidad. */
      readonly motivo: MotivoDenegacion
      readonly mensaje: string
    }
  | {
      readonly status: 'estado-invalido'
      readonly estadoActual: EstadoRequerimiento
      readonly mensaje: string
    }
  | {
      readonly status: 'sin-proceso'
      readonly mensaje: string
    }

export const MENSAJE_SIN_PROCESO =
  'El requerimiento no tiene un proceso de Selección confirmado al que navegar.'

/**
 * No crea proceso ni vínculo: solo reutiliza la referencia que Selección ya
 * confirmó y que el detalle expone en solo lectura.
 */
export function resolverNavegacionAsociarCandidato(
  detalle: DetalleRequerimiento,
): ResultadoNavegacionAsociarCandidato {
  // «Asociar candidato» es navegación de §7.3, no una transición de §6: por eso
  // su elegibilidad se decide aquí y no amplía la máquina de estados.
  if (!accionConcedida(detalle, 'asociar-candidato')) {
    return {
      status: 'sin-autorizacion',
      motivo: 'capacidad',
      mensaje: MENSAJES_RECHAZO['sin-autorizacion'],
    }
  }

  if (detalle.estado !== 'en-reclutamiento') {
    return {
      status: 'estado-invalido',
      estadoActual: detalle.estado,
      mensaje: MENSAJES_RECHAZO['suceso-no-aplica-al-estado'],
    }
  }

  if (detalle.procesoSeleccion === null) {
    return { status: 'sin-proceso', mensaje: MENSAJE_SIN_PROCESO }
  }

  return {
    status: 'navegar',
    proceso: detalle.procesoSeleccion,
    destino: DEST_RRHH_SELECCION,
  }
}
