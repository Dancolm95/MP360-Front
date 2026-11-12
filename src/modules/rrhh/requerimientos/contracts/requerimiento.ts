import type { AutorizacionRequerimiento } from './autorizacion'
import type { MotivoRequerimiento, Remuneracion } from './base'
import type {
  Empresa,
  Puesto,
  Usuario,
} from './catalogos'
import type {
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
  AreaId,
  SubareaId,
  UsuarioId,
} from './identificadores'
import type { PrimerDiaRealAlta } from './integracion'
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
 * Cobertura confirmada por integración. Invariante:
 * `pendientes = solicitadas − cubiertas`. Los primeros días reales son de solo
 * lectura y no participan en el cómputo de plazos.
 */
export interface CoberturaRequerimiento {
  readonly solicitadas: number
  readonly cubiertas: number
  readonly pendientes: number
  readonly primerosDiasReales: readonly PrimerDiaRealAlta[]
}

/**
 * Fila de la bandeja. `responsable` es el usuario asignado a la próxima tarea;
 * `null` significa que no hay tarea pendiente o asignación y la vista muestra
 * «Sin asignar», sin inferir otro actor.
 */
export interface ResumenRequerimiento {
  readonly id: RequerimientoId
  readonly version: number
  readonly fechaCreacion: InstanteISO
  readonly motivo: MotivoRequerimiento
  readonly empresa: Empresa
  readonly puesto: Puesto
  readonly solicitadas: number
  readonly cubiertas: number
  readonly pendientes: number
  readonly estado: EstadoRequerimiento
  readonly fechaObjetivo: FechaISO | null
  readonly responsable: Usuario | null
  readonly alerta: AlertaPlazo | null
  /** Capacidades y acciones efectivas de este registro y versión. */
  readonly autorizacion: AutorizacionRequerimiento
}
