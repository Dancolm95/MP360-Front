import type {
  CalendarioLaboralUnico,
  Clasificacion,
  CumplimientoPlazo,
  FechaISO,
  NivelAlerta,
  UmbralAlerta,
} from '../contracts'
import { parsearFechaCivil } from './calendario'
import type {
  DuracionDiasHabiles,
  ErrorPlazoCalculo,
  SolicitudPlazo,
  UmbralCalculado,
} from './plazos'
import { calcularPlazo } from './plazos'

export const NIVEL_ALERTA_ETIQUETAS: Readonly<Record<NivelAlerta, string>> = {
  temprana: 'Alerta temprana',
  media: 'Alerta media',
  critica: 'Alerta crítica',
}

export const CUMPLIMIENTO_PLAZO_ETIQUETAS: Readonly<
  Record<CumplimientoPlazo, string>
> = {
  pendiente: 'Pendiente',
  'en-plazo': 'En plazo',
  incumplido: 'Incumplido',
}

export interface AlertaEvaluada {
  readonly nivel: NivelAlerta
  readonly nivelEtiqueta: string
  readonly umbral: UmbralAlerta
  readonly umbralTexto: string
  readonly diaHabil: number
  readonly fecha: FechaISO
  readonly texto: string
}

export interface VencimientoEvaluado {
  readonly vencido: boolean
  readonly etiqueta: string
  readonly texto: string
  /** Primer día computable posterior al objetivo; `null` sin plazo calculado. */
  readonly fecha: FechaISO | null
}

export interface EvaluacionPlazo {
  readonly clasificacion: Clasificacion
  readonly fechaEvaluacion: FechaISO
  readonly fechaAprobacion: FechaISO | null
  readonly fechaObjetivo: FechaISO | null
  readonly duracionDiasHabiles: DuracionDiasHabiles | null
  readonly cumplimiento: CumplimientoPlazo
  readonly cumplimientoEtiqueta: string
  readonly alerta: AlertaEvaluada | null
  readonly vencimiento: VencimientoEvaluado
  /** Resumen textual; nunca depende del color. */
  readonly texto: string
}

export type ResultadoEvaluacionPlazo =
  | { readonly ok: true; readonly evaluacion: EvaluacionPlazo }
  | { readonly ok: false; readonly error: ErrorPlazoCalculo }

const ORDEN_NIVEL: Readonly<Record<NivelAlerta, number>> = {
  temprana: 1,
  media: 2,
  critica: 3,
}

/**
 * Alerta vigente en la fecha evaluada. Si dos umbrales caen el mismo día,
 * prevalece el nivel más alto; nunca se emiten dos alertas simultáneas.
 */
export function seleccionarAlertaVigente(
  umbrales: readonly UmbralCalculado[],
  fechaEvaluacion: FechaISO,
): UmbralCalculado | null {
  const evaluacion = parsearFechaCivil(fechaEvaluacion)
  if (evaluacion === null) return null

  let vigente: UmbralCalculado | null = null
  for (const umbral of umbrales) {
    const fecha = parsearFechaCivil(umbral.fecha)
    if (fecha === null || fecha.tiempo > evaluacion.tiempo) continue
    if (
      vigente === null ||
      ORDEN_NIVEL[umbral.nivel] >= ORDEN_NIVEL[vigente.nivel]
    ) {
      vigente = umbral
    }
  }
  return vigente
}

function textoUmbral(umbral: UmbralAlerta): string {
  return umbral.tipo === 'dias-fijos'
    ? `Día hábil ${umbral.diaHabil}`
    : `${umbral.porcentaje} % del plazo`
}

function crearAlerta(
  umbral: UmbralCalculado,
  duracionDiasHabiles: DuracionDiasHabiles,
): AlertaEvaluada {
  const nivelEtiqueta = NIVEL_ALERTA_ETIQUETAS[umbral.nivel]
  return {
    nivel: umbral.nivel,
    nivelEtiqueta,
    umbral: umbral.umbral,
    umbralTexto: textoUmbral(umbral.umbral),
    diaHabil: umbral.diaHabil,
    fecha: umbral.fecha,
    texto:
      umbral.umbral.tipo === 'dias-fijos'
        ? `${nivelEtiqueta}: día hábil ${umbral.diaHabil} de ${duracionDiasHabiles}.`
        : `${nivelEtiqueta}: ${umbral.umbral.porcentaje} % del plazo (día hábil ${umbral.diaHabil} de ${duracionDiasHabiles}).`,
  }
}

function textoEvaluacion(
  cumplimiento: CumplimientoPlazo,
  alerta: AlertaEvaluada | null,
): string {
  if (cumplimiento === 'pendiente') {
    return 'Pendiente: el plazo aún no ha comenzado.'
  }
  if (cumplimiento === 'incumplido') {
    return 'Incumplido: el plazo venció al iniciar el siguiente día computable.'
  }
  return alerta === null
    ? 'En plazo: aún no se alcanza ningún umbral de alerta.'
    : `${alerta.texto} El requerimiento sigue en plazo.`
}

function crearVencimiento(
  vencido: boolean,
  pendiente: boolean,
  fecha: FechaISO | null,
): VencimientoEvaluado {
  if (vencido) {
    return {
      vencido: true,
      etiqueta: 'Vencido',
      texto: 'El plazo venció al iniciar el siguiente día computable.',
      fecha,
    }
  }
  if (pendiente) {
    return {
      vencido: false,
      etiqueta: 'No iniciado',
      texto: 'El plazo aún no ha comenzado.',
      fecha,
    }
  }
  return {
    vencido: false,
    etiqueta: 'No vencido',
    texto:
      'El plazo no ha vencido; el incumplimiento comienza al iniciar el siguiente día computable.',
    fecha,
  }
}

function evaluacionPendiente(
  solicitud: SolicitudPlazo,
  fechaEvaluacion: FechaISO,
): EvaluacionPlazo {
  return {
    clasificacion: solicitud.clasificacion,
    fechaEvaluacion,
    fechaAprobacion: null,
    fechaObjetivo: null,
    duracionDiasHabiles: null,
    cumplimiento: 'pendiente',
    cumplimientoEtiqueta: CUMPLIMIENTO_PLAZO_ETIQUETAS.pendiente,
    alerta: null,
    vencimiento: crearVencimiento(false, true, null),
    texto: textoEvaluacion('pendiente', null),
  }
}

export function evaluarPlazo(
  solicitud: SolicitudPlazo,
  fechaEvaluacion: FechaISO,
  calendario: CalendarioLaboralUnico,
): ResultadoEvaluacionPlazo {
  const evaluacion = parsearFechaCivil(fechaEvaluacion)
  if (evaluacion === null) {
    return {
      ok: false,
      error: {
        motivo: 'fecha-evaluacion-invalida',
        mensaje: 'La fecha de evaluación no es una fecha válida.',
      },
    }
  }

  if (solicitud.fechaAprobacion === null) {
    return {
      ok: true,
      evaluacion: evaluacionPendiente(solicitud, evaluacion.texto),
    }
  }

  const calculo = calcularPlazo(solicitud, calendario)
  if (!calculo.ok) return calculo

  const plazo = calculo.plazo
  const aprobacion = parsearFechaCivil(plazo.fechaAprobacion)
  const objetivo = parsearFechaCivil(plazo.fechaObjetivo)
  const vencimiento = parsearFechaCivil(plazo.fechaVencimiento)
  if (aprobacion === null) {
    return {
      ok: false,
      error: {
        motivo: 'fecha-aprobacion-invalida',
        mensaje: 'La fecha de aprobación no es una fecha válida.',
      },
    }
  }
  if (objetivo === null) {
    return {
      ok: false,
      error: {
        motivo: 'fecha-objetivo-invalida',
        mensaje: 'La fecha objetivo no es una fecha válida.',
      },
    }
  }
  if (vencimiento === null) {
    return {
      ok: false,
      error: {
        motivo: 'vencimiento-no-calculable',
        mensaje:
          'No hay un día computable posterior a la fecha objetivo en el calendario.',
      },
    }
  }

  const cumplimiento: CumplimientoPlazo =
    evaluacion.tiempo < aprobacion.tiempo
      ? 'pendiente'
      : evaluacion.tiempo >= vencimiento.tiempo
        ? 'incumplido'
        : 'en-plazo'

  const umbral =
    cumplimiento === 'pendiente'
      ? null
      : seleccionarAlertaVigente(plazo.umbrales, evaluacion.texto)
  const alerta =
    umbral === null ? null : crearAlerta(umbral, plazo.duracionDiasHabiles)

  return {
    ok: true,
    evaluacion: {
      clasificacion: plazo.clasificacion,
      fechaEvaluacion: evaluacion.texto,
      fechaAprobacion: plazo.fechaAprobacion,
      fechaObjetivo: plazo.fechaObjetivo,
      duracionDiasHabiles: plazo.duracionDiasHabiles,
      cumplimiento,
      cumplimientoEtiqueta: CUMPLIMIENTO_PLAZO_ETIQUETAS[cumplimiento],
      alerta,
      vencimiento: crearVencimiento(
        cumplimiento === 'incumplido',
        cumplimiento === 'pendiente',
        plazo.fechaVencimiento,
      ),
      texto: textoEvaluacion(cumplimiento, alerta),
    },
  }
}
