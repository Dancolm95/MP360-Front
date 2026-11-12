import type { Capability } from '../../../../shared'
import type { RequerimientoId } from './identificadores'

/** Acciones del requerimiento que el backend puede habilitar por registro. */
export type AccionRequerimiento =
  | 'crear'
  | 'editar'
  | 'enviar'
  | 'aprobar'
  | 'observar'
  | 'cancelar'
  | 'fijar-plazo'
  | 'ajustar-plazo'
  | 'abrir-proceso-seleccion'
  | 'solicitar-reversion-cobertura'
  | 'asociar-candidato'

/** Distingue una denegación por capacidad de una por ámbito efectivo. */
export type MotivoDenegacion = 'capacidad' | 'ambito'

/**
 * Autorización efectiva de un requerimiento y su versión. `capacidades` son
 * cadenas opacas y `accionesPermitidas` las calcula el backend; el frontend no
 * infiere permisos de un rol ni del nombre de la capacidad.
 */
export interface AutorizacionRequerimiento {
  readonly requerimientoId: RequerimientoId
  readonly version: number
  readonly capacidades: readonly Capability[]
  readonly accionesPermitidas: readonly AccionRequerimiento[]
}
