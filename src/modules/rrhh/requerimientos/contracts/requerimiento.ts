import type { AutorizacionRequerimiento } from './autorizacion'
import type { MotivoRequerimiento, Remuneracion } from './base'
import type { Empresa, Puesto, Usuario } from './catalogos'
import type {
  AreaId,
  ColaboradorId,
  DepartamentoId,
  DepartamentoUbicacionId,
  DistritoId,
  EmpresaId,
  FechaISO,
  InstanteISO,
  ProvinciaId,
  PuestoId,
  RequerimientoId,
  SubareaId,
  UsuarioId,
} from './identificadores'
import type { AlertaPlazo, DiasHabilesAdministrativos } from './plazos'

/** Estados canónicos del requerimiento (spec §6). */
export type EstadoRequerimiento =
  | 'borrador'
  | 'pendiente-aprobacion'
  | 'observado'
  | 'aprobado'
  | 'en-reclutamiento'
  | 'cubierto'
  | 'cancelado'

/**
 * Estados posteriores al Borrador. El Cancelado puede conservar datos
 * parciales si se canceló desde un Borrador incompleto.
 */
export type EstadoRequerimientoPersistido = Exclude<
  EstadoRequerimiento,
  'borrador'
>

/**
 * Estados cuyo contenido obligatorio está completo. El Cancelado se modela
 * aparte porque puede conservar datos parciales.
 */
export type EstadoRequerimientoCompleto = Exclude<
  EstadoRequerimientoPersistido,
  'cancelado'
>

export interface ColaboradorReemplazo {
  readonly id: ColaboradorId
  readonly nombre: string
}

export interface UbicacionSeleccionada {
  readonly departamentoId: DepartamentoUbicacionId
  readonly provinciaId: ProvinciaId
  readonly distritoId: DistritoId
}

/**
 * Datos editables del formulario. Un borrador puede estar incompleto: los
 * campos ausentes son `null` y no se sustituyen por valores ficticios.
 */
export interface BorradorRequerimiento {
  readonly motivo: MotivoRequerimiento | null
  readonly empresaId: EmpresaId | null
  readonly colaboradorAReemplazarId: ColaboradorId | null
  readonly departamentoId: DepartamentoId | null
  readonly areaId: AreaId | null
  readonly subareaId: SubareaId | null
  readonly puestoId: PuestoId | null
  readonly vacantes: number | null
  readonly remuneracion: Remuneracion | null
  readonly ubicacion: UbicacionSeleccionada | null
  readonly usuarioProximaTareaId: UsuarioId | null
  readonly comentario: string | null
}

/**
 * Dato de solo lectura que aporta Alta. Requerimientos lo consume únicamente
 * para la cobertura; no altera la fecha objetivo ni el cómputo de plazos.
 */
export interface PrimerDiaRealAlta {
  readonly fecha: FechaISO
}

/**
 * Cobertura confirmada por integración. Invariante:
 * `pendientes = solicitadas − cubiertas`.
 */
export interface CoberturaRequerimiento {
  readonly solicitadas: number
  readonly cubiertas: number
  readonly pendientes: number
  readonly primerosDiasReales: readonly PrimerDiaRealAlta[]
}

interface ResumenRequerimientoBase {
  readonly id: RequerimientoId
  readonly version: number
  readonly fechaCreacion: InstanteISO
}

/**
 * Duración aplicable antes de la aprobación (spec §5.1). No contiene fecha:
 * el objetivo se calcula al aprobar. El administrativo depende del plazo que
 * fije RR. HH., por lo que puede estar aún pendiente de definir.
 */
export type DuracionAplicable =
  | { readonly clasificacion: 'operativo'; readonly diasHabiles: 10 }
  | {
      readonly clasificacion: 'administrativo'
      readonly diasHabiles: DiasHabilesAdministrativos
    }
  | { readonly clasificacion: 'administrativo'; readonly diasHabiles: null }

/**
 * Columnas de la bandeja que pueden faltar. Sin aprobación no existe fecha
 * objetivo ni alerta; los campos ausentes se muestran como tales.
 */
interface ResumenRequerimientoDatosParciales {
  readonly motivo: MotivoRequerimiento | null
  readonly empresa: Empresa | null
  readonly puesto: Puesto | null
  readonly solicitadas: number | null
  readonly cubiertas: number | null
  readonly pendientes: number | null
  readonly fechaObjetivo: null
  /** `null` mientras no se conozca la clasificación; nunca es una fecha. */
  readonly duracionAplicable: DuracionAplicable | null
  readonly responsable: Usuario | null
  readonly alerta: null
  readonly autorizacion: AutorizacionRequerimiento
}

interface ResumenRequerimientoDatosCompletos {
  readonly motivo: MotivoRequerimiento
  readonly empresa: Empresa
  readonly puesto: Puesto
  readonly solicitadas: number
  readonly cubiertas: number
  readonly pendientes: number
  readonly fechaObjetivo: FechaISO | null
  /**
   * Duración aplicable antes de aprobar; `null` una vez existe fecha objetivo.
   */
  readonly duracionAplicable: DuracionAplicable | null
  readonly responsable: Usuario | null
  readonly alerta: AlertaPlazo | null
  readonly autorizacion: AutorizacionRequerimiento
}

export interface ResumenRequerimientoBorrador
  extends ResumenRequerimientoBase,
    ResumenRequerimientoDatosParciales {
  readonly estado: 'borrador'
}

/**
 * Fila de la bandeja de un requerimiento que ya superó el borrador. El
 * responsable es el usuario asignado a la próxima tarea; `null` significa que
 * no hay tarea pendiente o asignación y la vista muestra «Sin asignar».
 */
export interface ResumenRequerimientoCompleto
  extends ResumenRequerimientoBase,
    ResumenRequerimientoDatosCompletos {
  readonly estado: EstadoRequerimientoCompleto
}

export interface ResumenRequerimientoCanceladoCompleto
  extends ResumenRequerimientoBase,
    ResumenRequerimientoDatosCompletos {
  readonly estado: 'cancelado'
  readonly datos: 'completos'
}

/** Cancelado nacido de un Borrador: conserva los campos tal como se persistieron. */
export interface ResumenRequerimientoCanceladoParcial
  extends ResumenRequerimientoBase,
    ResumenRequerimientoDatosParciales {
  readonly estado: 'cancelado'
  readonly datos: 'parciales'
}

export type ResumenRequerimientoCancelado =
  | ResumenRequerimientoCanceladoCompleto
  | ResumenRequerimientoCanceladoParcial

export type ResumenRequerimiento =
  | ResumenRequerimientoBorrador
  | ResumenRequerimientoCompleto
  | ResumenRequerimientoCancelado
