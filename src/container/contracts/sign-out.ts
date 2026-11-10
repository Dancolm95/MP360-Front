import type { ContractError } from '../../shared'

/**
 * C-02 (plan §2.4) — Salida voluntaria («Salir»).
 *
 * `signOut()` inicia el cierre de la sesión real en el proveedor externo. El
 * destino de éxito y la acción concreta los resuelve el adaptador; no se fija
 * URL, endpoint ni payload.
 */

/** Destino tras una salida con éxito. */
export type SignOutDestination = 'provider' | 'local'

export type SignOutResult =
  | { readonly status: 'success'; readonly destination: SignOutDestination }
  | { readonly status: 'error'; readonly error: ContractError }

/**
 * Puerto de salida. Al terminar con éxito, el contenedor limpia de inmediato
 * estado y contexto local conforme a §2.1; ante un error del proveedor conserva
 * el estado y explica cómo continuar (`error.retryable`).
 */
export interface SignOutPort {
  signOut(): Promise<SignOutResult>
}
