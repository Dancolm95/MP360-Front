import type { SessionScopedStore } from '../../../../shared'

/**
 * Subconjunto de `Storage` que necesita el adaptador. Permite inyectar el
 * almacén en pruebas y aislar los entornos donde `sessionStorage` no existe.
 */
export interface AlmacenSesion {
  getItem(clave: string): string | null
  setItem(clave: string, valor: string): void
  removeItem(clave: string): void
}

function resolverAlmacen(almacen?: AlmacenSesion | null): AlmacenSesion | null {
  if (almacen !== undefined) return almacen
  try {
    return typeof sessionStorage === 'undefined' ? null : sessionStorage
  } catch {
    // Algunos navegadores lanzan al acceder a `sessionStorage` (modo restringido).
    return null
  }
}

/**
 * Adaptador real de `SessionScopedStore<T>` sobre `sessionStorage`, sin
 * `localStorage`. Solo debe recibir datos no sensibles. Si el almacén falta,
 * está bloqueado o no queda cuota, se comporta como un almacén vacío: la vista
 * sigue funcionando aunque el contexto no sobreviva a la recarga.
 */
export function crearStoreSessionStorage<T>(
  clave: string,
  almacen?: AlmacenSesion | null,
): SessionScopedStore<T> {
  return {
    get() {
      const destino = resolverAlmacen(almacen)
      if (!destino) return undefined

      let crudo: string | null
      try {
        crudo = destino.getItem(clave)
      } catch {
        return undefined
      }
      if (crudo === null) return undefined

      try {
        return JSON.parse(crudo) as T
      } catch {
        // Un valor ilegible no debe quedar bloqueando la clave para siempre.
        try {
          destino.removeItem(clave)
        } catch {
          // Sin acceso de escritura tampoco se puede limpiar; se ignora.
        }
        return undefined
      }
    },

    set(valor) {
      const destino = resolverAlmacen(almacen)
      if (!destino) return
      try {
        destino.setItem(clave, JSON.stringify(valor))
      } catch {
        // Cuota agotada o almacén bloqueado: se pierde la persistencia, no la vista.
      }
    },

    clear() {
      const destino = resolverAlmacen(almacen)
      if (!destino) return
      try {
        destino.removeItem(clave)
      } catch {
        // Ídem: no hay nada más que limpiar.
      }
    },
  }
}
