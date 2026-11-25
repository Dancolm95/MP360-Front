/** @vitest-environment jsdom */
import { useState } from 'react'
import type { ComponentProps } from 'react'
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react'
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
} from '../../../../modules/rrhh/requerimientos/contracts'
import type { FormularioRequerimientoInput } from '../../../../modules/rrhh/requerimientos/model'
import { borradorDesdeFormulario } from '../../../../modules/rrhh/requerimientos/review'
import { FormularioUx03, crearPuertoPreview } from './FormularioUx03'

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

const FORMULARIO_REEMPLAZO: FormularioRequerimientoInput = {
  ...FORMULARIO_ADMINISTRATIVO,
  motivo: 'reemplazo',
  colaboradorAReemplazarId: colaborador.id,
}

const PLAZO_ADMINISTRATIVO = 20

function renderPreview(
  props: Partial<ComponentProps<typeof FormularioUx03>> = {},
) {
  const valores = catalogos()
  return render(
    <FormularioUx03
      catalogos={valores}
      colaboradores={[colaborador]}
      puerto={crearPuertoPreview(valores)}
      {...props}
    />,
  )
}

function PreviewConApertura(
  props: Partial<ComponentProps<typeof FormularioUx03>> = {},
) {
  const [abierto, setAbierto] = useState(false)
  const valores = catalogos()
  return (
    <>
      <button type="button" onClick={() => setAbierto(true)}>
        Abrir formulario
      </button>
      {abierto ? (
        <FormularioUx03
          catalogos={valores}
          colaboradores={[colaborador]}
          puerto={crearPuertoPreview(valores)}
          {...props}
          onCancelar={() => setAbierto(false)}
        />
      ) : null}
    </>
  )
}

function detalleVigente(version = 8, idRequerimiento = 'req-9001') {
  const detalle: DetalleRequerimiento = {
    id: idRequerimiento as RequerimientoId,
    version,
    estado: 'borrador',
    fechaCreacion: '2026-11-24T00:00:00Z' as InstanteISO,
    historial: [],
    autorizacion: {
      requerimientoId: idRequerimiento as RequerimientoId,
      version,
      capacidades: [],
      accionesPermitidas: [],
    },
    borrador: borradorDesdeFormulario(FORMULARIO_ADMINISTRATIVO),
    plazo: null,
    cobertura: null,
    remuneracionPreviaAlta: null,
    procesoSeleccion: null,
  }
  return detalle
}

describe('FormularioUx03: datos, revisión y confirmación', () => {
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

  it('muestra el nombre del colaborador a reemplazar y no su identificador', async () => {
    const user = userEvent.setup()
    renderPreview({ valorInicial: FORMULARIO_REEMPLAZO })

    await user.click(screen.getByRole('button', { name: 'Continuar' }))

    const resumen = screen.getByRole('region', { name: 'Revisión y envío' })
    expect(within(resumen).getByText('Colaborador A')).toBeDefined()
    expect(within(resumen).queryByText('colaborador-a')).toBeNull()
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
      within(screen.getByRole('alert')).getByText('No se pudo registrar el envío'),
    ).toBeDefined()
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
    expect(screen.getByRole('alert').textContent).toContain('La versión cambió')
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
    expect(screen.getByRole('status').textContent).toContain('Envío confirmado')
    expect(screen.getByText('req-9001')).toBeDefined()
    expect(
      screen.getByText(
        'Nueva Vacante · Supervisor de Logística · Empresa A · 1 vacante',
      ),
    ).toBeDefined()
    expect(screen.getByText('Usuario A')).toBeDefined()
    expect(screen.getByText('Pendiente de aprobación')).toBeDefined()
    expect(
      screen.getByRole('button', { name: 'Volver a la Bandeja' }),
    ).toBeDefined()
    expect(screen.queryByText(/Enviar por correo/i)).toBeNull()
  })
})

describe('FormularioUx03: presentación', () => {
  it('muestra «Cancelar edición» en el paso de datos y lo notifica al pulsarlo sin cambios', async () => {
    const user = userEvent.setup()
    let cancelados = 0
    renderPreview({ onCancelar: () => (cancelados += 1) })

    await user.click(screen.getByRole('button', { name: 'Cancelar edición' }))

    expect(cancelados).toBe(1)
  })

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

describe('FormularioUx03: foco y teclado', () => {
  it('al abrir el modal, el foco entra en el título del diálogo', async () => {
    const user = userEvent.setup()
    render(<PreviewConApertura />)

    await user.click(screen.getByRole('button', { name: 'Abrir formulario' }))

    expect(document.activeElement).toBe(
      screen.getByRole('heading', { name: 'Nuevo requerimiento de personal' }),
    )
  })

  it('atrapa el tabulador dentro del modal en ambos sentidos', async () => {
    const user = userEvent.setup()
    renderPreview()

    const cerrar = screen.getByRole('button', { name: 'Cerrar formulario' })
    const continuar = screen.getByRole('button', { name: 'Continuar' })
    continuar.focus()

    await user.tab()
    expect(document.activeElement).toBe(cerrar)

    await user.tab({ shift: true })
    expect(document.activeElement).toBe(continuar)
  })

  it('Tab desde el título del modal va al primer control', () => {
    renderPreview()

    const dialogo = screen.getByRole('dialog')
    const titulo = within(dialogo).getByRole('heading', {
      name: 'Nuevo requerimiento de personal',
    })
    expect(document.activeElement).toBe(titulo)

    fireEvent.keyDown(titulo, { key: 'Tab' })

    expect(document.activeElement).toBe(
      within(dialogo).getByRole('button', { name: 'Cerrar formulario' }),
    )
  })

  it('Shift+Tab desde el título del modal va al último control del diálogo', () => {
    renderPreview()

    const dialogo = screen.getByRole('dialog')
    const titulo = within(dialogo).getByRole('heading', {
      name: 'Nuevo requerimiento de personal',
    })

    fireEvent.keyDown(titulo, { key: 'Tab', shiftKey: true })

    expect(document.activeElement).toBe(
      within(dialogo).getByRole('button', { name: 'Continuar' }),
    )
    expect(dialogo.contains(document.activeElement)).toBe(true)
  })

  it('un clic en el velo del modal devuelve el foco dentro del diálogo', () => {
    renderPreview()

    const dialogo = screen.getByRole('dialog')
    const velo = dialogo.parentElement
    expect(velo).not.toBeNull()
    ;(document.activeElement as HTMLElement | null)?.blur()
    expect(document.activeElement).toBe(document.body)

    fireEvent.click(velo as HTMLElement)

    expect(document.activeElement).toBe(
      within(dialogo).getByRole('heading', {
        name: 'Nuevo requerimiento de personal',
      }),
    )
    expect(dialogo.contains(document.activeElement)).toBe(true)
  })

  it('Esc cierra el modal y devuelve el foco al control que lo abrió', async () => {
    const user = userEvent.setup()
    render(<PreviewConApertura />)
    const abrir = screen.getByRole('button', { name: 'Abrir formulario' })

    await user.click(abrir)
    expect(screen.getByRole('dialog')).toBeDefined()

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).toBeNull()
    expect(document.activeElement).toBe(abrir)
  })

  it('en embebido no atrapa el tabulador ni cierra con Esc', async () => {
    const user = userEvent.setup()
    let cancelados = 0
    renderPreview({
      variante: 'embebido',
      onCancelar: () => (cancelados += 1),
    })

    await user.keyboard('{Escape}')
    expect(cancelados).toBe(0)

    screen.getByRole('button', { name: 'Continuar' }).focus()
    await user.tab()
    expect(document.activeElement).not.toBe(
      screen.getByRole('button', { name: 'Cerrar formulario' }),
    )
  })

  it('marca el paso activo con aria-current y expone los pasos como lista con texto', async () => {
    const user = userEvent.setup()
    renderPreview({
      valorInicial: FORMULARIO_ADMINISTRATIVO,
      plazoAdministrativoDias: PLAZO_ADMINISTRATIVO,
    })

    const pasosEdicion = screen.getAllByRole('listitem')
    expect(pasosEdicion).toHaveLength(2)
    expect(pasosEdicion[0].getAttribute('aria-current')).toBe('step')
    expect(pasosEdicion[0].textContent).toContain('Datos del requerimiento')
    expect(pasosEdicion[1].getAttribute('aria-current')).toBeNull()

    await user.click(screen.getByRole('button', { name: 'Continuar' }))

    const pasosRevision = screen.getAllByRole('listitem')
    expect(pasosRevision[0].getAttribute('aria-current')).toBeNull()
    expect(pasosRevision[1].getAttribute('aria-current')).toBe('step')
    expect(pasosRevision[1].textContent).toContain('Revisión y envío')
    expect(screen.getByRole('status').textContent).toContain('Paso 2 de 2')
  })

  it('anuncia el resumen de errores y asocia cada error al control con aria-invalid/aria-describedby', async () => {
    const user = userEvent.setup()
    renderPreview()

    await user.click(screen.getByRole('button', { name: 'Continuar' }))

    const alerta = screen.getByRole('alert')
    expect(
      within(alerta).getByText('Revisa los datos antes de continuar:'),
    ).toBeDefined()
    expect(within(alerta).getAllByText(/Campo obligatorio/).length).toBeGreaterThan(
      0,
    )

    const motivo = screen.getByLabelText('Motivo')
    expect(motivo.getAttribute('aria-invalid')).toBe('true')
    const descrito = motivo.getAttribute('aria-describedby')
    expect(descrito).not.toBeNull()
    expect(document.getElementById(descrito ?? '')?.textContent).toMatch(
      /Campo obligatorio/,
    )
    expect(document.activeElement).toBe(motivo)
  })

  it('completa la revisión y el envío con el teclado', async () => {
    const user = userEvent.setup()
    renderPreview({
      valorInicial: FORMULARIO_ADMINISTRATIVO,
      plazoAdministrativoDias: PLAZO_ADMINISTRATIVO,
      solicitud: { requerimientoId: 'req-9001' as RequerimientoId, version: 7 },
    })

    screen.getByRole('button', { name: 'Continuar' }).focus()
    await user.keyboard('{Enter}')
    expect(
      screen.getByRole('region', { name: 'Revisión y envío' }),
    ).toBeDefined()

    screen.getByRole('button', { name: 'Enviar' }).focus()
    await user.keyboard('{Enter}')

    expect(
      await screen.findByRole('heading', {
        name: '¡Requerimiento enviado para aprobar!',
      }),
    ).toBeDefined()
  })
})

describe('FormularioUx03: guardar borrador', () => {
  it('guarda por el puerto y solo confirma con un resultado confirmado', async () => {
    const user = userEvent.setup()
    const valores = catalogos()
    const base = crearPuertoPreview(valores)
    const comandos: { requerimientoId: string; version: number }[] = []
    const puerto: ComandosRequerimientosPort = {
      ...base,
      guardarBorrador: async (comando) => {
        comandos.push({
          requerimientoId: String(comando.requerimientoId),
          version: comando.version,
        })
        return base.guardarBorrador(comando)
      },
    }
    renderPreview({
      valorInicial: FORMULARIO_ADMINISTRATIVO,
      plazoAdministrativoDias: PLAZO_ADMINISTRATIVO,
      solicitud: { requerimientoId: 'req-9001' as RequerimientoId, version: 7 },
      puerto,
    })

    await user.click(screen.getByRole('button', { name: 'Guardar borrador' }))

    expect(
      (await screen.findAllByText('Borrador guardado correctamente.')).length,
    ).toBeGreaterThan(0)
    expect(screen.getByRole('status').textContent).toContain(
      'Borrador guardado correctamente.',
    )
    expect(screen.queryByRole('heading', { name: /enviado para aprobar/i })).toBeNull()
    expect(comandos).toEqual([
      { requerimientoId: 'req-9001', version: 7 },
    ])

    await user.click(screen.getByRole('button', { name: 'Guardar borrador' }))

    expect(comandos).toHaveLength(2)
    expect(comandos[1]).toEqual({
      requerimientoId: 'req-9001',
      version: 8,
    })
  })

  it('«Guardar borrador» en revisión persiste y mantiene la revisión', async () => {
    const user = userEvent.setup()
    renderPreview({
      valorInicial: FORMULARIO_ADMINISTRATIVO,
      plazoAdministrativoDias: PLAZO_ADMINISTRATIVO,
      solicitud: { requerimientoId: 'req-9001' as RequerimientoId, version: 7 },
    })

    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    await user.click(screen.getByRole('button', { name: 'Guardar borrador' }))

    expect(
      (await screen.findAllByText('Borrador guardado correctamente.')).length,
    ).toBeGreaterThan(0)
    expect(
      screen.getByRole('region', { name: 'Revisión y envío' }),
    ).toBeDefined()
    expect(screen.getByRole('button', { name: 'Enviar' })).toBeDefined()
  })

  it('un fallo conserva los valores, informa y permite reintentar', async () => {
    const user = userEvent.setup()
    const base = crearPuertoPreview(catalogos())
    let intentos = 0
    const puerto: ComandosRequerimientosPort = {
      ...base,
      guardarBorrador: async (comando) => {
        intentos += 1
        if (intentos === 1) {
          return {
            status: 'error',
            error: {
              message: 'No se pudo guardar el borrador en el servidor',
              retryable: true,
            },
          }
        }
        return base.guardarBorrador(comando)
      },
    }
    renderPreview({
      valorInicial: FORMULARIO_ADMINISTRATIVO,
      plazoAdministrativoDias: PLAZO_ADMINISTRATIVO,
      puerto,
    })

    await user.click(screen.getByRole('button', { name: 'Guardar borrador' }))

    const alerta = await screen.findByRole('alert')
    expect(
      within(alerta).getByText('No se pudo guardar el borrador en el servidor'),
    ).toBeDefined()
    expect(screen.queryByText('Borrador guardado correctamente.')).toBeNull()
    expect(
      (screen.getByLabelText('Comentario') as HTMLTextAreaElement).value,
    ).toBe('Cobertura del puesto administrativo de Logística.')

    await user.click(screen.getByRole('button', { name: 'Guardar borrador' }))

    expect(
      (await screen.findAllByText('Borrador guardado correctamente.')).length,
    ).toBeGreaterThan(0)
    expect(intentos).toBe(2)
  })

  it('tras un conflicto al guardar, el reintento usa la versión vigente', async () => {
    const user = userEvent.setup()
    const base = crearPuertoPreview(catalogos())
    const versiones: number[] = []
    const identificadores: string[] = []
    const puerto: ComandosRequerimientosPort = {
      ...base,
      guardarBorrador: async (comando) => {
        versiones.push(comando.version)
        identificadores.push(String(comando.requerimientoId))
        if (versiones.length === 1) {
          return {
            status: 'conflicto-version',
            conflicto: {
              versionEsperada: 7,
              versionVigente: 9,
              datosVigentes: detalleVigente(9, 'req-9100'),
            },
          }
        }
        return base.guardarBorrador(comando)
      },
    }
    renderPreview({
      valorInicial: FORMULARIO_ADMINISTRATIVO,
      plazoAdministrativoDias: PLAZO_ADMINISTRATIVO,
      solicitud: { requerimientoId: 'req-9001' as RequerimientoId, version: 7 },
      puerto,
    })

    await user.click(screen.getByRole('button', { name: 'Guardar borrador' }))
    expect(await screen.findByText(/La versión cambió/)).toBeDefined()

    await user.click(screen.getByRole('button', { name: 'Guardar borrador' }))

    expect(
      (await screen.findAllByText('Borrador guardado correctamente.')).length,
    ).toBeGreaterThan(0)
    expect(versiones).toEqual([7, 9])
    expect(identificadores).toEqual(['req-9001', 'req-9100'])
  })

  it('al guardar conserva el foco en el botón en vez de perderlo al deshabilitarse', async () => {
    const user = userEvent.setup()
    const base = crearPuertoPreview(catalogos())
    let liberar: (() => void) | undefined
    const puerto: ComandosRequerimientosPort = {
      ...base,
      guardarBorrador: (comando) =>
        new Promise((resolve) => {
          liberar = () => resolve(base.guardarBorrador(comando))
        }),
    }
    renderPreview({
      valorInicial: FORMULARIO_ADMINISTRATIVO,
      plazoAdministrativoDias: PLAZO_ADMINISTRATIVO,
      puerto,
    })

    const guardar = screen.getByRole('button', { name: 'Guardar borrador' })
    await user.click(guardar)

    expect(guardar.getAttribute('aria-disabled')).toBe('true')
    expect(document.activeElement).toBe(guardar)

    await act(async () => {
      liberar?.()
    })

    expect(
      (await screen.findAllByText('Borrador guardado correctamente.')).length,
    ).toBeGreaterThan(0)
    expect(guardar.getAttribute('aria-disabled')).toBe('false')
  })
})

describe('FormularioUx03: cancelar edición con confirmación de descarte', () => {
  it('sin cambios no pide confirmación y vuelve al contexto anterior', async () => {
    const user = userEvent.setup()
    let cancelados = 0
    renderPreview({
      valorInicial: FORMULARIO_ADMINISTRATIVO,
      onCancelar: () => (cancelados += 1),
    })

    await user.click(screen.getByRole('button', { name: 'Cancelar edición' }))

    expect(screen.queryByRole('alertdialog')).toBeNull()
    expect(cancelados).toBe(1)
  })

  it('rechazar el descarte conserva formulario y valores', async () => {
    const user = userEvent.setup()
    let cancelados = 0
    renderPreview({
      valorInicial: FORMULARIO_ADMINISTRATIVO,
      onCancelar: () => (cancelados += 1),
    })

    const comentario = screen.getByLabelText('Comentario')
    await user.clear(comentario)
    await user.type(comentario, 'Cambio sin guardar')
    await user.click(screen.getByRole('button', { name: 'Cancelar edición' }))

    expect(
      screen.getByRole('alertdialog', {
        name: '¿Descartar los cambios sin guardar?',
      }),
    ).toBeDefined()

    await user.click(screen.getByRole('button', { name: 'Seguir editando' }))

    expect(screen.queryByRole('alertdialog')).toBeNull()
    expect(
      (screen.getByLabelText('Comentario') as HTMLTextAreaElement).value,
    ).toBe('Cambio sin guardar')
    expect(cancelados).toBe(0)
  })

  it('aceptar el descarte vuelve al contexto anterior sin persistir', async () => {
    const user = userEvent.setup()
    let cancelados = 0
    let guardados = 0
    const base = crearPuertoPreview(catalogos())
    const puerto: ComandosRequerimientosPort = {
      ...base,
      guardarBorrador: async (comando) => {
        guardados += 1
        return base.guardarBorrador(comando)
      },
    }
    renderPreview({
      valorInicial: FORMULARIO_ADMINISTRATIVO,
      onCancelar: () => (cancelados += 1),
      puerto,
    })

    await user.type(screen.getByLabelText('Comentario'), ' sin guardar')
    await user.click(screen.getByRole('button', { name: 'Cancelar edición' }))
    await user.click(screen.getByRole('button', { name: 'Descartar cambios' }))

    expect(cancelados).toBe(1)
    expect(guardados).toBe(0)
  })

  it('Esc cancela el descarte y devuelve el foco al botón que lo abrió', async () => {
    const user = userEvent.setup()
    renderPreview({ valorInicial: FORMULARIO_ADMINISTRATIVO })

    await user.type(screen.getByLabelText('Comentario'), ' sin guardar')
    const boton = screen.getByRole('button', { name: 'Cancelar edición' })
    await user.click(boton)

    const dialogo = screen.getByRole('alertdialog')
    expect(document.activeElement).toBe(
      within(dialogo).getByRole('heading', {
        name: '¿Descartar los cambios sin guardar?',
      }),
    )

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('alertdialog')).toBeNull()
    expect(document.activeElement).toBe(boton)
    expect(
      (screen.getByLabelText('Comentario') as HTMLTextAreaElement).value,
    ).toBe('Cobertura del puesto administrativo de Logística. sin guardar')
  })

  it('al aceptar el descarte desde el modal, el foco vuelve al control que lo abrió', async () => {
    const user = userEvent.setup()
    render(
      <PreviewConApertura valorInicial={FORMULARIO_ADMINISTRATIVO} />,
    )
    const abrir = screen.getByRole('button', { name: 'Abrir formulario' })
    await user.click(abrir)

    await user.type(screen.getByLabelText('Comentario'), ' sin guardar')
    await user.click(screen.getByRole('button', { name: 'Cancelar edición' }))
    await user.click(screen.getByRole('button', { name: 'Descartar cambios' }))

    expect(screen.queryByRole('dialog')).toBeNull()
    expect(document.activeElement).toBe(abrir)
  })

  it('aceptar el descarte cierra el diálogo y restaura los valores de partida sin depender del padre', async () => {
    const user = userEvent.setup()
    renderPreview({ valorInicial: FORMULARIO_ADMINISTRATIVO })

    const comentario = screen.getByLabelText('Comentario') as HTMLTextAreaElement
    await user.clear(comentario)
    await user.type(comentario, 'Cambio descartable')
    const cancelar = screen.getByRole('button', { name: 'Cancelar edición' })
    await user.click(cancelar)
    await user.click(screen.getByRole('button', { name: 'Descartar cambios' }))

    expect(screen.queryByRole('alertdialog')).toBeNull()
    expect(
      (screen.getByLabelText('Comentario') as HTMLTextAreaElement).value,
    ).toBe('Cobertura del puesto administrativo de Logística.')
    expect(document.activeElement).toBe(cancelar)
  })

  it('mantiene el tabulador dentro del descarte en ambos sentidos, sin alcanzar el fondo', async () => {
    const user = userEvent.setup()
    renderPreview({ valorInicial: FORMULARIO_ADMINISTRATIVO })

    await user.type(screen.getByLabelText('Comentario'), ' sin guardar')
    await user.click(screen.getByRole('button', { name: 'Cancelar edición' }))

    const dialogo = screen.getByRole('alertdialog')
    const fondo = screen.getByRole('dialog', { hidden: true })
    expect(fondo.hasAttribute('inert')).toBe(true)
    expect(fondo.getAttribute('aria-modal')).toBeNull()
    expect(dialogo.getAttribute('aria-modal')).toBe('true')

    const seguir = within(dialogo).getByRole('button', { name: 'Seguir editando' })
    const descartar = within(dialogo).getByRole('button', {
      name: 'Descartar cambios',
    })

    descartar.focus()
    fireEvent.keyDown(descartar, { key: 'Tab' })
    expect(document.activeElement).toBe(seguir)

    seguir.focus()
    fireEvent.keyDown(seguir, { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(descartar)
    expect(dialogo.contains(document.activeElement)).toBe(true)
  })

  it('Shift+Tab desde el título del descarte va al último control, no al documento', async () => {
    const user = userEvent.setup()
    renderPreview({ valorInicial: FORMULARIO_ADMINISTRATIVO })

    await user.type(screen.getByLabelText('Comentario'), ' sin guardar')
    await user.click(screen.getByRole('button', { name: 'Cancelar edición' }))

    const dialogo = screen.getByRole('alertdialog')
    const titulo = within(dialogo).getByRole('heading', {
      name: '¿Descartar los cambios sin guardar?',
    })
    expect(document.activeElement).toBe(titulo)

    fireEvent.keyDown(titulo, { key: 'Tab', shiftKey: true })

    expect(document.activeElement).toBe(
      within(dialogo).getByRole('button', { name: 'Descartar cambios' }),
    )
    expect(dialogo.contains(document.activeElement)).toBe(true)
  })

  it('un clic en el velo del descarte devuelve el foco dentro del diálogo', async () => {
    const user = userEvent.setup()
    renderPreview({ valorInicial: FORMULARIO_ADMINISTRATIVO })

    await user.type(screen.getByLabelText('Comentario'), ' sin guardar')
    await user.click(screen.getByRole('button', { name: 'Cancelar edición' }))

    const dialogo = screen.getByRole('alertdialog')
    const velo = dialogo.parentElement
    expect(velo).not.toBeNull()
    ;(document.activeElement as HTMLElement | null)?.blur()
    expect(document.activeElement).toBe(document.body)

    fireEvent.click(velo as HTMLElement)

    expect(document.activeElement).toBe(
      within(dialogo).getByRole('heading', {
        name: '¿Descartar los cambios sin guardar?',
      }),
    )
    expect(dialogo.contains(document.activeElement)).toBe(true)
  })

  it('si el descarte se abre con Esc, rechazarlo devuelve el foco al control que lo tenía', async () => {
    const user = userEvent.setup()
    renderPreview({ valorInicial: FORMULARIO_ADMINISTRATIVO })

    const comentario = screen.getByLabelText('Comentario')
    await user.click(comentario)
    await user.type(comentario, ' sin guardar')
    expect(document.activeElement).toBe(comentario)

    await user.keyboard('{Escape}')
    expect(screen.getByRole('alertdialog')).toBeDefined()
    expect(document.activeElement).toBe(
      screen.getByRole('heading', { name: '¿Descartar los cambios sin guardar?' }),
    )

    await user.click(screen.getByRole('button', { name: 'Seguir editando' }))

    expect(screen.queryByRole('alertdialog')).toBeNull()
    expect(document.activeElement).toBe(comentario)
  })
})

describe('FormularioUx03: conflicto de versión en el envío', () => {
  it('el reintento adopta la versión vigente devuelta por el conflicto', async () => {
    const user = userEvent.setup()
    const base = crearPuertoPreview(catalogos())
    const versiones: number[] = []
    const identificadores: string[] = []
    const puerto: ComandosRequerimientosPort = {
      ...base,
      enviarAprobacion: async (comando) => {
        versiones.push(comando.version)
        identificadores.push(String(comando.requerimientoId))
        if (versiones.length === 1) {
          return {
            status: 'conflicto-version',
            conflicto: {
              versionEsperada: 7,
              versionVigente: 9,
              datosVigentes: detalleVigente(9, 'req-9100'),
            },
          }
        }
        return base.enviarAprobacion(comando)
      },
    }
    renderPreview({
      valorInicial: FORMULARIO_ADMINISTRATIVO,
      plazoAdministrativoDias: PLAZO_ADMINISTRATIVO,
      solicitud: { requerimientoId: 'req-9001' as RequerimientoId, version: 7 },
      puerto,
    })

    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    await user.click(screen.getByRole('button', { name: 'Enviar' }))

    expect(await screen.findByText(/La versión cambió/)).toBeDefined()

    await user.click(screen.getByRole('button', { name: 'Enviar' }))

    expect(
      await screen.findByRole('heading', {
        name: '¡Requerimiento enviado para aprobar!',
      }),
    ).toBeDefined()
    expect(versiones).toEqual([7, 9])
    expect(identificadores).toEqual(['req-9001', 'req-9100'])
  })
})

describe('FormularioUx03: una sola operación en curso', () => {
  it('no dispara dos guardados aunque se vuelva a pulsar mientras guarda', async () => {
    const user = userEvent.setup()
    const base = crearPuertoPreview(catalogos())
    let llamadas = 0
    let liberar: (() => void) | undefined
    const puerto: ComandosRequerimientosPort = {
      ...base,
      guardarBorrador: (comando) => {
        llamadas += 1
        return new Promise((resolve) => {
          liberar = () => resolve(base.guardarBorrador(comando))
        })
      },
    }
    renderPreview({
      valorInicial: FORMULARIO_ADMINISTRATIVO,
      plazoAdministrativoDias: PLAZO_ADMINISTRATIVO,
      puerto,
    })

    const guardar = screen.getByRole('button', { name: 'Guardar borrador' })
    await user.click(guardar)
    fireEvent.click(guardar)

    expect(llamadas).toBe(1)

    await act(async () => {
      liberar?.()
    })
    expect(llamadas).toBe(1)
  })

  it('no dispara dos envíos aunque se vuelva a pulsar mientras envía', async () => {
    const user = userEvent.setup()
    const base = crearPuertoPreview(catalogos())
    let llamadas = 0
    let liberar: (() => void) | undefined
    const puerto: ComandosRequerimientosPort = {
      ...base,
      enviarAprobacion: (comando) => {
        llamadas += 1
        return new Promise((resolve) => {
          liberar = () => resolve(base.enviarAprobacion(comando))
        })
      },
    }
    renderPreview({
      valorInicial: FORMULARIO_ADMINISTRATIVO,
      plazoAdministrativoDias: PLAZO_ADMINISTRATIVO,
      solicitud: { requerimientoId: 'req-9001' as RequerimientoId, version: 7 },
      puerto,
    })

    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    const enviar = screen.getByRole('button', { name: 'Enviar' })
    await user.click(enviar)
    fireEvent.click(enviar)

    expect(llamadas).toBe(1)

    await act(async () => {
      liberar?.()
    })
    expect(llamadas).toBe(1)
  })
})
