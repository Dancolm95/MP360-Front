import { CAP_RRHH_REQUERIMIENTOS_READ } from '../modules/rrhh/identifiers'
import type {
  AlertaPlazo,
  AlertaPlazoAdministrativo,
  AlertaPlazoOperativo,
  BandejaRequerimientosPort,
  BorradorRequerimiento,
  CampoOrdenBandeja,
  ConsultaBandeja,
  DetalleRequerimiento,
  FiltrosBandeja,
  PlazoRequerimiento,
  ResumenRequerimiento,
  ResumenRequerimientoCanceladoCompleto,
  ResumenRequerimientoCompleto,
} from '../modules/rrhh/requerimientos'
import {
  CATALOGOS,
  COLABORADORES,
  DETALLE,
  PAGINA_REQUERIMIENTOS,
  PLAZO_ADMINISTRATIVO_DIAS,
  SOLICITANTES,
} from './preview/requerimientos/data'

/**
 * Adaptación de los datos del preview para la demo de `/`. No es un adaptador
 * real: no persiste, no autoriza y solo resuelve los filtros y el orden que el
 * resumen del contrato expone; área y subárea se derivan de su puesto. Se
 * mantiene en `src/app` para no inventar puertos ni reglas dentro de `modules/`.
 */
export {
  CATALOGOS,
  COLABORADORES,
  PLAZO_ADMINISTRATIVO_DIAS,
  SOLICITANTES,
}

const TAMANO_PAGINA_DEMO = 10

function filaCoincide(
  fila: ResumenRequerimiento,
  filtros: FiltrosBandeja,
): boolean {
  if (filtros.estados?.length && !filtros.estados.includes(fila.estado)) {
    return false
  }
  if (
    filtros.motivos?.length &&
    (fila.motivo === null || !filtros.motivos.includes(fila.motivo))
  ) {
    return false
  }
  if (
    filtros.empresas?.length &&
    (fila.empresa === null || !filtros.empresas.includes(fila.empresa.id))
  ) {
    return false
  }
  if (
    filtros.puestos?.length &&
    (fila.puesto === null || !filtros.puestos.includes(fila.puesto.id))
  ) {
    return false
  }
  // El resumen solo expone la jerarquía del puesto; el demo filtra área y
  // subárea por esa referencia porque no transporta las suyas propias.
  if (filtros.areas?.length) {
    if (fila.puesto === null || !filtros.areas.includes(fila.puesto.areaId)) {
      return false
    }
  }
  if (filtros.subareas?.length) {
    const subareaId = fila.puesto?.subareaId
    if (!subareaId || !filtros.subareas.includes(subareaId)) return false
  }
  // `solicitantes` y `periodoAprobacion` no tienen dato en el resumen del
  // contrato; el demo no inventa usuarios ni fechas de aprobación y deja pasar
  // esas consultas. La interfaz lo advierte de forma visible.
  return true
}

function valorOrden(
  fila: ResumenRequerimiento,
  campo: CampoOrdenBandeja,
): string | number | null {
  switch (campo) {
    case 'id':
      return String(fila.id)
    case 'fecha-creacion':
      return fila.fechaCreacion
    case 'motivo':
      return fila.motivo
    case 'empresa':
      return fila.empresa?.nombre ?? null
    case 'puesto':
      return fila.puesto?.nombre ?? null
    case 'solicitadas':
      return fila.solicitadas
    case 'cubiertas':
      return fila.cubiertas
    case 'pendientes':
      return fila.pendientes
    case 'estado':
      return fila.estado
    case 'fecha-objetivo':
      return fila.fechaObjetivo
    case 'responsable':
      return fila.responsable?.nombre ?? null
  }
}

function compararFilas(
  primera: ResumenRequerimiento,
  segunda: ResumenRequerimiento,
  consulta: ConsultaBandeja,
): number {
  const valorPrimero = valorOrden(primera, consulta.orden.campo)
  const valorSegundo = valorOrden(segunda, consulta.orden.campo)

  if (valorPrimero === null || valorSegundo === null) {
    if (valorPrimero !== valorSegundo) return valorPrimero === null ? 1 : -1
  } else {
    const comparacion =
      typeof valorPrimero === 'number' && typeof valorSegundo === 'number'
        ? valorPrimero - valorSegundo
        : String(valorPrimero).localeCompare(String(valorSegundo), 'es')
    if (comparacion !== 0) {
      return consulta.orden.direccion === 'asc' ? comparacion : -comparacion
    }
  }

  return String(primera.id).localeCompare(String(segunda.id), 'es')
}

export function crearBandejaDemoPort(): BandejaRequerimientosPort {
  return {
    async consultar(consulta) {
      const coincidentes = PAGINA_REQUERIMIENTOS.elementos.filter((fila) =>
        filaCoincide(fila, consulta.filtros),
      )
      const ordenadas = [...coincidentes].sort((primera, segunda) =>
        compararFilas(primera, segunda, consulta),
      )

      const tamanoPagina = consulta.paginacion.tamanoPagina || TAMANO_PAGINA_DEMO
      const pagina = Math.max(1, consulta.paginacion.pagina)
      const inicio = (pagina - 1) * tamanoPagina

      return {
        status: 'ok',
        datos: {
          elementos: ordenadas.slice(inicio, inicio + tamanoPagina),
          total: ordenadas.length,
          pagina,
          tamanoPagina,
          capacidades: {
            capacidades: [CAP_RRHH_REQUERIMIENTOS_READ],
            // La demo declara la acción de bandeja para poder recorrer UX-03;
            // en un backend real la decide la autorización efectiva.
            accionesPermitidas: ['crear'],
          },
        },
      }
    },
  }
}

function borradorVacio(): BorradorRequerimiento {
  return {
    motivo: null,
    empresaId: null,
    colaboradorAReemplazarId: null,
    departamentoId: null,
    areaId: null,
    subareaId: null,
    puestoId: null,
    vacantes: null,
    remuneracion: null,
    ubicacion: null,
    usuarioProximaTareaId: null,
    comentario: null,
  }
}

type ResumenConPlazo =
  | ResumenRequerimientoCompleto
  | ResumenRequerimientoCanceladoCompleto

function alertaOperativa(alerta: AlertaPlazo | null): AlertaPlazoOperativo | null {
  if (!alerta || alerta.umbral.tipo !== 'dias-fijos') return null
  return {
    nivel: alerta.nivel,
    umbral: alerta.umbral,
    diaHabil: alerta.diaHabil,
    fecha: alerta.fecha,
  }
}

function alertaAdministrativa(
  alerta: AlertaPlazo | null,
): AlertaPlazoAdministrativo | null {
  if (!alerta || alerta.umbral.tipo !== 'porcentaje') return null
  return {
    nivel: alerta.nivel,
    umbral: alerta.umbral,
    diaHabil: alerta.diaHabil,
    fecha: alerta.fecha,
  }
}

function plazoDemo(
  resumen: ResumenConPlazo,
  usaDatosDeEjemplo: boolean,
): PlazoRequerimiento {
  const alerta = resumen.alerta
  // La fecha de aprobación y el cumplimiento solo existen en el ejemplo; el
  // resumen de la fila no los transporta y no se les atribuyen a otras filas.
  const fechaAprobacion = usaDatosDeEjemplo ? DETALLE.plazo.fechaAprobacion : null
  const cumplimiento = usaDatosDeEjemplo ? DETALLE.plazo.cumplimiento : 'pendiente'

  if (resumen.puesto.clasificacion === 'operativo') {
    return {
      clasificacion: 'operativo',
      duracionDiasHabiles: 10,
      origen: 'operativo-fijo',
      fechaAprobacion,
      fechaObjetivo: resumen.fechaObjetivo,
      cumplimiento,
      alerta: alertaOperativa(alerta),
    }
  }

  const duracion =
    resumen.duracionAplicable?.clasificacion === 'administrativo'
      ? resumen.duracionAplicable.diasHabiles
      : null

  if (duracion === null && resumen.fechaObjetivo === null) {
    return {
      clasificacion: 'administrativo',
      duracionDiasHabiles: null,
      origen: 'pendiente',
      fechaAprobacion: null,
      fechaObjetivo: null,
      cumplimiento: 'pendiente',
      alerta: alertaAdministrativa(alerta),
    }
  }

  return {
    clasificacion: 'administrativo',
    duracionDiasHabiles: duracion ?? PLAZO_ADMINISTRATIVO_DIAS,
    origen: 'fijado-administrativo',
    fechaAprobacion,
    fechaObjetivo: resumen.fechaObjetivo,
    cumplimiento,
    alerta: alertaAdministrativa(alerta),
  }
}

/**
 * Detalle de demo derivado de la fila abierta. Área, subárea y departamento se
 * derivan del puesto de la fila; el historial y el colaborador a reemplazar son
 * los de ejemplo de `req-1001` y solo se usan ahí: en el resto quedan vacíos en
 * vez de atribuir a la fila datos que su resumen no transporta. Remuneración,
 * ubicación y comentario siguen siendo contenido de ejemplo y el detalle no
 * reproduce reglas de negocio.
 */
export function detalleDemo(resumen: ResumenRequerimiento): DetalleRequerimiento {
  if (resumen.estado === 'borrador') {
    return {
      id: resumen.id,
      version: resumen.version,
      estado: 'borrador',
      fechaCreacion: resumen.fechaCreacion,
      historial: [],
      autorizacion: resumen.autorizacion,
      borrador: borradorVacio(),
      plazo: null,
      cobertura: null,
      remuneracionPreviaAlta: null,
      procesoSeleccion: null,
    }
  }

  if ('datos' in resumen && resumen.datos === 'parciales') {
    return {
      id: resumen.id,
      version: resumen.version,
      estado: 'cancelado',
      datos: 'parciales',
      fechaCreacion: resumen.fechaCreacion,
      historial: [],
      autorizacion: resumen.autorizacion,
      borrador: borradorVacio(),
      plazo: null,
      cobertura: null,
      remuneracionPreviaAlta: null,
      procesoSeleccion: null,
    }
  }

  const area = CATALOGOS.areas.find((item) => item.id === resumen.puesto.areaId)
  const subareaId = resumen.puesto.subareaId
  const subarea = subareaId
    ? (CATALOGOS.subareas.find((item) => item.id === subareaId) ?? null)
    : null
  const departamento = area
    ? CATALOGOS.departamentos.find((item) => item.id === area.departamentoId)
    : undefined
  const usaDatosDeEjemplo = resumen.id === DETALLE.id

  const detalleCompleto = {
    id: resumen.id,
    version: resumen.version,
    fechaCreacion: resumen.fechaCreacion,
    historial: usaDatosDeEjemplo ? DETALLE.historial : [],
    autorizacion: resumen.autorizacion,
    motivo: resumen.motivo,
    empresa: resumen.empresa,
    puesto: resumen.puesto,
    cobertura: {
      solicitadas: resumen.solicitadas,
      cubiertas: resumen.cubiertas,
      pendientes: resumen.pendientes,
      primerosDiasReales: [],
    },
    plazo: plazoDemo(resumen, usaDatosDeEjemplo),
    colaboradorAReemplazar:
      usaDatosDeEjemplo && resumen.motivo === 'reemplazo'
        ? DETALLE.colaboradorAReemplazar
        : null,
    departamento: departamento ?? DETALLE.departamento,
    area: area ?? DETALLE.area,
    subarea,
    remuneracion: DETALLE.remuneracion,
    ubicacion: DETALLE.ubicacion,
    usuarioProximaTarea: resumen.responsable ?? DETALLE.usuarioProximaTarea,
    comentario: DETALLE.comentario,
    remuneracionPreviaAlta: DETALLE.remuneracionPreviaAlta,
    procesoSeleccion: DETALLE.procesoSeleccion,
  }

  if (resumen.estado === 'cancelado') {
    return { ...detalleCompleto, estado: 'cancelado', datos: 'completos' }
  }

  return { ...detalleCompleto, estado: resumen.estado }
}
