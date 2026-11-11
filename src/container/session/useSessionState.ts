'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ContractError } from '../../shared'
import type {
  SessionContext,
  SessionContextResult,
  SessionEndedReason,
  SessionPort,
} from '../contracts'
import {
  createSessionStoreRegistry,
  type SessionStateCleanupStore,
} from './store-registry'

/**
 * Límite de estado de sesión del contenedor (C-01, plan §2.1; CORE-01 §5 y §7
 * criterios 5 y 6).
 *
 * Representa `loading`, `authenticated`, `error`, `expired` y `terminated` a
 * partir de `SessionPort.getContext()` y `onEnded()`. Mientras carga o falla no
 * conserva identidad, contexto ni capacidades anteriores; al vencer o terminar
 * limpia de inmediato el estado y todos los stores intra-sesión registrados.
 * No implementa login local ni captura credenciales.
 */

export type SessionState =
  | { readonly status: 'loading' }
  | { readonly status: 'authenticated'; readonly context: SessionContext }
  | { readonly status: 'error'; readonly error: ContractError }
  | { readonly status: 'expired' }
  | { readonly status: 'terminated' }

export interface UseSessionStateOptions {
  /**
   * Stores intra-sesión (filtros, contexto de bandeja) que deben limpiarse al
   * vencer o terminar. Hoy no existen vistas RH; el registro queda disponible
   * para cuando aporten los suyos.
   */
  readonly stores?: readonly SessionStateCleanupStore[]
}

export interface SessionStateApi {
  readonly state: SessionState
  /** Reintenta `getContext()`; solo se ofrece desde el estado de error. */
  readonly retry: () => void
  /** Recuperación delegada en el proveedor externo; sin login local. */
  readonly recoverAccess: () => Promise<void>
  /** Registra un store adicional para limpiarlo al terminar la sesión. */
  readonly registerStore: (store: SessionStateCleanupStore) => () => void
}

/** Error de contrato cuando el puerto rechaza la promesa sin resultado tipado. */
const FALLBACK_CONTEXT_ERROR: ContractError = {
  message: 'No se pudo cargar la sesión. Vuelve a intentarlo.',
  retryable: true,
}

function isContextResult(value: unknown): value is SessionContextResult {
  if (typeof value !== 'object' || value === null) return false
  const status = (value as { readonly status?: unknown }).status
  return (
    status === 'authenticated' ||
    status === 'expired' ||
    status === 'terminated' ||
    status === 'error'
  )
}

export function useSessionState(
  session: SessionPort,
  options: UseSessionStateOptions = {},
): SessionStateApi {
  const [state, setState] = useState<SessionState>({ status: 'loading' })
  const [registry] = useState(createSessionStoreRegistry)
  const generationRef = useRef(0)
  const activeSessionRef = useRef(session)

  // Al cambiar el puerto de sesión (nueva autenticación) se descarta el estado
  // anterior en el mismo render, antes de que llegue a pintarse como vigente.
  if (activeSessionRef.current !== session) {
    activeSessionRef.current = session
    generationRef.current += 1
    if (state.status !== 'loading') {
      setState({ status: 'loading' })
    }
  }

  // Los stores declarados se registran antes de pedir el contexto; así una
  // expiración inmediata ya los limpia.
  useEffect(() => {
    const unregisters = (options.stores ?? []).map((store) => registry.register(store))
    return () => {
      for (const unregister of unregisters) {
        unregister()
      }
    }
  }, [options.stores, registry])

  const clearForEnded = useCallback(
    (reason: SessionEndedReason) => {
      generationRef.current += 1
      registry.clearAll()
      setState(reason === 'expired' ? { status: 'expired' } : { status: 'terminated' })
    },
    [registry],
  )

  const load = useCallback(async () => {
    const generation = ++generationRef.current
    setState({ status: 'loading' })

    let result: SessionContextResult
    try {
      result = await session.getContext()
    } catch {
      result = { status: 'error', error: FALLBACK_CONTEXT_ERROR }
    }

    // Una respuesta tardía de una carga anterior no repuebla el estado.
    if (generation !== generationRef.current) return

    if (!isContextResult(result)) {
      setState({ status: 'error', error: FALLBACK_CONTEXT_ERROR })
      return
    }

    switch (result.status) {
      case 'authenticated':
        setState({ status: 'authenticated', context: result.context })
        break
      case 'error':
        setState({ status: 'error', error: result.error })
        break
      case 'expired':
      case 'terminated':
        clearForEnded(result.status)
        break
    }
  }, [clearForEnded, session])

  useEffect(() => {
    void load()
    return () => {
      // Invalida la carga en curso al desmontar o cambiar de puerto.
      generationRef.current += 1
    }
  }, [load])

  useEffect(() => {
    return session.onEnded((event) => {
      clearForEnded(event.reason)
    })
  }, [clearForEnded, session])

  const retry = useCallback(() => {
    void load()
  }, [load])

  const recoverAccess = useCallback(() => session.recoverAccess(), [session])

  const registerStore = useCallback(
    (store: SessionStateCleanupStore) => registry.register(store),
    [registry],
  )

  return { state, retry, recoverAccess, registerStore }
}
