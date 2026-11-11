/** @vitest-environment jsdom */
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { AppHeader } from './AppHeader'

afterEach(cleanup)

describe('AppHeader (CORE-01 §7 criterio 1)', () => {
  it('muestra siempre la marca ERP', () => {
    render(<AppHeader />)

    expect(screen.getByRole('banner')).toBeDefined()
    expect(screen.getByText('ERP MP 360')).toBeDefined()
  })

  it('muestra la identidad recibida', () => {
    render(<AppHeader identity={{ displayName: 'Ana Pérez' }} />)

    expect(screen.getByText('Ana Pérez')).toBeDefined()
    expect(screen.getByText(/Sesión:/)).toBeDefined()
  })

  it('no inventa identidad cuando no se recibe o su nombre está vacío', () => {
    const { rerender } = render(<AppHeader />)

    expect(screen.queryByText(/Sesión:/)).toBeNull()

    rerender(<AppHeader identity={{ displayName: '   ' }} />)

    expect(screen.queryByText(/Sesión:/)).toBeNull()
    expect(screen.queryByText('   ')).toBeNull()
  })

  it('monta las acciones opcionales en la cabecera', () => {
    render(
      <AppHeader
        identity={{ displayName: 'Ana Pérez' }}
        actions={<button type="button">Salir</button>}
      />,
    )

    expect(screen.getByRole('banner')).toBeDefined()
    expect(screen.getByRole('button', { name: 'Salir' })).toBeDefined()
  })
})
