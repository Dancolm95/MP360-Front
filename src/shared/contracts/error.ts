/**
 * Error de contrato, común a sesión (C-01), catálogo (C-03) y salida (C-02).
 *
 * `message` es comprensible y dirigido al usuario; `retryable` indica si el
 * contrato permite reintentar la operación fallida (CORE-01 §5). El transporte
 * y la fuente del error los resuelve el adaptador; aquí no se fija su forma
 * concreta más allá de estos dos campos.
 */
export interface ContractError {
  readonly message: string
  readonly retryable: boolean
}
