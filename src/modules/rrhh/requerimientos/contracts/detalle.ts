import type { ContractError } from '../../../../shared'
import type { AutorizacionRequerimiento } from './autorizacion'
import type { MotivoRequerimiento, Remuneracion } from './base'
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
  EventoHistorialId,
  FechaISO,
  InstanteISO,
  RequerimientoId,
} from './identificadores'
import type {
  ProcesoSeleccionRef,
  RemuneracionPreviaAlta,
} from './integracion'
import type { NivelAlerta, PlazoRequerimiento } from './plazos'
import type {
  CoberturaRequerimiento,
  ColaboradorReemplazo,
  EstadoRequerimiento,
} from './requerimiento'

export interface UbicacionDetalle {
  readonly departamento: DepartamentoUbicacion
  readonly provincia: Provincia
  readonly distrito: Distrito
}

export type AccionCambioEstado =
  | 'creacion'
  | 'edicion'
  | 'envio'
  | 'reenvio'
  | 'aprobacion'
  | 'observacion'
  | 'cancelacion'

export type AccionHistorial =
  | AccionCambioEstado
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

/** Ajuste auditado del plazo administrativo; conserva ambos valores y fechas. */
export interface EventoAjustePlazo extends EventoHistorialBase {
  readonly accion: 'ajuste-plazo'
  readonly motivo: string
  readonly plazoAnteriorDias: number
  readonly plazoNuevoDias: number
  readonly fechaObjetivoAnterior: FechaISO | null
  readonly fechaObjetivoNueva: FechaISO | null
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
  readonly motivo: string
}

/** Evento auditado de Selección que recalcula la cobertura. */
export interface EventoReversionCoberturaHistorial extends EventoHistorialBase {
  readonly accion: 'reversion-cobertura'
  readonly origen: 'seleccion'
  readonly motivo: string
}

export interface EventoPrimerDiaReal extends EventoHistorialBase {
  readonly accion: 'primer-dia-real'
  readonly fecha: FechaISO
}

export type EventoHistorial =
  | EventoCambioEstado
  | EventoAjustePlazo
  | EventoFijacionPlazo
  | EventoAlertaHistorial
  | EventoVencimiento
  | EventoAperturaProceso
  | EventoSolicitudReversion
  | EventoReversionCoberturaHistorial
  | EventoPrimerDiaReal

export interface DetalleRequerimiento {
  readonly id: RequerimientoId
  readonly version: number
  readonly estado: EstadoRequerimiento
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
  readonly fechaCreacion: InstanteISO
  readonly fechaAprobacion: FechaISO | null
  readonly plazo: PlazoRequerimiento
  readonly cobertura: CoberturaRequerimiento
  readonly historial: readonly EventoHistorial[]
  readonly autorizacion: AutorizacionRequerimiento
  /** Solo lectura; el ajuste previo al alta pertenece a Alta. */
  readonly remuneracionPreviaAlta: RemuneracionPreviaAlta | null
  readonly procesoSeleccion: ProcesoSeleccionRef | null
}

export type ResultadoDetalle =
  | { readonly status: 'ok'; readonly datos: DetalleRequerimiento }
  | { readonly status: 'no-encontrado' }
  | { readonly status: 'forbidden' }
  | { readonly status: 'sesion-finalizada' }
  | { readonly status: 'error'; readonly error: ContractError }

export interface DetalleRequerimientosPort {
  obtener(requerimientoId: RequerimientoId): Promise<ResultadoDetalle>
}
