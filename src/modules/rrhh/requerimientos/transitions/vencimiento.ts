import type { EstadoRequerimiento } from '../contracts'
import type { EvaluacionPlazo } from '../deadlines'

/**
 * Consumo del cumplimiento ya calculado por `deadlines/`. El vencimiento no es
 * una transición: conserva estado, fechas y duración sin recalcularlos.
 */
export interface EfectoVencimiento {
  readonly estado: EstadoRequerimiento
  readonly estadoDestino: EstadoRequerimiento
  readonly cambiaEstado: false
  readonly vencido: boolean
  readonly cumplimiento: EvaluacionPlazo['cumplimiento']
  readonly fechaAprobacion: EvaluacionPlazo['fechaAprobacion']
  readonly fechaObjetivo: EvaluacionPlazo['fechaObjetivo']
  readonly duracionDiasHabiles: EvaluacionPlazo['duracionDiasHabiles']
}

export function efectoVencimiento(
  estado: EstadoRequerimiento,
  evaluacion: EvaluacionPlazo,
): EfectoVencimiento {
  return {
    estado,
    estadoDestino: estado,
    cambiaEstado: false,
    vencido: evaluacion.cumplimiento === 'incumplido',
    cumplimiento: evaluacion.cumplimiento,
    fechaAprobacion: evaluacion.fechaAprobacion,
    fechaObjetivo: evaluacion.fechaObjetivo,
    duracionDiasHabiles: evaluacion.duracionDiasHabiles,
  }
}
