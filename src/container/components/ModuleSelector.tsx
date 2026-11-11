'use client'

import type { ModuleId, SectionCatalog } from '../contracts'
import { getModuleLabel } from '../labels'
import { getSelectableModules } from '../selectors'

/**
 * Selector de módulos con navegación horizontal (CORE-01 §4.1–§4.2).
 *
 * Solo presenta los módulos habilitados por el catálogo/capacidades del
 * backend. Sin lectura UX-02 no aparece RR. HH. y no se ofrece «Próximamente»
 * como sustituto. Cada módulo es un botón nativo (operable por teclado) y el
 * activo se identifica con `aria-current="page"` más una indicación textual,
 * no solo con color.
 */
export interface ModuleSelectorProps {
  readonly catalog: SectionCatalog
  readonly activeModuleId?: ModuleId
  readonly onSelectModule?: (moduleId: ModuleId) => void
}

export function ModuleSelector({
  catalog,
  activeModuleId,
  onSelectModule,
}: ModuleSelectorProps) {
  const modules = getSelectableModules(catalog)

  return (
    <nav className="erp-module-selector" aria-label="Módulos del ERP">
      {modules.length === 0 ? (
        <p className="erp-module-selector__empty">
          Sin módulos disponibles para esta sesión.
        </p>
      ) : (
        <ul className="erp-module-selector__list">
          {modules.map((module) => {
            const isActive = module.id === activeModuleId
            const label = getModuleLabel(module.id)

            return (
              <li key={module.id}>
                <button
                  type="button"
                  className="erp-module-selector__item"
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={isActive ? `${label} (módulo activo)` : undefined}
                  onClick={() => onSelectModule?.(module.id)}
                >
                  {label}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </nav>
  )
}
