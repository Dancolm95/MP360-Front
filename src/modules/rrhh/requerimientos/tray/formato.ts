import type {
  EstadoRequerimiento,
  MotivoRequerimiento,
  NivelAlerta,
} from '../contracts'

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

export const ESTADOS: readonly EstadoRequerimiento[] = [
  'borrador',
  'pendiente-aprobacion',
  'observado',
  'aprobado',
  'en-reclutamiento',
  'cubierto',
  'cancelado',
]

export const MOTIVOS: readonly MotivoRequerimiento[] = [
  'reemplazo',
  'nueva-vacante',
  'practicante',
  'otros',
]

/** Fecha civil `YYYY-MM-DD` mostrada como `DD/MM/YYYY`, sin depender del huso. */
export function formatearFecha(valor: string): string {
  const [anio, mes, dia] = valor.slice(0, 10).split('-')
  if (!anio || !mes || !dia) return valor
  return `${dia}/${mes}/${anio}`
}
