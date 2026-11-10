/**
 * Persistencia intra-sesión (C-04, plan §2.3).
 *
 * Guarda solo datos no sensibles y vive únicamente durante la sesión
 * autenticada; al terminar (vencimiento, terminación externa o salida
 * voluntaria) se borra. Nunca usa `localStorage` para datos sensibles.
 *
 * El transporte concreto (p. ej. `sessionStorage`) lo resuelve el adaptador;
 * este puerto solo fija la forma de leer, escribir y limpiar. La instancia
 * queda ligada a una sesión; su ciclo de vida lo gestiona el contenedor.
 */
export interface SessionScopedStore<T> {
  get(): T | undefined
  set(value: T): void
  clear(): void
}
