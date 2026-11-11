import type { Capability } from '../../shared'
export {
  CAP_RRHH_ALTA_VISIBLE,
  CAP_RRHH_REQUERIMIENTOS_READ,
  CAP_RRHH_SELECCION_VISIBLE,
  DEST_RRHH_ALTA,
  DEST_RRHH_REQUERIMIENTOS_BANDEJA,
  DEST_RRHH_REQUERIMIENTOS_NUEVO,
  DEST_RRHH_SELECCION,
  RRHH_MODULE_ID,
  SECTION_ALTA,
  SECTION_REQUERIMIENTOS,
  SECTION_SELECCION,
} from '../../modules/rrhh/identifiers'

/**
 * Identificadores opacos conocidos de este corte (CORE-01, plan §2.2/§2.3/§3).
 *
 * Son cadenas opacas acordadas entre el backend de autorización y el contenedor,
 * producidas por el adaptador/backend (no por el frontend). El contenedor las
 * trata como opacas: las compara por identidad (pertenencia a un conjunto) y
 * nunca decide permisos a partir de su forma, de un nombre de rol ni de una
 * etiqueta del PDF. La parametrización de los fixtures es por estas
 * capacidades/identificadores, nunca por rol.
 */

/** Conjunto de capacidades efectivas de una sesión. */
export type CapabilitySet = readonly Capability[]

/** Construye un conjunto de capacidades a partir de capacidades opacas. */
export function capabilitySet(...capabilities: readonly Capability[]): CapabilitySet {
  return capabilities
}

/** Pertenencia de una capacidad a un conjunto (comparación por identidad). */
export function hasCapability(set: CapabilitySet, capability: Capability): boolean {
  return set.includes(capability)
}
