import type { ContractError } from '../../../../shared'
import type {
  CampoRequerimiento,
  CatalogosRequerimientos,
  ComandoEnviarAprobacion,
  ComandoGuardarBorrador,
  ComandosRequerimientosPort,
  ConflictoVersion,
  ConfirmacionEnvio,
  DetalleRequerimientoEditable,
  ErrorIntegracion,
  ErrorValidacion,
  EstadoRequerimiento,
  MotivoDenegacion,
  RequerimientoId,
  ResultadoEnvioAprobacion,
  ResultadoGuardarBorrador,
} from '../contracts'
import type { CambioFormulario } from '../form/helpers'
import { MOTIVO_ETIQUETAS, aplicarCambio } from '../form/helpers'
import type { FormularioRequerimientoInput } from '../model'
import type {
  ErrorRevision,
  OpcionesRevision,
  RevisionRequerimiento,
} from './modelo'
import {
  SIN_ASIGNAR,
  borradorDesdeFormulario,
  crearRevision,
} from './modelo'

export type PasoEdicionRevision = 'edicion' | 'revision' | 'confirmacion'
export type AccionOperacion = 'envio' | 'borrador'

export interface SolicitudVersionada {
  readonly requerimientoId: RequerimientoId
  readonly version: number
}

export interface DatoConfirmacion {
  readonly id: RequerimientoId
  readonly version: number
  readonly resumen: string
  readonly responsable: string
  readonly estado: 'pendiente-aprobacion'
}

export interface ErrorOperacionRevision {
  readonly campo: CampoRequerimiento
  readonly etiqueta: string
  readonly mensaje: string
}

/**
 * Resultado de una operación. Solo `confirmado` representa éxito persistido;
 * el resto conserva la entrada y declara si el contrato permite reintentar.
 */
export type EstadoOperacion =
  | {
      readonly status: 'confirmado'
      readonly accion: 'envio'
      readonly confirmacion: DatoConfirmacion
    }
  | {
      readonly status: 'confirmado'
      readonly accion: 'borrador'
      readonly detalle: DetalleRequerimientoEditable
    }
  | {
      readonly status: 'conflicto-version'
      readonly conflicto: ConflictoVersion
      readonly entradaConservada: true
      readonly reintentable: true
    }
  | {
      readonly status: 'validacion'
      readonly errores: readonly ErrorOperacionRevision[]
      readonly entradaConservada: true
      readonly reintentable: true
    }
  | {
      readonly status: 'sin-autorizacion'
      readonly motivo: MotivoDenegacion
      readonly entradaConservada: true
      readonly reintentable: false
    }
  | {
      readonly status: 'estado-invalido'
      readonly estadoActual: EstadoRequerimiento
      readonly entradaConservada: true
      readonly reintentable: false
    }
  | {
      readonly status: 'error-integracion'
      readonly error: ErrorIntegracion
      readonly entradaConservada: true
      readonly reintentable: boolean
    }
  | {
      readonly status: 'error'
      readonly error: ContractError
      readonly entradaConservada: true
      readonly reintentable: boolean
    }
  | {
      readonly status: 'sesion-finalizada'
      readonly entradaConservada: true
      readonly reintentable: false
    }
  | {
      readonly status: 'paso-invalido'
      readonly pasoActual: PasoEdicionRevision
      readonly accion: AccionOperacion
      readonly entradaConservada: true
      readonly reintentable: false
    }
  | {
      readonly status: 'revision-invalida'
      readonly errores: readonly ErrorRevision[]
      readonly entradaConservada: true
      readonly reintentable: true
    }
  | {
      readonly status: 'no-disponible'
      readonly accion: AccionOperacion
      readonly entradaConservada: true
      readonly reintentable: false
    }

type FalloOperacion = Exclude<
  ResultadoEnvioAprobacion,
  { readonly status: 'confirmado' }
>

interface EstadoBase {
  readonly formulario: FormularioRequerimientoInput
}

export interface EstadoEdicion extends EstadoBase {
  readonly paso: 'edicion'
  readonly revision: null
  readonly operacion: EstadoOperacion | null
}

export interface EstadoRevision extends EstadoBase {
  readonly paso: 'revision'
  readonly revision: RevisionRequerimiento
  readonly operacion: EstadoOperacion | null
}

export interface EstadoConfirmacion extends EstadoBase {
  readonly paso: 'confirmacion'
  readonly revision: RevisionRequerimiento
  readonly confirmacion: DatoConfirmacion
  readonly operacion: Extract<
    EstadoOperacion,
    { readonly status: 'confirmado'; readonly accion: 'envio' }
  >
}

export type EstadoEdicionRevision =
  | EstadoEdicion
  | EstadoRevision
  | EstadoConfirmacion

export interface TransicionIlegal {
  readonly ok: false
  readonly motivo: 'paso-invalido'
  readonly pasoActual: PasoEdicionRevision
  readonly accion: 'revisar' | 'volver-a-editar' | 'editar'
}

export type ResultadoTransicion =
  | { readonly ok: true; readonly estado: EstadoEdicionRevision }
  | TransicionIlegal

export interface ResultadoOperacion {
  readonly estado: EstadoEdicionRevision
  readonly operacion: EstadoOperacion
}

const ETIQUETAS_CAMPO_OPERACION: Readonly<Record<CampoRequerimiento, string>> = {
  motivo: 'Motivo',
  empresa: 'Empresa',
  'colaborador-a-reemplazar': 'Colaborador a reemplazar',
  departamento: 'Departamento',
  area: 'Área',
  subarea: 'Subárea',
  puesto: 'Puesto',
  vacantes: 'Vacantes',
  remuneracion: 'Remuneración mensual',
  ubicacion: 'Ubicación',
  'usuario-proxima-tarea': 'Responsable de la próxima tarea',
  comentario: 'Comentario',
  'plazo-administrativo': 'Plazo administrativo',
  general: 'General',
}

export function erroresOperacionRevision(
  errores: readonly ErrorValidacion[],
): readonly ErrorOperacionRevision[] {
  return errores.map((error) => ({
    campo: error.campo,
    etiqueta: ETIQUETAS_CAMPO_OPERACION[error.campo],
    mensaje: error.mensaje,
  }))
}

function resumenConfirmacion(resumen: ConfirmacionEnvio['resumen']): string {
  const vacantes =
    resumen.solicitadas === 1 ? '1 vacante' : `${resumen.solicitadas} vacantes`
  return `${MOTIVO_ETIQUETAS[resumen.motivo]} · ${resumen.puesto.nombre} · ${resumen.empresa.nombre} · ${vacantes}`
}

export function confirmacionDesdeEnvio(
  envio: ConfirmacionEnvio,
): DatoConfirmacion {
  return {
    id: envio.id,
    version: envio.resumen.version,
    resumen: resumenConfirmacion(envio.resumen),
    responsable: envio.responsable?.nombre ?? SIN_ASIGNAR,
    estado: envio.estado,
  }
}

function pasoInvalido(
  pasoActual: PasoEdicionRevision,
  accion: AccionOperacion,
): EstadoOperacion {
  return {
    status: 'paso-invalido',
    pasoActual,
    accion,
    entradaConservada: true,
    reintentable: false,
  }
}

function conOperacion(
  estado: EstadoEdicionRevision,
  operacion: EstadoOperacion,
): EstadoEdicionRevision {
  if (estado.paso === 'confirmacion') return estado
  return { ...estado, operacion }
}

function operacionDesdeFallo(resultado: FalloOperacion): EstadoOperacion {
  switch (resultado.status) {
    case 'validacion':
      return {
        status: 'validacion',
        errores: erroresOperacionRevision(resultado.errores),
        entradaConservada: true,
        reintentable: true,
      }
    case 'conflicto-version':
      return {
        status: 'conflicto-version',
        conflicto: resultado.conflicto,
        entradaConservada: true,
        reintentable: true,
      }
    case 'sin-autorizacion':
      return {
        status: 'sin-autorizacion',
        motivo: resultado.motivo,
        entradaConservada: true,
        reintentable: false,
      }
    case 'estado-invalido':
      return {
        status: 'estado-invalido',
        estadoActual: resultado.estadoActual,
        entradaConservada: true,
        reintentable: false,
      }
    case 'error-integracion':
      return {
        status: 'error-integracion',
        error: resultado.error,
        entradaConservada: true,
        reintentable: resultado.error.error.retryable,
      }
    case 'error':
      return {
        status: 'error',
        error: resultado.error,
        entradaConservada: true,
        reintentable: resultado.error.retryable,
      }
    case 'sesion-finalizada':
      return {
        status: 'sesion-finalizada',
        entradaConservada: true,
        reintentable: false,
      }
  }
}

export function crearEstadoEdicion(
  formulario: FormularioRequerimientoInput,
): EstadoEdicion {
  return {
    paso: 'edicion',
    formulario: { ...formulario },
    revision: null,
    operacion: null,
  }
}

export function editarFormulario(
  estado: EstadoEdicionRevision,
  cambio: CambioFormulario,
): ResultadoTransicion {
  if (estado.paso === 'confirmacion') {
    return {
      ok: false,
      motivo: 'paso-invalido',
      pasoActual: estado.paso,
      accion: 'editar',
    }
  }

  const formulario = aplicarCambio(estado.formulario, cambio)
  return {
    ok: true,
    estado: {
      paso: 'edicion',
      formulario,
      revision: null,
      operacion: null,
    },
  }
}

export function volverAEditar(
  estado: EstadoEdicionRevision,
): ResultadoTransicion {
  if (estado.paso !== 'revision') {
    return {
      ok: false,
      motivo: 'paso-invalido',
      pasoActual: estado.paso,
      accion: 'volver-a-editar',
    }
  }

  return {
    ok: true,
    estado: {
      paso: 'edicion',
      formulario: estado.formulario,
      revision: null,
      operacion: null,
    },
  }
}

export function revisar(
  estado: EstadoEdicionRevision,
  catalogos: CatalogosRequerimientos,
  opciones?: OpcionesRevision,
): ResultadoTransicion {
  if (estado.paso !== 'edicion') {
    return {
      ok: false,
      motivo: 'paso-invalido',
      pasoActual: estado.paso,
      accion: 'revisar',
    }
  }

  return {
    ok: true,
    estado: {
      paso: 'revision',
      formulario: estado.formulario,
      revision: crearRevision(estado.formulario, catalogos, opciones),
      operacion: null,
    },
  }
}

export async function enviarAprobacion(
  estado: EstadoEdicionRevision,
  solicitud: SolicitudVersionada,
  port: ComandosRequerimientosPort | null,
): Promise<ResultadoOperacion> {
  if (estado.paso !== 'revision') {
    return {
      estado,
      operacion: pasoInvalido(estado.paso, 'envio'),
    }
  }

  if (!estado.revision.puedeEnviar) {
    const operacion: EstadoOperacion = {
      status: 'revision-invalida',
      errores: estado.revision.errores,
      entradaConservada: true,
      reintentable: true,
    }
    return { estado: conOperacion(estado, operacion), operacion }
  }

  if (port === null) {
    const operacion: EstadoOperacion = {
      status: 'no-disponible',
      accion: 'envio',
      entradaConservada: true,
      reintentable: false,
    }
    return { estado: conOperacion(estado, operacion), operacion }
  }

  const comando: ComandoEnviarAprobacion = {
    requerimientoId: solicitud.requerimientoId,
    version: solicitud.version,
    contenido: borradorDesdeFormulario(estado.revision.formulario),
  }
  const resultado: ResultadoEnvioAprobacion =
    await port.enviarAprobacion(comando)

  if (resultado.status === 'confirmado') {
    const confirmacion = confirmacionDesdeEnvio(resultado.datos)
    const operacion: EstadoOperacion = {
      status: 'confirmado',
      accion: 'envio',
      confirmacion,
    }
    return {
      estado: {
        paso: 'confirmacion',
        formulario: estado.formulario,
        revision: estado.revision,
        confirmacion,
        operacion,
      },
      operacion,
    }
  }

  const operacion = operacionDesdeFallo(resultado)
  return { estado: conOperacion(estado, operacion), operacion }
}

export async function guardarBorrador(
  estado: EstadoEdicionRevision,
  solicitud: SolicitudVersionada,
  port: ComandosRequerimientosPort | null,
): Promise<ResultadoOperacion> {
  if (estado.paso === 'confirmacion') {
    return {
      estado,
      operacion: pasoInvalido(estado.paso, 'borrador'),
    }
  }

  if (port === null) {
    const operacion: EstadoOperacion = {
      status: 'no-disponible',
      accion: 'borrador',
      entradaConservada: true,
      reintentable: false,
    }
    return { estado: conOperacion(estado, operacion), operacion }
  }

  const comando: ComandoGuardarBorrador = {
    requerimientoId: solicitud.requerimientoId,
    version: solicitud.version,
    borrador: borradorDesdeFormulario(estado.formulario),
  }
  const resultado: ResultadoGuardarBorrador = await port.guardarBorrador(comando)

  if (resultado.status === 'confirmado') {
    const operacion: EstadoOperacion = {
      status: 'confirmado',
      accion: 'borrador',
      detalle: resultado.datos,
    }
    return { estado: conOperacion(estado, operacion), operacion }
  }

  const operacion = operacionDesdeFallo(resultado)
  return { estado: conOperacion(estado, operacion), operacion }
}
