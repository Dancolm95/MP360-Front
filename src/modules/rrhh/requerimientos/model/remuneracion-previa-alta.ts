import type {
  DetalleRequerimiento,
  DetalleRequerimientoCompleto,
  Remuneracion,
} from '../contracts'

/**
 * El ajuste pertenece a Alta: aquí solo se distingue si el importe vigente
 * procede del requerimiento aprobado o del ajuste trazable de Alta.
 */
export type OrigenRemuneracionVigente = 'requerimiento' | 'ajuste-alta'

export const MENSAJE_EXCEPCION_CERO_PRACTICANTE =
  'La remuneración de 0.00 es una excepción exclusiva de RH-REQ-01 para Practicante; Alta no la hereda.'

export const MENSAJE_ALTA_NO_CONFIRMA_CERO =
  'Alta no confirma el ingreso mientras la remuneración siga en 0.00; ajusta el importe antes de confirmar.'

export const MENSAJE_ALTA_IMPORTE_NEGATIVO = 'El importe no puede ser negativo.'

const MENSAJE_REQUERIMIENTO_NO_APROBADO =
  'La remuneración previa al alta requiere un requerimiento aprobado y vigente.'

const MENSAJE_REMUNERACION_AUSENTE =
  'El requerimiento no tiene una remuneración registrada.'

const MENSAJE_REMUNERACION_INCOMPLETA =
  'La remuneración registrada está incompleta o no es un importe en soles válido.'

const MENSAJE_AJUSTE_ALTA_INCOMPLETO =
  'El ajuste de remuneración de Alta está incompleto; no se puede leer un importe vigente.'

/** El requerimiento conserva la excepción; Alta nunca la admite. */
export interface ExcepcionCeroPracticante {
  readonly tipo: 'cero-practicante'
  readonly vigenteEnAlta: false
  readonly mensaje: string
}

export interface LecturaRemuneracionPreviaAlta {
  readonly remuneracionAprobada: Remuneracion
  readonly remuneracionVigente: Remuneracion
  readonly origenVigente: OrigenRemuneracionVigente
  readonly ajustadaAntesDelAlta: boolean
  readonly excepcionCero: ExcepcionCeroPracticante | null
}

export type MotivoRemuneracionNoDisponible =
  | 'requerimiento-no-aprobado'
  | 'remuneracion-ausente'
  | 'remuneracion-incompleta'
  | 'ajuste-alta-incompleto'

export type ResultadoLecturaRemuneracionPreviaAlta =
  | {
      readonly status: 'disponible'
      readonly lectura: LecturaRemuneracionPreviaAlta
    }
  | {
      readonly status: 'no-disponible'
      readonly motivo: MotivoRemuneracionNoDisponible
      readonly mensaje: string
    }

export type MotivoRechazoRemuneracionAlta =
  | 'remuneracion-no-disponible'
  | 'importe-cero'
  | 'importe-negativo'

export type ResultadoConfirmacionRemuneracionAlta =
  | {
      readonly status: 'confirmable'
      readonly remuneracion: Remuneracion
      readonly origenVigente: OrigenRemuneracionVigente
    }
  | {
      readonly status: 'rechazado'
      readonly motivo: MotivoRechazoRemuneracionAlta
      readonly mensaje: string
      readonly requiereAjuste: boolean
    }

/**
 * Solo un requerimiento aprobado y no cancelado alimenta un alta. El Cancelado
 * conserva datos, pero no es un candidato a ingreso.
 */
function tieneRemuneracionAprobada(
  detalle: DetalleRequerimiento,
): detalle is DetalleRequerimientoCompleto {
  return (
    detalle.estado === 'aprobado' ||
    detalle.estado === 'en-reclutamiento' ||
    detalle.estado === 'cubierto'
  )
}

function esImportePenCompleto(
  valor: Remuneracion | null | undefined,
): valor is Remuneracion {
  return (
    valor !== null &&
    valor !== undefined &&
    typeof valor.monto === 'number' &&
    Number.isFinite(valor.monto) &&
    valor.moneda === 'PEN'
  )
}

function noDisponible(
  motivo: MotivoRemuneracionNoDisponible,
  mensaje: string,
): ResultadoLecturaRemuneracionPreviaAlta {
  return { status: 'no-disponible', motivo, mensaje }
}

function detectarExcepcionCero(
  detalle: DetalleRequerimientoCompleto,
  remuneracionAprobada: Remuneracion,
): ExcepcionCeroPracticante | null {
  if (detalle.motivo !== 'practicante' || remuneracionAprobada.monto !== 0) {
    return null
  }

  return {
    tipo: 'cero-practicante',
    vigenteEnAlta: false,
    mensaje: MENSAJE_EXCEPCION_CERO_PRACTICANTE,
  }
}

/**
 * Proyección de solo lectura para Alta. No edita el requerimiento, no escribe
 * en ningún puerto y no crea una segunda fuente del ajuste de Alta.
 */
export function leerRemuneracionPreviaAlta(
  detalle: DetalleRequerimiento,
): ResultadoLecturaRemuneracionPreviaAlta {
  if (!tieneRemuneracionAprobada(detalle)) {
    return noDisponible(
      'requerimiento-no-aprobado',
      MENSAJE_REQUERIMIENTO_NO_APROBADO,
    )
  }

  const remuneracionAprobada: Remuneracion | null | undefined =
    detalle.remuneracion
  if (remuneracionAprobada === null || remuneracionAprobada === undefined) {
    return noDisponible('remuneracion-ausente', MENSAJE_REMUNERACION_AUSENTE)
  }
  if (!esImportePenCompleto(remuneracionAprobada)) {
    return noDisponible(
      'remuneracion-incompleta',
      MENSAJE_REMUNERACION_INCOMPLETA,
    )
  }

  const ajuste = detalle.remuneracionPreviaAlta
  const ajustadaAntesDelAlta = ajuste?.ajustadaAntesDelAlta === true
  let remuneracionVigente = remuneracionAprobada

  if (ajustadaAntesDelAlta) {
    const vigenteDeclarado = ajuste?.remuneracionVigente
    if (!esImportePenCompleto(vigenteDeclarado)) {
      return noDisponible(
        'ajuste-alta-incompleto',
        MENSAJE_AJUSTE_ALTA_INCOMPLETO,
      )
    }
    remuneracionVigente = vigenteDeclarado
  }

  // Sin ajuste declarado el vigente es el aprobado: no se infiere un importe
  // ajustado que Alta no haya registrado.
  return {
    status: 'disponible',
    lectura: {
      remuneracionAprobada,
      remuneracionVigente,
      origenVigente: ajustadaAntesDelAlta ? 'ajuste-alta' : 'requerimiento',
      ajustadaAntesDelAlta,
      excepcionCero: detectarExcepcionCero(detalle, remuneracionAprobada),
    },
  }
}

/**
 * Alta valida >0 sin excepción: la excepción `0.00` de Practicante no se
 * hereda, aunque el requerimiento aprobado la conserve.
 */
export function evaluarConfirmacionRemuneracionAlta(
  detalle: DetalleRequerimiento,
): ResultadoConfirmacionRemuneracionAlta {
  const lectura = leerRemuneracionPreviaAlta(detalle)

  if (lectura.status === 'no-disponible') {
    return {
      status: 'rechazado',
      motivo: 'remuneracion-no-disponible',
      mensaje: lectura.mensaje,
      requiereAjuste: false,
    }
  }

  const { remuneracionVigente, origenVigente } = lectura.lectura
  if (remuneracionVigente.monto === 0) {
    return {
      status: 'rechazado',
      motivo: 'importe-cero',
      mensaje: MENSAJE_ALTA_NO_CONFIRMA_CERO,
      requiereAjuste: true,
    }
  }
  if (remuneracionVigente.monto < 0) {
    return {
      status: 'rechazado',
      motivo: 'importe-negativo',
      mensaje: MENSAJE_ALTA_IMPORTE_NEGATIVO,
      requiereAjuste: true,
    }
  }

  return {
    status: 'confirmable',
    remuneracion: remuneracionVigente,
    origenVigente,
  }
}
