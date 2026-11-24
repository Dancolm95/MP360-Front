/** @vitest-environment jsdom */
import type { ComponentProps } from 'react'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import type {
  Area,
  AreaId,
  CalendarioLaboralId,
  CatalogosRequerimientos,
  ColaboradorId,
  ColaboradorReemplazo,
  ComandosRequerimientosPort,
  Departamento,
  DepartamentoId,
  DepartamentoUbicacion,
  DepartamentoUbicacionId,
  DetalleRequerimiento,
  Distrito,
  DistritoId,
  Empresa,
  EmpresaId,
  InstanteISO,
  Provincia,
  ProvinciaId,
  Puesto,
  PuestoId,
  RequerimientoId,
  Subarea,
  SubareaId,
  Usuario,
  UsuarioId,
} from '../contracts'
import type { FormularioRequerimientoInput } from '../model'
import { borradorDesdeFormulario } from '../review'
import {
  FormularioRequerimientoPreview,
  crearPuertoPreview,
} from './FormularioRequerimientoPreview'

afterEach(cleanup)

const id = <T,>(value: string) => value as T

const empresa: Empresa = { id: id<EmpresaId>('empresa-a'), nombre: 'Empresa A' }
const departamento: Departamento = {
  id: id<DepartamentoId>('departamento-a'),
  nombre: 'Departamento A',
}
const area: Area = {
  id: id<AreaId>('area-a'),
  nombre: 'Área A',
  departamentoId: departamento.id,
}
const subarea: Subarea = {
  id: id<SubareaId>('subarea-a'),
  nombre: 'Subárea A',
  areaId: area.id,
}
const puestoAdministrativo: Puesto = {
  id: id<PuestoId>('puesto-administrativo'),
  nombre: 'Supervisor de Logística',
  areaId: area.id,
  subareaId: subarea.id,
  clasificacion: 'administrativo',
}
const ubicacion: DepartamentoUbicacion = {
  id: id<DepartamentoUbicacionId>('ubicacion-a'),
  nombre: 'Ubicación A',
}
const provincia: Provincia = {
  id: id<ProvinciaId>('provincia-a'),
  nombre: 'Provincia A',
  departamentoId: ubicacion.id,
}
const distrito: Distrito = {
  id: id<DistritoId>('distrito-a'),
  nombre: 'Distrito A',
  provinciaId: provincia.id,
}
const responsable: Usuario = {
  id: id<UsuarioId>('usuario-a'),
  nombre: 'Usuario A',
}
const colaborador: ColaboradorReemplazo = {
  id: id<ColaboradorId>('colaborador-a'),
  nombre: 'Colaborador A',
}

function catalogos(): CatalogosRequerimientos {
  return {
    motivos: [
      { motivo: 'nueva-vacante', etiqueta: 'Nueva Vacante' },
      { motivo: 'reemplazo', etiqueta: 'Reemplazo' },
    ],
    empresas: [empresa],
    departamentos: [departamento],
    areas: [area],
    subareas: [subarea],
    puestos: [puestoAdministrativo],
    departamentosUbicacion: [ubicacion],
    provincias: [provincia],
    distritos: [distrito],
    usuariosProximaTarea: [responsable],
    usuarioProximaTareaPredeterminado: responsable.id,
    calendarioLaboral: {
      id: id<CalendarioLaboralId>('calendario-1'),
      diasHabiles: [],
      excepciones: [],
    },
  }
}

const FORMULARIO_ADMINISTRATIVO: FormularioRequerimientoInput = {
  motivo: 'nueva-vacante',
  empresaId: empresa.id,
  colaboradorAReemplazarId: null,
  departamentoId: departamento.id,
  areaId: area.id,
  subareaId: subarea.id,
  puestoId: puestoAdministrativo.id,
  vacantes: 1,
  remuneracionMensual: '4500.00',
  departamentoUbicacionId: ubicacion.id,
  provinciaId: provincia.id,
  distritoId: distrito.id,
  usuarioProximaTareaId: responsable.id,
  comentario: 'Cobertura del puesto administrativo de Logística.',
}

const PLAZO_ADMINISTRATIVO = 20

function renderPreview(
  props: Partial<ComponentProps<typeof FormularioRequerimientoPreview>> = {},
) {
  return render(
    <FormularioRequerimientoPreview
      catalogos={catalogos()}
      colaboradores={[colaborador]}
      {...props}
    />,
  )
}

describe('FormularioRequerimientoPreview: datos, revisión y confirmación', () => {
  it('bloquea «Continuar» con datos inválidos y muestra los errores del modelo', async () => {
    const user = userEvent.setup()
    renderPreview()

    await user.click(screen.getByRole('button', { name: 'Continuar' }))

    const alerta = screen.getByRole('alert')
    expect(within(alerta).getByText('Motivo:')).toBeDefined()
    expect(within(alerta).getAllByText(/Campo obligatorio/).length).toBeGreaterThan(
      0,
    )
    expect(screen.queryByRole('button', { name: 'Enviar' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Continuar' })).toBeDefined()
  })

  it('avanza a revisión con datos válidos y resume lo introducido con el modelo de revisión', async () => {
    const user = userEvent.setup()
    renderPreview({
      valorInicial: FORMULARIO_ADMINISTRATIVO,
      plazoAdministrativoDias: PLAZO_ADMINISTRATIVO,
    })

    await user.click(screen.getByRole('button', { name: 'Continuar' }))

    const resumen = screen.getByRole('region', { name: 'Revisión y envío' })
    expect(within(resumen).getByText('Supervisor de Logística')).toBeDefined()
    expect(within(resumen).getByText('Administrativo')).toBeDefined()
    expect(within(resumen).getByText('20 días hábiles')).toBeDefined()
    expect(within(resumen).getByText('S/ 4,500.00')).toBeDefined()
    expect(
      within(resumen).getByText(
        'Cobertura del puesto administrativo de Logística.',
      ),
    ).toBeDefined()
    expect(screen.getByRole('button', { name: 'Enviar' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'Volver a editar' })).toBeDefined()
  })

  it('«Volver a editar» conserva los valores introducidos', async () => {
    const user = userEvent.setup()
    renderPreview({
      valorInicial: FORMULARIO_ADMINISTRATIVO,
      plazoAdministrativoDias: PLAZO_ADMINISTRATIVO,
    })

    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    await user.click(screen.getByRole('button', { name: 'Volver a editar' }))

    expect(
      (screen.getByLabelText('Comentario') as HTMLTextAreaElement).value,
    ).toBe('Cobertura del puesto administrativo de Logística.')
    expect(
      (screen.getByLabelText('Cantidad de vacantes') as HTMLInputElement).value,
    ).toBe('1')
    expect((screen.getByLabelText('Puesto') as HTMLSelectElement).value).toBe(
      String(puestoAdministrativo.id),
    )
    expect((screen.getByLabelText('Motivo') as HTMLSelectElement).value).toBe(
      'nueva-vacante',
    )
    expect(screen.getByRole('button', { name: 'Continuar' })).toBeDefined()
  })

  it('no muestra la confirmación si el puerto falla, conserva la entrada y permite reintentar', async () => {
    const user = userEvent.setup()
    const puertoConfirmador = crearPuertoPreview(catalogos())
    let intentos = 0
    const puerto: ComandosRequerimientosPort = {
      ...puertoConfirmador,
      enviarAprobacion: async (comando) => {
        intentos += 1
        if (intentos === 1) {
          return {
            status: 'error',
            error: { message: 'No se pudo registrar el envío', retryable: true },
          }
        }
        return puertoConfirmador.enviarAprobacion(comando)
      },
    }
    renderPreview({
      valorInicial: FORMULARIO_ADMINISTRATIVO,
      plazoAdministrativoDias: PLAZO_ADMINISTRATIVO,
      puerto,
    })

    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    await user.click(screen.getByRole('button', { name: 'Enviar' }))

    expect(await screen.findByText('No se pudo registrar el envío')).toBeDefined()
    expect(
      screen.queryByRole('heading', {
        name: '¡Requerimiento enviado para aprobar!',
      }),
    ).toBeNull()
    expect(screen.getByRole('button', { name: 'Enviar' })).toBeDefined()
    expect(screen.getByText('Supervisor de Logística')).toBeDefined()

    await user.click(screen.getByRole('button', { name: 'Enviar' }))

    expect(
      await screen.findByRole('heading', {
        name: '¡Requerimiento enviado para aprobar!',
      }),
    ).toBeDefined()
    expect(intentos).toBe(2)
  })

  it('no muestra la confirmación ante un conflicto de versión y permite reintentar', async () => {
    const user = userEvent.setup()
    const datosVigentes: DetalleRequerimiento = {
      id: 'req-9001' as RequerimientoId,
      version: 8,
      estado: 'borrador',
      fechaCreacion: '2026-11-24T00:00:00Z' as InstanteISO,
      historial: [],
      autorizacion: {
        requerimientoId: 'req-9001' as RequerimientoId,
        version: 8,
        capacidades: [],
        accionesPermitidas: [],
      },
      borrador: borradorDesdeFormulario(FORMULARIO_ADMINISTRATIVO),
      plazo: null,
      cobertura: null,
      remuneracionPreviaAlta: null,
      procesoSeleccion: null,
    }
    const puerto: ComandosRequerimientosPort = {
      ...crearPuertoPreview(catalogos()),
      enviarAprobacion: async () => ({
        status: 'conflicto-version',
        conflicto: {
          versionEsperada: 7,
          versionVigente: 8,
          datosVigentes,
        },
      }),
    }
    renderPreview({
      valorInicial: FORMULARIO_ADMINISTRATIVO,
      plazoAdministrativoDias: PLAZO_ADMINISTRATIVO,
      puerto,
    })

    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    await user.click(screen.getByRole('button', { name: 'Enviar' }))

    expect(await screen.findByText(/La versión cambió/)).toBeDefined()
    expect(
      screen.queryByRole('heading', {
        name: '¡Requerimiento enviado para aprobar!',
      }),
    ).toBeNull()
    expect(screen.getByRole('button', { name: 'Enviar' })).toBeDefined()
  })

  it('muestra la confirmación solo tras un envío confirmado, con ID y resumen', async () => {
    const user = userEvent.setup()
    renderPreview({
      valorInicial: FORMULARIO_ADMINISTRATIVO,
      plazoAdministrativoDias: PLAZO_ADMINISTRATIVO,
      solicitud: {
        requerimientoId: 'req-9001' as RequerimientoId,
        version: 7,
      },
    })

    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    await user.click(screen.getByRole('button', { name: 'Enviar' }))

    expect(
      await screen.findByRole('heading', {
        name: '¡Requerimiento enviado para aprobar!',
      }),
    ).toBeDefined()
    expect(screen.getByText('req-9001')).toBeDefined()
    expect(
      screen.getByText(
        'Nueva Vacante · Supervisor de Logística · Empresa A · 1 vacante',
      ),
    ).toBeDefined()
    expect(screen.getByText('Usuario A')).toBeDefined()
    expect(screen.getByText('Pendiente de aprobación')).toBeDefined()
  })
})

describe('FormularioRequerimientoPreview: presentación', () => {
  it('por defecto se presenta como diálogo modal', () => {
    renderPreview()

    expect(
      screen.getByRole('dialog', { name: 'Nuevo requerimiento de personal' }),
    ).toBeDefined()
    expect(screen.getByRole('dialog').getAttribute('aria-modal')).toBe('true')
  })

  it('con variante «embebido» no es un diálogo modal y reutiliza el formulario de producción', () => {
    const { container } = renderPreview({ variante: 'embebido' })

    expect(screen.queryByRole('dialog')).toBeNull()
    expect(container.querySelector('[aria-modal]')).toBeNull()

    const region = screen.getByRole('region', {
      name: 'Nuevo requerimiento de personal',
    })
    expect(container.firstElementChild?.contains(region)).toBe(true)
    expect(
      within(region).getByRole('form', { name: 'Formulario de requerimiento' }),
    ).toBeDefined()
    expect(within(region).getByRole('combobox', { name: 'Motivo' })).toBeDefined()
    expect(within(region).getByRole('button', { name: 'Continuar' })).toBeDefined()
  })
})
