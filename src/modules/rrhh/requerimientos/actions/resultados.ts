import type {
  CampoRequerimiento,
  DetalleRequerimiento,
  ErrorValidacion,
  ResultadoComando,
} from '../contracts'
import { evaluarAccion } from './elegibilidad'
import type {
  AccionEvaluable,
  CampoAccion,
  ErrorAccion,
  FalloAccion,
} from './types'

function campoDeContrato(campo: CampoRequerimiento): CampoAccion {
  if (
    campo === 'comentario' ||
    campo === 'motivo' ||
    campo === 'plazo-administrativo'
  ) {
    return campo
  }
  return 'general'
}

function erroresDeContrato(
  errores: readonly ErrorValidacion[],
): readonly ErrorAccion[] {
  return errores.map((error) => ({
    campo: campoDeContrato(error.campo),
    mensaje: error.mensaje,
  }))
}

export type FalloComandoContrato = Exclude<
  ResultadoComando<unknown>,
  { readonly status: 'confirmado' }
>

export function mapearFalloComando(
  resultado: FalloComandoContrato,
): FalloAccion {
  switch (resultado.status) {
    case 'conflicto-version':
      return {
        status: 'conflicto-version',
        conflicto: resultado.conflicto,
        entradaConservada: true,
        reintentable: true,
      }
    case 'validacion':
      return {
        status: 'validacion',
        errores: erroresDeContrato(resultado.errores),
        entradaConservada: true,
        reintentable: true,
      }
    case 'sin-autorizacion':
      return {
        status: 'sin-autorizacion',
        motivo: resultado.motivo,
        entradaConservada: true,
        reintentable: false,
      }
    case 'estado-invalido':
      return {
        status: 'estado-invalido',
        estadoActual: resultado.estadoActual,
        entradaConservada: true,
        reintentable: false,
      }
    case 'error-integracion':
      return {
        status: 'error-integracion',
        error: resultado.error,
        entradaConservada: true,
        reintentable: resultado.error.error.retryable,
      }
    case 'error':
      return {
        status: 'error',
        error: resultado.error,
        entradaConservada: true,
        reintentable: resultado.error.retryable,
      }
    case 'sesion-finalizada':
      return {
        status: 'sesion-finalizada',
        entradaConservada: true,
        reintentable: false,
      }
  }
}

export function falloValidacion(errores: readonly ErrorAccion[]): FalloAccion {
  return {
    status: 'validacion',
    errores,
    entradaConservada: true,
    reintentable: true,
  }
}

export function accionNoDisponible(
  detalle: DetalleRequerimiento,
  accion: AccionEvaluable,
): FalloAccion {
  const evaluada = evaluarAccion(detalle, accion)
  return {
    status: 'accion-no-disponible',
    accion,
    motivo: evaluada.motivo ?? 'sin-autorizacion',
    mensaje:
      evaluada.mensaje ??
      'La acción no está disponible para este requerimiento.',
    entradaConservada: true,
    reintentable: false,
  }
}
