import type {
  CalendarioLaboralUnico,
  ComandoAjustarPlazoAdministrativo,
  ComandosRequerimientosPort,
  DetalleRequerimiento,
  DetalleRequerimientoCompleto,
  DiasHabilesAdministrativos,
  EventoAjustePlazo,
  EventoHistorialId,
  FechaISO,
  InstanteISO,
  Usuario,
} from '../contracts'
import type { PlazoCalculado } from '../deadlines'
import { calcularPlazo, esDiasHabilesAdministrativos } from '../deadlines'
import { evaluarAccion } from './elegibilidad'
import {
  comentarioNormalizado,
  validarDiasHabilesAdministrativos,
} from './reglas'
import {
  accionNoDisponible,
  falloValidacion,
  mapearFalloComando,
} from './resultados'
import type { ErrorAccion, FalloAccion } from './types'

export interface SolicitudAjustePlazo {
  readonly diasHabiles: unknown
  readonly motivo: string | null | undefined
}

/**
 * Actor, instante e identificador del evento de auditoría. Los aporta la sesión
 * o el backend; la interfaz no los inventa ni los deriva del detalle.
 */
export interface ContextoAjustePlazo {
  readonly actor: Usuario
  readonly fechaHora: InstanteISO
  readonly eventoId: EventoHistorialId
}

export interface AjustePlazoProyectado {
  readonly motivo: string
  readonly plazoAnteriorDias: DiasHabilesAdministrativos
  readonly plazoNuevoDias: DiasHabilesAdministrativos
  readonly fechaObjetivoAnterior: FechaISO
  /** Cómputo vigente recalculado desde la aprobación original (T-RH-15). */
  readonly plazo: PlazoCalculado
  readonly evento: EventoAjustePlazo
}

export type ResultadoAjusteCalculado =
  | { readonly status: 'calculado'; readonly ajuste: AjustePlazoProyectado }
  | FalloAccion

export type ResultadoAccionAjustarPlazo =
  | {
      readonly status: 'confirmado'
      readonly accion: 'ajustar-plazo'
      readonly detalle: DetalleRequerimientoCompleto
      readonly ajuste: AjustePlazoProyectado
    }
  | FalloAccion

export function calcularAjustePlazoAdministrativo(
  detalle: DetalleRequerimiento,
  solicitud: SolicitudAjustePlazo,
  contexto: ContextoAjustePlazo,
  calendario: CalendarioLaboralUnico,
): ResultadoAjusteCalculado {
  if (!evaluarAccion(detalle, 'ajustar-plazo').ejecutable) {
    return accionNoDisponible(detalle, 'ajustar-plazo')
  }

  const motivo = comentarioNormalizado(solicitud.motivo)
  const dias = validarDiasHabilesAdministrativos(solicitud.diasHabiles)
  if (motivo === null || !dias.ok) {
    const errores: ErrorAccion[] = []
    if (motivo === null) {
      errores.push({
        campo: 'motivo',
        mensaje: 'El motivo del ajuste es obligatorio.',
      })
    }
    if (!dias.ok) errores.push(dias.error)
    return falloValidacion(errores)
  }

  const plazoAnterior = detalle.plazo
  const duracionAnterior = plazoAnterior?.duracionDiasHabiles
  const fechaAprobacion = plazoAnterior?.fechaAprobacion ?? null
  const fechaObjetivoAnterior = plazoAnterior?.fechaObjetivo ?? null
  if (
    plazoAnterior === null ||
    plazoAnterior.clasificacion !== 'administrativo' ||
    !esDiasHabilesAdministrativos(duracionAnterior) ||
    fechaAprobacion === null ||
    fechaObjetivoAnterior === null
  ) {
    return falloValidacion([
      {
        campo: 'plazo-administrativo',
        mensaje:
          'El requerimiento no tiene un plazo administrativo vigente que ajustar.',
      },
    ])
  }

  // El recálculo parte de la aprobación original, nunca de la fecha del ajuste.
  const calculo = calcularPlazo(
    {
      clasificacion: 'administrativo',
      diasHabiles: dias.diasHabiles,
      fechaAprobacion,
    },
    calendario,
  )
  if (!calculo.ok) {
    return falloValidacion([
      { campo: 'general', mensaje: calculo.error.mensaje },
    ])
  }

  return {
    status: 'calculado',
    ajuste: {
      motivo,
      plazoAnteriorDias: duracionAnterior,
      plazoNuevoDias: dias.diasHabiles,
      fechaObjetivoAnterior,
      plazo: calculo.plazo,
      evento: {
        id: contexto.eventoId,
        usuario: contexto.actor,
        fechaHora: contexto.fechaHora,
        accion: 'ajuste-plazo',
        motivo,
        plazoAnteriorDias: duracionAnterior,
        plazoNuevoDias: dias.diasHabiles,
        fechaObjetivoAnterior,
        fechaObjetivoNueva: calculo.plazo.fechaObjetivo,
      },
    },
  }
}

export async function ajustarPlazoAdministrativo(
  detalle: DetalleRequerimiento,
  solicitud: SolicitudAjustePlazo,
  contexto: ContextoAjustePlazo,
  calendario: CalendarioLaboralUnico,
  port: ComandosRequerimientosPort,
): Promise<ResultadoAccionAjustarPlazo> {
  const calculado = calcularAjustePlazoAdministrativo(
    detalle,
    solicitud,
    contexto,
    calendario,
  )
  if (calculado.status !== 'calculado') return calculado

  const comando: ComandoAjustarPlazoAdministrativo = {
    requerimientoId: detalle.id,
    version: detalle.version,
    diasHabiles: calculado.ajuste.plazoNuevoDias,
    motivo: calculado.ajuste.motivo,
  }
  const resultado = await port.ajustarPlazoAdministrativo(comando)

  if (resultado.status === 'confirmado') {
    return {
      status: 'confirmado',
      accion: 'ajustar-plazo',
      detalle: resultado.datos,
      ajuste: calculado.ajuste,
    }
  }
  return mapearFalloComando(resultado)
}
