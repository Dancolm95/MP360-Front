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

export const COLABORADOR_CHECKLIST_OFFBOARDING: ColaboradorOffboarding = {
  nombre: 'Luis Torres',
  nacionalidad: 'Nac: Peruano',
  documento: 'DNI: 7142123456',
  telefono: '999 999 999',
  correo: 'correodeluisito@gmail.com',
}

export const PUESTO_CHECKLIST_OFFBOARDING = 'Operario de Almacén'

export interface DatoChecklistOffboarding {
  readonly etiqueta: string
  readonly valor: string
}

export const FICHA_CHECKLIST_OFFBOARDING: readonly DatoChecklistOffboarding[] = [
  { etiqueta: 'Casual de cese', valor: 'Renuncia voluntaria' },
  { etiqueta: 'Fecha de último día', valor: '20/10/2026' },
  { etiqueta: 'Fecha de Registro', valor: '15/10/2026' },
  { etiqueta: 'Responsable de revisión', valor: 'Ricardo Cisterna' },
]

export interface TareaChecklistOffboarding {
  readonly titulo: string
  readonly descripcion: string
}

export const CHECKLIST_SALIDA_OFFBOARDING: readonly TareaChecklistOffboarding[] = [
  {
    titulo: 'EPP y equipos',
    descripcion: 'Devolución de EPP, herramientas y archivos asignados',
  },
  { titulo: 'SSTS', descripcion: 'Cierre de compromisos y exámenes (si aplica)' },
  {
    titulo: 'Descuentos',
    descripcion: 'Validación de descuentos por EPP, equipos o adelantos.',
  },
  { titulo: 'Cita de liquidación', descripcion: 'Programación de fecha y hora para firma' },
  { titulo: 'Firma de liquidación', descripcion: 'Registro de firma de colaborador' },
  {
    titulo: 'Vacaciones',
    descripcion: 'CCalculo y regularización de vacaciones pendientes',
  },
  {
    titulo: 'Licencias y permisos',
    descripcion: 'Cierre de licencias, permisos y ausencias.',
  },
  { titulo: 'Baja de accesos', descripcion: 'Desactivación de usuario y credenciales.' },
]

export type EstadoRevisionArea = 'Confirmado' | 'En revisión' | 'No aplica'

export interface RevisionAreaOffboarding {
  readonly area: string
  readonly responsable: string
  readonly alcance: string
  readonly estado: EstadoRevisionArea
  readonly fecha: string
  readonly observaciones: string
}

export const REVISIONES_AREAS_OFFBOARDING: readonly RevisionAreaOffboarding[] = [
  {
    area: 'Operaciones',
    responsable: 'Ricardo Cisterna',
    alcance: 'Devolución de herramientas, activos y cierre operativo.',
    estado: 'Confirmado',
    fecha: '20/10/2026 - 10:24',
    observaciones: 'Sin observaciones',
  },
  {
    area: 'RR.HH.',
    responsable: 'Jesus Vargas',
    alcance: 'Validación de documentos, beneficio y estado de cese.',
    estado: 'En revisión',
    fecha: '20/10/2026 - 10:24',
    observaciones: 'Revisando documentación.',
  },
  {
    area: 'Administración',
    responsable: 'Karem Vidal',
    alcance: 'Cierre de accesos, activos y servicios administrativos.',
    estado: 'No aplica',
    fecha: '',
    observaciones: '',
  },
  {
    area: 'SST',
    responsable: 'Raquel Ávila',
    alcance: 'Cierre de compromisos SST y exámenes (si aplica).',
    estado: 'No aplica',
    fecha: '',
    observaciones: '',
  },
]

export const NOTA_CHECKLIST_OFFBOARDING =
  'Se encontrarán habilitadas los cuadros a marcar según el tipo de personal que este en proceso de offboarding.'

export interface DatoLiquidacionOffboarding {
  readonly etiqueta: string
  readonly valor: string
}

export const RESUMEN_LIQUIDACION_OFFBOARDING: readonly DatoLiquidacionOffboarding[] = [
  { etiqueta: 'Casual de cese:', valor: 'Renuncia voluntaria' },
  { etiqueta: 'Fecha de cese:', valor: '20/10/2026' },
  { etiqueta: 'Último día de labores:', valor: '20/10/2026' },
]

export interface FilaLiquidacionOffboarding {
  readonly concepto: string
  readonly detalle: string
  readonly monto: string
}

// La maqueta dibuja el importe de la primera fila dentro de la columna Detalle.
export const FILAS_LIQUIDACION_OFFBOARDING: readonly FilaLiquidacionOffboarding[] = [
  { concepto: 'Remuneración base', detalle: 's/ 2.060.00', monto: '' },
  { concepto: 'Vacaciones pendientes', detalle: '15 días', monto: 's/1,030.00' },
  {
    concepto: 'Descuentos (EPP/ equipos /adelantos)',
    detalle: 'EPP no devuelto',
    monto: '-  s/ 200.00',
  },
]

export const TOTAL_LIQUIDACION_OFFBOARDING = {
  etiqueta: 'Total liquidación (referencial)',
  monto: 's/ 2,890.00',
} as const

export interface DatoExColaboradorOffboarding {
  readonly etiqueta: string
  readonly valor: string
}

export const DATOS_EX_COLABORADOR_OFFBOARDING: readonly DatoExColaboradorOffboarding[] = [
  { etiqueta: 'Nombre completo:', valor: 'Luis Torres Caycho' },
  { etiqueta: 'Documento Ident.', valor: '714212345' },
  { etiqueta: 'Nacionalidad', valor: 'Peruano' },
  { etiqueta: 'Fecha de Ingreso', valor: '12 / 10 / 2026' },
  { etiqueta: 'Código de Colaborador', valor: 'COL-0000125' },
  { etiqueta: 'Puesto:', valor: 'Operario de Almacén' },
  { etiqueta: 'Área', valor: 'Operaciones' },
  { etiqueta: 'Sede', valor: 'Lima- Sede Principal' },
]

export type EstadoProcesoRealizado = 'Completo' | 'En Proceso' | 'Pendiente'

export interface ProcesoRealizadoOffboarding {
  readonly titulo: string
  readonly detalle: string
  readonly estado: EstadoProcesoRealizado
}

// La p. 31 escribe «EPPS» y conserva los espacios sueltos de las fechas.
export const PROCESOS_REALIZADOS_OFFBOARDING: readonly ProcesoRealizadoOffboarding[] = [
  { titulo: 'Entrega de EPPS', detalle: '15 /10 /2026 15:22', estado: 'Completo' },
  { titulo: 'Revisión por áreas', detalle: '15 /10 /2026 15:22', estado: 'Completo' },
  { titulo: 'Agenda de cita', detalle: 'Se notificará al completar', estado: 'En Proceso' },
  { titulo: 'Entrega de liquidación', detalle: '', estado: 'Pendiente' },
]

export const TITULO_EXITO_OFFBOARDING = '¡Proceso de offboarding exitoso!'

export const MENSAJE_EXITO_OFFBOARDING =
  'El ex-colaborador ha sido registrado correctamente en su registro de offboarding.'
