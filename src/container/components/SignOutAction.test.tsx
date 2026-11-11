/** @vitest-environment jsdom */
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { SignOutPort, SignOutResult } from '../contracts'
import {
  createDeferred,
  mockSignOutError,
  mockSignOutSuccess,
} from '../fixtures'
import { SignOutAction } from './SignOutAction'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('SignOutAction (CORE-01 §7 criterio 7)', () => {
  it('ofrece un botón nativo «Salir» y no llama al proveedor hasta activarlo', () => {
    const port = mockSignOutSuccess('provider')
    const signOut = vi.spyOn(port, 'signOut')

    render(<SignOutAction signOut={port} />)

    const button = screen.getByRole('button', { name: 'Salir' })
    expect(button.getAttribute('type')).toBe('button')
    expect(signOut).not.toHaveBeenCalled()
  })

  for (const destination of ['provider', 'local'] as const) {
    it(`con éxito destino ${destination} notifica el destino y muestra la confirmación`, async () => {
      const port = mockSignOutSuccess(destination)
      const signOut = vi.spyOn(port, 'signOut')
      const onSignedOut = vi.fn()

      render(<SignOutAction signOut={port} onSignedOut={onSignedOut} />)
      fireEvent.click(screen.getByRole('button', { name: 'Salir' }))

      const status = await screen.findByText(
        destination === 'provider'
          ? /El cierre de la sesión continúa en el proveedor/i
          : /La sesión local se ha cerrado/i,
      )
      expect(status.textContent).toMatch(
        destination === 'provider'
          ? /El cierre de la sesión continúa en el proveedor/i
          : /La sesión local se ha cerrado/i,
      )
      expect(signOut).toHaveBeenCalledTimes(1)
      expect(onSignedOut).toHaveBeenCalledTimes(1)
      expect(onSignedOut).toHaveBeenCalledWith(destination)
      expect(screen.queryByRole('button', { name: 'Salir' })).toBeNull()
      expect(screen.queryByRole('textbox')).toBeNull()
    })
  }

  it('durante el envío deshabilita el botón y un doble clic no provoca dos llamadas', async () => {
    const pending = createDeferred<SignOutResult>()
    let calls = 0
    const port: SignOutPort = {
      signOut: () => {
        calls += 1
        return pending.promise
      },
    }

    render(<SignOutAction signOut={port} />)
    const button = screen.getByRole('button', { name: 'Salir' })

    fireEvent.click(button)
    expect((button as HTMLButtonElement).disabled).toBe(true)
    expect(screen.getByRole('status').textContent).toMatch(/Cerrando la sesión/i)

    fireEvent.click(button)
    expect(calls).toBe(1)

    await act(async () => {
      pending.resolve({ status: 'success', destination: 'local' })
    })

    expect(await screen.findByText(/La sesión local se ha cerrado/i)).toBeDefined()
  })

  it('ante error reintentable conserva el mensaje y el reintento vuelve a llamar', async () => {
    let calls = 0
    const port: SignOutPort = {
      signOut: async (): Promise<SignOutResult> => {
        calls += 1
        return calls === 1
          ? {
              status: 'error',
              error: {
                message: 'El proveedor no responde en este momento.',
                retryable: true,
              },
            }
          : { status: 'success', destination: 'local' }
      },
    }
    const onSignedOut = vi.fn()

    render(<SignOutAction signOut={port} onSignedOut={onSignedOut} />)
    fireEvent.click(screen.getByRole('button', { name: 'Salir' }))

    const alert = await screen.findByRole('alert')
    expect(alert.textContent).toContain('El proveedor no responde en este momento.')
    expect(onSignedOut).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }))

    expect(await screen.findByText(/La sesión local se ha cerrado/i)).toBeDefined()
    expect(calls).toBe(2)
    expect(onSignedOut).toHaveBeenCalledWith('local')
  })

  it('ante error no reintentable no ofrece reintento', async () => {
    const port = mockSignOutError({
      message: 'El proveedor rechazó el cierre de la sesión.',
      retryable: false,
    })

    render(<SignOutAction signOut={port} />)
    fireEvent.click(screen.getByRole('button', { name: 'Salir' }))

    const alert = await screen.findByRole('alert')
    expect(alert.textContent).toContain('El proveedor rechazó el cierre de la sesión.')
    expect(screen.queryByRole('button', { name: 'Reintentar' })).toBeNull()
  })

  it('si el puerto rechaza sin resultado tipado, no reclama un reintento no acordado', async () => {
    const port: SignOutPort = {
      signOut: () => Promise.reject(new Error('fallo de transporte')),
    }

    render(<SignOutAction signOut={port} />)
    fireEvent.click(screen.getByRole('button', { name: 'Salir' }))

    const alert = await screen.findByRole('alert')
    expect(alert.textContent).toContain('No se pudo cerrar la sesión en el proveedor.')
    expect(screen.queryByRole('button', { name: 'Reintentar' })).toBeNull()
  })

  it('no escribe en localStorage ni en sessionStorage', async () => {
    const local = installStorageSpy('localStorage')
    const session = installStorageSpy('sessionStorage')

    try {
      const port = mockSignOutSuccess('provider')
      render(<SignOutAction signOut={port} />)
      fireEvent.click(screen.getByRole('button', { name: 'Salir' }))

      await screen.findByText(/El cierre de la sesión continúa en el proveedor/i)
      expect(local.setItem).not.toHaveBeenCalled()
      expect(session.setItem).not.toHaveBeenCalled()
      expect(local.size()).toBe(0)
      expect(session.size()).toBe(0)
    } finally {
      local.restore()
      session.restore()
    }
  })
})

function installStorageSpy(name: 'localStorage' | 'sessionStorage') {
  const entries = new Map<string, string>()
  const setItem = vi.fn((key: string, value: string) => {
    entries.set(key, value)
  })
  const storage = {
    get length() {
      return entries.size
    },
    clear: () => entries.clear(),
    getItem: (key: string) => entries.get(key) ?? null,
    key: (index: number) => [...entries.keys()][index] ?? null,
    removeItem: (key: string) => {
      entries.delete(key)
    },
    setItem,
  }
  const original = Object.getOwnPropertyDescriptor(window, name)
  Object.defineProperty(window, name, { configurable: true, value: storage })

  return {
    setItem,
    size: () => entries.size,
    restore: () => {
      if (original) {
        Object.defineProperty(window, name, original)
      } else {
        Reflect.deleteProperty(window, name)
      }
    },
  }
}
