import type {
  CatalogResult,
  DestinationResolution,
  LogicalDestination,
  SessionContextResult,
  SessionIdentity,
  SignOutDestination,
} from '../contracts'
import type { ContractError } from '../../shared'
import {
  CAP_RRHH_REQUERIMIENTOS_READ,
  CAP_RRHH_SELECCION_VISIBLE,
  DEST_RRHH_REQUERIMIENTOS_BANDEJA,
  DEST_RRHH_REQUERIMIENTOS_NUEVO,
  DEST_RRHH_SELECCION,
  capabilitySet,
  hasCapability,
  type CapabilitySet,
} from './identifiers'
import { createDeferred } from './mock'
import {
  createMockCatalogError,
  createMockCatalogFromCapabilities,
  createMockCatalogPort,
  type MockCatalogPort,
} from './catalog'
import {
  createMockSession,
  mockSessionError,
  mockSessionExpired,
  mockSessionTerminated,
  mockSessionWithCapabilities,
  type MockSessionPort,
} from './session'
import { mockNavigationFromMap, type MockNavigationPort } from './navigation'
import {
  mockSignOutError,
  mockSignOutSuccess,
  type MockSignOutPort,
} from './sign-out'
import { createInMemoryStore, type InMemorySessionScopedStore } from './store'

/**
 * Fixtures de escenario (CORE-01 §5/§7, plan §4.1).
 *
 * Cada escenario se compone de los cinco puertos mock y se parametriza por un
 * conjunto de capacidades opacas; nunca por nombre de rol ni por etiqueta del
 * PDF. Son marcados (`kind: 'mock'`) y no realizan autorización ni persistencia
 * reales.
 */

/** Paquete coherente de puertos mock para un escenario del contenedor. */
export interface ContainerFixture {
  /** Descripción del escenario y su criterio de CORE-01 §7. */
  readonly scenario: string
  readonly session: MockSessionPort
  readonly catalog: MockCatalogPort
  readonly navigation: MockNavigationPort
  readonly signOut: MockSignOutPort
  readonly store: InMemorySessionScopedStore<unknown>
}

/**
 * Reglas de navegación derivadas de capacidades (C-04). Es el comportamiento
 * por defecto del mock; la resolución real de rutas la implementa el contenedor
 * en T-CORE-07. Un destino sin regla se resuelve como `not-found`, nunca como
 * «Próximamente».
 */
export function buildNavigationRules(
  capabilities: CapabilitySet,
): ReadonlyMap<LogicalDestination, DestinationResolution> {
  const read = hasCapability(capabilities, CAP_RRHH_REQUERIMIENTOS_READ)
  const seleccionVisible = hasCapability(capabilities, CAP_RRHH_SELECCION_VISIBLE)

  const rules = new Map<LogicalDestination, DestinationResolution>()

  const requerimientos: DestinationResolution = read
    ? { status: 'ok', destination: DEST_RRHH_REQUERIMIENTOS_BANDEJA }
    : { status: 'forbidden' }
  rules.set(DEST_RRHH_REQUERIMIENTOS_BANDEJA, requerimientos)

  const nuevo: DestinationResolution = read
    ? { status: 'ok', destination: DEST_RRHH_REQUERIMIENTOS_NUEVO }
    : { status: 'forbidden' }
  rules.set(DEST_RRHH_REQUERIMIENTOS_NUEVO, nuevo)

  const seleccion: DestinationResolution = seleccionVisible
    ? { status: 'ok', destination: DEST_RRHH_SELECCION }
    : { status: 'not-found' }
  rules.set(DEST_RRHH_SELECCION, seleccion)

  return rules
}

/** Opciones del escenario parametrizado por capacidades. */
export interface ContainerFixtureOptions {
  readonly scenario: string
  readonly capabilities: CapabilitySet
  readonly identity?: SessionIdentity
}

/**
 * Escenario coherente derivado de un conjunto de capacidades. Es el punto de
 * entrada para inyectar cualquier situación de CORE-01 §5/§7 sin nombrar roles.
 */
export function createContainerFixture(
  options: ContainerFixtureOptions,
): ContainerFixture {
  return {
    scenario: options.scenario,
    session: mockSessionWithCapabilities(options.capabilities, options.identity),
    catalog: createMockCatalogFromCapabilities(options.capabilities),
    navigation: mockNavigationFromMap(buildNavigationRules(options.capabilities)),
    signOut: mockSignOutSuccess('provider'),
    store: createInMemoryStore<unknown>(),
  }
}

/** Criterio 1: sesión válida con lectura UX-02 (solo RR. HH. ofrecido). */
export function createSessionWithUx02Fixture(
  identity?: SessionIdentity,
): ContainerFixture {
  return createContainerFixture({
    scenario: 'CORE-01 §7 criterio 1: sesión válida con lectura UX-02',
    capabilities: capabilitySet(CAP_RRHH_REQUERIMIENTOS_READ),
    identity,
  })
}

/** Criterio 2: sesión válida sin lectura UX-02 (sin RR. HH. en el selector). */
export function createSessionWithoutUx02Fixture(): ContainerFixture {
  return createContainerFixture({
    scenario: 'CORE-01 §7 criterio 2: sesión válida sin lectura UX-02',
    capabilities: capabilitySet(),
  })
}

/** Criterio 3: UX-02 + una sección no implementada visible explícitamente. */
export function createNotImplementedVisibleFixture(): ContainerFixture {
  return createContainerFixture({
    scenario:
      'CORE-01 §7 criterio 3: UX-02 con sección no implementada visible («Próximamente»)',
    capabilities: capabilitySet(
      CAP_RRHH_REQUERIMIENTOS_READ,
      CAP_RRHH_SELECCION_VISIBLE,
    ),
  })
}

/** Criterio 5: error al obtener contexto/capacidades (con reintento si procede). */
export function createContextErrorFixture(error: ContractError): ContainerFixture {
  return {
    scenario: 'CORE-01 §7 criterio 5: error al obtener contexto/capacidades',
    session: mockSessionError(error),
    catalog: createMockCatalogError(error),
    navigation: mockNavigationFromMap(new Map<LogicalDestination, DestinationResolution>()),
    signOut: mockSignOutSuccess('provider'),
    store: createInMemoryStore<unknown>(),
  }
}

/** Resultado de `createLoadingFixture`: permite resolver la carga a demanda. */
export interface LoadingFixture {
  readonly fixture: ContainerFixture
  readonly resolveSession: (result: SessionContextResult) => void
  readonly resolveCatalog: (result: CatalogResult) => void
}

/** Criterio 5: carga en curso de sesión/contexto/capacidades. */
export function createLoadingFixture(): LoadingFixture {
  const sessionDeferred = createDeferred<SessionContextResult>()
  const catalogDeferred = createDeferred<CatalogResult>()

  return {
    fixture: {
      scenario: 'CORE-01 §7 criterio 5: carga de sesión/contexto/capacidades',
      session: createMockSession({ getContext: () => sessionDeferred.promise }),
      catalog: createMockCatalogPort({ getCatalog: () => catalogDeferred.promise }),
      navigation: mockNavigationFromMap(new Map<LogicalDestination, DestinationResolution>()),
      signOut: mockSignOutSuccess('provider'),
      store: createInMemoryStore<unknown>(),
    },
    resolveSession: sessionDeferred.resolve,
    resolveCatalog: catalogDeferred.resolve,
  }
}

/** Criterio 6: sesión vencida. */
export function createExpiredFixture(): ContainerFixture {
  return {
    scenario: 'CORE-01 §7 criterio 6: sesión vencida',
    session: mockSessionExpired(),
    catalog: createMockCatalogFromCapabilities(capabilitySet()),
    navigation: mockNavigationFromMap(new Map<LogicalDestination, DestinationResolution>()),
    signOut: mockSignOutSuccess('provider'),
    store: createInMemoryStore<unknown>(),
  }
}

/** Criterio 6: sesión terminada externamente. */
export function createTerminatedFixture(): ContainerFixture {
  return {
    scenario: 'CORE-01 §7 criterio 6: sesión terminada externamente',
    session: mockSessionTerminated(),
    catalog: createMockCatalogFromCapabilities(capabilitySet()),
    navigation: mockNavigationFromMap(new Map<LogicalDestination, DestinationResolution>()),
    signOut: mockSignOutSuccess('provider'),
    store: createInMemoryStore<unknown>(),
  }
}

/** Criterio 7: salida voluntaria con éxito. */
export function createSignOutSuccessFixture(
  destination: SignOutDestination = 'provider',
): ContainerFixture {
  const capabilities = capabilitySet(CAP_RRHH_REQUERIMIENTOS_READ)
  return {
    scenario: 'CORE-01 §7 criterio 7: salida voluntaria con éxito',
    session: mockSessionWithCapabilities(capabilities),
    catalog: createMockCatalogFromCapabilities(capabilities),
    navigation: mockNavigationFromMap(buildNavigationRules(capabilities)),
    signOut: mockSignOutSuccess(destination),
    store: createInMemoryStore<unknown>(),
  }
}

/** Criterio 7: salida voluntaria con error reintentable del proveedor. */
export function createSignOutErrorFixture(error: ContractError): ContainerFixture {
  const capabilities = capabilitySet(CAP_RRHH_REQUERIMIENTOS_READ)
  return {
    scenario: 'CORE-01 §7 criterio 7: salida voluntaria con error reintentable',
    session: mockSessionWithCapabilities(capabilities),
    catalog: createMockCatalogFromCapabilities(capabilities),
    navigation: mockNavigationFromMap(buildNavigationRules(capabilities)),
    signOut: mockSignOutError(error),
    store: createInMemoryStore<unknown>(),
  }
}
