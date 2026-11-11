'use client'

import type { ReactNode } from 'react'
import { useFocusOnMount } from '../accessibility'
import type { SessionContext, SessionPort } from '../contracts'
import {
  useSessionState,
  type SessionState,
  type SessionStateApi,
  type UseSessionStateOptions,
} from './useSessionState'

/**
 * Frontera de estado de sesión del contenedor (CORE-01 §5; §7 criterios 5, 6 y 7).
 *
 * Solo entrega el contenido protegido en estado `authenticated`. Durante la
 * carga o el error no se hereda identidad, navegación ni datos previos; al
 * vencer o terminar la sesión se retira el contenido y se indica que la
 * recuperación del acceso corresponde al proveedor externo, sin login local.
 * Al cambiar `sessionKey` sin desmontar la frontera se inicia una autenticación
 * nueva: se descarta el estado anterior y se limpian todos los stores.
 */
export interface SessionStateBoundaryProps extends UseSessionStateOptions {
  readonly session: SessionPort
  /**
   * Contenido protegido. Si es función recibe el contexto ya autenticado, de
   * modo que nunca se pueda pintar con un contexto anterior o inexistente.
   */
  readonly children:
    | ReactNode
    | ((context: SessionContext, session: SessionStateApi) => ReactNode)
  readonly loadingMessage?: string
  readonly expiredMessage?: string
  readonly terminatedMessage?: string
  readonly signedOutProviderMessage?: string
  readonly signedOutLocalMessage?: string
  readonly retryLabel?: string
}

const DEFAULT_LOADING_MESSAGE = 'Cargando sesión y contexto…'
const DEFAULT_EXPIRED_MESSAGE =
  'La sesión ha vencido. Recupera el acceso con el proveedor de identidad externo.'
const DEFAULT_TERMINATED_MESSAGE =
  'La sesión se ha cerrado desde el proveedor externo. Recupera el acceso con el proveedor de identidad externo.'
const DEFAULT_SIGNED_OUT_PROVIDER_MESSAGE =
  'Has salido. El cierre de la sesión continúa en el proveedor de identidad externo.'
const DEFAULT_SIGNED_OUT_LOCAL_MESSAGE = 'Has salido. La sesión local se ha cerrado.'
const DEFAULT_RETRY_LABEL = 'Reintentar'

function renderLoading(message: string) {
  return (
    <SessionMessage className="erp-session-state--loading">{message}</SessionMessage>
  )
}

function SessionMessage({
  children,
  className,
  alert = false,
}: {
  readonly children: ReactNode
  readonly className: string
  readonly alert?: boolean
}) {
  const ref = useFocusOnMount<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={`erp-session-state ${className}`}
      role={alert ? 'alert' : 'status'}
      aria-live={alert ? 'assertive' : 'polite'}
      aria-atomic="true"
      tabIndex={-1}
    >
      {children}
    </div>
  )
}

function SessionErrorMessage({
  error,
  retry,
  retryLabel,
}: {
  readonly error: Extract<SessionState, { status: 'error' }>['error']
  readonly retry: () => void
  readonly retryLabel: string
}) {
  const ref = useFocusOnMount<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className="erp-session-state erp-session-state--error"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      tabIndex={-1}
    >
      <p>{error.message}</p>
      {error.retryable ? (
        <button type="button" onClick={retry}>
          {retryLabel}
        </button>
      ) : null}
    </div>
  )
}

export function SessionStateBoundary({
  session,
  children,
  stores,
  sessionKey,
  loadingMessage = DEFAULT_LOADING_MESSAGE,
  expiredMessage = DEFAULT_EXPIRED_MESSAGE,
  terminatedMessage = DEFAULT_TERMINATED_MESSAGE,
  signedOutProviderMessage = DEFAULT_SIGNED_OUT_PROVIDER_MESSAGE,
  signedOutLocalMessage = DEFAULT_SIGNED_OUT_LOCAL_MESSAGE,
  retryLabel = DEFAULT_RETRY_LABEL,
}: SessionStateBoundaryProps) {
  const {
    state,
    retry,
    recoverAccess,
    endSession,
    endSessionFromNavigation,
    registerStore,
  } =
    useSessionState(session, { stores, sessionKey })

  switch (state.status) {
    case 'loading':
      return renderLoading(loadingMessage)
    case 'error':
      return (
        <SessionErrorMessage
          error={state.error}
          retry={retry}
          retryLabel={retryLabel}
        />
      )
    case 'expired':
      return (
        <SessionMessage className="erp-session-state--expired" alert>
          {expiredMessage}
        </SessionMessage>
      )
    case 'terminated':
      return (
        <SessionMessage className="erp-session-state--terminated" alert>
          {terminatedMessage}
        </SessionMessage>
      )
    case 'signedOut':
      return (
        <SessionMessage className="erp-session-state--signed-out">
          {state.destination === 'provider'
            ? signedOutProviderMessage
            : signedOutLocalMessage}
        </SessionMessage>
      )
    case 'authenticated':
      return (
        <>
          {typeof children === 'function'
            ? children(state.context, {
                state,
                retry,
                recoverAccess,
                endSession,
                endSessionFromNavigation,
                registerStore,
              })
            : children}
        </>
      )
  }
}
