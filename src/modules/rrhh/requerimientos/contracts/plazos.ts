import type { FechaISO } from './identificadores'

/** Alerta, objetivo y cumplimiento son conceptos distintos. */
export type CumplimientoPlazo = 'pendiente' | 'en-plazo' | 'incumplido'

export type NivelAlerta = 'temprana' | 'media' | 'critica'

/** Porcentajes del plazo administrativo; el día umbral se redondea hacia arriba. */
export type PorcentajeUmbral = 50 | 75 | 90

/**
 * El umbral queda ligado a la clasificación para no admitir combinaciones
 * imposibles: días fijos en Operativo y porcentaje en Administrativo.
 */
export type UmbralAlerta =
  | {
      readonly tipo: 'dias-fijos'
      readonly clasificacion: 'operativo'
      readonly diaHabil: number
    }
  | {
      readonly tipo: 'porcentaje'
      readonly clasificacion: 'administrativo'
      readonly porcentaje: PorcentajeUmbral
    }

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

export interface AlertaPlazoOperativo extends AlertaPlazo {
  readonly umbral: Extract<UmbralAlerta, { readonly clasificacion: 'operativo' }>
}

export interface AlertaPlazoAdministrativo extends AlertaPlazo {
  readonly umbral: Extract<
    UmbralAlerta,
    { readonly clasificacion: 'administrativo' }
  >
}

export interface PlazoRequerimientoBase {
  /** Día 0 del cómputo; `null` antes de la aprobación. */
  readonly fechaAprobacion: FechaISO | null
  /**
   * `null` antes de aprobar: no se deriva una fecha de una aprobación
   * hipotética. Tras un ajuste se recalcula desde la aprobación original.
   */
  readonly fechaObjetivo: FechaISO | null
  readonly cumplimiento: CumplimientoPlazo
}

export interface PlazoOperativo extends PlazoRequerimientoBase {
  readonly clasificacion: 'operativo'
  readonly duracionDiasHabiles: 10
  readonly origen: 'operativo-fijo'
  readonly alerta: AlertaPlazoOperativo | null
}

export interface PlazoAdministrativoPendiente extends PlazoRequerimientoBase {
  readonly clasificacion: 'administrativo'
  readonly duracionDiasHabiles: null
  readonly origen: 'pendiente'
  readonly alerta: AlertaPlazoAdministrativo | null
}

export interface PlazoAdministrativoFijado extends PlazoRequerimientoBase {
  readonly clasificacion: 'administrativo'
  /** Entero 15–30; el backend revalida el rango. */
  readonly duracionDiasHabiles: number
  readonly origen: 'fijado-administrativo' | 'ajustado-administrativo'
  readonly alerta: AlertaPlazoAdministrativo | null
}

export type PlazoRequerimiento =
  | PlazoOperativo
  | PlazoAdministrativoPendiente
  | PlazoAdministrativoFijado
