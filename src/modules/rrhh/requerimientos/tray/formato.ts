import type {
  EstadoRequerimiento,
  MotivoRequerimiento,
  NivelAlerta,
} from '../contracts'

export { ESTADOS, MOTIVOS } from '../state/valores-bandeja'

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

/** Fecha civil `YYYY-MM-DD` mostrada como `DD/MM/YYYY`, sin depender del huso. */
export function formatearFecha(valor: string): string {
  const [anio, mes, dia] = valor.slice(0, 10).split('-')
  if (!anio || !mes || !dia) return valor
  return `${dia}/${mes}/${anio}`
}
