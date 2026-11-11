/** @vitest-environment jsdom */
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import Page from './page'

afterEach(cleanup)

describe('integración de la página con el contenedor', () => {
  it('declara el adaptador mock y entra en Requerimientos sin dashboard ficticio', async () => {
    render(<Page />)

    expect(screen.getByRole('note').textContent).toMatch(/contrato mock/i)
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Requerimientos' }),
    ).toBeDefined()
    expect(screen.getByText(/bandeja operativa aún no está implementada/i)).toBeDefined()
    expect(screen.queryByText(/Dashboard/i)).toBeNull()
    expect(screen.getByRole('button', { name: /RR\. HH\. \(módulo activo\)/ })).toBeDefined()
  })
})
