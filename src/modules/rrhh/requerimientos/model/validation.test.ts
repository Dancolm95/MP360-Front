import { describe, expect, it } from 'vitest'
import type {
  AreaId,
  BorradorRequerimiento,
  ColaboradorId,
  DepartamentoId,
  DepartamentoUbicacionId,
  DistritoId,
  EmpresaId,
  ProvinciaId,
  PuestoId,
  SubareaId,
  UsuarioId,
} from '../contracts'
import {
  comprobarJerarquiaOrganizacional,
  comprobarJerarquiaUbicacion,
  derivarClasificacion,
  parsearRemuneracionPen,
  validarParaEnvio,
  validarVacantes,
} from './validation'
import type {
  ContextoValidacionFormulario,
  FormularioRequerimientoInput,
} from './types'

const id = <T>(value: string) => value as T

const empresaId = id<EmpresaId>('empresa-1')
const departamentoId = id<DepartamentoId>('departamento-1')
const areaId = id<AreaId>('area-1')
const subareaId = id<SubareaId>('subarea-1')
const puestoId = id<PuestoId>('puesto-1')
const puestoDirectoId = id<PuestoId>('puesto-directo')
const departamentoUbicacionId = id<DepartamentoUbicacionId>('ubicacion-1')
const provinciaId = id<ProvinciaId>('provincia-1')
const distritoId = id<DistritoId>('distrito-1')
const usuarioId = id<UsuarioId>('usuario-1')
const colaboradorId = id<ColaboradorId>('colaborador-1')

const context: ContextoValidacionFormulario = {
  empresas: [{ id: empresaId, nombre: 'Empresa neutral' }],
  departamentos: [{ id: departamentoId, nombre: 'Departamento neutral' }],
  areas: [{ id: areaId, nombre: 'Área neutral', departamentoId }],
  subareas: [{ id: subareaId, nombre: 'Subárea neutral', areaId }],
  puestos: [
    {
      id: puestoId,
      nombre: 'Puesto neutral',
      areaId,
      subareaId,
      clasificacion: 'administrativo',
    },
  ],
  departamentosUbicacion: [
    { id: departamentoUbicacionId, nombre: 'Ubicación neutral' },
  ],
  provincias: [
    { id: provinciaId, nombre: 'Provincia neutral', departamentoId: departamentoUbicacionId },
  ],
  distritos: [{ id: distritoId, nombre: 'Distrito neutral', provinciaId }],
  usuariosProximaTarea: [{ id: usuarioId, nombre: 'Usuario neutral' }],
}

const validInput: FormularioRequerimientoInput = {
  motivo: 'nueva-vacante',
  empresaId,
  colaboradorAReemplazarId: null,
  departamentoId,
  areaId,
  subareaId,
  puestoId,
  vacantes: '2',
  remuneracionMensual: '1234.50',
  departamentoUbicacionId,
  provinciaId,
  distritoId,
  usuarioProximaTareaId: usuarioId,
  comentario: 'Justificación neutral',
}

describe('modelo de formulario', () => {
  it('representa un borrador completamente incompleto sin valores ficticios', () => {
    const draft: FormularioRequerimientoInput = {
      motivo: null,
      empresaId: null,
      colaboradorAReemplazarId: null,
      departamentoId: null,
      areaId: null,
      subareaId: null,
      puestoId: null,
      vacantes: null,
      remuneracionMensual: null,
      departamentoUbicacionId: null,
      provinciaId: null,
      distritoId: null,
      usuarioProximaTareaId: null,
      comentario: null,
    }

    expect(draft).toEqual(expect.objectContaining({ motivo: null, comentario: null }))
    expect(draft).not.toHaveProperty('fechaObjetivo')
  })

  it('devuelve simultáneamente todos los errores obligatorios al enviar', () => {
    const result = validarParaEnvio(
      {
        motivo: null,
        empresaId: null,
        colaboradorAReemplazarId: null,
        departamentoId: null,
        areaId: null,
        subareaId: null,
        puestoId: null,
        vacantes: null,
        remuneracionMensual: null,
        departamentoUbicacionId: null,
        provinciaId: null,
        distritoId: null,
        usuarioProximaTareaId: null,
        comentario: '  ',
      },
      context,
    )

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.errors).toHaveLength(12)
    expect(result.errors.map(({ field }) => field)).toEqual([
      'motivo',
      'empresaId',
      'departamentoId',
      'areaId',
      'puestoId',
      'vacantes',
      'remuneracionMensual',
      'departamentoUbicacionId',
      'provinciaId',
      'distritoId',
      'usuarioProximaTareaId',
      'comentario',
    ])
  })

  it('exige colaborador solo para Reemplazo', () => {
    const replacement = validarParaEnvio(
      { ...validInput, motivo: 'reemplazo', colaboradorAReemplazarId: null },
      context,
    )
    expect(replacement).toEqual({
      ok: false,
      errors: [{ field: 'colaboradorAReemplazarId', code: 'obligatorio' }],
    })

    for (const motivo of ['nueva-vacante', 'practicante', 'otros'] as const) {
      const result = validarParaEnvio({ ...validInput, motivo }, context)
      expect(result.ok).toBe(true)
      if (result.ok) expect(result.value.colaboradorAReemplazarId).toBeNull()
    }
    expect(
      validarParaEnvio(
        { ...validInput, motivo: 'reemplazo', colaboradorAReemplazarId: colaboradorId },
        context,
      ).ok,
    ).toBe(true)
  })

  it.each(['nueva-vacante', 'practicante', 'otros'] as const)(
    'rechaza colaborador residual para %s',
    (motivo) => {
      expect(
        validarParaEnvio(
          {
            ...validInput,
            motivo,
            colaboradorAReemplazarId: colaboradorId,
          },
          context,
        ),
      ).toEqual({
        ok: false,
        errors: [
          {
            field: 'colaboradorAReemplazarId',
            code: 'valor-no-permitido',
          },
        ],
      })
    },
  )

  it('produce un modelo listo compatible con el contrato y sin fecha objetivo', () => {
    const result = validarParaEnvio(validInput, context)
    expect(result.ok).toBe(true)
    if (!result.ok) return

    const contractValue: BorradorRequerimiento = result.value
    expect(contractValue).toEqual(
      expect.objectContaining({
        vacantes: 2,
        remuneracion: { monto: 1234.5, moneda: 'PEN' },
        ubicacion: { departamentoId: departamentoUbicacionId, provinciaId, distritoId },
      }),
    )
    expect(result.value.clasificacion).toBe('administrativo')
    expect(result.value).not.toHaveProperty('fechaObjetivo')
  })

  it('rechaza comentario compuesto solo por espacios', () => {
    expect(validarParaEnvio({ ...validInput, comentario: '\t\n ' }, context)).toEqual({
      ok: false,
      errors: [{ field: 'comentario', code: 'obligatorio' }],
    })
  })

  it('no muta la entrada ni el contexto', () => {
    const inputSnapshot = structuredClone(validInput)
    const contextSnapshot = structuredClone(context)
    validarParaEnvio(validInput, context)
    expect(validInput).toEqual(inputSnapshot)
    expect(context).toEqual(contextSnapshot)
  })
})

describe('vacantes', () => {
  it.each([1, 7, '1', '20'])('acepta enteros mayores o iguales que uno: %s', (value) => {
    expect(validarVacantes(value)).toEqual({ ok: true, value: Number(value) })
  })

  it.each([
    0,
    -1,
    1.5,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    'texto',
    '1.5',
    ' 1',
  ])('rechaza un valor inválido: %s', (value) => {
    expect(validarVacantes(value).ok).toBe(false)
  })
})

describe('remuneración PEN', () => {
  it.each([
    ['0', 'practicante', 0],
    ['0.00', 'practicante', 0],
    ['1', 'otros', 100],
    ['1.2', 'reemplazo', 120],
    ['1.23', 'nueva-vacante', 123],
  ] as const)('acepta %s para %s', (value, motivo, centavos) => {
    const result = parsearRemuneracionPen(value, motivo)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value.centavos).toBe(centavos)
  })

  it.each(['reemplazo', 'nueva-vacante', 'otros'] as const)(
    'rechaza cero para %s',
    (motivo) => {
      expect(parsearRemuneracionPen('0.00', motivo)).toEqual({
        ok: false,
        code: 'importe-debe-ser-positivo',
      })
    },
  )

  it.each([
    '1.234',
    '-1',
    '-0.01',
    '1e3',
    '1,20',
    ' 1.20',
    '1.20 ',
    '+1',
    '.50',
    '1.',
  ])('rechaza formato no admitido: %s', (value) => {
    expect(parsearRemuneracionPen(value, 'practicante').ok).toBe(false)
  })
})

describe('jerarquías y clasificación', () => {
  const organizacion = { departamentoId, areaId, subareaId, puestoId }
  const ubicacion = { departamentoId: departamentoUbicacionId, provinciaId, distritoId }
  const directContext: ContextoValidacionFormulario = {
    ...context,
    puestos: [
      ...context.puestos,
      {
        id: puestoDirectoId,
        nombre: 'Puesto directo neutral',
        areaId,
        subareaId: null,
        clasificacion: 'operativo',
      },
    ],
  }

  it('acepta relaciones válidas y deriva clasificación solo desde el catálogo', () => {
    expect(comprobarJerarquiaOrganizacional(organizacion, context)).toBe(true)
    expect(comprobarJerarquiaUbicacion(ubicacion, context)).toBe(true)
    expect(derivarClasificacion(organizacion, context)).toBe('administrativo')
  })

  it('rechaza una relación organizacional inconsistente o no resoluble', () => {
    const invalid = { ...organizacion, puestoId: id<PuestoId>('puesto-inexistente') }
    expect(comprobarJerarquiaOrganizacional(invalid, context)).toBe(false)
    expect(derivarClasificacion(invalid, context)).toBeNull()
    const result = validarParaEnvio({ ...validInput, puestoId: invalid.puestoId }, context)
    expect(result).toEqual({
      ok: false,
      errors: [{ field: 'puestoId', code: 'jerarquia-inconsistente' }],
    })
  })

  it('acepta un puesto vinculado directamente al área sin inventar subárea', () => {
    const result = validarParaEnvio(
      { ...validInput, puestoId: puestoDirectoId, subareaId: null },
      directContext,
    )

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.subareaId).toBeNull()
    expect(result.value.clasificacion).toBe('operativo')
  })

  it('exige subárea cuando el puesto efectivo la requiere', () => {
    expect(validarParaEnvio({ ...validInput, subareaId: null }, context)).toEqual({
      ok: false,
      errors: [{ field: 'subareaId', code: 'obligatorio' }],
    })
  })

  it('rechaza una subárea residual para un puesto directo al área', () => {
    expect(
      validarParaEnvio(
        { ...validInput, puestoId: puestoDirectoId },
        directContext,
      ),
    ).toEqual({
      ok: false,
      errors: [{ field: 'subareaId', code: 'jerarquia-inconsistente' }],
    })
  })

  it('rechaza relaciones incompatibles entre área y puesto', () => {
    const otraAreaId = id<AreaId>('area-2')
    const contextWithOtherArea: ContextoValidacionFormulario = {
      ...context,
      areas: [
        ...context.areas,
        { id: otraAreaId, nombre: 'Otra área neutral', departamentoId },
      ],
    }

    expect(
      validarParaEnvio({ ...validInput, areaId: otraAreaId }, contextWithOtherArea),
    ).toEqual({
      ok: false,
      errors: [{ field: 'puestoId', code: 'jerarquia-inconsistente' }],
    })
  })

  it('rechaza una relación geográfica inconsistente sin mezclarla con organización', () => {
    const invalidDistrict = id<DistritoId>('distrito-inexistente')
    expect(
      comprobarJerarquiaUbicacion({ ...ubicacion, distritoId: invalidDistrict }, context),
    ).toBe(false)
    const result = validarParaEnvio(
      { ...validInput, distritoId: invalidDistrict },
      context,
    )
    expect(result).toEqual({
      ok: false,
      errors: [{ field: 'distritoId', code: 'jerarquia-inconsistente' }],
    })
  })
})
