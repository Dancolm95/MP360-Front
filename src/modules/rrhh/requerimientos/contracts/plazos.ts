import type { Clasificacion } from './base'
import type { FechaISO } from './identificadores'

/**
 * Origen del plazo vigente. `pendiente` cubre un Administrativo al que RR. HH.
 * todavía no ha fijado el plazo; un Operativo siempre es `operativo-fijo`.
 */
export type OrigenPlazo =
  | 'operativo-fijo'
  | 'fijado-administrativo'
  | 'ajustado-administrativo'
  | 'pendiente'

/** Alerta, objetivo y cumplimiento son conceptos distintos. */
export type CumplimientoPlazo = 'pendiente' | 'en-plazo' | 'incumplido'

export type NivelAlerta = 'temprana' | 'media' | 'critica'

/** Porcentajes del plazo administrativo; el día umbral se redondea hacia arriba. */
export type PorcentajeUmbral = 50 | 75 | 90

export type UmbralAlerta =
  | { readonly tipo: 'dias-fijos'; readonly diaHabil: number }
  | { readonly tipo: 'porcentaje'; readonly porcentaje: PorcentajeUmbral }

/**
 * Alerta vigente. Alcanzar un umbral no equivale a vencimiento ni cambia el
 * estado del requerimiento por sí solo.
 */
export interface AlertaPlazo {
  readonly nivel: NivelAlerta
  readonly umbral: UmbralAlerta
  readonly diaHabil: number
  readonly fecha: FechaISO
}

export interface PlazoRequerimiento {
  readonly clasificacion: Clasificacion
  /** Operativo: 10. Administrativo: entero 15–30 o `null` mientras no se fije. */
  readonly duracionDiasHabiles: number | null
  readonly origen: OrigenPlazo
  /** Día 0 del cómputo; `null` antes de la aprobación. */
  readonly fechaAprobacion: FechaISO | null
  /**
   * `null` antes de aprobar: no se deriva una fecha de una aprobación
   * hipotética. Tras un ajuste se recalcula desde la aprobación original.
   */
  readonly fechaObjetivo: FechaISO | null
  readonly alerta: AlertaPlazo | null
  readonly cumplimiento: CumplimientoPlazo
}
