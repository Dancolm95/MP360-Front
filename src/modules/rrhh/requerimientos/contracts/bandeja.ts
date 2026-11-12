import type { Capability } from '../../../../shared'
import type {
  AreaId,
  EmpresaId,
  FechaISO,
  PuestoId,
  SubareaId,
  UsuarioId,
} from './identificadores'
import type { EstadoRequerimiento, ResumenRequerimiento } from './requerimiento'
import type { ResultadoLectura } from './resultados'
import type { MotivoRequerimiento } from './base'

export interface RangoFechas {
  readonly desde: FechaISO
  readonly hasta: FechaISO
}

/**
 * Filtros de la bandeja. Un filtro ausente equivale a «sin filtro».
 * `periodoAprobacion` se aplica a la fecha de aprobación: un requerimiento sin
 * esa fecha no coincide con un rango activo.
 */
export interface FiltrosBandeja {
  readonly estados?: readonly EstadoRequerimiento[]
  readonly motivos?: readonly MotivoRequerimiento[]
  readonly empresas?: readonly EmpresaId[]
  readonly areas?: readonly AreaId[]
  readonly subareas?: readonly SubareaId[]
  readonly puestos?: readonly PuestoId[]
  readonly solicitantes?: readonly UsuarioId[]
  readonly periodoAprobacion?: RangoFechas
}

/** Columnas visibles y ordenables de la bandeja. */
export type CampoOrdenBandeja =
  | 'id'
  | 'fecha-creacion'
  | 'motivo'
  | 'empresa'
  | 'puesto'
  | 'solicitadas'
  | 'cubiertas'
  | 'pendientes'
  | 'estado'
  | 'fecha-objetivo'
  | 'responsable'

export type DireccionOrden = 'asc' | 'desc'

/**
 * Orden solicitado. El backend aplica el desempate estable por ID y sitúa los
 * valores ausentes al final en ambos sentidos. El orden inicial es
 * `fecha-creacion` descendente.
 */
export interface OrdenBandeja {
  readonly campo: CampoOrdenBandeja
  readonly direccion: DireccionOrden
}

export interface PaginacionBandeja {
  readonly pagina: number
  readonly tamanoPagina: number
}

export interface ConsultaBandeja {
  readonly filtros: FiltrosBandeja
  readonly orden: OrdenBandeja
  readonly paginacion: PaginacionBandeja
}

/**
 * Acciones que no dependen de un registro concreto. «Nuevo» es una acción de
 * bandeja; no se deduce de la autorización de un requerimiento existente.
 */
export type AccionBandeja = 'crear'

export interface CapacidadesBandeja {
  readonly capacidades: readonly Capability[]
  readonly accionesPermitidas: readonly AccionBandeja[]
}

/**
 * Página de resultados. `total` corresponde a la misma consulta filtrada y
 * ordenada; `elementos` vacío representa «sin resultados».
 */
export interface PaginaRequerimientos {
  readonly elementos: readonly ResumenRequerimiento[]
  readonly total: number
  readonly pagina: number
  readonly tamanoPagina: number
  readonly capacidades: CapacidadesBandeja
}

export type ResultadoConsultaBandeja = ResultadoLectura<PaginaRequerimientos>

export interface BandejaRequerimientosPort {
  consultar(consulta: ConsultaBandeja): Promise<ResultadoConsultaBandeja>
}
