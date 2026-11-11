'use client'

import { useCallback, useEffect, useState, type ReactNode } from 'react'
import {
  SessionStateBoundary,
  useFocusOnMount,
  type CatalogPort,
  type CatalogResult,
} from '../container'
import { createNotImplementedVisibleFixture } from '../container/fixtures'
import { RrhhContainer } from '../modules/rrhh'

const MOCK_FIXTURE = createNotImplementedVisibleFixture()
const MOCK_SESSION_KEY = 'core-01-t07-contract-fixture'
const MOCK_RH_STORES = [MOCK_FIXTURE.store] as const

function CatalogBoundary({
  catalog,
  children,
}: {
  readonly catalog: CatalogPort
  readonly children: (result: Extract<CatalogResult, { status: 'ready' }>) => ReactNode
}) {
  const [result, setResult] = useState<CatalogResult>()
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    setResult(undefined)
    void catalog
      .getCatalog()
      .then((next) => {
        if (active) setResult(next)
      })
      .catch(() => {
        if (active) {
          setResult({
            status: 'error',
            error: {
              message: 'No se pudo cargar el catálogo autorizado.',
              retryable: false,
            },
          })
        }
      })
    return () => {
      active = false
    }
  }, [attempt, catalog])

  const retry = useCallback(() => setAttempt((current) => current + 1), [])

  if (!result) return <CatalogStatus>Cargando catálogo autorizado…</CatalogStatus>
  if (result.status === 'error') {
    return (
      <CatalogError
        message={result.error.message}
        retryable={result.error.retryable}
        retry={retry}
      />
    )
  }
  return children(result)
}

function CatalogStatus({ children }: { readonly children: ReactNode }) {
  const ref = useFocusOnMount<HTMLParagraphElement>()
  return (
    <p
      ref={ref}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      tabIndex={-1}
    >
      {children}
    </p>
  )
}

function CatalogError({
  message,
  retryable,
  retry,
}: {
  readonly message: string
  readonly retryable: boolean
  readonly retry: () => void
}) {
  const ref = useFocusOnMount<HTMLDivElement>()
  return (
    <div
      ref={ref}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      tabIndex={-1}
    >
      <p>{message}</p>
      {retryable ? (
        <button type="button" onClick={retry}>
          Reintentar
        </button>
      ) : null}
    </div>
  )
}

export default function Page() {
  return (
    <>
      <p role="note">
        Entorno de contrato mock: no representa una sesión ni autorización reales.
      </p>
      <SessionStateBoundary
        session={MOCK_FIXTURE.session}
        sessionKey={MOCK_SESSION_KEY}
        stores={MOCK_RH_STORES}
      >
        {(context, session) => (
          <CatalogBoundary catalog={MOCK_FIXTURE.catalog}>
            {({ catalog }) => (
              <RrhhContainer
                catalog={catalog}
                capabilities={context.capabilities}
                identity={context.identity}
                navigation={MOCK_FIXTURE.navigation}
                signOut={MOCK_FIXTURE.signOut}
                onSignedOut={session.endSession}
                onSessionEnded={session.endSessionFromNavigation}
              />
            )}
          </CatalogBoundary>
        )}
      </SessionStateBoundary>
    </>
  )
}
