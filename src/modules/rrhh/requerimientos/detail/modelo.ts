import type {
  AccionHistorial,
  AlertaPlazo,
  BorradorRequerimiento,
  CatalogosRequerimientos,
  CausalCancelacion,
  Clasificacion,
  CoberturaRequerimiento,
  ColaboradorReemplazo,
  CumplimientoPlazo,
  DetalleRequerimiento,
  DetalleRequerimientoCanceladoCompleto,
  DetalleRequerimientoCompleto,
  EstadoRequerimiento,
  EventoHistorial,
  EventoHistorialBase,
  FechaISO,
  InstanteISO,
  NivelAlerta,
  PlazoRequerimiento,
  Remuneracion,
  UmbralAlerta,
  Usuario,
} from '../contracts'
import {
  CLASIFICACION_ETIQUETAS,
  MOTIVO_ETIQUETAS,
} from '../form/helpers'
import {
  NO_APLICA,
  NO_DISPONIBLE,
  PENDIENTE_DEFINIR,
  SIN_ASIGNAR,
  SIN_COLABORADOR,
  SIN_COMPLETAR,
  SIN_DETERMINAR,
  SIN_SUBAREA,
} from '../review/modelo'
import { ALERTA_LABELS, ESTADO_LABELS, formatearFecha } from '../tray/formato'

export const SIN_FECHA_OBJETIVO = 'Sin fecha objetivo'

export type CampoResumen =
  | 'motivo'
  | 'empresa'
  | 'colaboradorAReemplazar'
  | 'departamento'
  | 'area'
  | 'subarea'
  | 'puesto'
  | 'clasificacion'
  | 'remuneracion'
  | 'ubicacion'
  | 'usuarioProximaTarea'
  | 'comentario'

export interface CampoResumenDetalle {
  readonly campo: CampoResumen
  readonly etiqueta: string
  readonly valor: string
}

export interface ResumenDetalle {
  readonly campos: readonly CampoResumenDetalle[]
}

export interface CabeceraDetalle {
  readonly id: string
  readonly version: number
  readonly versionEtiqueta: string
  readonly estado: EstadoRequerimiento
  readonly estadoEtiqueta: string
  readonly fechaCreacion: InstanteISO
  readonly fechaCreacionTexto: string
}

export interface PrimerDiaRealDetalle {
  readonly fecha: FechaISO
  readonly fechaTexto: string
}

export interface InvarianteCobertura {
  /** `solicitadas - cubiertas`; solo verifica, no sustituye el valor recibido. */
  readonly esperado: number
  readonly consistente: boolean
}

export interface CoberturaDetalle {
  readonly disponible: boolean
  readonly solicitadas: number | null
  readonly cubiertas: number | null
  readonly pendientes: number | null
  readonly primerosDiasReales: readonly PrimerDiaRealDetalle[]
  readonly completa: boolean
  readonly invariante: InvarianteCobertura | null
}

export interface AlertaDetalle {
  readonly nivel: NivelAlerta
  readonly nivelEtiqueta: string
  readonly umbral: UmbralAlerta
  readonly umbralTexto: string
  readonly diaHabil: number
  readonly fecha: FechaISO
  readonly fechaTexto: string
}

export interface PlazoDetalle {
  readonly disponible: boolean
  readonly clasificacion: Clasificacion | null
  readonly clasificacionEtiqueta: string | null
  readonly origen: PlazoRequerimiento['origen'] | null
  readonly origenEtiqueta: string | null
  readonly duracionDiasHabiles: number | null
  readonly duracionTexto: string
  readonly fechaAprobacion: FechaISO | null
  readonly fechaAprobacionTexto: string | null
  readonly fechaObjetivo: FechaISO | null
  readonly fechaObjetivoTexto: string | null
  readonly cumplimiento: CumplimientoPlazo | null
  readonly cumplimientoEtiqueta: string
  /** Proyecta `cumplimiento`; no calcula umbrales ni fechas. */
  readonly incumplido: boolean
  readonly alerta: AlertaDetalle | null
}

export interface DetalleHistorial {
  readonly etiqueta: string
  readonly valor: string
}

export interface EntradaHistorial {
  readonly id: EventoHistorialBase['id']
  readonly accion: AccionHistorial
  readonly accionEtiqueta: string
  readonly usuario: Usuario
  readonly fechaHora: InstanteISO
  readonly fecha: string
  readonly hora: string
  readonly fechaHoraTexto: string
  readonly estadoAnterior: EstadoRequerimiento | null
  readonly estadoAnteriorEtiqueta: string | null
  readonly estadoNuevo: EstadoRequerimiento | null
  readonly estadoNuevoEtiqueta: string | null
  readonly comentario: string | null
  readonly detalles: readonly DetalleHistorial[]
}

export type OrdenHistorial = 'reciente-primero'

export interface HistorialDetalle {
  readonly orden: OrdenHistorial
  readonly entradas: readonly EntradaHistorial[]
  readonly vacio: boolean
  readonly total: number
}

export interface DetalleUx04 {
  readonly cabecera: CabeceraDetalle
  readonly resumen: ResumenDetalle
  readonly cobertura: CoberturaDetalle
  readonly plazo: PlazoDetalle
  readonly historial: HistorialDetalle
}

export interface OpcionesDetalleUx04 {
  readonly catalogos?: CatalogosRequerimientos
  /** El contrato de catálogos no expone colaboradores; los aporta el consumidor. */
  readonly colaboradores?: readonly ColaboradorReemplazo[]
}

export const ETIQUETAS_RESUMEN: Readonly<Record<CampoResumen, string>> = {
  motivo: 'Motivo',
  empresa: 'Empresa',
  colaboradorAReemplazar: 'Colaborador a reemplazar',
  departamento: 'Departamento',
  area: 'Área',
  subarea: 'Subárea',
  puesto: 'Puesto',
  clasificacion: 'Clasificación',
  remuneracion: 'Remuneración mensual',
  ubicacion: 'Ubicación',
  usuarioProximaTarea: 'Responsable de la próxima tarea',
  comentario: 'Comentario',
}

export const CAMPOS_RESUMEN: readonly CampoResumen[] = [
  'motivo',
  'empresa',
  'colaboradorAReemplazar',
  'departamento',
  'area',
  'subarea',
  'puesto',
  'clasificacion',
  'remuneracion',
  'ubicacion',
  'usuarioProximaTarea',
  'comentario',
]

export const ACCION_HISTORIAL_ETIQUETAS: Readonly<
  Record<AccionHistorial, string>
> = {
  edicion: 'Edición',
  envio: 'Envío a aprobación',
  reenvio: 'Reenvío a aprobación',
  aprobacion: 'Aprobación',
  observacion: 'Observación',
  creacion: 'Creación',
  cancelacion: 'Cancelación',
  'fijacion-plazo': 'Fijación de plazo',
  'ajuste-plazo': 'Ajuste de plazo',
  alerta: 'Alerta',
  vencimiento: 'Vencimiento',
  'apertura-proceso': 'Apertura de proceso en Selección',
  'solicitud-reversion': 'Solicitud de reversión de cobertura',
  'reversion-cobertura': 'Reversión de cobertura',
  'primer-dia-real': 'Primer día real',
}

export const CUMPLIMIENTO_ETIQUETAS: Readonly<
  Record<CumplimientoPlazo, string>
> = {
  pendiente: 'Pendiente',
  'en-plazo': 'En plazo',
  incumplido: 'Incumplido',
}

export const ORIGEN_PLAZO_ETIQUETAS: Readonly<
  Record<PlazoRequerimiento['origen'], string>
> = {
  'operativo-fijo': 'Operativo (10 días hábiles)',
  pendiente: 'Pendiente de definir',
  'fijado-administrativo': 'Fijado por RR. HH.',
  'ajustado-administrativo': 'Ajustado por RR. HH.',
}

export const CAUSAL_CANCELACION_ETIQUETAS: Readonly<
  Record<CausalCancelacion, string>
> = {
  'menor-carga-laboral': 'Menor carga laboral que la prevista',
  'creacion-por-error': 'Creación por error',
}

function formatearHora(valor: InstanteISO): string {
  const coincidencia = /T(\d{2}:\d{2})/.exec(valor)
  return coincidencia?.[1] ?? ''
}

function formatearFechaHora(valor: InstanteISO): string {
  const hora = formatearHora(valor)
  return hora === '' ? formatearFecha(valor) : `${formatearFecha(valor)} ${hora}`
}

function formatearRemuneracion(remuneracion: Remuneracion): string {
  const [entero, decimales] = remuneracion.monto.toFixed(2).split('.')
  const agrupado = entero.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return `S/ ${agrupado}.${decimales}`
}

function valorComentario(comentario: string | null): string {
  return comentario === null || comentario.trim() === ''
    ? SIN_COMPLETAR
    : comentario
}

function resolverNombre(
  items: readonly { readonly id: string; readonly nombre: string }[] | undefined,
  id: string | null,
  valorAusente: string,
): string {
  if (id === null) return valorAusente
  return items?.find((item) => item.id === id)?.nombre ?? NO_DISPONIBLE
}

function etiquetaMotivo(
  motivo: BorradorRequerimiento['motivo'],
  catalogos: CatalogosRequerimientos | undefined,
): string {
  if (motivo === null) return SIN_COMPLETAR
  return (
    catalogos?.motivos.find((item) => item.motivo === motivo)?.etiqueta ??
    MOTIVO_ETIQUETAS[motivo]
  )
}

function clasificacionBorrador(
  borrador: BorradorRequerimiento,
  catalogos: CatalogosRequerimientos | undefined,
): string {
  if (borrador.puestoId === null) return SIN_DETERMINAR
  const puesto = catalogos?.puestos.find(
    (item) => item.id === borrador.puestoId,
  )
  return puesto === undefined
    ? NO_DISPONIBLE
    : CLASIFICACION_ETIQUETAS[puesto.clasificacion]
}

function ubicacionBorrador(
  borrador: BorradorRequerimiento,
  catalogos: CatalogosRequerimientos | undefined,
): string {
  if (borrador.ubicacion === null) return SIN_COMPLETAR

  return [
    resolverNombre(
      catalogos?.departamentosUbicacion,
      borrador.ubicacion.departamentoId,
      SIN_COMPLETAR,
    ),
    resolverNombre(
      catalogos?.provincias,
      borrador.ubicacion.provinciaId,
      SIN_COMPLETAR,
    ),
    resolverNombre(
      catalogos?.distritos,
      borrador.ubicacion.distritoId,
      SIN_COMPLETAR,
    ),
  ].join(' / ')
}

function colaboradorBorrador(
  borrador: BorradorRequerimiento,
  colaboradores: readonly ColaboradorReemplazo[] | undefined,
): string {
  if (borrador.motivo !== 'reemplazo') {
    return borrador.motivo === null ? SIN_COMPLETAR : NO_APLICA
  }
  if (borrador.colaboradorAReemplazarId === null) return SIN_COLABORADOR
  return (
    colaboradores?.find(
      (item) => item.id === borrador.colaboradorAReemplazarId,
    )?.nombre ?? NO_DISPONIBLE
  )
}

function resumenDesdeCompleto(
  detalle:
    | DetalleRequerimientoCompleto
    | DetalleRequerimientoCanceladoCompleto,
): ResumenDetalle {
  const valores: Record<CampoResumen, string> = {
    motivo: MOTIVO_ETIQUETAS[detalle.motivo],
    empresa: detalle.empresa.nombre,
    colaboradorAReemplazar:
      detalle.colaboradorAReemplazar?.nombre ??
      (detalle.motivo === 'reemplazo' ? SIN_COLABORADOR : NO_APLICA),
    departamento: detalle.departamento.nombre,
    area: detalle.area.nombre,
    subarea: detalle.subarea?.nombre ?? SIN_SUBAREA,
    puesto: detalle.puesto.nombre,
    clasificacion: CLASIFICACION_ETIQUETAS[detalle.puesto.clasificacion],
    remuneracion: formatearRemuneracion(detalle.remuneracion),
    ubicacion: [
      detalle.ubicacion.departamento.nombre,
      detalle.ubicacion.provincia.nombre,
      detalle.ubicacion.distrito.nombre,
    ].join(' / '),
    usuarioProximaTarea: detalle.usuarioProximaTarea?.nombre ?? SIN_ASIGNAR,
    comentario: valorComentario(detalle.comentario),
  }

  return {
    campos: CAMPOS_RESUMEN.map((campo) => ({
      campo,
      etiqueta: ETIQUETAS_RESUMEN[campo],
      valor: valores[campo],
    })),
  }
}

function resumenDesdeBorrador(
  borrador: BorradorRequerimiento,
  opciones: OpcionesDetalleUx04,
): ResumenDetalle {
  const catalogos = opciones.catalogos
  const valores: Record<CampoResumen, string> = {
    motivo: etiquetaMotivo(borrador.motivo, catalogos),
    empresa: resolverNombre(catalogos?.empresas, borrador.empresaId, SIN_COMPLETAR),
    colaboradorAReemplazar: colaboradorBorrador(
      borrador,
      opciones.colaboradores,
    ),
    departamento: resolverNombre(
      catalogos?.departamentos,
      borrador.departamentoId,
      SIN_COMPLETAR,
    ),
    area: resolverNombre(catalogos?.areas, borrador.areaId, SIN_COMPLETAR),
    subarea: resolverNombre(catalogos?.subareas, borrador.subareaId, SIN_SUBAREA),
    puesto: resolverNombre(catalogos?.puestos, borrador.puestoId, SIN_COMPLETAR),
    clasificacion: clasificacionBorrador(borrador, catalogos),
    remuneracion:
      borrador.remuneracion === null
        ? SIN_COMPLETAR
        : formatearRemuneracion(borrador.remuneracion),
    ubicacion: ubicacionBorrador(borrador, catalogos),
    usuarioProximaTarea: resolverNombre(
      catalogos?.usuariosProximaTarea,
      borrador.usuarioProximaTareaId,
      SIN_ASIGNAR,
    ),
    comentario: valorComentario(borrador.comentario),
  }

  return {
    campos: CAMPOS_RESUMEN.map((campo) => ({
      campo,
      etiqueta: ETIQUETAS_RESUMEN[campo],
      valor: valores[campo],
    })),
  }
}

export function valorResumen(
  resumen: ResumenDetalle,
  campo: CampoResumen,
): string {
  return (
    resumen.campos.find((item) => item.campo === campo)?.valor ??
    SIN_DETERMINAR
  )
}

function coberturaDetalle(
  cobertura: CoberturaRequerimiento | null,
): CoberturaDetalle {
  if (cobertura === null) {
    return {
      disponible: false,
      solicitadas: null,
      cubiertas: null,
      pendientes: null,
      primerosDiasReales: [],
      completa: false,
      invariante: null,
    }
  }

  const esperado = cobertura.solicitadas - cobertura.cubiertas

  return {
    disponible: true,
    solicitadas: cobertura.solicitadas,
    cubiertas: cobertura.cubiertas,
    pendientes: cobertura.pendientes,
    primerosDiasReales: cobertura.primerosDiasReales.map((dia) => ({
      fecha: dia.fecha,
      fechaTexto: formatearFecha(dia.fecha),
    })),
    completa: cobertura.pendientes === 0,
    invariante: {
      esperado,
      consistente: cobertura.pendientes === esperado,
    },
  }
}

function alertaDetalle(alerta: AlertaPlazo): AlertaDetalle {
  return {
    nivel: alerta.nivel,
    nivelEtiqueta: ALERTA_LABELS[alerta.nivel],
    umbral: alerta.umbral,
    umbralTexto:
      alerta.umbral.tipo === 'dias-fijos'
        ? `Día hábil ${alerta.umbral.diaHabil}`
        : `${alerta.umbral.porcentaje} % del plazo`,
    diaHabil: alerta.diaHabil,
    fecha: alerta.fecha,
    fechaTexto: formatearFecha(alerta.fecha),
  }
}

function plazoDetalle(plazo: PlazoRequerimiento | null): PlazoDetalle {
  if (plazo === null) {
    return {
      disponible: false,
      clasificacion: null,
      clasificacionEtiqueta: null,
      origen: null,
      origenEtiqueta: null,
      duracionDiasHabiles: null,
      duracionTexto: SIN_DETERMINAR,
      fechaAprobacion: null,
      fechaAprobacionTexto: null,
      fechaObjetivo: null,
      fechaObjetivoTexto: null,
      cumplimiento: null,
      cumplimientoEtiqueta: SIN_DETERMINAR,
      incumplido: false,
      alerta: null,
    }
  }

  return {
    disponible: true,
    clasificacion: plazo.clasificacion,
    clasificacionEtiqueta: CLASIFICACION_ETIQUETAS[plazo.clasificacion],
    origen: plazo.origen,
    origenEtiqueta: ORIGEN_PLAZO_ETIQUETAS[plazo.origen],
    duracionDiasHabiles: plazo.duracionDiasHabiles,
    duracionTexto:
      plazo.duracionDiasHabiles === null
        ? PENDIENTE_DEFINIR
        : `${plazo.duracionDiasHabiles} días hábiles`,
    fechaAprobacion: plazo.fechaAprobacion,
    fechaAprobacionTexto:
      plazo.fechaAprobacion === null
        ? null
        : formatearFecha(plazo.fechaAprobacion),
    fechaObjetivo: plazo.fechaObjetivo,
    fechaObjetivoTexto:
      plazo.fechaObjetivo === null ? null : formatearFecha(plazo.fechaObjetivo),
    cumplimiento: plazo.cumplimiento,
    cumplimientoEtiqueta: CUMPLIMIENTO_ETIQUETAS[plazo.cumplimiento],
    incumplido: plazo.cumplimiento === 'incumplido',
    alerta: plazo.alerta === null ? null : alertaDetalle(plazo.alerta),
  }
}

function dato(etiqueta: string, valor: string): DetalleHistorial {
  return { etiqueta, valor }
}

function diasHabiles(valor: number): string {
  return `${valor} días hábiles`
}

function fechaOTexto(valor: FechaISO | null): string {
  return valor === null ? SIN_FECHA_OBJETIVO : formatearFecha(valor)
}

interface CamposEntrada {
  readonly estadoAnterior?: EstadoRequerimiento | null
  readonly estadoNuevo?: EstadoRequerimiento | null
  readonly comentario?: string | null
  readonly detalles?: readonly DetalleHistorial[]
}

function crearEntrada(
  evento: EventoHistorialBase,
  accion: AccionHistorial,
  campos: CamposEntrada = {},
): EntradaHistorial {
  const estadoAnterior = campos.estadoAnterior ?? null
  const estadoNuevo = campos.estadoNuevo ?? null

  return {
    id: evento.id,
    accion,
    accionEtiqueta: ACCION_HISTORIAL_ETIQUETAS[accion],
    usuario: evento.usuario,
    fechaHora: evento.fechaHora,
    fecha: formatearFecha(evento.fechaHora),
    hora: formatearHora(evento.fechaHora),
    fechaHoraTexto: formatearFechaHora(evento.fechaHora),
    estadoAnterior,
    estadoAnteriorEtiqueta:
      estadoAnterior === null ? null : ESTADO_LABELS[estadoAnterior],
    estadoNuevo,
    estadoNuevoEtiqueta:
      estadoNuevo === null ? null : ESTADO_LABELS[estadoNuevo],
    comentario: campos.comentario ?? null,
    detalles: campos.detalles ?? [],
  }
}

function entradaDesdeEvento(evento: EventoHistorial): EntradaHistorial {
  switch (evento.accion) {
    case 'edicion':
    case 'envio':
    case 'reenvio':
    case 'aprobacion':
    case 'observacion':
      return crearEntrada(evento, evento.accion, {
        estadoAnterior: evento.estadoAnterior,
        estadoNuevo: evento.estadoNuevo,
        comentario: evento.comentario,
      })
    case 'creacion':
      return crearEntrada(evento, evento.accion, {
        estadoNuevo: evento.estadoNuevo,
        comentario: evento.comentario,
      })
    case 'cancelacion':
      return crearEntrada(evento, evento.accion, {
        estadoAnterior: evento.estadoAnterior,
        estadoNuevo: evento.estadoNuevo,
        comentario: evento.comentario,
        detalles: [dato('Causal', CAUSAL_CANCELACION_ETIQUETAS[evento.causal])],
      })
    case 'ajuste-plazo':
      return crearEntrada(evento, evento.accion, {
        detalles: [
          dato('Motivo', evento.motivo),
          dato('Plazo anterior', diasHabiles(evento.plazoAnteriorDias)),
          dato('Plazo nuevo', diasHabiles(evento.plazoNuevoDias)),
          dato(
            'Fecha objetivo anterior',
            formatearFecha(evento.fechaObjetivoAnterior),
          ),
          dato(
            'Fecha objetivo nueva',
            formatearFecha(evento.fechaObjetivoNueva),
          ),
        ],
      })
    case 'fijacion-plazo':
      return crearEntrada(evento, evento.accion, {
        detalles: [
          dato('Plazo fijado', diasHabiles(evento.plazoNuevoDias)),
          dato('Fecha objetivo', fechaOTexto(evento.fechaObjetivoNueva)),
        ],
      })
    case 'alerta':
      return crearEntrada(evento, evento.accion, {
        detalles: [
          dato('Nivel de alerta', ALERTA_LABELS[evento.nivel]),
          dato('Fecha objetivo', formatearFecha(evento.fechaObjetivo)),
        ],
      })
    case 'vencimiento':
      return crearEntrada(evento, evento.accion, {
        detalles: [
          dato('Fecha objetivo', formatearFecha(evento.fechaObjetivo)),
          dato(
            'Fecha de incumplimiento',
            formatearFecha(evento.fechaIncumplimiento),
          ),
        ],
      })
    case 'apertura-proceso':
      return crearEntrada(evento, evento.accion, {
        detalles: [dato('Proceso', evento.proceso.id)],
      })
    case 'solicitud-reversion':
      return crearEntrada(evento, evento.accion, {
        detalles: [
          dato('Solicitud', evento.solicitudId),
          dato('Motivo', evento.motivo),
        ],
      })
    case 'reversion-cobertura':
      return crearEntrada(evento, evento.accion, {
        detalles: [
          dato('Solicitud', evento.solicitudId),
          dato('Origen', 'Selección'),
          dato('Motivo', evento.motivo),
          dato(
            'Colaborador afectado',
            evento.colaboradorAfectadoId ?? NO_APLICA,
          ),
          dato(
            'Solicitadas',
            String(evento.efectoCobertura.solicitadas),
          ),
          dato('Cubiertas', String(evento.efectoCobertura.cubiertas)),
          dato('Pendientes', String(evento.efectoCobertura.pendientes)),
          dato(
            'Estado resultante',
            ESTADO_LABELS[evento.efectoCobertura.estadoResultante],
          ),
        ],
      })
    case 'primer-dia-real':
      return crearEntrada(evento, evento.accion, {
        detalles: [
          dato('Fecha del primer día real', formatearFecha(evento.fecha)),
        ],
      })
  }
}

/**
 * Presenta el historial del evento más reciente al más antiguo. Los empates
 * conservan el orden recibido y ningún evento se descarta ni se reescribe.
 */
function normalizarHistorial(
  eventos: readonly EventoHistorial[],
): HistorialDetalle {
  const entradas = [...eventos]
    .sort((a, b) => Date.parse(b.fechaHora) - Date.parse(a.fechaHora))
    .map(entradaDesdeEvento)

  return {
    orden: 'reciente-primero',
    entradas,
    vacio: entradas.length === 0,
    total: entradas.length,
  }
}

function crearCabecera(detalle: DetalleRequerimiento): CabeceraDetalle {
  return {
    id: detalle.id,
    version: detalle.version,
    versionEtiqueta: `Versión ${detalle.version}`,
    estado: detalle.estado,
    estadoEtiqueta: ESTADO_LABELS[detalle.estado],
    fechaCreacion: detalle.fechaCreacion,
    fechaCreacionTexto: formatearFechaHora(detalle.fechaCreacion),
  }
}

export function crearDetalleUx04(
  detalle: DetalleRequerimiento,
  opciones: OpcionesDetalleUx04 = {},
): DetalleUx04 {
  const cabecera = crearCabecera(detalle)
  const historial = normalizarHistorial(detalle.historial)

  if (detalle.estado === 'borrador') {
    return {
      cabecera,
      resumen: resumenDesdeBorrador(detalle.borrador, opciones),
      cobertura: coberturaDetalle(detalle.cobertura),
      plazo: plazoDetalle(detalle.plazo),
      historial,
    }
  }

  if (detalle.estado === 'cancelado') {
    if (detalle.datos === 'completos') {
      return {
        cabecera,
        resumen: resumenDesdeCompleto(detalle),
        cobertura: coberturaDetalle(detalle.cobertura),
        plazo: plazoDetalle(detalle.plazo),
        historial,
      }
    }

    return {
      cabecera,
      resumen: resumenDesdeBorrador(detalle.borrador, opciones),
      cobertura: coberturaDetalle(detalle.cobertura),
      plazo: plazoDetalle(detalle.plazo),
      historial,
    }
  }

  return {
    cabecera,
    resumen: resumenDesdeCompleto(detalle),
    cobertura: coberturaDetalle(detalle.cobertura),
    plazo: plazoDetalle(detalle.plazo),
    historial,
  }
}
