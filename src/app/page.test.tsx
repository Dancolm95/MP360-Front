/** @vitest-environment jsdom */
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import Page from './page'

// RTL 16 no registra limpieza automática si `globals` está desactivado.
afterEach(cleanup)

/**
 * Prueba de humo de componente: React Testing Library sobre `page.tsx` con
 * entorno jsdom. Demuestra que el runner transforma JSX y monta la página;
 * no verifica reglas de negocio (eso corresponde a tareas posteriores).
 */
describe('página de inicio (humo de componente)', () => {
  it('muestra el título y las tres capas del andamiaje', () => {
    render(<Page />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'ERP MP 360' }),
    ).toBeDefined()

    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(3)
    expect(items[0]?.textContent).toContain('Contenedor ERP')
    expect(items[1]?.textContent).toContain('Componentes comunes')
    expect(items[2]?.textContent).toContain('Módulo')
  })
})
