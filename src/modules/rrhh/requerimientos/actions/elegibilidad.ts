import type { DetalleRequerimiento } from '../contracts'
import {
  ACCIONES_ELEGIBLES,
  accionConcedida,
  motivoEstadoNoAplicable,
} from '../model'
import type {
  AccionEvaluada,
  AccionEvaluable,
  EvaluacionAcciones,
  MotivoAccionNoDisponible,
} from './types'

function mensajeNoDisponible(
  accion: AccionEvaluable,
  motivo: MotivoAccionNoDisponible,
): string {
  if (motivo === 'sin-autorizacion') {
    return 'No tienes permiso para ejecutar esta acción en el requerimiento.'
  }
  if (accion === 'cancelar') {
    return 'El requerimiento ya no se puede cancelar en su estado actual.'
  }
  if (accion === 'fijar-plazo') {
    return motivo === 'clasificacion-no-aplicable'
      ? 'El plazo administrativo solo aplica a requerimientos de clasificación administrativa.'
      : 'El plazo administrativo se fija antes de aprobar, mientras el requerimiento está pendiente de aprobación.'
  }
  if (accion === 'ajustar-plazo') {
    return motivo === 'clasificacion-no-aplicable'
      ? 'El plazo administrativo de seguimiento solo aplica a requerimientos de clasificación administrativa.'
      : 'El plazo administrativo de seguimiento solo se ajusta en Aprobado o En reclutamiento.'
  }
  return accion === 'aprobar'
    ? 'La aprobación solo está disponible cuando el requerimiento está pendiente de aprobación.'
    : 'La observación solo está disponible cuando el requerimiento está pendiente de aprobación.'
}

/**
 * Una acción es visible solo si el backend la concedió; es ejecutable si además
 * el estado la admite. El estado nunca sustituye `accionesPermitidas`.
 */
export function evaluarAccion(
  detalle: DetalleRequerimiento,
  accion: AccionEvaluable,
): AccionEvaluada {
  const visible = accionConcedida(detalle, accion)
  if (!visible) {
    const motivo: MotivoAccionNoDisponible = 'sin-autorizacion'
    return {
      accion,
      visible: false,
      ejecutable: false,
      motivo,
      mensaje: mensajeNoDisponible(accion, motivo),
    }
  }

  const motivo = motivoEstadoNoAplicable(detalle, accion)
  return {
    accion,
    visible: true,
    ejecutable: motivo === null,
    motivo,
    mensaje: motivo === null ? null : mensajeNoDisponible(accion, motivo),
  }
}

export function evaluarAcciones(
  detalle: DetalleRequerimiento,
): EvaluacionAcciones {
  const acciones = ACCIONES_ELEGIBLES.map((accion) =>
    evaluarAccion(detalle, accion),
  )
  return {
    estado: detalle.estado,
    acciones,
    ejecutables: ACCIONES_ELEGIBLES.filter((accion) =>
      acciones.some(
        (evaluada) => evaluada.accion === accion && evaluada.ejecutable,
      ),
    ),
  }
}

export function esAccionEjecutable(
  evaluacion: EvaluacionAcciones,
  accion: AccionEvaluable,
): boolean {
  return evaluacion.ejecutables.includes(accion)
}
