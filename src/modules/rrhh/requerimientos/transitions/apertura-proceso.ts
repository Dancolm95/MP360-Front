import type {
  DetalleRequerimiento,
  EstadoRequerimiento,
  EventoAperturaProceso,
  ProcesoSeleccionRef,
} from '../contracts'
import { evaluarTransicion, MENSAJES_RECHAZO } from './maquina'
import type { MotivoRechazoTransicion } from './types'

/**
 * Aplicación de la confirmación de Selección: describe el cambio confirmado
 * (Aprobado → En reclutamiento) sin persistir ni alterar el requerimiento.
 */
export type ResultadoConfirmacionAperturaProceso =
  | {
      readonly status: 'confirmado'
      readonly estadoAnterior: EstadoRequerimiento
      readonly estado: EstadoRequerimiento
      readonly proceso: ProcesoSeleccionRef
      readonly evento: EventoAperturaProceso
    }
  | {
      readonly status: 'rechazado'
      readonly evento: EventoAperturaProceso | null
      readonly motivo: MotivoRechazoTransicion
      readonly mensaje: string
    }

export function confirmarAperturaProcesoSeleccion(
  detalle: DetalleRequerimiento,
  evento: EventoAperturaProceso | null,
): ResultadoConfirmacionAperturaProceso {
  const transicion = evaluarTransicion(detalle, {
    suceso: 'confirmar-apertura-proceso',
    evento,
  })

  if (!transicion.permitida) {
    return {
      status: 'rechazado',
      evento,
      motivo: transicion.motivo,
      mensaje: transicion.mensaje,
    }
  }

  // La máquina no permite esta transición sin evento; la guarda mantiene el
  // invariante y estrecha el tipo para el resultado confirmado.
  if (evento === null) {
    return {
      status: 'rechazado',
      evento,
      motivo: 'integracion-sin-confirmar',
      mensaje: MENSAJES_RECHAZO['integracion-sin-confirmar'],
    }
  }

  return {
    status: 'confirmado',
    estadoAnterior: transicion.estadoOrigen,
    estado: transicion.estadoDestino,
    proceso: evento.proceso,
    evento,
  }
}
