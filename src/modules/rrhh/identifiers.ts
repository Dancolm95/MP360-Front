import type {
  LogicalDestination,
  ModuleId,
  SectionId,
} from '../../container/contracts'
import type { Capability } from '../../shared'

export const CAP_RRHH_REQUERIMIENTOS_READ: Capability =
  'rrhh:requerimientos:read' as Capability
export const CAP_RRHH_SELECCION_VISIBLE: Capability =
  'rrhh:seleccion:visible' as Capability
export const CAP_RRHH_ALTA_VISIBLE: Capability =
  'rrhh:alta:visible' as Capability

export const RRHH_MODULE_ID: ModuleId = 'rrhh' as ModuleId
export const SECTION_REQUERIMIENTOS: SectionId = 'requerimientos' as SectionId
export const SECTION_SELECCION: SectionId = 'seleccion' as SectionId
export const SECTION_ALTA: SectionId = 'alta' as SectionId

export const DEST_RRHH_REQUERIMIENTOS_BANDEJA: LogicalDestination =
  'rrhh:requerimientos:bandeja' as LogicalDestination
export const DEST_RRHH_REQUERIMIENTOS_NUEVO: LogicalDestination =
  'rrhh:requerimientos:nuevo' as LogicalDestination
export const DEST_RRHH_SELECCION: LogicalDestination =
  'rrhh:seleccion' as LogicalDestination
export const DEST_RRHH_ALTA: LogicalDestination = 'rrhh:alta' as LogicalDestination
