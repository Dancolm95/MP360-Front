export interface CandidatoBandeja {
  readonly nombre: string
  readonly nacionalidad: string
  readonly documento: string
  readonly puesto: string
  readonly aptitud: string
  readonly estado: 'Preseleccionado' | 'Seleccionado' | 'Finalista' | 'Contratado'
  readonly actualizacion: string
  readonly requerimiento: string
}

export const FILTROS_CANDIDATOS = [
  { etiqueta: 'Estado', valor: 'Todos' },
  { etiqueta: 'Puesto', valor: 'Todos' },
  { etiqueta: 'Tipo de personal', valor: 'Todos' },
  { etiqueta: 'Nacionalidad', valor: 'Todos' },
] as const

export const CANDIDATOS: readonly CandidatoBandeja[] = [
  {
    nombre: 'Luis Torres',
    nacionalidad: 'Nac: Peruano',
    documento: '711234567',
    puesto: 'Operario de Almacén',
    aptitud: 'Operativo',
    estado: 'Preseleccionado',
    actualizacion: '12 / 09 / 2026 10:30',
    requerimiento: 'RQ-0221',
  },
  {
    nombre: 'Jaime Castillo',
    nacionalidad: 'Nac: Extranjero',
    documento: '711234567',
    puesto: 'Operario de Almacén',
    aptitud: 'Operativo',
    estado: 'Seleccionado',
    actualizacion: '12 / 09 / 2026 10:30',
    requerimiento: 'RQ-0222',
  },
  {
    nombre: 'Emilia Castellano',
    nacionalidad: 'Nac: Peruano',
    documento: '711234567',
    puesto: 'Operario de Almacén',
    aptitud: 'Operativo',
    estado: 'Finalista',
    actualizacion: '12 / 09 / 2026 10:30',
    requerimiento: 'RQ-0221',
  },
  {
    nombre: 'Diego Fiestas',
    nacionalidad: 'Nac: Extranjero',
    documento: '711234567',
    puesto: 'Operario de Almacén',
    aptitud: 'Operativo',
    estado: 'Contratado',
    actualizacion: '12 / 09 / 2026 10:30',
    requerimiento: 'RQ-0221',
  },
  {
    nombre: 'Javier Perez',
    nacionalidad: 'Nac: Peruano',
    documento: '711234567',
    puesto: 'Operario de Almacén',
    aptitud: 'Operativo',
    estado: 'Contratado',
    actualizacion: '12 / 09 / 2026 10:30',
    requerimiento: 'RQ-0223',
  },
]
