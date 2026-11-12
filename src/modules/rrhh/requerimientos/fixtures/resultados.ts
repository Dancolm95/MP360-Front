import type { ContractError } from '../../../../shared'
import type {
  ConflictoVersion,
  ErrorIntegracion,
  ErrorValidacion,
  EstadoRequerimiento,
  MotivoDenegacion,
  ResultadoComando,
  ResultadoCrearRequerimiento,
  ResultadoDetalle,
  ResultadoLectura,
} from '../contracts'

export const lecturaFixture = {
  ok<T>(datos: T): ResultadoLectura<T> {
    return { status: 'ok', datos }
  },
  forbidden<T>(): ResultadoLectura<T> {
    return { status: 'forbidden' }
  },
  sesionFinalizada<T>(): ResultadoLectura<T> {
    return { status: 'sesion-finalizada' }
  },
  error<T>(error: ContractError): ResultadoLectura<T> {
    return { status: 'error', error }
  },
}

export const detalleFixture = {
  noEncontrado(): ResultadoDetalle {
    return { status: 'no-encontrado' }
  },
  forbidden(): ResultadoDetalle {
    return { status: 'forbidden' }
  },
  sesionFinalizada(): ResultadoDetalle {
    return { status: 'sesion-finalizada' }
  },
  error(error: ContractError): ResultadoDetalle {
    return { status: 'error', error }
  },
}

export const comandoFixture = {
  confirmado<T>(datos: T): ResultadoComando<T> {
    return { status: 'confirmado', datos }
  },
  validacion<T>(errores: readonly ErrorValidacion[]): ResultadoComando<T> {
    return { status: 'validacion', errores }
  },
  conflicto<T>(conflicto: ConflictoVersion): ResultadoComando<T> {
    return { status: 'conflicto-version', conflicto }
  },
  sinAutorizacion<T>(motivo: MotivoDenegacion): ResultadoComando<T> {
    return { status: 'sin-autorizacion', motivo }
  },
  estadoInvalido<T>(estadoActual: EstadoRequerimiento): ResultadoComando<T> {
    return { status: 'estado-invalido', estadoActual }
  },
  error<T>(error: ContractError): ResultadoComando<T> {
    return { status: 'error', error }
  },
  errorIntegracion<T>(error: ErrorIntegracion): ResultadoComando<T> {
    return { status: 'error-integracion', error }
  },
  sesionFinalizada<T>(): ResultadoComando<T> {
    return { status: 'sesion-finalizada' }
  },
}

export const creacionFixture = {
  validacion(errores: readonly ErrorValidacion[]): ResultadoCrearRequerimiento {
    return { status: 'validacion', errores }
  },
  sinAutorizacion(motivo: MotivoDenegacion): ResultadoCrearRequerimiento {
    return { status: 'sin-autorizacion', motivo }
  },
  error(error: ContractError): ResultadoCrearRequerimiento {
    return { status: 'error', error }
  },
  sesionFinalizada(): ResultadoCrearRequerimiento {
    return { status: 'sesion-finalizada' }
  },
}
