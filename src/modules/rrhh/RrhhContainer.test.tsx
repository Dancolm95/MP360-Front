/** @vitest-environment jsdom */
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { LogicalDestination, SectionCatalog } from '../../container/contracts'
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
    renderContainer(catalog, { navigation: fixture.navigation })
    await screen.findByRole('heading', { name: 'Requerimientos' })

    fireEvent.click(screen.getByRole('button', { name: 'Selección' }))

    expect(await screen.findByRole('heading', { name: 'Selección' })).toBeDefined()
    expect(screen.getByText('Próximamente')).toBeDefined()
    expect(screen.queryByRole('table')).toBeNull()
    expect(screen.queryByRole('form')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Volver a Requerimientos' }))
    expect(await screen.findByRole('heading', { name: 'Requerimientos' })).toBeDefined()
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
