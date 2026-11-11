import type { ModuleCatalog, SectionCatalog } from './contracts'

/**
 * Módulos ofrecidos en el selector (CORE-01 §4.1, plan §2.2).
 *
 * Solo se ofrece un módulo cuando el catálogo del backend le da al menos una
 * sección implementada, visible y operable (capacidades no vacías). La
 * visibilidad sola no basta: una sección visible sin capacidades no habilita la
 * entrada al módulo. El contenedor no interpreta el contenido de las
 * capacidades ni infiere permisos por nombre de rol o etiqueta del PDF.
 */
export function getSelectableModules(
  catalog: SectionCatalog,
): readonly ModuleCatalog[] {
  return catalog.modules.filter((module) =>
    module.sections.some(
      (section) =>
        section.status === 'implemented' &&
        section.visible &&
        section.capabilities.length > 0,
    ),
  )
}
