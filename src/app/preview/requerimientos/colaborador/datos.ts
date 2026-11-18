export const COLABORADOR = {
  nombre: 'Luis Torres',
  cargo: 'Operario de Almacén',
  ubicacion: 'Operaciones | Sede Lima Central',
  estado: 'Activo',
} as const

export interface ParDato {
  readonly etiqueta: string
  readonly valor: string
}

export const DATOS_PERSONALES: readonly (readonly [ParDato, ParDato])[] = [
  [
    { etiqueta: 'Nombre Completo', valor: 'Luis' },
    { etiqueta: 'Fecha de nacimiento', valor: '15/07/2000' },
  ],
  [
    { etiqueta: 'Apellidos', valor: 'Torres Caycho' },
    { etiqueta: 'Sexo', valor: 'Masculino' },
  ],
  [
    { etiqueta: 'Tipo de Documento', valor: '71123456' },
    { etiqueta: 'Estado Civil', valor: 'Soltero' },
  ],
  [
    { etiqueta: 'Número de Documento', valor: 'DNI' },
    { etiqueta: 'Nacionalidad', valor: 'Peruano' },
  ],
]

export const DATOS_LABORALES: readonly (readonly [ParDato, ParDato])[] = [
  [
    { etiqueta: 'Teléfono', valor: '999 999 999' },
    { etiqueta: 'Fecha de ingreso', valor: '15/07/2026' },
  ],
  [
    { etiqueta: 'Correo electrónico', valor: 'correodeluisitogmail...' },
    { etiqueta: 'Tipo de Ingreso', valor: 'Reclutamiento' },
  ],
  [
    { etiqueta: 'Dirección', valor: 'Av. Brigida 181 ...' },
    { etiqueta: 'Empresa', valor: 'Honda' },
  ],
  [
    { etiqueta: 'Tipo de Personal', valor: 'Operativo' },
    { etiqueta: 'Sede', valor: 'Callao' },
  ],
]

export const TABS = [
  { etiqueta: 'Resumen', icono: 'home' },
  { etiqueta: 'Boletas de Pago', icono: 'edit_document' },
  { etiqueta: 'Documetnos', icono: 'business_center' },
  { etiqueta: 'Historia', icono: 'person' },
  { etiqueta: 'Asistencia', icono: 'description' },
  { etiqueta: 'Items', icono: 'verified_user' },
  { etiqueta: 'Vacaciones', icono: 'book' },
] as const

export const DATOS_CONTRATO: readonly ParDato[] = [
  { etiqueta: 'CARGO', valor: 'Operador logistico...' },
  { etiqueta: 'SEDE', valor: 'Callao' },
  { etiqueta: 'AREA', valor: 'Operativo' },
  { etiqueta: 'GERENCIA', valor: 'Operativo' },
  { etiqueta: 'EMPRESA', valor: 'MAN POWER SERVICIOS LOGISTICOS' },
  { etiqueta: 'SUPERVISOR', valor: 'Ricardo Cisterna' },
  { etiqueta: 'SUPLENTE', valor: 'Sin Suplente' },
  { etiqueta: 'SUELDO BASE', valor: '1500' },
  { etiqueta: 'TIPO DE CONTRATO', valor: 'Inicio o incremento de nueva actividad' },
  { etiqueta: 'JORNADA LABORAL', valor: 'Mensual 48hrs' },
  { etiqueta: 'FECHA DE INGRESO', valor: '1 de octubre del 2025' },
  { etiqueta: 'DÍAS DE VACACIONES', valor: '6 días' },
]

export const REMUNERACION = {
  monto: 's/ 1,500.00',
  detalle: 'Remuneración mensual',
  estado: 'Vigente',
} as const

export interface Boleta {
  readonly mes: string
  readonly sueldoBruto: string
  readonly sueldoNeto: string
  readonly aporteEmpleador: string
  readonly horasExtras: string
  readonly recargos: string
  readonly horasNoTrabajadas: string
  readonly diasNoTrabajados: string
}

const BOLETA: Boleta = {
  mes: '10-2026',
  sueldoBruto: 's/2,300',
  sueldoNeto: 's/2,038.49',
  aporteEmpleador: 's/215.97',
  horasExtras: '0.0hrs',
  recargos: '0.0hrs',
  horasNoTrabajadas: '0.0hrs',
  diasNoTrabajados: '0.0 días',
}

// La maqueta dibuja ocho filas idénticas aunque el pie anuncie «Mostrando 10 de 246».
export const BOLETAS: readonly Boleta[] = Array.from({ length: 8 }, () => BOLETA)

export const PAGINAS_BOLETAS = [1, 2, 3, 4, 5, 6] as const

export interface PanelFicha {
  readonly clave: 'afiliacion' | 'tallas' | 'cuenta'
  readonly titulo: string
  readonly campos: readonly ParDato[]
}

export const PANELES: readonly PanelFicha[] = [
  {
    clave: 'afiliacion',
    titulo: 'Afiliación previsional',
    campos: [
      { etiqueta: 'Sistema pensionario', valor: 'AFP' },
      { etiqueta: 'AFP', valor: 'PRIMA' },
      { etiqueta: 'CUS', valor: '123456MPS' },
    ],
  },
  {
    clave: 'tallas',
    titulo: 'Tallas / EPP',
    campos: [
      { etiqueta: 'Polo', valor: 'L' },
      { etiqueta: 'Pantalón', valor: '32' },
      { etiqueta: 'Calzado', valor: '42' },
      { etiqueta: 'Camisa', valor: 'L' },
      { etiqueta: 'Casaca', valor: 'L' },
    ],
  },
  {
    clave: 'cuenta',
    titulo: 'Cuenta bancaria',
    campos: [
      { etiqueta: 'Banco', valor: 'Scotiabank' },
      { etiqueta: 'Tipo de Cuenta', valor: 'SUELDO' },
      { etiqueta: 'Cuenta / CCI', valor: '1234511111' },
    ],
  },
]
