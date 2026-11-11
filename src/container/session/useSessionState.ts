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
 * Al iniciar una autenticación nueva (cambio de `sessionKey`, o de puerto de
 * sesión si no se aporta) invalida la carga anterior y limpia también todos los
 * stores, de modo que ningún usuario hereda filtros ni contexto de bandeja.
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
   * Clave estable de la autenticación (por ejemplo, el identificador de sesión
   * que entrega el proveedor). Cambiarla inicia una autenticación nueva:
   * invalida la carga en curso, descarta identidad/contexto/capacidades y limpia
   * todos los stores registrados antes de volver a pedir `getContext()`. Un
   * re-render con la misma clave conserva los filtros de esa misma sesión.
   *
   * Si se omite, la identidad del objeto `session` hace de clave: un puerto
   * distinto equivale a una autenticación nueva, como hasta ahora.
   */
  readonly sessionKey?: string | number
  /**
   * Stores intra-sesión (filtros, contexto de bandeja) que deben limpiarse al
   * vencer, terminar o cambiar de autenticación. Hoy no existen vistas RH; el
   * registro queda disponible para cuando aporten los suyos.
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

/**
 * Clave que determina una autenticación: la explícita o, en su defecto, el
 * propio puerto de sesión.
 */
type SessionBoundaryKey = string | number | SessionPort

/**
 * Fallback cuando el puerto rechaza la promesa o devuelve un resultado que no
 * respeta el contrato. El contrato no declara esta situación como reintentable,
 * así que no se ofrece reintento; se remite a la recuperación externa.
 */
const FALLBACK_CONTEXT_ERROR: ContractError = {
  message:
    'No se pudo cargar la sesión. Recupera el acceso con el proveedor de identidad externo.',
  retryable: false,
}

function isContractError(value: unknown): value is ContractError {
  if (typeof value !== 'object' || value === null) return false
  const error = value as { readonly message?: unknown; readonly retryable?: unknown }
  return typeof error.message === 'string' && typeof error.retryable === 'boolean'
}

function isSessionContext(value: unknown): value is SessionContext {
  if (typeof value !== 'object' || value === null) return false
  const context = value as { readonly capabilities?: unknown; readonly identity?: unknown }
  if (!Array.isArray(context.capabilities)) return false
  if (context.identity === undefined) return true
  if (typeof context.identity !== 'object' || context.identity === null) return false
  const displayName = (context.identity as { readonly displayName?: unknown }).displayName
  return displayName === undefined || typeof displayName === 'string'
}

function isContextResult(value: unknown): value is SessionContextResult {
  if (typeof value !== 'object' || value === null) return false
  const result = value as {
    readonly status?: unknown
    readonly context?: unknown
    readonly error?: unknown
  }
  switch (result.status) {
    case 'authenticated':
      return isSessionContext(result.context)
    case 'error':
      return isContractError(result.error)
    case 'expired':
    case 'terminated':
      return true
    default:
      return false
  }
}

export function useSessionState(
  session: SessionPort,
  options: UseSessionStateOptions = {},
): SessionStateApi {
  const [state, setState] = useState<SessionState>({ status: 'loading' })
  const [registry] = useState(createSessionStoreRegistry)
  const generationRef = useRef(0)
  const sessionKey: SessionBoundaryKey = options.sessionKey ?? session
  const activeKeyRef = useRef<SessionBoundaryKey>(sessionKey)
  const registeredKeyRef = useRef<SessionBoundaryKey>(sessionKey)
  const unregisterStoresRef = useRef<readonly (() => void)[]>([])
  // Última versión del puerto: reintentos y recargas usan la sesión vigente
  // aunque cambie la identidad del objeto sin cambiar la clave de autenticación.
  // Se sincroniza en un efecto declarado antes de la carga y de la suscripción.
  const sessionRef = useRef(session)
  useEffect(() => {
    sessionRef.current = session
  }, [session])

  // Nueva autenticación: invalida la generación anterior y descarta el estado
  // previo durante el mismo render, antes de que llegue a pintarse como vigente.
  // El bloque es idempotente: solo actúa cuando la clave cambia de verdad, así
  // que un re-render con la misma clave no borra nada.
  if (!Object.is(activeKeyRef.current, sessionKey)) {
    activeKeyRef.current = sessionKey
    generationRef.current += 1
    if (state.status !== 'loading') {
      setState({ status: 'loading' })
    }
  }

  // Registro de stores intra-sesión. Al cambiar la clave de autenticación se
  // limpian TODOS los stores de la autenticación anterior (`clearAll()`, no solo
  // se desregistran) y después se registran los de la nueva. Con la misma clave,
  // un re-render o un cambio de la lista de stores no borra filtros vigentes.
  useEffect(() => {
    const keyChanged = !Object.is(registeredKeyRef.current, sessionKey)
    if (keyChanged) {
      registeredKeyRef.current = sessionKey
      registry.clearAll()
      // Los stores antiguos siguen registrados hasta este punto para poder
      // limpiarlos; ahora se retiran y se registran los de la sesión nueva.
      for (const unregister of unregisterStoresRef.current) unregister()
      unregisterStoresRef.current = []
    }

    const unregisters = (options.stores ?? []).map((store) => registry.register(store))
    unregisterStoresRef.current = unregisters

    return () => {
      // En un cambio de clave no se desregistra aquí: el siguiente efecto debe
      // poder limpiar los stores antiguos antes de retirarlos. Al desmontar o al
      // cambiar solo la lista de stores, sí se desregistra.
      if (Object.is(activeKeyRef.current, sessionKey)) {
        for (const unregister of unregisters) unregister()
      }
    }
  }, [sessionKey, options.stores, registry])

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
      result = await sessionRef.current.getContext()
    } catch {
      result = { status: 'error', error: FALLBACK_CONTEXT_ERROR }
    }

    // Una respuesta tardía de una autenticación anterior no repuebla el estado.
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
    // `sessionKey` determina cuándo se recarga: una autenticación nueva vuelve a
    // pedir el contexto; un puerto que cambia con la misma clave, no.
  }, [clearForEnded, sessionKey])

  useEffect(() => {
    void load()
    return () => {
      // Invalida la carga en curso al desmontar o cambiar de autenticación.
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

  const recoverAccess = useCallback(() => sessionRef.current.recoverAccess(), [])

  const registerStore = useCallback(
    (store: SessionStateCleanupStore) => registry.register(store),
    [registry],
  )

  return { state, retry, recoverAccess, registerStore }
}
