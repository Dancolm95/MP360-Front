import type {
  Clasificacion,
  DetalleRequerimiento,
  EstadoRequerimiento,
} from '../contracts'
import type {
  AccionEvaluada,
  AccionEvaluable,
  AccionGestion,
  EvaluacionAcciones,
  MotivoAccionNoDisponible,
} from './tipos'
import { ACCIONES_GESTION } from './tipos'

const ESTADOS_CANCELABLES: readonly EstadoRequerimiento[] = [
  'borrador',
  'pendiente-aprobacion',
  'observado',
  'aprobado',
  'en-reclutamiento',
]

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

function motivoNoEjecutable(
  detalle: DetalleRequerimiento,
  accion: AccionEvaluable,
): MotivoAccionNoDisponible | null {
  switch (accion) {
    case 'aprobar':
    case 'observar':
      return detalle.estado === 'pendiente-aprobacion'
        ? null
        : 'estado-no-aplicable'
    case 'cancelar':
      return ESTADOS_CANCELABLES.includes(detalle.estado)
        ? null
        : 'estado-no-aplicable'
    case 'fijar-plazo':
      if (detalle.estado !== 'pendiente-aprobacion') {
        return 'estado-no-aplicable'
      }
      return clasificacionDeDetalle(detalle) === 'administrativo'
        ? null
        : 'clasificacion-no-aplicable'
    case 'ajustar-plazo':
      if (
        detalle.estado !== 'aprobado' &&
        detalle.estado !== 'en-reclutamiento'
      ) {
        return 'estado-no-aplicable'
      }
      return clasificacionDeDetalle(detalle) === 'administrativo'
        ? null
        : 'clasificacion-no-aplicable'
  }
}

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
  const visible = detalle.autorizacion.accionesPermitidas.includes(accion)
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

  const motivo = motivoNoEjecutable(detalle, accion)
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
  const acciones = ACCIONES_GESTION.map((accion) =>
    evaluarAccion(detalle, accion),
  )
  return {
    estado: detalle.estado,
    acciones,
    ejecutables: ACCIONES_GESTION.filter((accion) =>
      acciones.some(
        (evaluada) => evaluada.accion === accion && evaluada.ejecutable,
      ),
    ),
  }
}

export function esAccionEjecutable(
  evaluacion: EvaluacionAcciones,
  accion: AccionGestion,
): boolean {
  return evaluacion.ejecutables.includes(accion)
}
