import { describe, expect, it } from 'vitest'
import type {
  AlertaEvaluada,
  CalendarioLaboralId,
  CalendarioLaboralUnico,
  DiaSemana,
  EvaluacionPlazo,
  ExcepcionCalendario,
  FechaISO,
  SolicitudPlazo,
  UmbralCalculado,
} from '..'
import {
  CUMPLIMIENTO_PLAZO_ETIQUETAS,
  NIVEL_ALERTA_ETIQUETAS,
  evaluarPlazo,
  seleccionarAlertaVigente,
} from '..'

const LUNES_A_VIERNES: readonly DiaSemana[] = [
  'lunes',
  'martes',
  'miercoles',
  'jueves',
  'viernes',
]

const fecha = (valor: string): FechaISO => valor as FechaISO

const calendario = (
  diasHabiles: readonly DiaSemana[] = LUNES_A_VIERNES,
  excepciones: readonly ExcepcionCalendario[] = [],
): CalendarioLaboralUnico => ({
  id: 'calendario-erp' as CalendarioLaboralId,
  diasHabiles,
  excepciones,
})

const operativo = (fechaAprobacion: string): SolicitudPlazo => ({
  clasificacion: 'operativo',
  diasHabiles: null,
  fechaAprobacion: fecha(fechaAprobacion),
})

const administrativo = (
  fechaAprobacion: string,
  diasHabiles: number | null,
): SolicitudPlazo => ({
  clasificacion: 'administrativo',
  diasHabiles,
  fechaAprobacion: fecha(fechaAprobacion),
})

type ResultadoConOk = { readonly ok: boolean }

function exito<T extends ResultadoConOk>(resultado: T): Extract<T, { ok: true }> {
  if (!resultado.ok) {
    throw new Error(`Se esperaba éxito: ${JSON.stringify(resultado)}`)
  }
  return resultado as Extract<T, { ok: true }>
}

function fallo<T extends ResultadoConOk>(resultado: T): Extract<T, { ok: false }> {
  if (resultado.ok) {
    throw new Error(`Se esperaba error: ${JSON.stringify(resultado)}`)
  }
  return resultado as Extract<T, { ok: false }>
}

function evaluar(
  solicitud: SolicitudPlazo,
  fechaEvaluacion: string,
): EvaluacionPlazo {
  return exito(
    evaluarPlazo(solicitud, fecha(fechaEvaluacion), calendario()),
  ).evaluacion
}

function alertaDe(evaluacion: EvaluacionPlazo): AlertaEvaluada {
  if (evaluacion.alerta === null) throw new Error('Se esperaba una alerta')
  return evaluacion.alerta
}

describe('evaluación del plazo en una fecha dada', () => {
  it('antes de la aprobación está pendiente y sin alerta', () => {
    const evaluacion = evaluar(operativo('2026-11-16'), '2026-11-15')

    expect(evaluacion.cumplimiento).toBe('pendiente')
    expect(evaluacion.cumplimientoEtiqueta).toBe('Pendiente')
    expect(evaluacion.alerta).toBeNull()
    expect(evaluacion.vencimiento.vencido).toBe(false)
    expect(evaluacion.vencimiento.etiqueta).toBe('No iniciado')
    expect(evaluacion.texto).toContain('Pendiente')
  })

  it('el día 0 está en plazo y todavía no tiene alerta', () => {
    const evaluacion = evaluar(operativo('2026-11-16'), '2026-11-16')

    expect(evaluacion.cumplimiento).toBe('en-plazo')
    expect(evaluacion.cumplimientoEtiqueta).toBe('En plazo')
    expect(evaluacion.alerta).toBeNull()
    expect(evaluacion.fechaObjetivo).toBe('2026-11-30')
    expect(evaluacion.vencimiento.fecha).toBe('2026-12-01')
    expect(evaluacion.vencimiento.vencido).toBe(false)
  })

  it('la alerta temprana aparece exactamente en el día hábil 5', () => {
    const antes = evaluar(operativo('2026-11-16'), '2026-11-20')
    const exacto = evaluar(operativo('2026-11-16'), '2026-11-23')
    const alerta = alertaDe(exacto)

    expect(antes.alerta).toBeNull()
    expect(alerta.nivel).toBe('temprana')
    expect(alerta.nivelEtiqueta).toBe('Alerta temprana')
    expect(alerta.diaHabil).toBe(5)
    expect(alerta.fecha).toBe('2026-11-23')
    expect(alerta.umbralTexto).toBe('Día hábil 5')
    expect(alerta.texto).toBe('Alerta temprana: día hábil 5 de 10.')
    expect(exacto.vencimiento.vencido).toBe(false)
  })

  it('la alerta media aparece exactamente en el día hábil 7', () => {
    const dia6 = evaluar(operativo('2026-11-16'), '2026-11-24')
    const dia7 = evaluar(operativo('2026-11-16'), '2026-11-25')

    expect(alertaDe(dia6).nivel).toBe('temprana')
    expect(alertaDe(dia7).nivel).toBe('media')
    expect(alertaDe(dia7).diaHabil).toBe(7)
    expect(alertaDe(dia7).texto).toBe('Alerta media: día hábil 7 de 10.')
  })

  it('la alerta crítica aparece exactamente en el día hábil 9', () => {
    const dia8 = evaluar(operativo('2026-11-16'), '2026-11-26')
    const dia9 = evaluar(operativo('2026-11-16'), '2026-11-27')

    expect(alertaDe(dia8).nivel).toBe('media')
    expect(alertaDe(dia9).nivel).toBe('critica')
    expect(alertaDe(dia9).diaHabil).toBe(9)
    expect(alertaDe(dia9).texto).toBe('Alerta crítica: día hábil 9 de 10.')
    expect(dia9.vencimiento.vencido).toBe(false)
  })

  it('la fecha objetivo sigue en plazo y la alerta no es vencimiento', () => {
    const objetivo = evaluar(operativo('2026-11-16'), '2026-11-30')
    const alerta = alertaDe(objetivo)

    expect(objetivo.cumplimiento).toBe('en-plazo')
    expect(objetivo.cumplimientoEtiqueta).toBe('En plazo')
    expect(alerta.nivel).toBe('critica')
    expect(objetivo.vencimiento.vencido).toBe(false)
    expect(objetivo.vencimiento.etiqueta).toBe('No vencido')
    expect(objetivo.vencimiento.fecha).toBe('2026-12-01')
    expect(objetivo.vencimiento.texto).toContain('no ha vencido')
    expect(objetivo.texto).toContain('sigue en plazo')
  })

  it('el incumplimiento empieza al iniciar el siguiente día computable', () => {
    const vencido = evaluar(operativo('2026-11-16'), '2026-12-01')
    const posterior = evaluar(operativo('2026-11-16'), '2026-12-02')

    expect(vencido.cumplimiento).toBe('incumplido')
    expect(vencido.cumplimientoEtiqueta).toBe('Incumplido')
    expect(vencido.vencimiento.vencido).toBe(true)
    expect(vencido.vencimiento.etiqueta).toBe('Vencido')
    expect(vencido.vencimiento.fecha).toBe('2026-12-01')
    expect(vencido.vencimiento.texto).toContain('venció')
    expect(vencido.texto).toContain('Incumplido')
    expect(vencido.alerta?.nivel).toBe('critica')
    expect(posterior.cumplimiento).toBe('incumplido')
  })

  it('no vence durante el fin de semana posterior a la fecha objetivo', () => {
    const sabado = evaluar(operativo('2026-11-13'), '2026-11-28')
    const lunes = evaluar(operativo('2026-11-13'), '2026-11-30')

    expect(sabado.fechaObjetivo).toBe('2026-11-27')
    expect(sabado.cumplimiento).toBe('en-plazo')
    expect(sabado.vencimiento.vencido).toBe(false)
    expect(sabado.vencimiento.fecha).toBe('2026-11-30')
    expect(alertaDe(sabado).nivel).toBe('critica')

    expect(lunes.cumplimiento).toBe('incumplido')
    expect(lunes.vencimiento.vencido).toBe(true)
  })

  it('Administrativo de 17 alcanza 9, 13 y 16 y no vence hasta el día 18', () => {
    const casos: readonly (readonly [string, string | null])[] = [
      ['2026-11-26', null],
      ['2026-11-27', 'temprana'],
      ['2026-12-02', 'temprana'],
      ['2026-12-03', 'media'],
      ['2026-12-07', 'media'],
      ['2026-12-08', 'critica'],
      ['2026-12-09', 'critica'],
    ]

    for (const [fechaEvaluacion, nivel] of casos) {
      const evaluacion = evaluar(
        administrativo('2026-11-16', 17),
        fechaEvaluacion,
      )
      expect(evaluacion.alerta?.nivel ?? null).toBe(nivel)
      expect(evaluacion.cumplimiento).toBe('en-plazo')
      expect(evaluacion.vencimiento.vencido).toBe(false)
    }

    expect(alertaDe(evaluar(administrativo('2026-11-16', 17), '2026-11-27')).diaHabil).toBe(9)
    expect(alertaDe(evaluar(administrativo('2026-11-16', 17), '2026-12-03')).diaHabil).toBe(13)
    expect(alertaDe(evaluar(administrativo('2026-11-16', 17), '2026-12-08')).diaHabil).toBe(16)
    expect(
      evaluar(administrativo('2026-11-16', 17), '2026-12-09').fechaObjetivo,
    ).toBe('2026-12-09')
    expect(
      evaluar(administrativo('2026-11-16', 17), '2026-12-10').cumplimiento,
    ).toBe('incumplido')
  })

  it('comunica el porcentaje en texto además del nivel', () => {
    const temprana = alertaDe(
      evaluar(administrativo('2026-11-16', 17), '2026-11-27'),
    )
    const media = alertaDe(
      evaluar(administrativo('2026-11-16', 17), '2026-12-03'),
    )
    const critica = alertaDe(
      evaluar(administrativo('2026-11-16', 17), '2026-12-08'),
    )

    expect(temprana.umbralTexto).toBe('50 % del plazo')
    expect(temprana.texto).toBe(
      'Alerta temprana: 50 % del plazo (día hábil 9 de 17).',
    )
    expect(media.texto).toBe('Alerta media: 75 % del plazo (día hábil 13 de 17).')
    expect(critica.texto).toBe(
      'Alerta crítica: 90 % del plazo (día hábil 16 de 17).',
    )
  })

  it('sin aprobación no hay fecha objetivo ni alerta', () => {
    const evaluacion = evaluar(
      {
        clasificacion: 'administrativo',
        diasHabiles: null,
        fechaAprobacion: null,
      },
      '2026-11-16',
    )

    expect(evaluacion.cumplimiento).toBe('pendiente')
    expect(evaluacion.fechaAprobacion).toBeNull()
    expect(evaluacion.fechaObjetivo).toBeNull()
    expect(evaluacion.duracionDiasHabiles).toBeNull()
    expect(evaluacion.alerta).toBeNull()
    expect(evaluacion.vencimiento.fecha).toBeNull()
    expect(evaluacion.vencimiento.etiqueta).toBe('No iniciado')
    expect(evaluacion.texto).toContain('Pendiente')
  })

  it('rechaza un Administrativo aprobado sin plazo válido', () => {
    const resultado = fallo(
      evaluarPlazo(
        administrativo('2026-11-16', null),
        fecha('2026-11-20'),
        calendario(),
      ),
    )

    expect(resultado.error.motivo).toBe('plazo-administrativo-no-definido')
  })

  it('rechaza un Administrativo aprobado con plazo fuera de rango', () => {
    const resultado = fallo(
      evaluarPlazo(
        administrativo('2026-11-16', 14),
        fecha('2026-11-20'),
        calendario(),
      ),
    )

    expect(resultado.error.motivo).toBe('plazo-administrativo-fuera-de-rango')
  })

  it('propaga el calendario sin días hábiles', () => {
    const resultado = fallo(
      evaluarPlazo(operativo('2026-11-16'), fecha('2026-11-20'), calendario([])),
    )

    expect(resultado.error.motivo).toBe('calendario-sin-dias-habiles')
  })

  it('rechaza una fecha de evaluación inválida', () => {
    const resultado = fallo(
      evaluarPlazo(operativo('2026-11-16'), fecha('2026-02-30'), calendario()),
    )

    expect(resultado.error.motivo).toBe('fecha-evaluacion-invalida')
  })

  it('expone etiquetas de texto para alerta y cumplimiento', () => {
    expect(NIVEL_ALERTA_ETIQUETAS).toEqual({
      temprana: 'Alerta temprana',
      media: 'Alerta media',
      critica: 'Alerta crítica',
    })
    expect(CUMPLIMIENTO_PLAZO_ETIQUETAS).toEqual({
      pendiente: 'Pendiente',
      'en-plazo': 'En plazo',
      incumplido: 'Incumplido',
    })
  })
})

describe('coincidencia de umbrales', () => {
  const umbrales: readonly UmbralCalculado[] = [
    {
      nivel: 'temprana',
      umbral: {
        tipo: 'porcentaje',
        clasificacion: 'administrativo',
        porcentaje: 50,
      },
      diaHabil: 5,
      fecha: fecha('2026-11-23'),
    },
    {
      nivel: 'media',
      umbral: {
        tipo: 'porcentaje',
        clasificacion: 'administrativo',
        porcentaje: 75,
      },
      diaHabil: 5,
      fecha: fecha('2026-11-23'),
    },
    {
      nivel: 'critica',
      umbral: {
        tipo: 'porcentaje',
        clasificacion: 'administrativo',
        porcentaje: 90,
      },
      diaHabil: 9,
      fecha: fecha('2026-11-27'),
    },
  ]

  it('si dos umbrales caen el mismo día prevalece el nivel más alto', () => {
    expect(seleccionarAlertaVigente(umbrales, fecha('2026-11-22'))).toBeNull()
    expect(
      seleccionarAlertaVigente(umbrales, fecha('2026-11-23'))?.nivel,
    ).toBe('media')
    expect(
      seleccionarAlertaVigente(umbrales, fecha('2026-11-26'))?.nivel,
    ).toBe('media')
    expect(
      seleccionarAlertaVigente(umbrales, fecha('2026-11-27'))?.nivel,
    ).toBe('critica')
  })
})
