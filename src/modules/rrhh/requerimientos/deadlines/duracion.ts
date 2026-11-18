import type { Clasificacion, DuracionAplicable } from '../contracts'
import { esDiasHabilesAdministrativos } from './rango'

/**
 * Duración antes de aprobar: nunca una fecha. El administrativo depende del
 * plazo que fije RR. HH.; sin plazo válido queda «pendiente de definir».
 */
export function derivarDuracionAplicable(
  clasificacion: Clasificacion | null,
  plazoAdministrativoDias?: number | null,
): DuracionAplicable | null {
  if (clasificacion === 'operativo') {
    return { clasificacion: 'operativo', diasHabiles: 10 }
  }
  if (clasificacion === 'administrativo') {
    return {
      clasificacion: 'administrativo',
      diasHabiles: esDiasHabilesAdministrativos(plazoAdministrativoDias)
        ? plazoAdministrativoDias
        : null,
    }
  }
  return null
}
