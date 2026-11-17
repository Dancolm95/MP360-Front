import type {
  CatalogosRequerimientos,
  ConsultaBandeja,
  FiltrosBandeja,
  Usuario,
} from '../contracts'
import {
  contextoBandejaInicial,
  sanearContextoBandeja,
  type OpcionesContextoBandeja,
} from './contexto-bandeja'
import { CAMPOS_ORDEN, ESTADOS, MOTIVOS } from './valores-bandeja'

/**
 * Calidad del contexto recuperado: `incompleto` prevalece si hubo campos
 * ausentes, mal formados o valores normalizados; `incompatible` queda para los
 * filtros retirados por catálogo o por clave desconocida. La `consulta`
 * devuelta siempre es aplicable, también en los estados degradados.
 */
export type EstadoRestauracionBandeja =
  | 'restaurado'
  | 'sin-contexto'
  | 'incompleto'
  | 'incompatible'

export type MotivoAjusteRestauracionBandeja =
  | 'contexto-ausente'
  | 'contexto-mal-formado'
  | 'campo-ausente'
  | 'campo-mal-formado'
  | 'filtro-desconocido'
  | 'filtro-mal-formado'
  | 'filtro-no-canonico'
  | 'referencia-no-disponible'
  | 'orden-campo-desconocido'
  | 'orden-direccion-invalida'
  | 'pagina-invalida'
  | 'tamano-pagina-no-permitido'
  | 'periodo-incoherente'
  | 'periodo-mal-formado'

/**
 * Cambio aplicado al contexto para obtener una consulta utilizable. `campo`
 * es la ruta dentro del contexto (`paginacion.pagina`, `filtros.empresas`…);
 * `valor` recoge el dato original descartado cuando existe.
 */
export interface AjusteRestauracionBandeja {
  readonly campo: string
  readonly accion: 'descartado' | 'normalizado'
  readonly motivo: MotivoAjusteRestauracionBandeja
  readonly valor?: unknown
}

export interface ResultadoRestauracionBandeja {
  readonly estado: EstadoRestauracionBandeja
  readonly consulta: ConsultaBandeja
  readonly ajustes: readonly AjusteRestauracionBandeja[]
}

export interface OpcionesRestauracionBandeja extends OpcionesContextoBandeja {
  readonly catalogos: CatalogosRequerimientos
  /**
   * El contrato de catálogos no expone la lista de solicitantes; la aporta el
   * consumidor, igual que en la bandeja. Sin ella no se puede detectar que un
   * solicitante haya dejado de existir.
   */
  readonly solicitantes: readonly Usuario[]
}

const PATRON_FECHA = /^\d{4}-\d{2}-\d{2}$/

const CLAVES_FILTRO = new Set<string>([
  'estados',
  'motivos',
  'empresas',
  'areas',
  'subareas',
  'puestos',
  'solicitantes',
  'periodoAprobacion',
])

const MOTIVOS_INCOMPLETOS: ReadonlySet<MotivoAjusteRestauracionBandeja> = new Set([
  'contexto-mal-formado',
  'campo-ausente',
  'campo-mal-formado',
  'filtro-mal-formado',
  'filtro-no-canonico',
  'orden-campo-desconocido',
  'orden-direccion-invalida',
  'pagina-invalida',
  'tamano-pagina-no-permitido',
  'periodo-incoherente',
  'periodo-mal-formado',
])

const CLAVES_FILTRO_LISTA = [
  'estados',
  'motivos',
  'empresas',
  'areas',
  'subareas',
  'puestos',
  'solicitantes',
] as const

interface ReferenciasCatalogo {
  readonly empresas: ReadonlySet<string>
  readonly areas: ReadonlySet<string>
  readonly subareas: ReadonlySet<string>
  readonly puestos: ReadonlySet<string>
  readonly solicitantes: ReadonlySet<string>
}

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor)
}

function esEnteroPositivo(valor: unknown): valor is number {
  return typeof valor === 'number' && Number.isInteger(valor) && valor >= 1
}

function referenciasDe(opciones: OpcionesRestauracionBandeja): ReferenciasCatalogo {
  return {
    empresas: new Set(opciones.catalogos.empresas.map((empresa) => empresa.id)),
    areas: new Set(opciones.catalogos.areas.map((area) => area.id)),
    subareas: new Set(opciones.catalogos.subareas.map((subarea) => subarea.id)),
    puestos: new Set(opciones.catalogos.puestos.map((puesto) => puesto.id)),
    solicitantes: new Set(opciones.solicitantes.map((usuario) => usuario.id)),
  }
}

function ajuste(
  campo: string,
  accion: AjusteRestauracionBandeja['accion'],
  motivo: MotivoAjusteRestauracionBandeja,
  valor?: unknown,
): AjusteRestauracionBandeja {
  return valor === undefined
    ? { campo, accion, motivo }
    : { campo, accion, motivo, valor }
}

function revisarFiltros(
  filtros: unknown,
  periodoConservado: boolean,
  ajustes: AjusteRestauracionBandeja[],
): void {
  if (filtros === undefined) {
    ajustes.push(ajuste('filtros', 'descartado', 'campo-ausente'))
    return
  }
  if (!esObjeto(filtros)) {
    ajustes.push(ajuste('filtros', 'descartado', 'campo-mal-formado', filtros))
    return
  }

  for (const clave of Object.keys(filtros)) {
    if (!CLAVES_FILTRO.has(clave)) {
      ajustes.push(
        ajuste(`filtros.${clave}`, 'descartado', 'filtro-desconocido', filtros[clave]),
      )
    }
  }

  for (const clave of CLAVES_FILTRO_LISTA) {
    const valores = filtros[clave]
    if (valores === undefined) continue
    if (!Array.isArray(valores)) {
      ajustes.push(
        ajuste(`filtros.${clave}`, 'descartado', 'filtro-mal-formado', valores),
      )
      continue
    }
    const admitidos =
      clave === 'estados' ? ESTADOS : clave === 'motivos' ? MOTIVOS : undefined
    for (const valor of valores) {
      if (typeof valor !== 'string' || valor.trim() === '') {
        ajustes.push(
          ajuste(`filtros.${clave}`, 'descartado', 'filtro-mal-formado', valor),
        )
      } else if (admitidos && !(admitidos as readonly string[]).includes(valor)) {
        ajustes.push(
          ajuste(`filtros.${clave}`, 'descartado', 'filtro-no-canonico', valor),
        )
      }
    }
  }

  if (filtros.periodoAprobacion !== undefined) {
    const periodo = filtros.periodoAprobacion
    if (!esObjeto(periodo)) {
      ajustes.push(
        ajuste('filtros.periodoAprobacion', 'descartado', 'periodo-mal-formado', periodo),
      )
    } else {
      const { desde, hasta } = periodo
      const invertido =
        typeof desde === 'string' &&
        typeof hasta === 'string' &&
        PATRON_FECHA.test(desde) &&
        PATRON_FECHA.test(hasta) &&
        desde > hasta
      if (invertido) {
        ajustes.push(
          ajuste(
            'filtros.periodoAprobacion',
            'descartado',
            'periodo-incoherente',
            periodo,
          ),
        )
      } else if (!periodoConservado) {
        // Un periodo no invertido que no sobrevive al saneo contiene una fecha
        // civil inexistente (por ejemplo, 30 de febrero).
        ajustes.push(
          ajuste(
            'filtros.periodoAprobacion',
            'descartado',
            'periodo-mal-formado',
            periodo,
          ),
        )
      }
    }
  }
}

function revisarOrden(
  orden: unknown,
  ajustes: AjusteRestauracionBandeja[],
): void {
  if (orden === undefined) {
    ajustes.push(ajuste('orden', 'descartado', 'campo-ausente'))
    return
  }
  if (!esObjeto(orden)) {
    ajustes.push(ajuste('orden', 'descartado', 'campo-mal-formado', orden))
    return
  }

  const campo = orden.campo
  if (campo === undefined) {
    ajustes.push(ajuste('orden.campo', 'descartado', 'campo-ausente'))
  } else if (
    typeof campo !== 'string' ||
    !(CAMPOS_ORDEN as readonly string[]).includes(campo)
  ) {
    ajustes.push(
      ajuste('orden.campo', 'normalizado', 'orden-campo-desconocido', campo),
    )
  }

  const direccion = orden.direccion
  if (direccion === undefined) {
    ajustes.push(ajuste('orden.direccion', 'descartado', 'campo-ausente'))
  } else if (direccion !== 'asc' && direccion !== 'desc') {
    ajustes.push(
      ajuste('orden.direccion', 'normalizado', 'orden-direccion-invalida', direccion),
    )
  }
}

function revisarPaginacion(
  paginacion: unknown,
  opciones: OpcionesRestauracionBandeja,
  ajustes: AjusteRestauracionBandeja[],
): void {
  if (paginacion === undefined) {
    ajustes.push(ajuste('paginacion', 'descartado', 'campo-ausente'))
    return
  }
  if (!esObjeto(paginacion)) {
    ajustes.push(
      ajuste('paginacion', 'descartado', 'campo-mal-formado', paginacion),
    )
    return
  }

  const pagina = paginacion.pagina
  if (pagina === undefined) {
    ajustes.push(ajuste('paginacion.pagina', 'descartado', 'campo-ausente'))
  } else if (!esEnteroPositivo(pagina)) {
    ajustes.push(
      ajuste('paginacion.pagina', 'normalizado', 'pagina-invalida', pagina),
    )
  }

  const tamanoPagina = paginacion.tamanoPagina
  if (tamanoPagina === undefined) {
    ajustes.push(
      ajuste('paginacion.tamanoPagina', 'descartado', 'campo-ausente'),
    )
  } else if (
    !esEnteroPositivo(tamanoPagina) ||
    (opciones.tamanosPagina !== undefined &&
      !opciones.tamanosPagina.includes(tamanoPagina))
  ) {
    ajustes.push(
      ajuste(
        'paginacion.tamanoPagina',
        'normalizado',
        'tamano-pagina-no-permitido',
        tamanoPagina,
      ),
    )
  }
}

function conservarDisponibles<T extends string>(
  valores: readonly T[] | undefined,
  disponibles: ReadonlySet<string>,
  campo: string,
  ajustes: AjusteRestauracionBandeja[],
): readonly T[] | undefined {
  if (!valores) return undefined

  const conservados = valores.filter((valor) => disponibles.has(valor))
  for (const valor of valores) {
    if (!disponibles.has(valor)) {
      ajustes.push(
        ajuste(campo, 'descartado', 'referencia-no-disponible', valor),
      )
    }
  }
  return conservados.length > 0 ? conservados : undefined
}

function restaurarFiltros(
  filtros: FiltrosBandeja,
  referencias: ReferenciasCatalogo,
  ajustes: AjusteRestauracionBandeja[],
): FiltrosBandeja {
  const resultado: {
    estados?: FiltrosBandeja['estados']
    motivos?: FiltrosBandeja['motivos']
    empresas?: FiltrosBandeja['empresas']
    areas?: FiltrosBandeja['areas']
    subareas?: FiltrosBandeja['subareas']
    puestos?: FiltrosBandeja['puestos']
    solicitantes?: FiltrosBandeja['solicitantes']
    periodoAprobacion?: FiltrosBandeja['periodoAprobacion']
  } = {}

  if (filtros.estados) resultado.estados = filtros.estados
  if (filtros.motivos) resultado.motivos = filtros.motivos

  const empresas = conservarDisponibles(
    filtros.empresas,
    referencias.empresas,
    'filtros.empresas',
    ajustes,
  )
  if (empresas) resultado.empresas = empresas

  const areas = conservarDisponibles(
    filtros.areas,
    referencias.areas,
    'filtros.areas',
    ajustes,
  )
  if (areas) resultado.areas = areas

  const subareas = conservarDisponibles(
    filtros.subareas,
    referencias.subareas,
    'filtros.subareas',
    ajustes,
  )
  if (subareas) resultado.subareas = subareas

  const puestos = conservarDisponibles(
    filtros.puestos,
    referencias.puestos,
    'filtros.puestos',
    ajustes,
  )
  if (puestos) resultado.puestos = puestos

  const solicitantes = conservarDisponibles(
    filtros.solicitantes,
    referencias.solicitantes,
    'filtros.solicitantes',
    ajustes,
  )
  if (solicitantes) resultado.solicitantes = solicitantes

  if (filtros.periodoAprobacion) {
    resultado.periodoAprobacion = filtros.periodoAprobacion
  }

  return resultado
}

function estadoDe(ajustes: readonly AjusteRestauracionBandeja[]): EstadoRestauracionBandeja {
  if (ajustes.some((item) => MOTIVOS_INCOMPLETOS.has(item.motivo))) {
    return 'incompleto'
  }
  return ajustes.length > 0 ? 'incompatible' : 'restaurado'
}

/**
 * Convierte el contexto guardado por la bandeja (T-RH-06) en la consulta que
 * debe aplicarse al volver del detalle. El saneo y la forma de la consulta son
 * los de `sanearContextoBandeja`; aquí solo se explican los descartes y se
 * retiran las referencias que ya no existen en los catálogos disponibles.
 */
export function restaurarConsultaBandeja(
  contexto: unknown,
  opciones: OpcionesRestauracionBandeja,
): ResultadoRestauracionBandeja {
  if (contexto === undefined) {
    return {
      estado: 'sin-contexto',
      consulta: contextoBandejaInicial(opciones),
      ajustes: [ajuste('contexto', 'descartado', 'contexto-ausente')],
    }
  }

  if (!esObjeto(contexto)) {
    return {
      estado: 'incompleto',
      consulta: contextoBandejaInicial(opciones),
      ajustes: [
        ajuste('contexto', 'descartado', 'contexto-mal-formado', contexto),
      ],
    }
  }

  const saneado = sanearContextoBandeja(contexto, opciones)
  const ajustes: AjusteRestauracionBandeja[] = []

  revisarFiltros(
    contexto.filtros,
    saneado.filtros.periodoAprobacion !== undefined,
    ajustes,
  )
  const filtros = restaurarFiltros(
    saneado.filtros,
    referenciasDe(opciones),
    ajustes,
  )
  revisarOrden(contexto.orden, ajustes)
  revisarPaginacion(contexto.paginacion, opciones, ajustes)

  const consulta: ConsultaBandeja = {
    filtros,
    orden: saneado.orden,
    paginacion: saneado.paginacion,
  }

  return { estado: estadoDe(ajustes), consulta, ajustes }
}
