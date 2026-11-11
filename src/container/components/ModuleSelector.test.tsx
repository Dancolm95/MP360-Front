/** @vitest-environment jsdom */
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { CatalogPort, SectionCatalog } from '../contracts'
import {
  CAP_RRHH_SELECCION_VISIBLE,
  RRHH_MODULE_ID,
  capabilitySet,
  createContainerFixture,
  createSessionWithUx02Fixture,
  createSessionWithoutUx02Fixture,
} from '../fixtures'
import { ModuleSelector } from './ModuleSelector'

afterEach(cleanup)

async function readCatalog(port: CatalogPort): Promise<SectionCatalog> {
  const result = await port.getCatalog()
  if (result.status !== 'ready') {
    throw new Error('El fixture debía entregar un catálogo disponible.')
  }
  return result.catalog
}

describe('ModuleSelector (CORE-01 §7 criterios 1, 2 y 8)', () => {
  it('con lectura UX-02 ofrece solo RR. HH. en el selector', async () => {
    const catalog = await readCatalog(createSessionWithUx02Fixture().catalog)

    render(<ModuleSelector catalog={catalog} />)

    expect(screen.getByRole('navigation', { name: 'Módulos del ERP' })).toBeDefined()
    const modules = screen.getAllByRole('button')
    expect(modules).toHaveLength(1)
    expect(screen.getByRole('button', { name: 'RR. HH.' })).toBeDefined()
    expect(screen.queryByText('Próximamente')).toBeNull()
  })

  it('sin lectura UX-02 no ofrece RR. HH. ni «Próximamente» como sustituto', async () => {
    const catalog = await readCatalog(createSessionWithoutUx02Fixture().catalog)

    render(<ModuleSelector catalog={catalog} />)

    expect(screen.queryByRole('button', { name: /RR\. HH\./ })).toBeNull()
    expect(screen.queryByText('Próximamente')).toBeNull()
    expect(
      screen.getByText('Sin módulos disponibles para esta sesión.'),
    ).toBeDefined()
  })

  it('la visibilidad de una sección no implementada no habilita el módulo sin lectura UX-02', async () => {
    const fixture = createContainerFixture({
      scenario: 'sin UX-02, con Selección visible explícitamente',
      capabilities: capabilitySet(CAP_RRHH_SELECCION_VISIBLE),
    })
    const catalog = await readCatalog(fixture.catalog)

    render(<ModuleSelector catalog={catalog} />)

    expect(screen.queryByRole('button', { name: /RR\. HH\./ })).toBeNull()
    expect(screen.queryByText('Próximamente')).toBeNull()
  })

  it('identifica el módulo activo con semántica y texto, no solo con color', async () => {
    const catalog = await readCatalog(createSessionWithUx02Fixture().catalog)

    render(<ModuleSelector catalog={catalog} activeModuleId={RRHH_MODULE_ID} />)

    const active = screen.getByRole('button', { name: /RR\. HH\. \(módulo activo\)/ })
    expect(active.getAttribute('aria-current')).toBe('page')
    expect(active.textContent).toContain('RR. HH.')
  })

  it('no marca como activo un módulo distinto del que ofrece el catálogo', async () => {
    const catalog = await readCatalog(createSessionWithUx02Fixture().catalog)

    render(<ModuleSelector catalog={catalog} />)

    expect(
      screen.getByRole('button', { name: 'RR. HH.' }).getAttribute('aria-current'),
    ).toBeNull()
  })

  it('activa el módulo con Enter y Espacio', async () => {
    const catalog = await readCatalog(createSessionWithUx02Fixture().catalog)
    const onSelectModule = vi.fn()
    const user = userEvent.setup()

    render(
      <ModuleSelector catalog={catalog} onSelectModule={onSelectModule} />,
    )

    const button = screen.getByRole('button', { name: 'RR. HH.' })
    expect(button.getAttribute('type')).toBe('button')

    await user.tab()
    expect(document.activeElement).toBe(button)

    await user.keyboard('{Enter}')
    await user.keyboard(' ')
    expect(onSelectModule).toHaveBeenNthCalledWith(1, RRHH_MODULE_ID)
    expect(onSelectModule).toHaveBeenNthCalledWith(2, RRHH_MODULE_ID)
  })
})
