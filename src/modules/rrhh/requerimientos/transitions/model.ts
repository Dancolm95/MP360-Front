import type { AccionRequerimiento, EstadoRequerimiento } from '../contracts'
import { ORIGENES_ACCION } from '../model'
import type { SucesoTransicion } from './types'

/**
 * Destino fijo, el mismo estado de origen o uno derivado de la cobertura
 * confirmada. La reversión siempre devuelve a En reclutamiento.
 */
export type DestinoTransicion =
  | EstadoRequerimiento
  | 'mismo-estado'
  | 'segun-cobertura'

export interface DefinicionTransicion {
  readonly accion: AccionRequerimiento | null
  readonly origenes: readonly EstadoRequerimiento[]
  readonly destino: DestinoTransicion
}

/** Modelo explícito de las transiciones de la spec §6. */
export const TRANSICIONES: Readonly<
  Record<SucesoTransicion, DefinicionTransicion>
> = {
  editar: {
    accion: 'editar',
    origenes: ['pendiente-aprobacion'],
    destino: 'mismo-estado',
  },
  enviar: {
    accion: 'enviar',
    origenes: ['borrador'],
    destino: 'pendiente-aprobacion',
  },
  reenviar: {
    accion: 'enviar',
    origenes: ['observado'],
    destino: 'pendiente-aprobacion',
  },
  aprobar: {
    accion: 'aprobar',
    origenes: ORIGENES_ACCION.aprobar,
    destino: 'aprobado',
  },
  observar: {
    accion: 'observar',
    origenes: ORIGENES_ACCION.observar,
    destino: 'observado',
  },
  'fijar-plazo': {
    accion: 'fijar-plazo',
    origenes: ORIGENES_ACCION['fijar-plazo'],
    destino: 'mismo-estado',
  },
  'ajustar-plazo': {
    accion: 'ajustar-plazo',
    origenes: ORIGENES_ACCION['ajustar-plazo'],
    destino: 'mismo-estado',
  },
  'iniciar-apertura-proceso': {
    accion: 'abrir-proceso-seleccion',
    origenes: ['aprobado'],
    destino: 'mismo-estado',
  },
  /** La navegación a Selección no cambia estado: solo se decide su elegibilidad. */
  'asociar-candidato': {
    accion: 'asociar-candidato',
    origenes: ['en-reclutamiento'],
    destino: 'mismo-estado',
  },
  'confirmar-apertura-proceso': {
    accion: null,
    origenes: ['aprobado'],
    destino: 'en-reclutamiento',
  },
  'confirmar-primer-dia-real': {
    accion: null,
    origenes: ['en-reclutamiento'],
    destino: 'segun-cobertura',
  },
  'confirmar-reversion-cobertura': {
    accion: null,
    origenes: ['cubierto', 'en-reclutamiento'],
    destino: 'en-reclutamiento',
  },
  cancelar: {
    accion: 'cancelar',
    origenes: ORIGENES_ACCION.cancelar,
    destino: 'cancelado',
  },
}
