export const PASOS = [
  'Identificación',
  'Datos Personales',
  'Datos previsionales',
  'Trabajo',
  'Validación Final',
] as const

export const CANDIDATO_ENCONTRADO = {
  nombre: 'Luis Torres',
  nacionalidad: 'Peruano',
  dni: '7142123456',
  correo: 'correodeluisito@gmail.com',
  numero: '999 999 999',
  estado: 'Seleccionado para alta',
} as const

export const CANDIDATOS = [
  { nombre: 'Luis Torres', nacionalidad: 'Peruano', dni: '7142123456', telefono: '999 999 99', correo: 'correodeluisito@gmail.com' },
  { nombre: 'Luis Torres', nacionalidad: 'Peruano', dni: '7142123456', telefono: '999 999 99', correo: 'correodeluisito@gmail.com' },
  { nombre: 'Luis Torres', nacionalidad: 'Peruano', dni: '7142123456', telefono: '999 999 99', correo: 'correodeluisito@gmail.com' },
  { nombre: 'Luis Torres', nacionalidad: 'Peruano', dni: '7142123456', telefono: '999 999 99', correo: 'correodeluisito@gmail.com' },
] as const

export const REQUERIMIENTO = {
  referencia: 'RQ-0222 | Operario de Almacén',
  puesto: 'Operario de Almacén',
  area: 'Operaciones',
  sede: 'Lima- Sede Principal',
  codigo: 'RQ - 0222',
  puestoDetalle: 'Operario de Almacén',
  sedeDetalle: 'Lima - Sede Principal',
} as const

export const TIPOS_INGRESO = [
  { titulo: 'Reclutamiento', descripcion: 'Candidato proveniente de un proceso de selección' },
  { titulo: 'Contrato por vencer', descripcion: 'Renovación o nuevo contrato por vencer.' },
  { titulo: 'Retiro', descripcion: 'Reingreso de colaborador anterior' },
  { titulo: 'Otro', descripcion: 'Ingreso manual o por otro motivo.' },
] as const

export interface CampoAlta {
  readonly etiqueta: string
  readonly valor: string
  readonly control: 'texto' | 'select'
  readonly ancho?: 'normal' | 'medio' | 'correo' | 'direccion' | 'cuenta'
}

export const RESUMEN_DATOS = {
  nombre: 'Luis Torres',
  nacionalidad: 'Peruano',
  dni: '7142123456',
  puesto: 'Operario de Almacén',
  requerimiento: 'RQ - 02222',
  origen: 'Reclutamiento',
  badge: 'Requerimiento Vinculado',
} as const

export const FILAS_DATOS_PERSONALES: readonly (readonly CampoAlta[])[] = [
  [
    { etiqueta: 'Nombre', valor: 'Luis', control: 'texto' },
    { etiqueta: 'Apellidos', valor: 'Torres Caycho', control: 'texto', ancho: 'medio' },
    { etiqueta: 'Sexo', valor: 'Masculino', control: 'select', ancho: 'medio' },
  ],
  [
    { etiqueta: 'Tipo de documetno', valor: 'DNI', control: 'texto' },
    { etiqueta: 'Número de documento', valor: '714212345', control: 'texto', ancho: 'medio' },
    { etiqueta: 'Nacionalidad', valor: 'Peruano', control: 'select', ancho: 'medio' },
  ],
  [
    { etiqueta: 'Estado Civil', valor: 'Soltero', control: 'texto' },
    { etiqueta: 'Fecha de Nacimiento', valor: '12 / 08 / 1996', control: 'texto', ancho: 'medio' },
    { etiqueta: 'Teléfono', valor: '999 999 999', control: 'texto', ancho: 'medio' },
  ],
  [
    { etiqueta: 'Grado de Educación', valor: 'Secundaria Compl.', control: 'texto' },
    { etiqueta: 'Cant. de Hijos', valor: 'No aplica', control: 'texto', ancho: 'medio' },
  ],
  [
    { etiqueta: 'Correo electrónico', valor: 'correodeluisito@gmail.com', control: 'texto', ancho: 'correo' },
    { etiqueta: 'Dirección', valor: 'Av. Los Olivos, 123', control: 'texto', ancho: 'direccion' },
  ],
]

export const FILAS_PAGO: readonly (readonly CampoAlta[])[] = [
  [
    { etiqueta: 'Fecha de ingreso', valor: '15/10&2026', control: 'texto' },
    { etiqueta: 'Forma de Pago', valor: 'Deposito a Cuenta', control: 'texto', ancho: 'medio' },
    { etiqueta: 'Banco', valor: 'BCP', control: 'select', ancho: 'medio' },
  ],
  [
    { etiqueta: 'Tipo de Cuenta', valor: 'Ahorros', control: 'texto' },
    { etiqueta: 'Cuenta / CCI', valor: '121212121212121212121', control: 'texto', ancho: 'cuenta' },
  ],
]

export const FOTO_COLABORADOR = {
  titulo: 'Foto del Colaborador',
  accion: 'Subir Foto',
  formato: 'JPG o PNG (Máx500kbp)',
} as const

export const FILAS_TALLAS: readonly (readonly CampoAlta[])[] = [
  [
    { etiqueta: 'Talla de Polo', valor: 'L', control: 'select' },
    { etiqueta: 'Talla de Pantalon', valor: '32', control: 'select', ancho: 'medio' },
    { etiqueta: 'Talla de Calzado', valor: '42', control: 'select', ancho: 'medio' },
  ],
  [
    { etiqueta: 'Talla de Camisa', valor: 'L', control: 'select' },
    { etiqueta: 'Talla de Casaca', valor: 'L', control: 'select', ancho: 'medio' },
  ],
]

export interface DatoResumen {
  readonly etiqueta: string
  readonly valor: string
}

export const TITULO_RESUMEN = 'Resumen Final de validaciones'
export const ETIQUETA_REVISADO = 'Revisado'

export const FILAS_RESUMEN_DATOS: readonly {
  readonly izquierda: DatoResumen
  readonly derecha?: DatoResumen
}[] = [
  {
    izquierda: { etiqueta: 'Nombre completo:', valor: 'Luis Torres Caycho' },
    derecha: { etiqueta: 'Tipo de Personal', valor: 'Operativo' },
  },
  {
    izquierda: { etiqueta: 'Documento Ident.', valor: '714212345' },
    derecha: { etiqueta: 'Puesto:', valor: 'Operario de Almacén' },
  },
  {
    izquierda: { etiqueta: 'Estado Civil', valor: 'Soltero' },
    derecha: { etiqueta: 'Área', valor: 'Operaciones' },
  },
  {
    izquierda: { etiqueta: 'Fecha de Nacimiento', valor: '12 / 08 / 1996' },
    derecha: { etiqueta: 'Sede', valor: 'Lima' },
  },
  { izquierda: { etiqueta: 'Teléfono', valor: '999 999 999' } },
  { izquierda: { etiqueta: 'Correo Electrónico', valor: 'correodeluis@gmail.com' } },
  { izquierda: { etiqueta: 'Dirección', valor: 'Av. Los Olivos 123' } },
]

export const RESUMEN_PAGO = {
  primera: {
    izquierda: { etiqueta: 'Forma de Pago', valor: 'Deposito a cuenta' },
    derecha: { etiqueta: 'Cuenta/CCI', valor: '12121212121212121212' },
  },
  segunda: { etiqueta: 'Banco', valor: 'BCP' },
  tercera: { etiqueta: 'Tipo de Cuenta', valor: 'Ahorro' },
  editar: 'Editar',
} as const

export const RESUMEN_INFO = {
  nombre: 'Luis Torres',
  nacionalidad: 'Peruano',
  dni: '7142123456',
  tallasIzquierda: [
    { etiqueta: 'Talla de Polo', valor: 'L' },
    { etiqueta: 'Talla de Camisa', valor: 'L' },
    { etiqueta: 'Talla de Casaca', valor: 'L' },
  ],
  tallasDerecha: [
    { etiqueta: 'Talla de Calzado', valor: '42' },
    { etiqueta: 'Talla de Pantalón', valor: '32' },
  ],
  editar: 'Editar',
} as const

export const CONFIRMACION_ALTA = {
  titulo: '¡Alta de Colaborador exitoso!',
  mensaje:
    'El Colaborador ha sido registrado correctamente en MP360 y su información se encuentra disponible',
  mensajeFinal: 'en el modulo de Colaboradores',
  estado: 'Activo',
} as const

export const CONFIRMACION_DATOS: readonly {
  readonly izquierda: DatoResumen
  readonly derecha: DatoResumen
}[] = [
  {
    izquierda: { etiqueta: 'Nombre completo:', valor: 'Luis Torres Caycho' },
    derecha: { etiqueta: 'Código de Colaborador', valor: 'COL-0000125' },
  },
  {
    izquierda: { etiqueta: 'Documento Ident.', valor: '714212345' },
    derecha: { etiqueta: 'Puesto:', valor: 'Operario de Almacén' },
  },
  {
    izquierda: { etiqueta: 'Nacionalidad', valor: 'Peruano' },
    derecha: { etiqueta: 'Área', valor: 'Operaciones' },
  },
  {
    izquierda: { etiqueta: 'Fecha de Ingreso', valor: '12 / 10 / 2026' },
    derecha: { etiqueta: 'Sede', valor: 'Lima- Sede Principal' },
  },
]

export type EstadoProceso = 'completado' | 'proceso' | 'pendiente'

export const PROCESOS_POSTERIORES: readonly {
  readonly titulo: string
  readonly detalle: string
  readonly enlace?: string
  readonly estado: EstadoProceso
  readonly etiqueta: string
}[] = [
  {
    titulo: 'Registro MP360',
    detalle: '15 / 10 / 2026 15:22',
    estado: 'completado',
    etiqueta: 'Completo',
  },
  {
    titulo: 'Creación Usuario ERP',
    detalle: '15 / 10 / 2026 15:22',
    estado: 'completado',
    etiqueta: 'Completo',
  },
  {
    titulo: 'Alta en SUNAT',
    detalle: 'Se notificará al completar',
    estado: 'proceso',
    etiqueta: 'En Proceso',
  },
  {
    titulo: 'Entrega de EPP',
    detalle: 'Asignación desde',
    enlace: 'EPP y Equipos',
    estado: 'pendiente',
    etiqueta: 'Pendiente',
  },
]

export const ACCIONES_CONFIRMACION = [
  { etiqueta: 'Ver ficha del Colaborador', icono: 'person', primaria: false },
  { etiqueta: 'Registrar otro colaborador', icono: 'edit_document', primaria: false },
  { etiqueta: 'Ir a Colaboradores', icono: 'description', primaria: true },
] as const

export type EstadoValidacion = 'completado' | 'proceso' | 'pendiente'

export const VALIDACIONES_RESUMEN: readonly {
  readonly titulo: string
  readonly descripcion: string
  readonly estado: EstadoValidacion
  readonly etiqueta: string
  readonly fecha: string
}[] = [
  {
    titulo: 'Antecedentes',
    descripcion: 'Verificación de Antecedentes de colaborador',
    estado: 'completado',
    etiqueta: 'Completado',
    fecha: 'Fecha 15/10/2026',
  },
  {
    titulo: 'Verificación Domiciliaria',
    descripcion: 'Validación de domicilio registradao.',
    estado: 'completado',
    etiqueta: 'Completado',
    fecha: 'Fecha 15/10/2026',
  },
  {
    titulo: 'Experiencia / CUL',
    descripcion: 'Validación de experiencia y CUL.',
    estado: 'proceso',
    etiqueta: 'En Proceso',
    fecha: '-',
  },
  {
    titulo: 'Alta SUNAT',
    descripcion: 'Confirmación del alta en SUNAT.',
    estado: 'pendiente',
    etiqueta: 'Pendiente',
    fecha: '-',
  },
]
