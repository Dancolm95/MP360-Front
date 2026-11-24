export interface ColaboradorBandeja {
  readonly nombre: string
  readonly cargo: string
  readonly codigo: string
  readonly dni: string
  readonly puesto: string
  readonly gerencia: string
  readonly area: string
  readonly sede: string
  readonly fechaIngreso: string
  readonly sueldo: string
  readonly estado: 'Activo'
}

export const FILTROS_COLABORADORES = [
  { etiqueta: 'Estado', valor: 'Todos' },
  { etiqueta: 'Puesto', valor: 'Todos' },
  { etiqueta: 'Tipo de personal', valor: 'Todos' },
  { etiqueta: 'Nacionalidad', valor: 'Todos' },
] as const

export const COLABORADORES: readonly ColaboradorBandeja[] = Array.from(
  { length: 6 },
  () => ({
    nombre: 'Luis Torres',
    cargo: 'Auxiliar de Almacén',
    codigo: 'COL-00125',
    dni: '711234567',
    puesto: 'Operario\nde Almacén',
    gerencia: 'Operativo',
    area: 'Operativo',
    sede: 'Operativo',
    fechaIngreso: '12/09/2026',
    sueldo: 's/1,025.00',
    estado: 'Activo' as const,
  }),
)

export const PAGINAS = [1, 2, 3, 4, 5, 6] as const
