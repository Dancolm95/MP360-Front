import type {
  BorradorRequerimiento,
  CatalogosRequerimientos,
  Clasificacion,
  ColaboradorReemplazo,
  MotivoRequerimiento,
} from '../contracts'
import {
  AVISO_DURACION,
  CLASIFICACION_ETIQUETAS,
  MOTIVO_ETIQUETAS,
  NO_APLICA,
  NO_DISPONIBLE,
  PENDIENTE_DEFINIR,
  SIN_ASIGNAR,
  SIN_COLABORADOR,
  SIN_COMPLETAR,
  SIN_DETERMINAR,
  SIN_SUBAREA,
  clasificacionFormulario,
  contextoDesdeCatalogos,
  parsearRemuneracionPen,
  validarParaEnvio,
  validarVacantes,
  type CampoFormulario,
  type CodigoErrorFormulario,
  type ErrorFormulario,
  type FormularioRequerimientoInput,
} from '../model'
import { derivarDuracionAplicable } from '../deadlines'

export type ModoRevision = 'creacion' | 'edicion'
export type TipoEnvio = 'envio' | 'reenvio'

export interface OpcionesRevision {
  readonly titulo?: string
  readonly modo?: ModoRevision
  readonly tipoEnvio?: TipoEnvio
  /** Plazo ya persistido de un administrativo; antes de aprobar puede faltar. */
  readonly plazoAdministrativoDias?: number | null
  /** El contrato de catálogos no expone colaboradores; los aporta el consumidor. */
  readonly colaboradores?: readonly ColaboradorReemplazo[]
}

export interface CabeceraRevision {
  readonly titulo: string
  readonly modo: ModoRevision
  readonly tipoEnvio: TipoEnvio
}

export type CampoRevision =
  | 'motivo'
  | 'empresa'
  | 'colaboradorAReemplazar'
  | 'departamento'
  | 'area'
  | 'subarea'
  | 'puesto'
  | 'clasificacion'
  | 'vacantes'
  | 'remuneracion'
  | 'departamentoUbicacion'
  | 'provincia'
  | 'distrito'
  | 'usuarioProximaTarea'
  | 'comentario'
  | 'duracionAplicable'

export interface CampoRevisionValor {
  readonly campo: CampoRevision
  readonly etiqueta: string
  readonly valor: string
}

export interface DuracionRevision {
  readonly clasificacion: Clasificacion
  readonly diasHabiles: number | null
  readonly valor: string
  readonly aviso: string
}

export interface ErrorRevision {
  readonly campo: CampoFormulario
  readonly etiqueta: string
  readonly codigo: CodigoErrorFormulario
  readonly mensaje: string
}

/** Instantánea de los datos y los errores que alimenta la pantalla de revisión. */
export interface RevisionRequerimiento {
  readonly cabecera: CabeceraRevision
  readonly formulario: FormularioRequerimientoInput
  readonly campos: readonly CampoRevisionValor[]
  readonly clasificacion: Clasificacion | null
  readonly duracion: DuracionRevision | null
  readonly errores: readonly ErrorRevision[]
  readonly puedeEnviar: boolean
}

export const ETIQUETAS_CAMPO_REVISION: Readonly<
  Record<CampoRevision, string>
> = {
  motivo: 'Motivo',
  empresa: 'Empresa',
  colaboradorAReemplazar: 'Colaborador a reemplazar',
  departamento: 'Departamento',
  area: 'Área',
  subarea: 'Subárea',
  puesto: 'Puesto',
  clasificacion: 'Clasificación',
  vacantes: 'Vacantes',
  remuneracion: 'Remuneración mensual',
  departamentoUbicacion: 'Departamento de ubicación',
  provincia: 'Provincia',
  distrito: 'Distrito',
  usuarioProximaTarea: 'Responsable de la próxima tarea',
  comentario: 'Comentario',
  duracionAplicable: 'Duración aplicable',
}

export const ETIQUETAS_ERROR_CAMPO: Readonly<
  Record<CampoFormulario, string>
> = {
  motivo: 'Motivo',
  empresaId: 'Empresa',
  colaboradorAReemplazarId: 'Colaborador a reemplazar',
  departamentoId: 'Departamento',
  areaId: 'Área',
  subareaId: 'Subárea',
  puestoId: 'Puesto',
  vacantes: 'Vacantes',
  remuneracionMensual: 'Remuneración mensual',
  departamentoUbicacionId: 'Departamento de ubicación',
  provinciaId: 'Provincia',
  distritoId: 'Distrito',
  usuarioProximaTareaId: 'Responsable de la próxima tarea',
  comentario: 'Comentario',
}

const MENSAJES_ERROR: Readonly<Record<CodigoErrorFormulario, string>> = {
  obligatorio: 'Campo obligatorio.',
  'seleccion-no-disponible': 'La selección no está disponible en el catálogo.',
  'jerarquia-inconsistente': 'La selección no coincide con la jerarquía.',
  'valor-no-permitido': 'Valor no permitido.',
  'entero-minimo': 'Debe ser un número entero mayor o igual que 1.',
  'formato-decimal': 'Debe tener como máximo dos decimales.',
  'importe-negativo': 'El importe no puede ser negativo.',
  'importe-debe-ser-positivo': 'El importe debe ser mayor que cero.',
}

function formatearImportePen(valor: string): string {
  const numero = Number(valor)
  if (!/^-?\d+(?:\.\d+)?$/.test(valor.trim()) || !Number.isFinite(numero)) {
    return valor
  }

  const [entero, decimales] = Math.abs(numero).toFixed(2).split('.')
  const agrupado = entero.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return `${numero < 0 ? '-' : ''}S/ ${agrupado}.${decimales}`
}

function etiquetaMotivo(
  motivo: MotivoRequerimiento | null,
  catalogos: CatalogosRequerimientos,
): string {
  if (motivo === null) return SIN_COMPLETAR
  return (
    catalogos.motivos.find((item) => item.motivo === motivo)?.etiqueta ??
    MOTIVO_ETIQUETAS[motivo]
  )
}

function nombreDe<T extends { readonly id: string; readonly nombre: string }>(
  items: readonly T[],
  id: string | null,
): string | null {
  if (id === null) return null
  return items.find((item) => item.id === id)?.nombre ?? null
}

function valorVacantes(valor: FormularioRequerimientoInput['vacantes']): string {
  return valor === null || valor === '' ? SIN_COMPLETAR : String(valor)
}

function valorRemuneracion(valor: string | null): string {
  return valor === null || valor.trim() === ''
    ? SIN_COMPLETAR
    : formatearImportePen(valor)
}

function valorComentario(valor: string | null): string {
  return valor === null || valor.trim() === ''
    ? SIN_COMPLETAR
    : valor
}

function valorColaboradorId(
  formulario: FormularioRequerimientoInput,
  colaboradores: readonly ColaboradorReemplazo[],
): string {
  if (formulario.motivo !== 'reemplazo') {
    return formulario.motivo === null ? SIN_COMPLETAR : NO_APLICA
  }
  if (formulario.colaboradorAReemplazarId === null) return SIN_COLABORADOR
  return (
    colaboradores.find(
      (item) => item.id === formulario.colaboradorAReemplazarId,
    )?.nombre ?? formulario.colaboradorAReemplazarId
  )
}

function formatearDuracion(diasHabiles: number | null): string {
  return diasHabiles === null
    ? PENDIENTE_DEFINIR
    : `${diasHabiles} días hábiles`
}

function valorDuracion(duracion: DuracionRevision | null): string {
  return duracion === null
    ? SIN_DETERMINAR
    : formatearDuracion(duracion.diasHabiles)
}

export function crearDuracionRevision(
  clasificacion: Clasificacion | null,
  plazoAdministrativoDias?: number | null,
): DuracionRevision | null {
  const duracion = derivarDuracionAplicable(
    clasificacion,
    plazoAdministrativoDias,
  )
  if (duracion === null) return null

  return {
    clasificacion: duracion.clasificacion,
    diasHabiles: duracion.diasHabiles,
    valor: formatearDuracion(duracion.diasHabiles),
    aviso: AVISO_DURACION,
  }
}

export function erroresRevision(
  errores: readonly ErrorFormulario[],
): readonly ErrorRevision[] {
  return errores.map((error) => ({
    campo: error.field,
    etiqueta: ETIQUETAS_ERROR_CAMPO[error.field],
    codigo: error.code,
    mensaje: MENSAJES_ERROR[error.code],
  }))
}

export function crearRevision(
  formulario: FormularioRequerimientoInput,
  catalogos: CatalogosRequerimientos,
  opciones: OpcionesRevision = {},
): RevisionRequerimiento {
  const validacion = validarParaEnvio(
    formulario,
    contextoDesdeCatalogos(catalogos),
  )

  const clasificacion = clasificacionFormulario(formulario, catalogos)
  const duracion = crearDuracionRevision(
    clasificacion,
    opciones.plazoAdministrativoDias,
  )
  const errores: readonly ErrorRevision[] = validacion.ok
    ? []
    : erroresRevision(validacion.errors)

  const campos: readonly CampoRevisionValor[] = [
    {
      campo: 'motivo',
      etiqueta: ETIQUETAS_CAMPO_REVISION.motivo,
      valor: etiquetaMotivo(formulario.motivo, catalogos),
    },
    {
      campo: 'empresa',
      etiqueta: ETIQUETAS_CAMPO_REVISION.empresa,
      valor: nombreDe(catalogos.empresas, formulario.empresaId) ??
        (formulario.empresaId === null ? SIN_COMPLETAR : NO_DISPONIBLE),
    },
    {
      campo: 'colaboradorAReemplazar',
      etiqueta: ETIQUETAS_CAMPO_REVISION.colaboradorAReemplazar,
      valor: valorColaboradorId(formulario, opciones.colaboradores ?? []),
    },
    {
      campo: 'departamento',
      etiqueta: ETIQUETAS_CAMPO_REVISION.departamento,
      valor:
        nombreDe(catalogos.departamentos, formulario.departamentoId) ??
        (formulario.departamentoId === null ? SIN_COMPLETAR : NO_DISPONIBLE),
    },
    {
      campo: 'area',
      etiqueta: ETIQUETAS_CAMPO_REVISION.area,
      valor:
        nombreDe(catalogos.areas, formulario.areaId) ??
        (formulario.areaId === null ? SIN_COMPLETAR : NO_DISPONIBLE),
    },
    {
      campo: 'subarea',
      etiqueta: ETIQUETAS_CAMPO_REVISION.subarea,
      valor:
        nombreDe(catalogos.subareas, formulario.subareaId) ?? SIN_SUBAREA,
    },
    {
      campo: 'puesto',
      etiqueta: ETIQUETAS_CAMPO_REVISION.puesto,
      valor:
        nombreDe(catalogos.puestos, formulario.puestoId) ??
        (formulario.puestoId === null ? SIN_COMPLETAR : NO_DISPONIBLE),
    },
    {
      campo: 'clasificacion',
      etiqueta: ETIQUETAS_CAMPO_REVISION.clasificacion,
      valor:
        clasificacion === null
          ? SIN_DETERMINAR
          : CLASIFICACION_ETIQUETAS[clasificacion],
    },
    {
      campo: 'vacantes',
      etiqueta: ETIQUETAS_CAMPO_REVISION.vacantes,
      valor: valorVacantes(formulario.vacantes),
    },
    {
      campo: 'remuneracion',
      etiqueta: ETIQUETAS_CAMPO_REVISION.remuneracion,
      valor: valorRemuneracion(formulario.remuneracionMensual),
    },
    {
      campo: 'departamentoUbicacion',
      etiqueta: ETIQUETAS_CAMPO_REVISION.departamentoUbicacion,
      valor:
        nombreDe(
          catalogos.departamentosUbicacion,
          formulario.departamentoUbicacionId,
        ) ??
        (formulario.departamentoUbicacionId === null
          ? SIN_COMPLETAR
          : NO_DISPONIBLE),
    },
    {
      campo: 'provincia',
      etiqueta: ETIQUETAS_CAMPO_REVISION.provincia,
      valor:
        nombreDe(catalogos.provincias, formulario.provinciaId) ??
        (formulario.provinciaId === null ? SIN_COMPLETAR : NO_DISPONIBLE),
    },
    {
      campo: 'distrito',
      etiqueta: ETIQUETAS_CAMPO_REVISION.distrito,
      valor:
        nombreDe(catalogos.distritos, formulario.distritoId) ??
        (formulario.distritoId === null ? SIN_COMPLETAR : NO_DISPONIBLE),
    },
    {
      campo: 'usuarioProximaTarea',
      etiqueta: ETIQUETAS_CAMPO_REVISION.usuarioProximaTarea,
      valor:
        nombreDe(
          catalogos.usuariosProximaTarea,
          formulario.usuarioProximaTareaId,
        ) ?? SIN_ASIGNAR,
    },
    {
      campo: 'comentario',
      etiqueta: ETIQUETAS_CAMPO_REVISION.comentario,
      valor: valorComentario(formulario.comentario),
    },
    {
      campo: 'duracionAplicable',
      etiqueta: ETIQUETAS_CAMPO_REVISION.duracionAplicable,
      valor: valorDuracion(duracion),
    },
  ]

  return Object.freeze({
    cabecera: Object.freeze({
      titulo: opciones.titulo ?? 'Revisión y envío',
      modo: opciones.modo ?? 'edicion',
      tipoEnvio: opciones.tipoEnvio ?? 'envio',
    }),
    formulario: Object.freeze({ ...formulario }),
    campos: Object.freeze(campos.map((campo) => Object.freeze({ ...campo }))),
    clasificacion,
    duracion: duracion === null ? null : Object.freeze({ ...duracion }),
    errores: Object.freeze([...errores]),
    puedeEnviar: validacion.ok,
  })
}

/**
 * Convierte los valores en pantalla al contenido que persiste el comando. Los
 * valores inválidos se envían como ausentes: el contrato no admite cadenas ni
 * decimales fuera de rango, y los errores se muestran por separado.
 */
export function borradorDesdeFormulario(
  formulario: FormularioRequerimientoInput,
): BorradorRequerimiento {
  const vacantes = validarVacantes(formulario.vacantes)
  const remuneracion = parsearRemuneracionPen(
    formulario.remuneracionMensual,
    formulario.motivo,
  )
  const ubicacionCompleta =
    formulario.departamentoUbicacionId !== null &&
    formulario.provinciaId !== null &&
    formulario.distritoId !== null

  return {
    motivo: formulario.motivo,
    empresaId: formulario.empresaId,
    colaboradorAReemplazarId: formulario.colaboradorAReemplazarId,
    departamentoId: formulario.departamentoId,
    areaId: formulario.areaId,
    subareaId: formulario.subareaId,
    puestoId: formulario.puestoId,
    vacantes: vacantes.ok ? vacantes.value : null,
    remuneracion: remuneracion.ok ? remuneracion.value.remuneracion : null,
    ubicacion: ubicacionCompleta
      ? {
          departamentoId: formulario.departamentoUbicacionId!,
          provinciaId: formulario.provinciaId!,
          distritoId: formulario.distritoId!,
        }
      : null,
    usuarioProximaTareaId: formulario.usuarioProximaTareaId,
    comentario: formulario.comentario,
  }
}
