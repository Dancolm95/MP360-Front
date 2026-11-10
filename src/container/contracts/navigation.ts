import type { Opaque } from '../../shared'

/**
 * C-04 (plan §2.3) — Semántica de rutas lógicas, destinos directos/desconocidos,
 * retorno y aislamiento de persistencia intra-sesión.
 *
 * Un destino lógico es un identificador acordado entre contenedor y módulos
 * (p. ej. entrada a RR. HH. → bandeja; bandeja → nuevo/editar/detalle →
 * retorno; sección no implementada visible → «Próximamente» → retorno
 * autorizado). No es una URL, un endpoint ni un payload; la resolución técnica
 * la resuelve el adaptador.
 */
export type LogicalDestination = Opaque<string, 'LogicalDestination'>

/**
 * Resultado de resolver un destino lógico o directo.
 *
 * - `ok`: destino autorizado, resuelto a una vista lógica.
 * - `forbidden`: destino denegado por autorización, sin filtrar datos.
 * - `not-found`: destino desconocido; nunca se convierte en «Próximamente» ni
 *   en una vista ficticia.
 * - `session-ended`: pérdida de sesión durante la navegación; se limpia y se
 *   devuelve a un estado sin acceso. Distinto de «Próximamente».
 */
export type DestinationResolution =
  | { readonly status: 'ok'; readonly destination: LogicalDestination }
  | { readonly status: 'forbidden' }
  | { readonly status: 'not-found' }
  | { readonly status: 'session-ended' }

/**
 * Puerto de navegación lógica. Valida sesión y autorización antes de exponer
 * contenido; ante pérdida de sesión limpia y devuelve un estado sin acceso.
 */
export interface NavigationPort {
  resolve(destination: LogicalDestination): Promise<DestinationResolution>
}
