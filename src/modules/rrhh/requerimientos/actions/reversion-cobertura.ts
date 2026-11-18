import type {
  ComandoSolicitarReversionCobertura,
  ComandosRequerimientosPort,
  DetalleRequerimiento,
  SolicitudReversionRegistrada,
} from '../contracts'
import { accionConcedida, ESTADOS_SOLICITUD_REVERSION } from '../model'
import { ejecutarComandoVersionado } from './concurrencia'
import { comentarioNormalizado } from './reglas'
import type { FalloComandoVersionado } from './types'

export type ResultadoAccionSolicitarReversion =
  | {
      readonly status: 'confirmado'
      readonly accion: 'solicitar-reversion-cobertura'
      readonly comando: ComandoSolicitarReversionCobertura
      readonly solicitud: SolicitudReversionRegistrada
    }
  | FalloComandoVersionado<ComandoSolicitarReversionCobertura>

/**
 * Registra la solicitud motivada de RR. HH. No aplica la reversión: la
 * cobertura y el estado solo cambian con el evento auditado de Selección, que
 * proyecta `confirmarReversionCobertura`. Un motivo ausente o inválido, un
 * estado no admitido o la falta de capacidad se rechazan sin llamar al puerto.
 */
export async function solicitarReversionCobertura(
  detalle: DetalleRequerimiento,
  motivo: string | null | undefined,
  port: ComandosRequerimientosPort,
): Promise<ResultadoAccionSolicitarReversion> {
  if (!accionConcedida(detalle, 'solicitar-reversion-cobertura')) {
    return {
      status: 'sin-autorizacion',
      motivo: 'capacidad',
      entradaConservada: true,
      reintentable: false,
    }
  }

  if (
    !ESTADOS_SOLICITUD_REVERSION.some((estado) => estado === detalle.estado)
  ) {
    return {
      status: 'estado-invalido',
      estadoActual: detalle.estado,
      entradaConservada: true,
      reintentable: false,
    }
  }

  const motivoNormalizado = comentarioNormalizado(motivo)
  if (motivoNormalizado === null) {
    return {
      status: 'validacion',
      errores: [
        {
          campo: 'motivo',
          mensaje: 'El motivo de la solicitud de reversión es obligatorio.',
        },
      ],
      entradaConservada: true,
      reintentable: true,
    }
  }

  const comando: ComandoSolicitarReversionCobertura = {
    requerimientoId: detalle.id,
    version: detalle.version,
    motivo: motivoNormalizado,
  }
  const resultado = await ejecutarComandoVersionado({
    comando,
    decision: { tipo: 'no-transicion' },
    ejecutar: (enviado) => port.solicitarReversionCobertura(enviado),
  })

  if (resultado.status === 'confirmado') {
    return {
      status: 'confirmado',
      accion: 'solicitar-reversion-cobertura',
      comando: resultado.comando,
      solicitud: resultado.datos,
    }
  }
  return resultado
}
