/** @vitest-environment jsdom */
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { LogicalDestination, SectionCatalog } from '../../container/contracts'
import type { AccionesBandejaContenedor } from './RrhhContainer'
import type {
  ContextoBandeja,
  ResumenRequerimientoCompleto,
} from './requerimientos'
import type {
  AreaId,
  EmpresaId,
  InstanteISO,
  PuestoId,
  RequerimientoId,
} from './requerimientos/contracts'
import {
  CAP_RRHH_REQUERIMIENTOS_READ,
  DEST_RRHH_REQUERIMIENTOS_NUEVO,
  createNotImplementedVisibleFixture,
  createSessionWithUx02Fixture,
  createSessionWithoutUx02Fixture,
  mockNavigationForbidden,
  mockNavigationSessionEnded,
  mockSignOutSuccess,
} from '../../container/fixtures'
import { RrhhContainer } from './RrhhContainer'

afterEach(cleanup)

async function readCatalog(fixture: ReturnType<typeof createSessionWithUx02Fixture>) {
  const result = await fixture.catalog.getCatalog()
  if (result.status !== 'ready') throw new Error('Catálogo de fixture no disponible')
  return result.catalog
}

function renderContainer(
  catalog: SectionCatalog,
  options: Partial<ComponentProps<typeof RrhhContainer>> = {},
) {
  const fixture = createSessionWithUx02Fixture()
  return render(
    <RrhhContainer
      catalog={catalog}
      capabilities={[CAP_RRHH_REQUERIMIENTOS_READ]}
      navigation={fixture.navigation}
      signOut={mockSignOutSuccess('provider')}
      onSignedOut={() => undefined}
      onSessionEnded={() => undefined}
      {...options}
    />,
  )
}

describe('RrhhContainer (CORE-01 §7 criterios 1–3)', () => {
  it('abre Requerimientos sin dashboard y resuelve la sección activa desde catálogo', async () => {
    const fixture = createSessionWithUx02Fixture()
    const catalog = await readCatalog(fixture)
    renderContainer(catalog, { navigation: fixture.navigation })

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Requerimientos' }),
    ).toBeDefined()
    expect(screen.getByText(/Sección: Requerimientos/)).toBeDefined()
    expect(screen.queryByText(/Dashboard/i)).toBeNull()
  })

  it('sin lectura UX-02 deniega todo RR. HH. aunque el catálogo tenga una sección visible', async () => {
    const fixture = createNotImplementedVisibleFixture()
    const catalog = await readCatalog(fixture)
    const resolve = vi.fn(fixture.navigation.resolve)

    renderContainer(catalog, {
      capabilities: [],
      navigation: { resolve },
    })

    expect(await screen.findByRole('heading', { name: 'Sin permisos' })).toBeDefined()
    expect(screen.queryByRole('button', { name: /RR\. HH\./ })).toBeNull()
    expect(screen.queryByText('Próximamente')).toBeNull()
    expect(screen.queryByRole('navigation', { name: 'Secciones de RR. HH.' })).toBeNull()
    expect(resolve).not.toHaveBeenCalled()
  })

  it('solo una sección no implementada visible muestra Próximamente y vuelve a UX-02', async () => {
    const fixture = createNotImplementedVisibleFixture()
    const catalog = await readCatalog(fixture)
    const user = userEvent.setup()
    renderContainer(catalog, { navigation: fixture.navigation })
    const requirementsHeading = await screen.findByRole('heading', {
      name: 'Requerimientos',
    })
    expect(document.activeElement).toBe(requirementsHeading)

    const selection = screen.getByRole('button', { name: 'Selección' })
    selection.focus()
    await user.keyboard('{Enter}')

    const selectionHeading = await screen.findByRole('heading', { name: 'Selección' })
    expect(document.activeElement).toBe(selectionHeading)
    expect(
      screen
        .getByRole('button', { name: 'Selección (sección activa)' })
        .getAttribute('aria-current'),
    ).toBe('page')
    expect(screen.getByText('Próximamente')).toBeDefined()
    expect(screen.queryByRole('table')).toBeNull()
    expect(screen.queryByRole('form')).toBeNull()

    const back = screen.getByRole('button', { name: 'Volver a Requerimientos' })
    back.focus()
    await user.keyboard(' ')
    const returnedHeading = await screen.findByRole('heading', {
      name: 'Requerimientos',
    })
    expect(document.activeElement).toBe(returnedHeading)
  })

  it('no ofrece secciones que el catálogo no marcó visibles', async () => {
    const fixture = createSessionWithUx02Fixture()
    const catalog = await readCatalog(fixture)
    renderContainer(catalog, { navigation: fixture.navigation })

    await screen.findByRole('heading', { name: 'Requerimientos' })
    expect(screen.queryByRole('button', { name: 'Selección' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Alta' })).toBeNull()
  })

  it('un destino desconocido no se convierte en Próximamente ni en vista ficticia', async () => {
    const fixture = createSessionWithUx02Fixture()
    const catalog = await readCatalog(fixture)
    renderContainer(catalog, {
      navigation: fixture.navigation,
      initialDestination: DEST_RRHH_REQUERIMIENTOS_NUEVO,
    })

    expect(await screen.findByRole('heading', { name: 'Destino no encontrado' })).toBeDefined()
    expect(screen.queryByText('Próximamente')).toBeNull()
    expect(screen.queryByRole('form')).toBeNull()
  })

  it('un destino directo denegado no se convierte en Próximamente', async () => {
    const catalog = await readCatalog(createNotImplementedVisibleFixture())
    renderContainer(catalog, {
      navigation: mockNavigationForbidden(),
      initialDestination: 'rrhh:seleccion' as LogicalDestination,
    })

    expect(await screen.findByRole('heading', { name: 'Sin permisos' })).toBeDefined()
    expect(screen.queryByText('Próximamente')).toBeNull()
  })

  it('retira la frontera protegida cuando navegación informa fin de sesión', async () => {
    const catalog = await readCatalog(createSessionWithUx02Fixture())
    const onSessionEnded = vi.fn()
    renderContainer(catalog, {
      navigation: mockNavigationSessionEnded(),
      onSessionEnded,
    })

    await vi.waitFor(() => expect(onSessionEnded).toHaveBeenCalledOnce())
    expect(screen.queryByRole('heading', { name: 'Requerimientos' })).toBeNull()
  })

  it('el fixture sin UX-02 tampoco ofrece el módulo', async () => {
    const fixture = createSessionWithoutUx02Fixture()
    const catalog = await readCatalog(fixture)
    renderContainer(catalog, { capabilities: [], navigation: fixture.navigation })

    expect(await screen.findByRole('heading', { name: 'Sin permisos' })).toBeDefined()
  })
})

describe('RrhhContainer · vistas inyectadas (T-CORE-09)', () => {
  const contexto: ContextoBandeja = {
    filtros: { estados: ['aprobado'] },
    orden: { campo: 'id', direccion: 'asc' },
    paginacion: { pagina: 2, tamanoPagina: 4 },
  }
  const fila: ResumenRequerimientoCompleto = {
    id: 'req-x' as RequerimientoId,
    version: 1,
    fechaCreacion: '2026-01-02T10:00:00Z' as InstanteISO,
    estado: 'aprobado',
    motivo: 'nueva-vacante',
    empresa: { id: 'emp-x' as EmpresaId, nombre: 'Empresa de prueba' },
    puesto: {
      id: 'puesto-x' as PuestoId,
      nombre: 'Puesto de prueba',
      areaId: 'area-x' as AreaId,
      subareaId: null,
      clasificacion: 'operativo',
    },
    solicitadas: 1,
    cubiertas: 0,
    pendientes: 1,
    fechaObjetivo: null,
    duracionAplicable: null,
    responsable: null,
    alerta: null,
    autorizacion: {
      requerimientoId: 'req-x' as RequerimientoId,
      version: 1,
      capacidades: [],
      accionesPermitidas: [],
    },
  }

  it('compone la bandeja y el detalle inyectados y vuelve con contexto y foco', async () => {
    const fixture = createSessionWithUx02Fixture()
    const catalog = await readCatalog(fixture)
    const user = userEvent.setup()
    const bandeja = vi.fn((acciones: AccionesBandejaContenedor) => (
      <button
        type="button"
        onClick={() =>
          acciones.onAbrirDetalle?.({ requerimiento: fila, contexto })
        }
      >
        Abrir detalle de prueba
      </button>
    ))

    renderContainer(catalog, {
      navigation: fixture.navigation,
      vistas: {
        bandeja,
        detalle: (seleccion, onVolver) => (
          <>
            <p>Detalle de {String(seleccion.requerimiento.id)}</p>
            <button type="button" onClick={onVolver}>
              Volver de prueba
            </button>
          </>
        ),
      },
    })

    await user.click(
      await screen.findByRole('button', { name: 'Abrir detalle de prueba' }),
    )
    expect(screen.getByText('Detalle de req-x')).toBeDefined()
    expect(
      screen.queryByRole('button', { name: 'Abrir detalle de prueba' }),
    ).toBeNull()

    await user.click(screen.getByRole('button', { name: 'Volver de prueba' }))
    await screen.findByRole('button', { name: 'Abrir detalle de prueba' })

    const acciones = bandeja.mock.calls.at(-1)?.[0]
    expect(acciones?.contextoInicial).toEqual(contexto)
    expect(acciones?.restaurarFocoEn).toBe(fila.id)
  })

  it('alcanza el formulario por el destino nuevo y por la acción de la bandeja', async () => {
    const fixture = createSessionWithUx02Fixture()
    const catalog = await readCatalog(fixture)
    const user = userEvent.setup()
    const vistas = {
      bandeja: ({ onNuevo }: AccionesBandejaContenedor) => (
        <button type="button" onClick={onNuevo}>
          Nuevo de prueba
        </button>
      ),
      formulario: (onCerrar: () => void) => (
        <>
          <p>Formulario de prueba</p>
          <button type="button" onClick={onCerrar}>
            Cerrar de prueba
          </button>
        </>
      ),
    }

    const directo = renderContainer(catalog, {
      navigation: fixture.navigation,
      initialDestination: DEST_RRHH_REQUERIMIENTOS_NUEVO,
      vistas,
    })
    expect(await screen.findByText('Formulario de prueba')).toBeDefined()
    directo.unmount()

    renderContainer(catalog, { navigation: fixture.navigation, vistas })
    await user.click(
      await screen.findByRole('button', { name: 'Nuevo de prueba' }),
    )
    expect(screen.getByText('Formulario de prueba')).toBeDefined()

    await user.click(screen.getByRole('button', { name: 'Cerrar de prueba' }))
    expect(screen.queryByText('Formulario de prueba')).toBeNull()
    expect(
      screen.getByRole('button', { name: 'Nuevo de prueba' }),
    ).toBeDefined()
  })
})
