import type { ModuleId } from './contracts'

/**
 * Etiquetas visibles de los módulos conocidos del contenedor.
 *
 * Es solo presentación: la etiqueta no concede visibilidad, operación ni
 * autorización. La habilitación la decide el catálogo/capacidades del backend
 * (C-03) y la revalida el backend. Un módulo sin etiqueta conocida se muestra
 * con su identificador opaco, nunca con un nombre inventado.
 */
const MODULE_LABELS: Readonly<Record<string, string>> = {
  rrhh: 'RR. HH.',
}

export function getModuleLabel(moduleId: ModuleId): string {
  return MODULE_LABELS[moduleId] ?? String(moduleId)
}
