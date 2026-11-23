export interface ModuloInicio {
  readonly nombre: string
  readonly color: string
  readonly icono: string
}

export const MODULOS_INICIO: readonly ModuloInicio[] = [
  { nombre: 'Recursos Humanos', color: '#2249f2', icono: 'forum' },
  { nombre: 'Operaciones', color: '#f0963e', icono: 'settings' },
  { nombre: 'Contabilidad', color: '#5d985e', icono: 'pie_chart_filled' },
  { nombre: 'Finanzas', color: '#4911ef', icono: 'bar_chart' },
]

export interface FiltroInicio {
  readonly etiqueta: string
  readonly marcador: string
  readonly ancho: number
  readonly icono?: string
}

export const FILTROS_INICIO: readonly FiltroInicio[] = [
  { etiqueta: 'Empresa', marcador: 'Todos', ancho: 196 },
  { etiqueta: 'Periodo', marcador: 'Selecciona rango', ancho: 203, icono: 'calendar_today' },
  { etiqueta: 'Área/Subárea', marcador: 'Todas', ancho: 223 },
  { etiqueta: 'Estado', marcador: 'Todos', ancho: 224 },
  { etiqueta: 'Responsable', marcador: 'Todos', ancho: 224 },
]

export type Tono = 'ambar' | 'verde' | 'azul' | 'rojo'

export interface Indicador {
  readonly etiqueta: string
  readonly valor: string
  readonly chip: string
  readonly tono: Tono
  readonly icono: string
  readonly iconoChip: string
}

export const INDICADORES: readonly Indicador[] = [
  {
    etiqueta: 'Contratos por vencer',
    valor: '12',
    chip: '8-15 días',
    tono: 'ambar',
    icono: 'warning',
    iconoChip: 'warning',
  },
  {
    etiqueta: 'Colaboradores activos',
    valor: '248',
    chip: 'sin alertas',
    tono: 'verde',
    icono: 'trending_up',
    iconoChip: 'check_circle',
  },
  {
    etiqueta: 'Vacantes abiertas',
    valor: '18',
    chip: 'En proceso',
    tono: 'azul',
    icono: 'work',
    iconoChip: 'schedule',
  },
  {
    etiqueta: 'Cobertura por Cliente',
    valor: '92',
    chip: 'Sin alertas',
    tono: 'verde',
    icono: 'bar_chart',
    iconoChip: 'check_circle',
  },
  {
    etiqueta: 'Pendientes vencidos',
    valor: '4',
    chip: 'Crítico',
    tono: 'rojo',
    icono: 'error',
    iconoChip: 'error',
  },
]

export interface Alerta {
  readonly titulo: string
  readonly detalle: string
  readonly estado: 'Advert.' | 'Crítico'
  readonly fecha: string
  readonly responsable: string
  readonly nota: string
}

export const ALERTAS: readonly Alerta[] = [
  {
    titulo: 'Contratos por vencer',
    detalle: 'El contrato de Rodrigo Ayala vence en 10 días',
    estado: 'Advert.',
    fecha: '31/10/2026',
    responsable: 'Rodrigo Ayala',
    nota: '31 oct 2026',
  },
  {
    titulo: 'Pendientes vencidos',
    detalle: 'Cliente Honda tiene 4 requerimientos pendientes vencido',
    estado: 'Crítico',
    fecha: '20/10/2026',
    responsable: 'Cliente Honda',
    nota: '4 pendientes',
  },
  {
    titulo: 'Contratos por vencer',
    detalle: 'El contrato de Rodrigo Ayala vence en 10 días',
    estado: 'Crítico',
    fecha: '15/11/2026',
    responsable: 'Rodrigo Ayala',
    nota: '31 oct 2026',
  },
  {
    titulo: 'Pendientes vencidos',
    detalle: 'Cliente Honda tiene 4 requerimientos pendientes vencido',
    estado: 'Crítico',
    fecha: '15/10/2026',
    responsable: 'Cliente Honda',
    nota: '4 pendientes',
  },
  {
    titulo: 'Contratos por vencer',
    detalle: 'El contrato de Rodrigo Ayala vence en 10 días',
    estado: 'Advert.',
    fecha: '17/11/2026',
    responsable: 'Rodrigo Ayala',
    nota: '31 oct 2026',
  },
]

export interface CoberturaCliente {
  readonly cliente: string
  readonly cobertura: string
  readonly vacantes: string
}

export const COBERTURA: readonly CoberturaCliente[] = [
  { cliente: 'HONDA', cobertura: '96%', vacantes: '48/50' },
  { cliente: 'DSV', cobertura: '86%', vacantes: '12/15' },
  { cliente: 'JBL', cobertura: '100%', vacantes: '3/3' },
  { cliente: 'Integra Retail', cobertura: '92%', vacantes: '14/15' },
  { cliente: 'HONDA RECALL', cobertura: '100%', vacantes: '3/3' },
]
