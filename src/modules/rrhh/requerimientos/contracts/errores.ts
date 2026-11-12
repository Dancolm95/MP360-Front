import type { ContractError } from '../../../../shared'

/** Campos a los que se asocia un error de validación. */
export type CampoRequerimiento =
  | 'motivo'
  | 'empresa'
  | 'colaborador-a-reemplazar'
  | 'departamento'
  | 'area'
  | 'subarea'
  | 'puesto'
  | 'vacantes'
  | 'remuneracion'
  | 'ubicacion'
  | 'usuario-proxima-tarea'
  | 'comentario'
  | 'plazo-administrativo'
  | 'general'

export interface ErrorValidacion {
  readonly campo: CampoRequerimiento
  readonly mensaje: string
}

export type OrigenIntegracion = 'seleccion' | 'alta'

/**
 * Fallo de un proveedor de integración. Un rechazo o fallo de Selección no
 * cambia estado ni contadores; `error.retryable` indica si el reintento de la
 * misma acción es posible.
 */
export interface ErrorIntegracion {
  readonly origen: OrigenIntegracion
  readonly error: ContractError
}
