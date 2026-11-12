import type { Opaque } from '../../../../shared'

/**
 * Identificadores opacos del dominio Requerimientos. Los produce el
 * adaptador/backend; el frontend los compara por identidad y no los construye
 * a partir de URLs, endpoints ni etiquetas visuales.
 */

export type RequerimientoId = Opaque<string, 'RequerimientoId'>
export type EventoHistorialId = Opaque<string, 'EventoHistorialId'>
export type SolicitudReversionId = Opaque<string, 'SolicitudReversionId'>
export type ProcesoSeleccionId = Opaque<string, 'ProcesoSeleccionId'>

export type EmpresaId = Opaque<string, 'EmpresaId'>
export type DepartamentoId = Opaque<string, 'DepartamentoId'>
export type AreaId = Opaque<string, 'AreaId'>
export type SubareaId = Opaque<string, 'SubareaId'>
export type PuestoId = Opaque<string, 'PuestoId'>
export type UsuarioId = Opaque<string, 'UsuarioId'>
export type ColaboradorId = Opaque<string, 'ColaboradorId'>

export type DepartamentoUbicacionId = Opaque<string, 'DepartamentoUbicacionId'>
export type ProvinciaId = Opaque<string, 'ProvinciaId'>
export type DistritoId = Opaque<string, 'DistritoId'>

export type CalendarioLaboralId = Opaque<string, 'CalendarioLaboralId'>

/** Fecha civil sin hora; no es un instante ni un campo de transporte. */
export type FechaISO = Opaque<string, 'FechaISO'>

/** Fecha y hora de auditoría o historial. */
export type InstanteISO = Opaque<string, 'InstanteISO'>
