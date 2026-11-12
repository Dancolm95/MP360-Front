import type { Remuneracion } from './base'
import type { ProcesoSeleccionId } from './identificadores'

/** Referencia al proceso ya creado en Selección; no es una URL ni un endpoint. */
export interface ProcesoSeleccionRef {
  readonly id: ProcesoSeleccionId
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

// La lectura de candidatos de Selección (vínculos y desvínculos mostrados en
// UX-04) no se modela en T-RH-02: queda como contrato posterior de T-RH-11,
// sin tipos ni datos ficticios aquí.
