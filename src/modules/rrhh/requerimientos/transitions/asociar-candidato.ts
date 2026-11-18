import type { LogicalDestination } from '../../../../container/contracts'
import { DEST_RRHH_SELECCION } from '../../identifiers'
import type {
  DetalleRequerimiento,
  EstadoRequerimiento,
  MotivoDenegacion,
  ProcesoSeleccionRef,
} from '../contracts'
import { evaluarTransicion } from './maquina'

export type ResultadoNavegacionAsociarCandidato =
  | {
      readonly status: 'navegar'
      readonly proceso: ProcesoSeleccionRef
      readonly destino: LogicalDestination
    }
  | {
      readonly status: 'sin-autorizacion'
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
  const veredicto = evaluarTransicion(detalle, { suceso: 'asociar-candidato' })

  if (!veredicto.permitida) {
    if (veredicto.motivo === 'sin-autorizacion') {
      return {
        status: 'sin-autorizacion',
        motivo: 'capacidad',
        mensaje: veredicto.mensaje,
      }
    }
    return {
      status: 'estado-invalido',
      estadoActual: detalle.estado,
      mensaje: veredicto.mensaje,
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
