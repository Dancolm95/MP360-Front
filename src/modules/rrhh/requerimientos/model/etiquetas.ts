import type {
  Clasificacion,
  EstadoRequerimiento,
  MotivoRequerimiento,
  NivelAlerta,
} from '../contracts'

export const MOTIVO_ETIQUETAS: Readonly<Record<MotivoRequerimiento, string>> = {
  reemplazo: 'Reemplazo',
  'nueva-vacante': 'Nueva Vacante',
  practicante: 'Practicante',
  otros: 'Otros',
}

export const CLASIFICACION_ETIQUETAS: Readonly<Record<Clasificacion, string>> = {
  operativo: 'Operativo',
  administrativo: 'Administrativo',
}

export const ESTADO_LABELS: Readonly<Record<EstadoRequerimiento, string>> = {
  borrador: 'Borrador',
  'pendiente-aprobacion': 'Pendiente de aprobación',
  observado: 'Observado',
  aprobado: 'Aprobado',
  'en-reclutamiento': 'En reclutamiento',
  cubierto: 'Cubierto',
  cancelado: 'Cancelado',
}

export const MOTIVO_LABELS: Readonly<Record<MotivoRequerimiento, string>> = {
  reemplazo: 'Reemplazo',
  'nueva-vacante': 'Nueva Vacante',
  practicante: 'Practicante',
  otros: 'Otros',
}

export const ALERTA_LABELS: Readonly<Record<NivelAlerta, string>> = {
  temprana: 'Temprana',
  media: 'Media',
  critica: 'Crítica',
}

export const AVISO_DURACION = 'La fecha objetivo se calcula al aprobar.'

export const SIN_COMPLETAR = 'Sin completar'
export const SIN_SUBAREA = 'Sin subárea'
export const SIN_ASIGNAR = 'Sin asignar'
export const SIN_COLABORADOR = 'Sin colaborador'
export const NO_APLICA = 'No aplica'
export const NO_DISPONIBLE = 'No disponible'
export const SIN_DETERMINAR = 'Sin determinar'
export const PENDIENTE_DEFINIR = 'Pendiente de definir'
