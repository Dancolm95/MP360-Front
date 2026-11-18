import type { CausalCancelacion, EstadoRequerimiento } from '../contracts'

/** Estados desde los que la spec §6 admite «Cancelar requerimiento». */
export const ESTADOS_CANCELABLES: readonly EstadoRequerimiento[] = [
  'borrador',
  'pendiente-aprobacion',
  'observado',
  'aprobado',
  'en-reclutamiento',
]

/**
 * Cubierto no es terminal: una reversión auditada de cobertura lo devuelve a
 * En reclutamiento. Cancelado no tiene transiciones de salida.
 */
export const ESTADOS_TERMINALES: readonly EstadoRequerimiento[] = ['cancelado']

export const CAUSALES_CANCELACION: readonly CausalCancelacion[] = [
  'menor-carga-laboral',
  'creacion-por-error',
]

export function esCausalCancelacion(
  valor: unknown,
): valor is CausalCancelacion {
  return CAUSALES_CANCELACION.includes(valor as CausalCancelacion)
}
