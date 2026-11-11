/** @vitest-environment jsdom */
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useEffect, useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { SessionContext, SessionContextResult, SessionPort } from '../contracts'
import {
  CAP_RRHH_REQUERIMIENTOS_READ,
  capabilitySet,
  createContextErrorFixture,
  createDeferred,
  createExpiredFixture,
  createInMemoryStore,
  createLoadingFixture,
  createMockSession,
  createTerminatedFixture,
  mockSessionWithCapabilities,
} from '../fixtures'
import { SessionStateBoundary } from './SessionStateBoundary'
import type { SessionStateApi } from './useSessionState'
import type { SessionStateCleanupStore } from './store-registry'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

function identityContent(context: SessionContext) {
  const name = context.identity?.displayName
  return <p>Identidad: {name ?? 'sin identidad'}</p>
}

function RegisteredStore({
  api,
  store,
}: {
  readonly api: SessionStateApi
  readonly store: SessionStateCleanupStore
}) {
  useEffect(() => api.registerStore(store), [api, store])
  return <p>Vista con store</p>
}

function StoreLifecycle({
  api,
  store,
}: {
  readonly api: SessionStateApi
  readonly store: SessionStateCleanupStore
}) {
  const [visible, setVisible] = useState(true)
  return (
    <>
      <button type="button" onClick={() => setVisible(false)}>
        Retirar vista
      </button>
      {visible ? <RegisteredStore api={api} store={store} /> : null}
    </>
  )
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
    expect(document.activeElement).toBe(screen.getByRole('status'))
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

  it('si el puerto rechaza sin resultado tipado, no reclama un reintento no acordado', async () => {
    const session: SessionPort = {
      getContext: () => Promise.reject(new Error('fallo de transporte')),
      onEnded: () => () => undefined,
      recoverAccess: async () => undefined,
    }

    render(
      <SessionStateBoundary session={session}>{identityContent}</SessionStateBoundary>,
    )

    const alert = await screen.findByRole('alert')
    expect(alert.textContent).toContain('No se pudo cargar la sesión.')
    expect(alert.textContent).toMatch(/proveedor de identidad externo/i)
    expect(screen.queryByRole('button', { name: 'Reintentar' })).toBeNull()
    expect(screen.queryByText(/Identidad:/)).toBeNull()
  })

  it('un resultado que no respeta el contrato se trata como error no reintentable', async () => {
    const malformed = { status: 'authenticated' } as unknown as SessionContextResult
    const session: SessionPort = {
      getContext: async () => malformed,
      onEnded: () => () => undefined,
      recoverAccess: async () => undefined,
    }

    render(
      <SessionStateBoundary session={session}>{identityContent}</SessionStateBoundary>,
    )

    const alert = await screen.findByRole('alert')
    expect(alert.textContent).toContain('No se pudo cargar la sesión.')
    expect(screen.queryByRole('button', { name: 'Reintentar' })).toBeNull()
    expect(screen.queryByText(/Identidad:/)).toBeNull()
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
    expect(alert.getAttribute('aria-live')).toBe('assertive')
    expect(document.activeElement).toBe(alert)
    expect(screen.queryByText(/Identidad: Ana Pérez/)).toBeNull()
    expect(store.get()).toBeUndefined()
    expect(unsubscribeCalls).toBe(0)

    unmount()
    expect(unsubscribeCalls).toBe(1)
  })

  it('desregistra el store cuando se desmonta la vista que lo aporta', async () => {
    const session = mockSessionWithCapabilities(capabilitySet(), {
      displayName: 'Ana Pérez',
    })
    const store = createInMemoryStore<unknown>()
    store.set({ filtro: 'conservado fuera de la vista' })

    render(
      <SessionStateBoundary session={session}>
        {(_context, api) => <StoreLifecycle api={api} store={store} />}
      </SessionStateBoundary>,
    )
    await screen.findByText('Vista con store')

    fireEvent.click(screen.getByRole('button', { name: 'Retirar vista' }))
    expect(screen.queryByText('Vista con store')).toBeNull()

    act(() => session.emitEnded('terminated'))

    expect(screen.getByRole('alert')).toBe(document.activeElement)
    expect(store.get()).toEqual({ filtro: 'conservado fuera de la vista' })
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
  function sessionContent(context: SessionContext) {
    return (
      <>
        <p>Identidad: {context.identity?.displayName ?? 'sin identidad'}</p>
        <p>Capacidades: {context.capabilities.join(',') || 'ninguna'}</p>
      </>
    )
  }

  it('con la frontera montada, una autenticación nueva limpia todos los stores y no hereda identidad ni contexto', async () => {
    const filters = createInMemoryStore<unknown>()
    const trayContext = createInMemoryStore<unknown>()
    filters.set({ filtro: 'abiertos', pagina: 2 })
    trayContext.set({ contexto: 'bandeja-A' })
    const stores = [filters, trayContext]

    const sessionA = mockSessionWithCapabilities(
      capabilitySet(CAP_RRHH_REQUERIMIENTOS_READ),
      { displayName: 'Ana Pérez' },
    )
    const sessionB = mockSessionWithCapabilities(capabilitySet(), {
      displayName: 'Bea Ruiz',
    })

    const { rerender } = render(
      <SessionStateBoundary session={sessionA} sessionKey="auth-a" stores={stores}>
        {sessionContent}
      </SessionStateBoundary>,
    )
    expect(await screen.findByText('Identidad: Ana Pérez')).toBeDefined()
    expect(
      screen.getByText(`Capacidades: ${CAP_RRHH_REQUERIMIENTOS_READ}`),
    ).toBeDefined()
    expect(filters.get()).toEqual({ filtro: 'abiertos', pagina: 2 })
    expect(trayContext.get()).toEqual({ contexto: 'bandeja-A' })

    rerender(
      <SessionStateBoundary session={sessionB} sessionKey="auth-b" stores={stores}>
        {sessionContent}
      </SessionStateBoundary>,
    )

    // Ni la identidad ni las capacidades de A se pintan como vigentes.
    expect(screen.queryByText(/Ana Pérez/)).toBeNull()
    expect(
      screen.queryByText(`Capacidades: ${CAP_RRHH_REQUERIMIENTOS_READ}`),
    ).toBeNull()

    expect(await screen.findByText('Identidad: Bea Ruiz')).toBeDefined()
    expect(screen.getByText('Capacidades: ninguna')).toBeDefined()
    expect(screen.queryByText(/Ana Pérez/)).toBeNull()
    // Todos los stores de la autenticación anterior quedan vacíos.
    expect(filters.get()).toBeUndefined()
    expect(trayContext.get()).toBeUndefined()
  })

  it('una respuesta tardía de la autenticación anterior no repuebla el estado', async () => {
    const pendingA = createDeferred<SessionContextResult>()
    const sessionA = createMockSession({ getContext: () => pendingA.promise })
    const sessionB = mockSessionWithCapabilities(capabilitySet(), {
      displayName: 'Bea Ruiz',
    })

    const { rerender } = render(
      <SessionStateBoundary session={sessionA} sessionKey="auth-a">
        {sessionContent}
      </SessionStateBoundary>,
    )
    expect(screen.getByRole('status')).toBeDefined()

    rerender(
      <SessionStateBoundary session={sessionB} sessionKey="auth-b">
        {sessionContent}
      </SessionStateBoundary>,
    )
    expect(await screen.findByText('Identidad: Bea Ruiz')).toBeDefined()

    await act(async () => {
      pendingA.resolve({
        status: 'authenticated',
        context: { identity: { displayName: 'Ana Pérez' }, capabilities: [] },
      })
    })

    expect(screen.getByText('Identidad: Bea Ruiz')).toBeDefined()
    expect(screen.queryByText(/Ana Pérez/)).toBeNull()
  })

  it('una respuesta tardía de getContext no repuebla el estado tras endSession', async () => {
    const pending = createDeferred<SessionContextResult>()
    const session = createMockSession({ getContext: () => pending.promise })

    render(
      <SessionStateBoundary session={session}>
        {(_context, api) => (
          <button
            type="button"
            onClick={() => {
              api.retry()
              api.endSession('local')
            }}
          >
            Finalizar localmente
          </button>
        )}
      </SessionStateBoundary>,
    )

    expect(screen.getByRole('status').textContent).toMatch(/Cargando sesión/i)

    act(() => {
      pending.resolve({
        status: 'authenticated',
        context: { identity: { displayName: 'Ana Pérez' }, capabilities: [] },
      })
    })
    const button = await screen.findByRole('button', { name: 'Finalizar localmente' })

    const secondPending = createDeferred<SessionContextResult>()
    session.getContext = () => secondPending.promise
    fireEvent.click(button)

    expect(screen.getByRole('status').textContent).toMatch(/sesión local se ha cerrado/i)
    await act(async () => {
      secondPending.resolve({
        status: 'authenticated',
        context: { identity: { displayName: 'Identidad tardía' }, capabilities: [] },
      })
    })

    expect(screen.getByRole('status').textContent).toMatch(/sesión local se ha cerrado/i)
    expect(screen.queryByText(/Identidad tardía/)).toBeNull()
  })

  it('un re-render con la misma sessionKey conserva los filtros de la misma sesión', async () => {
    const store = createInMemoryStore<unknown>()
    store.set({ filtro: 'abiertos' })
    const session = mockSessionWithCapabilities(capabilitySet(), {
      displayName: 'Ana Pérez',
    })

    const { rerender } = render(
      <SessionStateBoundary session={session} sessionKey="auth-a" stores={[store]}>
        {identityContent}
      </SessionStateBoundary>,
    )
    expect(await screen.findByText('Identidad: Ana Pérez')).toBeDefined()

    rerender(
      <SessionStateBoundary session={session} sessionKey="auth-a" stores={[store]}>
        {identityContent}
      </SessionStateBoundary>,
    )

    expect(await screen.findByText('Identidad: Ana Pérez')).toBeDefined()
    expect(store.get()).toEqual({ filtro: 'abiertos' })
  })

  it('onEnded("terminated") limpia todos los stores registrados', async () => {
    const filters = createInMemoryStore<unknown>()
    const trayContext = createInMemoryStore<unknown>()
    filters.set({ filtro: 'abiertos' })
    trayContext.set({ contexto: 'bandeja' })

    const session = mockSessionWithCapabilities(capabilitySet(), {
      displayName: 'Ana Pérez',
    })

    render(
      <SessionStateBoundary
        session={session}
        sessionKey="auth-a"
        stores={[filters, trayContext]}
      >
        {identityContent}
      </SessionStateBoundary>,
    )
    expect(await screen.findByText('Identidad: Ana Pérez')).toBeDefined()

    act(() => {
      session.emitEnded('terminated')
    })

    expect(screen.getByRole('alert').textContent).toMatch(/se ha cerrado/i)
    expect(screen.queryByText(/Identidad: Ana Pérez/)).toBeNull()
    expect(filters.get()).toBeUndefined()
    expect(trayContext.get()).toBeUndefined()
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
