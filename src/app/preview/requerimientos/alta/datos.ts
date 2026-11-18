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
