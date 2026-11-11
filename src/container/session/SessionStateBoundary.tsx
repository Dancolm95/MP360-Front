'use client'

import type { ReactNode } from 'react'
import type { SessionContext, SessionPort } from '../contracts'
import {
  useSessionState,
  type SessionState,
  type UseSessionStateOptions,
} from './useSessionState'

/**
 * Frontera de estado de sesión del contenedor (CORE-01 §5; §7 criterios 5 y 6).
 *
 * Solo entrega el contenido protegido en estado `authenticated`. Durante la
 * carga o el error no se hereda identidad, navegación ni datos previos; al
 * vencer o terminar la sesión se retira el contenido y se indica que la
 * recuperación del acceso corresponde al proveedor externo, sin login local.
 */
export interface SessionStateBoundaryProps extends UseSessionStateOptions {
  readonly session: SessionPort
  /**
   * Contenido protegido. Si es función recibe el contexto ya autenticado, de
   * modo que nunca se pueda pintar con un contexto anterior o inexistente.
   */
  readonly children: ReactNode | ((context: SessionContext) => ReactNode)
  readonly loadingMessage?: string
  readonly expiredMessage?: string
  readonly terminatedMessage?: string
  readonly retryLabel?: string
}

const DEFAULT_LOADING_MESSAGE = 'Cargando sesión y contexto…'
const DEFAULT_EXPIRED_MESSAGE =
  'La sesión ha vencido. Recupera el acceso con el proveedor de identidad externo.'
const DEFAULT_TERMINATED_MESSAGE =
  'La sesión se ha cerrado desde el proveedor externo. Recupera el acceso con el proveedor de identidad externo.'
const DEFAULT_RETRY_LABEL = 'Reintentar'

function renderLoading(message: string) {
  return (
    <p className="erp-session-state erp-session-state--loading" role="status">
      {message}
    </p>
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
  return (
    <div className="erp-session-state erp-session-state--error" role="alert">
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
  loadingMessage = DEFAULT_LOADING_MESSAGE,
  expiredMessage = DEFAULT_EXPIRED_MESSAGE,
  terminatedMessage = DEFAULT_TERMINATED_MESSAGE,
  retryLabel = DEFAULT_RETRY_LABEL,
}: SessionStateBoundaryProps) {
  const { state, retry } = useSessionState(session, { stores })

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
        <p className="erp-session-state erp-session-state--expired" role="alert">
          {expiredMessage}
        </p>
      )
    case 'terminated':
      return (
        <p className="erp-session-state erp-session-state--terminated" role="alert">
          {terminatedMessage}
        </p>
      )
    case 'authenticated':
      return (
        <>
          {typeof children === 'function' ? children(state.context) : children}
        </>
      )
  }
}
