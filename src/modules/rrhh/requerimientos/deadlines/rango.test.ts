import { describe, expect, it } from 'vitest'
import {
  DIAS_HABILES_ADMINISTRATIVOS,
  derivarDuracionAplicable,
  esDiasHabilesAdministrativos,
  validarDiasHabilesAdministrativos,
} from '..'

describe('rango único del plazo administrativo', () => {
  it('declara el rango 15–30 de la spec', () => {
    expect(DIAS_HABILES_ADMINISTRATIVOS).toEqual({ minimo: 15, maximo: 30 })
  })

  it.each([15, 16, 17, 20, 29, 30])('acepta el entero %i', (dias) => {
    expect(esDiasHabilesAdministrativos(dias)).toBe(true)
  })

  it.each([
    0,
    1,
    10,
    14,
    -15,
    31,
    14.5,
    17.5,
    30.5,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    '20',
    null,
    undefined,
  ])('rechaza %j', (valor) => {
    expect(esDiasHabilesAdministrativos(valor)).toBe(false)
  })
})

describe('los consumidores comparten el mismo rango', () => {
  it.each([15, 30])('acciones valida %i igual que el rango', (dias) => {
    expect(validarDiasHabilesAdministrativos(dias)).toEqual({
      ok: true,
      diasHabiles: dias,
    })
  })

  it.each([14, 31, 17.5])(
    'acciones rechaza %s con el mensaje del rango',
    (dias) => {
      expect(validarDiasHabilesAdministrativos(dias)).toEqual({
        ok: false,
        error: {
          campo: 'plazo-administrativo',
          mensaje:
            'El plazo administrativo debe ser un entero entre 15 y 30 días hábiles.',
        },
      })
    },
  )

  it.each([15, 30])(
    'la duración aplicable del formulario acepta %i',
    (dias) => {
      expect(derivarDuracionAplicable('administrativo', dias)).toEqual({
        clasificacion: 'administrativo',
        diasHabiles: dias,
      })
    },
  )

  it.each([14, 31, 17.5])(
    'la duración aplicable del formulario descarta %s',
    (dias) => {
      expect(derivarDuracionAplicable('administrativo', dias)).toEqual({
        clasificacion: 'administrativo',
        diasHabiles: null,
      })
    },
  )
})
