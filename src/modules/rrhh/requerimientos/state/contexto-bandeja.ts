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
  PaginacionBandeja,
  PuestoId,
  RangoFechas,
  ResumenRequerimiento,
  SubareaId,
  UsuarioId,
} from '../contracts'
import { type AlmacenSesion, crearStoreSessionStorage } from './almacen-sesion'
import { CAMPOS_ORDEN, ESTADOS, MOTIVOS, ORDEN_INICIAL } from './valores-bandeja'

/**
 * Contexto de la bandeja UX-02 (RH-REQ-01 §7.1 y §7.3): filtros aplicados,
 * orden y página. Es la consulta que produce los resultados, de modo que puede
 * guardarse al entrar al detalle y restaurarse al volver sin reconstruirla.
 */
export type ContextoBandeja = ConsultaBandeja

export type MotivoSaneoContextoBandeja =
  | 'contexto-mal-formado'
  | 'campo-ausente'
  | 'campo-mal-formado'
  | 'filtro-desconocido'
  | 'filtro-mal-formado'
  | 'filtro-no-canonico'
  | 'orden-campo-desconocido'
  | 'orden-direccion-invalida'
  | 'pagina-invalida'
  | 'tamano-pagina-no-permitido'
  | 'periodo-incoherente'
  | 'periodo-mal-formado'

/** Ajuste aplicado al convertir un valor persistido en un contexto utilizable. */
export interface AjusteSaneoContextoBandeja {
  readonly campo: string
  readonly accion: 'descartado' | 'normalizado'
  readonly motivo: MotivoSaneoContextoBandeja
  readonly valor?: unknown
}

export interface SaneoContextoBandeja {
  readonly contexto: ContextoBandeja
  readonly ajustes: readonly AjusteSaneoContextoBandeja[]
}

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

const PATRON_FECHA = /^\d{4}-\d{2}-\d{2}$/

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor)
}

function esEnteroPositivo(valor: unknown): valor is number {
  return typeof valor === 'number' && Number.isInteger(valor) && valor >= 1
}

function esFechaISO(valor: unknown): valor is FechaISO {
  if (typeof valor !== 'string' || !PATRON_FECHA.test(valor)) return false
  const fecha = new Date(`${valor}T00:00:00Z`)
  return (
    !Number.isNaN(fecha.getTime()) && fecha.toISOString().slice(0, 10) === valor
  )
}

const FILTROS_CONOCIDOS = {
  estados: true,
  motivos: true,
  empresas: true,
  areas: true,
  subareas: true,
  puestos: true,
  solicitantes: true,
  periodoAprobacion: true,
} satisfies Record<keyof FiltrosBandeja, true>

/** Claves de filtro que entiende el contrato; única fuente para saneo y pruebas. */
export const CLAVES_FILTRO_BANDEJA = Object.keys(
  FILTROS_CONOCIDOS,
) as readonly (keyof FiltrosBandeja)[]

function ajuste(
  campo: string,
  accion: AjusteSaneoContextoBandeja['accion'],
  motivo: MotivoSaneoContextoBandeja,
  valor?: unknown,
): AjusteSaneoContextoBandeja {
  return valor === undefined
    ? { campo, accion, motivo }
    : { campo, accion, motivo, valor }
}

function sanearLista(
  valor: unknown,
  campo: string,
  admitidos: readonly string[] | undefined,
  ajustes: AjusteSaneoContextoBandeja[],
): readonly string[] | undefined {
  if (valor === undefined) return undefined
  if (!Array.isArray(valor)) {
    ajustes.push(ajuste(campo, 'descartado', 'filtro-mal-formado', valor))
    return undefined
  }

  const validos: string[] = []
  for (const elemento of valor) {
    if (typeof elemento !== 'string' || elemento.trim() === '') {
      ajustes.push(ajuste(campo, 'descartado', 'filtro-mal-formado', elemento))
    } else if (admitidos !== undefined && !admitidos.includes(elemento)) {
      ajustes.push(ajuste(campo, 'descartado', 'filtro-no-canonico', elemento))
    } else {
      validos.push(elemento)
    }
  }
  return validos.length > 0 ? validos : undefined
}

function sanearPeriodo(
  valor: unknown,
  ajustes: AjusteSaneoContextoBandeja[],
): RangoFechas | undefined {
  if (valor === undefined) return undefined
  if (!esObjeto(valor)) {
    ajustes.push(
      ajuste('filtros.periodoAprobacion', 'descartado', 'periodo-mal-formado', valor),
    )
    return undefined
  }

  const { desde, hasta } = valor
  if (!esFechaISO(desde) || !esFechaISO(hasta)) {
    const invertido =
      typeof desde === 'string' &&
      typeof hasta === 'string' &&
      PATRON_FECHA.test(desde) &&
      PATRON_FECHA.test(hasta) &&
      desde > hasta
    ajustes.push(
      ajuste(
        'filtros.periodoAprobacion',
        'descartado',
        invertido ? 'periodo-incoherente' : 'periodo-mal-formado',
        valor,
      ),
    )
    return undefined
  }
  if (desde > hasta) {
    ajustes.push(
      ajuste('filtros.periodoAprobacion', 'descartado', 'periodo-incoherente', valor),
    )
    return undefined
  }
  return { desde, hasta }
}

function sanearFiltrosBandejaConAjustes(
  valor: unknown,
  ajustes: AjusteSaneoContextoBandeja[],
): FiltrosBandeja {
  if (valor === undefined) {
    ajustes.push(ajuste('filtros', 'descartado', 'campo-ausente'))
    return {}
  }
  if (!esObjeto(valor)) {
    ajustes.push(ajuste('filtros', 'descartado', 'campo-mal-formado', valor))
    return {}
  }

  for (const clave of Object.keys(valor)) {
    if (!Object.hasOwn(FILTROS_CONOCIDOS, clave)) {
      ajustes.push(
        ajuste(`filtros.${clave}`, 'descartado', 'filtro-desconocido', valor[clave]),
      )
    }
  }

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

  const estados = sanearLista(valor.estados, 'filtros.estados', ESTADOS, ajustes)
  if (estados) filtros.estados = estados as readonly EstadoRequerimiento[]

  const motivos = sanearLista(valor.motivos, 'filtros.motivos', MOTIVOS, ajustes)
  if (motivos) filtros.motivos = motivos as readonly MotivoRequerimiento[]

  const empresas = sanearLista(valor.empresas, 'filtros.empresas', undefined, ajustes)
  if (empresas) filtros.empresas = empresas as readonly EmpresaId[]

  const areas = sanearLista(valor.areas, 'filtros.areas', undefined, ajustes)
  if (areas) filtros.areas = areas as readonly AreaId[]

  const subareas = sanearLista(valor.subareas, 'filtros.subareas', undefined, ajustes)
  if (subareas) filtros.subareas = subareas as readonly SubareaId[]

  const puestos = sanearLista(valor.puestos, 'filtros.puestos', undefined, ajustes)
  if (puestos) filtros.puestos = puestos as readonly PuestoId[]

  const solicitantes = sanearLista(
    valor.solicitantes,
    'filtros.solicitantes',
    undefined,
    ajustes,
  )
  if (solicitantes) filtros.solicitantes = solicitantes as readonly UsuarioId[]

  const periodo = sanearPeriodo(valor.periodoAprobacion, ajustes)
  if (periodo) filtros.periodoAprobacion = periodo

  return filtros
}

/**
 * Conserva solo los filtros conocidos y con valores utilizables. Los
 * identificadores son opacos: se acepta cualquier cadena no vacía; los
 * valores canónicos (estado y motivo) se validan contra el catálogo.
 */
export function sanearFiltrosBandeja(valor: unknown): FiltrosBandeja {
  return sanearFiltrosBandejaConAjustes(valor, [])
}

function sanearOrden(
  valor: unknown,
  ajustes: AjusteSaneoContextoBandeja[],
): OrdenBandeja {
  if (valor === undefined) {
    ajustes.push(ajuste('orden', 'descartado', 'campo-ausente'))
    return { ...ORDEN_INICIAL }
  }
  if (!esObjeto(valor)) {
    ajustes.push(ajuste('orden', 'descartado', 'campo-mal-formado', valor))
    return { ...ORDEN_INICIAL }
  }

  const campo = valor.campo
  const campoValido =
    typeof campo === 'string' && (CAMPOS_ORDEN as readonly string[]).includes(campo)
  if (campo === undefined) {
    ajustes.push(ajuste('orden.campo', 'descartado', 'campo-ausente'))
  } else if (!campoValido) {
    ajustes.push(
      ajuste('orden.campo', 'normalizado', 'orden-campo-desconocido', campo),
    )
  }

  const direccion: DireccionOrden =
    valor.direccion === 'asc' || valor.direccion === 'desc'
      ? valor.direccion
      : ORDEN_INICIAL.direccion
  if (valor.direccion === undefined) {
    ajustes.push(ajuste('orden.direccion', 'descartado', 'campo-ausente'))
  } else if (valor.direccion !== 'asc' && valor.direccion !== 'desc') {
    ajustes.push(
      ajuste(
        'orden.direccion',
        'normalizado',
        'orden-direccion-invalida',
        valor.direccion,
      ),
    )
  }

  return campoValido
    ? { campo: campo as CampoOrdenBandeja, direccion }
    : { ...ORDEN_INICIAL }
}

function sanearPaginacion(
  valor: unknown,
  opciones: OpcionesContextoBandeja,
  ajustes: AjusteSaneoContextoBandeja[],
): PaginacionBandeja {
  if (valor === undefined) {
    ajustes.push(ajuste('paginacion', 'descartado', 'campo-ausente'))
    return { pagina: 1, tamanoPagina: opciones.tamanoPaginaInicial }
  }
  if (!esObjeto(valor)) {
    ajustes.push(ajuste('paginacion', 'descartado', 'campo-mal-formado', valor))
    return { pagina: 1, tamanoPagina: opciones.tamanoPaginaInicial }
  }

  let pagina = 1
  const paginaPersistida = valor.pagina
  if (paginaPersistida === undefined) {
    ajustes.push(ajuste('paginacion.pagina', 'descartado', 'campo-ausente'))
  } else if (!esEnteroPositivo(paginaPersistida)) {
    ajustes.push(
      ajuste('paginacion.pagina', 'normalizado', 'pagina-invalida', paginaPersistida),
    )
  } else {
    pagina = paginaPersistida
  }

  let tamanoPagina = opciones.tamanoPaginaInicial
  const tamanoPersistido = valor.tamanoPagina
  if (tamanoPersistido === undefined) {
    ajustes.push(
      ajuste('paginacion.tamanoPagina', 'descartado', 'campo-ausente'),
    )
  } else if (
    !esEnteroPositivo(tamanoPersistido) ||
    (opciones.tamanosPagina !== undefined &&
      !opciones.tamanosPagina.includes(tamanoPersistido))
  ) {
    ajustes.push(
      ajuste(
        'paginacion.tamanoPagina',
        'normalizado',
        'tamano-pagina-no-permitido',
        tamanoPersistido,
      ),
    )
  } else {
    tamanoPagina = tamanoPersistido
  }

  return { pagina, tamanoPagina }
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
 * contexto utilizable y devuelve la traza de lo descartado o normalizado. Es
 * la única fuente del saneo de filtros, orden, página, tamaño y periodo; el
 * respaldo es selectivo: solo se repone la dimensión cuyo valor no sirve.
 */
export function sanearContextoBandejaConAjustes(
  valor: unknown,
  opciones: OpcionesContextoBandeja,
): SaneoContextoBandeja {
  const ajustes: AjusteSaneoContextoBandeja[] = []
  if (valor === undefined) {
    return { contexto: contextoBandejaInicial(opciones), ajustes }
  }
  if (!esObjeto(valor)) {
    ajustes.push(ajuste('contexto', 'descartado', 'contexto-mal-formado', valor))
    return { contexto: contextoBandejaInicial(opciones), ajustes }
  }

  return {
    contexto: {
      filtros: sanearFiltrosBandejaConAjustes(valor.filtros, ajustes),
      orden: sanearOrden(valor.orden, ajustes),
      paginacion: sanearPaginacion(valor.paginacion, opciones, ajustes),
    },
    ajustes,
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
  return sanearContextoBandejaConAjustes(valor, opciones).contexto
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

/** Clave versionada del contexto de bandeja en `sessionStorage`. */
export const CLAVE_CONTEXTO_BANDEJA =
  'erp-mp360:rrhh:requerimientos:contexto-bandeja:v1'

/**
 * Contexto de bandeja persistido de verdad en `sessionStorage`: una recarga
 * crea otra instancia que lee la misma clave. Un valor ausente, corrupto o
 * inaccesible se traduce en el contexto inicial; `clear()` retira la clave.
 */
export function crearStoreContextoBandejaSesion(
  opciones: OpcionesContextoBandeja,
  almacen?: AlmacenSesion | null,
): SessionScopedStore<ContextoBandeja> {
  const saneado = crearStoreContextoBandeja(
    crearStoreSessionStorage<unknown>(CLAVE_CONTEXTO_BANDEJA, almacen),
    opciones,
  )

  return {
    get: () => saneado.get() ?? contextoBandejaInicial(opciones),
    set: (contexto) => saneado.set(contexto),
    clear: () => saneado.clear(),
  }
}
