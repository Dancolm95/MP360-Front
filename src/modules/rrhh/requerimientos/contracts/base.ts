/** Clasificación derivada de Puesto y Área/Subárea; nunca es un valor libre. */
export type Clasificacion = 'operativo' | 'administrativo'

/** Catálogo canónico de motivo de requerimiento (spec §4). */
export type MotivoRequerimiento =
  | 'reemplazo'
  | 'nueva-vacante'
  | 'practicante'
  | 'otros'

/**
 * Importe mensual en soles. La validación de negocio vive fuera del contrato:
 * PEN, no negativo, máximo dos decimales y `0.00` solo para Practicante.
 */
export interface Remuneracion {
  readonly monto: number
  readonly moneda: 'PEN'
}
