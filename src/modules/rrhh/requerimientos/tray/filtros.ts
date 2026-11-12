import type {
  AreaId,
  CatalogosRequerimientos,
  ConsultaBandeja,
  DireccionOrden,
  EmpresaId,
  EstadoRequerimiento,
  FechaISO,
  FiltrosBandeja,
  MotivoRequerimiento,
  OrdenBandeja,
  PuestoId,
  SubareaId,
  UsuarioId,
} from '../contracts'

export interface EstadoFiltrosFormulario {
  estado: EstadoRequerimiento | ''
  motivo: MotivoRequerimiento | ''
  empresa: EmpresaId | ''
  area: AreaId | ''
  subarea: SubareaId | ''
  puesto: PuestoId | ''
  solicitante: UsuarioId | ''
  desde: string
  hasta: string
}

export const FILTROS_FORMULARIO_VACIOS: EstadoFiltrosFormulario = {
  estado: '',
  motivo: '',
  empresa: '',
  area: '',
  subarea: '',
  puesto: '',
  solicitante: '',
  desde: '',
  hasta: '',
}

export const ORDEN_INICIAL: OrdenBandeja = {
  campo: 'fecha-creacion',
  direccion: 'desc',
}

export function validarPeriodo(filtros: EstadoFiltrosFormulario): string | null {
  const tieneDesde = filtros.desde !== ''
  const tieneHasta = filtros.hasta !== ''

  if (tieneDesde !== tieneHasta) {
    return 'Indica ambas fechas del periodo de aprobación.'
  }
  if (tieneDesde && tieneHasta && filtros.desde > filtros.hasta) {
    return 'La fecha «desde» no puede ser posterior a «hasta».'
  }
  return null
}

export function construirFiltros(
  filtros: EstadoFiltrosFormulario,
): FiltrosBandeja {
  const resultado: {
    estados?: readonly EstadoRequerimiento[]
    motivos?: readonly MotivoRequerimiento[]
    empresas?: readonly EmpresaId[]
    areas?: readonly AreaId[]
    subareas?: readonly SubareaId[]
    puestos?: readonly PuestoId[]
    solicitantes?: readonly UsuarioId[]
    periodoAprobacion?: { readonly desde: FechaISO; readonly hasta: FechaISO }
  } = {}

  if (filtros.estado) resultado.estados = [filtros.estado]
  if (filtros.motivo) resultado.motivos = [filtros.motivo]
  if (filtros.empresa) resultado.empresas = [filtros.empresa]
  if (filtros.area) resultado.areas = [filtros.area]
  if (filtros.subarea) resultado.subareas = [filtros.subarea]
  if (filtros.puesto) resultado.puestos = [filtros.puesto]
  if (filtros.solicitante) resultado.solicitantes = [filtros.solicitante]
  if (filtros.desde && filtros.hasta) {
    // Los <input type="date"> producen la fecha civil ISO que exige el contrato.
    resultado.periodoAprobacion = {
      desde: filtros.desde as FechaISO,
      hasta: filtros.hasta as FechaISO,
    }
  }

  return resultado
}

export function hayFiltrosActivos(filtros: FiltrosBandeja): boolean {
  return Object.keys(filtros).length > 0
}

export function crearConsulta(
  filtros: FiltrosBandeja,
  orden: OrdenBandeja,
  pagina: number,
  tamanoPagina: number,
): ConsultaBandeja {
  return { filtros, orden, paginacion: { pagina, tamanoPagina } }
}

export function siguienteOrden(
  actual: OrdenBandeja,
  campo: OrdenBandeja['campo'],
): OrdenBandeja {
  const direccion: DireccionOrden =
    actual.campo === campo && actual.direccion === 'asc' ? 'desc' : 'asc'
  return { campo, direccion }
}

export function subareasDisponibles(
  catalogos: CatalogosRequerimientos,
  area: AreaId | '',
) {
  return catalogos.subareas.filter((subarea) => !area || subarea.areaId === area)
}

export function puestosDisponibles(
  catalogos: CatalogosRequerimientos,
  area: AreaId | '',
  subarea: SubareaId | '',
) {
  return catalogos.puestos.filter(
    (puesto) =>
      (!area || puesto.areaId === area) &&
      (!subarea || puesto.subareaId === subarea),
  )
}
