import type { DetalleRequerimientoCompleto } from '../contracts'
import {
  DIAS_HABILES_ADMINISTRATIVOS,
  esDiasHabilesAdministrativos,
  situacionPlazoAprobacion,
} from '../deadlines'
import { clasificacionDeDetalle, esCausalCancelacion } from '../model'
import type {
  ErrorAccion,
  ResultadoPlazoValidado,
  SolicitudCancelacion,
} from './types'

export function comentarioNormalizado(
  comentario: string | null | undefined,
): string | null {
  if (typeof comentario !== 'string') return null
  const limpio = comentario.trim()
  return limpio === '' ? null : limpio
}

/**
 * La clasificación administrativa exige un plazo ya fijado y entero dentro del
 * rango. No calcula días hábiles ni fecha objetivo: eso pertenece al contrato
 * de plazos.
 */
export function validarPlazoAdministrativoParaAprobar(
  detalle: DetalleRequerimientoCompleto,
): readonly ErrorAccion[] {
  if (
    situacionPlazoAprobacion(
      clasificacionDeDetalle(detalle),
      detalle.plazo,
    ) !== 'invalido'
  ) {
    return []
  }

  return [
    {
      campo: 'plazo-administrativo',
      mensaje: `El plazo administrativo debe ser un entero entre ${DIAS_HABILES_ADMINISTRATIVOS.minimo} y ${DIAS_HABILES_ADMINISTRATIVOS.maximo} días hábiles antes de aprobar.`,
    },
  ]
}

export function validarComentarioObservacion(
  comentario: string | null | undefined,
): readonly ErrorAccion[] {
  if (comentarioNormalizado(comentario) !== null) return []
  return [
    {
      campo: 'comentario',
      mensaje: 'El comentario es obligatorio para observar el requerimiento.',
    },
  ]
}

/**
 * El formulario puede entregar el valor sin convertir, así que la validación
 * acepta cualquier entrada y solo deja pasar el entero del rango administrativo
 * que exige el comando.
 */
export function validarDiasHabilesAdministrativos(
  valor: unknown,
): ResultadoPlazoValidado {
  if (esDiasHabilesAdministrativos(valor)) {
    return { ok: true, diasHabiles: valor }
  }
  return {
    ok: false,
    error: {
      campo: 'plazo-administrativo',
      mensaje: `El plazo administrativo debe ser un entero entre ${DIAS_HABILES_ADMINISTRATIVOS.minimo} y ${DIAS_HABILES_ADMINISTRATIVOS.maximo} días hábiles.`,
    },
  }
}

export function validarCancelacion(
  solicitud: SolicitudCancelacion,
): readonly ErrorAccion[] {
  const errores: ErrorAccion[] = []

  if (solicitud.confirmado !== true) {
    errores.push({
      campo: 'confirmacion',
      mensaje: 'Confirma la cancelación del requerimiento.',
    })
  }
  if (!esCausalCancelacion(solicitud.causal)) {
    errores.push({
      campo: 'causal',
      mensaje:
        'Selecciona una causal válida: menor carga laboral o creación por error.',
    })
  }

  return errores
}
