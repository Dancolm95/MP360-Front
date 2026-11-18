import type {
  CausalCancelacion,
  ComandoAprobar,
  ComandoCancelar,
  ComandoFijarPlazoAdministrativo,
  ComandoObservar,
  ComandosRequerimientosPort,
  DetalleRequerimiento,
  ResultadoAprobar as ResultadoAprobarContrato,
  ResultadoCancelar as ResultadoCancelarContrato,
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
import {
  accionNoDisponible,
  falloValidacion,
  mapearFalloComando,
} from './resultados'
import type {
  OpcionesAprobar,
  ResultadoAccionAprobar,
  ResultadoAccionCancelar,
  ResultadoAccionFijarPlazo,
  ResultadoAccionObservar,
  SolicitudCancelacion,
} from './types'

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
  if (errores.length > 0) return falloValidacion(errores)

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
    return falloValidacion(validarComentarioObservacion(comentario))
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
  if (errores.length > 0) return falloValidacion(errores)

  const causal: CausalCancelacion | null = solicitud.causal
  if (!esCausalCancelacion(causal)) {
    return falloValidacion(validarCancelacion(solicitud))
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
  if (!validado.ok) return falloValidacion([validado.error])

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
