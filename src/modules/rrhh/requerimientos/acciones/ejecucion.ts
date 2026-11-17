import type {
  CampoRequerimiento,
  CausalCancelacion,
  ComandoAprobar,
  ComandoCancelar,
  ComandoFijarPlazoAdministrativo,
  ComandoObservar,
  ComandosRequerimientosPort,
  DetalleRequerimiento,
  ErrorValidacion,
  ResultadoAprobar as ResultadoAprobarContrato,
  ResultadoCancelar as ResultadoCancelarContrato,
  ResultadoComando,
  ResultadoFijarPlazo as ResultadoFijarPlazoContrato,
  ResultadoObservar as ResultadoObservarContrato,
} from '../contracts'
import { evaluarAccion } from './elegibilidad'
import {
  comentarioNormalizado,
  esCausalCancelacion,
  validarCancelacion,
  validarComentarioObservacion,
  validarDiasHabilesAdministrativos,
  validarPlazoAdministrativoParaAprobar,
} from './reglas'
import type {
  AccionGestion,
  CampoAccion,
  ErrorAccion,
  FalloAccion,
  OpcionesAprobar,
  ResultadoAccionAprobar,
  ResultadoAccionCancelar,
  ResultadoAccionFijarPlazo,
  ResultadoAccionObservar,
  SolicitudCancelacion,
} from './tipos'

function campoDeContrato(campo: CampoRequerimiento): CampoAccion {
  if (campo === 'comentario' || campo === 'plazo-administrativo') return campo
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

type FalloComandoContrato = Exclude<
  ResultadoComando<unknown>,
  { readonly status: 'confirmado' }
>

function mapearFalloComando(resultado: FalloComandoContrato): FalloAccion {
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

function validacion(errores: readonly ErrorAccion[]): FalloAccion {
  return {
    status: 'validacion',
    errores,
    entradaConservada: true,
    reintentable: true,
  }
}

function accionNoDisponible(
  detalle: DetalleRequerimiento,
  accion: AccionGestion,
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

/**
 * Aprobar un pendiente. La clasificación administrativa exige un plazo válido
 * antes de invocar al backend; un Operativo no lo requiere.
 */
export async function aprobarRequerimiento(
  detalle: DetalleRequerimiento,
  opciones: OpcionesAprobar,
  port: ComandosRequerimientosPort,
): Promise<ResultadoAccionAprobar> {
  if (!evaluarAccion(detalle, 'aprobar').ejecutable) {
    return accionNoDisponible(detalle, 'aprobar')
  }
  if (detalle.estado !== 'pendiente-aprobacion') {
    return accionNoDisponible(detalle, 'aprobar')
  }

  const errores = validarPlazoAdministrativoParaAprobar(detalle)
  if (errores.length > 0) return validacion(errores)

  const comentario = comentarioNormalizado(opciones.comentario)
  const comando: ComandoAprobar = {
    requerimientoId: detalle.id,
    version: detalle.version,
    ...(comentario === null ? {} : { comentario }),
  }
  const resultado: ResultadoAprobarContrato = await port.aprobar(comando)

  if (resultado.status === 'confirmado') {
    return {
      status: 'confirmado',
      accion: 'aprobar',
      detalle: resultado.datos,
    }
  }
  return mapearFalloComando(resultado)
}

export async function observarRequerimiento(
  detalle: DetalleRequerimiento,
  comentario: string | null | undefined,
  port: ComandosRequerimientosPort,
): Promise<ResultadoAccionObservar> {
  if (!evaluarAccion(detalle, 'observar').ejecutable) {
    return accionNoDisponible(detalle, 'observar')
  }
  if (detalle.estado !== 'pendiente-aprobacion') {
    return accionNoDisponible(detalle, 'observar')
  }

  const limpio = comentarioNormalizado(comentario)
  if (limpio === null) {
    return validacion(validarComentarioObservacion(comentario))
  }

  const comando: ComandoObservar = {
    requerimientoId: detalle.id,
    version: detalle.version,
    comentario: limpio,
  }
  const resultado: ResultadoObservarContrato = await port.observar(comando)

  if (resultado.status === 'confirmado') {
    return {
      status: 'confirmado',
      accion: 'observar',
      detalle: resultado.datos,
    }
  }
  return mapearFalloComando(resultado)
}

/**
 * «Cancelar requerimiento» exige confirmación explícita y causal válida; no
 * comparte flujo con «Cancelar edición» (T-RH-10).
 */
export async function cancelarRequerimiento(
  detalle: DetalleRequerimiento,
  solicitud: SolicitudCancelacion,
  port: ComandosRequerimientosPort,
): Promise<ResultadoAccionCancelar> {
  if (!evaluarAccion(detalle, 'cancelar').ejecutable) {
    return accionNoDisponible(detalle, 'cancelar')
  }

  const errores = validarCancelacion(solicitud)
  if (errores.length > 0) return validacion(errores)

  const causal: CausalCancelacion | null = solicitud.causal
  if (!esCausalCancelacion(causal)) {
    return validacion(validarCancelacion(solicitud))
  }

  const comentario = comentarioNormalizado(solicitud.comentario)
  const comando: ComandoCancelar = {
    requerimientoId: detalle.id,
    version: detalle.version,
    causal,
    ...(comentario === null ? {} : { comentario }),
  }
  const resultado: ResultadoCancelarContrato = await port.cancelar(comando)

  if (resultado.status === 'confirmado') {
    return {
      status: 'confirmado',
      accion: 'cancelar',
      detalle: resultado.datos,
    }
  }
  return mapearFalloComando(resultado)
}

/**
 * Fijar el plazo administrativo antes de aprobar. La acción no existe para
 * Operativo ni fuera de Pendiente de aprobación, y el valor debe ser un entero
 * 15–30; el ajuste auditado posterior pertenece a T-RH-13.
 */
export async function fijarPlazoAdministrativo(
  detalle: DetalleRequerimiento,
  valor: unknown,
  port: ComandosRequerimientosPort,
): Promise<ResultadoAccionFijarPlazo> {
  if (!evaluarAccion(detalle, 'fijar-plazo').ejecutable) {
    return accionNoDisponible(detalle, 'fijar-plazo')
  }
  if (detalle.estado !== 'pendiente-aprobacion') {
    return accionNoDisponible(detalle, 'fijar-plazo')
  }

  const validado = validarDiasHabilesAdministrativos(valor)
  if (!validado.ok) return validacion([validado.error])

  const comando: ComandoFijarPlazoAdministrativo = {
    requerimientoId: detalle.id,
    version: detalle.version,
    diasHabiles: validado.diasHabiles,
  }
  const resultado: ResultadoFijarPlazoContrato =
    await port.fijarPlazoAdministrativo(comando)

  if (resultado.status === 'confirmado') {
    return {
      status: 'confirmado',
      accion: 'fijar-plazo',
      detalle: resultado.datos,
    }
  }
  return mapearFalloComando(resultado)
}
