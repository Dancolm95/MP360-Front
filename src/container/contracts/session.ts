import type { Capability, ContractError } from '../../shared'

/**
 * C-01 (plan §2.1) — Sesión, identidad, contexto y capacidades efectivas;
 * expiración, terminación, actualización y fallos.
 *
 * Puerto de sesión opaco: el frontend solicita contexto/capacidades y escucha
 * el fin de sesión sin ver credenciales ni token; el transporte lo resuelve el
 * adaptador. No hay login local ni captura de credenciales, y no se fija URL,
 * endpoint ni payload.
 */

/** Estado observable de la sesión. `loading` representa la lectura en curso. */
export type SessionStatus =
  | 'loading'
  | 'authenticated'
  | 'expired'
  | 'terminated'
  | 'error'

/** Identidad autorizada, solo si se recibe y puede mostrarse (CORE-01 §4). */
export interface SessionIdentity {
  /** Nombre legible para mostrar (p. ej. nombre completo). Opcional. */
  readonly displayName?: string
}

/**
 * Contexto + capacidades efectivas del usuario. La identidad es opcional y no
 * se rellena con datos de ejemplo; las capacidades son opacas y nunca roles.
 */
export interface SessionContext {
  readonly identity?: SessionIdentity
  readonly capabilities: readonly Capability[]
}

/**
 * Resultado de solicitar contexto/capacidades. No incluye `loading`, que es el
 * estado de la petición en curso.
 */
export type SessionContextResult =
  | { readonly status: 'authenticated'; readonly context: SessionContext }
  | { readonly status: 'expired' }
  | { readonly status: 'terminated' }
  | { readonly status: 'error'; readonly error: ContractError }

/** Motivo del fin de sesión comunicado por el proveedor/backend. */
export type SessionEndedReason = 'expired' | 'terminated'

export interface SessionEndedEvent {
  readonly reason: SessionEndedReason
}

export type SessionEndedListener = (event: SessionEndedEvent) => void
export type SessionEndedUnsubscribe = () => void

/**
 * Puerto de sesión del contenedor.
 *
 * El adaptador decide el transporte y la fuente (backend de autorización /
 * proveedor externo de identidad). No expone credenciales, token, URL de login
 * ni payload.
 */
export interface SessionPort {
  /** Solicita contexto y capacidades efectivos. */
  getContext(): Promise<SessionContextResult>
  /**
   * Suscribe al fin de sesión (expiración o terminación externa). Devuelve una
   * función para cancelar la suscripción.
   */
  onEnded(listener: SessionEndedListener): SessionEndedUnsubscribe
  /**
   * Recuperación de acceso delegada en el proveedor externo, sin login local ni
   * URL tipada.
   */
  recoverAccess(): Promise<void>
}
