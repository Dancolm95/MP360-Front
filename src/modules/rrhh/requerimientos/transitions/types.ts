import type {
  CausalCancelacion,
  CoberturaRequerimiento,
  EstadoRequerimiento,
  EventoAperturaProceso,
  EventoPrimerDiaReal,
  EventoReversionCobertura,
} from '../contracts'

export const SUCESOS_TRANSICION = [
  'editar',
  'enviar',
  'reenviar',
  'aprobar',
  'observar',
  'fijar-plazo',
  'ajustar-plazo',
  'iniciar-apertura-proceso',
  'asociar-candidato',
  'confirmar-apertura-proceso',
  'confirmar-primer-dia-real',
  'confirmar-reversion-cobertura',
  'cancelar',
] as const

export type SucesoTransicion = (typeof SUCESOS_TRANSICION)[number]

export type SolicitudTransicion =
  | {
      readonly suceso: Extract<
        SucesoTransicion,
        | 'editar'
        | 'enviar'
        | 'reenviar'
        | 'aprobar'
        | 'observar'
        | 'fijar-plazo'
        | 'ajustar-plazo'
        | 'iniciar-apertura-proceso'
        | 'asociar-candidato'
      >
    }
  | {
      readonly suceso: 'confirmar-apertura-proceso'
      /** `null` representa una confirmación de Selección que aún no existe. */
      readonly evento: EventoAperturaProceso | null
    }
  | {
      readonly suceso: 'confirmar-primer-dia-real'
      readonly evento: EventoPrimerDiaReal | null
      /** Cobertura ya confirmada por Alta; la máquina no la recalcula. */
      readonly cobertura: CoberturaRequerimiento | null
    }
  | {
      readonly suceso: 'confirmar-reversion-cobertura'
      readonly evento: EventoReversionCobertura | null
    }
  | {
      readonly suceso: 'cancelar'
      readonly confirmado: boolean
      readonly causal: CausalCancelacion | null
    }

export type MotivoRechazoTransicion =
  | 'sin-autorizacion'
  | 'suceso-no-aplica-al-estado'
  | 'clasificacion-no-aplicable'
  | 'plazo-administrativo-invalido'
  | 'confirmacion-requerida'
  | 'causal-requerida'
  | 'integracion-sin-confirmar'
  | 'motivo-requerido'
  | 'cobertura-inconsistente'
  | 'cobertura-sin-pendientes'

export interface TransicionPermitida {
  readonly permitida: true
  readonly suceso: SucesoTransicion
  readonly estadoOrigen: EstadoRequerimiento
  readonly estadoDestino: EstadoRequerimiento
  readonly cambiaEstado: boolean
  /** Solo la edición en Pendiente genera una nueva versión sin cambiar de estado. */
  readonly nuevaVersion: boolean
  /** La apertura no cambia el estado hasta que Selección confirme. */
  readonly requiereConfirmacion: 'apertura-proceso' | null
  /** Un Cancelado nacido de un Borrador conserva sus datos parciales tal cual. */
  readonly datosConservados: 'completos' | 'parciales' | null
}

export interface TransicionRechazada {
  readonly permitida: false
  readonly suceso: SucesoTransicion
  readonly estadoOrigen: EstadoRequerimiento
  readonly motivo: MotivoRechazoTransicion
  readonly mensaje: string
}

export type ResultadoTransicionEstado = TransicionPermitida | TransicionRechazada
