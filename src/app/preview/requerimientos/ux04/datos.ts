export type TipoValor = 'texto' | 'empresa' | 'fecha'

export interface CeldaResumen {
  readonly etiqueta: string
  readonly valor: string
  readonly tipo?: TipoValor
  readonly primera?: boolean
}

export const RESUMEN: readonly CeldaResumen[] = [
  { etiqueta: 'Puesto solicitado', valor: 'Operario de Almacén', primera: true },
  { etiqueta: 'Empresa', valor: 'Honda', tipo: 'empresa' },
  { etiqueta: 'Motivo', valor: 'Reemplazo' },
  { etiqueta: 'Vacantes solicitadas', valor: '4' },
  { etiqueta: 'Cubiertas', valor: '2' },
  { etiqueta: 'Pendientes', valor: '2' },
  { etiqueta: 'Departamento', valor: 'Operaciones', primera: true },
  { etiqueta: 'Área / Subárea', valor: 'Almacén' },
  { etiqueta: 'Ubicación', valor: 'Callao / Callao' },
  { etiqueta: 'Solicitante', valor: 'Francisco Schenone' },
  { etiqueta: 'Fecha Objetivo', valor: '15/09/2026', tipo: 'fecha' },
  { etiqueta: 'Remuneración mensual', valor: 's/ 1,800' },
]

export const FILTROS_POSTULANTES = [
  'Estado',
  'Puesto',
  'Tipo de personal',
  'Responsable',
] as const

export type EstadoCandidato =
  | 'Preseleccionado'
  | 'Seleccionado'
  | 'Finalista'
  | 'Contratado'

export interface Candidato {
  readonly nombre: string
  readonly nacionalidad: string
  readonly documento: string
  readonly puesto: string
  readonly aptitud: string
  readonly estado: EstadoCandidato
  readonly actualizado: string
  readonly requerimiento: string
}

export const CANDIDATOS: readonly Candidato[] = [
  {
    nombre: 'Luis Torres',
    nacionalidad: 'Peruano',
    documento: '711234567',
    puesto: 'Operario de Almacén',
    aptitud: 'Operativo',
    estado: 'Preseleccionado',
    actualizado: '12/09/2026 10:30',
    requerimiento: 'RQ-0221',
  },
  {
    nombre: 'Jaime Castillo',
    nacionalidad: 'Extranjero',
    documento: '711234567',
    puesto: 'Operario de Almacén',
    aptitud: 'Operativo',
    estado: 'Seleccionado',
    actualizado: '12/09/2026 10:30',
    requerimiento: 'RQ-0221',
  },
  {
    nombre: 'Emilia Castellanos',
    nacionalidad: 'Peruano',
    documento: '711234567',
    puesto: 'Operario de Almacén',
    aptitud: 'Operativo',
    estado: 'Finalista',
    actualizado: '12/09/2026 10:30',
    requerimiento: 'RQ-0221',
  },
  {
    nombre: 'Diego Fiestas',
    nacionalidad: 'Extranjero',
    documento: '711234567',
    puesto: 'Operario de Almacén',
    aptitud: 'Operativo',
    estado: 'Contratado',
    actualizado: '12/09/2026 10:30',
    requerimiento: 'RQ-0221',
  },
]
