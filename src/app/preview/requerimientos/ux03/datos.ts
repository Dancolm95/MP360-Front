// Los rótulos se replican literales del diseño aprobado, incluidas sus erratas.
export type TipoCampo = 'select' | 'numero' | 'fecha'

export interface CampoRequerimiento {
  readonly etiqueta: string
  readonly marcador: string
  readonly obligatorio: boolean
  readonly tipo: TipoCampo
  readonly icono?: string
}

export const CAMPOS: readonly CampoRequerimiento[] = [
  {
    etiqueta: 'Motivo',
    marcador: 'Seleccionar motivo',
    obligatorio: true,
    tipo: 'select',
  },
  {
    etiqueta: 'Empresa',
    marcador: 'Seleccionar empresa',
    obligatorio: true,
    tipo: 'select',
  },
  {
    etiqueta: 'Departamento',
    marcador: 'Seleccionar departamento',
    obligatorio: true,
    tipo: 'select',
  },
  {
    etiqueta: 'Área / Subárea',
    marcador: 'Selecionar',
    obligatorio: true,
    tipo: 'select',
  },
  {
    etiqueta: 'Puesto solicitado',
    marcador: 'Seleccionar puesto',
    obligatorio: true,
    tipo: 'select',
  },
  {
    etiqueta: 'Cant. de vacantes',
    marcador: '1',
    obligatorio: true,
    tipo: 'numero',
  },
  {
    etiqueta: 'Colaborador a reemplazar',
    marcador: 'Seleccionar colaborador',
    obligatorio: false,
    tipo: 'select',
  },
  {
    etiqueta: 'Remuneración mensual (S/)',
    marcador: '0.00',
    obligatorio: true,
    tipo: 'numero',
  },
  {
    etiqueta: 'Fecha objetivo',
    marcador: 'dd/mm/aaaa',
    obligatorio: true,
    tipo: 'fecha',
    icono: 'calendar_today',
  },
  {
    etiqueta: 'Responsable de Aprobación',
    marcador: 'Selecciona a un responsable',
    obligatorio: true,
    tipo: 'select',
  },
]

export const COMENTARIO = {
  etiqueta: 'Comentario',
  marcador: 'Añade información sobre el requerimiento...',
} as const

export const PASOS = ['Datos del requerimiento', 'Revisión y envío'] as const

export const CODIGO_CONFIRMACION = {
  etiqueta: 'Código de requerimiento',
  valor: 'RQ- 0222',
} as const

export interface ParResumen {
  readonly etiqueta: string
  readonly valor: string
  readonly enlace?: boolean
}

export const CONFIRMACION_IZQUIERDA: readonly ParResumen[] = [
  { etiqueta: 'Puesto Solicitado', valor: 'Operario de Almacén' },
  { etiqueta: 'Motivo', valor: 'Nuevo Colaborador' },
  { etiqueta: 'Empresa', valor: 'Honda' },
  { etiqueta: 'Remuneración mensual (S/)', valor: '1300.00' },
]

export const CONFIRMACION_DERECHA: readonly ParResumen[] = [
  { etiqueta: 'Área / Subárea', valor: 'Despacho' },
  { etiqueta: 'Cantidad de Vacantes', valor: '1' },
  { etiqueta: 'Responsable de Aprobración', valor: 'Ricardo Cisterna', enlace: true },
]

export const ESTADO_CONFIRMACION = {
  etiqueta: 'Estado Actual',
  valor: 'Pendiente de Aprobación',
} as const
