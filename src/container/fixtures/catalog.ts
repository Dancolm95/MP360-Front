import type {
  CatalogPort,
  CatalogResult,
  Section,
  SectionCatalog,
} from '../contracts'
import type { ContractError } from '../../shared'
import {
  CAP_RRHH_ALTA_VISIBLE,
  CAP_RRHH_REQUERIMIENTOS_READ,
  CAP_RRHH_SELECCION_VISIBLE,
  RRHH_MODULE_ID,
  SECTION_ALTA,
  SECTION_REQUERIMIENTOS,
  SECTION_SELECCION,
  hasCapability,
  type CapabilitySet,
} from './identifiers'
import { MOCK_KIND, type MockAdapter } from './mock'

/**
 * Catálogo RR. HH. derivado de un conjunto de capacidades (C-03, plan §2.2).
 *
 * La visibilidad y operabilidad se derivan exclusivamente de la pertenencia de
 * capacidades opacas al conjunto; no hay nombre de rol ni etiqueta del PDF.
 * - Requerimientos: implementada; visible y operable solo con lectura UX-02.
 * - Selección / Alta: no implementadas; visibles solo si el backend habilita
 *   explícitamente su visibilidad; nunca operables en este corte
 *   (`capabilities: []`).
 */
export function buildRrhhCatalog(capabilities: CapabilitySet): SectionCatalog {
  const readRequerimientos = hasCapability(capabilities, CAP_RRHH_REQUERIMIENTOS_READ)
  const seleccionVisible = hasCapability(capabilities, CAP_RRHH_SELECCION_VISIBLE)
  const altaVisible = hasCapability(capabilities, CAP_RRHH_ALTA_VISIBLE)

  const requerimientos: Section = {
    id: SECTION_REQUERIMIENTOS,
    status: 'implemented',
    visible: readRequerimientos,
    capabilities: readRequerimientos ? [CAP_RRHH_REQUERIMIENTOS_READ] : [],
  }

  const seleccion: Section = {
    id: SECTION_SELECCION,
    status: 'not-implemented',
    visible: seleccionVisible,
    capabilities: [],
  }

  const alta: Section = {
    id: SECTION_ALTA,
    status: 'not-implemented',
    visible: altaVisible,
    capabilities: [],
  }

  return {
    modules: [{ id: RRHH_MODULE_ID, sections: [requerimientos, seleccion, alta] }],
  }
}

/**
 * Puerto de catálogo mock. Devuelve un resultado configurado; no consulta
 * ningún backend real y no persiste nada.
 */
export interface MockCatalogPort extends CatalogPort, MockAdapter {}

export interface MockCatalogConfig {
  readonly getCatalog: () => Promise<CatalogResult>
}

export function createMockCatalogPort(config: MockCatalogConfig): MockCatalogPort {
  return {
    kind: MOCK_KIND,
    getCatalog: () => config.getCatalog(),
  }
}

/** Catálogo mock listo a partir de un `SectionCatalog` concreto. */
export function createMockCatalog(catalog: SectionCatalog): MockCatalogPort {
  return createMockCatalogPort({
    getCatalog: async () => ({ status: 'ready', catalog }),
  })
}

/** Catálogo mock derivado de capacidades (el caso normal). */
export function createMockCatalogFromCapabilities(
  capabilities: CapabilitySet,
): MockCatalogPort {
  return createMockCatalog(buildRrhhCatalog(capabilities))
}

/** Catálogo mock con error de contrato. */
export function createMockCatalogError(error: ContractError): MockCatalogPort {
  return createMockCatalogPort({
    getCatalog: async () => ({ status: 'error', error }),
  })
}
