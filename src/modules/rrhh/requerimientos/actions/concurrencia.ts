import type { ComandoVersionado } from '../contracts'
import { mapearFalloComandoVersionado } from './resultados'
import type {
  ConflictoComandoVersionado,
  ResultadoComandoVersionado,
  SolicitudComandoVersionado,
} from './types'

const MENSAJE_TRANSICION_RECHAZADA =
  'La acción no es válida en el estado actual del requerimiento.'

/**
 * Única puerta de los comandos versionados: aplica el veredicto de T-RH-16,
 * invoca el puerto y convierte cualquier fallo conservando la entrada.
 */
export async function ejecutarComandoVersionado<C extends ComandoVersionado, T>(
  solicitud: SolicitudComandoVersionado<C, T>,
): Promise<ResultadoComandoVersionado<C, T>> {
  const { comando, decision } = solicitud

  if (decision.tipo === 'transicion' && !decision.veredicto.permitida) {
    return {
      status: 'transicion-rechazada',
      veredicto: decision.veredicto,
      entrada: comando,
      mensaje: decision.veredicto.mensaje ?? MENSAJE_TRANSICION_RECHAZADA,
      entradaConservada: true,
      reintentable: false,
    }
  }

  const resultado = await solicitud.ejecutar(comando)
  if (resultado.status === 'confirmado') {
    return { status: 'confirmado', comando, datos: resultado.datos }
  }

  return mapearFalloComandoVersionado(comando, resultado)
}

/**
 * Proyecta la entrada conservada sobre la versión vigente. No reintenta por sí
 * solo: la persona debe revisar los datos vigentes antes de decidir de nuevo.
 */
export function comandoConVersionVigente<C extends ComandoVersionado>(
  conflicto: ConflictoComandoVersionado<C>,
): C {
  return { ...conflicto.entrada, version: conflicto.versionVigente }
}
