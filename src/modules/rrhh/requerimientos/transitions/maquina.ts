import type {
  DetalleRequerimiento,
  EstadoRequerimiento,
} from '../contracts'
import {
  DIAS_HABILES_ADMINISTRATIVOS,
  situacionPlazoAprobacion,
} from '../deadlines'
import {
  accionConcedida,
  clasificacionDeDetalle,
  esAccionElegible,
  esCausalCancelacion,
  motivoEstadoNoAplicable,
} from '../model'
import { TRANSICIONES } from './model'
import type {
  MotivoRechazoTransicion,
  ResultadoTransicionEstado,
  SolicitudTransicion,
  SucesoTransicion,
  TransicionPermitida,
  TransicionRechazada,
} from './types'

export const MENSAJES_RECHAZO: Readonly<
  Record<MotivoRechazoTransicion, string>
> = {
  'sin-autorizacion':
    'No tienes permiso para ejecutar esta acción en el requerimiento.',
  'suceso-no-aplica-al-estado':
    'El suceso no está permitido desde el estado actual del requerimiento.',
  'clasificacion-no-aplicable':
    'La acción solo aplica a requerimientos de clasificación administrativa.',
  'plazo-administrativo-invalido':
    `El plazo administrativo debe ser un entero entre ${DIAS_HABILES_ADMINISTRATIVOS.minimo} y ${DIAS_HABILES_ADMINISTRATIVOS.maximo} días hábiles antes de aprobar.`,
  'confirmacion-requerida': 'Confirma la cancelación del requerimiento.',
  'causal-requerida':
    'Selecciona una causal válida: menor carga laboral o creación por error.',
  'integracion-sin-confirmar':
    'La transición requiere una confirmación de integración que aún no existe.',
  'motivo-requerido': 'El evento de reversión exige un motivo.',
  'cobertura-inconsistente':
    'La cobertura confirmada no cumple pendientes = solicitadas − cubiertas.',
  'cobertura-sin-pendientes':
    'La reversión requiere que vuelvan a existir vacantes pendientes.',
}

interface CoberturaNumerica {
  readonly solicitadas: number
  readonly cubiertas: number
  readonly pendientes: number
}

function coberturaConsistente(cobertura: CoberturaNumerica): boolean {
  return (
    Number.isInteger(cobertura.solicitadas) &&
    Number.isInteger(cobertura.cubiertas) &&
    Number.isInteger(cobertura.pendientes) &&
    cobertura.solicitadas >= 1 &&
    cobertura.cubiertas >= 0 &&
    cobertura.pendientes >= 0 &&
    cobertura.pendientes === cobertura.solicitadas - cobertura.cubiertas
  )
}

function rechazo(
  detalle: DetalleRequerimiento,
  suceso: SucesoTransicion,
  motivo: MotivoRechazoTransicion,
): TransicionRechazada {
  return {
    permitida: false,
    suceso,
    estadoOrigen: detalle.estado,
    motivo,
    mensaje: MENSAJES_RECHAZO[motivo],
  }
}

function permitida(
  detalle: DetalleRequerimiento,
  suceso: SucesoTransicion,
  destino: EstadoRequerimiento,
): TransicionPermitida {
  return {
    permitida: true,
    suceso,
    estadoOrigen: detalle.estado,
    estadoDestino: destino,
    cambiaEstado: detalle.estado !== destino,
    nuevaVersion: suceso === 'editar',
    requiereConfirmacion:
      suceso === 'iniciar-apertura-proceso' ? 'apertura-proceso' : null,
    datosConservados:
      suceso === 'cancelar'
        ? detalle.estado === 'borrador'
          ? 'parciales'
          : 'completos'
        : null,
  }
}

/**
 * Evalúa un suceso contra el estado, las capacidades y los eventos ya
 * confirmados. No ejecuta comandos ni altera el estado de forma optimista.
 */
export function evaluarTransicion(
  detalle: DetalleRequerimiento,
  solicitud: SolicitudTransicion,
): ResultadoTransicionEstado {
  const definicion = TRANSICIONES[solicitud.suceso]

  if (
    definicion.accion !== null &&
    !accionConcedida(detalle, definicion.accion)
  ) {
    return rechazo(detalle, solicitud.suceso, 'sin-autorizacion')
  }
  if (!definicion.origenes.includes(detalle.estado)) {
    return rechazo(detalle, solicitud.suceso, 'suceso-no-aplica-al-estado')
  }
  if (definicion.accion !== null && esAccionElegible(definicion.accion)) {
    const motivo = motivoEstadoNoAplicable(detalle, definicion.accion)
    if (motivo === 'estado-no-aplicable') {
      return rechazo(detalle, solicitud.suceso, 'suceso-no-aplica-al-estado')
    }
    if (motivo === 'clasificacion-no-aplicable') {
      return rechazo(detalle, solicitud.suceso, 'clasificacion-no-aplicable')
    }
  }

  switch (solicitud.suceso) {
    case 'editar':
    case 'fijar-plazo':
    case 'ajustar-plazo':
    case 'iniciar-apertura-proceso':
    case 'asociar-candidato':
      return permitida(detalle, solicitud.suceso, detalle.estado)
    case 'enviar':
    case 'reenviar':
      return permitida(detalle, solicitud.suceso, 'pendiente-aprobacion')
    case 'aprobar':
      if (
        situacionPlazoAprobacion(
          clasificacionDeDetalle(detalle),
          detalle.plazo,
        ) === 'invalido'
      ) {
        return rechazo(
          detalle,
          solicitud.suceso,
          'plazo-administrativo-invalido',
        )
      }
      return permitida(detalle, solicitud.suceso, 'aprobado')
    case 'observar':
      return permitida(detalle, solicitud.suceso, 'observado')
    case 'confirmar-apertura-proceso':
      if (solicitud.evento === null) {
        return rechazo(detalle, solicitud.suceso, 'integracion-sin-confirmar')
      }
      return permitida(detalle, solicitud.suceso, 'en-reclutamiento')
    case 'confirmar-primer-dia-real': {
      if (solicitud.evento === null) {
        return rechazo(detalle, solicitud.suceso, 'integracion-sin-confirmar')
      }
      const cobertura = solicitud.cobertura
      if (cobertura === null || !coberturaConsistente(cobertura)) {
        return rechazo(detalle, solicitud.suceso, 'cobertura-inconsistente')
      }
      return permitida(
        detalle,
        solicitud.suceso,
        cobertura.pendientes === 0 ? 'cubierto' : 'en-reclutamiento',
      )
    }
    case 'confirmar-reversion-cobertura': {
      if (solicitud.evento === null) {
        return rechazo(detalle, solicitud.suceso, 'integracion-sin-confirmar')
      }
      const evento = solicitud.evento
      if (evento.motivo.trim() === '') {
        return rechazo(detalle, solicitud.suceso, 'motivo-requerido')
      }
      if (!coberturaConsistente(evento.efectoCobertura)) {
        return rechazo(detalle, solicitud.suceso, 'cobertura-inconsistente')
      }
      if (evento.efectoCobertura.pendientes === 0) {
        return rechazo(detalle, solicitud.suceso, 'cobertura-sin-pendientes')
      }
      return permitida(detalle, solicitud.suceso, 'en-reclutamiento')
    }
    case 'cancelar':
      if (solicitud.confirmado !== true) {
        return rechazo(detalle, solicitud.suceso, 'confirmacion-requerida')
      }
      if (!esCausalCancelacion(solicitud.causal)) {
        return rechazo(detalle, solicitud.suceso, 'causal-requerida')
      }
      return permitida(detalle, solicitud.suceso, 'cancelado')
  }
}
