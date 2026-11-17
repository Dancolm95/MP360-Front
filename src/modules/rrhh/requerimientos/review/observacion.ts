import type {
  DetalleRequerimiento,
  EstadoRequerimiento,
  EventoCambioEstado,
  EventoHistorial,
  InstanteISO,
  Usuario,
} from '../contracts'

export interface ObservacionVigente {
  readonly autor: Usuario
  readonly fechaHora: InstanteISO
  readonly comentario: string
}

export type MotivoSinObservacion = 'sin-evento' | 'comentario-ausente'

export type LecturaObservacion =
  | {
      readonly status: 'disponible'
      readonly observacion: ObservacionVigente
    }
  | {
      readonly status: 'sin-observacion'
      readonly motivo: MotivoSinObservacion
    }
  | {
      readonly status: 'no-observado'
      readonly estado: Exclude<EstadoRequerimiento, 'observado'>
    }

type EventoObservacion = EventoCambioEstado & { readonly accion: 'observacion' }

function esObservacion(evento: EventoHistorial): evento is EventoObservacion {
  return evento.accion === 'observacion'
}

/**
 * Comentario de la observación vigente para mostrarlo antes de corregir. Es el
 * del último evento de observación, no `detalle.comentario` (la justificación
 * del requerimiento), y no se sustituye por un texto inventado cuando falta.
 */
export function observacionVigente(
  detalle: DetalleRequerimiento,
): LecturaObservacion {
  if (detalle.estado !== 'observado') {
    return { status: 'no-observado', estado: detalle.estado }
  }

  let vigente: EventoObservacion | null = null
  for (const evento of detalle.historial) {
    if (!esObservacion(evento)) continue
    // Compara instantes, no cadenas: el historial puede llegar desordenado.
    if (
      vigente === null ||
      Date.parse(evento.fechaHora) >= Date.parse(vigente.fechaHora)
    ) {
      vigente = evento
    }
  }

  if (vigente === null) {
    return { status: 'sin-observacion', motivo: 'sin-evento' }
  }
  if (vigente.comentario === null || vigente.comentario.trim() === '') {
    return { status: 'sin-observacion', motivo: 'comentario-ausente' }
  }

  return {
    status: 'disponible',
    observacion: {
      autor: vigente.usuario,
      fechaHora: vigente.fechaHora,
      comentario: vigente.comentario,
    },
  }
}
