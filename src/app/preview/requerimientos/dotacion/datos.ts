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
