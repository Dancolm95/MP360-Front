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
import type { AlertaPlazo } from './plazos'

/** Estados canónicos del requerimiento (spec §6). */
export type EstadoRequerimiento =
  | 'borrador'
  | 'pendiente-aprobacion'
  | 'observado'
  | 'aprobado'
  | 'en-reclutamiento'
  | 'cubierto'
  | 'cancelado'

/** Estados con datos persistidos completos; excluye el borrador incompleto. */
export type EstadoRequerimientoPersistido = Exclude<
  EstadoRequerimiento,
  'borrador'
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

/**
 * Fila de la bandeja con datos incompletos: el motivo, la empresa, el puesto o
 * los contadores pueden faltar mientras el requerimiento siga en Borrador.
 */
export interface ResumenRequerimientoBorrador {
  readonly id: RequerimientoId
  readonly version: number
  readonly fechaCreacion: InstanteISO
  readonly estado: 'borrador'
  readonly motivo: MotivoRequerimiento | null
  readonly empresa: Empresa | null
  readonly puesto: Puesto | null
  readonly solicitadas: number | null
  readonly cubiertas: number | null
  readonly pendientes: number | null
  readonly fechaObjetivo: null
  readonly responsable: Usuario | null
  readonly alerta: null
  readonly autorizacion: AutorizacionRequerimiento
}

/**
 * Fila de la bandeja de un requerimiento que ya superó el borrador. El
 * responsable es el usuario asignado a la próxima tarea; `null` significa que
 * no hay tarea pendiente o asignación y la vista muestra «Sin asignar».
 */
export interface ResumenRequerimientoCompleto {
  readonly id: RequerimientoId
  readonly version: number
  readonly fechaCreacion: InstanteISO
  readonly estado: EstadoRequerimientoPersistido
  readonly motivo: MotivoRequerimiento
  readonly empresa: Empresa
  readonly puesto: Puesto
  readonly solicitadas: number
  readonly cubiertas: number
  readonly pendientes: number
  readonly fechaObjetivo: FechaISO | null
  readonly responsable: Usuario | null
  readonly alerta: AlertaPlazo | null
  readonly autorizacion: AutorizacionRequerimiento
}

export type ResumenRequerimiento =
  | ResumenRequerimientoBorrador
  | ResumenRequerimientoCompleto
