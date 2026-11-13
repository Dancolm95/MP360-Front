/** @vitest-environment jsdom */
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Capability } from '../../../../shared'
import { createDeferred, createInMemoryStore } from '../../../../container/fixtures'
import { CAP_RRHH_REQUERIMIENTOS_READ } from '../../identifiers'
import type {
  AlertaPlazo,
  Area,
  AreaId,
  AutorizacionRequerimiento,
  CalendarioLaboralId,
  CampoOrdenBandeja,
  CatalogosRequerimientos,
  Departamento,
  DepartamentoId,
  DuracionAplicable,
  Empresa,
  EmpresaId,
  FechaISO,
  InstanteISO,
  PaginaRequerimientos,
  Puesto,
  PuestoId,
  RequerimientoId,
  ResultadoConsultaBandeja,
  ResumenRequerimiento,
  ResumenRequerimientoBorrador,
  ResumenRequerimientoCompleto,
  Subarea,
  SubareaId,
  Usuario,
  UsuarioId,
} from '../contracts'
import {
  createMockBandejaRequerimientos,
  lecturaFixture,
  type MockBandejaRequerimientosPort,
} from '../fixtures'
import { crearStoreContextoBandeja, type ContextoBandeja, type SeleccionRequerimiento } from '../state'
import { BandejaRequerimientos } from './BandejaRequerimientos'

afterEach(cleanup)

const capability = CAP_RRHH_REQUERIMIENTOS_READ as Capability

const empresaA: Empresa = {
  id: 'empresa-a' as EmpresaId,
  nombre: 'Empresa A',
}
const empresaB: Empresa = {
  id: 'empresa-b' as EmpresaId,
  nombre: 'Empresa B',
}
const departamentoA: Departamento = {
  id: 'departamento-a' as DepartamentoId,
  nombre: 'Departamento A',
}
const areaA: Area = {
  id: 'area-a' as AreaId,
  nombre: 'Área A',
  departamentoId: departamentoA.id,
}
const areaB: Area = {
  id: 'area-b' as AreaId,
  nombre: 'Área B',
  departamentoId: departamentoA.id,
}
const subareaA: Subarea = {
  id: 'subarea-a' as SubareaId,
  nombre: 'Subárea A',
  areaId: areaA.id,
}
const subareaB: Subarea = {
  id: 'subarea-b' as SubareaId,
  nombre: 'Subárea B',
  areaId: areaB.id,
}
const puestoA: Puesto = {
  id: 'puesto-a' as PuestoId,
  nombre: 'Puesto A',
  areaId: areaA.id,
  subareaId: subareaA.id,
  clasificacion: 'operativo',
}
const puestoB: Puesto = {
  id: 'puesto-b' as PuestoId,
  nombre: 'Puesto B',
  areaId: areaB.id,
  subareaId: subareaB.id,
  clasificacion: 'administrativo',
}
const usuarioA: Usuario = {
  id: 'usuario-a' as UsuarioId,
  nombre: 'Usuario A',
}
const usuarioB: Usuario = {
  id: 'usuario-b' as UsuarioId,
  nombre: 'Usuario B',
}

const catalogos: CatalogosRequerimientos = {
  motivos: [
    { motivo: 'reemplazo', etiqueta: 'Reemplazo' },
    { motivo: 'nueva-vacante', etiqueta: 'Nueva Vacante' },
    { motivo: 'practicante', etiqueta: 'Practicante' },
    { motivo: 'otros', etiqueta: 'Otros' },
  ],
  empresas: [empresaA, empresaB],
  departamentos: [departamentoA],
  areas: [areaA, areaB],
  subareas: [subareaA, subareaB],
  puestos: [puestoA, puestoB],
  departamentosUbicacion: [],
  provincias: [],
  distritos: [],
  usuariosProximaTarea: [usuarioA, usuarioB],
  usuarioProximaTareaPredeterminado: usuarioA.id,
  calendarioLaboral: {
    id: 'calendario-1' as CalendarioLaboralId,
    diasHabiles: [],
    excepciones: [],
  },
}

const alertaCritica: AlertaPlazo = {
  nivel: 'critica',
  umbral: { tipo: 'dias-fijos', clasificacion: 'operativo', diaHabil: 9 },
  diaHabil: 9,
  fecha: '2026-01-09' as FechaISO,
}

function autorizacion(id: RequerimientoId): AutorizacionRequerimiento {
  return {
    requerimientoId: id,
    version: 1,
    capacidades: [capability],
    accionesPermitidas: [],
  }
}

function filaCompleta(
  overrides: Partial<ResumenRequerimientoCompleto> = {},
): ResumenRequerimientoCompleto {
  const id = overrides.id ?? ('req-1' as RequerimientoId)
  return {
    id,
    version: 1,
    fechaCreacion: '2026-01-02T10:00:00Z' as InstanteISO,
    estado: 'aprobado',
    motivo: 'nueva-vacante',
    empresa: empresaA,
    puesto: puestoA,
    solicitadas: 2,
    cubiertas: 1,
    pendientes: 1,
    fechaObjetivo: '2026-01-20' as FechaISO,
    duracionAplicable: null,
    responsable: usuarioA,
    alerta: null,
    autorizacion: autorizacion(id),
    ...overrides,
  }
}

function filaBorrador(
  overrides: Partial<ResumenRequerimientoBorrador> = {},
): ResumenRequerimientoBorrador {
  const id = overrides.id ?? ('req-borrador' as RequerimientoId)
  return {
    id,
    version: 1,
    fechaCreacion: '2026-01-01T09:00:00Z' as InstanteISO,
    estado: 'borrador',
    motivo: null,
    empresa: null,
    puesto: null,
    solicitadas: null,
    cubiertas: null,
    pendientes: null,
    fechaObjetivo: null,
    duracionAplicable: null,
    responsable: null,
    alerta: null,
    autorizacion: autorizacion(id),
    ...overrides,
  }
}

function pagina(
  elementos: readonly ResumenRequerimiento[],
  overrides: Partial<PaginaRequerimientos> = {},
): PaginaRequerimientos {
  return {
    elementos,
    total: elementos.length,
    pagina: 1,
    tamanoPagina: 10,
    capacidades: { capacidades: [capability], accionesPermitidas: [] },
    ...overrides,
  }
}

function renderBandeja(
  port: MockBandejaRequerimientosPort,
  opciones: {
    readonly solicitantes?: readonly Usuario[]
    readonly tamanosPagina?: readonly number[]
    readonly tamanoPaginaInicial?: number
    readonly contextoInicial?: ContextoBandeja
    readonly onContextoCambia?: (contexto: ContextoBandeja) => void
    readonly onAbrirDetalle?: (seleccion: SeleccionRequerimiento) => void
  } = {},
) {
  return render(
    <BandejaRequerimientos
      port={port}
      catalogos={catalogos}
      solicitantes={opciones.solicitantes ?? [usuarioA, usuarioB]}
      tamanoPaginaInicial={opciones.tamanoPaginaInicial ?? 10}
      tamanosPagina={opciones.tamanosPagina ?? [10, 25]}
      contextoInicial={opciones.contextoInicial}
      onContextoCambia={opciones.onContextoCambia}
      onAbrirDetalle={opciones.onAbrirDetalle}
    />,
  )
}

describe('consulta inicial y filtros (RH-REQ-01 §7.1, §10-13)', () => {
  it('consulta con orden de creación descendente y tamaño inicial sin filtros', async () => {
    const port = createMockBandejaRequerimientos(
      lecturaFixture.ok(pagina([filaCompleta()])),
    )
    renderBandeja(port)

    expect(await screen.findByRole('table')).toBeDefined()
    expect(port.calls).toHaveLength(1)
    expect(port.calls[0]).toEqual({
      filtros: {},
      orden: { campo: 'fecha-creacion', direccion: 'desc' },
      paginacion: { pagina: 1, tamanoPagina: 10 },
    })
    // El desempate estable por ID lo aplica el backend; el puerto recibe solo campo y dirección.
    expect(Object.keys(port.calls[0].orden).sort()).toEqual([
      'campo',
      'direccion',
    ])
    expect(
      screen
        .getByRole('columnheader', { name: 'Fecha de creación' })
        .getAttribute('aria-sort'),
    ).toBe('descending')
  })

  it('envía todos los filtros y el periodo por fecha de aprobación', async () => {
    const port = createMockBandejaRequerimientos(
      lecturaFixture.ok(pagina([filaCompleta()])),
    )
    const user = userEvent.setup()
    renderBandeja(port)
    await screen.findByRole('table')

    expect(screen.getByLabelText('Estado')).toBeDefined()
    expect(screen.getByLabelText('Motivo')).toBeDefined()
    expect(screen.getByLabelText('Empresa')).toBeDefined()
    expect(screen.getByLabelText('Área')).toBeDefined()
    expect(screen.getByLabelText('Subárea')).toBeDefined()
    expect(screen.getByLabelText('Puesto')).toBeDefined()
    expect(screen.getByLabelText('Solicitante')).toBeDefined()
    expect(screen.getByLabelText('Aprobado desde')).toBeDefined()
    expect(screen.getByLabelText('Aprobado hasta')).toBeDefined()

    await user.selectOptions(screen.getByLabelText('Estado'), 'aprobado')
    await user.selectOptions(screen.getByLabelText('Motivo'), 'reemplazo')
    await user.selectOptions(
      screen.getByLabelText('Empresa'),
      String(empresaA.id),
    )
    await user.selectOptions(screen.getByLabelText('Área'), String(areaA.id))
    await user.selectOptions(
      screen.getByLabelText('Subárea'),
      String(subareaA.id),
    )
    await user.selectOptions(
      screen.getByLabelText('Puesto'),
      String(puestoA.id),
    )
    await user.selectOptions(
      screen.getByLabelText('Solicitante'),
      String(usuarioB.id),
    )
    fireEvent.change(screen.getByLabelText('Aprobado desde'), {
      target: { value: '2026-01-01' },
    })
    fireEvent.change(screen.getByLabelText('Aprobado hasta'), {
      target: { value: '2026-01-31' },
    })
    await user.click(screen.getByRole('button', { name: 'Aplicar filtros' }))

    await waitFor(() => expect(port.calls).toHaveLength(2))
    expect(port.calls[1]).toEqual({
      filtros: {
        estados: ['aprobado'],
        motivos: ['reemplazo'],
        empresas: [empresaA.id],
        areas: [areaA.id],
        subareas: [subareaA.id],
        puestos: [puestoA.id],
        solicitantes: [usuarioB.id],
        periodoAprobacion: { desde: '2026-01-01', hasta: '2026-01-31' },
      },
      orden: { campo: 'fecha-creacion', direccion: 'desc' },
      paginacion: { pagina: 1, tamanoPagina: 10 },
    })
  })

  it('no aplica un periodo incompleto, asocia el error al control y enfoca el campo que falta', async () => {
    const port = createMockBandejaRequerimientos(
      lecturaFixture.ok(pagina([filaCompleta()])),
    )
    const user = userEvent.setup()
    renderBandeja(port)
    await screen.findByRole('table')

    fireEvent.change(screen.getByLabelText('Aprobado desde'), {
      target: { value: '2026-01-01' },
    })
    await user.click(screen.getByRole('button', { name: 'Aplicar filtros' }))

    expect(port.calls).toHaveLength(1)
    const alerta = screen.getByRole('alert')
    expect(alerta.textContent).toContain('Indica ambas fechas')
    const desde = screen.getByLabelText('Aprobado desde')
    const hasta = screen.getByLabelText('Aprobado hasta')
    expect(desde.getAttribute('aria-invalid')).toBe('true')
    expect(hasta.getAttribute('aria-invalid')).toBe('true')
    expect(desde.getAttribute('aria-describedby')).toContain(alerta.id)
    expect(hasta.getAttribute('aria-describedby')).toContain(alerta.id)
    expect(document.activeElement).toBe(hasta)

    fireEvent.change(hasta, { target: { value: '2026-01-31' } })
    expect(screen.queryByRole('alert')).toBeNull()
    expect(
      screen.getByLabelText('Aprobado desde').getAttribute('aria-invalid'),
    ).toBeNull()
  })

  it('focaliza «Aprobado desde» cuando el rango está invertido', async () => {
    const port = createMockBandejaRequerimientos(
      lecturaFixture.ok(pagina([filaCompleta()])),
    )
    const user = userEvent.setup()
    renderBandeja(port)
    await screen.findByRole('table')

    fireEvent.change(screen.getByLabelText('Aprobado desde'), {
      target: { value: '2026-03-01' },
    })
    fireEvent.change(screen.getByLabelText('Aprobado hasta'), {
      target: { value: '2026-01-31' },
    })
    await user.click(screen.getByRole('button', { name: 'Aplicar filtros' }))

    expect(port.calls).toHaveLength(1)
    expect(screen.getByRole('alert').textContent).toContain(
      'no puede ser posterior',
    )
    expect(document.activeElement).toBe(screen.getByLabelText('Aprobado desde'))
  })

  it('limpia subárea y puesto incompatibles al cambiar de área', async () => {
    const port = createMockBandejaRequerimientos(
      lecturaFixture.ok(pagina([filaCompleta()])),
    )
    const user = userEvent.setup()
    renderBandeja(port)
    await screen.findByRole('table')

    await user.selectOptions(screen.getByLabelText('Área'), String(areaA.id))
    await user.selectOptions(
      screen.getByLabelText('Subárea'),
      String(subareaA.id),
    )
    await user.selectOptions(
      screen.getByLabelText('Puesto'),
      String(puestoA.id),
    )
    await user.selectOptions(screen.getByLabelText('Área'), String(areaB.id))

    expect((screen.getByLabelText('Subárea') as HTMLSelectElement).value).toBe(
      '',
    )
    expect((screen.getByLabelText('Puesto') as HTMLSelectElement).value).toBe(
      '',
    )
  })
})

const COLUMNAS_ORDEN: readonly {
  readonly campo: CampoOrdenBandeja
  readonly etiqueta: string
}[] = [
  { campo: 'id', etiqueta: 'ID' },
  { campo: 'fecha-creacion', etiqueta: 'Fecha de creación' },
  { campo: 'motivo', etiqueta: 'Motivo' },
  { campo: 'empresa', etiqueta: 'Empresa' },
  { campo: 'puesto', etiqueta: 'Puesto' },
  { campo: 'solicitadas', etiqueta: 'Solicitadas' },
  { campo: 'cubiertas', etiqueta: 'Cubiertas' },
  { campo: 'pendientes', etiqueta: 'Pendientes' },
  { campo: 'estado', etiqueta: 'Estado' },
  { campo: 'fecha-objetivo', etiqueta: 'Fecha objetivo' },
  { campo: 'responsable', etiqueta: 'Responsable' },
]

describe('orden por columnas y ausentes (RH-REQ-01 §7.1, §10-13)', () => {
  it.each(COLUMNAS_ORDEN)(
    'envía el orden por $etiqueta y expone aria-sort',
    async ({ campo, etiqueta }) => {
      const port = createMockBandejaRequerimientos(
        lecturaFixture.ok(pagina([filaCompleta()])),
      )
      const user = userEvent.setup()
      renderBandeja(port)
      await screen.findByRole('table')

      await user.click(
        screen.getByRole('button', { name: `Ordenar por ${etiqueta}` }),
      )
      await waitFor(() => expect(port.calls).toHaveLength(2))
      expect(port.calls[1].orden).toEqual({ campo, direccion: 'asc' })
      expect(
        screen
          .getByRole('columnheader', { name: etiqueta })
          .getAttribute('aria-sort'),
      ).toBe('ascending')

      await user.click(
        screen.getByRole('button', { name: `Ordenar por ${etiqueta}` }),
      )
      await waitFor(() => expect(port.calls).toHaveLength(3))
      expect(port.calls[2].orden).toEqual({ campo, direccion: 'desc' })
      expect(
        screen
          .getByRole('columnheader', { name: etiqueta })
          .getAttribute('aria-sort'),
      ).toBe('descending')
    },
  )

  it('conserva el orden devuelto y no reordena localmente los ausentes', async () => {
    const sinFecha = filaCompleta({
      id: 'req-2' as RequerimientoId,
      estado: 'pendiente-aprobacion',
      fechaObjetivo: null,
    })
    const conFecha = filaCompleta({
      id: 'req-1' as RequerimientoId,
      fechaObjetivo: '2026-01-20' as FechaISO,
    })
    const port = createMockBandejaRequerimientos(
      lecturaFixture.ok(pagina([sinFecha, conFecha])),
    )
    const user = userEvent.setup()
    renderBandeja(port)
    await screen.findByRole('table')

    const filasIniciales = within(screen.getByRole('table'))
      .getAllByRole('row')
      .slice(1)
    expect(filasIniciales[0].textContent).toContain('req-2')
    expect(filasIniciales[1].textContent).toContain('req-1')
    expect(filasIniciales[0].textContent).toContain('Sin fecha')

    await user.click(
      screen.getByRole('button', { name: 'Ordenar por Fecha objetivo' }),
    )
    await waitFor(() => expect(port.calls).toHaveLength(2))
    expect(port.calls[1].orden).toEqual({
      campo: 'fecha-objetivo',
      direccion: 'asc',
    })

    const filasTrasOrden = within(screen.getByRole('table'))
      .getAllByRole('row')
      .slice(1)
    expect(filasTrasOrden[0].textContent).toContain('req-2')
    expect(filasTrasOrden[1].textContent).toContain('req-1')

    await user.click(
      screen.getByRole('button', { name: 'Ordenar por Fecha objetivo' }),
    )
    await waitFor(() => expect(port.calls).toHaveLength(3))
    expect(port.calls[2].orden).toEqual({
      campo: 'fecha-objetivo',
      direccion: 'desc',
    })

    const filasDescendente = within(screen.getByRole('table'))
      .getAllByRole('row')
      .slice(1)
    expect(filasDescendente[0].textContent).toContain('req-2')
    expect(filasDescendente[1].textContent).toContain('req-1')
  })
})

describe('paginación y total (RH-REQ-01 §7.1)', () => {
  it('navega páginas y cambia el tamaño con la misma consulta', async () => {
    const port = createMockBandejaRequerimientos((consulta) =>
      lecturaFixture.ok({
        elementos: [filaCompleta({ id: 'req-1' as RequerimientoId })],
        total: 25,
        pagina: consulta.paginacion.pagina,
        tamanoPagina: consulta.paginacion.tamanoPagina,
        capacidades: { capacidades: [capability], accionesPermitidas: [] },
      }),
    )
    const user = userEvent.setup()
    renderBandeja(port)
    await screen.findByRole('table')

    expect(screen.getByText(/25 requerimientos/)).toBeDefined()
    const navInicial = screen.getByRole('navigation', {
      name: 'Paginación de requerimientos',
    })
    expect(within(navInicial).getByText('Página 1 de 3')).toBeDefined()
    expect(screen.getAllByText('Página 1 de 3')).toHaveLength(1)
    expect(
      screen
        .getByRole('button', { name: 'Página anterior' })
        .hasAttribute('disabled'),
    ).toBe(true)

    await user.click(screen.getByRole('button', { name: 'Página siguiente' }))
    await waitFor(() => expect(port.calls).toHaveLength(2))
    expect(port.calls[1].paginacion).toEqual({ pagina: 2, tamanoPagina: 10 })
    expect(
      await within(
        screen.getByRole('navigation', {
          name: 'Paginación de requerimientos',
        }),
      ).findByText('Página 2 de 3'),
    ).toBeDefined()

    await user.selectOptions(
      screen.getByLabelText('Elementos por página'),
      '25',
    )
    await waitFor(() => expect(port.calls).toHaveLength(3))
    expect(port.calls[2].paginacion).toEqual({ pagina: 1, tamanoPagina: 25 })
    expect(
      await within(
        screen.getByRole('navigation', {
          name: 'Paginación de requerimientos',
        }),
      ).findByText('Página 1 de 1'),
    ).toBeDefined()
  })

  it('no inventa tamaños de página si el consumidor no los aporta', async () => {
    const port = createMockBandejaRequerimientos(
      lecturaFixture.ok(pagina([filaCompleta()])),
    )
    renderBandeja(port, { tamanosPagina: [] })
    await screen.findByRole('table')
    expect(screen.queryByLabelText('Elementos por página')).toBeNull()
  })
})

describe('columnas y estados de la fila (RH-REQ-01 §7.1, §10-13 y §10-24)', () => {
  it('muestra «Sin asignar» sin tarea pendiente o sin asignación y no infiere otro actor', async () => {
    const sinTarea = filaCompleta({
      id: 'req-1' as RequerimientoId,
      estado: 'aprobado',
      responsable: null,
    })
    const sinAsignacion = filaCompleta({
      id: 'req-2' as RequerimientoId,
      estado: 'en-reclutamiento',
      responsable: null,
    })
    const conResponsable = filaCompleta({
      id: 'req-3' as RequerimientoId,
      responsable: usuarioA,
    })
    const port = createMockBandejaRequerimientos(
      lecturaFixture.ok(pagina([sinTarea, sinAsignacion, conResponsable])),
    )
    renderBandeja(port)
    await screen.findByRole('table')

    const tabla = within(screen.getByRole('table'))
    expect(tabla.getAllByText('Sin asignar')).toHaveLength(2)
    expect(tabla.getByText('Usuario A')).toBeDefined()
  })

  it('muestra la duración aplicable antes de aprobar y la fecha solo tras aprobar', async () => {
    const borradorOperativo = filaBorrador({
      id: 'req-1' as RequerimientoId,
      duracionAplicable: {
        clasificacion: 'operativo',
        diasHabiles: 10,
      } satisfies DuracionAplicable,
    })
    const pendienteAdministrativo = filaCompleta({
      id: 'req-2' as RequerimientoId,
      estado: 'pendiente-aprobacion',
      fechaObjetivo: null,
      duracionAplicable: {
        clasificacion: 'administrativo',
        diasHabiles: 20,
      } satisfies DuracionAplicable,
    })
    const pendienteSinPlazo = filaCompleta({
      id: 'req-3' as RequerimientoId,
      estado: 'observado',
      fechaObjetivo: null,
      duracionAplicable: {
        clasificacion: 'administrativo',
        diasHabiles: null,
      } satisfies DuracionAplicable,
    })
    const aprobado = filaCompleta({
      id: 'req-4' as RequerimientoId,
      estado: 'aprobado',
      fechaObjetivo: '2026-01-20' as FechaISO,
    })
    const port = createMockBandejaRequerimientos(
      lecturaFixture.ok(
        pagina([
          borradorOperativo,
          pendienteAdministrativo,
          pendienteSinPlazo,
          aprobado,
        ]),
      ),
    )
    renderBandeja(port)
    await screen.findByRole('table')

    const tabla = within(screen.getByRole('table'))
    const filas = tabla.getAllByRole('row').slice(1)
    const indiceFechaObjetivo = COLUMNAS_ORDEN.findIndex(
      ({ campo }) => campo === 'fecha-objetivo',
    )
    const celdaObjetivo = (fila: HTMLElement) =>
      within(fila).getAllByRole('cell')[indiceFechaObjetivo].textContent

    expect(celdaObjetivo(filas[0])).toContain('10 días hábiles')
    expect(celdaObjetivo(filas[1])).toContain('20 días hábiles')
    expect(celdaObjetivo(filas[2])).toContain('Plazo pendiente de definir')
    expect(celdaObjetivo(filas[3])).toContain('20/01/2026')
    expect(celdaObjetivo(filas[0])).not.toMatch(/\d{2}\/\d{2}\/\d{4}/)
    expect(celdaObjetivo(filas[1])).not.toMatch(/\d{2}\/\d{2}\/\d{4}/)
    expect(celdaObjetivo(filas[2])).not.toMatch(/\d{2}\/\d{2}\/\d{4}/)
    expect(
      tabla.getAllByText('La fecha objetivo se calcula al aprobar.'),
    ).toHaveLength(3)
  })

  it('no inventa fecha objetivo cuando no se conoce la clasificación', async () => {
    const borrador = filaBorrador({ id: 'req-1' as RequerimientoId })
    const port = createMockBandejaRequerimientos(
      lecturaFixture.ok(pagina([borrador])),
    )
    renderBandeja(port)
    await screen.findByRole('table')

    const fila = within(screen.getByRole('table'))
      .getAllByRole('row')
      .slice(1)[0]
    const indiceFechaObjetivo = COLUMNAS_ORDEN.findIndex(
      ({ campo }) => campo === 'fecha-objetivo',
    )
    const celdaObjetivo =
      within(fila).getAllByRole('cell')[indiceFechaObjetivo].textContent
    expect(celdaObjetivo).toContain('Sin fecha')
    expect(celdaObjetivo).not.toMatch(/\d{2}\/\d{2}\/\d{4}/)
  })

  it('muestra la alerta separada del estado canónico y nunca «Urgente» como estado', async () => {
    const port = createMockBandejaRequerimientos(
      lecturaFixture.ok(
        pagina([
          filaCompleta({
            estado: 'aprobado',
            alerta: alertaCritica,
          }),
        ]),
      ),
    )
    renderBandeja(port)
    await screen.findByRole('table')

    const tabla = within(screen.getByRole('table'))
    expect(tabla.getByText('Aprobado')).toBeDefined()
    expect(tabla.getByText(/Alerta: Crítica/)).toBeDefined()
    expect(tabla.queryByText('Urgente')).toBeNull()
  })
})

describe('estados de interfaz (RH-REQ-01 §8)', () => {
  it('muestra carga sin datos anteriores y luego la nueva consulta', async () => {
    const deferred = createDeferred<ResultadoConsultaBandeja>()
    let llamadas = 0
    const port = createMockBandejaRequerimientos(() => {
      llamadas += 1
      return llamadas === 1
        ? lecturaFixture.ok(
            pagina([filaCompleta({ id: 'req-1' as RequerimientoId })]),
          )
        : deferred.promise
    })
    const user = userEvent.setup()
    renderBandeja(port)
    await screen.findByRole('table')
    expect(screen.getByText('req-1')).toBeDefined()

    await user.selectOptions(screen.getByLabelText('Estado'), 'aprobado')
    await user.click(screen.getByRole('button', { name: 'Aplicar filtros' }))

    expect(screen.getByRole('status').textContent).toContain(
      'Cargando requerimientos',
    )
    expect(screen.queryByRole('table')).toBeNull()
    expect(screen.queryByText('req-1')).toBeNull()

    deferred.resolve(
      lecturaFixture.ok(
        pagina([filaCompleta({ id: 'req-2' as RequerimientoId })]),
      ),
    )
    expect(await screen.findByText('req-2')).toBeDefined()
    expect(screen.queryByText('req-1')).toBeNull()
  })

  it('distingue lista vacía de filtros sin resultados', async () => {
    const port = createMockBandejaRequerimientos(
      lecturaFixture.ok(pagina([], { total: 0 })),
    )
    const user = userEvent.setup()
    renderBandeja(port)

    expect(
      await screen.findByText('No hay requerimientos registrados.'),
    ).toBeDefined()

    await user.selectOptions(screen.getByLabelText('Estado'), 'aprobado')
    await user.click(screen.getByRole('button', { name: 'Aplicar filtros' }))

    expect(
      await screen.findByText(
        'No hay requerimientos que coincidan con los filtros.',
      ),
    ).toBeDefined()
  })

  it('muestra error recuperable y reintenta la misma consulta', async () => {
    let llamadas = 0
    const port = createMockBandejaRequerimientos(() => {
      llamadas += 1
      return llamadas === 1
        ? lecturaFixture.error<PaginaRequerimientos>({
            message: 'Fallo temporal',
            retryable: true,
          })
        : lecturaFixture.ok(pagina([filaCompleta()]))
    })
    const user = userEvent.setup()
    renderBandeja(port)

    const alerta = await screen.findByRole('alert')
    expect(alerta.textContent).toContain('Fallo temporal')
    await user.click(screen.getByRole('button', { name: 'Reintentar' }))

    expect(await screen.findByRole('table')).toBeDefined()
    expect(port.calls).toHaveLength(2)
    expect(port.calls[1]).toEqual(port.calls[0])
  })

  it('trata el rechazo de la consulta como error recuperable', async () => {
    let llamadas = 0
    const port = createMockBandejaRequerimientos(() => {
      llamadas += 1
      if (llamadas === 1) throw new Error('Fallo de red')
      return lecturaFixture.ok(pagina([filaCompleta()]))
    })
    const user = userEvent.setup()
    renderBandeja(port)

    const alerta = await screen.findByRole('alert')
    expect(alerta.textContent).toContain(
      'No se pudieron cargar los requerimientos.',
    )
    await user.click(screen.getByRole('button', { name: 'Reintentar' }))

    expect(await screen.findByRole('table')).toBeDefined()
    expect(port.calls).toHaveLength(2)
  })

  it('no ofrece reintento si el error no es recuperable', async () => {
    const port = createMockBandejaRequerimientos(
      lecturaFixture.error<PaginaRequerimientos>({
        message: 'Error terminal',
        retryable: false,
      }),
    )
    renderBandeja(port)

    expect(await screen.findByRole('alert')).toBeDefined()
    expect(screen.queryByRole('button', { name: 'Reintentar' })).toBeNull()
  })

  it('muestra sin permisos sin ofrecer acciones inventadas', async () => {
    const port = createMockBandejaRequerimientos(lecturaFixture.forbidden())
    renderBandeja(port)

    const alerta = await screen.findByRole('alert')
    expect(alerta.textContent).toContain('Sin permisos')
    expect(screen.queryByRole('button', { name: 'Reintentar' })).toBeNull()
    expect(screen.queryByRole('table')).toBeNull()
  })

  it('muestra sesión finalizada sin ofrecer acciones inventadas', async () => {
    const port = createMockBandejaRequerimientos(
      lecturaFixture.sesionFinalizada(),
    )
    renderBandeja(port)

    const alerta = await screen.findByRole('alert')
    expect(alerta.textContent).toContain('La sesión finalizó')
    expect(screen.queryByRole('button', { name: 'Reintentar' })).toBeNull()
  })
})

describe('teclado y accesibilidad (RH-REQ-01 §8)', () => {
  it('ordena y pagina con Enter y Espacio sin reenfocar a mano', async () => {
    const port = createMockBandejaRequerimientos((consulta) =>
      lecturaFixture.ok({
        elementos: [filaCompleta({ id: 'req-1' as RequerimientoId })],
        total: 25,
        pagina: consulta.paginacion.pagina,
        tamanoPagina: consulta.paginacion.tamanoPagina,
        capacidades: { capacidades: [capability], accionesPermitidas: [] },
      }),
    )
    const user = userEvent.setup()
    renderBandeja(port)
    await screen.findByRole('table')

    screen.getByRole('button', { name: 'Ordenar por Motivo' }).focus()
    await user.keyboard('{Enter}')
    await waitFor(() => expect(port.calls).toHaveLength(2))
    expect(port.calls[1].orden).toEqual({ campo: 'motivo', direccion: 'asc' })
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'Ordenar por Motivo' }),
    )

    await user.keyboard(' ')
    await waitFor(() => expect(port.calls).toHaveLength(3))
    expect(port.calls[2].orden).toEqual({ campo: 'motivo', direccion: 'desc' })
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'Ordenar por Motivo' }),
    )

    screen.getByRole('button', { name: 'Página siguiente' }).focus()
    await user.keyboard('{Enter}')
    await waitFor(() => expect(port.calls).toHaveLength(4))
    expect(port.calls[3].paginacion.pagina).toBe(2)
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'Página siguiente' }),
    )

    await user.keyboard('{Enter}')
    await waitFor(() => expect(port.calls).toHaveLength(5))
    expect(port.calls[4].paginacion.pagina).toBe(3)
    expect(
      screen
        .getByRole('button', { name: 'Página siguiente' })
        .hasAttribute('disabled'),
    ).toBe(true)
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'Página anterior' }),
    )
  })
})

const contextoRestaurado: ContextoBandeja = {
  filtros: {
    estados: ['aprobado'],
    motivos: ['reemplazo'],
    empresas: [empresaA.id],
    areas: [areaA.id],
    subareas: [subareaA.id],
    puestos: [puestoA.id],
    solicitantes: [usuarioB.id],
    periodoAprobacion: {
      desde: '2026-01-01' as FechaISO,
      hasta: '2026-01-31' as FechaISO,
    },
  },
  orden: { campo: 'motivo', direccion: 'asc' },
  paginacion: { pagina: 2, tamanoPagina: 25 },
}

describe('contexto persistido de la bandeja (RH-REQ-01 §7.1, §10-14)', () => {
  it('restaura filtros, orden y página del contexto previo al montar', async () => {
    const port = createMockBandejaRequerimientos((consulta) =>
      lecturaFixture.ok({
        elementos: [filaCompleta()],
        total: 50,
        pagina: consulta.paginacion.pagina,
        tamanoPagina: consulta.paginacion.tamanoPagina,
        capacidades: { capacidades: [capability], accionesPermitidas: [] },
      }),
    )
    renderBandeja(port, { contextoInicial: contextoRestaurado })
    await screen.findByRole('table')

    expect(port.calls[0]).toEqual(contextoRestaurado)
    expect((screen.getByLabelText('Estado') as HTMLSelectElement).value).toBe(
      'aprobado',
    )
    expect((screen.getByLabelText('Motivo') as HTMLSelectElement).value).toBe(
      'reemplazo',
    )
    expect((screen.getByLabelText('Empresa') as HTMLSelectElement).value).toBe(
      String(empresaA.id),
    )
    expect((screen.getByLabelText('Área') as HTMLSelectElement).value).toBe(
      String(areaA.id),
    )
    expect((screen.getByLabelText('Subárea') as HTMLSelectElement).value).toBe(
      String(subareaA.id),
    )
    expect((screen.getByLabelText('Puesto') as HTMLSelectElement).value).toBe(
      String(puestoA.id),
    )
    expect((screen.getByLabelText('Solicitante') as HTMLSelectElement).value).toBe(
      String(usuarioB.id),
    )
    expect(
      (screen.getByLabelText('Aprobado desde') as HTMLInputElement).value,
    ).toBe('2026-01-01')
    expect(
      (screen.getByLabelText('Aprobado hasta') as HTMLInputElement).value,
    ).toBe('2026-01-31')
    expect(
      screen
        .getByRole('columnheader', { name: 'Motivo' })
        .getAttribute('aria-sort'),
    ).toBe('ascending')
    expect(
      (screen.getByLabelText('Elementos por página') as HTMLSelectElement).value,
    ).toBe('25')
    expect(
      within(
        screen.getByRole('navigation', {
          name: 'Paginación de requerimientos',
        }),
      ).getByText('Página 2 de 2'),
    ).toBeDefined()
  })

  it('entrega la consulta aplicada al consumidor y no la emite al montar ni al editar sin aplicar', async () => {
    const port = createMockBandejaRequerimientos((consulta) =>
      lecturaFixture.ok({
        elementos: [filaCompleta()],
        total: 25,
        pagina: consulta.paginacion.pagina,
        tamanoPagina: consulta.paginacion.tamanoPagina,
        capacidades: { capacidades: [capability], accionesPermitidas: [] },
      }),
    )
    const onContextoCambia = vi.fn()
    const user = userEvent.setup()
    renderBandeja(port, { onContextoCambia })
    await screen.findByRole('table')

    expect(onContextoCambia).not.toHaveBeenCalled()

    await user.selectOptions(screen.getByLabelText('Estado'), 'aprobado')
    expect(onContextoCambia).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Aplicar filtros' }))
    await waitFor(() => expect(onContextoCambia).toHaveBeenCalledTimes(1))
    expect(onContextoCambia.mock.calls[0][0]).toEqual({
      filtros: { estados: ['aprobado'] },
      orden: { campo: 'fecha-creacion', direccion: 'desc' },
      paginacion: { pagina: 1, tamanoPagina: 10 },
    })

    await user.click(
      screen.getByRole('button', { name: 'Ordenar por Motivo' }),
    )
    await waitFor(() => expect(onContextoCambia).toHaveBeenCalledTimes(2))
    expect(onContextoCambia.mock.calls[1][0]).toEqual({
      filtros: { estados: ['aprobado'] },
      orden: { campo: 'motivo', direccion: 'asc' },
      paginacion: { pagina: 1, tamanoPagina: 10 },
    })

    await user.click(screen.getByRole('button', { name: 'Página siguiente' }))
    await waitFor(() => expect(onContextoCambia).toHaveBeenCalledTimes(3))
    expect(onContextoCambia.mock.calls[2][0]).toEqual({
      filtros: { estados: ['aprobado'] },
      orden: { campo: 'motivo', direccion: 'asc' },
      paginacion: { pagina: 2, tamanoPagina: 10 },
    })
  })

  it('persiste la consulta aplicada y la restaura al remontar la bandeja', async () => {
    const base = createInMemoryStore<unknown>()
    const store = crearStoreContextoBandeja(base, { tamanoPaginaInicial: 10 })
    const port = createMockBandejaRequerimientos((consulta) =>
      lecturaFixture.ok({
        elementos: [filaCompleta()],
        total: 25,
        pagina: consulta.paginacion.pagina,
        tamanoPagina: consulta.paginacion.tamanoPagina,
        capacidades: { capacidades: [capability], accionesPermitidas: [] },
      }),
    )
    const user = userEvent.setup()
    const { unmount } = renderBandeja(port, {
      onContextoCambia: (contexto) => store.set(contexto),
    })
    await screen.findByRole('table')

    await user.selectOptions(screen.getByLabelText('Estado'), 'aprobado')
    await user.click(screen.getByRole('button', { name: 'Aplicar filtros' }))
    await waitFor(() => expect(port.calls).toHaveLength(2))
    await user.click(
      screen.getByRole('button', { name: 'Ordenar por Motivo' }),
    )
    await waitFor(() => expect(port.calls).toHaveLength(3))
    await user.click(screen.getByRole('button', { name: 'Página siguiente' }))
    await waitFor(() => expect(port.calls).toHaveLength(4))

    const contexto = store.get()
    expect(contexto).toEqual({
      filtros: { estados: ['aprobado'] },
      orden: { campo: 'motivo', direccion: 'asc' },
      paginacion: { pagina: 2, tamanoPagina: 10 },
    })

    unmount()

    const portTrasNavegar = createMockBandejaRequerimientos(
      lecturaFixture.ok(pagina([filaCompleta()])),
    )
    renderBandeja(portTrasNavegar, { contextoInicial: contexto })
    await screen.findByRole('table')

    expect(portTrasNavegar.calls[0]).toEqual(contexto)
    expect((screen.getByLabelText('Estado') as HTMLSelectElement).value).toBe(
      'aprobado',
    )
    expect(
      screen
        .getByRole('columnheader', { name: 'Motivo' })
        .getAttribute('aria-sort'),
    ).toBe('ascending')
  })
})

describe('apertura de fila con contexto (RH-REQ-01 §7.1, §10-23)', () => {
  it('abre el detalle al interactuar con la fila y expone el requerimiento con la consulta', async () => {
    const port = createMockBandejaRequerimientos(
      lecturaFixture.ok(pagina([filaCompleta()])),
    )
    const onAbrirDetalle = vi.fn()
    renderBandeja(port, { onAbrirDetalle })
    await screen.findByRole('table')

    const fila = within(screen.getByRole('table')).getAllByRole('row')[1]
    expect(fila.getAttribute('tabindex')).toBe('0')
    expect(fila.getAttribute('aria-label')).toBe('Abrir requerimiento req-1')

    fireEvent.click(within(fila).getAllByRole('cell')[0])

    expect(onAbrirDetalle).toHaveBeenCalledTimes(1)
    expect(onAbrirDetalle).toHaveBeenCalledWith({
      requerimiento: filaCompleta(),
      contexto: {
        filtros: {},
        orden: { campo: 'fecha-creacion', direccion: 'desc' },
        paginacion: { pagina: 1, tamanoPagina: 10 },
      },
    })
  })

  it('abre con Enter y con Espacio reales desde el teclado', async () => {
    const port = createMockBandejaRequerimientos(
      lecturaFixture.ok(pagina([filaCompleta()])),
    )
    const onAbrirDetalle = vi.fn()
    const user = userEvent.setup()
    renderBandeja(port, { onAbrirDetalle })
    await screen.findByRole('table')

    const fila = within(screen.getByRole('table')).getAllByRole('row')[1]
    fila.focus()
    expect(document.activeElement).toBe(fila)

    await user.keyboard('{Enter}')
    expect(onAbrirDetalle).toHaveBeenCalledTimes(1)

    await user.keyboard(' ')
    expect(onAbrirDetalle).toHaveBeenCalledTimes(2)
    expect(document.activeElement).toBe(fila)
  })

  it('expone el contexto vigente tras aplicar, ordenar y paginar', async () => {
    const port = createMockBandejaRequerimientos((consulta) =>
      lecturaFixture.ok({
        elementos: [filaCompleta()],
        total: 25,
        pagina: consulta.paginacion.pagina,
        tamanoPagina: consulta.paginacion.tamanoPagina,
        capacidades: { capacidades: [capability], accionesPermitidas: [] },
      }),
    )
    const onAbrirDetalle = vi.fn()
    const user = userEvent.setup()
    renderBandeja(port, { onAbrirDetalle })
    await screen.findByRole('table')

    await user.selectOptions(screen.getByLabelText('Motivo'), 'reemplazo')
    await user.click(screen.getByRole('button', { name: 'Aplicar filtros' }))
    await waitFor(() => expect(port.calls).toHaveLength(2))
    await user.click(
      screen.getByRole('button', { name: 'Ordenar por Empresa' }),
    )
    await waitFor(() => expect(port.calls).toHaveLength(3))
    await user.click(screen.getByRole('button', { name: 'Página siguiente' }))
    await waitFor(() => expect(port.calls).toHaveLength(4))

    const fila = within(screen.getByRole('table')).getAllByRole('row')[1]
    fireEvent.click(fila)

    expect(onAbrirDetalle).toHaveBeenCalledWith({
      requerimiento: filaCompleta(),
      contexto: {
        filtros: { motivos: ['reemplazo'] },
        orden: { campo: 'empresa', direccion: 'asc' },
        paginacion: { pagina: 2, tamanoPagina: 10 },
      },
    })
  })

  it('no hace interactivas las filas si no hay consumidor de detalle', async () => {
    const port = createMockBandejaRequerimientos(
      lecturaFixture.ok(pagina([filaCompleta()])),
    )
    renderBandeja(port)
    await screen.findByRole('table')

    const fila = within(screen.getByRole('table')).getAllByRole('row')[1]
    expect(fila.hasAttribute('tabindex')).toBe(false)
    expect(fila.hasAttribute('aria-label')).toBe(false)
    expect(fila.hasAttribute('data-requerimiento')).toBe(false)
  })
})
