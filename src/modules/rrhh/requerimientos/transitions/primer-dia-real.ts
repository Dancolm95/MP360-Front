import type {
  CoberturaRequerimiento,
  DetalleRequerimiento,
  EstadoRequerimiento,
  EventoPrimerDiaReal,
  PlazoRequerimiento,
  PrimerDiaRealAlta,
} from '../contracts'
import { incrementarCobertura, primerDiaRealDeEvento } from '../model'
import { evaluarTransicion, MENSAJES_RECHAZO } from './maquina'
import type { MotivoRechazoTransicion } from './types'

export interface ConfirmacionPrimerDiaReal {
  readonly estadoAnterior: EstadoRequerimiento
  readonly estado: EstadoRequerimiento
  readonly cobertura: CoberturaRequerimiento
  readonly primerDiaReal: PrimerDiaRealAlta
  /**
   * Se conserva la referencia del detalle: el alta no recalcula el plazo ni la
   * fecha objetivo.
   */
  readonly plazo: PlazoRequerimiento | null
  /** El evento ya constaba en el historial confirmado y no vuelve a contar. */
  readonly yaAplicado: boolean
}

export type ResultadoConfirmacionPrimerDiaReal =
  | {
      readonly status: 'confirmado'
      readonly evento: EventoPrimerDiaReal
      readonly confirmacion: ConfirmacionPrimerDiaReal
    }
  | {
      readonly status: 'rechazado'
      readonly evento: EventoPrimerDiaReal | null
      /** Cobertura vigente, sin aplicar el incremento rechazado. */
      readonly cobertura: CoberturaRequerimiento | null
      readonly motivo: MotivoRechazoTransicion
      readonly mensaje: string
    }

function yaAplicado(
  detalle: DetalleRequerimiento,
  evento: EventoPrimerDiaReal,
): boolean {
  return detalle.historial.some(
    (entrada) =>
      entrada.accion === 'primer-dia-real' && entrada.id === evento.id,
  )
}

/**
 * Proyecta la confirmación de Alta: una vacante cubierta y, cuando no quedan
 * pendientes, Cubierto por la misma máquina de T-RH-16. No persiste nada ni
 * modifica el detalle recibido.
 */
export function confirmarPrimerDiaReal(
  detalle: DetalleRequerimiento,
  evento: EventoPrimerDiaReal | null,
): ResultadoConfirmacionPrimerDiaReal {
  if (
    evento !== null &&
    detalle.cobertura !== null &&
    yaAplicado(detalle, evento)
  ) {
    return {
      status: 'confirmado',
      evento,
      confirmacion: {
        estadoAnterior: detalle.estado,
        estado: detalle.estado,
        cobertura: detalle.cobertura,
        primerDiaReal: primerDiaRealDeEvento(evento),
        plazo: detalle.plazo,
        yaAplicado: true,
      },
    }
  }

  const cobertura =
    evento === null || detalle.cobertura === null
      ? null
      : incrementarCobertura(detalle.cobertura, primerDiaRealDeEvento(evento))
  const transicion = evaluarTransicion(detalle, {
    suceso: 'confirmar-primer-dia-real',
    evento,
    cobertura,
  })

  if (!transicion.permitida) {
    return {
      status: 'rechazado',
      evento,
      cobertura: detalle.cobertura,
      motivo: transicion.motivo,
      mensaje: transicion.mensaje,
    }
  }

  // La máquina no permite confirmar sin evento ni sin cobertura; las guardas
  // mantienen el invariante y estrechan los tipos para el resultado confirmado.
  if (evento === null || cobertura === null) {
    return {
      status: 'rechazado',
      evento,
      cobertura: detalle.cobertura,
      motivo: 'integracion-sin-confirmar',
      mensaje: MENSAJES_RECHAZO['integracion-sin-confirmar'],
    }
  }

  return {
    status: 'confirmado',
    evento,
    confirmacion: {
      estadoAnterior: transicion.estadoOrigen,
      estado: transicion.estadoDestino,
      cobertura,
      primerDiaReal: primerDiaRealDeEvento(evento),
      plazo: detalle.plazo,
      yaAplicado: false,
    },
  }
}
