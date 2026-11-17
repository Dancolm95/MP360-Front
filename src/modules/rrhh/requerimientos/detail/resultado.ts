import type { ContractError } from '../../../../shared'
import type { ResultadoDetalle } from '../contracts'
import type { DetalleUx04, OpcionesDetalleUx04 } from './modelo'
import { crearDetalleUx04 } from './modelo'

export interface MensajeEstadoDetalle {
  readonly titulo: string
  readonly mensaje: string
  readonly puedeReintentar: boolean
}

export type ResultadoDetalleUx04 =
  | { readonly status: 'ok'; readonly detalle: DetalleUx04 }
  | { readonly status: 'no-encontrado'; readonly lectura: MensajeEstadoDetalle }
  | { readonly status: 'forbidden'; readonly lectura: MensajeEstadoDetalle }
  | {
      readonly status: 'sesion-finalizada'
      readonly lectura: MensajeEstadoDetalle
    }
  | {
      readonly status: 'error'
      readonly lectura: MensajeEstadoDetalle
      readonly error: ContractError
    }

const NO_ENCONTRADO: MensajeEstadoDetalle = {
  titulo: 'Requerimiento no encontrado',
  mensaje: 'El requerimiento no existe o ya no está disponible.',
  puedeReintentar: false,
}

const SIN_PERMISOS: MensajeEstadoDetalle = {
  titulo: 'Sin permisos',
  mensaje: 'No tienes permisos para consultar este requerimiento.',
  puedeReintentar: false,
}

const SESION_FINALIZADA: MensajeEstadoDetalle = {
  titulo: 'Sesión finalizada',
  mensaje: 'Tu sesión terminó. Vuelve a iniciar sesión para continuar.',
  puedeReintentar: false,
}

/**
 * Traduce el resultado del contrato a estados de lectura ya presentables, para
 * que la vista no tenga que deducir el motivo ni si el reintento está permitido.
 */
export function modelarResultadoDetalle(
  resultado: ResultadoDetalle,
  opciones: OpcionesDetalleUx04 = {},
): ResultadoDetalleUx04 {
  switch (resultado.status) {
    case 'ok':
      return { status: 'ok', detalle: crearDetalleUx04(resultado.datos, opciones) }
    case 'no-encontrado':
      return { status: 'no-encontrado', lectura: NO_ENCONTRADO }
    case 'forbidden':
      return { status: 'forbidden', lectura: SIN_PERMISOS }
    case 'sesion-finalizada':
      return { status: 'sesion-finalizada', lectura: SESION_FINALIZADA }
    case 'error': {
      const mensaje = resultado.error.message.trim()
      return {
        status: 'error',
        lectura: {
          titulo: 'No se pudo cargar el detalle',
          mensaje:
            mensaje === ''
              ? 'No se pudo cargar el detalle del requerimiento.'
              : resultado.error.message,
          puedeReintentar: resultado.error.retryable,
        },
        error: resultado.error,
      }
    }
  }
}
