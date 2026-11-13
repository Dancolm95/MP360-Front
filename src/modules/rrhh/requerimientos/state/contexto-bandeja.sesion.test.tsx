/** @vitest-environment jsdom */
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  capabilitySet,
  mockSessionWithCapabilities,
} from '../../../../container/fixtures'
import { SessionStateBoundary, type SessionStateApi } from '../../../../container/session'
import {
  CLAVE_CONTEXTO_BANDEJA,
  contextoBandejaInicial,
  crearStoreContextoBandejaSesion,
  type ContextoBandeja,
  type OpcionesContextoBandeja,
} from './contexto-bandeja'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  window.sessionStorage.clear()
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

function sesion() {
  return mockSessionWithCapabilities(capabilitySet(), {
    displayName: 'Ana Pérez',
  })
}

describe('persistencia intra-sesión del contexto de bandeja (RH-REQ-01 §7.1, §10-14)', () => {
  it('una instancia nueva recupera el contexto tras una recarga real de sessionStorage', () => {
    const previa = crearStoreContextoBandejaSesion(opciones)
    expect(previa.get()).toEqual(contextoBandejaInicial(opciones))
    previa.set(contextoGuardado)

    const crudo = window.sessionStorage.getItem(CLAVE_CONTEXTO_BANDEJA)
    expect(crudo).not.toBeNull()
    expect(crudo).not.toMatch(/ana pérez|token|password|credencial/i)
    expect(Object.keys(JSON.parse(crudo as string)).sort()).toEqual([
      'filtros',
      'orden',
      'paginacion',
    ])

    // Sin ninguna referencia compartida en el heap: otra instancia lee la clave.
    const trasRecarga = crearStoreContextoBandejaSesion(opciones)
    expect(trasRecarga).not.toBe(previa)
    expect(trasRecarga.get()).toEqual(contextoGuardado)
  })

  it('descarta datos corruptos o de otro tipo y vuelve al contexto inicial', () => {
    window.sessionStorage.setItem(CLAVE_CONTEXTO_BANDEJA, '{no-es-json')

    expect(crearStoreContextoBandejaSesion(opciones).get()).toEqual(
      contextoBandejaInicial(opciones),
    )
    expect(window.sessionStorage.getItem(CLAVE_CONTEXTO_BANDEJA)).toBeNull()

    window.sessionStorage.setItem(
      CLAVE_CONTEXTO_BANDEJA,
      JSON.stringify({
        filtros: { estados: ['inexistente'] },
        paginacion: { pagina: 0 },
      }),
    )
    expect(crearStoreContextoBandejaSesion(opciones).get()).toEqual(
      contextoBandejaInicial(opciones),
    )

    window.sessionStorage.setItem(
      CLAVE_CONTEXTO_BANDEJA,
      JSON.stringify('texto'),
    )
    expect(crearStoreContextoBandejaSesion(opciones).get()).toEqual(
      contextoBandejaInicial(opciones),
    )
  })

  it('tolera un almacén ausente o que lanza sin romper la bandeja', () => {
    const almacenRoto = {
      getItem: () => {
        throw new Error('bloqueado')
      },
      setItem: () => {
        throw new Error('cuota agotada')
      },
      removeItem: () => {
        throw new Error('bloqueado')
      },
    }

    const store = crearStoreContextoBandejaSesion(opciones, almacenRoto)
    expect(store.get()).toEqual(contextoBandejaInicial(opciones))
    expect(() => store.set(contextoGuardado)).not.toThrow()
    expect(() => store.clear()).not.toThrow()
    expect(store.get()).toEqual(contextoBandejaInicial(opciones))

    const sinAlmacen = crearStoreContextoBandejaSesion(opciones, null)
    expect(() => sinAlmacen.set(contextoGuardado)).not.toThrow()
    expect(sinAlmacen.get()).toEqual(contextoBandejaInicial(opciones))
  })

  it('clear elimina la clave y deja de devolver el contexto guardado', () => {
    const store = crearStoreContextoBandejaSesion(opciones)
    store.set(contextoGuardado)
    expect(window.sessionStorage.getItem(CLAVE_CONTEXTO_BANDEJA)).not.toBeNull()

    store.clear()

    expect(window.sessionStorage.getItem(CLAVE_CONTEXTO_BANDEJA)).toBeNull()
    expect(store.get()).toEqual(contextoBandejaInicial(opciones))
    expect(crearStoreContextoBandejaSesion(opciones).get()).toEqual(
      contextoBandejaInicial(opciones),
    )
  })

  it('no escribe en localStorage ni persiste datos de identidad', () => {
    const local = instalarEspiaLocalStorage()

    try {
      const store = crearStoreContextoBandejaSesion(opciones)
      store.set(contextoGuardado)

      expect(local.setItem).not.toHaveBeenCalled()
      expect(window.sessionStorage.getItem(CLAVE_CONTEXTO_BANDEJA)).not.toMatch(
        /ana pérez|token|password|credencial/i,
      )
    } finally {
      local.restaurar()
    }
  })

  it.each(['terminated', 'expired'] as const)(
    'se limpia y elimina la clave cuando la sesión termina con %s',
    async (motivo) => {
      const store = crearStoreContextoBandejaSesion(opciones)
      const port = sesion()

      render(
        <SessionStateBoundary session={port} sessionKey="auth-a" stores={[store]}>
          {contenido()}
        </SessionStateBoundary>,
      )
      expect(await screen.findByText('Vista de requerimientos')).toBeDefined()
      store.set(contextoGuardado)
      expect(window.sessionStorage.getItem(CLAVE_CONTEXTO_BANDEJA)).not.toBeNull()

      act(() => {
        port.emitEnded(motivo)
      })

      expect(screen.getByRole('alert').textContent).toMatch(
        motivo === 'expired' ? /ha vencido/i : /se ha cerrado/i,
      )
      expect(window.sessionStorage.getItem(CLAVE_CONTEXTO_BANDEJA)).toBeNull()
      expect(store.get()).toEqual(contextoBandejaInicial(opciones))
    },
  )

  it('se limpia al cerrar sesión con la salida voluntaria', async () => {
    const store = crearStoreContextoBandejaSesion(opciones)
    const port = sesion()

    render(
      <SessionStateBoundary session={port} sessionKey="auth-a" stores={[store]}>
        {(_context, api) => <BotonSalir api={api} />}
      </SessionStateBoundary>,
    )
    const salir = await screen.findByRole('button', { name: 'Salir' })
    store.set(contextoGuardado)

    fireEvent.click(salir)

    expect(screen.getByRole('status').textContent).toMatch(/sesión local/i)
    expect(window.sessionStorage.getItem(CLAVE_CONTEXTO_BANDEJA)).toBeNull()
    expect(store.get()).toEqual(contextoBandejaInicial(opciones))
  })

  it('se limpia al iniciar una autenticación nueva', async () => {
    const store = crearStoreContextoBandejaSesion(opciones)
    const port = sesion()

    const { rerender } = render(
      <SessionStateBoundary session={port} sessionKey="auth-a" stores={[store]}>
        {contenido()}
      </SessionStateBoundary>,
    )
    expect(await screen.findByText('Vista de requerimientos')).toBeDefined()
    store.set(contextoGuardado)

    rerender(
      <SessionStateBoundary session={port} sessionKey="auth-b" stores={[store]}>
        {contenido()}
      </SessionStateBoundary>,
    )

    await waitFor(() =>
      expect(window.sessionStorage.getItem(CLAVE_CONTEXTO_BANDEJA)).toBeNull(),
    )
    expect(store.get()).toEqual(contextoBandejaInicial(opciones))
    expect(await screen.findByText('Vista de requerimientos')).toBeDefined()
  })
})

/**
 * Doble de `localStorage` con espía de escritura. Bajo Node 25 el
 * `localStorage` global experimental puede tapar el de jsdom; se instala un
 * doble mientras dura la prueba para observar cualquier escritura del adaptador.
 */
function instalarEspiaLocalStorage() {
  const setItem = vi.fn()
  const original = Object.getOwnPropertyDescriptor(window, 'localStorage')
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: { setItem },
  })
  return {
    setItem,
    restaurar: () => {
      if (original) {
        Object.defineProperty(window, 'localStorage', original)
      } else {
        Reflect.deleteProperty(window, 'localStorage')
      }
    },
  }
}
