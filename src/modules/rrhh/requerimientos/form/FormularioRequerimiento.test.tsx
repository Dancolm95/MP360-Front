/** @vitest-environment jsdom */
import { useState } from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import type {
  Area,
  AreaId,
  CalendarioLaboralId,
  CatalogosRequerimientos,
  ColaboradorId,
  ColaboradorReemplazo,
  Departamento,
  DepartamentoId,
  DepartamentoUbicacion,
  DepartamentoUbicacionId,
  Distrito,
  DistritoId,
  Empresa,
  EmpresaId,
  Provincia,
  ProvinciaId,
  Puesto,
  PuestoId,
  Subarea,
  SubareaId,
  Usuario,
  UsuarioId,
} from '../contracts'
import type { FormularioRequerimientoInput } from '../model'
import { FormularioRequerimiento } from './FormularioRequerimiento'
import {
  AVISO_DURACION,
  crearFormularioVacio,
  FORMULARIO_VACIO,
} from './helpers'

afterEach(cleanup)

const id = <T,>(value: string) => value as T

const empresaA: Empresa = { id: id<EmpresaId>('empresa-a'), nombre: 'Empresa A' }
const empresaB: Empresa = { id: id<EmpresaId>('empresa-b'), nombre: 'Empresa B' }
const departamentoA: Departamento = {
  id: id<DepartamentoId>('departamento-a'),
  nombre: 'Departamento A',
}
const departamentoB: Departamento = {
  id: id<DepartamentoId>('departamento-b'),
  nombre: 'Departamento B',
}
const areaA: Area = {
  id: id<AreaId>('area-a'),
  nombre: 'Área A',
  departamentoId: departamentoA.id,
}
const areaB: Area = {
  id: id<AreaId>('area-b'),
  nombre: 'Área B',
  departamentoId: departamentoB.id,
}
const subareaA: Subarea = {
  id: id<SubareaId>('subarea-a'),
  nombre: 'Subárea A',
  areaId: areaA.id,
}
const subareaB: Subarea = {
  id: id<SubareaId>('subarea-b'),
  nombre: 'Subárea B',
  areaId: areaB.id,
}
const puestoOperativo: Puesto = {
  id: id<PuestoId>('puesto-operativo'),
  nombre: 'Puesto Operativo',
  areaId: areaA.id,
  subareaId: subareaA.id,
  clasificacion: 'operativo',
}
const puestoAdministrativo: Puesto = {
  id: id<PuestoId>('puesto-administrativo'),
  nombre: 'Puesto Administrativo',
  areaId: areaB.id,
  subareaId: subareaB.id,
  clasificacion: 'administrativo',
}
const ubicacionA: DepartamentoUbicacion = {
  id: id<DepartamentoUbicacionId>('ubicacion-a'),
  nombre: 'Ubicación A',
}
const ubicacionB: DepartamentoUbicacion = {
  id: id<DepartamentoUbicacionId>('ubicacion-b'),
  nombre: 'Ubicación B',
}
const provinciaA: Provincia = {
  id: id<ProvinciaId>('provincia-a'),
  nombre: 'Provincia A',
  departamentoId: ubicacionA.id,
}
const provinciaB: Provincia = {
  id: id<ProvinciaId>('provincia-b'),
  nombre: 'Provincia B',
  departamentoId: ubicacionB.id,
}
const distritoA: Distrito = {
  id: id<DistritoId>('distrito-a'),
  nombre: 'Distrito A',
  provinciaId: provinciaA.id,
}
const distritoB: Distrito = {
  id: id<DistritoId>('distrito-b'),
  nombre: 'Distrito B',
  provinciaId: provinciaB.id,
}
const usuarioA: Usuario = { id: id<UsuarioId>('usuario-a'), nombre: 'Usuario A' }
const usuarioB: Usuario = { id: id<UsuarioId>('usuario-b'), nombre: 'Usuario B' }
const colaboradorA: ColaboradorReemplazo = {
  id: id<ColaboradorId>('colaborador-a'),
  nombre: 'Colaborador A',
}

function catalogosCon(
  overrides: Partial<CatalogosRequerimientos> = {},
): CatalogosRequerimientos {
  return {
    motivos: [
      { motivo: 'reemplazo', etiqueta: 'Reemplazo' },
      { motivo: 'nueva-vacante', etiqueta: 'Nueva Vacante' },
      { motivo: 'practicante', etiqueta: 'Practicante' },
      { motivo: 'otros', etiqueta: 'Otros' },
    ],
    empresas: [empresaA, empresaB],
    departamentos: [departamentoA, departamentoB],
    areas: [areaA, areaB],
    subareas: [subareaA, subareaB],
    puestos: [puestoOperativo, puestoAdministrativo],
    departamentosUbicacion: [ubicacionA, ubicacionB],
    provincias: [provinciaA, provinciaB],
    distritos: [distritoA, distritoB],
    usuariosProximaTarea: [usuarioA, usuarioB],
    usuarioProximaTareaPredeterminado: usuarioA.id,
    calendarioLaboral: {
      id: id<CalendarioLaboralId>('calendario-1'),
      diasHabiles: [],
      excepciones: [],
    },
    ...overrides,
  }
}

const catalogos = catalogosCon()

function Harness({
  inicial = crearFormularioVacio(catalogos),
  colaboradores = [colaboradorA],
  plazoAdministrativoDias,
}: {
  readonly inicial?: FormularioRequerimientoInput
  readonly colaboradores?: readonly ColaboradorReemplazo[]
  readonly plazoAdministrativoDias?: number | null
}) {
  const [valor, setValor] = useState(inicial)
  return (
    <FormularioRequerimiento
      catalogos={catalogos}
      valor={valor}
      onCambio={setValor}
      colaboradores={colaboradores}
      plazoAdministrativoDias={plazoAdministrativoDias}
    />
  )
}

function valorDe(campo: string): string {
  return (screen.getByLabelText(campo) as HTMLSelectElement).value
}

describe('formulario UX-03: campos y jerarquías (RH-REQ-01 §7.2)', () => {
  it('presenta los campos obligatorios y preselecciona al usuario por defecto', () => {
    render(<Harness />)

    for (const etiqueta of [
      'Motivo',
      'Empresa',
      'Cantidad de vacantes',
      'Remuneración mensual (PEN)',
      'Usuario de próxima tarea',
      'Departamento',
      'Área',
      'Subárea',
      'Puesto',
      'Departamento de ubicación',
      'Provincia',
      'Distrito',
      'Comentario',
    ]) {
      expect(screen.getByLabelText(etiqueta)).toBeDefined()
    }

    expect(valorDe('Usuario de próxima tarea')).toBe(String(usuarioA.id))
    expect(screen.queryByLabelText('Colaborador a reemplazar')).toBeNull()
  })

  it('expone la obligatoriedad con required y aria-required', () => {
    render(<Harness />)

    for (const etiqueta of [
      'Motivo',
      'Empresa',
      'Cantidad de vacantes',
      'Remuneración mensual (PEN)',
      'Usuario de próxima tarea',
      'Departamento',
      'Área',
      'Puesto',
      'Departamento de ubicación',
      'Provincia',
      'Distrito',
      'Comentario',
    ]) {
      const control = screen.getByLabelText(etiqueta)
      expect(control).toHaveProperty('required', true)
      expect(control.getAttribute('aria-required')).toBe('true')
    }

    expect(screen.getByLabelText('Subárea')).not.toHaveProperty('required', true)
  })

  it('muestra el colaborador a reemplazar solo con motivo Reemplazo', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.selectOptions(screen.getByLabelText('Motivo'), 'nueva-vacante')
    expect(screen.queryByLabelText('Colaborador a reemplazar')).toBeNull()

    await user.selectOptions(screen.getByLabelText('Motivo'), 'reemplazo')
    const colaborador = screen.getByLabelText('Colaborador a reemplazar')
    expect(colaborador).toHaveProperty('required', true)
    expect(colaborador.getAttribute('aria-required')).toBe('true')
    await user.selectOptions(colaborador, String(colaboradorA.id))
    expect(valorDe('Colaborador a reemplazar')).toBe(String(colaboradorA.id))

    await user.selectOptions(screen.getByLabelText('Motivo'), 'otros')
    expect(screen.queryByLabelText('Colaborador a reemplazar')).toBeNull()

    await user.selectOptions(screen.getByLabelText('Motivo'), 'reemplazo')
    expect(valorDe('Colaborador a reemplazar')).toBe('')
  })

  it('deshabilita las jerarquías hasta elegir el padre', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    expect((screen.getByLabelText('Área') as HTMLSelectElement).disabled).toBe(true)
    expect((screen.getByLabelText('Subárea') as HTMLSelectElement).disabled).toBe(true)
    expect((screen.getByLabelText('Puesto') as HTMLSelectElement).disabled).toBe(true)
    expect(
      (screen.getByLabelText('Provincia') as HTMLSelectElement).disabled,
    ).toBe(true)
    expect((screen.getByLabelText('Distrito') as HTMLSelectElement).disabled).toBe(
      true,
    )

    await user.selectOptions(
      screen.getByLabelText('Departamento'),
      String(departamentoA.id),
    )
    expect((screen.getByLabelText('Área') as HTMLSelectElement).disabled).toBe(false)

    await user.selectOptions(screen.getByLabelText('Área'), String(areaA.id))
    expect((screen.getByLabelText('Subárea') as HTMLSelectElement).disabled).toBe(
      false,
    )
    expect((screen.getByLabelText('Puesto') as HTMLSelectElement).disabled).toBe(
      false,
    )
  })

  it('limpia área, subárea y puesto al cambiar de departamento', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.selectOptions(
      screen.getByLabelText('Departamento'),
      String(departamentoA.id),
    )
    await user.selectOptions(screen.getByLabelText('Área'), String(areaA.id))
    await user.selectOptions(screen.getByLabelText('Subárea'), String(subareaA.id))
    await user.selectOptions(
      screen.getByLabelText('Puesto'),
      String(puestoOperativo.id),
    )
    expect(valorDe('Puesto')).toBe(String(puestoOperativo.id))

    await user.selectOptions(
      screen.getByLabelText('Departamento'),
      String(departamentoB.id),
    )
    expect(valorDe('Área')).toBe('')
    expect(valorDe('Subárea')).toBe('')
    expect(valorDe('Puesto')).toBe('')
  })

  it('filtra los puestos por el área y la subárea elegidas', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.selectOptions(
      screen.getByLabelText('Departamento'),
      String(departamentoA.id),
    )
    await user.selectOptions(screen.getByLabelText('Área'), String(areaA.id))
    await user.selectOptions(screen.getByLabelText('Subárea'), String(subareaA.id))

    const opciones = Array.from(
      (screen.getByLabelText('Puesto') as HTMLSelectElement).options,
    ).map((opcion) => opcion.textContent)
    expect(opciones).toContain('Puesto Operativo')
    expect(opciones).not.toContain('Puesto Administrativo')

    await user.selectOptions(
      screen.getByLabelText('Puesto'),
      String(puestoOperativo.id),
    )
    expect(valorDe('Puesto')).toBe(String(puestoOperativo.id))
  })

  it('mantiene la jerarquía de ubicación y limpia provincia y distrito', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.selectOptions(
      screen.getByLabelText('Departamento de ubicación'),
      String(ubicacionA.id),
    )
    await user.selectOptions(
      screen.getByLabelText('Provincia'),
      String(provinciaA.id),
    )
    await user.selectOptions(
      screen.getByLabelText('Distrito'),
      String(distritoA.id),
    )

    await user.selectOptions(
      screen.getByLabelText('Departamento de ubicación'),
      String(ubicacionB.id),
    )
    expect(valorDe('Provincia')).toBe('')
    expect(valorDe('Distrito')).toBe('')
  })
})

describe('formulario UX-03: valores derivados y criterio 24', () => {
  async function completarOperativo(user: ReturnType<typeof userEvent.setup>) {
    await user.selectOptions(
      screen.getByLabelText('Departamento'),
      String(departamentoA.id),
    )
    await user.selectOptions(screen.getByLabelText('Área'), String(areaA.id))
    await user.selectOptions(screen.getByLabelText('Subárea'), String(subareaA.id))
    await user.selectOptions(
      screen.getByLabelText('Puesto'),
      String(puestoOperativo.id),
    )
  }

  it('deriva la clasificación y muestra la duración operativa con aviso', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    expect(screen.getByText('Se calcula con el puesto')).toBeDefined()
    await completarOperativo(user)

    expect(screen.getByText('Operativo')).toBeDefined()
    expect(screen.getByText('10 días hábiles')).toBeDefined()
    expect(screen.getByText(AVISO_DURACION)).toBeDefined()
  })

  it('muestra el plazo administrativo pendiente de definir', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.selectOptions(
      screen.getByLabelText('Departamento'),
      String(departamentoB.id),
    )
    await user.selectOptions(screen.getByLabelText('Área'), String(areaB.id))
    await user.selectOptions(screen.getByLabelText('Subárea'), String(subareaB.id))
    await user.selectOptions(
      screen.getByLabelText('Puesto'),
      String(puestoAdministrativo.id),
    )

    expect(screen.getByText('Administrativo')).toBeDefined()
    expect(screen.getByText('Plazo pendiente de definir')).toBeDefined()
  })

  it('muestra el plazo administrativo fijado por RR. HH.', async () => {
    const user = userEvent.setup()
    render(<Harness plazoAdministrativoDias={20} />)

    await user.selectOptions(
      screen.getByLabelText('Departamento'),
      String(departamentoB.id),
    )
    await user.selectOptions(screen.getByLabelText('Área'), String(areaB.id))
    await user.selectOptions(screen.getByLabelText('Subárea'), String(subareaB.id))
    await user.selectOptions(
      screen.getByLabelText('Puesto'),
      String(puestoAdministrativo.id),
    )

    expect(screen.getByText('20 días hábiles')).toBeDefined()
  })

  it('no muestra una fecha objetivo definitiva antes de aprobar', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await completarOperativo(user)

    expect(screen.queryByLabelText('Fecha objetivo')).toBeNull()
    expect(screen.queryByText(/\d{2}\/\d{2}\/\d{4}/)).toBeNull()
    expect(screen.getByText(AVISO_DURACION)).toBeDefined()
  })
})

describe('formulario UX-03: estados y accesibilidad', () => {
  it('mantiene los valores introducidos al cambiar otros campos', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.type(screen.getByLabelText('Comentario'), 'Justificación neutral')
    await user.type(screen.getByLabelText('Cantidad de vacantes'), '3')
    await user.selectOptions(screen.getByLabelText('Motivo'), 'otros')

    expect((screen.getByLabelText('Comentario') as HTMLTextAreaElement).value).toBe(
      'Justificación neutral',
    )
    expect((screen.getByLabelText('Cantidad de vacantes') as HTMLInputElement).value).toBe(
      '3',
    )
    expect(valorDe('Motivo')).toBe('otros')
  })

  it('es operable por teclado desde el primer control', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.tab()
    expect(document.activeElement).toBe(screen.getByLabelText('Motivo'))
  })

  it('usa el catálogo canónico de motivos si llega vacío y no inventa el resto', () => {
    const vacios = catalogosCon({
      motivos: [],
      empresas: [],
      departamentos: [],
      areas: [],
      subareas: [],
      puestos: [],
      departamentosUbicacion: [],
      provincias: [],
      distritos: [],
      usuariosProximaTarea: [],
      usuarioProximaTareaPredeterminado: null,
    })
    render(
      <FormularioRequerimiento
        catalogos={vacios}
        valor={FORMULARIO_VACIO}
        onCambio={() => undefined}
      />,
    )

    const motivos = Array.from(
      (screen.getByLabelText('Motivo') as HTMLSelectElement).options,
    ).map((opcion) => opcion.value)
    expect(motivos).toEqual([
      '',
      'reemplazo',
      'nueva-vacante',
      'practicante',
      'otros',
    ])

    expect(
      (screen.getByLabelText('Empresa') as HTMLSelectElement).options,
    ).toHaveLength(1)
    expect(valorDe('Usuario de próxima tarea')).toBe('')
    expect((screen.getByLabelText('Área') as HTMLSelectElement).disabled).toBe(true)
    expect(screen.queryByLabelText('Colaborador a reemplazar')).toBeNull()
  })
})
