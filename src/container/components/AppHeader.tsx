import type { SessionIdentity } from '../contracts'

/**
 * Cabecera del contenedor (CORE-01 §4.1, criterio 1).
 *
 * Muestra siempre la marca ERP y la identidad/contexto autorizados **solo si se
 * reciben y pueden mostrarse**. Si no hay identidad (o su nombre está vacío) no
 * se renderiza ningún sustituto: no se rellena con nombres de ejemplo ni con
 * datos del PDF.
 */
export interface AppHeaderProps {
  readonly identity?: SessionIdentity
}

export function AppHeader({ identity }: AppHeaderProps) {
  const displayName = identity?.displayName?.trim()

  return (
    <header className="erp-header">
      <p className="erp-header__brand">ERP MP 360</p>
      {displayName ? (
        <p className="erp-header__identity">
          <span className="erp-header__identity-label">Sesión:</span>{' '}
          <span className="erp-header__identity-name">{displayName}</span>
        </p>
      ) : null}
    </header>
  )
}
