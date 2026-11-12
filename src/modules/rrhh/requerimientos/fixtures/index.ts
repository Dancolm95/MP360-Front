export { MOCK_KIND, type FixtureResponse, type MockAdapter } from './support'
export {
  createMockCatalogoRequerimientos,
  type MockCatalogoRequerimientosPort,
} from './catalogos'
export {
  createMockBandejaRequerimientos,
  createMockDetalleRequerimientos,
  type MockBandejaRequerimientosPort,
  type MockDetalleRequerimientosPort,
} from './consultas'
export {
  createMockComandosRequerimientos,
  type MockCommandCalls,
  type MockCommandResults,
  type MockComandosRequerimientosPort,
} from './comandos'
export {
  createMockNavegacionSeleccion,
  type MockNavegacionSeleccionPort,
} from './navegacion'
export { lecturaFixture, detalleFixture, comandoFixture, creacionFixture } from './resultados'
export {
  createRequerimientosFixture,
  type EffectiveFixtureAccess,
  type RequerimientosFixture,
  type RequerimientosFixtureConfig,
} from './fixture'
