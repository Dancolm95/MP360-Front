export interface FiltroOnboarding {
  readonly etiqueta: string
  readonly valor: string
}

export interface IndicadorOnboarding {
  readonly etiqueta: string
  readonly valor: string
}

export interface FilaOnboarding {
  readonly candidato: string
  readonly idProceso: string
  readonly documento: string
  readonly documentoNumero: string
  readonly email: string
  readonly cargo: string
  readonly area: string
  readonly sede: string
  readonly inicio: string
  readonly estado: string
}

export const FILTROS_ONBOARDING: readonly FiltroOnboarding[] = [
  { etiqueta: 'Estado', valor: 'Todos' },
  { etiqueta: 'Puesto', valor: 'Todos' },
  { etiqueta: 'Tipo de personal', valor: 'Todos' },
  { etiqueta: 'Cargo', valor: 'Todos' },
]

export const INDICADORES_ONBOARDING: readonly IndicadorOnboarding[] = [
  { etiqueta: 'Sin encargado', valor: '0' },
  { etiqueta: 'Sin Responsabless', valor: '0' },
  { etiqueta: 'Procesos a Tiempo', valor: '0' },
  { etiqueta: 'Procesos atrasados', valor: '0' },
]

export const FILAS_ONBOARDING: readonly FilaOnboarding[] = [
  {
    candidato: 'Luis Torres Caycho',
    idProceso: 'COL-00125',
    documento: 'DNI',
    documentoNumero: '711234567',
    email: 'correodeluis@gmail.com',
    cargo: 'Operativo',
    area: 'Operativo',
    sede: 'Callao',
    inicio: '12 / 09 / 2026',
    estado: 'Activo',
  },
]

export const PAGINAS_ONBOARDING = [1, 2, 3, 4, 5, 6] as const
