import type {
  DestinationResolution,
  LogicalDestination,
  NavigationPort,
} from '../contracts'
import { MOCK_KIND, type MockAdapter } from './mock'

/**
 * Puerto de navegación mock (C-04, plan §2.3).
 *
 * Resuelve destinos lógicos con un resultado discriminado configurado, sin
 * validar autorización real ni acceder a vistas. No confunde `not-found` con
 * «Próximamente»: ese resultado queda explícito y a cargo del contenedor.
 */
export interface MockNavigationPort extends NavigationPort, MockAdapter {}

export interface MockNavigationConfig {
  readonly resolve: (
    destination: LogicalDestination,
  ) => DestinationResolution | Promise<DestinationResolution>
}

export function createMockNavigation(
  config: MockNavigationConfig,
): MockNavigationPort {
  return {
    kind: MOCK_KIND,
    resolve: async (destination) => config.resolve(destination),
  }
}

/** Navegación mock que resuelve todos los destinos a `ok` hacia el mismo destino. */
export function mockNavigationOk(
  destination: LogicalDestination,
): MockNavigationPort {
  return createMockNavigation({
    resolve: () => ({ status: 'ok', destination }),
  })
}

/** Navegación mock que deniega todos los destinos (`forbidden`). */
export function mockNavigationForbidden(): MockNavigationPort {
  return createMockNavigation({ resolve: () => ({ status: 'forbidden' }) })
}

/** Navegación mock que trata todos los destinos como desconocidos (`not-found`). */
export function mockNavigationNotFound(): MockNavigationPort {
  return createMockNavigation({ resolve: () => ({ status: 'not-found' }) })
}

/** Navegación mock que reporta pérdida de sesión en todos los destinos. */
export function mockNavigationSessionEnded(): MockNavigationPort {
  return createMockNavigation({ resolve: () => ({ status: 'session-ended' }) })
}

/**
 * Navegación mock por mapa de destinos → resultado. Los destinos ausentes se
 * resuelven como `not-found` (desconocido), nunca como «Próximamente».
 */
export function mockNavigationFromMap(
  rules: ReadonlyMap<LogicalDestination, DestinationResolution>,
): MockNavigationPort {
  return createMockNavigation({
    resolve: (destination) => rules.get(destination) ?? { status: 'not-found' },
  })
}
