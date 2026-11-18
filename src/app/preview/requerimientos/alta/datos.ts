export const PASOS = [
  'Identificación',
  'Datos Personales',
  'Datos previsionales',
  'Trabajo',
  'Validación Final',
] as const

export const CANDIDATO_ENCONTRADO = {
  nombre: 'Luis Torres',
  nacionalidad: 'Peruano',
  dni: '7142123456',
  correo: 'correodeluisito@gmail.com',
  numero: '999 999 999',
  estado: 'Seleccionado para alta',
} as const

export const CANDIDATOS = [
  { nombre: 'Luis Torres', nacionalidad: 'Peruano', dni: '7142123456', telefono: '999 999 99', correo: 'correodeluisito@gmail.com' },
  { nombre: 'Luis Torres', nacionalidad: 'Peruano', dni: '7142123456', telefono: '999 999 99', correo: 'correodeluisito@gmail.com' },
  { nombre: 'Luis Torres', nacionalidad: 'Peruano', dni: '7142123456', telefono: '999 999 99', correo: 'correodeluisito@gmail.com' },
  { nombre: 'Luis Torres', nacionalidad: 'Peruano', dni: '7142123456', telefono: '999 999 99', correo: 'correodeluisito@gmail.com' },
] as const

export const REQUERIMIENTO = {
  referencia: 'RQ-0222 | Operario de Almacén',
  puesto: 'Operario de Almacén',
  area: 'Operaciones',
  sede: 'Lima- Sede Principal',
  codigo: 'RQ - 0222',
  puestoDetalle: 'Operario de Almacén',
  sedeDetalle: 'Lima - Sede Principal',
} as const

export const TIPOS_INGRESO = [
  { titulo: 'Reclutamiento', descripcion: 'Candidato proveniente de un proceso de selección' },
  { titulo: 'Contrato por vencer', descripcion: 'Renovación o nuevo contrato por vencer.' },
  { titulo: 'Retiro', descripcion: 'Reingreso de colaborador anterior' },
  { titulo: 'Otro', descripcion: 'Ingreso manual o por otro motivo.' },
] as const
