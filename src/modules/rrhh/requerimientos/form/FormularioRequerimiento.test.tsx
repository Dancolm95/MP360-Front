/** @vitest-environment jsdom */
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import type {
  Area,
  AreaId,
  CalendarioLaboralId,
  CalendarioLaboralUnico,
  CatalogosRequerimientos,
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
import { FormularioRequerimiento } from './FormularioRequerimiento'

afterEach(cleanup)

const empresa: Empresa = { id: 'empresa-1' as EmpresaId, nombre: 'Honda' }
const departamento: Departamento = {
  id: 'departamento-1' as DepartamentoId,
  nombre: 'Operaciones',
}
const area: Area = {
  id: 'area-1' as AreaId,
  nombre: 'Almacén',
  departamentoId: departamento.id,
}
const subarea: Subarea = {
  id: 'subarea-1' as SubareaId,
  nombre: 'Despacho',
  areaId: area.id,
}
const puesto: Puesto = {
  id: 'puesto-1' as PuestoId,
  nombre: 'Operario de Almacén',
  areaId: area.id,
  subareaId: subarea.id,
  clasificacion: 'operativo',
}
const depUbicacion: DepartamentoUbicacion = {
  id: 'dep-ubic-1' as DepartamentoUbicacionId,
  nombre: 'Callao',
}
const provincia: Provincia = {
  id: 'provincia-1' as ProvinciaId,
  nombre: 'Callao',
  departamentoId: depUbicacion.id,
}
const distrito: Distrito = {
  id: 'distrito-1' as DistritoId,
  nombre: 'Callao',
  provinciaId: provincia.id,
}
const responsable: Usuario = {
  id: 'usuario-1' as UsuarioId,
  nombre: 'Ricardo Cisterna',
}

const calendario: CalendarioLaboralUnico = {
  id: 'calendario-1' as CalendarioLaboralId,
  diasHabiles: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'],
  excepciones: [],
}

function catalogos(): CatalogosRequerimientos {
  return {
    motivos: [
      { motivo: 'reemplazo', etiqueta: 'Reemplazo' },
      { motivo: 'nueva-vacante', etiqueta: 'Nueva Vacante' },
    ],
    empresas: [empresa],
    departamentos: [departamento],
    areas: [area],
    subareas: [subarea],
    puestos: [puesto],
    departamentosUbicacion: [depUbicacion],
    provincias: [provincia],
    distritos: [distrito],
    usuariosProximaTarea: [responsable],
    usuarioProximaTareaPredeterminado: responsable.id,
    calendarioLaboral: calendario,
  }
}

describe('FormularioRequerimiento (UX-03, presentacional)', () => {
  it('muestra el título y los botones principales del paso 1', () => {
    render(<FormularioRequerimiento catalogos={catalogos()} />)

    expect(
      screen.getByRole('heading', { name: 'Nuevo requerimiento de personal' }),
    ).toBeDefined()
    expect(screen.getByRole('button', { name: 'Continuar' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDefined()
  })

  it('avanza al paso de revisión y muestra «Enviar»', () => {
    render(<FormularioRequerimiento catalogos={catalogos()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))

    expect(screen.getByRole('button', { name: 'Enviar' })).toBeDefined()
    expect(
      screen.getByRole('button', { name: 'Guardar borrador' }),
    ).toBeDefined()
  })

  it('muestra la confirmación de envío sin «Enviar por Correo»', () => {
    render(<FormularioRequerimiento catalogos={catalogos()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))
    fireEvent.click(screen.getByRole('button', { name: 'Enviar' }))

    expect(
      screen.getByRole('heading', {
        name: '¡Requerimiento enviado para aprobar!',
      }),
    ).toBeDefined()
    expect(
      screen.getByRole('button', { name: 'Volver a la Bandeja' }),
    ).toBeDefined()
    expect(screen.queryByText(/Enviar por correo/i)).toBeNull()
  })
})
