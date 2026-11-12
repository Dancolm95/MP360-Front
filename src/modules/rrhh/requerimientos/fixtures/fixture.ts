import type { Capability } from '../../../../shared'
import type {
  AccionBandeja,
  AccionRequerimiento,
  CatalogosRequerimientos,
  ResultadoAsociarCandidato,
  ResultadoConsultaBandeja,
  ResultadoDetalle,
  ResultadoLectura,
} from '../contracts'
import {
  createMockCatalogoRequerimientos,
  type MockCatalogoRequerimientosPort,
} from './catalogos'
import {
  createMockBandejaRequerimientos,
  createMockDetalleRequerimientos,
  type MockBandejaRequerimientosPort,
  type MockDetalleRequerimientosPort,
} from './consultas'
import {
  createMockComandosRequerimientos,
  type MockCommandResults,
  type MockComandosRequerimientosPort,
} from './comandos'
import {
  createMockNavegacionSeleccion,
  type MockNavegacionSeleccionPort,
} from './navegacion'
import { cloneFixtureValue, MOCK_KIND } from './support'

export interface EffectiveFixtureAccess {
  readonly capabilities: readonly Capability[]
  readonly trayActions: readonly AccionBandeja[]
  readonly recordActions: readonly AccionRequerimiento[]
}

export interface RequerimientosFixtureConfig {
  readonly scenario: string
  readonly access: EffectiveFixtureAccess
  readonly catalogos: ResultadoLectura<CatalogosRequerimientos>
  readonly bandeja: ResultadoConsultaBandeja
  readonly detalle: ResultadoDetalle
  readonly comandos: MockCommandResults
  readonly asociarCandidato: ResultadoAsociarCandidato
}

export interface RequerimientosFixture {
  readonly kind: typeof MOCK_KIND
  readonly scenario: string
  readonly access: EffectiveFixtureAccess
  readonly catalogos: MockCatalogoRequerimientosPort
  readonly bandeja: MockBandejaRequerimientosPort
  readonly detalle: MockDetalleRequerimientosPort
  readonly comandos: MockComandosRequerimientosPort
  readonly seleccion: MockNavegacionSeleccionPort
}

export function createRequerimientosFixture(
  config: RequerimientosFixtureConfig,
): RequerimientosFixture {
  const snapshot = cloneFixtureValue(config)
  return {
    kind: MOCK_KIND,
    scenario: snapshot.scenario,
    access: snapshot.access,
    catalogos: createMockCatalogoRequerimientos(snapshot.catalogos),
    bandeja: createMockBandejaRequerimientos(snapshot.bandeja),
    detalle: createMockDetalleRequerimientos(snapshot.detalle),
    comandos: createMockComandosRequerimientos(snapshot.comandos),
    seleccion: createMockNavegacionSeleccion(snapshot.asociarCandidato),
  }
}
