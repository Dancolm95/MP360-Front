import type { SessionScopedStore } from '../../shared'
import { MOCK_KIND, type MockAdapter } from './mock'

/**
 * Almacén intra-sesión en memoria (C-04, plan §2.3).
 *
 * Implementa `SessionScopedStore<T>` sin persistencia real: no escribe en
 * `localStorage` ni en `sessionStorage`, de modo que no hay persistencia falsa
 * ni riesgo de guardar datos sensibles. Es útil para alimentar filtros y
 * contexto de bandeja en las vistas (T-CORE-04+).
 */
export interface InMemorySessionScopedStore<T>
  extends SessionScopedStore<T>,
    MockAdapter {}

export function createInMemoryStore<T>(): InMemorySessionScopedStore<T> {
  let value: T | undefined
  return {
    kind: MOCK_KIND,
    get: () => value,
    set: (next) => {
      value = next
    },
    clear: () => {
      value = undefined
    },
  }
}
