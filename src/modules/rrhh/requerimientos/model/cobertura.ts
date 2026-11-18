import type {
  CoberturaRequerimiento,
  DetalleRequerimiento,
  EventoPrimerDiaReal,
  PrimerDiaRealAlta,
} from '../contracts'

/**
 * El día real es `evento.fecha`; `fechaHora` solo fecha el evento y nunca se
 * interpreta como fecha del alta.
 */
export function primerDiaRealDeEvento(
  evento: EventoPrimerDiaReal,
): PrimerDiaRealAlta {
  return { fecha: evento.fecha }
}

/** Dato de Alta: Requerimientos lo expone sin editarlo ni completarlo. */
export function leerPrimerosDiasReales(
  detalle: DetalleRequerimiento,
): readonly PrimerDiaRealAlta[] {
  return detalle.cobertura?.primerosDiasReales ?? []
}

/**
 * Cada confirmación cubre una vacante. `pendientes` se deriva del total y de
 * las cubiertas, por lo que no se conserva como segunda fuente de verdad.
 */
export function incrementarCobertura(
  cobertura: CoberturaRequerimiento,
  primerDiaReal: PrimerDiaRealAlta,
): CoberturaRequerimiento {
  const cubiertas = cobertura.cubiertas + 1
  return {
    solicitadas: cobertura.solicitadas,
    cubiertas,
    pendientes: cobertura.solicitadas - cubiertas,
    primerosDiasReales: [...cobertura.primerosDiasReales, primerDiaReal],
  }
}
