'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ContractError } from '../../shared'
import type {
  SignOutDestination,
  SignOutPort,
  SignOutResult,
} from '../contracts'

/**
 * Acción «Salir» (C-02, plan §2.4). No limpia el estado local: el consumidor lo
 * hace con `endSession()` desde `onSignedOut`.
 */

export interface SignOutActionProps {
  readonly signOut: SignOutPort
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

/** Fallo de transporte o resultado inválido: el contrato no lo declara reintentable. */
const FALLBACK_SIGN_OUT_ERROR: ContractError = {
  message:
    'No se pudo confirmar el cierre de la sesión con el proveedor. Recupera el acceso con el proveedor externo si necesitas comprobar su estado.',
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
    }

    if (!mountedRef.current) return

    if (!isSignOutResult(result)) {
      inFlightRef.current = false
      setState({ status: 'error', error: FALLBACK_SIGN_OUT_ERROR })
      return
    }

    if (result.status === 'success') {
      setState({ status: 'success', destination: result.destination })
      onSignedOut?.(result.destination)
      return
    }

    // Error del proveedor: no se limpia nada; la sesión autenticada se conserva.
    inFlightRef.current = false
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
        <p className="erp-sign-out__pending" role="status" aria-live="polite">
          {pendingMessage}
        </p>
      ) : null}

      {state.status === 'success' ? (
        <p className="erp-sign-out__success" role="status" aria-live="polite">
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
