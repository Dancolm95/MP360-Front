export interface FilaBandeja {
  readonly id: string
  readonly fecha: string
  readonly motivo: string
  readonly empresa: string
  readonly puesto: string
  readonly vacantes: number
  readonly pendientes: number
  readonly estado: 'Reclutando' | 'Pendiente de Aprobación' | 'Urgente' | 'Cubierto'
  readonly fechaObjetivo: string
  readonly fechaConAlerta?: boolean
  readonly solicitante: string
}

export const FILTROS = [
  { etiqueta: 'Estado', valor: 'Todos' },
  { etiqueta: 'Motivo', valor: 'Todos' },
  { etiqueta: 'Empresa', valor: 'Todos' },
  { etiqueta: 'Área / Subárea', valor: 'Todos' },
  { etiqueta: 'Puesto', valor: 'Todos' },
  { etiqueta: 'Solicitante', valor: 'Todos' },
] as const

export const FILAS: readonly FilaBandeja[] = [
  {
    id: 'RQ-0221',
    fecha: '12/09/2026',
    motivo: 'Reemplazo',
    empresa: 'Honda',
    puesto: 'Operario de\nAlmacén',
    vacantes: 4,
    pendientes: 2,
    estado: 'Reclutando',
    fechaObjetivo: '15/09/2026',
    fechaConAlerta: true,
    solicitante: 'Francisco\nSchenone',
  },
  {
    id: 'RQ-0220',
    fecha: '12/09/2026',
    motivo: 'Nuevo\nProyecto',
    empresa: 'DSV',
    puesto: 'Asistente de\nOperaciones',
    vacantes: 1,
    pendientes: 1,
    estado: 'Pendiente de Aprobación',
    fechaObjetivo: '14/09/2026',
    solicitante: 'Mirella Lazo',
  },
  {
    id: 'RQ-0219',
    fecha: '12/09/2026',
    motivo: 'Ampliación',
    empresa: 'Integra Retail',
    puesto: 'Supervisor\nde Transporte',
    vacantes: 1,
    pendientes: 1,
    estado: 'Urgente',
    fechaObjetivo: '13/09/2026',
    solicitante: 'Mirella Lazo',
  },
  {
    id: 'RQ-0218',
    fecha: '12/09/2026',
    motivo: 'Nuevo\nColaborador',
    empresa: 'DSV',
    puesto: 'Analista de\nInventarios',
    vacantes: 1,
    pendientes: 0,
    estado: 'Cubierto',
    fechaObjetivo: '12/09/2026',
    solicitante: 'Francisco\nSchenone',
  },
  {
    id: 'RQ-0217',
    fecha: '12/09/2026',
    motivo: 'Reemplazo',
    empresa: 'Honda',
    puesto: 'Jefe\nde Turno',
    vacantes: 1,
    pendientes: 0,
    estado: 'Cubierto',
    fechaObjetivo: '12/09/2026',
    solicitante: 'Jesús Vargas',
  },
]

export const NAVEGACION = [
  { etiqueta: 'Inicio', icono: 'home', dosLineas: false, ancho: 106 },
  { etiqueta: 'Requerimientos', icono: 'description', dosLineas: false, ancho: 176 },
  { etiqueta: 'Reclutamiento', icono: 'work', dosLineas: false, ancho: 170 },
  { etiqueta: 'Colaboradores', icono: 'group', dosLineas: false, ancho: 165 },
  { etiqueta: 'Onboarding', icono: 'fact_check', dosLineas: false, ancho: 148 },
  { etiqueta: 'EPP y Equipos', icono: 'verified_user', dosLineas: false, ancho: 207 },
  { etiqueta: 'Asistencia', icono: 'schedule', dosLineas: false, ancho: 166 },
  { etiqueta: 'Offboarding', icono: 'badge', dosLineas: false, ancho: 150 },
  { etiqueta: 'Organización y Dotación', icono: 'account_tree', dosLineas: true, ancho: 168 },
  { etiqueta: 'Gestión Documental', icono: 'description', dosLineas: true, ancho: 131 },
] as const

export const ACCIONES_RAPIDAS = [
  'Nuevo Reclutamiento',
  'Contratos por Vencer',
  'Retirar Colaborador',
  'Contratos por Vencer',
] as const

export const MIS_ACCESOS = [
  'Boletas de Pago',
  'Documentos',
  'Solicitar Permiso',
  'Beneficios',
] as const

export const COLABORADORES_PANEL = [
  { nombre: 'Mirella Lazo', fecha: '10 agosto', foto: 'mirella.jpg' },
  { nombre: 'Francisco Schen...', fecha: '15 agosto', foto: 'francisco.jpg' },
] as const
