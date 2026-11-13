import type { SessionScopedStore } from '../../../../shared'
import type {
  AreaId,
  CampoOrdenBandeja,
  ConsultaBandeja,
  DireccionOrden,
  EmpresaId,
  EstadoRequerimiento,
  FechaISO,
  FiltrosBandeja,
  MotivoRequerimiento,
  OrdenBandeja,
  PuestoId,
  RangoFechas,
  ResumenRequerimiento,
  SubareaId,
  UsuarioId,
} from '../contracts'
import { ORDEN_INICIAL } from '../tray/filtros'
import { ESTADOS, MOTIVOS } from '../tray/formato'

/**
 * Contexto de la bandeja UX-02 (RH-REQ-01 §7.1 y §7.3): filtros aplicados,
 * orden y página. Es la consulta que produce los resultados, de modo que puede
 * guardarse al entrar al detalle y restaurarse al volver sin reconstruirla.
 */
export type ContextoBandeja = ConsultaBandeja

/** Fila de la bandeja seleccionada junto con la consulta desde la que se abrió. */
export interface SeleccionRequerimiento {
  readonly requerimiento: ResumenRequerimiento
  readonly contexto: ContextoBandeja
}

export interface OpcionesContextoBandeja {
  /** Tamaño de página de la primera consulta y respaldo si el guardado no es válido. */
  readonly tamanoPaginaInicial: number
  /** Tamaños admitidos; un tamaño persistido fuera de esta lista se descarta. */
  readonly tamanosPagina?: readonly number[]
}

const CAMPOS_ORDEN: readonly CampoOrdenBandeja[] = [
  'id',
  'fecha-creacion',
  'motivo',
  'empresa',
  'puesto',
  'solicitadas',
  'cubiertas',
  'pendientes',
  'estado',
  'fecha-objetivo',
  'responsable',
]

const PATRON_FECHA = /^\d{4}-\d{2}-\d{2}$/

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor)
}

function esEnteroPositivo(valor: unknown): valor is number {
  return typeof valor === 'number' && Number.isInteger(valor) && valor >= 1
}

function esFechaISO(valor: unknown): valor is string {
  if (typeof valor !== 'string' || !PATRON_FECHA.test(valor)) return false
  const fecha = new Date(`${valor}T00:00:00Z`)
  return (
    !Number.isNaN(fecha.getTime()) && fecha.toISOString().slice(0, 10) === valor
  )
}

function sanearLista(
  valor: unknown,
  admitidos?: readonly string[],
): readonly string[] | undefined {
  if (!Array.isArray(valor)) return undefined
  const validos = valor.filter(
    (elemento): elemento is string =>
      typeof elemento === 'string' &&
      elemento.trim() !== '' &&
      (admitidos === undefined || admitidos.includes(elemento)),
  )
  return validos.length > 0 ? validos : undefined
}

function sanearPeriodo(valor: unknown): RangoFechas | undefined {
  if (!esObjeto(valor)) return undefined
  const { desde, hasta } = valor
  if (!esFechaISO(desde) || !esFechaISO(hasta) || desde > hasta) return undefined
  return { desde: desde as FechaISO, hasta: hasta as FechaISO }
}

/**
 * Conserva solo los filtros conocidos y con valores utilizables. Los
 * identificadores son opacos: se acepta cualquier cadena no vacía; los
 * valores canónicos (estado y motivo) se validan contra el catálogo.
 */
export function sanearFiltrosBandeja(valor: unknown): FiltrosBandeja {
  if (!esObjeto(valor)) return {}
  const filtros: {
    estados?: readonly EstadoRequerimiento[]
    motivos?: readonly MotivoRequerimiento[]
    empresas?: readonly EmpresaId[]
    areas?: readonly AreaId[]
    subareas?: readonly SubareaId[]
    puestos?: readonly PuestoId[]
    solicitantes?: readonly UsuarioId[]
    periodoAprobacion?: RangoFechas
  } = {}

  const estados = sanearLista(valor.estados, ESTADOS)
  if (estados) filtros.estados = estados as readonly EstadoRequerimiento[]

  const motivos = sanearLista(valor.motivos, MOTIVOS)
  if (motivos) filtros.motivos = motivos as readonly MotivoRequerimiento[]

  const empresas = sanearLista(valor.empresas)
  if (empresas) filtros.empresas = empresas as readonly EmpresaId[]

  const areas = sanearLista(valor.areas)
  if (areas) filtros.areas = areas as readonly AreaId[]

  const subareas = sanearLista(valor.subareas)
  if (subareas) filtros.subareas = subareas as readonly SubareaId[]

  const puestos = sanearLista(valor.puestos)
  if (puestos) filtros.puestos = puestos as readonly PuestoId[]

  const solicitantes = sanearLista(valor.solicitantes)
  if (solicitantes) filtros.solicitantes = solicitantes as readonly UsuarioId[]

  const periodo = sanearPeriodo(valor.periodoAprobacion)
  if (periodo) filtros.periodoAprobacion = periodo

  return filtros
}

function sanearOrden(valor: unknown): OrdenBandeja {
  if (!esObjeto(valor)) return { ...ORDEN_INICIAL }
  const campo = valor.campo
  if (!CAMPOS_ORDEN.includes(campo as CampoOrdenBandeja)) {
    return { ...ORDEN_INICIAL }
  }
  const direccion: DireccionOrden =
    valor.direccion === 'asc' || valor.direccion === 'desc'
      ? valor.direccion
      : ORDEN_INICIAL.direccion
  return { campo: campo as CampoOrdenBandeja, direccion }
}

function sanearTamanoPagina(
  valor: unknown,
  opciones: OpcionesContextoBandeja,
): number {
  if (!esEnteroPositivo(valor)) return opciones.tamanoPaginaInicial
  if (opciones.tamanosPagina && !opciones.tamanosPagina.includes(valor)) {
    return opciones.tamanoPaginaInicial
  }
  return valor
}

export function contextoBandejaInicial(
  opciones: OpcionesContextoBandeja,
): ContextoBandeja {
  return {
    filtros: {},
    orden: { ...ORDEN_INICIAL },
    paginacion: {
      pagina: 1,
      tamanoPagina: opciones.tamanoPaginaInicial,
    },
  }
}

/**
 * Convierte cualquier valor leído de la persistencia intra-sesión en un
 * contexto utilizable: descarta filtros desconocidos, fechas inválidas, orden
 * no reconocido y páginas o tamaños fuera de rango, sin romper la bandeja.
 */
export function sanearContextoBandeja(
  valor: unknown,
  opciones: OpcionesContextoBandeja,
): ContextoBandeja {
  if (!esObjeto(valor)) return contextoBandejaInicial(opciones)

  const paginacion = esObjeto(valor.paginacion) ? valor.paginacion : undefined
  const pagina = paginacion && esEnteroPositivo(paginacion.pagina) ? paginacion.pagina : 1
  const tamanoPagina = paginacion
    ? sanearTamanoPagina(paginacion.tamanoPagina, opciones)
    : opciones.tamanoPaginaInicial

  return {
    filtros: sanearFiltrosBandeja(valor.filtros),
    orden: sanearOrden(valor.orden),
    paginacion: { pagina, tamanoPagina },
  }
}

/**
 * Envuelve el almacén intra-sesión del contenedor con el contrato de contexto
 * de la bandeja. El resultado implementa `SessionScopedStore`, así que puede
 * registrarse tal cual para la limpieza al vencer, terminar o cambiar de
 * sesión. Solo viajan filtros, orden y paginación: no hay identidad, tokens ni
 * datos personales.
 */
export function crearStoreContextoBandeja(
  store: SessionScopedStore<unknown>,
  opciones: OpcionesContextoBandeja,
): SessionScopedStore<ContextoBandeja> {
  return {
    get() {
      const valor = store.get()
      return valor === undefined
        ? undefined
        : sanearContextoBandeja(valor, opciones)
    },
    set(contexto) {
      store.set(sanearContextoBandeja(contexto, opciones))
    },
    clear() {
      store.clear()
    },
  }
}
