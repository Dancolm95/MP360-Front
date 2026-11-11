/** @vitest-environment jsdom */
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { SessionContext, SessionPort } from '../contracts'
import {
  capabilitySet,
  createContextErrorFixture,
  createExpiredFixture,
  createInMemoryStore,
  createLoadingFixture,
  createTerminatedFixture,
  mockSessionWithCapabilities,
} from '../fixtures'
import { SessionStateBoundary } from './SessionStateBoundary'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

function identityContent(context: SessionContext) {
  const name = context.identity?.displayName
  return <p>Identidad: {name ?? 'sin identidad'}</p>
}

describe('SessionStateBoundary (CORE-01 §7 criterio 5: carga y error)', () => {
  it('durante la carga no pinta identidad, navegación ni datos previos', async () => {
    const { fixture, resolveSession } = createLoadingFixture()

    render(
      <SessionStateBoundary session={fixture.session}>
        {identityContent}
      </SessionStateBoundary>,
    )

    expect(screen.getByRole('status').textContent).toMatch(/Cargando sesión/i)
    expect(screen.queryByText(/Identidad:/)).toBeNull()
    expect(screen.queryByRole('button', { name: /RR\. HH\./ })).toBeNull()
    expect(screen.queryByRole('navigation')).toBeNull()

    await act(async () => {
      resolveSession({
        status: 'authenticated',
        context: { identity: { displayName: 'Ana Pérez' }, capabilities: [] },
      })
    })

    expect(await screen.findByText('Identidad: Ana Pérez')).toBeDefined()
    expect(screen.queryByRole('status')).toBeNull()
  })

  it('muestra el error comprensible, no hereda datos y reintenta getContext()', async () => {
    const fixture = createContextErrorFixture({
      message: 'No se pudo obtener el contexto del usuario.',
      retryable: true,
    })
    let calls = 0
    const session: SessionPort = {
      ...fixture.session,
      getContext: () => {
        calls += 1
        return fixture.session.getContext()
      },
    }

    render(
      <SessionStateBoundary session={session}>{identityContent}</SessionStateBoundary>,
    )

    const alert = await screen.findByRole('alert')
    expect(alert.textContent).toContain('No se pudo obtener el contexto del usuario.')
    expect(screen.queryByText(/Identidad:/)).toBeNull()
    expect(screen.queryByRole('button', { name: /RR\. HH\./ })).toBeNull()
    expect(calls).toBe(1)

    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }))

    await waitFor(() => expect(calls).toBe(2))
    expect(await screen.findByRole('alert')).toBeDefined()
    expect(screen.queryByText(/Identidad:/)).toBeNull()
  })

  it('sin reintento posible no ofrece el botón y mantiene el mensaje', async () => {
    const fixture = createContextErrorFixture({
      message: 'La sesión no está disponible en este momento.',
      retryable: false,
    })

    render(
      <SessionStateBoundary session={fixture.session}>{identityContent}</SessionStateBoundary>,
    )

    const alert = await screen.findByRole('alert')
    expect(alert.textContent).toContain('La sesión no está disponible en este momento.')
    expect(screen.queryByRole('button', { name: 'Reintentar' })).toBeNull()
  })

  it('al cambiar a una sesión con error no muestra la identidad anterior como vigente', async () => {
    const previous = mockSessionWithCapabilities(capabilitySet(), {
      displayName: 'Ana Pérez',
    })
    const { rerender } = render(
      <SessionStateBoundary session={previous}>{identityContent}</SessionStateBoundary>,
    )
    expect(await screen.findByText('Identidad: Ana Pérez')).toBeDefined()

    const failing = createContextErrorFixture({
      message: 'No se pudo obtener el contexto del usuario.',
      retryable: true,
    }).session

    rerender(
      <SessionStateBoundary session={failing}>{identityContent}</SessionStateBoundary>,
    )

    expect(screen.queryByText(/Identidad: Ana Pérez/)).toBeNull()
    await screen.findByRole('alert')
    expect(screen.queryByText(/Identidad: Ana Pérez/)).toBeNull()
  })
})

describe('SessionStateBoundary (CORE-01 §7 criterio 6: vencimiento y terminación)', () => {
  const scenarios = [
    {
      name: 'vencida',
      create: createExpiredFixture,
      message: /La sesión ha vencido/i,
    },
    {
      name: 'terminada externamente',
      create: createTerminatedFixture,
      message: /se ha cerrado desde el proveedor externo/i,
    },
  ] as const

  for (const scenario of scenarios) {
    it(`con sesión ${scenario.name} limpia estado y store y pide recuperación externa`, async () => {
      const fixture = scenario.create()
      fixture.store.set({ filtro: 'abiertos', pagina: 2 })

      render(
        <SessionStateBoundary session={fixture.session} stores={[fixture.store]}>
          {identityContent}
        </SessionStateBoundary>,
      )

      const alert = await screen.findByRole('alert')
      expect(alert.textContent).toMatch(scenario.message)
      expect(alert.textContent).toMatch(/proveedor de identidad externo/i)
      expect(fixture.store.get()).toBeUndefined()
      expect(screen.queryByText(/Identidad:/)).toBeNull()

      // Sin login local: ni formulario, ni campos de credenciales, ni acción de acceso.
      expect(screen.queryByRole('textbox')).toBeNull()
      expect(document.querySelector('input[type="password"]')).toBeNull()
      expect(
        screen.queryByRole('button', { name: /iniciar sesión|entrar|acceder/i }),
      ).toBeNull()
    })
  }

  it('onEnded limpia de inmediato contenido y stores y se desuscribe al desmontar', async () => {
    const fixture = mockSessionWithCapabilities(capabilitySet(), {
      displayName: 'Ana Pérez',
    })
    const store = createInMemoryStore<unknown>()
    store.set({ filtro: 'abiertos' })

    let unsubscribeCalls = 0
    const session: SessionPort = {
      ...fixture,
      onEnded: (listener) => {
        const unsubscribe = fixture.onEnded(listener)
        return () => {
          unsubscribeCalls += 1
          unsubscribe()
        }
      },
    }

    const { unmount } = render(
      <SessionStateBoundary session={session} stores={[store]}>
        {identityContent}
      </SessionStateBoundary>,
    )
    expect(await screen.findByText('Identidad: Ana Pérez')).toBeDefined()
    // Durante la misma sesión autenticada el store se conserva; solo se limpia al terminar.
    expect(store.get()).toEqual({ filtro: 'abiertos' })

    act(() => {
      fixture.emitEnded('expired')
    })

    const alert = screen.getByRole('alert')
    expect(alert.textContent).toMatch(/La sesión ha vencido/i)
    expect(screen.queryByText(/Identidad: Ana Pérez/)).toBeNull()
    expect(store.get()).toBeUndefined()
    expect(unsubscribeCalls).toBe(0)

    unmount()
    expect(unsubscribeCalls).toBe(1)
  })

  it('si la sesión termina durante la carga, una respuesta tardía no repuebla el estado', async () => {
    const { fixture, resolveSession } = createLoadingFixture()

    render(
      <SessionStateBoundary session={fixture.session}>
        {identityContent}
      </SessionStateBoundary>,
    )
    expect(screen.getByRole('status')).toBeDefined()

    act(() => {
      fixture.session.emitEnded('terminated')
    })
    expect(screen.getByRole('alert').textContent).toMatch(/se ha cerrado/i)

    await act(async () => {
      resolveSession({
        status: 'authenticated',
        context: { identity: { displayName: 'Ana Pérez' }, capabilities: [] },
      })
    })

    expect(screen.getByRole('alert').textContent).toMatch(/se ha cerrado/i)
    expect(screen.queryByText(/Identidad: Ana Pérez/)).toBeNull()
  })
})

describe('SessionStateBoundary (nueva autenticación y persistencia)', () => {
  it('una nueva autenticación no hereda identidad ni estado de la anterior', async () => {
    const first = mockSessionWithCapabilities(capabilitySet(), {
      displayName: 'Ana Pérez',
    })
    const firstRender = render(
      <SessionStateBoundary session={first}>{identityContent}</SessionStateBoundary>,
    )
    expect(await screen.findByText('Identidad: Ana Pérez')).toBeDefined()
    firstRender.unmount()

    const second = mockSessionWithCapabilities(capabilitySet(), {
      displayName: 'Bea Ruiz',
    })
    render(
      <SessionStateBoundary session={second}>{identityContent}</SessionStateBoundary>,
    )

    // Antes de resolver la nueva carga no se pinta la identidad anterior.
    expect(screen.queryByText(/Ana Pérez/)).toBeNull()
    expect(await screen.findByText('Identidad: Bea Ruiz')).toBeDefined()
    expect(screen.queryByText(/Ana Pérez/)).toBeNull()
  })

  it('no escribe en localStorage/sessionStorage y deja ambos vacíos tras terminar', async () => {
    // Bajo Node 25, el `localStorage` global experimental puede tapar el de
    // jsdom; se inyecta un doble con espías para observar cualquier escritura.
    const local = installStorageSpy('localStorage')
    const session = installStorageSpy('sessionStorage')

    try {
      const fixture = createTerminatedFixture()
      fixture.store.set({ filtro: 'abiertos' })

      render(
        <SessionStateBoundary session={fixture.session} stores={[fixture.store]}>
          {identityContent}
        </SessionStateBoundary>,
      )

      await screen.findByRole('alert')
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

/** Doble de `Storage` con espía de escritura, instalado mientras dura la prueba. */
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
