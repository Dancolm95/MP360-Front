export interface FiltroOffboarding {
  readonly etiqueta: string
  readonly valor: string
}

export interface IndicadorOffboarding {
  readonly etiqueta: string
  readonly valor: string
}

export type EstadoOffboarding = 'Cerrado' | 'Pendiente' | 'En proceso'

export interface FilaOffboarding {
  readonly candidato: string
  readonly idProceso: string
  readonly causal: string
  readonly fechaCese: string
  readonly empresa: string
  readonly area: string
  readonly responsable: string
  readonly estado: EstadoOffboarding
}

export const FILTROS_OFFBOARDING: readonly FiltroOffboarding[] = [
  { etiqueta: 'Estado', valor: 'Todos' },
  { etiqueta: 'Casual de cese', valor: 'Todos' },
  { etiqueta: 'Empresa', valor: 'Todos' },
  { etiqueta: 'Cargo', valor: 'Todos' },
]

export const INDICADORES_OFFBOARDING: readonly IndicadorOffboarding[] = [
  { etiqueta: 'En proceso', valor: '18' },
  { etiqueta: 'Pendiente de regularización', valor: '5' },
  { etiqueta: 'A cerrar (3 días)', valor: '3' },
  { etiqueta: 'Cerrados (este mes)', valor: '12' },
]

export const FILAS_OFFBOARDING: readonly FilaOffboarding[] = [
  {
    candidato: 'Luis Torres Caycho',
    idProceso: 'offL-00125',
    causal: 'Renuncia voluntaria',
    fechaCese: '21/10/2026',
    empresa: 'Honda',
    area: 'Callao',
    responsable: 'Mirella Lazo',
    estado: 'Cerrado',
  },
  {
    candidato: 'Luis Torres Caycho',
    idProceso: 'offL-00125',
    causal: 'Renuncia voluntaria',
    fechaCese: '21/10/2026',
    empresa: 'Honda',
    area: 'Callao',
    responsable: 'Mirella Lazo',
    estado: 'Pendiente',
  },
  {
    candidato: 'Luis Torres Caycho',
    idProceso: 'offL-00125',
    causal: 'Renuncia voluntaria',
    fechaCese: '21/10/2026',
    empresa: 'Honda',
    area: 'Callao',
    responsable: 'Mirella Lazo',
    estado: 'En proceso',
  },
]

export const PAGINAS_OFFBOARDING = [1, 2, 3, 4, 5, 6] as const
