import { describe, expect, it } from 'vitest'
import type {
  CalendarioLaboralId,
  CalendarioLaboralUnico,
  DiaSemana,
  ExcepcionCalendario,
  FechaISO,
} from '..'
import {
  calcularFechaObjetivo,
  calcularFechaVencimiento,
  calcularPlazo,
} from '..'
import type { SolicitudPlazo } from '..'

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

const excepcion = (valor: string, habil: boolean): ExcepcionCalendario => ({
  fecha: fecha(valor),
  habil,
})

const operativo = (
  fechaAprobacion: string,
  diasHabiles: number | null = null,
): SolicitudPlazo => ({
  clasificacion: 'operativo',
  diasHabiles,
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

describe('cómputo de la fecha objetivo', () => {
  it('Operativo obtiene el día hábil 10 contado desde el día 0', () => {
    const calculo = exito(calcularPlazo(operativo('2026-11-16'), calendario()))

    expect(calculo.plazo.duracionDiasHabiles).toBe(10)
    expect(calculo.plazo.fechaAprobacion).toBe('2026-11-16')
    expect(calculo.plazo.fechaObjetivo).toBe('2026-11-30')
  })

  it.each([
    ['viernes 13', '2026-11-13'],
    ['sábado 14', '2026-11-14'],
    ['domingo 15', '2026-11-15'],
  ])(
    'una aprobación el %s también empieza a contar el siguiente hábil',
    (_etiqueta, aprobacion) => {
      const calculo = exito(
        calcularPlazo(operativo(aprobacion), calendario()),
      )

      expect(calculo.plazo.fechaObjetivo).toBe('2026-11-27')
      expect(calculo.plazo.fechaVencimiento).toBe('2026-11-30')
    },
  )

  it('excluye del cómputo un día hábil por excepción', () => {
    const calculo = exito(
      calcularPlazo(
        operativo('2026-11-16'),
        calendario(LUNES_A_VIERNES, [excepcion('2026-11-17', false)]),
      ),
    )

    expect(calculo.plazo.fechaObjetivo).toBe('2026-12-01')
    expect(calculo.plazo.fechaVencimiento).toBe('2026-12-02')
  })

  it('habilita un sábado que no sería hábil por el patrón semanal', () => {
    const calculo = exito(
      calcularPlazo(
        operativo('2026-11-20'),
        calendario(LUNES_A_VIERNES, [excepcion('2026-11-21', true)]),
      ),
    )

    expect(calculo.plazo.fechaObjetivo).toBe('2026-12-03')
    expect(calculo.plazo.fechaVencimiento).toBe('2026-12-04')
  })

  it('Administrativo de 15 días hábiles', () => {
    const calculo = exito(
      calcularPlazo(administrativo('2026-11-16', 15), calendario()),
    )

    expect(calculo.plazo.duracionDiasHabiles).toBe(15)
    expect(calculo.plazo.fechaObjetivo).toBe('2026-12-07')
    expect(calculo.plazo.fechaVencimiento).toBe('2026-12-08')
  })

  it('Administrativo de 30 días hábiles', () => {
    const calculo = exito(
      calcularPlazo(administrativo('2026-11-16', 30), calendario()),
    )

    expect(calculo.plazo.duracionDiasHabiles).toBe(30)
    expect(calculo.plazo.fechaObjetivo).toBe('2026-12-28')
    expect(calculo.plazo.fechaVencimiento).toBe('2026-12-29')
  })

  it('no deriva fecha sin aprobación ni con una fecha inválida', () => {
    const sinAprobacion = fallo(
      calcularFechaObjetivo(
        { clasificacion: 'operativo', diasHabiles: null, fechaAprobacion: null },
        calendario(),
      ),
    )
    const aprobacionInvalida = fallo(
      calcularFechaObjetivo(
        operativo('2026-02-30'),
        calendario(),
      ),
    )

    expect(sinAprobacion.error.motivo).toBe('aprobacion-ausente')
    expect(aprobacionInvalida.error.motivo).toBe('fecha-aprobacion-invalida')
  })

  it('falla de forma explícita si el calendario no tiene días hábiles', () => {
    const sinCalendario = fallo(
      calcularFechaObjetivo(operativo('2026-11-16'), calendario([])),
    )
    const planSinCalendario = fallo(
      calcularPlazo(operativo('2026-11-16'), calendario([])),
    )

    expect(sinCalendario.error.motivo).toBe('calendario-sin-dias-habiles')
    expect(planSinCalendario.error.motivo).toBe('calendario-sin-dias-habiles')
  })
})

describe('umbrales de alerta', () => {
  it('Operativo usa días fijos 5, 7 y 9', () => {
    const calculo = exito(calcularPlazo(operativo('2026-11-16'), calendario()))

    expect(calculo.plazo.umbrales.map((umbral) => umbral.diaHabil)).toEqual([
      5, 7, 9,
    ])
    expect(calculo.plazo.umbrales.map((umbral) => umbral.fecha)).toEqual([
      '2026-11-23',
      '2026-11-25',
      '2026-11-27',
    ])
  })

  it('Operativo ignora el plazo administrativo que llegue en la solicitud', () => {
    const conPlazoAjeno = exito(
      calcularPlazo(operativo('2026-11-16', 99), calendario()),
    )
    const sinPlazo = exito(
      calcularPlazo(operativo('2026-11-16', null), calendario()),
    )

    expect(conPlazoAjeno.plazo.duracionDiasHabiles).toBe(10)
    expect(conPlazoAjeno.plazo.fechaObjetivo).toBe('2026-11-30')
    expect(sinPlazo.plazo.duracionDiasHabiles).toBe(10)
  })

  it('Administrativo de 17 redondea hacia arriba: días 9, 13 y 16', () => {
    const calculo = exito(
      calcularPlazo(administrativo('2026-11-16', 17), calendario()),
    )

    expect(calculo.plazo.umbrales.map((umbral) => umbral.diaHabil)).toEqual([
      9, 13, 16,
    ])
    expect(calculo.plazo.umbrales.map((umbral) => umbral.fecha)).toEqual([
      '2026-11-27',
      '2026-12-03',
      '2026-12-08',
    ])
    expect(calculo.plazo.fechaObjetivo).toBe('2026-12-09')
  })

  it('Administrativo de 15 redondea 7.5, 11.25 y 13.5 a 8, 12 y 14', () => {
    const calculo = exito(
      calcularPlazo(administrativo('2026-11-16', 15), calendario()),
    )

    expect(calculo.plazo.umbrales.map((umbral) => umbral.diaHabil)).toEqual([
      8, 12, 14,
    ])
  })

  it('Administrativo de 30 redondea 15, 22.5 y 27 a 15, 23 y 27', () => {
    const calculo = exito(
      calcularPlazo(administrativo('2026-11-16', 30), calendario()),
    )

    expect(calculo.plazo.umbrales.map((umbral) => umbral.diaHabil)).toEqual([
      15, 23, 27,
    ])
    expect(calculo.plazo.umbrales.map((umbral) => umbral.fecha)).toEqual([
      '2026-12-07',
      '2026-12-17',
      '2026-12-23',
    ])
  })

  it.each([15, 30])('acepta el límite administrativo %i', (dias) => {
    const calculo = exito(
      calcularPlazo(administrativo('2026-11-16', dias), calendario()),
    )

    expect(calculo.plazo.duracionDiasHabiles).toBe(dias)
  })

  it('acepta `diasHabiles` tipado como number dentro del rango', () => {
    const diasHabiles: number = 17
    const calculo = exito(
      calcularPlazo(
        { clasificacion: 'administrativo', diasHabiles, fechaAprobacion: fecha('2026-11-16') },
        calendario(),
      ),
    )

    expect(calculo.plazo.duracionDiasHabiles).toBe(17)
    expect(calculo.plazo.fechaObjetivo).toBe('2026-12-09')
  })

  it.each([14, 31, 14.5, 0, -1, Number.NaN, 15.0001])(
    'rechaza el plazo administrativo %s fuera del rango 15–30',
    (dias) => {
      const resultado = fallo(
        calcularPlazo(administrativo('2026-11-16', dias), calendario()),
      )

      expect(resultado.error.motivo).toBe(
        'plazo-administrativo-fuera-de-rango',
      )
      expect(resultado.error.mensaje).toContain('entre 15 y 30')
    },
  )

  it('distingue el plazo administrativo no definido del fuera de rango', () => {
    const resultado = fallo(
      calcularPlazo(administrativo('2026-11-16', null), calendario()),
    )

    expect(resultado.error.motivo).toBe('plazo-administrativo-no-definido')
  })
})

describe('vencimiento del plazo', () => {
  it('empieza al iniciar el siguiente día computable, no en la fecha objetivo', () => {
    const calculo = exito(calcularPlazo(operativo('2026-11-16'), calendario()))
    const vencimiento = exito(
      calcularFechaVencimiento(calculo.plazo.fechaObjetivo, calendario()),
    )

    expect(calculo.plazo.fechaObjetivo).toBe('2026-11-30')
    expect(vencimiento.fechaVencimiento).toBe('2026-12-01')
  })

  it('salta el fin de semana posterior a la fecha objetivo', () => {
    const calculo = exito(calcularPlazo(operativo('2026-11-13'), calendario()))

    expect(calculo.plazo.fechaObjetivo).toBe('2026-11-27')
    expect(calculo.plazo.fechaVencimiento).toBe('2026-11-30')
  })

  it('respeta las excepciones al buscar el siguiente día computable', () => {
    const sabadoHabilitado = exito(
      calcularFechaVencimiento(
        fecha('2026-11-20'),
        calendario(LUNES_A_VIERNES, [excepcion('2026-11-21', true)]),
      ),
    )
    const lunesExcluido = exito(
      calcularFechaVencimiento(
        fecha('2026-11-20'),
        calendario(LUNES_A_VIERNES, [excepcion('2026-11-23', false)]),
      ),
    )

    expect(sabadoHabilitado.fechaVencimiento).toBe('2026-11-21')
    expect(lunesExcluido.fechaVencimiento).toBe('2026-11-24')
  })

  it('rechaza una fecha objetivo inválida o sin día computable posterior', () => {
    const invalida = fallo(
      calcularFechaVencimiento(fecha('2026-02-30'), calendario()),
    )
    const sinSiguiente = fallo(
      calcularFechaVencimiento(
        fecha('2026-11-30'),
        calendario([], [excepcion('2026-11-30', true)]),
      ),
    )

    expect(invalida.error.motivo).toBe('fecha-objetivo-invalida')
    expect(sinSiguiente.error.motivo).toBe('vencimiento-no-calculable')
  })
})
