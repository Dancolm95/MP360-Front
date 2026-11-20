export interface TabDotacion {
  readonly etiqueta: string
  readonly icono: string
  readonly dosLineas: boolean
  readonly ancho: number
}

export interface IndicadorDotacion {
  readonly valor: string
  readonly fraccion?: string
  readonly etiqueta: string
  readonly tono: 'verde' | 'ambar' | 'azul'
}

export interface ParDotacion {
  readonly etiqueta: string
  readonly valor: string
}

export interface FichaDotacion {
  readonly cobertura: string
  readonly cubiertos: ParDotacion
  readonly pendientes: ParDotacion
  readonly izquierda: readonly ParDotacion[]
  readonly derecha: readonly ParDotacion[]
}

/* El cromo de la p. 32 dibuja «Licencias» y no incluye «Gestión Documental»;
   sus pestañas son más estrechas que las del cromo compartido, de ahí los anchos
   medidos que reproducen la píldora activa en x 1401–1567. */
export const NAVEGACION_DOTACION: readonly TabDotacion[] = [
  { etiqueta: 'Inicio', icono: 'home', dosLineas: false, ancho: 106.5 },
  { etiqueta: 'Requerimientos', icono: 'description', dosLineas: false, ancho: 175 },
  { etiqueta: 'Reclutamiento', icono: 'work', dosLineas: false, ancho: 169 },
  { etiqueta: 'Colaboradores', icono: 'group', dosLineas: false, ancho: 165 },
  { etiqueta: 'Onboarding', icono: 'fact_check', dosLineas: false, ancho: 149 },
  { etiqueta: 'EPP y Equipos', icono: 'verified_user', dosLineas: false, ancho: 163 },
  { etiqueta: 'Licencias', icono: 'schedule', dosLineas: false, ancho: 128 },
  { etiqueta: 'Offboarding', icono: 'badge', dosLineas: false, ancho: 147 },
  { etiqueta: 'Organización y Dotación', icono: 'account_tree', dosLineas: true, ancho: 166 },
]

export const INDICADORES_DOTACION: readonly IndicadorDotacion[] = [
  { valor: '1,116', fraccion: '/1,240', etiqueta: 'Cubiertos', tono: 'verde' },
  { valor: '124', etiqueta: 'pendientes', tono: 'ambar' },
  { valor: '7', etiqueta: 'Operaciones activas', tono: 'azul' },
]

export const FILTROS_DOTACION: readonly string[] = [
  'Empresa',
  'Cliente',
  'Área / Subárea',
  'Periodo',
  'Contratos por vencer',
  'Personal',
  'Nacionalidad',
]

/* Las seis tarjetas de la maqueta repiten el mismo dato de muestra. */
export const FICHA_DOTACION: FichaDotacion = {
  cobertura: 'Cobertura al 90 %',
  cubiertos: { etiqueta: 'Cubiertos', valor: '46' },
  pendientes: { etiqueta: 'Pendientes', valor: '4' },
  izquierda: [
    { etiqueta: 'Masculino', valor: '23/26' },
    { etiqueta: 'Femenino', valor: '23/26' },
    { etiqueta: 'Extranjero', valor: '10/46' },
  ],
  derecha: [
    { etiqueta: 'Contrato a vencer', valor: '2/46' },
    { etiqueta: 'Nuevos ingresos', valor: '2/46' },
  ],
}

export const CLIENTES_DOTACION: readonly string[] = [
  'Honda',
  'Honda Recall',
  'Zara',
  'JBL',
  'Integra Retail',
  'DSV',
]

export const CUPO_DOTACION = '/50'

export type PestanaDetalleDotacion =
  | 'resumen'
  | 'dotacion'
  | 'asignados'
  | 'historial'

export interface PestanaDetalle {
  readonly id: PestanaDetalleDotacion
  readonly etiqueta: string
  readonly icono: string
}

export const PESTANAS_DETALLE_DOTACION: readonly PestanaDetalle[] = [
  { id: 'resumen', etiqueta: 'Resumen', icono: 'home' },
  { id: 'dotacion', etiqueta: 'Dotación por área y cargo', icono: 'assignment' },
  { id: 'asignados', etiqueta: 'Colaboradores asignados', icono: 'work' },
  { id: 'historial', etiqueta: 'Historial de cambios', icono: 'person' },
]

export interface ClienteDetalleDotacion {
  readonly nombre: string
  readonly empresa: string
  readonly contrato: string
  readonly estado: string
  readonly datos: readonly ParDotacion[]
  readonly cobertura: string
}

export const CLIENTE_DETALLE_DOTACION: ClienteDetalleDotacion = {
  nombre: 'Honda',
  empresa: 'Honda del Perú S.A',
  contrato: 'Operación Planta |',
  estado: 'Activo',
  datos: [
    { etiqueta: 'Cliente', valor: 'Honda' },
    { etiqueta: 'Empresa', valor: 'Honda Perú S.A' },
    { etiqueta: 'Contrato/servicio', valor: 'Operación Planta' },
    { etiqueta: 'Periodo', valor: 'Actual' },
    { etiqueta: 'Dotación requerida', valor: '50' },
    { etiqueta: 'Cubiertos', valor: '46' },
    { etiqueta: 'Pendiente', valor: '4' },
  ],
  cobertura: 'Cobertura al 90 %',
}

export interface IndicadorDetalleDotacion {
  readonly etiqueta: string
  readonly valor: string
  readonly icono: string
  readonly tono: 'azul' | 'verde' | 'ambar'
}

export const INDICADORES_DETALLE_DOTACION: readonly IndicadorDetalleDotacion[] = [
  {
    etiqueta: 'Colaboradores Requeridos',
    valor: '26',
    icono: 'package',
    tono: 'azul',
  },
  {
    etiqueta: 'Colaboradores Cubiertos',
    valor: '24',
    icono: 'person',
    tono: 'verde',
  },
  {
    etiqueta: 'Colaboradores Pendientes',
    valor: '2',
    icono: 'error_outline',
    tono: 'ambar',
  },
]

export const COBERTURA_DETALLE_DOTACION = { valor: '92 %', etiqueta: 'Cobertura' } as const

export type TonoCobertura = 'verde' | 'verde-oscuro' | 'ambar' | 'amarillo'

export interface FilaEstructura {
  readonly nivel: 0 | 1 | 2
  readonly etiqueta: string
  readonly requeridos: string
  readonly cubiertos: string
  readonly pendientes: string
  readonly cobertura: string
  readonly tono: TonoCobertura
}

/* La maqueta alterna dos verdes: el de grupo (#06cc14) y el de cargo (#22b273),
   y deja un punto literal en Pendientes de Calidad. Se replica tal cual. */
export const FILAS_ESTRUCTURA_DOTACION: readonly FilaEstructura[] = [
  { nivel: 0, etiqueta: 'OPERACIONES', requeridos: '26', cubiertos: '24', pendientes: '2', cobertura: '92 %', tono: 'verde' },
  { nivel: 1, etiqueta: 'Producción', requeridos: '16', cubiertos: '15', pendientes: '1', cobertura: '94 %', tono: 'verde' },
  { nivel: 2, etiqueta: 'Operador de planta', requeridos: '10', cubiertos: '9', pendientes: '1', cobertura: '100 %', tono: 'verde-oscuro' },
  { nivel: 2, etiqueta: 'Técnico de Mantenimiento', requeridos: '4', cubiertos: '4', pendientes: '0', cobertura: '100 %', tono: 'verde-oscuro' },
  { nivel: 2, etiqueta: 'Supervisor de Producción', requeridos: '2', cubiertos: '2', pendientes: '0', cobertura: '100 %', tono: 'verde-oscuro' },
  { nivel: 1, etiqueta: 'Calidad', requeridos: '6', cubiertos: '6', pendientes: '.', cobertura: '100 %', tono: 'verde' },
  { nivel: 2, etiqueta: 'Analista de Calidad', requeridos: '4', cubiertos: '4', pendientes: '0', cobertura: '100 %', tono: 'verde-oscuro' },
  { nivel: 2, etiqueta: 'Inspector de Calidad', requeridos: '2', cubiertos: '2', pendientes: '0', cobertura: '100 %', tono: 'verde-oscuro' },
  { nivel: 1, etiqueta: 'Logística', requeridos: '4', cubiertos: '3', pendientes: '1', cobertura: '75 %', tono: 'ambar' },
  { nivel: 2, etiqueta: 'Auxiliar de Almacén', requeridos: '3', cubiertos: '2', pendientes: '1', cobertura: '57 %', tono: 'amarillo' },
  { nivel: 2, etiqueta: 'Coordinador Logístico', requeridos: '1', cubiertos: '1', pendientes: '0', cobertura: '100 %', tono: 'verde-oscuro' },
]

export const ORDEN_DETALLE_DOTACION = 'Últimos registrados'
export const RANGO_DETALLE_DOTACION = 'últimos 30 días'

/* La tercera acción se dibuja vacía, a diferencia del resumen de la p. 32. */
export const ACCIONES_DETALLE_DOTACION: readonly string[] = [
  'Nuevo Reclutamiento',
  'Contratos por Vencer',
  '',
  'Contratos por Vencer',
]
