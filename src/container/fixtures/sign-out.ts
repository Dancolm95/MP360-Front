import type {
  SignOutDestination,
  SignOutPort,
  SignOutResult,
} from '../contracts'
import type { ContractError } from '../../shared'
import { MOCK_KIND, type MockAdapter } from './mock'

/**
 * Puerto de salida mock (C-02, plan §2.4).
 *
 * Devuelve un resultado de salida configurado, sin cerrar ninguna sesión real
 * en un proveedor. El destino concreto (`provider` | `local`) y el error
 * (`retryable`) los define el fixture, no se fija URL ni endpoint.
 */
export interface MockSignOutPort extends SignOutPort, MockAdapter {}

export interface MockSignOutConfig {
  readonly signOut: () => SignOutResult | Promise<SignOutResult>
}

export function createMockSignOut(config: MockSignOutConfig): MockSignOutPort {
  return {
    kind: MOCK_KIND,
    signOut: async () => config.signOut(),
  }
}

/** Salida mock con éxito y destino indicado. */
export function mockSignOutSuccess(
  destination: SignOutDestination,
): MockSignOutPort {
  return createMockSignOut({
    signOut: async () => ({ status: 'success', destination }),
  })
}

/** Salida mock con error de contrato (reintentable si el error lo indica). */
export function mockSignOutError(error: ContractError): MockSignOutPort {
  return createMockSignOut({
    signOut: async () => ({ status: 'error', error }),
  })
}
