/** @vitest-environment jsdom */
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import Page from './page'

afterEach(cleanup)

async function renderBandeja() {
  const user = userEvent.setup()
  render(<Page />)
  await screen.findByRole('heading', {
    level: 2,
    name: 'Bandeja de requerimientos',
  })
  await screen.findByRole('table')
  return user
}

function filaDe(id: string) {
  return screen.getByRole('row', { name: `Abrir requerimiento ${id}` })
}

function columnaOrden(etiqueta: string) {
  return screen
    .getByRole('button', { name: `Ordenar por ${etiqueta}` })
    .closest('th')
}

describe('integración de la página con la bandeja real', () => {
  it('monta la bandeja de requerimientos y declara la demo sin el marcador anterior', async () => {
    await renderBandeja()

    expect(
      screen.getByRole('heading', { level: 1, name: 'Requerimientos' }),
    ).toBeDefined()
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Bandeja de requerimientos',
      }),
    ).toBeDefined()
    expect(screen.queryByText(/Frontera de integración/i)).toBeNull()
    expect(
      screen.queryByText(/bandeja operativa aún no está implementada/i),
    ).toBeNull()
    expect(screen.getByRole('note').textContent).toMatch(/contrato mock/i)
    expect(screen.queryByRole('complementary')).toBeNull()
    expect(screen.queryByText(/Dashboard/i)).toBeNull()

    const principal = within(screen.getByRole('main'))
    expect(principal.getByText(/Alerta: Crítica/)).toBeDefined()
    expect(principal.getByRole('table')).toBeDefined()
  })

  it('abre el detalle con el puntero y vuelve con filtros, orden y foco', async () => {
    const user = await renderBandeja()

    await user.selectOptions(screen.getByLabelText('Estado'), 'aprobado')
    await user.click(screen.getByRole('button', { name: 'Aplicar filtros' }))
    await screen.findByRole('row', { name: 'Abrir requerimiento req-1001' })

    await user.click(screen.getByRole('button', { name: 'Ordenar por ID' }))
    await waitFor(() =>
      expect(columnaOrden('ID')?.getAttribute('aria-sort')).toBe('ascending'),
    )

    await user.click(
      screen.getByRole('button', { name: 'Detalle requerimiento req-1001' }),
    )
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Detalle de requerimiento',
      }),
    ).toBeDefined()
    expect(screen.getByText(/Alerta: /)).toBeDefined()

    await user.click(
      screen.getByRole('button', {
        name: 'Volver a la bandeja de requerimientos',
      }),
    )

    const fila = await screen.findByRole('row', {
      name: 'Abrir requerimiento req-1001',
    })
    const estado = screen.getByLabelText('Estado') as HTMLSelectElement
    expect(estado.value).toBe('aprobado')
    expect(columnaOrden('ID')?.getAttribute('aria-sort')).toBe('ascending')
    await waitFor(() => expect(document.activeElement).toBe(fila))
  })

  it('abre el detalle con el teclado y vuelve a la misma página y fila', async () => {
    const user = await renderBandeja()

    await user.selectOptions(
      screen.getByLabelText('Elementos por página'),
      '4',
    )
    await screen.findByText('Página 1 de 2')

    await user.click(screen.getByRole('button', { name: 'Página siguiente' }))
    const fila = await screen.findByRole('row', {
      name: 'Abrir requerimiento req-1001',
    })
    expect(screen.getByText('Página 2 de 2')).toBeDefined()

    fila.focus()
    await user.keyboard('{Enter}')
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Detalle de requerimiento',
      }),
    ).toBeDefined()

    await user.click(
      screen.getByRole('button', {
        name: 'Volver a la bandeja de requerimientos',
      }),
    )

    const filaVuelta = await screen.findByRole('row', {
      name: 'Abrir requerimiento req-1001',
    })
    expect(screen.getByText('Página 2 de 2')).toBeDefined()
    await waitFor(() => expect(document.activeElement).toBe(filaVuelta))
  })

  it('alcanza el formulario de alta desde la acción de la bandeja y vuelve al cerrarlo', async () => {
    const user = await renderBandeja()

    await user.click(screen.getByRole('button', { name: 'Nuevo' }))
    const formulario = await screen.findByRole('dialog', {
      name: 'Nuevo requerimiento de personal',
    })
    expect(within(formulario).getByText('Datos del requerimiento')).toBeDefined()

    await user.click(
      within(formulario).getByRole('button', { name: 'Cancelar edición' }),
    )
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Bandeja de requerimientos',
      }),
    ).toBeDefined()
    expect(filaDe('req-1001')).toBeDefined()
  })
})
