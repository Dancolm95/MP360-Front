import type {
  CoberturaRequerimiento,
  DetalleRequerimiento,
  EfectoCoberturaReversion,
  EstadoRequerimiento,
  EventoReversionCobertura,
  PlazoRequerimiento,
  SolicitudReversionId,
} from '../contracts'
import { aplicarEfectoReversion, reversionAplicada } from '../model'
import { evaluarTransicion, MENSAJES_RECHAZO } from './maquina'
import type { MotivoRechazoTransicion } from './types'

/**
 * La máquina valida el estado y la coherencia interna del evento; que el
 * retroceso sea real frente a la cobertura registrada solo se sabe al
 * proyectarla, porque la máquina no recibe el detalle de la cobertura.
 */
export type MotivoRechazoReversion =
  | MotivoRechazoTransicion
  | 'cobertura-no-retrocede'

export const MENSAJE_REVERSION_NO_RETROCEDE =
  'La reversión confirmada debe reducir las cubiertas registradas sin alterar las vacantes solicitadas.'

export interface ConfirmacionReversionCobertura {
  readonly solicitudId: SolicitudReversionId
  readonly estadoAnterior: EstadoRequerimiento
  readonly estado: EstadoRequerimiento
  readonly cobertura: CoberturaRequerimiento
  /** Se conserva la referencia: una reversión no recalcula plazos ni objetivo. */
  readonly plazo: PlazoRequerimiento | null
  /** El evento ya constaba en el historial confirmado y no vuelve a contar. */
  readonly yaAplicado: boolean
}

export type ResultadoConfirmacionReversionCobertura =
  | {
      readonly status: 'confirmado'
      readonly evento: EventoReversionCobertura
      readonly confirmacion: ConfirmacionReversionCobertura
    }
  | {
      readonly status: 'rechazado'
      readonly evento: EventoReversionCobertura | null
      /** Cobertura vigente, sin aplicar el efecto rechazado. */
      readonly cobertura: CoberturaRequerimiento | null
      readonly motivo: MotivoRechazoReversion
      readonly mensaje: string
    }

function retrocedeCobertura(
  cobertura: CoberturaRequerimiento,
  efecto: EfectoCoberturaReversion,
): boolean {
  return (
    efecto.solicitadas === cobertura.solicitadas &&
    efecto.cubiertas >= 0 &&
    efecto.cubiertas < cobertura.cubiertas
  )
}

/**
 * Proyecta el evento auditado de Selección: decrementa las cubiertas y deja que
 * la máquina de T-RH-16 decida el paso de Cubierto a En reclutamiento. Sin
 * evento no aplica nada y no modifica el detalle recibido.
 */
export function confirmarReversionCobertura(
  detalle: DetalleRequerimiento,
  evento: EventoReversionCobertura | null,
): ResultadoConfirmacionReversionCobertura {
  const coberturaActual = detalle.cobertura

  if (
    evento !== null &&
    coberturaActual !== null &&
    reversionAplicada(detalle, evento)
  ) {
    return {
      status: 'confirmado',
      evento,
      confirmacion: {
        solicitudId: evento.solicitudId,
        estadoAnterior: detalle.estado,
        estado: detalle.estado,
        cobertura: coberturaActual,
        plazo: detalle.plazo,
        yaAplicado: true,
      },
    }
  }

  const cobertura =
    evento === null || coberturaActual === null
      ? null
      : aplicarEfectoReversion(coberturaActual, evento.efectoCobertura)
  const transicion = evaluarTransicion(detalle, {
    suceso: 'confirmar-reversion-cobertura',
    evento,
  })

  if (!transicion.permitida) {
    return {
      status: 'rechazado',
      evento,
      cobertura: coberturaActual,
      motivo: transicion.motivo,
      mensaje: transicion.mensaje,
    }
  }

  // La máquina no permite confirmar sin evento ni cobertura; las guardas
  // mantienen el invariante y estrechan los tipos para el resultado confirmado.
  if (evento === null || cobertura === null || coberturaActual === null) {
    return {
      status: 'rechazado',
      evento,
      cobertura: coberturaActual,
      motivo: 'integracion-sin-confirmar',
      mensaje: MENSAJES_RECHAZO['integracion-sin-confirmar'],
    }
  }

  if (!retrocedeCobertura(coberturaActual, evento.efectoCobertura)) {
    return {
      status: 'rechazado',
      evento,
      cobertura: coberturaActual,
      motivo: 'cobertura-no-retrocede',
      mensaje: MENSAJE_REVERSION_NO_RETROCEDE,
    }
  }

  return {
    status: 'confirmado',
    evento,
    confirmacion: {
      solicitudId: evento.solicitudId,
      estadoAnterior: transicion.estadoOrigen,
      estado: transicion.estadoDestino,
      cobertura,
      plazo: detalle.plazo,
      yaAplicado: false,
    },
  }
}
