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

export interface ColaboradorRegistro {
  readonly nombre: string
  readonly cargo: string
  readonly dni: string
}

export const COLABORADOR_ENCONTRADO = {
  nombre: 'Luis Torres',
  nacionalidad: 'Peruano',
  dni: '7142123456',
  correo: 'correodeluisito@gmail.com',
  numero: '999 999 999',
} as const

export const COLABORADORES_REGISTRO: readonly ColaboradorRegistro[] = [
  { nombre: 'Luis Torres', cargo: 'Operario de Almacén', dni: '7142123456' },
  { nombre: 'Luis Torres', cargo: 'Operario de Almacén', dni: '7142123456' },
  { nombre: 'Luis Torres', cargo: 'Operario de Almacén', dni: '7142123456' },
  { nombre: 'Luis Torres', cargo: 'Operario de Almacén', dni: '7142123456' },
]

export const PASOS_REGISTRO = [
  'Tipo de Solicitud',
  'Información General',
  'Sustento Documental',
  'Confirmación',
] as const

export const TIPOS_SOLICITUD = [
  {
    titulo: 'Licencia con Goce',
    descripcion: 'Vacaciones, licencia médica, maternidad, entre otros.',
  },
  { titulo: 'Licencia sin goce', descripcion: 'Por motivos personales.' },
  { titulo: 'Ausencia', descripcion: 'Justificada o injustificada.' },
  {
    titulo: 'Permiso por horas',
    descripcion: 'Permiso personal, citas médicas, asuntos particulares.',
  },
] as const

export const SUSTENTOS = [
  { archivo: 'Solicitud_Vacaciones.pdf', peso: '300KB', tipo: 'pdf' },
  { archivo: 'itinerario_viaje.png', peso: '1.2MB', tipo: 'png' },
] as const

export const DETALLE_LICENCIA = {
  colaborador: 'Luis Torres',
  dni: '7142123456',
  cargo: 'Operario de Almacén',
  tipoSolicitud: 'Licencia Médica',
  periodo: '19/10/2026 - 21/10/2026',
  duracion: '3 días',
  fechaRegistro: '15/10/2026',
  responsable: 'Ricardo Cisterna',
  motivo: 'Secundaria Completa',
  periodoDetalle: '19 /10 /2026 - 21/10/2026',
  comentario: 'Presento descanso médico por cuadro de gastritis.',
  diasAusencia: '7 DÍAS',
  impactoPlanilla: 'Sin Descuento',
  observaciones:
    'Las vacaciones fueron consultadas personalmente con el encargado del almacén previamente.',
  notificacion: 'Notificada',
  destinatarios: 'RR.HH, jefatura directa, planillas',
  aviso: 'La licencia abarca 7 días calendaria del 20 al 24 de noviembre del 2026',
  tipoPermiso: 'Requerimiento aprobado',
  estadoActual: 'En Subsanación',
  diasSolicitados: '3 DÍAS',
  diasAprobados: '3 DÍAS',
  saldoLicencias: '12 días',
} as const

export const CAMPOS_DETALLE = [
  { etiqueta: 'Tipo de Solicitud', valor: DETALLE_LICENCIA.tipoSolicitud },
  { etiqueta: 'Periodo de Licencia', valor: DETALLE_LICENCIA.periodo },
  { etiqueta: 'Duración', valor: DETALLE_LICENCIA.duracion },
  { etiqueta: 'Fecha de Registro', valor: DETALLE_LICENCIA.fechaRegistro },
  { etiqueta: 'Responsable de revisión', valor: DETALLE_LICENCIA.responsable },
] as const

export const PASOS_DETALLE = [
  { etiqueta: 'Registro', fecha: '19/10/2026', estado: 'completado' },
  { etiqueta: 'En revisión', fecha: '19/10/2026', estado: 'actual' },
  { etiqueta: 'Subsanación', fecha: null, estado: 'pendiente' },
  { etiqueta: 'Aprobada', fecha: null, estado: 'pendiente' },
] as const

export const DOCUMENTOS_DETALLE = [
  { archivo: 'Sustento Médico_2026.pdf', formato: 'PDF', peso: '425KB', tipo: 'pdf' },
  { archivo: 'Sustento Médico_2026.png', formato: 'PDF', peso: '1MB', tipo: 'png' },
] as const

export const RESUMEN_DETALLE = [
  { etiqueta: 'Tipo de Permiso', valor: DETALLE_LICENCIA.tipoPermiso, tono: null },
  { etiqueta: 'Estado actual', valor: DETALLE_LICENCIA.estadoActual, tono: 'azul' },
  { etiqueta: 'Días solicitados', valor: DETALLE_LICENCIA.diasSolicitados, tono: null },
  { etiqueta: 'Días Aprobados', valor: DETALLE_LICENCIA.diasAprobados, tono: null },
  { etiqueta: 'Saldo de licencias (año)', valor: DETALLE_LICENCIA.saldoLicencias, tono: null },
] as const
