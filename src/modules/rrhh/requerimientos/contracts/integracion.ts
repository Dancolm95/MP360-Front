import type { Remuneracion } from './base'
import type {
  FechaISO,
  InstanteISO,
  ProcesoSeleccionId,
  UsuarioId,
} from './identificadores'

/** Referencia al proceso ya creado en Selección; no es una URL ni un endpoint. */
export interface ProcesoSeleccionRef {
  readonly id: ProcesoSeleccionId
}

/**
 * Dato de solo lectura que aporta Alta. Requerimientos lo consume únicamente
 * para la cobertura; no altera la fecha objetivo ni el cómputo de plazos.
 */
export interface PrimerDiaRealAlta {
  readonly fecha: FechaISO
}

/**
 * Vista de solo lectura de la remuneración previa al alta. El ajuste pertenece
 * a Alta, que valida >0 sin la excepción `0.00` de Practicante y no confirma el
 * ingreso mientras el importe siga en `0.00`. Requerimientos no edita ni
 * duplica ese ajuste ni modifica los datos aprobados del requerimiento.
 */
export interface RemuneracionPreviaAlta {
  readonly remuneracionAprobada: Remuneracion
  readonly remuneracionVigente: Remuneracion
  readonly ajustadaAntesDelAlta: boolean
}

/** Solicitud motivada de RR. HH.; no altera la cobertura por sí misma. */
export interface SolicitudReversionCobertura {
  readonly motivo: string
}

/**
 * Evento auditado de Selección que confirma una reversión. Solo este evento
 * recalcula la cobertura; la solicitud por sí sola no cambia los contadores.
 */
export interface EventoReversionCobertura {
  readonly origen: 'seleccion'
  readonly motivo: string
  readonly actor: UsuarioId
  readonly fechaHora: InstanteISO
}
