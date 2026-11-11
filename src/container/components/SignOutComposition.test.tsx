/** @vitest-environment jsdom */
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type {
  CatalogPort,
  SectionCatalog,
  SignOutPort,
  SignOutResult,
} from '../contracts'
import {
  CAP_RRHH_REQUERIMIENTOS_READ,
  capabilitySet,
  createInMemoryStore,
  createSessionWithUx02Fixture,
  mockSessionWithCapabilities,
  mockSignOutError,
  mockSignOutSuccess,
} from '../fixtures'
import { SessionStateBoundary } from '../session'
import { ContainerShell } from './ContainerShell'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

async function readCatalog(port: CatalogPort): Promise<SectionCatalog> {
  const result = await port.getCatalog()
  if (result.status !== 'ready') {
    throw new Error('El fixture debía entregar un catálogo disponible.')
  }
  return result.catalog
}

const capabilities = capabilitySet(CAP_RRHH_REQUERIMIENTOS_READ)

describe('Composición real de «Salir» con la cabecera y la sesión (criterio 7)', () => {
  for (const destination of ['provider', 'local'] as const) {
    it(`con éxito destino ${destination} limpia identidad, contexto, capacidades y todos los stores`, async () => {
      const catalog = await readCatalog(createSessionWithUx02Fixture().catalog)
      const filters = createInMemoryStore<unknown>()
      const trayContext = createInMemoryStore<unknown>()
      filters.set({ filtro: 'abiertos', pagina: 2 })
      trayContext.set({ contexto: 'bandeja-A' })
      const stores = [filters, trayContext]

      const session = mockSessionWithCapabilities(capabilities, {
        displayName: 'Ana Pérez',
      })
      const signOut = mockSignOutSuccess(destination)
      const signOutSpy = vi.spyOn(signOut, 'signOut')

      render(
        <SessionStateBoundary session={session} sessionKey="auth-a" stores={stores}>
          {(context, api) => (
            <ContainerShell
              catalog={catalog}
              identity={context.identity}
              signOut={signOut}
              onSignedOut={api.endSession}
            >
              <p>Contenido protegido</p>
              <p>Capacidades: {context.capabilities.join(',') || 'ninguna'}</p>
            </ContainerShell>
          )}
        </SessionStateBoundary>,
      )

      expect(await screen.findByText('Ana Pérez')).toBeDefined()
      expect(screen.getByText('Contenido protegido')).toBeDefined()
      expect(filters.get()).toEqual({ filtro: 'abiertos', pagina: 2 })

      fireEvent.click(screen.getByRole('button', { name: 'Salir' }))

      const confirmation = await screen.findByText(
        destination === 'provider'
          ? /El cierre de la sesión continúa en el proveedor/i
          : /La sesión local se ha cerrado/i,
      )
      expect(confirmation.textContent).toMatch(
        destination === 'provider'
          ? /El cierre de la sesión continúa en el proveedor/i
          : /La sesión local se ha cerrado/i,
      )
      expect(signOutSpy).toHaveBeenCalledTimes(1)

      expect(screen.queryByText('Ana Pérez')).toBeNull()
      expect(screen.queryByText('Contenido protegido')).toBeNull()
      expect(screen.queryByText(/Capacidades:/)).toBeNull()
      expect(screen.queryByRole('button', { name: 'Salir' })).toBeNull()
      expect(filters.get()).toBeUndefined()
      expect(trayContext.get()).toBeUndefined()

      // Un aviso tardío del proveedor no revierte la confirmación de la salida.
      act(() => {
        session.emitEnded('terminated')
      })
      expect(
        screen.getByText(
          destination === 'provider'
            ? /El cierre de la sesión continúa en el proveedor/i
            : /La sesión local se ha cerrado/i,
        ),
      ).toBeDefined()

      expect(screen.queryByRole('textbox')).toBeNull()
      expect(document.querySelector('input[type="password"]')).toBeNull()
    })
  }

  it('ante error reintentable conserva el estado y el reintento con éxito limpia la sesión', async () => {
    const catalog = await readCatalog(createSessionWithUx02Fixture().catalog)
    const filters = createInMemoryStore<unknown>()
    const trayContext = createInMemoryStore<unknown>()
    filters.set({ filtro: 'abiertos' })
    trayContext.set({ contexto: 'bandeja-A' })
    const stores = [filters, trayContext]

    const session = mockSessionWithCapabilities(capabilities, {
      displayName: 'Ana Pérez',
    })
    let calls = 0
    const signOut: SignOutPort = {
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

    render(
      <SessionStateBoundary session={session} sessionKey="auth-a" stores={stores}>
        {(context, api) => (
          <ContainerShell
            catalog={catalog}
            identity={context.identity}
            signOut={signOut}
            onSignedOut={api.endSession}
          >
            <p>Contenido protegido</p>
          </ContainerShell>
        )}
      </SessionStateBoundary>,
    )

    expect(await screen.findByText('Ana Pérez')).toBeDefined()

    fireEvent.click(screen.getByRole('button', { name: 'Salir' }))

    const alert = await screen.findByRole('alert')
    expect(alert.textContent).toContain('El proveedor no responde en este momento.')
    expect(calls).toBe(1)
    expect(screen.getByText('Ana Pérez')).toBeDefined()
    expect(screen.getByText('Contenido protegido')).toBeDefined()
    expect(filters.get()).toEqual({ filtro: 'abiertos' })
    expect(trayContext.get()).toEqual({ contexto: 'bandeja-A' })

    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }))

    expect(await screen.findByText(/La sesión local se ha cerrado/i)).toBeDefined()
    expect(calls).toBe(2)
    expect(screen.queryByText('Ana Pérez')).toBeNull()
    expect(screen.queryByText('Contenido protegido')).toBeNull()
    expect(filters.get()).toBeUndefined()
    expect(trayContext.get()).toBeUndefined()
  })

  it('ante error no reintentable conserva el estado y no ofrece reintento', async () => {
    const catalog = await readCatalog(createSessionWithUx02Fixture().catalog)
    const filters = createInMemoryStore<unknown>()
    filters.set({ filtro: 'abiertos' })

    const session = mockSessionWithCapabilities(capabilities, {
      displayName: 'Ana Pérez',
    })
    const signOut = mockSignOutError({
      message: 'El proveedor rechazó el cierre de la sesión.',
      retryable: false,
    })

    render(
      <SessionStateBoundary session={session} sessionKey="auth-a" stores={[filters]}>
        {(context, api) => (
          <ContainerShell
            catalog={catalog}
            identity={context.identity}
            signOut={signOut}
            onSignedOut={api.endSession}
          >
            <p>Contenido protegido</p>
          </ContainerShell>
        )}
      </SessionStateBoundary>,
    )

    expect(await screen.findByText('Ana Pérez')).toBeDefined()

    fireEvent.click(screen.getByRole('button', { name: 'Salir' }))

    const alert = await screen.findByRole('alert')
    expect(alert.textContent).toContain('El proveedor rechazó el cierre de la sesión.')
    expect(screen.queryByRole('button', { name: 'Reintentar' })).toBeNull()
    expect(screen.getByText('Ana Pérez')).toBeDefined()
    expect(screen.getByText('Contenido protegido')).toBeDefined()
    expect(filters.get()).toEqual({ filtro: 'abiertos' })
  })

  it('la composición no escribe en localStorage ni en sessionStorage', async () => {
    const catalog = await readCatalog(createSessionWithUx02Fixture().catalog)
    const local = installStorageSpy('localStorage')
    const session = installStorageSpy('sessionStorage')

    try {
      const sessionPort = mockSessionWithCapabilities(capabilities, {
        displayName: 'Ana Pérez',
      })
      const signOut = mockSignOutSuccess('provider')

      render(
        <SessionStateBoundary session={sessionPort} sessionKey="auth-a">
          {(context, api) => (
            <ContainerShell
              catalog={catalog}
              identity={context.identity}
              signOut={signOut}
              onSignedOut={api.endSession}
            >
              <p>Contenido protegido</p>
            </ContainerShell>
          )}
        </SessionStateBoundary>,
      )

      expect(await screen.findByText('Ana Pérez')).toBeDefined()
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
