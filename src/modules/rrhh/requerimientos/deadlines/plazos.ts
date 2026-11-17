import type {
  CalendarioLaboralUnico,
  Clasificacion,
  DiasHabilesAdministrativos,
  FechaISO,
  NivelAlerta,
  PorcentajeUmbral,
  UmbralAlerta,
} from '../contracts'
// `acciones` (T-RH-12) es hoy la fuente del rango 15–30; se reutiliza para no
// duplicar la regla en este módulo.
import { esDiasHabilesAdministrativos } from '../acciones/reglas'
import { DIAS_HABILES_ADMINISTRATIVOS } from '../acciones/tipos'
import {
  parsearFechaCivil,
  siguienteDiaHabil,
  sumarDiasHabiles,
} from './calendario'

export const DIAS_HABILES_OPERATIVO = 10

export type DuracionDiasHabiles = 10 | DiasHabilesAdministrativos

export interface SolicitudPlazo {
  readonly clasificacion: Clasificacion
  /** Solo se usa en Administrativo; Operativo siempre computa 10 días hábiles. */
  readonly diasHabiles: number | null
  readonly fechaAprobacion: FechaISO | null
}

export type MotivoPlazoNoCalculable =
  | 'aprobacion-ausente'
  | 'fecha-aprobacion-invalida'
  | 'plazo-administrativo-no-definido'
  | 'plazo-administrativo-fuera-de-rango'
  | 'calendario-sin-dias-habiles'
  | 'fecha-objetivo-invalida'
  | 'vencimiento-no-calculable'
  | 'fecha-evaluacion-invalida'

export interface ErrorPlazoCalculo {
  readonly motivo: MotivoPlazoNoCalculable
  readonly mensaje: string
}

export interface UmbralCalculado {
  readonly nivel: NivelAlerta
  readonly umbral: UmbralAlerta
  readonly diaHabil: number
  readonly fecha: FechaISO
}

export interface PlazoCalculado {
  readonly clasificacion: Clasificacion
  readonly duracionDiasHabiles: DuracionDiasHabiles
  readonly fechaAprobacion: FechaISO
  readonly fechaObjetivo: FechaISO
  /** Primer día computable posterior al objetivo; aquí empieza el incumplimiento. */
  readonly fechaVencimiento: FechaISO
  readonly umbrales: readonly UmbralCalculado[]
}

export type ResultadoFechaObjetivo =
  | {
      readonly ok: true
      readonly clasificacion: Clasificacion
      readonly duracionDiasHabiles: DuracionDiasHabiles
      readonly fechaAprobacion: FechaISO
      readonly fechaObjetivo: FechaISO
    }
  | { readonly ok: false; readonly error: ErrorPlazoCalculo }

export type ResultadoUmbrales =
  | { readonly ok: true; readonly umbrales: readonly UmbralCalculado[] }
  | { readonly ok: false; readonly error: ErrorPlazoCalculo }

export type ResultadoVencimiento =
  | { readonly ok: true; readonly fechaVencimiento: FechaISO }
  | { readonly ok: false; readonly error: ErrorPlazoCalculo }

export type ResultadoCalculoPlazo =
  | { readonly ok: true; readonly plazo: PlazoCalculado }
  | { readonly ok: false; readonly error: ErrorPlazoCalculo }

interface DefinicionUmbral {
  readonly nivel: NivelAlerta
  readonly umbral: UmbralAlerta
  readonly diaHabil: number
}

const UMBRALES_OPERATIVO: readonly DefinicionUmbral[] = [
  {
    nivel: 'temprana',
    umbral: { tipo: 'dias-fijos', clasificacion: 'operativo', diaHabil: 5 },
    diaHabil: 5,
  },
  {
    nivel: 'media',
    umbral: { tipo: 'dias-fijos', clasificacion: 'operativo', diaHabil: 7 },
    diaHabil: 7,
  },
  {
    nivel: 'critica',
    umbral: { tipo: 'dias-fijos', clasificacion: 'operativo', diaHabil: 9 },
    diaHabil: 9,
  },
]

const PORCENTAJES_ADMINISTRATIVOS: readonly {
  readonly nivel: NivelAlerta
  readonly porcentaje: PorcentajeUmbral
}[] = [
  { nivel: 'temprana', porcentaje: 50 },
  { nivel: 'media', porcentaje: 75 },
  { nivel: 'critica', porcentaje: 90 },
]

interface DuracionResuelta {
  readonly clasificacion: Clasificacion
  readonly duracionDiasHabiles: DuracionDiasHabiles
}

type ResultadoDuracion =
  | { readonly ok: true; readonly duracion: DuracionResuelta }
  | { readonly ok: false; readonly error: ErrorPlazoCalculo }

type ResultadoFechaAprobacion =
  | { readonly ok: true; readonly fecha: FechaISO }
  | { readonly ok: false; readonly error: ErrorPlazoCalculo }

function resolverDuracion(solicitud: SolicitudPlazo): ResultadoDuracion {
  if (solicitud.clasificacion === 'operativo') {
    return {
      ok: true,
      duracion: {
        clasificacion: 'operativo',
        duracionDiasHabiles: DIAS_HABILES_OPERATIVO,
      },
    }
  }

  if (solicitud.diasHabiles === null) {
    return {
      ok: false,
      error: {
        motivo: 'plazo-administrativo-no-definido',
        mensaje: 'El plazo administrativo debe fijarse antes de aprobar.',
      },
    }
  }

  if (!esDiasHabilesAdministrativos(solicitud.diasHabiles)) {
    return {
      ok: false,
      error: {
        motivo: 'plazo-administrativo-fuera-de-rango',
        mensaje: `El plazo administrativo debe ser un entero entre ${DIAS_HABILES_ADMINISTRATIVOS.minimo} y ${DIAS_HABILES_ADMINISTRATIVOS.maximo} días hábiles.`,
      },
    }
  }

  return {
    ok: true,
    duracion: {
      clasificacion: 'administrativo',
      duracionDiasHabiles: solicitud.diasHabiles,
    },
  }
}

function resolverFechaAprobacion(
  solicitud: SolicitudPlazo,
): ResultadoFechaAprobacion {
  if (solicitud.fechaAprobacion === null) {
    return {
      ok: false,
      error: {
        motivo: 'aprobacion-ausente',
        mensaje: 'El plazo se calcula solo cuando existe una fecha de aprobación.',
      },
    }
  }

  const aprobacion = parsearFechaCivil(solicitud.fechaAprobacion)
  if (aprobacion === null) {
    return {
      ok: false,
      error: {
        motivo: 'fecha-aprobacion-invalida',
        mensaje: 'La fecha de aprobación no es una fecha válida.',
      },
    }
  }

  return { ok: true, fecha: aprobacion.texto }
}

export function calcularFechaObjetivo(
  solicitud: SolicitudPlazo,
  calendario: CalendarioLaboralUnico,
): ResultadoFechaObjetivo {
  const duracion = resolverDuracion(solicitud)
  if (!duracion.ok) return duracion

  const aprobacion = resolverFechaAprobacion(solicitud)
  if (!aprobacion.ok) return aprobacion

  const fechaObjetivo = sumarDiasHabiles(
    aprobacion.fecha,
    duracion.duracion.duracionDiasHabiles,
    calendario,
  )
  if (fechaObjetivo === null) {
    return {
      ok: false,
      error: {
        motivo: 'calendario-sin-dias-habiles',
        mensaje:
          'El calendario laboral no tiene días hábiles suficientes para computar el plazo.',
      },
    }
  }

  return {
    ok: true,
    clasificacion: duracion.duracion.clasificacion,
    duracionDiasHabiles: duracion.duracion.duracionDiasHabiles,
    fechaAprobacion: aprobacion.fecha,
    fechaObjetivo,
  }
}

export function calcularFechaVencimiento(
  fechaObjetivo: FechaISO,
  calendario: CalendarioLaboralUnico,
): ResultadoVencimiento {
  const objetivo = parsearFechaCivil(fechaObjetivo)
  if (objetivo === null) {
    return {
      ok: false,
      error: {
        motivo: 'fecha-objetivo-invalida',
        mensaje: 'La fecha objetivo no es una fecha válida.',
      },
    }
  }

  const fechaVencimiento = siguienteDiaHabil(objetivo.texto, calendario)
  if (fechaVencimiento === null) {
    return {
      ok: false,
      error: {
        motivo: 'vencimiento-no-calculable',
        mensaje:
          'No hay un día computable posterior a la fecha objetivo en el calendario.',
      },
    }
  }

  return { ok: true, fechaVencimiento }
}

export function calcularUmbrales(
  solicitud: SolicitudPlazo,
  calendario: CalendarioLaboralUnico,
): ResultadoUmbrales {
  const duracion = resolverDuracion(solicitud)
  if (!duracion.ok) return duracion

  const aprobacion = resolverFechaAprobacion(solicitud)
  if (!aprobacion.ok) return aprobacion

  const definiciones: readonly DefinicionUmbral[] =
    duracion.duracion.clasificacion === 'operativo'
      ? UMBRALES_OPERATIVO
      : PORCENTAJES_ADMINISTRATIVOS.map(({ nivel, porcentaje }) => ({
          nivel,
          umbral: {
            tipo: 'porcentaje',
            clasificacion: 'administrativo',
            porcentaje,
          },
          // Spec §5.2: el día umbral se redondea hacia arriba.
          diaHabil: Math.ceil(
            (duracion.duracion.duracionDiasHabiles * porcentaje) / 100,
          ),
        }))

  const umbrales: UmbralCalculado[] = []
  for (const definicion of definiciones) {
    const fecha = sumarDiasHabiles(
      aprobacion.fecha,
      definicion.diaHabil,
      calendario,
    )
    if (fecha === null) {
      return {
        ok: false,
        error: {
          motivo: 'calendario-sin-dias-habiles',
          mensaje:
            'El calendario laboral no tiene días hábiles suficientes para computar los umbrales.',
        },
      }
    }
    umbrales.push({
      nivel: definicion.nivel,
      umbral: definicion.umbral,
      diaHabil: definicion.diaHabil,
      fecha,
    })
  }

  return { ok: true, umbrales }
}

export function calcularPlazo(
  solicitud: SolicitudPlazo,
  calendario: CalendarioLaboralUnico,
): ResultadoCalculoPlazo {
  const objetivo = calcularFechaObjetivo(solicitud, calendario)
  if (!objetivo.ok) return objetivo

  const vencimiento = calcularFechaVencimiento(objetivo.fechaObjetivo, calendario)
  if (!vencimiento.ok) return vencimiento

  const umbrales = calcularUmbrales(solicitud, calendario)
  if (!umbrales.ok) return umbrales

  return {
    ok: true,
    plazo: {
      clasificacion: objetivo.clasificacion,
      duracionDiasHabiles: objetivo.duracionDiasHabiles,
      fechaAprobacion: objetivo.fechaAprobacion,
      fechaObjetivo: objetivo.fechaObjetivo,
      fechaVencimiento: vencimiento.fechaVencimiento,
      umbrales: umbrales.umbrales,
    },
  }
}
