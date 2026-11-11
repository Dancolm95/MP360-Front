/** @vitest-environment jsdom */
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import type { CatalogPort, SectionCatalog } from '../contracts'
import {
  RRHH_MODULE_ID,
  createSessionWithUx02Fixture,
  createSessionWithoutUx02Fixture,
  mockSignOutSuccess,
} from '../fixtures'
import { ContainerShell } from './ContainerShell'

afterEach(cleanup)

async function readCatalog(port: CatalogPort): Promise<SectionCatalog> {
  const result = await port.getCatalog()
  if (result.status !== 'ready') {
    throw new Error('El fixture debía entregar un catálogo disponible.')
  }
  return result.catalog
}

describe('ContainerShell (CORE-01 §7 criterio 1)', () => {
  it('compone marca, identidad recibida, selector y módulo/sección activos', async () => {
    const catalog = await readCatalog(createSessionWithUx02Fixture().catalog)

    render(
      <ContainerShell
        catalog={catalog}
        identity={{ displayName: 'Ana Pérez' }}
        activeModuleId={RRHH_MODULE_ID}
        activeSectionLabel="Requerimientos"
      >
        <h1>Requerimientos</h1>
      </ContainerShell>,
    )

    expect(screen.getByText('ERP MP 360')).toBeDefined()
    expect(screen.getByText('Ana Pérez')).toBeDefined()

    const active = screen.getByRole('button', { name: /RR\. HH\. \(módulo activo\)/ })
    expect(active.getAttribute('aria-current')).toBe('page')

    expect(
      screen.getByText('Módulo activo: RR. HH. · Sección: Requerimientos'),
    ).toBeDefined()
    expect(screen.getByRole('heading', { level: 1, name: 'Requerimientos' })).toBeDefined()
  })

  it('sin lectura UX-02 no ofrece módulo ni indica uno activo, y no inventa identidad', async () => {
    const catalog = await readCatalog(createSessionWithoutUx02Fixture().catalog)

    render(
      <ContainerShell catalog={catalog} activeModuleId={RRHH_MODULE_ID}>
        <p>Zona central</p>
      </ContainerShell>,
    )

    expect(screen.queryByRole('button', { name: /RR\. HH\./ })).toBeNull()
    expect(screen.queryByText(/Módulo activo:/)).toBeNull()
    expect(screen.queryByText(/Sesión:/)).toBeNull()
    expect(screen.getByText('Zona central')).toBeDefined()
  })

  it('no renderiza panel contextual derecho', async () => {
    const catalog = await readCatalog(createSessionWithUx02Fixture().catalog)

    render(<ContainerShell catalog={catalog} />)

    expect(screen.queryByRole('complementary')).toBeNull()
  })

  it('sin puerto de salida no renderiza «Salir»; con puerto la acción va en la cabecera', async () => {
    const catalog = await readCatalog(createSessionWithUx02Fixture().catalog)

    const { rerender } = render(<ContainerShell catalog={catalog} />)
    expect(screen.queryByRole('button', { name: 'Salir' })).toBeNull()

    rerender(
      <ContainerShell
        catalog={catalog}
        identity={{ displayName: 'Ana Pérez' }}
        signOut={mockSignOutSuccess('provider')}
      />,
    )

    const banner = screen.getByRole('banner')
    expect(banner.querySelector('button')).not.toBeNull()
    expect(screen.getByRole('button', { name: 'Salir' })).toBeDefined()
  })
})
