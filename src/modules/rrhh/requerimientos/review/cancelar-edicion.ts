import type {
  ComandosRequerimientosPort,
  DetalleRequerimientoEditable,
} from '../contracts'
import { formularioDesdeDetalle } from '../form/helpers'
import type { FormularioRequerimientoInput } from '../model'
import type {
  EstadoEdicionRevision,
  EstadoOperacion,
  PasoEdicionRevision,
  SolicitudVersionada,
} from './estado'
import { crearEstadoEdicion, guardarBorrador } from './estado'

export type DecisionDescarte = 'aceptar' | 'rechazar' | 'cancelar'

/**
 * Sesión de edición de UX-03. «Cancelar edición» abandona esa sesión y restaura
 * los valores de partida; no persiste ni cambia el estado del requerimiento. No
 * es «Guardar borrador», que exige el puerto de comandos, ni «Cancelar
 * requerimiento», transición de dominio con causal y confirmación que pertenece
 * a T-RH-12/T-RH-16.
 */
export interface EdicionEnCurso {
  readonly estado: EstadoEdicionRevision
  /** Valores persistidos al abrir la edición; es lo que se restaura al descartar. */
  readonly formularioDePartida: FormularioRequerimientoInput
  readonly descartePendiente: boolean
}

export type ResultadoSolicitudCancelacion =
  | {
      readonly status: 'confirmacion-pendiente'
      readonly edicion: EdicionEnCurso
    }
  | {
      readonly status: 'sin-cambios'
      readonly edicion: EdicionEnCurso
      readonly volverAlContextoAnterior: true
    }
  | {
      readonly status: 'paso-invalido'
      readonly pasoActual: PasoEdicionRevision
      readonly accion: 'cancelar-edicion'
      readonly edicion: EdicionEnCurso
    }

export type ResultadoDescarte =
  | {
      readonly status: 'descartado'
      readonly edicion: EdicionEnCurso
      readonly volverAlContextoAnterior: true
    }
  | {
      readonly status: 'conservado'
      readonly decision: 'rechazar' | 'cancelar'
      readonly edicion: EdicionEnCurso
    }
  | {
      readonly status: 'sin-descarte-pendiente'
      readonly decision: DecisionDescarte
      readonly edicion: EdicionEnCurso
    }

export interface ResultadoGuardadoEnCurso {
  readonly edicion: EdicionEnCurso
  readonly operacion: EstadoOperacion
}

function mismoValor(
  campo: keyof FormularioRequerimientoInput,
  actual: FormularioRequerimientoInput[keyof FormularioRequerimientoInput],
  partida: FormularioRequerimientoInput[keyof FormularioRequerimientoInput],
): boolean {
  // Los controles devuelven cadenas: `2` y `'2'` no son un cambio de valor.
  if (campo === 'vacantes') {
    const normalizar = (valor: typeof actual) =>
      valor === null || valor === '' ? null : String(valor).trim()
    return normalizar(actual) === normalizar(partida)
  }
  if (campo === 'remuneracionMensual') {
    const normalizar = (valor: typeof actual) => {
      if (typeof valor !== 'string' || valor.trim() === '') return null
      const numero = Number(valor)
      return Number.isFinite(numero) ? numero : valor.trim()
    }
    return normalizar(actual) === normalizar(partida)
  }
  return Object.is(actual, partida)
}

function mismoFormulario(
  formulario: FormularioRequerimientoInput,
  partida: FormularioRequerimientoInput,
): boolean {
  const campos = Object.keys(
    formulario,
  ) as (keyof FormularioRequerimientoInput)[]
  return (
    Object.keys(partida).length === campos.length &&
    campos.every((campo) => mismoValor(campo, formulario[campo], partida[campo]))
  )
}

export function crearEdicionEnCurso(
  formulario: FormularioRequerimientoInput,
  formularioDePartida: FormularioRequerimientoInput = formulario,
): EdicionEnCurso {
  return {
    estado: crearEstadoEdicion(formulario),
    formularioDePartida: { ...formularioDePartida },
    descartePendiente: false,
  }
}

/**
 * Pide abandonar la edición. Con cambios sin guardar no descarta todavía: deja
 * la confirmación pendiente para que la decisión de descartar sea explícita.
 */
export function solicitarCancelarEdicion(
  edicion: EdicionEnCurso,
): ResultadoSolicitudCancelacion {
  if (edicion.estado.paso === 'confirmacion') {
    return {
      status: 'paso-invalido',
      pasoActual: edicion.estado.paso,
      accion: 'cancelar-edicion',
      edicion,
    }
  }

  if (edicion.descartePendiente) {
    return { status: 'confirmacion-pendiente', edicion }
  }

  if (mismoFormulario(edicion.estado.formulario, edicion.formularioDePartida)) {
    return {
      status: 'sin-cambios',
      edicion: {
        ...edicion,
        estado: crearEstadoEdicion(edicion.formularioDePartida),
      },
      volverAlContextoAnterior: true,
    }
  }

  return {
    status: 'confirmacion-pendiente',
    edicion: { ...edicion, descartePendiente: true },
  }
}

/**
 * Resuelve la confirmación de descarte. Aceptar restaura los valores de partida
 * sin tocar puertos ni estado de dominio; rechazar o cancelar la confirmación
 * conserva el paso y todos los valores, incluidos los no persistidos.
 */
export function resolverDescarte(
  edicion: EdicionEnCurso,
  decision: DecisionDescarte,
): ResultadoDescarte {
  if (!edicion.descartePendiente) {
    return { status: 'sin-descarte-pendiente', decision, edicion }
  }

  if (decision === 'aceptar') {
    return {
      status: 'descartado',
      edicion: {
        estado: crearEstadoEdicion(edicion.formularioDePartida),
        formularioDePartida: edicion.formularioDePartida,
        descartePendiente: false,
      },
      volverAlContextoAnterior: true,
    }
  }

  return {
    status: 'conservado',
    decision,
    edicion: { ...edicion, descartePendiente: false },
  }
}

/** Tras un guardado confirmado, lo persistido pasa a ser el nuevo punto de partida. */
export function registrarGuardado(
  edicion: EdicionEnCurso,
  detalle: DetalleRequerimientoEditable,
): EdicionEnCurso {
  return {
    estado: edicion.estado,
    formularioDePartida: formularioDesdeDetalle(detalle),
    descartePendiente: false,
  }
}

/**
 * «Guardar borrador» sobre la sesión de edición: delega en T-RH-09 y, solo con
 * el guardado confirmado, mueve el punto de partida de «Cancelar edición» a lo
 * persistido. Un fallo conserva la entrada y el punto de partida anterior.
 */
export async function guardarBorradorEnCurso(
  edicion: EdicionEnCurso,
  solicitud: SolicitudVersionada,
  port: ComandosRequerimientosPort | null,
): Promise<ResultadoGuardadoEnCurso> {
  const resultado = await guardarBorrador(edicion.estado, solicitud, port)
  const sesion: EdicionEnCurso = { ...edicion, estado: resultado.estado }

  if (
    resultado.operacion.status === 'confirmado' &&
    resultado.operacion.accion === 'borrador'
  ) {
    return {
      edicion: registrarGuardado(sesion, resultado.operacion.detalle),
      operacion: resultado.operacion,
    }
  }
  return { edicion: sesion, operacion: resultado.operacion }
}
