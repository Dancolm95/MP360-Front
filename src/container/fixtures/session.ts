import type {
  SessionContext,
  SessionContextResult,
  SessionEndedEvent,
  SessionEndedListener,
  SessionEndedReason,
  SessionEndedUnsubscribe,
  SessionPort,
} from '../contracts'
import type { Capability, ContractError } from '../../shared'
import { MOCK_KIND, type MockAdapter } from './mock'

/**
 * Puerto de sesión mock (C-01, plan §2.1).
 *
 * No implementa login local, no captura credenciales, no escribe en
 * `localStorage`/`sessionStorage` y no simula autorización real: solo devuelve
 * el resultado de contexto/capacidades configurado y permite emitir el fin de
 * sesión a los suscriptores.
 */
export interface MockSessionPort extends SessionPort, MockAdapter {
  /** Emite un fin de sesión (expiración o terminación) a los suscriptores. */
  emitEnded(reason: SessionEndedReason): void
}

export interface MockSessionConfig {
  /** Resultado de contexto/capacidades que devuelve `getContext()`. */
  readonly getContext: () => Promise<SessionContextResult>
  /** Recuperación de acceso delegada en el proveedor (sin login local). */
  readonly recoverAccess?: () => Promise<void>
}

export function createMockSession(config: MockSessionConfig): MockSessionPort {
  const listeners = new Set<SessionEndedListener>()
  const port: MockSessionPort = {
    kind: MOCK_KIND,
    getContext: () => config.getContext(),
    onEnded(listener: SessionEndedListener): SessionEndedUnsubscribe {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    recoverAccess: () => config.recoverAccess?.() ?? Promise.resolve(),
    emitEnded(reason: SessionEndedReason): void {
      const event: SessionEndedEvent = { reason }
      for (const listener of [...listeners]) {
        listener(event)
      }
    },
  }
  return port
}

/** Sesión mock autenticada con contexto y capacidades dados. */
export function mockSessionAuthenticated(context: SessionContext): MockSessionPort {
  return createMockSession({
    getContext: async () => ({ status: 'authenticated', context }),
  })
}

/**
 * Sesión mock autenticada a partir de capacidades opacas (con identidad
 * opcional). La identidad nunca se rellena con datos de ejemplo (CORE-01 §4).
 */
export function mockSessionWithCapabilities(
  capabilities: readonly Capability[],
  identity?: SessionContext['identity'],
): MockSessionPort {
  return mockSessionAuthenticated({ identity, capabilities })
}

/** Sesión mock vencida. */
export function mockSessionExpired(): MockSessionPort {
  return createMockSession({ getContext: async () => ({ status: 'expired' }) })
}

/** Sesión mock terminada externamente. */
export function mockSessionTerminated(): MockSessionPort {
  return createMockSession({ getContext: async () => ({ status: 'terminated' }) })
}

/** Sesión mock con error de contexto/capacidades. */
export function mockSessionError(error: ContractError): MockSessionPort {
  return createMockSession({ getContext: async () => ({ status: 'error', error }) })
}
