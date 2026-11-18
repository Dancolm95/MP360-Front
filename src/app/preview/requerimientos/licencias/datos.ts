export type Goce = 'Goce' | 'Sin Goce'
export type EstadoSolicitud = 'Subsanación' | 'Aprobada' | 'Registrada' | 'Rechazada'

export interface FilaLicencia {
  readonly colaborador: string
  readonly cargo: string
  readonly tipo: string
  readonly fechaInicio: string
  readonly fechaTermino: string
  readonly duracion: string
  readonly goce: Goce
  readonly estado: EstadoSolicitud
  readonly impacto: string
  readonly sustento: string | null
}

export const FILAS_LICENCIAS: readonly FilaLicencia[] = [
  {
    colaborador: 'Luis Torres',
    cargo: 'Auxiliar de Almacén',
    tipo: 'Vacaciones',
    fechaInicio: '03 /11 /2026',
    fechaTermino: '07 /11/2026',
    duracion: '5 días',
    goce: 'Goce',
    estado: 'Subsanación',
    impacto: 'Dpt. Adminstración',
    sustento: 'Constancia de trabajo',
  },
  {
    colaborador: 'Karem Lopez',
    cargo: 'Auxiliar de Almacén',
    tipo: 'Licencia por maternidad',
    fechaInicio: '03 /11 /2026',
    fechaTermino: '07 /11/2026',
    duracion: '5 días',
    goce: 'Sin Goce',
    estado: 'Aprobada',
    impacto: 'Sin impacto',
    sustento: null,
  },
  {
    colaborador: 'Rodrigo Ayala',
    cargo: 'Auxiliar de Almacén',
    tipo: 'Descanso médico',
    fechaInicio: '03 /11 /2026',
    fechaTermino: '07 /11/2026',
    duracion: '5 días',
    goce: 'Goce',
    estado: 'Registrada',
    impacto: 'Sin impacto',
    sustento: 'Certificado Médico',
  },
  {
    colaborador: 'Luis Torres',
    cargo: 'Auxiliar de Almacén',
    tipo: 'Vacaciones',
    fechaInicio: '03 /11 /2026',
    fechaTermino: '07 /11/2026',
    duracion: '5 días',
    goce: 'Goce',
    estado: 'Rechazada',
    impacto: 'Dpt. Adminstración',
    sustento: 'Constancia de trabajo',
  },
  {
    colaborador: 'Karem Lopez',
    cargo: 'Auxiliar de Almacén',
    tipo: 'Licencia por maternidad',
    fechaInicio: '03 /11 /2026',
    fechaTermino: '07 /11/2026',
    duracion: '5 días',
    goce: 'Sin Goce',
    estado: 'Registrada',
    impacto: 'Sin impacto',
    sustento: null,
  },
]

export const TABS_LICENCIAS = [
  { etiqueta: 'Vacaciones', icono: 'home', ancho: 249 },
  { etiqueta: 'Licencias y Ausencias', icono: 'edit_document', ancho: 322 },
  { etiqueta: 'Permisos', icono: 'work', ancho: 248 },
  { etiqueta: 'Calendario', icono: 'person', ancho: 249 },
] as const

export const FILTROS_LICENCIAS = [
  { etiqueta: 'Tipo', valor: 'Todos' },
  { etiqueta: 'Goce', valor: 'Todos' },
  { etiqueta: 'Estado', valor: 'Todos' },
  { etiqueta: 'Área', valor: 'Todos' },
] as const

export const ESTADISTICAS = [
  {
    etiqueta: 'Solicitudes del mes',
    valor: '42',
    nota: 'Ultimos 30 dias',
    icono: 'inventory',
    tono: 'azul',
  },
  {
    etiqueta: 'Pendientes de revisión',
    valor: '8',
    icono: 'error',
    tono: 'ambar',
  },
  {
    etiqueta: 'En Subsanación',
    valor: '8',
    icono: 'warning',
    tono: 'rojo',
  },
  {
    etiqueta: 'Aprobadas / Registrada',
    valor: '3',
    icono: 'check',
    tono: 'verde',
  },
] as const

export const PAGINAS = [1, 2, 3, 4, 5, 6] as const
