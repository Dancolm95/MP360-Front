import type { LogicalDestination, ModuleId, SectionId } from '../contracts'
import type { Capability } from '../../shared'

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

/** Capacidades efectivas (C-01/C-03, plan §2.1/§2.2). */
export const CAP_RRHH_REQUERIMIENTOS_READ: Capability =
  'rrhh:requerimientos:read' as Capability

/**
 * Visibilidad explícita del marcador «Próximamente» de una sección aún no
 * implementada. No confiere operaciones: la sección queda `visible` con
 * `capabilities: []` (CORE-01 §4.4).
 */
export const CAP_RRHH_SELECCION_VISIBLE: Capability =
  'rrhh:seleccion:visible' as Capability

export const CAP_RRHH_ALTA_VISIBLE: Capability =
  'rrhh:alta:visible' as Capability

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

/** Identificadores lógicos de módulo y secciones RR. HH. (C-03). */
export const RRHH_MODULE_ID: ModuleId = 'rrhh' as ModuleId
export const SECTION_REQUERIMIENTOS: SectionId = 'requerimientos' as SectionId
export const SECTION_SELECCION: SectionId = 'seleccion' as SectionId
export const SECTION_ALTA: SectionId = 'alta' as SectionId

/** Destinos lógicos del corte (C-04, plan §2.3). */
export const DEST_RRHH_REQUERIMIENTOS_BANDEJA: LogicalDestination =
  'rrhh:requerimientos:bandeja' as LogicalDestination
export const DEST_RRHH_REQUERIMIENTOS_NUEVO: LogicalDestination =
  'rrhh:requerimientos:nuevo' as LogicalDestination
export const DEST_RRHH_SELECCION: LogicalDestination =
  'rrhh:seleccion' as LogicalDestination
