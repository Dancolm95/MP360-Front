import type { Opaque } from './opaque'

/**
 * Capacidad efectiva del usuario, entregada por el backend de autorización
 * (C-03, plan §2.2).
 *
 * Es una cadena opaca con prefijo (p. ej. `rrhh:requerimientos:read`); nunca es
 * un nombre de rol ni una etiqueta visual del PDF. El frontend la trata como
 * opaca: no la construye, no la interpreta y no decide permisos a partir de su
 * forma o de su nombre.
 */
export type Capability = Opaque<string, 'Capability'>
