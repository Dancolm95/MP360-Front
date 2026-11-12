import type { ContractError } from '../../../../shared'

/**
 * Resultado de una lectura del dominio. La carga en curso queda fuera del
 * contrato. `ok` con una colección vacía representa «sin resultados»; un fallo
 * recuperable expone `error.retryable`. `forbidden` cubre la ausencia de
 * capacidad o de ámbito aplicada por el backend.
 */
export type ResultadoLectura<T> =
  | { readonly status: 'ok'; readonly datos: T }
  | { readonly status: 'forbidden' }
  | { readonly status: 'sesion-finalizada' }
  | { readonly status: 'error'; readonly error: ContractError }
