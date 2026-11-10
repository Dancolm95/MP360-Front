/**
 * Marca explícita de mock/fixture y utilidad de promesa diferida.
 *
 * Todo adaptador de contrato de este corte (T-CORE-03) es un mock: respeta el
 * puerto que implementa, pero no realiza operaciones reales (no hay
 * autorización real, no hay persistencia real y no se escribe en `localStorage`
 * ni en `sessionStorage`). La marca `kind: 'mock'` permite distinguirlo de una
 * implementación real en runtime y en tipos.
 */

/** Valor literal que identifica a un adaptador como mock/fixture. */
export const MOCK_KIND = 'mock' as const

/**
 * Contrato de marcado para los adaptadores de este corte. Cualquier
 * implementación real de los puertos (fuera de T-CORE-03) no lleva esta marca.
 */
export interface MockAdapter {
  /** Siempre `'mock'` en los fixtures; ausente en operaciones reales. */
  readonly kind: typeof MOCK_KIND
}

/** Predicado de tipo para distinguir un mock de una operación real. */
export function isMock(value: unknown): value is MockAdapter {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as { readonly kind?: unknown }).kind === MOCK_KIND
  )
}

/**
 * Promesa diferida: permite controlar cuándo se resuelve o rechaza una promesa
 * pendiente. Útil para representar el estado `loading` de sesión/catálogo sin
 * depender del tiempo.
 */
export interface Deferred<T> {
  readonly promise: Promise<T>
  resolve(value: T): void
  reject(reason?: unknown): void
}

export function createDeferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}
