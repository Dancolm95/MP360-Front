export type TonoEstadoEpp = 'verde' | 'gris' | 'ambar' | 'rojo'
export type TonoEstadistica = 'azul' | 'verde' | 'ambar' | 'rojo'
export type IconoEstadistica = 'caja' | 'persona' | 'alerta' | 'triangulo'

export interface FilaEpp {
  readonly colaborador: string
  readonly cargo: string
  readonly implemento: string
  readonly categoria: string
  readonly talla: string
  readonly cantidad: number
  readonly fechaEntrega: string
  readonly responsable: string
  readonly estado: string
  readonly tono: TonoEstadoEpp
}

export const FILTROS_EPP = [
  { etiqueta: 'Tipo de Personal', valor: 'Todos' },
  { etiqueta: 'Cargo', valor: 'Todos' },
  { etiqueta: 'Estado', valor: 'Todos' },
  { etiqueta: 'Implemento', valor: 'Todos' },
] as const

export const ESTADISTICAS_EPP = [
  {
    etiqueta: 'Entregas recientes',
    valor: '24',
    nota: 'Últimos 30 días',
    icono: 'caja',
    tono: 'azul',
  },
  {
    etiqueta: 'Asignados',
    valor: '186',
    nota: 'Total de Implementos',
    icono: 'persona',
    tono: 'verde',
  },
  {
    etiqueta: 'Por reponer',
    valor: '8',
    nota: 'Stock Minimo',
    icono: 'alerta',
    tono: 'ambar',
  },
  {
    etiqueta: 'Con incidencias',
    valor: '3',
    nota: 'Dañados o perdidos',
    icono: 'triangulo',
    tono: 'rojo',
  },
] as const

export const FILAS_EPP: readonly FilaEpp[] = [
  {
    colaborador: 'Luis Torres',
    cargo: 'Auxiliar de Almacén',
    implemento: 'Casco de Seguridad',
    categoria: 'EPP',
    talla: 'ÚNICA',
    cantidad: 1,
    fechaEntrega: '27 /10 /2026',
    responsable: 'Jesús Vargas',
    estado: 'Asignado',
    tono: 'verde',
  },
  {
    colaborador: 'Karem Lopez',
    cargo: 'Auxiliar de Almacén',
    implemento: 'Chaleco',
    categoria: 'Uniforme',
    talla: 'L',
    cantidad: 2,
    fechaEntrega: '15 /10 /2026',
    responsable: 'Raquel Ávila',
    estado: 'Devuelto',
    tono: 'gris',
  },
  {
    colaborador: 'Rodrigo Ayala',
    cargo: 'Auxiliar de Almacén',
    implemento: 'Botas de Seguridad',
    categoria: 'EPP',
    talla: '42',
    cantidad: 1,
    fechaEntrega: '13/10/2026',
    responsable: 'Jesús Vargas',
    estado: 'Dañado',
    tono: 'ambar',
  },
  {
    colaborador: 'Rodrigo Díaz',
    cargo: 'Auxiliar de Almacén',
    implemento: 'Guantes Anticorte',
    categoria: 'EPP',
    talla: 'L',
    cantidad: 2,
    fechaEntrega: '10/10 /2026',
    responsable: 'Raquel Ávila',
    estado: 'Dañado',
    tono: 'rojo',
  },
  {
    colaborador: 'Luis Torres',
    cargo: 'Auxiliar de Almacén',
    implemento: 'Casco de Seguridad',
    categoria: 'EPP',
    talla: 'ÚNICA',
    cantidad: 1,
    fechaEntrega: '27/10/2026',
    responsable: 'Jesús Vargas',
    estado: 'Asignado',
    tono: 'verde',
  },
  {
    colaborador: 'Karem Lopez',
    cargo: 'Auxiliar de Almacén',
    implemento: 'Chaleco',
    categoria: 'Uniforme',
    talla: 'L',
    cantidad: 2,
    fechaEntrega: '15/10 /2026',
    responsable: 'Raquel Ávila',
    estado: 'Devuelto',
    tono: 'gris',
  },
]

export const PAGINAS_EPP = [1, 2, 3, 4, 5, 6] as const
