import type { DiasHabilesAdministrativos } from '../contracts'

/** Rango único del plazo administrativo (spec §5.1, §5.2 y §10 criterio 6). */
export const DIAS_HABILES_ADMINISTRATIVOS = {
  minimo: 15,
  maximo: 30,
} as const

/**
 * La entrada puede llegar sin convertir desde un formulario o desde datos del
 * backend; solo el entero dentro del rango es un plazo administrativo.
 */
export function esDiasHabilesAdministrativos(
  valor: unknown,
): valor is DiasHabilesAdministrativos {
  return (
    typeof valor === 'number' &&
    Number.isInteger(valor) &&
    valor >= DIAS_HABILES_ADMINISTRATIVOS.minimo &&
    valor <= DIAS_HABILES_ADMINISTRATIVOS.maximo
  )
}
