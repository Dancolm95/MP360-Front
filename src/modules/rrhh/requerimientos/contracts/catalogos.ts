import type { Clasificacion, MotivoRequerimiento } from './base'
import type {
  AreaId,
  CalendarioLaboralId,
  DepartamentoId,
  DepartamentoUbicacionId,
  DistritoId,
  EmpresaId,
  FechaISO,
  ProvinciaId,
  PuestoId,
  SubareaId,
  UsuarioId,
} from './identificadores'
import type { ResultadoLectura } from './resultados'

export type DiaSemana =
  | 'lunes'
  | 'martes'
  | 'miercoles'
  | 'jueves'
  | 'viernes'
  | 'sabado'
  | 'domingo'

export interface ExcepcionCalendario {
  readonly fecha: FechaISO
  /** `false` excluye el día; `true` lo habilita aunque no sea día hábil semanal. */
  readonly habil: boolean
}

/**
 * Calendario laboral único del ERP. Todo el cómputo de plazos usa este
 * calendario; no hay calendarios alternativos por empresa, área o puesto.
 */
export interface CalendarioLaboralUnico {
  readonly id: CalendarioLaboralId
  readonly diasHabiles: readonly DiaSemana[]
  readonly excepciones: readonly ExcepcionCalendario[]
}

export interface MotivoCatalogoItem {
  readonly motivo: MotivoRequerimiento
  readonly etiqueta: string
}

export interface Empresa {
  readonly id: EmpresaId
  readonly nombre: string
}

export interface Departamento {
  readonly id: DepartamentoId
  readonly nombre: string
}

export interface Area {
  readonly id: AreaId
  readonly nombre: string
  readonly departamentoId: DepartamentoId
}

export interface Subarea {
  readonly id: SubareaId
  readonly nombre: string
  readonly areaId: AreaId
}

export interface Puesto {
  readonly id: PuestoId
  readonly nombre: string
  readonly areaId: AreaId
  readonly subareaId: SubareaId | null
  /** Derivada por el backend de Puesto y Área/Subárea; no es un valor libre. */
  readonly clasificacion: Clasificacion
}

export interface DepartamentoUbicacion {
  readonly id: DepartamentoUbicacionId
  readonly nombre: string
}

export interface Provincia {
  readonly id: ProvinciaId
  readonly nombre: string
  readonly departamentoId: DepartamentoUbicacionId
}

export interface Distrito {
  readonly id: DistritoId
  readonly nombre: string
  readonly provinciaId: ProvinciaId
}

export interface Usuario {
  readonly id: UsuarioId
  readonly nombre: string
}

/** Catálogos y jerarquías que alimentan el formulario y el detalle. */
export interface CatalogosRequerimientos {
  readonly motivos: readonly MotivoCatalogoItem[]
  readonly empresas: readonly Empresa[]
  readonly departamentos: readonly Departamento[]
  readonly areas: readonly Area[]
  readonly subareas: readonly Subarea[]
  readonly puestos: readonly Puesto[]
  readonly departamentosUbicacion: readonly DepartamentoUbicacion[]
  readonly provincias: readonly Provincia[]
  readonly distritos: readonly Distrito[]
  /** Posibles responsables de la próxima tarea. */
  readonly usuariosProximaTarea: readonly Usuario[]
  /** Jefe de Operaciones preseleccionado; el solicitante puede cambiarlo. */
  readonly usuarioProximaTareaPredeterminado: UsuarioId | null
  readonly calendarioLaboral: CalendarioLaboralUnico
}

export interface CatalogoRequerimientosPort {
  obtener(): Promise<ResultadoLectura<CatalogosRequerimientos>>
}
