import type {
  BandejaRequerimientosPort,
  ConsultaBandeja,
  DetalleRequerimientosPort,
  RequerimientoId,
  ResultadoBandeja,
  ResultadoDetalle,
} from '../contracts'
import {
  cloneFixtureValue,
  MOCK_KIND,
  resolveFixtureResponse,
  type FixtureResponse,
  type MockAdapter,
} from './support'

export interface MockBandejaRequerimientosPort
  extends BandejaRequerimientosPort,
    MockAdapter {
  readonly calls: readonly ConsultaBandeja[]
}

export function createMockBandejaRequerimientos(
  configuredResult: FixtureResponse<ResultadoBandeja, readonly [ConsultaBandeja]>,
): MockBandejaRequerimientosPort {
  const result =
    typeof configuredResult === 'function'
      ? configuredResult
      : cloneFixtureValue(configuredResult)
  const calls: ConsultaBandeja[] = []

  return {
    kind: MOCK_KIND,
    get calls() {
      return cloneFixtureValue(calls)
    },
    async consultar(consulta) {
      calls.push(cloneFixtureValue(consulta))
      return resolveFixtureResponse(result, cloneFixtureValue(consulta))
    },
  }
}

export interface MockDetalleRequerimientosPort
  extends DetalleRequerimientosPort,
    MockAdapter {
  readonly calls: readonly RequerimientoId[]
}

export function createMockDetalleRequerimientos(
  configuredResult: FixtureResponse<ResultadoDetalle, readonly [RequerimientoId]>,
): MockDetalleRequerimientosPort {
  const result =
    typeof configuredResult === 'function'
      ? configuredResult
      : cloneFixtureValue(configuredResult)
  const calls: RequerimientoId[] = []

  return {
    kind: MOCK_KIND,
    get calls() {
      return cloneFixtureValue(calls)
    },
    async obtener(requerimientoId) {
      calls.push(requerimientoId)
      return resolveFixtureResponse(result, requerimientoId)
    },
  }
}
