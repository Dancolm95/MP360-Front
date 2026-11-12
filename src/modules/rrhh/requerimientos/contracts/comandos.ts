import type { LogicalDestination } from '../../../../container/contracts'
import type { ContractError } from '../../../../shared'
import type { MotivoDenegacion } from './autorizacion'
import type { CausalCancelacion } from './base'
import type { Usuario } from './catalogos'
import type {
  DetalleRequerimiento,
  DetalleRequerimientoBorrador,
  DetalleRequerimientoCancelado,
  DetalleRequerimientoCompleto,
  DetalleRequerimientoEditable,
} from './detalle'
import type { ErrorIntegracion, ErrorValidacion } from './errores'
import type { RequerimientoId, SolicitudReversionId } from './identificadores'
import type {
  ProcesoSeleccionRef,
  SolicitudReversionCobertura,
} from './integracion'
import type {
  BorradorRequerimiento,
  EstadoRequerimiento,
  ResumenRequerimientoCompleto,
} from './requerimiento'

/** Todo comando de escritura revalida la versión leída por el usuario. */
export interface ComandoVersionado {
  readonly requerimientoId: RequerimientoId
  readonly version: number
}

/** La creación no tiene identificador ni versión previos; los asigna el backend. */
export interface ComandoCrearRequerimiento {
  readonly contenido: BorradorRequerimiento
}

export interface ComandoGuardarBorrador extends ComandoVersionado {
  readonly borrador: BorradorRequerimiento
}

/**
 * Envío o reenvío con el contenido completo revisado. Se persiste al enviar,
 * aunque antes no se haya guardado el borrador.
 */
export interface ComandoEnviarAprobacion extends ComandoVersionado {
  readonly contenido: BorradorRequerimiento
}

export interface ComandoAprobar extends ComandoVersionado {
  readonly comentario?: string
}

export interface ComandoObservar extends ComandoVersionado {
  readonly comentario: string
}

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
 * Los datos vigentes pueden ser un Borrador incompleto.
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

/** Creación confirmada: identificador, versión y datos iniciales persistidos. */
export interface RequerimientoCreado {
  readonly id: RequerimientoId
  readonly version: number
  readonly detalle: DetalleRequerimientoBorrador
}

export type ResultadoCrearRequerimiento =
  | { readonly status: 'confirmado'; readonly datos: RequerimientoCreado }
  | { readonly status: 'validacion'; readonly errores: readonly ErrorValidacion[] }
  | { readonly status: 'sin-autorizacion'; readonly motivo: MotivoDenegacion }
  | { readonly status: 'error'; readonly error: ContractError }
  | { readonly status: 'sesion-finalizada' }

export interface ConfirmacionEnvio {
  readonly id: RequerimientoId
  readonly resumen: ResumenRequerimientoCompleto & {
    readonly estado: 'pendiente-aprobacion'
  }
  readonly responsable: Usuario | null
  readonly estado: 'pendiente-aprobacion'
}

/**
 * Confirmación de Selección. `idempotente` indica que el reintento encontró el
 * proceso ya creado y no duplicó la apertura; el estado solo cambia con esta
 * confirmación, nunca de forma optimista.
 */
export interface ResultadoAperturaProceso {
  readonly proceso: ProcesoSeleccionRef
  readonly requerimiento: DetalleRequerimientoCompleto
  readonly idempotente: boolean
}

/** La solicitud queda registrada; la cobertura cambia solo con el evento confirmado. */
export interface SolicitudReversionRegistrada {
  readonly solicitudId: SolicitudReversionId
  readonly estado: 'pendiente-confirmacion'
  readonly requerimiento: DetalleRequerimientoCompleto
}

export type ResultadoGuardarBorrador =
  ResultadoComando<DetalleRequerimientoEditable>
export type ResultadoEnvioAprobacion = ResultadoComando<ConfirmacionEnvio>
export type ResultadoAprobar = ResultadoComando<DetalleRequerimientoCompleto>
export type ResultadoObservar = ResultadoComando<DetalleRequerimientoCompleto>
export type ResultadoCancelar = ResultadoComando<DetalleRequerimientoCancelado>
export type ResultadoFijarPlazo = ResultadoComando<DetalleRequerimientoCompleto>
export type ResultadoAjustarPlazo =
  ResultadoComando<DetalleRequerimientoCompleto>
export type ResultadoAbrirProceso = ResultadoComando<ResultadoAperturaProceso>

/**
 * `confirmado` significa que la solicitud quedó registrada, no que la
 * cobertura cambió: los contadores solo se recalculan con el evento auditado
 * de Selección.
 */
export type ResultadoSolicitarReversion =
  ResultadoComando<SolicitudReversionRegistrada>

export interface ComandosRequerimientosPort {
  crear(comando: ComandoCrearRequerimiento): Promise<ResultadoCrearRequerimiento>
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
