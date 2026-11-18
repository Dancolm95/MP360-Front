import type {
  AccionRequerimiento,
  Clasificacion,
  DetalleRequerimiento,
  EstadoRequerimiento,
} from '../contracts'
import { ESTADOS_CANCELABLES } from './estados'

/**
 * Acciones por registro con elegibilidad de estado y clasificación. La lista es
 * la única fuente para la vista, `actions/` y la máquina de transiciones.
 */
export type AccionElegible = Extract<
  AccionRequerimiento,
  'aprobar' | 'observar' | 'cancelar' | 'fijar-plazo' | 'ajustar-plazo'
>

export const ACCIONES_ELEGIBLES: readonly AccionElegible[] = [
  'aprobar',
  'observar',
  'cancelar',
  'fijar-plazo',
  'ajustar-plazo',
]

export type MotivoEstadoNoAplicable =
  | 'estado-no-aplicable'
  | 'clasificacion-no-aplicable'

/** Estados de origen de cada acción elegible (spec §6). */
export const ORIGENES_ACCION: Readonly<
  Record<AccionElegible, readonly EstadoRequerimiento[]>
> = {
  aprobar: ['pendiente-aprobacion'],
  observar: ['pendiente-aprobacion'],
  cancelar: ESTADOS_CANCELABLES,
  'fijar-plazo': ['pendiente-aprobacion'],
  'ajustar-plazo': ['aprobado', 'en-reclutamiento'],
}

export function esAccionElegible(
  accion: AccionRequerimiento,
): accion is AccionElegible {
  return ACCIONES_ELEGIBLES.includes(accion as AccionElegible)
}

/** La capacidad concedida por el backend no se infiere de un rol ni del estado. */
export function accionConcedida(
  detalle: DetalleRequerimiento,
  accion: AccionRequerimiento,
): boolean {
  return detalle.autorizacion.accionesPermitidas.includes(accion)
}

/**
 * Clasificación derivable del detalle. En un requerimiento completo manda el
 * puesto, del que se deriva la clasificación; en un borrador puede no existir.
 */
export function clasificacionDeDetalle(
  detalle: DetalleRequerimiento,
): Clasificacion | null {
  if ('puesto' in detalle) return detalle.puesto.clasificacion
  if (detalle.plazo !== null) return detalle.plazo.clasificacion
  return null
}

export function motivoEstadoNoAplicable(
  detalle: DetalleRequerimiento,
  accion: AccionElegible,
): MotivoEstadoNoAplicable | null {
  if (!ORIGENES_ACCION[accion].includes(detalle.estado)) {
    return 'estado-no-aplicable'
  }
  if (accion === 'fijar-plazo' || accion === 'ajustar-plazo') {
    return clasificacionDeDetalle(detalle) === 'administrativo'
      ? null
      : 'clasificacion-no-aplicable'
  }
  return null
}
