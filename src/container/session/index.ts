/**
 * Estado de sesión del contenedor (CORE-01 §5; §7 criterios 5, 6 y 7).
 *
 * `useSessionState` representa los estados de sesión desde
 * `SessionPort.getContext()`/`onEnded()` y expone `endSession()` para limpiar
 * estado y stores tras una salida voluntaria; no implementa login local.
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
