import type {
  CampoRequerimiento,
  ComandoVersionado,
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
  FalloComandoVersionado,
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

export const MENSAJE_CONFLICTO_VERSION =
  'Los datos del requerimiento cambiaron. Revisa la versión vigente antes de decidir de nuevo.'

/**
 * Conserva la entrada exacta junto al conflicto para que la vista pueda mostrar
 * los datos vigentes y reconstruir el comando con la versión actualizada.
 */
export function mapearFalloComandoVersionado<C extends ComandoVersionado>(
  comando: C,
  resultado: FalloComandoContrato,
): FalloComandoVersionado<C> {
  const fallo = mapearFalloComando(resultado)
  if (fallo.status !== 'conflicto-version') return fallo

  return {
    status: 'conflicto-version',
    conflicto: fallo.conflicto,
    entrada: comando,
    datosVigentes: fallo.conflicto.datosVigentes,
    versionVigente: fallo.conflicto.versionVigente,
    mensaje: MENSAJE_CONFLICTO_VERSION,
    entradaConservada: true,
    reintentable: true,
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
