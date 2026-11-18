import type { Clasificacion, PlazoRequerimiento } from '../contracts'
import { esDiasHabilesAdministrativos } from './rango'

export type SituacionPlazoAprobacion = 'no-aplica' | 'valido' | 'invalido'

/**
 * Un Administrativo solo se aprueba con un plazo entero 15–30; un Operativo no
 * lo requiere. No calcula fechas ni días hábiles.
 */
export function situacionPlazoAprobacion(
  clasificacion: Clasificacion | null,
  plazo: PlazoRequerimiento | null,
): SituacionPlazoAprobacion {
  if (clasificacion !== 'administrativo') return 'no-aplica'

  const dias =
    plazo?.clasificacion === 'administrativo'
      ? plazo.duracionDiasHabiles
      : null
  return esDiasHabilesAdministrativos(dias) ? 'valido' : 'invalido'
}
