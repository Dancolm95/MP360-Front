import type { ContractError } from '../../../../shared'
import type {
  CausalCancelacion,
  ComandoVersionado,
  ConflictoVersion,
  DetalleRequerimiento,
  DetalleRequerimientoCancelado,
  DetalleRequerimientoCompleto,
  DiasHabilesAdministrativos,
  ErrorIntegracion,
  EstadoRequerimiento,
  MotivoDenegacion,
  ResultadoComando,
} from '../contracts'
import type {
  AccionElegible,
  MotivoEstadoNoAplicable,
} from '../model'
import { ACCIONES_ELEGIBLES } from '../model'

/**
 * Acciones de UX-04 que T-RH-12 gobierna. Las demás acciones del contrato
 * (edición, envío, integración) pertenecen a otras tareas.
 */
export type AccionGestion = Extract<
  AccionElegible,
  'aprobar' | 'observar' | 'cancelar' | 'fijar-plazo'
>

export type AccionAjustePlazo = Extract<AccionElegible, 'ajustar-plazo'>

export type AccionEvaluable = AccionElegible

/** Subconjunto de T-RH-12; el ajuste auditado lo ejecuta T-RH-13. */
export const ACCIONES_GESTION: readonly AccionGestion[] = ACCIONES_ELEGIBLES.filter(
  (accion): accion is AccionGestion => accion !== 'ajustar-plazo',
)

export type MotivoAccionNoDisponible =
  | 'sin-autorizacion'
  | MotivoEstadoNoAplicable

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
  readonly ejecutables: readonly AccionEvaluable[]
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

/**
 * Veredicto de `evaluarTransicion` (T-RH-16). Se declara estructuralmente para
 * que `actions/` aplique la máquina sin importar de `transitions/`.
 */
export interface VeredictoTransicionComando {
  readonly permitida: boolean
  readonly motivo?: string
  readonly mensaje?: string
}

export interface ConflictoComandoVersionado<C extends ComandoVersionado> {
  readonly status: 'conflicto-version'
  readonly conflicto: ConflictoVersion
  /** El comando exacto enviado, con su versión desactualizada. */
  readonly entrada: C
  readonly datosVigentes: DetalleRequerimiento
  readonly versionVigente: number
  readonly mensaje: string
  readonly entradaConservada: true
  readonly reintentable: true
}

export interface TransicionRechazadaComando<C extends ComandoVersionado> {
  readonly status: 'transicion-rechazada'
  readonly veredicto: VeredictoTransicionComando
  readonly entrada: C
  readonly mensaje: string
  readonly entradaConservada: true
  readonly reintentable: false
}

export type FalloComandoVersionado<C extends ComandoVersionado> =
  | ConflictoComandoVersionado<C>
  | TransicionRechazadaComando<C>
  | Exclude<FalloAccion, { readonly status: 'conflicto-version' }>

export type ResultadoComandoVersionado<C extends ComandoVersionado, T> =
  | {
      readonly status: 'confirmado'
      readonly comando: C
      readonly datos: T
    }
  | FalloComandoVersionado<C>

export type DecisionTransicionComando =
  | {
      readonly tipo: 'transicion'
      readonly veredicto: VeredictoTransicionComando
    }
  /** Solicitar reversión no cambia estado por sí sola: no hay transición que aplicar. */
  | { readonly tipo: 'no-transicion' }

export interface SolicitudComandoVersionado<
  C extends ComandoVersionado,
  T,
> {
  readonly comando: C
  readonly decision: DecisionTransicionComando
  readonly ejecutar: (comando: C) => Promise<ResultadoComando<T>>
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
