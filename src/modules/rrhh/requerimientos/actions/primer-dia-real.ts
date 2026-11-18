import type {
  ComandoVersionado,
  DetalleRequerimiento,
  DetalleRequerimientosPort,
  EventoPrimerDiaReal,
} from '../contracts'
import { ejecutarComandoVersionado } from './concurrencia'
import { mapearFalloComandoVersionado } from './resultados'
import type { FalloComandoVersionado } from './types'

/**
 * Envoltorio versionado de la confirmación de Alta. No es un comando de
 * escritura de Requerimientos: Alta registra el día real y esta acción solo
 * comprueba que la versión leída sigue vigente para consumirlo.
 */
export interface ComandoLeerPrimerDiaReal extends ComandoVersionado {
  readonly evento: EventoPrimerDiaReal
}

export type ResultadoLeerPrimerDiaReal =
  | {
      readonly status: 'vigente'
      readonly comando: ComandoLeerPrimerDiaReal
      readonly detalle: DetalleRequerimiento
      readonly evento: EventoPrimerDiaReal
    }
  | {
      readonly status: 'no-encontrado'
      readonly comando: ComandoLeerPrimerDiaReal
      readonly entradaConservada: true
      readonly reintentable: false
    }
  | {
      readonly status: 'forbidden'
      readonly comando: ComandoLeerPrimerDiaReal
      readonly entradaConservada: true
      readonly reintentable: false
    }
  | FalloComandoVersionado<ComandoLeerPrimerDiaReal>

/**
 * Sin confirmación no hay incremento: esta lectura no aplica la cobertura, solo
 * entrega el detalle vigente que luego proyecta `confirmarPrimerDiaReal`. La
 * puerta versionada de T-RH-17 rechaza sin aplicar y conserva la entrada.
 */
export async function leerPrimerDiaRealVigente(
  comando: ComandoLeerPrimerDiaReal,
  port: DetalleRequerimientosPort,
): Promise<ResultadoLeerPrimerDiaReal> {
  const lectura = await port.obtener(comando.requerimientoId)

  if (lectura.status === 'no-encontrado' || lectura.status === 'forbidden') {
    return {
      status: lectura.status,
      comando,
      entradaConservada: true,
      reintentable: false,
    }
  }
  if (lectura.status === 'sesion-finalizada') {
    return mapearFalloComandoVersionado(comando, {
      status: 'sesion-finalizada',
    })
  }
  if (lectura.status === 'error') {
    return mapearFalloComandoVersionado(comando, {
      status: 'error',
      error: lectura.error,
    })
  }

  const vigente = lectura.datos
  const resultado = await ejecutarComandoVersionado<
    ComandoLeerPrimerDiaReal,
    DetalleRequerimiento
  >({
    comando,
    decision: { tipo: 'no-transicion' },
    ejecutar: async (enviado) =>
      enviado.version === vigente.version
        ? { status: 'confirmado', datos: vigente }
        : {
            status: 'conflicto-version',
            conflicto: {
              versionEsperada: enviado.version,
              versionVigente: vigente.version,
              datosVigentes: vigente,
            },
          },
  })

  if (resultado.status === 'confirmado') {
    return {
      status: 'vigente',
      comando: resultado.comando,
      detalle: resultado.datos,
      evento: comando.evento,
    }
  }
  return resultado
}
