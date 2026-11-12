import type {
  ConsultaAsociarCandidato,
  NavegacionSeleccionPort,
  ResultadoAsociarCandidato,
} from '../contracts'
import { cloneFixtureValue, MOCK_KIND, type MockAdapter } from './support'

export interface MockNavegacionSeleccionPort
  extends NavegacionSeleccionPort,
    MockAdapter {
  readonly calls: readonly ConsultaAsociarCandidato[]
}

export function createMockNavegacionSeleccion(
  configuredResult: ResultadoAsociarCandidato,
): MockNavegacionSeleccionPort {
  const result = cloneFixtureValue(configuredResult)
  const calls: ConsultaAsociarCandidato[] = []

  return {
    kind: MOCK_KIND,
    get calls() {
      return cloneFixtureValue(calls)
    },
    async asociarCandidato(consulta) {
      calls.push(cloneFixtureValue(consulta))
      return cloneFixtureValue(result)
    },
  }
}
