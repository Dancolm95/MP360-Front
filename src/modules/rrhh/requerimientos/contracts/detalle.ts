import type { ContractError } from '../../../../shared'
import type { AutorizacionRequerimiento } from './autorizacion'
import type {
  CausalCancelacion,
  MotivoRequerimiento,
  Remuneracion,
} from './base'
import type {
  Area,
  Departamento,
  DepartamentoUbicacion,
  Distrito,
  Empresa,
  Provincia,
  Puesto,
  Subarea,
  Usuario,
} from './catalogos'
import type {
  ColaboradorId,
  EventoHistorialId,
  FechaISO,
  InstanteISO,
  RequerimientoId,
  SolicitudReversionId,
} from './identificadores'
import type {
  ProcesoSeleccionRef,
  RemuneracionPreviaAlta,
} from './integracion'
import type { NivelAlerta, PlazoRequerimiento } from './plazos'
import type {
  BorradorRequerimiento,
  CoberturaRequerimiento,
  ColaboradorReemplazo,
  EstadoRequerimiento,
  EstadoRequerimientoCompleto,
} from './requerimiento'

export interface UbicacionDetalle {
  readonly departamento: DepartamentoUbicacion
  readonly provincia: Provincia
  readonly distrito: Distrito
}

export type AccionCambioEstado =
  | 'edicion'
  | 'envio'
  | 'reenvio'
  | 'aprobacion'
  | 'observacion'

export type AccionHistorial =
  | AccionCambioEstado
  | 'creacion'
  | 'cancelacion'
  | 'fijacion-plazo'
  | 'ajuste-plazo'
  | 'alerta'
  | 'vencimiento'
  | 'apertura-proceso'
  | 'solicitud-reversion'
  | 'reversion-cobertura'
  | 'primer-dia-real'

export interface EventoHistorialBase {
  readonly id: EventoHistorialId
  readonly usuario: Usuario
  readonly fechaHora: InstanteISO
}

export interface EventoCambioEstado extends EventoHistorialBase {
  readonly accion: AccionCambioEstado
  readonly estadoAnterior: EstadoRequerimiento
  readonly estadoNuevo: EstadoRequerimiento
  readonly comentario: string | null
}

/** La creación no tiene estado anterior; nace directamente en Borrador. */
export interface EventoCreacion extends EventoHistorialBase {
  readonly accion: 'creacion'
  readonly estadoNuevo: 'borrador'
  readonly comentario: string | null
}

export interface EventoCancelacion extends EventoHistorialBase {
  readonly accion: 'cancelacion'
  readonly estadoAnterior: EstadoRequerimiento
  readonly estadoNuevo: 'cancelado'
  readonly causal: CausalCancelacion
  readonly comentario: string | null
}

/**
 * Ajuste auditado del plazo administrativo; conserva ambos valores y fechas.
 * Solo ocurre tras la aprobación, por lo que ambas fechas objetivo existen.
 */
export interface EventoAjustePlazo extends EventoHistorialBase {
  readonly accion: 'ajuste-plazo'
  readonly motivo: string
  readonly plazoAnteriorDias: number
  readonly plazoNuevoDias: number
  readonly fechaObjetivoAnterior: FechaISO
  readonly fechaObjetivoNueva: FechaISO
}

export interface EventoFijacionPlazo extends EventoHistorialBase {
  readonly accion: 'fijacion-plazo'
  readonly plazoNuevoDias: number
  readonly fechaObjetivoNueva: FechaISO | null
}

/** Evento histórico de alerta: conserva la fecha original aunque el plazo cambie. */
export interface EventoAlertaHistorial extends EventoHistorialBase {
  readonly accion: 'alerta'
  readonly nivel: NivelAlerta
  readonly fechaObjetivo: FechaISO
}

/** Evento histórico de vencimiento, distinto de una alerta de umbral. */
export interface EventoVencimiento extends EventoHistorialBase {
  readonly accion: 'vencimiento'
  readonly fechaObjetivo: FechaISO
  readonly fechaIncumplimiento: FechaISO
}

/** Confirmación de Selección; habilita Aprobado → En reclutamiento. */
export interface EventoAperturaProceso extends EventoHistorialBase {
  readonly accion: 'apertura-proceso'
  readonly proceso: ProcesoSeleccionRef
}

/** Solicitud de RR. HH.; no cambia la cobertura por sí sola. */
export interface EventoSolicitudReversion extends EventoHistorialBase {
  readonly accion: 'solicitud-reversion'
  readonly solicitudId: SolicitudReversionId
  readonly motivo: string
}

export interface EfectoCoberturaReversion {
  readonly solicitadas: number
  readonly cubiertas: number
  readonly pendientes: number
  /** Toda reversión confirmada deja el requerimiento En reclutamiento. */
  readonly estadoResultante: 'en-reclutamiento'
}

/** Evento auditado de Selección que recalcula la cobertura y enlaza la solicitud. */
export interface EventoReversionCobertura extends EventoHistorialBase {
  readonly accion: 'reversion-cobertura'
  readonly solicitudId: SolicitudReversionId
  readonly origen: 'seleccion'
  readonly motivo: string
  readonly colaboradorAfectadoId: ColaboradorId | null
  readonly efectoCobertura: EfectoCoberturaReversion
}

export interface EventoPrimerDiaReal extends EventoHistorialBase {
  readonly accion: 'primer-dia-real'
  readonly fecha: FechaISO
}

export type EventoHistorial =
  | EventoCambioEstado
  | EventoCreacion
  | EventoCancelacion
  | EventoAjustePlazo
  | EventoFijacionPlazo
  | EventoAlertaHistorial
  | EventoVencimiento
  | EventoAperturaProceso
  | EventoSolicitudReversion
  | EventoReversionCobertura
  | EventoPrimerDiaReal

export interface DetalleRequerimientoBase {
  readonly id: RequerimientoId
  readonly version: number
  readonly estado: EstadoRequerimiento
  readonly fechaCreacion: InstanteISO
  readonly historial: readonly EventoHistorial[]
  readonly autorizacion: AutorizacionRequerimiento
}

/**
 * Datos parciales de un Borrador. El contenido puede estar incompleto y se
 * expone tal como lo persistió el backend; el plazo o la cobertura solo existen
 * si ya son derivables de los datos introducidos.
 */
interface DetalleRequerimientoDatosParciales {
  readonly borrador: BorradorRequerimiento
  readonly plazo: PlazoRequerimiento | null
  readonly cobertura: CoberturaRequerimiento | null
  readonly remuneracionPreviaAlta: RemuneracionPreviaAlta | null
  readonly procesoSeleccion: null
}

interface DetalleRequerimientoDatosCompletos {
  readonly motivo: MotivoRequerimiento
  readonly empresa: Empresa
  readonly colaboradorAReemplazar: ColaboradorReemplazo | null
  readonly departamento: Departamento
  readonly area: Area
  readonly subarea: Subarea | null
  readonly puesto: Puesto
  readonly remuneracion: Remuneracion
  readonly ubicacion: UbicacionDetalle
  readonly usuarioProximaTarea: Usuario | null
  readonly comentario: string
  readonly plazo: PlazoRequerimiento
  readonly cobertura: CoberturaRequerimiento
  /** Solo lectura; el ajuste previo al alta pertenece a Alta. */
  readonly remuneracionPreviaAlta: RemuneracionPreviaAlta | null
  readonly procesoSeleccion: ProcesoSeleccionRef | null
}

export interface DetalleRequerimientoBorrador
  extends DetalleRequerimientoBase,
    DetalleRequerimientoDatosParciales {
  readonly estado: 'borrador'
}

export interface DetalleRequerimientoCompleto
  extends DetalleRequerimientoBase,
    DetalleRequerimientoDatosCompletos {
  readonly estado: EstadoRequerimientoCompleto
}

export interface DetalleRequerimientoCanceladoCompleto
  extends DetalleRequerimientoBase,
    DetalleRequerimientoDatosCompletos {
  readonly estado: 'cancelado'
  readonly datos: 'completos'
}

/**
 * Cancelado nacido de un Borrador: conserva el contenido tal como se persistió.
 * Sin aprobación no hay proceso de Selección; plazo y cobertura solo existen si
 * ya eran derivables de los datos introducidos.
 */
export interface DetalleRequerimientoCanceladoParcial
  extends DetalleRequerimientoBase,
    DetalleRequerimientoDatosParciales {
  readonly estado: 'cancelado'
  readonly datos: 'parciales'
}

export type DetalleRequerimientoCancelado =
  | DetalleRequerimientoCanceladoCompleto
  | DetalleRequerimientoCanceladoParcial

export type DetalleRequerimiento =
  | DetalleRequerimientoBorrador
  | DetalleRequerimientoCompleto
  | DetalleRequerimientoCancelado

/**
 * Detalle devuelto al guardar: conserva el estado real de la edición. Guardar
 * en Pendiente de aprobación no lo rebaja a Borrador ni cambia de estado.
 */
export type DetalleRequerimientoEditable =
  | DetalleRequerimientoBorrador
  | (DetalleRequerimientoCompleto & {
      readonly estado: 'pendiente-aprobacion' | 'observado'
    })

export type ResultadoDetalle =
  | { readonly status: 'ok'; readonly datos: DetalleRequerimiento }
  | { readonly status: 'no-encontrado' }
  | { readonly status: 'forbidden' }
  | { readonly status: 'sesion-finalizada' }
  | { readonly status: 'error'; readonly error: ContractError }

export interface DetalleRequerimientosPort {
  obtener(requerimientoId: RequerimientoId): Promise<ResultadoDetalle>
}
