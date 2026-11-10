import type { Capability, ContractError, Opaque } from '../../shared'

/**
 * C-03 (plan §2.2) — Catálogo de secciones, estado implementado y
 * visibilidad/capacidades efectivas.
 *
 * Catálogo jerárquico módulo → sección. El backend es la única fuente de qué es
 * visible y qué es operable; el frontend lo refleja sin inferir permisos del
 * nombre de rol ni de etiquetas del PDF.
 */

/** Identificador lógico de módulo (p. ej. `rrhh`); no es una URL. */
export type ModuleId = Opaque<string, 'ModuleId'>

/** Identificador lógico de sección; no es una URL ni un endpoint. */
export type SectionId = Opaque<string, 'SectionId'>

/** Estado de implementación de una sección. */
export type SectionStatus = 'implemented' | 'not-implemented'

/**
 * Sección del catálogo. `visible` lo decide el backend y no concede operaciones:
 * sin `capabilities` la sección es visible pero no operable (CORE-01 §4.4).
 */
export interface Section {
  readonly id: SectionId
  readonly status: SectionStatus
  readonly visible: boolean
  readonly capabilities: readonly Capability[]
}

/** Módulo del catálogo, con sus secciones. */
export interface ModuleCatalog {
  readonly id: ModuleId
  readonly sections: readonly Section[]
}

/** Catálogo jerárquico módulo → sección. */
export interface SectionCatalog {
  readonly modules: readonly ModuleCatalog[]
}

/** Resultado de obtener el catálogo (`loading` es la petición en curso). */
export type CatalogResult =
  | { readonly status: 'ready'; readonly catalog: SectionCatalog }
  | { readonly status: 'error'; readonly error: ContractError }

/**
 * Puerto del catálogo de secciones. Devuelve módulos y secciones con estado,
 * visibilidad y capacidades efectivas para el usuario.
 */
export interface CatalogPort {
  getCatalog(): Promise<CatalogResult>
}
