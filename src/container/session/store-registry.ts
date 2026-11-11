/**
 * Registro de limpieza de persistencia intra-sesión (C-04, plan §2.3).
 *
 * Los stores de filtros y contexto de bandeja (`SessionScopedStore<T>`) viven
 * solo durante la sesión autenticada. El contenedor los registra aquí para que,
 * al vencer o terminar la sesión, se limpien de inmediato sin conocer sus tipos
 * concretos: basta con que expongan `clear()`.
 *
 * No escribe en `localStorage` ni en `sessionStorage`; solo coordina la limpieza
 * de los stores que cada vista aporte cuando existan (hoy no hay vistas RH).
 */

/** Parte mínima de `SessionScopedStore<T>` necesaria para limpiar al terminar. */
export interface SessionStateCleanupStore {
  clear(): void
}

export interface SessionStoreRegistry {
  /**
   * Registra un store para limpieza al finalizar la sesión. Devuelve la función
   * para retirarlo (p. ej. al desmontar la vista que lo creó).
   */
  register(store: SessionStateCleanupStore): () => void
  /** Limpia todos los stores registrados; se invoca al vencer o terminar. */
  clearAll(): void
  /** Número de stores registrados (solo para diagnóstico y pruebas). */
  size(): number
}

export function createSessionStoreRegistry(): SessionStoreRegistry {
  const stores = new Set<SessionStateCleanupStore>()

  return {
    register(store) {
      stores.add(store)
      return () => {
        stores.delete(store)
      }
    },
    clearAll() {
      for (const store of stores) {
        store.clear()
      }
    },
    size: () => stores.size,
  }
}
