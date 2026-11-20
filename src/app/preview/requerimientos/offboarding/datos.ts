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

export const PASOS_OFFBOARDING = [
  'Datos y Causal',
  'Checklist de salida',
  'Revisiones por áreas',
  'Liquidación',
  'Cierre',
] as const

export interface ColaboradorOffboarding {
  readonly nombre: string
  readonly nacionalidad: string
  readonly documento: string
  readonly telefono: string
  readonly correo: string
}

export const COLABORADOR_SELECCIONADO: ColaboradorOffboarding = {
  nombre: 'Luis Torres',
  nacionalidad: 'Nac: Peruano',
  documento: 'DNI: 7142123456',
  telefono: '999 999 999',
  correo: 'correodeluisito@gmail.com',
}

const COLABORADOR_ENCONTRADO: ColaboradorOffboarding = {
  nombre: 'Luis Torres',
  nacionalidad: 'Nac: Peruano',
  documento: 'DNI: 7142123456',
  telefono: '999 999 99',
  correo: 'correodeluisito@gmail.com',
}

export const COLABORADORES_ENCONTRADOS: readonly ColaboradorOffboarding[] = [
  COLABORADOR_ENCONTRADO,
  COLABORADOR_ENCONTRADO,
  COLABORADOR_ENCONTRADO,
  COLABORADOR_ENCONTRADO,
]

export interface DatoResumenOffboarding {
  readonly etiqueta: string
  readonly valor: string
  readonly tono?: 'azul'
}

export const RESUMEN_OFFBOARDING: readonly DatoResumenOffboarding[] = [
  { etiqueta: 'Estado del proceso', valor: 'En proceso', tono: 'azul' },
  { etiqueta: 'Checklist', valor: '0/8' },
  { etiqueta: 'Áreas', valor: '0/4' },
  { etiqueta: 'Liquidicación', valor: 'Pendiente' },
]

export const CESE_PROGRAMADO_OFFBOARDING = 'Cese Programado : 20/10/2026'
export const CAUSAL_OFFBOARDING = 'Renuncia voluntaria'
export const FECHA_CESE_OFFBOARDING = '20/10/2026'
export const MOTIVO_OFFBOARDING = 'Renuncia por motivos personales'
export const CONTADOR_MOTIVO_OFFBOARDING = '32/200'
