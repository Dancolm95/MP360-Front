import { describe, expect, it } from 'vitest'
import type {
  CalendarioLaboralId,
  CalendarioLaboralUnico,
  DiaSemana,
  ExcepcionCalendario,
  FechaISO,
} from '..'
import { esDiaHabil, siguienteDiaHabil, sumarDiasHabiles } from './calendario'

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

describe('calendario laboral único', () => {
  it('reconoce el patrón semanal y rechaza fechas inválidas', () => {
    const laboral = calendario()

    expect(esDiaHabil(fecha('2026-11-16'), laboral)).toBe(true)
    expect(esDiaHabil(fecha('2026-11-21'), laboral)).toBe(false)
    expect(esDiaHabil(fecha('2026-11-22'), laboral)).toBe(false)
    expect(esDiaHabil(fecha('2026-02-30'), laboral)).toBe(false)
  })

  it('excluye un día hábil y habilita un día no laborable con excepciones', () => {
    const excluyeMartes = calendario(LUNES_A_VIERNES, [
      excepcion('2026-11-17', false),
    ])
    const habilitaSabado = calendario(LUNES_A_VIERNES, [
      excepcion('2026-11-21', true),
    ])

    expect(esDiaHabil(fecha('2026-11-17'), excluyeMartes)).toBe(false)
    expect(esDiaHabil(fecha('2026-11-21'), habilitaSabado)).toBe(true)
  })

  it('encuentra el siguiente día hábil respetando semana y excepciones', () => {
    expect(siguienteDiaHabil(fecha('2026-11-20'), calendario())).toBe(
      '2026-11-23',
    )
    expect(siguienteDiaHabil(fecha('2026-11-21'), calendario())).toBe(
      '2026-11-23',
    )
    expect(
      siguienteDiaHabil(
        fecha('2026-11-20'),
        calendario(LUNES_A_VIERNES, [excepcion('2026-11-21', true)]),
      ),
    ).toBe('2026-11-21')
    expect(
      siguienteDiaHabil(
        fecha('2026-11-16'),
        calendario(LUNES_A_VIERNES, [excepcion('2026-11-17', false)]),
      ),
    ).toBe('2026-11-18')
  })

  it('no se rinde ante exclusiones consecutivas de un patrón semanal disperso', () => {
    const soloLunes = calendario(['lunes'], [
      excepcion('2026-11-02', false),
      excepcion('2026-11-09', false),
      excepcion('2026-11-16', false),
      excepcion('2026-11-23', false),
    ])

    expect(siguienteDiaHabil(fecha('2026-11-01'), soloLunes)).toBe(
      '2026-11-30',
    )
  })

  it('devuelve null cuando el calendario no tiene ningún día hábil', () => {
    expect(siguienteDiaHabil(fecha('2026-11-16'), calendario([]))).toBeNull()
    expect(sumarDiasHabiles(fecha('2026-11-16'), 1, calendario([]))).toBeNull()
  })

  it('sin patrón semanal solo usa las excepciones habilitadas', () => {
    const soloUnaExcepcion = calendario([], [excepcion('2026-11-21', true)])

    expect(siguienteDiaHabil(fecha('2026-11-20'), soloUnaExcepcion)).toBe(
      '2026-11-21',
    )
    expect(siguienteDiaHabil(fecha('2026-11-21'), soloUnaExcepcion)).toBeNull()
  })

  it('suma días hábiles estrictamente posteriores al día 0', () => {
    expect(sumarDiasHabiles(fecha('2026-11-16'), 10, calendario())).toBe(
      '2026-11-30',
    )
    expect(sumarDiasHabiles(fecha('2026-11-13'), 10, calendario())).toBe(
      '2026-11-27',
    )
    expect(sumarDiasHabiles(fecha('2026-11-14'), 10, calendario())).toBe(
      '2026-11-27',
    )
    expect(sumarDiasHabiles(fecha('2026-11-15'), 10, calendario())).toBe(
      '2026-11-27',
    )
  })

  it('el día 0 conserva la fecha base aunque no sea hábil', () => {
    expect(sumarDiasHabiles(fecha('2026-11-14'), 0, calendario())).toBe(
      '2026-11-14',
    )
  })

  it('el día 1 es el siguiente hábil si la aprobación cae en fin de semana', () => {
    expect(sumarDiasHabiles(fecha('2026-11-14'), 1, calendario())).toBe(
      '2026-11-16',
    )
    expect(sumarDiasHabiles(fecha('2026-11-15'), 1, calendario())).toBe(
      '2026-11-16',
    )
  })

  it('acumula exclusiones y habilitaciones en la secuencia', () => {
    expect(
      sumarDiasHabiles(
        fecha('2026-11-16'),
        10,
        calendario(LUNES_A_VIERNES, [excepcion('2026-11-17', false)]),
      ),
    ).toBe('2026-12-01')

    expect(
      sumarDiasHabiles(
        fecha('2026-11-20'),
        10,
        calendario(LUNES_A_VIERNES, [excepcion('2026-11-21', true)]),
      ),
    ).toBe('2026-12-03')
  })

  it('rechaza cantidades no enteras, negativas o fechas inválidas', () => {
    expect(sumarDiasHabiles(fecha('2026-11-16'), -1, calendario())).toBeNull()
    expect(sumarDiasHabiles(fecha('2026-11-16'), 1.5, calendario())).toBeNull()
    expect(sumarDiasHabiles(fecha('2026-02-30'), 1, calendario())).toBeNull()
    expect(siguienteDiaHabil(fecha('2026-13-01'), calendario())).toBeNull()
  })
})
