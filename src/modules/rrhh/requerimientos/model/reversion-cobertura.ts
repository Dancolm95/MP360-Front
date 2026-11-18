import type {
  CoberturaRequerimiento,
  DetalleRequerimiento,
  EfectoCoberturaReversion,
  EstadoRequerimiento,
  EventoReversionCobertura,
} from '../contracts'

/**
 * Cubierto porque así lo fija §6; En reclutamiento porque una reversión con
 * pendientes previas permanece en ese estado y debe poder solicitarse desde él.
 */
export type EstadoSolicitudReversion = Extract<
  EstadoRequerimiento,
  'cubierto' | 'en-reclutamiento'
>

export const ESTADOS_SOLICITUD_REVERSION: readonly EstadoSolicitudReversion[] =
  ['cubierto', 'en-reclutamiento']

/**
 * Un evento ya aplicado no vuelve a contar: repetir el mismo identificador, o
 * una nueva emisión de la misma solicitud, no es una segunda reversión.
 */
export function reversionAplicada(
  detalle: Pick<DetalleRequerimiento, 'historial'>,
  evento: EventoReversionCobertura,
): boolean {
  return detalle.historial.some(
    (entrada) =>
      entrada.accion === 'reversion-cobertura' &&
      (entrada.id === evento.id || entrada.solicitudId === evento.solicitudId),
  )
}

/**
 * Las vacantes solicitadas son las registradas en el requerimiento y
 * `pendientes` se deriva de ellas; el evento no se copia como segunda fuente de
 * verdad. Los primeros días reales siguen siendo el registro de Alta.
 */
export function aplicarEfectoReversion(
  cobertura: CoberturaRequerimiento,
  efecto: EfectoCoberturaReversion,
): CoberturaRequerimiento {
  return {
    solicitadas: cobertura.solicitadas,
    cubiertas: efecto.cubiertas,
    pendientes: cobertura.solicitadas - efecto.cubiertas,
    primerosDiasReales: cobertura.primerosDiasReales,
  }
}
