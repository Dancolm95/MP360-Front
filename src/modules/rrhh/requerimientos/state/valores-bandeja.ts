import type {
  CampoOrdenBandeja,
  EstadoRequerimiento,
  MotivoRequerimiento,
  OrdenBandeja,
} from '../contracts'

/**
 * Valores canónicos que comparten el estado y la presentación de la bandeja.
 * Viven aquí para que el saneo de la persistencia no dependa de `tray/**`;
 * `tray/formato` y `tray/filtros` los reexportan.
 */
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

export const CAMPOS_ORDEN: readonly CampoOrdenBandeja[] = [
  'id',
  'fecha-creacion',
  'motivo',
  'empresa',
  'puesto',
  'solicitadas',
  'cubiertas',
  'pendientes',
  'estado',
  'fecha-objetivo',
  'responsable',
]

export const ORDEN_INICIAL: OrdenBandeja = {
  campo: 'fecha-creacion',
  direccion: 'desc',
}
