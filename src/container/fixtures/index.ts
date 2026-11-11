/**
 * Fixtures (adaptadores mock de contrato) del contenedor (T-CORE-03).
 *
 * Implementan los puertos de `../contracts` con adaptadores en memoria,
 * parametrizables por capacidades opacas y marcados con `kind: 'mock'` para
 * distinguirse de operaciones reales. No realizan autorización ni persistencia
 * reales y no escriben en `localStorage`/`sessionStorage`.
 *
 * Las vistas del contenedor (T-CORE-04+) consumen estos fixtures, no servicios
 * reales; la integración real queda pendiente de proveedores.
 */

export {
  MOCK_KIND,
  isMock,
  createDeferred,
  type MockAdapter,
  type Deferred,
} from './mock'

export {
  CAP_RRHH_REQUERIMIENTOS_READ,
  CAP_RRHH_SELECCION_VISIBLE,
  CAP_RRHH_ALTA_VISIBLE,
  RRHH_MODULE_ID,
  SECTION_REQUERIMIENTOS,
  SECTION_SELECCION,
  SECTION_ALTA,
  DEST_RRHH_REQUERIMIENTOS_BANDEJA,
  DEST_RRHH_REQUERIMIENTOS_NUEVO,
  DEST_RRHH_SELECCION,
  DEST_RRHH_ALTA,
  capabilitySet,
  hasCapability,
  type CapabilitySet,
} from './identifiers'

export {
  buildRrhhCatalog,
  createMockCatalogPort,
  createMockCatalog,
  createMockCatalogFromCapabilities,
  createMockCatalogError,
  type MockCatalogPort,
  type MockCatalogConfig,
} from './catalog'

export {
  createMockSession,
  mockSessionAuthenticated,
  mockSessionWithCapabilities,
  mockSessionExpired,
  mockSessionTerminated,
  mockSessionError,
  type MockSessionPort,
  type MockSessionConfig,
} from './session'

export {
  createMockNavigation,
  mockNavigationOk,
  mockNavigationForbidden,
  mockNavigationNotFound,
  mockNavigationSessionEnded,
  mockNavigationFromMap,
  type MockNavigationPort,
  type MockNavigationConfig,
} from './navigation'

export {
  createMockSignOut,
  mockSignOutSuccess,
  mockSignOutError,
  type MockSignOutPort,
  type MockSignOutConfig,
} from './sign-out'

export {
  createInMemoryStore,
  type InMemorySessionScopedStore,
} from './store'

export {
  buildNavigationRules,
  createContainerFixture,
  createSessionWithUx02Fixture,
  createSessionWithoutUx02Fixture,
  createNotImplementedVisibleFixture,
  createContextErrorFixture,
  createLoadingFixture,
  createExpiredFixture,
  createTerminatedFixture,
  createSignOutSuccessFixture,
  createSignOutErrorFixture,
  type ContainerFixture,
  type ContainerFixtureOptions,
  type LoadingFixture,
} from './scenarios'
