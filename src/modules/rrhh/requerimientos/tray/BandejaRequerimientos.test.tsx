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
import { afterEach, describe, expect, it } from 'vitest'
import type { Capability } from '../../../../shared'
import { createDeferred } from '../../../../container/fixtures'
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
  Empresa,
  EmpresaId,
  FechaISO,
  InstanteISO,
  PaginaRequerimientos,
  Puesto,
  PuestoId,
  RequerimientoId,
  ResultadoBandeja,
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
  } = {},
) {
  return render(
    <BandejaRequerimientos
      port={port}
      catalogos={catalogos}
      solicitantes={opciones.solicitantes ?? [usuarioA, usuarioB]}
      tamanoPaginaInicial={opciones.tamanoPaginaInicial ?? 10}
      tamanosPagina={opciones.tamanosPagina ?? [10, 25]}
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

  it('no aplica un periodo incompleto y lo explica', async () => {
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
    expect(screen.getByRole('alert').textContent).toContain(
      'Indica ambas fechas',
    )
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

  it('no inventa fecha objetivo antes de aprobar', async () => {
    const borrador = filaBorrador({ id: 'req-1' as RequerimientoId })
    const pendiente = filaCompleta({
      id: 'req-2' as RequerimientoId,
      estado: 'pendiente-aprobacion',
      fechaObjetivo: null,
    })
    const aprobado = filaCompleta({
      id: 'req-3' as RequerimientoId,
      estado: 'aprobado',
      fechaObjetivo: '2026-01-20' as FechaISO,
    })
    const port = createMockBandejaRequerimientos(
      lecturaFixture.ok(pagina([borrador, pendiente, aprobado])),
    )
    renderBandeja(port)
    await screen.findByRole('table')

    const filas = within(screen.getByRole('table'))
      .getAllByRole('row')
      .slice(1)
    expect(filas[0].textContent).toContain('Sin fecha')
    expect(filas[1].textContent).toContain('Sin fecha')
    expect(filas[2].textContent).toContain('20/01/2026')
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
    const deferred = createDeferred<ResultadoBandeja>()
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
  it('ordena y pagina con Enter y Espacio', async () => {
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

    const botonMotivo = screen.getByRole('button', {
      name: 'Ordenar por Motivo',
    })
    botonMotivo.focus()
    await user.keyboard('{Enter}')
    await waitFor(() => expect(port.calls).toHaveLength(2))
    expect(port.calls[1].orden).toEqual({ campo: 'motivo', direccion: 'asc' })

    screen.getByRole('button', { name: 'Ordenar por Motivo' }).focus()
    await user.keyboard(' ')
    await waitFor(() => expect(port.calls).toHaveLength(3))
    expect(port.calls[2].orden).toEqual({ campo: 'motivo', direccion: 'desc' })

    const siguiente = screen.getByRole('button', { name: 'Página siguiente' })
    siguiente.focus()
    await user.keyboard('{Enter}')
    await waitFor(() => expect(port.calls).toHaveLength(4))
    expect(port.calls[3].paginacion.pagina).toBe(2)
  })
})
