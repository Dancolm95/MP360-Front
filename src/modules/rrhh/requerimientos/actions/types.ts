import type { ContractError } from '../../../../shared'
import type {
  AccionRequerimiento,
  CausalCancelacion,
  ConflictoVersion,
  DetalleRequerimientoCancelado,
  DetalleRequerimientoCompleto,
  DiasHabilesAdministrativos,
  ErrorIntegracion,
  EstadoRequerimiento,
  MotivoDenegacion,
} from '../contracts'

/**
 * Acciones de UX-04 que T-RH-12 gobierna. Las demás acciones del contrato
 * (edición, envío, integración) pertenecen a otras tareas.
 */
export type AccionGestion = Extract<
  AccionRequerimiento,
  'aprobar' | 'observar' | 'cancelar' | 'fijar-plazo'
>

/**
 * Acciones de UX-04 con elegibilidad por estado y capacidades. El ajuste
 * auditado del plazo comparte la evaluación por registro, pero no forma parte
 * del conjunto que `evaluarAcciones` recorre por defecto.
 */
export type AccionAjustePlazo = 'ajustar-plazo'

export type AccionEvaluable = AccionGestion | AccionAjustePlazo

export const ACCIONES_GESTION: readonly AccionGestion[] = [
  'aprobar',
  'observar',
  'cancelar',
  'fijar-plazo',
]

export type MotivoAccionNoDisponible =
  | 'sin-autorizacion'
  | 'estado-no-aplicable'
  | 'clasificacion-no-aplicable'

export interface AccionEvaluada {
  readonly accion: AccionEvaluable
  /** El backend la incluyó en `accionesPermitidas`. */
  readonly visible: boolean
  /** Visible y admitida por el estado; no implica que sus datos sean válidos. */
  readonly ejecutable: boolean
  readonly motivo: MotivoAccionNoDisponible | null
  readonly mensaje: string | null
}

export interface EvaluacionAcciones {
  readonly estado: EstadoRequerimiento
  readonly acciones: readonly AccionEvaluada[]
  readonly ejecutables: readonly AccionGestion[]
}

export type CampoAccion =
  | 'confirmacion'
  | 'causal'
  | 'comentario'
  | 'motivo'
  | 'plazo-administrativo'
  | 'general'

export interface ErrorAccion {
  readonly campo: CampoAccion
  readonly mensaje: string
}

export type FalloAccion =
  | {
      readonly status: 'conflicto-version'
      readonly conflicto: ConflictoVersion
      readonly entradaConservada: true
      readonly reintentable: true
    }
  | {
      readonly status: 'validacion'
      readonly errores: readonly ErrorAccion[]
      readonly entradaConservada: true
      readonly reintentable: true
    }
  | {
      readonly status: 'sin-autorizacion'
      readonly motivo: MotivoDenegacion
      readonly entradaConservada: true
      readonly reintentable: false
    }
  | {
      readonly status: 'estado-invalido'
      readonly estadoActual: EstadoRequerimiento
      readonly entradaConservada: true
      readonly reintentable: false
    }
  | {
      readonly status: 'accion-no-disponible'
      readonly accion: AccionEvaluable
      readonly motivo: MotivoAccionNoDisponible
      readonly mensaje: string
      readonly entradaConservada: true
      readonly reintentable: false
    }
  | {
      readonly status: 'error-integracion'
      readonly error: ErrorIntegracion
      readonly entradaConservada: true
      readonly reintentable: boolean
    }
  | {
      readonly status: 'error'
      readonly error: ContractError
      readonly entradaConservada: true
      readonly reintentable: boolean
    }
  | {
      readonly status: 'sesion-finalizada'
      readonly entradaConservada: true
      readonly reintentable: false
    }

export type ResultadoAccionAprobar =
  | {
      readonly status: 'confirmado'
      readonly accion: 'aprobar'
      readonly detalle: DetalleRequerimientoCompleto
    }
  | FalloAccion

export type ResultadoAccionObservar =
  | {
      readonly status: 'confirmado'
      readonly accion: 'observar'
      readonly detalle: DetalleRequerimientoCompleto
    }
  | FalloAccion

export type ResultadoAccionCancelar =
  | {
      readonly status: 'confirmado'
      readonly accion: 'cancelar'
      readonly detalle: DetalleRequerimientoCancelado
    }
  | FalloAccion

export type ResultadoAccionFijarPlazo =
  | {
      readonly status: 'confirmado'
      readonly accion: 'fijar-plazo'
      readonly detalle: DetalleRequerimientoCompleto
    }
  | FalloAccion

export type ResultadoAccion =
  | ResultadoAccionAprobar
  | ResultadoAccionObservar
  | ResultadoAccionCancelar
  | ResultadoAccionFijarPlazo

export interface OpcionesAprobar {
  readonly comentario?: string
}

export interface SolicitudCancelacion {
  readonly confirmado: boolean
  readonly causal: CausalCancelacion | null
  readonly comentario?: string
}

export type ResultadoPlazoValidado =
  | {
      readonly ok: true
      readonly diasHabiles: DiasHabilesAdministrativos
    }
  | {
      readonly ok: false
      readonly error: ErrorAccion
    }

export const CAUSALES_CANCELACION: readonly CausalCancelacion[] = [
  'menor-carga-laboral',
  'creacion-por-error',
]
