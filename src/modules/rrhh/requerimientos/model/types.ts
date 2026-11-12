import type {
  Area,
  AreaId,
  Clasificacion,
  ColaboradorId,
  Departamento,
  DepartamentoId,
  DepartamentoUbicacion,
  DepartamentoUbicacionId,
  Distrito,
  DistritoId,
  Empresa,
  EmpresaId,
  MotivoRequerimiento,
  Provincia,
  ProvinciaId,
  Puesto,
  PuestoId,
  Remuneracion,
  Subarea,
  SubareaId,
  UbicacionSeleccionada,
  Usuario,
  UsuarioId,
} from '../contracts'

export interface FormularioRequerimientoInput {
  readonly motivo: MotivoRequerimiento | null
  readonly empresaId: EmpresaId | null
  readonly colaboradorAReemplazarId: ColaboradorId | null
  readonly departamentoId: DepartamentoId | null
  readonly areaId: AreaId | null
  readonly subareaId: SubareaId | null
  readonly puestoId: PuestoId | null
  readonly vacantes: string | number | null
  readonly remuneracionMensual: string | null
  readonly departamentoUbicacionId: DepartamentoUbicacionId | null
  readonly provinciaId: ProvinciaId | null
  readonly distritoId: DistritoId | null
  readonly usuarioProximaTareaId: UsuarioId | null
  readonly comentario: string | null
}

export interface ContextoValidacionFormulario {
  readonly empresas: readonly Empresa[]
  readonly departamentos: readonly Departamento[]
  readonly areas: readonly Area[]
  readonly subareas: readonly Subarea[]
  readonly puestos: readonly Puesto[]
  readonly departamentosUbicacion: readonly DepartamentoUbicacion[]
  readonly provincias: readonly Provincia[]
  readonly distritos: readonly Distrito[]
  readonly usuariosProximaTarea: readonly Usuario[]
}

export type CampoFormulario =
  | 'motivo'
  | 'empresaId'
  | 'colaboradorAReemplazarId'
  | 'departamentoId'
  | 'areaId'
  | 'subareaId'
  | 'puestoId'
  | 'vacantes'
  | 'remuneracionMensual'
  | 'departamentoUbicacionId'
  | 'provinciaId'
  | 'distritoId'
  | 'usuarioProximaTareaId'
  | 'comentario'

export type CodigoErrorFormulario =
  | 'obligatorio'
  | 'seleccion-no-disponible'
  | 'jerarquia-inconsistente'
  | 'valor-no-permitido'
  | 'entero-minimo'
  | 'formato-decimal'
  | 'importe-negativo'
  | 'importe-debe-ser-positivo'

export interface ErrorFormulario {
  readonly field: CampoFormulario
  readonly code: CodigoErrorFormulario
}

export interface ModeloRequerimientoListo {
  readonly motivo: MotivoRequerimiento
  readonly empresaId: EmpresaId
  readonly colaboradorAReemplazarId: ColaboradorId | null
  readonly departamentoId: DepartamentoId
  readonly areaId: AreaId
  readonly subareaId: SubareaId | null
  readonly puestoId: PuestoId
  readonly clasificacion: Clasificacion
  readonly vacantes: number
  readonly remuneracion: Remuneracion
  readonly ubicacion: UbicacionSeleccionada
  readonly usuarioProximaTareaId: UsuarioId
  readonly comentario: string
}

export type ResultadoValidacionFormulario =
  | { readonly ok: true; readonly value: ModeloRequerimientoListo }
  | { readonly ok: false; readonly errors: readonly ErrorFormulario[] }

export type ResultadoValidacionCampo<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly code: CodigoErrorFormulario }

export interface RemuneracionPenParseada {
  readonly centavos: number
  readonly remuneracion: Remuneracion
}

export interface SeleccionOrganizacional {
  readonly departamentoId: DepartamentoId
  readonly areaId: AreaId
  readonly subareaId: SubareaId | null
  readonly puestoId: PuestoId
}

export interface SeleccionUbicacion {
  readonly departamentoId: DepartamentoUbicacionId
  readonly provinciaId: ProvinciaId
  readonly distritoId: DistritoId
}
