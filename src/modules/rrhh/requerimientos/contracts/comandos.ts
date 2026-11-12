import type { LogicalDestination } from '../../../../container/contracts'
import type { ContractError } from '../../../../shared'
import type { MotivoDenegacion } from './autorizacion'
import type { Usuario } from './catalogos'
import type { DetalleRequerimiento } from './detalle'
import type { ErrorIntegracion, ErrorValidacion } from './errores'
import type { RequerimientoId, SolicitudReversionId } from './identificadores'
import type {
  ProcesoSeleccionRef,
  SolicitudReversionCobertura,
} from './integracion'
import type {
  BorradorRequerimiento,
  EstadoRequerimiento,
  ResumenRequerimiento,
} from './requerimiento'

/** Todo comando de escritura revalida la versión leída por el usuario. */
export interface ComandoVersionado {
  readonly requerimientoId: RequerimientoId
  readonly version: number
}

export interface ComandoGuardarBorrador extends ComandoVersionado {
  readonly borrador: BorradorRequerimiento
}

export interface ComandoEnviarAprobacion extends ComandoVersionado {}

export interface ComandoAprobar extends ComandoVersionado {
  readonly comentario?: string
}

export interface ComandoObservar extends ComandoVersionado {
  readonly comentario: string
}

export type CausalCancelacion = 'menor-carga-laboral' | 'creacion-por-error'

export interface ComandoCancelar extends ComandoVersionado {
  readonly causal: CausalCancelacion
  readonly comentario?: string
}

export interface ComandoFijarPlazoAdministrativo extends ComandoVersionado {
  /** Entero entre 15 y 30. */
  readonly diasHabiles: number
}

/** Ajuste auditado, separado de los datos aprobados del requerimiento. */
export interface ComandoAjustarPlazoAdministrativo extends ComandoVersionado {
  readonly diasHabiles: number
  readonly motivo: string
}

export interface ComandoAbrirProcesoSeleccion extends ComandoVersionado {}

export interface ComandoSolicitarReversionCobertura
  extends ComandoVersionado,
    SolicitudReversionCobertura {}

/**
 * Conflicto de versión: rechazo sin persistir, con la versión vigente y sus
 * datos para que la interfaz conserve la entrada y permita una nueva decisión.
 */
export interface ConflictoVersion {
  readonly versionEsperada: number
  readonly versionVigente: number
  readonly datosVigentes: DetalleRequerimiento
}

export type FalloComando =
  | { readonly status: 'validacion'; readonly errores: readonly ErrorValidacion[] }
  | { readonly status: 'sin-autorizacion'; readonly motivo: MotivoDenegacion }
  | {
      readonly status: 'estado-invalido'
      readonly estadoActual: EstadoRequerimiento
    }
  | { readonly status: 'error'; readonly error: ContractError }
  | { readonly status: 'error-integracion'; readonly error: ErrorIntegracion }
  | { readonly status: 'sesion-finalizada' }

/**
 * Resultado de un comando versionado. Solo `confirmado` representa éxito
 * persistido y confirmado por el backend; el resto conserva la entrada del
 * usuario y permite revisar, reintentar o corregir según el caso.
 */
export type ResultadoComando<T> =
  | { readonly status: 'confirmado'; readonly datos: T }
  | { readonly status: 'conflicto-version'; readonly conflicto: ConflictoVersion }
  | FalloComando

export interface ConfirmacionEnvio {
  readonly id: RequerimientoId
  readonly resumen: ResumenRequerimiento
  readonly responsable: Usuario | null
  readonly estado: EstadoRequerimiento
}

/**
 * Confirmación de Selección. `idempotente` indica que el reintento encontró el
 * proceso ya creado y no duplicó la apertura; el estado solo cambia con esta
 * confirmación, nunca de forma optimista.
 */
export interface ResultadoAperturaProceso {
  readonly proceso: ProcesoSeleccionRef
  readonly requerimiento: DetalleRequerimiento
  readonly idempotente: boolean
}

/** La solicitud queda registrada; la cobertura cambia solo con el evento confirmado. */
export interface SolicitudReversionRegistrada {
  readonly solicitudId: SolicitudReversionId
  readonly estado: 'pendiente-confirmacion'
  readonly requerimiento: DetalleRequerimiento
}

export type ResultadoGuardarBorrador = ResultadoComando<DetalleRequerimiento>
export type ResultadoEnvioAprobacion = ResultadoComando<ConfirmacionEnvio>
export type ResultadoAprobar = ResultadoComando<DetalleRequerimiento>
export type ResultadoObservar = ResultadoComando<DetalleRequerimiento>
export type ResultadoCancelar = ResultadoComando<DetalleRequerimiento>
export type ResultadoFijarPlazo = ResultadoComando<DetalleRequerimiento>
export type ResultadoAjustarPlazo = ResultadoComando<DetalleRequerimiento>
export type ResultadoAbrirProceso = ResultadoComando<ResultadoAperturaProceso>
export type ResultadoSolicitarReversion = ResultadoComando<SolicitudReversionRegistrada>

export interface ComandosRequerimientosPort {
  guardarBorrador(comando: ComandoGuardarBorrador): Promise<ResultadoGuardarBorrador>
  enviarAprobacion(
    comando: ComandoEnviarAprobacion,
  ): Promise<ResultadoEnvioAprobacion>
  aprobar(comando: ComandoAprobar): Promise<ResultadoAprobar>
  observar(comando: ComandoObservar): Promise<ResultadoObservar>
  cancelar(comando: ComandoCancelar): Promise<ResultadoCancelar>
  fijarPlazoAdministrativo(
    comando: ComandoFijarPlazoAdministrativo,
  ): Promise<ResultadoFijarPlazo>
  ajustarPlazoAdministrativo(
    comando: ComandoAjustarPlazoAdministrativo,
  ): Promise<ResultadoAjustarPlazo>
  abrirProcesoSeleccion(
    comando: ComandoAbrirProcesoSeleccion,
  ): Promise<ResultadoAbrirProceso>
  solicitarReversionCobertura(
    comando: ComandoSolicitarReversionCobertura,
  ): Promise<ResultadoSolicitarReversion>
}

export interface ConsultaAsociarCandidato {
  readonly requerimientoId: RequerimientoId
}

/**
 * Navegación a un proceso ya creado. No crea proceso ni vínculo en
 * Requerimientos y solo está disponible en En reclutamiento con capacidad.
 */
export type ResultadoAsociarCandidato =
  | {
      readonly status: 'navegar'
      readonly proceso: ProcesoSeleccionRef
      readonly destino: LogicalDestination
    }
  | { readonly status: 'sin-proceso' }
  | { readonly status: 'sin-autorizacion'; readonly motivo: MotivoDenegacion }
  | {
      readonly status: 'estado-invalido'
      readonly estadoActual: EstadoRequerimiento
    }
  | { readonly status: 'sesion-finalizada' }
  | { readonly status: 'error'; readonly error: ContractError }

export interface NavegacionSeleccionPort {
  asociarCandidato(
    consulta: ConsultaAsociarCandidato,
  ): Promise<ResultadoAsociarCandidato>
}
