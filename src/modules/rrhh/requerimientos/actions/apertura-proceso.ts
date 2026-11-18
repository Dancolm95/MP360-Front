import type {
  ComandoAbrirProcesoSeleccion,
  ComandosRequerimientosPort,
  DetalleRequerimiento,
  ResultadoAperturaProceso,
} from '../contracts'
import { ejecutarComandoVersionado } from './concurrencia'
import type {
  FalloComandoVersionado,
  VeredictoTransicionComando,
} from './types'

/**
 * El veredicto lo produce `evaluarTransicion` (T-RH-16) con el suceso
 * `iniciar-apertura-proceso`; `actions/` no importa `transitions/`.
 */
export interface SolicitudInicioAperturaProceso {
  readonly detalle: DetalleRequerimiento
  readonly veredicto: VeredictoTransicionComando
}

/**
 * `confirmado` es la confirmación de Selección, nunca un cambio local: sin ella
 * el requerimiento sigue Aprobado y no existe proceso que mostrar.
 */
export type ResultadoIniciarAperturaProceso =
  | {
      readonly status: 'confirmado'
      readonly accion: 'abrir-proceso-seleccion'
      readonly apertura: ResultadoAperturaProceso
    }
  | FalloComandoVersionado<ComandoAbrirProcesoSeleccion>

export async function iniciarAperturaProcesoSeleccion(
  solicitud: SolicitudInicioAperturaProceso,
  port: ComandosRequerimientosPort,
): Promise<ResultadoIniciarAperturaProceso> {
  const comando: ComandoAbrirProcesoSeleccion = {
    requerimientoId: solicitud.detalle.id,
    version: solicitud.detalle.version,
  }

  const resultado = await ejecutarComandoVersionado({
    comando,
    decision: { tipo: 'transicion', veredicto: solicitud.veredicto },
    ejecutar: (enviado) => port.abrirProcesoSeleccion(enviado),
  })

  if (resultado.status === 'confirmado') {
    return {
      status: 'confirmado',
      accion: 'abrir-proceso-seleccion',
      apertura: resultado.datos,
    }
  }
  return resultado
}
