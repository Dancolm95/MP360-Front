/** @vitest-environment jsdom */
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  capabilitySet,
  createInMemoryStore,
  mockSessionWithCapabilities,
} from '../../../../container/fixtures'
import { SessionStateBoundary, type SessionStateApi } from '../../../../container/session'
import type { ContextoBandeja } from './contexto-bandeja'
import {
  crearStoreContextoBandeja,
  type OpcionesContextoBandeja,
} from './contexto-bandeja'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

const opciones: OpcionesContextoBandeja = { tamanoPaginaInicial: 10 }

const contextoGuardado: ContextoBandeja = {
  filtros: { estados: ['aprobado'] },
  orden: { campo: 'fecha-creacion', direccion: 'desc' },
  paginacion: { pagina: 2, tamanoPagina: 10 },
}

function contenido() {
  return <p>Vista de requerimientos</p>
}

function BotonSalir({ api }: { readonly api: SessionStateApi }) {
  return (
    <button type="button" onClick={() => api.endSession('local')}>
      Salir
    </button>
  )
}

describe('persistencia intra-sesión del contexto de bandeja (RH-REQ-01 §7.1, §10-14)', () => {
  it('sobrevive al remontaje de la vista dentro de la misma sesión', async () => {
    const base = createInMemoryStore<unknown>()
    const store = crearStoreContextoBandeja(base, opciones)
    const session = mockSessionWithCapabilities(capabilitySet(), {
      displayName: 'Ana Pérez',
    })

    const { unmount } = render(
      <SessionStateBoundary session={session} sessionKey="auth-a" stores={[store]}>
        {contenido()}
      </SessionStateBoundary>,
    )
    expect(await screen.findByText('Vista de requerimientos')).toBeDefined()

    store.set(contextoGuardado)
    unmount()

    // La recarga o el regreso monta otra instancia sobre el mismo almacén de sesión.
    const trasRecarga = crearStoreContextoBandeja(base, opciones)
    expect(trasRecarga.get()).toEqual(contextoGuardado)
  })

  it('se limpia cuando la sesión vence o termina', async () => {
    const base = createInMemoryStore<unknown>()
    const store = crearStoreContextoBandeja(base, opciones)
    const session = mockSessionWithCapabilities(capabilitySet(), {
      displayName: 'Ana Pérez',
    })

    render(
      <SessionStateBoundary session={session} sessionKey="auth-a" stores={[store]}>
        {contenido()}
      </SessionStateBoundary>,
    )
    expect(await screen.findByText('Vista de requerimientos')).toBeDefined()
    store.set(contextoGuardado)

    act(() => {
      session.emitEnded('terminated')
    })

    expect(screen.getByRole('alert').textContent).toMatch(/se ha cerrado/i)
    expect(store.get()).toBeUndefined()
  })

  it('se limpia al cerrar sesión con la salida voluntaria', async () => {
    const base = createInMemoryStore<unknown>()
    const store = crearStoreContextoBandeja(base, opciones)
    const session = mockSessionWithCapabilities(capabilitySet(), {
      displayName: 'Ana Pérez',
    })

    render(
      <SessionStateBoundary session={session} sessionKey="auth-a" stores={[store]}>
        {(_context, api) => <BotonSalir api={api} />}
      </SessionStateBoundary>,
    )
    const salir = await screen.findByRole('button', { name: 'Salir' })
    store.set(contextoGuardado)

    fireEvent.click(salir)

    expect(screen.getByRole('status').textContent).toMatch(/sesión local/i)
    expect(store.get()).toBeUndefined()
  })

  it('se limpia al iniciar una autenticación nueva', async () => {
    const base = createInMemoryStore<unknown>()
    const store = crearStoreContextoBandeja(base, opciones)
    const session = mockSessionWithCapabilities(capabilitySet(), {
      displayName: 'Ana Pérez',
    })

    const { rerender } = render(
      <SessionStateBoundary session={session} sessionKey="auth-a" stores={[store]}>
        {contenido()}
      </SessionStateBoundary>,
    )
    expect(await screen.findByText('Vista de requerimientos')).toBeDefined()
    store.set(contextoGuardado)

    rerender(
      <SessionStateBoundary session={session} sessionKey="auth-b" stores={[store]}>
        {contenido()}
      </SessionStateBoundary>,
    )

    await waitFor(() => expect(store.get()).toBeUndefined())
    expect(await screen.findByText('Vista de requerimientos')).toBeDefined()
  })

  it('no escribe en localStorage ni en sessionStorage', async () => {
    const local = instalarEspiaStorage('localStorage')
    const sessionStorageEspia = instalarEspiaStorage('sessionStorage')
    const base = createInMemoryStore<unknown>()
    const store = crearStoreContextoBandeja(base, opciones)
    const session = mockSessionWithCapabilities(capabilitySet(), {
      displayName: 'Ana Pérez',
    })

    try {
      render(
        <SessionStateBoundary session={session} sessionKey="auth-a" stores={[store]}>
          {contenido()}
        </SessionStateBoundary>,
      )
      expect(await screen.findByText('Vista de requerimientos')).toBeDefined()

      store.set(contextoGuardado)

      expect(base.get()).toEqual(contextoGuardado)
      expect(local.setItem).not.toHaveBeenCalled()
      expect(sessionStorageEspia.setItem).not.toHaveBeenCalled()
    } finally {
      local.restore()
      sessionStorageEspia.restore()
    }
  })
})

/** Doble de `Storage` con espía de escritura, instalado mientras dura la prueba. */
function instalarEspiaStorage(name: 'localStorage' | 'sessionStorage') {
  const entradas = new Map<string, string>()
  const setItem = vi.fn((clave: string, valor: string) => {
    entradas.set(clave, valor)
  })
  const storage = {
    get length() {
      return entradas.size
    },
    clear: () => entradas.clear(),
    getItem: (clave: string) => entradas.get(clave) ?? null,
    key: (indice: number) => [...entradas.keys()][indice] ?? null,
    removeItem: (clave: string) => {
      entradas.delete(clave)
    },
    setItem,
  }
  const original = Object.getOwnPropertyDescriptor(window, name)
  Object.defineProperty(window, name, { configurable: true, value: storage })

  return {
    setItem,
    restore: () => {
      if (original) {
        Object.defineProperty(window, name, original)
      } else {
        Reflect.deleteProperty(window, name)
      }
    },
  }
}
