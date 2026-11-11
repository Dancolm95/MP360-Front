'use client'

import type { ReactNode } from 'react'
import type {
  ModuleId,
  SectionCatalog,
  SessionIdentity,
  SignOutDestination,
  SignOutPort,
} from '../contracts'
import { getModuleLabel } from '../labels'
import { getSelectableModules } from '../selectors'
import { AppHeader } from './AppHeader'
import { ModuleSelector } from './ModuleSelector'
import { SignOutAction } from './SignOutAction'

/**
 * Shell del contenedor ERP (CORE-01 §4, criterio 1; C-02 para «Salir»).
 *
 * Compone la cabecera con marca e identidad recibida, el selector horizontal de
 * módulos y la zona central. La indicación de módulo/sección activos se emite
 * como texto, además de la marca semántica del selector. No renderiza panel
 * contextual derecho ni contenido ficticio.
 *
 * La acción «Salir» solo aparece cuando el consumidor aporta `signOut`; al
 * terminar con éxito, ese mismo consumidor debe limpiar la sesión con
 * `endSession()` de `useSessionState` desde `onSignedOut`.
 */
export interface ContainerShellProps {
  readonly catalog: SectionCatalog
  readonly identity?: SessionIdentity
  readonly activeModuleId?: ModuleId
  /** Etiqueta visible de la sección activa; la resuelve el módulo. */
  readonly activeSectionLabel?: string
  readonly onSelectModule?: (moduleId: ModuleId) => void
  /** Puerto de salida; sin él no se renderiza la acción «Salir». */
  readonly signOut?: SignOutPort
  /** Notifica el destino confirmado para limpiar la sesión local. */
  readonly onSignedOut?: (destination: SignOutDestination) => void
  readonly children?: ReactNode
}

export function ContainerShell({
  catalog,
  identity,
  activeModuleId,
  activeSectionLabel,
  onSelectModule,
  signOut,
  onSignedOut,
  children,
}: ContainerShellProps) {
  const activeModule = activeModuleId
    ? getSelectableModules(catalog).find((module) => module.id === activeModuleId)
    : undefined

  return (
    <div className="erp-shell">
      <AppHeader
        identity={identity}
        actions={
          signOut ? (
            <SignOutAction signOut={signOut} onSignedOut={onSignedOut} />
          ) : undefined
        }
      />
      <ModuleSelector
        catalog={catalog}
        activeModuleId={activeModule?.id}
        onSelectModule={onSelectModule}
      />
      {activeModule ? (
        <p className="erp-shell__context">
          Módulo activo: {getModuleLabel(activeModule.id)}
          {activeSectionLabel ? ` · Sección: ${activeSectionLabel}` : ''}
        </p>
      ) : null}
      <main className="erp-shell__content">{children}</main>
    </div>
  )
}
