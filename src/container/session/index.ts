/**
 * Estado de sesión del contenedor (CORE-01 §5; §7 criterios 5 y 6).
 *
 * `useSessionState` representa `loading`/`authenticated`/`error`/`expired`/
 * `terminated` a partir de `SessionPort.getContext()` y `onEnded()`, limpia el
 * estado y los stores intra-sesión al vencer o terminar, y no implementa login
 * local. `SessionStateBoundary` solo pinta contenido protegido en estado
 * autenticado y muestra el mensaje accesible de recuperación por proveedor.
 *
 * La composición en `src/app/page.tsx` con una sesión real corresponde a
 * T-CORE-07/T-CORE-09; aquí no se simula autorización ni una sesión ficticia.
 */
export {
  SessionStateBoundary,
  type SessionStateBoundaryProps,
} from './SessionStateBoundary'
export {
  useSessionState,
  type SessionState,
  type SessionStateApi,
  type UseSessionStateOptions,
} from './useSessionState'
export {
  createSessionStoreRegistry,
  type SessionStateCleanupStore,
  type SessionStoreRegistry,
} from './store-registry'
