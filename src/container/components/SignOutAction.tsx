'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ContractError } from '../../shared'
import type {
  SignOutDestination,
  SignOutPort,
  SignOutResult,
} from '../contracts'

/**
 * Acción «Salir» del contenedor (C-02, plan §2.4; CORE-01 §5 y §7 criterio 7).
 *
 * Inicia el cierre de la sesión real en el proveedor externo a través de
 * `SignOutPort`. Al terminar con éxito notifica el destino acordado
 * (`provider` | `local`) y muestra la confirmación; la limpieza de estado y de
 * los stores intra-sesión la ejecuta el consumidor mediante `endSession()` de
 * `useSessionState`. Ante un error del proveedor conserva la sesión y explica
 * cómo continuar, ofreciendo reintento solo si el contrato lo permite
 * (`error.retryable`). No implementa login local ni fija URL, endpoint ni
 * payload.
 */

export interface SignOutActionProps {
  readonly signOut: SignOutPort
  /** Notifica el destino confirmado para que el consumidor limpie la sesión. */
  readonly onSignedOut?: (destination: SignOutDestination) => void
  readonly label?: string
  readonly retryLabel?: string
  readonly pendingMessage?: string
}

type SignOutActionState =
  | { readonly status: 'idle' }
  | { readonly status: 'pending' }
  | { readonly status: 'success'; readonly destination: SignOutDestination }
  | { readonly status: 'error'; readonly error: ContractError }

const DEFAULT_LABEL = 'Salir'
const DEFAULT_RETRY_LABEL = 'Reintentar'
const DEFAULT_PENDING_MESSAGE = 'Cerrando la sesión…'
const PROVIDER_DESTINATION_MESSAGE =
  'Has salido. El cierre de la sesión continúa en el proveedor de identidad externo.'
const LOCAL_DESTINATION_MESSAGE = 'Has salido. La sesión local se ha cerrado.'

/**
 * Fallback si el puerto rechaza la promesa o devuelve un resultado que no
 * respeta el contrato. El contrato no declara esta situación como reintentable,
 * así que no se ofrece reintento.
 */
const FALLBACK_SIGN_OUT_ERROR: ContractError = {
  message:
    'No se pudo cerrar la sesión en el proveedor. La sesión actual sigue activa; inténtalo de nuevo más tarde.',
  retryable: false,
}

function isContractError(value: unknown): value is ContractError {
  if (typeof value !== 'object' || value === null) return false
  const error = value as { readonly message?: unknown; readonly retryable?: unknown }
  return typeof error.message === 'string' && typeof error.retryable === 'boolean'
}

function isSignOutResult(value: unknown): value is SignOutResult {
  if (typeof value !== 'object' || value === null) return false
  const result = value as {
    readonly status?: unknown
    readonly destination?: unknown
    readonly error?: unknown
  }
  switch (result.status) {
    case 'success':
      return result.destination === 'provider' || result.destination === 'local'
    case 'error':
      return isContractError(result.error)
    default:
      return false
  }
}

export function SignOutAction({
  signOut,
  onSignedOut,
  label = DEFAULT_LABEL,
  retryLabel = DEFAULT_RETRY_LABEL,
  pendingMessage = DEFAULT_PENDING_MESSAGE,
}: SignOutActionProps) {
  const [state, setState] = useState<SignOutActionState>({ status: 'idle' })
  // Evita dobles llamadas aunque un evento llegue antes de que se pinte el
  // botón deshabilitado.
  const inFlightRef = useRef(false)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const submit = useCallback(async () => {
    if (inFlightRef.current) return
    inFlightRef.current = true
    setState({ status: 'pending' })

    let result: unknown
    try {
      result = await signOut.signOut()
    } catch {
      result = { status: 'error', error: FALLBACK_SIGN_OUT_ERROR }
    } finally {
      inFlightRef.current = false
    }

    if (!mountedRef.current) return

    if (!isSignOutResult(result)) {
      setState({ status: 'error', error: FALLBACK_SIGN_OUT_ERROR })
      return
    }

    if (result.status === 'success') {
      setState({ status: 'success', destination: result.destination })
      onSignedOut?.(result.destination)
      return
    }

    // Error del proveedor: no se limpia nada; la sesión autenticada se conserva.
    setState({ status: 'error', error: result.error })
  }, [onSignedOut, signOut])

  const pending = state.status === 'pending'

  return (
    <div className="erp-sign-out">
      {state.status === 'idle' || pending ? (
        <button
          type="button"
          className="erp-sign-out__button"
          onClick={() => void submit()}
          disabled={pending}
          aria-busy={pending || undefined}
        >
          {label}
        </button>
      ) : null}

      {pending ? (
        <p className="erp-sign-out__pending" role="status">
          {pendingMessage}
        </p>
      ) : null}

      {state.status === 'success' ? (
        <p className="erp-sign-out__success" role="status">
          {state.destination === 'provider'
            ? PROVIDER_DESTINATION_MESSAGE
            : LOCAL_DESTINATION_MESSAGE}
        </p>
      ) : null}

      {state.status === 'error' ? (
        <div className="erp-sign-out__error" role="alert">
          <p>{state.error.message}</p>
          {state.error.retryable ? (
            <button
              type="button"
              className="erp-sign-out__retry"
              onClick={() => void submit()}
            >
              {retryLabel}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
