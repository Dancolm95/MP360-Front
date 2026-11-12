import type {
  CatalogoRequerimientosPort,
  CatalogosRequerimientos,
  ResultadoLectura,
} from '../contracts'
import {
  cloneFixtureValue,
  MOCK_KIND,
  resolveFixtureResponse,
  type FixtureResponse,
  type MockAdapter,
} from './support'

export interface MockCatalogoRequerimientosPort
  extends CatalogoRequerimientosPort,
    MockAdapter {
  readonly calls: number
}

export function createMockCatalogoRequerimientos(
  configuredResult: FixtureResponse<
    ResultadoLectura<CatalogosRequerimientos>,
    readonly []
  >,
): MockCatalogoRequerimientosPort {
  const result =
    typeof configuredResult === 'function'
      ? configuredResult
      : cloneFixtureValue(configuredResult)
  let calls = 0

  return {
    kind: MOCK_KIND,
    get calls() {
      return calls
    },
    async obtener() {
      calls += 1
      return resolveFixtureResponse(result)
    },
  }
}
