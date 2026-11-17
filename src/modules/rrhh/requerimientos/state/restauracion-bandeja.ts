import type {
  CatalogosRequerimientos,
  ConsultaBandeja,
  FiltrosBandeja,
  Usuario,
} from '../contracts'
import {
  contextoBandejaInicial,
  sanearContextoBandejaConAjustes,
  type MotivoSaneoContextoBandeja,
  type OpcionesContextoBandeja,
} from './contexto-bandeja'

/**
 * Calidad del contexto recuperado: `restaurado` no aplicó cambios y
 * `sin-contexto` indica que nunca se recibió uno; `incompleto` prevalece si
 * hubo campos ausentes, mal formados o valores normalizados, e `incompatible`
 * queda para los filtros retirados por catálogo o por clave desconocida. La
 * `consulta` devuelta siempre es aplicable y conserva las dimensiones válidas:
 * el respaldo es selectivo.
 */
export type EstadoRestauracionBandeja =
  | 'restaurado'
  | 'sin-contexto'
  | 'incompleto'
  | 'incompatible'

export type MotivoAjusteRestauracionBandeja =
  | MotivoSaneoContextoBandeja
  | 'contexto-ausente'
  | 'referencia-no-disponible'

/**
 * Cambio aplicado para obtener una consulta utilizable. Incluye la traza del
 * saneo compartido de T-RH-06 y los descartes propios de esta restauración
 * (contexto ausente y referencias que ya no existen en los catálogos).
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
   * consumidor, igual que en la bandeja.
   */
  readonly solicitantes: readonly Usuario[]
}

interface ReferenciasCatalogo {
  readonly empresas: ReadonlySet<string>
  readonly areas: ReadonlySet<string>
  readonly subareas: ReadonlySet<string>
  readonly puestos: ReadonlySet<string>
  readonly solicitantes: ReadonlySet<string>
}

type FiltrosBandejaMutable = {
  -readonly [Clave in keyof FiltrosBandeja]: FiltrosBandeja[Clave]
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

/**
 * Retira solo los identificadores ausentes de los catálogos disponibles. Parte
 * de una copia de los filtros saneados para que cualquier filtro futuro del
 * contrato llegue intacto a la consulta restaurada.
 */
function retirarReferenciasAusentes(
  filtros: FiltrosBandeja,
  referencias: ReferenciasCatalogo,
  ajustes: AjusteRestauracionBandeja[],
): FiltrosBandeja {
  const resultado: FiltrosBandejaMutable = { ...filtros }

  const empresas = conservarDisponibles(
    filtros.empresas,
    referencias.empresas,
    'filtros.empresas',
    ajustes,
  )
  if (empresas) resultado.empresas = empresas
  else delete resultado.empresas

  const areas = conservarDisponibles(
    filtros.areas,
    referencias.areas,
    'filtros.areas',
    ajustes,
  )
  if (areas) resultado.areas = areas
  else delete resultado.areas

  const subareas = conservarDisponibles(
    filtros.subareas,
    referencias.subareas,
    'filtros.subareas',
    ajustes,
  )
  if (subareas) resultado.subareas = subareas
  else delete resultado.subareas

  const puestos = conservarDisponibles(
    filtros.puestos,
    referencias.puestos,
    'filtros.puestos',
    ajustes,
  )
  if (puestos) resultado.puestos = puestos
  else delete resultado.puestos

  const solicitantes = conservarDisponibles(
    filtros.solicitantes,
    referencias.solicitantes,
    'filtros.solicitantes',
    ajustes,
  )
  if (solicitantes) resultado.solicitantes = solicitantes
  else delete resultado.solicitantes

  return resultado
}

function estadoDe(
  ajustes: readonly AjusteRestauracionBandeja[],
): EstadoRestauracionBandeja {
  if (ajustes.length === 0) return 'restaurado'
  const soloIncompatibilidades = ajustes.every(
    (item) =>
      item.motivo === 'referencia-no-disponible' ||
      item.motivo === 'filtro-desconocido',
  )
  return soloIncompatibilidades ? 'incompatible' : 'incompleto'
}

/**
 * Convierte el contexto guardado por la bandeja (T-RH-06) en la consulta que
 * debe aplicarse al volver del detalle. Filtros, orden, página, tamaño y
 * periodo se sanean en `sanearContextoBandejaConAjustes`; aquí solo se añaden
 * el caso de contexto ausente y el filtrado de referencias de catálogo. La
 * entrada no se muta y el respaldo degradado es selectivo.
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

  const saneo = sanearContextoBandejaConAjustes(contexto, opciones)
  const ajustes: AjusteRestauracionBandeja[] = [...saneo.ajustes]
  const consulta: ConsultaBandeja = {
    filtros: retirarReferenciasAusentes(
      saneo.contexto.filtros,
      referenciasDe(opciones),
      ajustes,
    ),
    orden: saneo.contexto.orden,
    paginacion: saneo.contexto.paginacion,
  }

  return { estado: estadoDe(ajustes), consulta, ajustes }
}
