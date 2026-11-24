export type TipoEvento = 'vacaciones' | 'licencia' | 'permisos' | 'ausencias'

export interface EventoCalendario {
  readonly tipo: TipoEvento
  readonly texto: string
}

export interface DiaCalendario {
  readonly numero: number
  readonly otroMes?: boolean
  readonly seleccionado?: boolean
  readonly extra?: string
  readonly compacto?: boolean
  readonly eventos?: readonly EventoCalendario[]
}

export const TABS_CALENDARIO = [
  { etiqueta: 'Vacaciones', icono: 'home', ancho: 304, separacion: 16 },
  { etiqueta: 'Licencias y Ausencias', icono: 'edit_document', ancho: 394, separacion: 12 },
  { etiqueta: 'Permisos', icono: 'work', ancho: 304, separacion: 9 },
  { etiqueta: 'Calendario', icono: 'person', ancho: 304, separacion: 0 },
] as const

export const FILTROS_CALENDARIO = [
  { etiqueta: 'Empresa', valor: 'Todos' },
  { etiqueta: 'Área / Subárea', valor: 'Todos' },
  { etiqueta: 'Tipo de Evento', valor: 'Todos' },
  { etiqueta: 'Estado', valor: 'Todos' },
] as const

export const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab', 'Dom'] as const

export const SEMANAS: readonly (readonly DiaCalendario[])[] = [
  [
    { numero: 27, otroMes: true },
    { numero: 28, otroMes: true },
    { numero: 29, otroMes: true },
    { numero: 30, otroMes: true },
    { numero: 31, otroMes: true },
    { numero: 1 },
    { numero: 2 },
  ],
  [
    {
      numero: 3,
      compacto: true,
      extra: '+5',
      eventos: [
        { tipo: 'licencia', texto: 'Rodrigo Ay...(1/1)' },
        { tipo: 'vacaciones', texto: 'Rodrigo Ay...(1/1)' },
      ],
    },
    { numero: 4 },
    { numero: 5 },
    { numero: 6, eventos: [{ tipo: 'licencia', texto: 'Rodrigo Ay...(1/1)' }] },
    { numero: 7 },
    { numero: 8 },
    { numero: 9 },
  ],
  [
    { numero: 10 },
    { numero: 11 },
    { numero: 12 },
    { numero: 13 },
    { numero: 14 },
    { numero: 15 },
    { numero: 16 },
  ],
  [
    { numero: 17 },
    { numero: 18 },
    { numero: 19 },
    {
      numero: 20,
      seleccionado: true,
      eventos: [{ tipo: 'vacaciones', texto: 'Luis Torres (1/5)' }],
    },
    { numero: 21, eventos: [{ tipo: 'vacaciones', texto: 'Luis Torres (2/5)' }] },
    { numero: 22, eventos: [{ tipo: 'vacaciones', texto: 'Luis Torres (3/5)' }] },
    { numero: 23 },
  ],
  [
    { numero: 24, eventos: [{ tipo: 'vacaciones', texto: 'Luis Torres (4/5)' }] },
    { numero: 25, eventos: [{ tipo: 'vacaciones', texto: 'Luis Torres (5/5)' }] },
    { numero: 26 },
    { numero: 27, eventos: [{ tipo: 'licencia', texto: 'Karem Lopez (1/5)' }] },
    { numero: 28, eventos: [{ tipo: 'licencia', texto: 'Karem Lopez (2/5)' }] },
    { numero: 29, eventos: [{ tipo: 'licencia', texto: 'Karem Lopez (3/5)' }] },
    { numero: 30 },
  ],
]

export const LEYENDA = [
  { tipo: 'vacaciones', etiqueta: 'Vacaciones' },
  { tipo: 'licencia', etiqueta: 'Licencia' },
  { tipo: 'permisos', etiqueta: 'Permisos' },
  { tipo: 'ausencias', etiqueta: 'Ausencias' },
] as const

export const ICONO_EVENTO: Record<TipoEvento, string> = {
  vacaciones: 'beach_access',
  licencia: 'menu_book',
  permisos: 'work',
  ausencias: 'edit_document',
}

export const DETALLE_DIA = {
  titulo: 'Viernes, 20 de noviembre',
  tipo: 'vacaciones' as TipoEvento,
  etiqueta: 'Vacaciones',
  estado: 'En goce',
  nombre: 'Luis Torres',
  periodo: '20/11/2026 - 25/11 / 2026 ( 5 días)',
  area: 'Operaciones / Almacén',
}

export const RESUMEN_PERIODO = [
  { tipo: 'vacaciones', etiqueta: 'Vacaciones', valor: '12' },
  { tipo: 'licencia', etiqueta: 'Licencia', valor: '6' },
  { tipo: 'permisos', etiqueta: 'Permisos', valor: '8' },
  { tipo: 'ausencias', etiqueta: 'Ausencias', valor: '' },
] as const
