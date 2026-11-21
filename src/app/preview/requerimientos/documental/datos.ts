export interface PestanaDocumental {
  readonly etiqueta: string
  readonly icono: string
  readonly ancho: number
  readonly separacion: number
}

export const TABS_DOCUMENTAL: readonly PestanaDocumental[] = [
  { etiqueta: 'Todos los documentos', icono: 'layers', ancho: 259, separacion: 7 },
  { etiqueta: 'Firmas pendientes', icono: 'edit', ancho: 200, separacion: 12 },
  { etiqueta: 'Revisiones Pendientes', icono: 'search', ancho: 259, separacion: 9 },
  { etiqueta: 'Todos los pendientes', icono: 'work', ancho: 201, separacion: 5 },
  { etiqueta: 'Archivado', icono: 'inventario', ancho: 201, separacion: 7 },
  { etiqueta: 'Papelera', icono: 'delete', ancho: 201, separacion: 0 },
]

export interface FiltroDocumental {
  readonly etiqueta: string
  readonly valor: string
}

export const FILTROS_DOCUMENTAL: readonly FiltroDocumental[] = [
  { etiqueta: 'Empresa', valor: 'Todos' },
  { etiqueta: 'Área / Subárea', valor: 'Todos' },
  { etiqueta: 'Tipo Documento', valor: 'Todos' },
  { etiqueta: 'Estado', valor: 'Todos' },
]

export type EstadoDocumento =
  | 'Pendiente de revisión'
  | 'Pendiente de firma'
  | 'Vigente'
  | 'Archivado'
  | 'En papelera'

export interface FilaDocumental {
  readonly archivo: string
  readonly formato: 'pdf' | 'word'
  readonly colaborador: string
  readonly cargo: string
  readonly tipo: string
  readonly version: string
  readonly estado: EstadoDocumento
  readonly area: string
  readonly fechaCreacion: string
  readonly ultimaActualizacion: string
  readonly ubicacion: string
  readonly ubicacionTipo: 'carpeta' | 'papelera'
}

export const FILAS_DOCUMENTAL: readonly FilaDocumental[] = [
  {
    archivo: 'Contrato de trabajo.pdf',
    formato: 'pdf',
    colaborador: 'Luis Torres',
    cargo: 'Auxiliar de Almacén',
    tipo: 'Contrato',
    version: 'V2',
    estado: 'Pendiente de revisión',
    area: 'RR.HH',
    fechaCreacion: '13/10/2026',
    ultimaActualizacion: '15/10/2026',
    ubicacion: 'Contratos',
    ubicacionTipo: 'carpeta',
  },
  {
    archivo: 'Anexo de confidencia',
    formato: 'pdf',
    colaborador: 'Luis Torres',
    cargo: 'Auxiliar de Almacén',
    tipo: 'Anexo',
    version: 'V1',
    estado: 'Pendiente de firma',
    area: 'Jefe de Área',
    fechaCreacion: '13/10/2026',
    ultimaActualizacion: '15/10/2026',
    ubicacion: 'Anexo',
    ubicacionTipo: 'carpeta',
  },
  {
    archivo: 'Contrato de trabajo.docx',
    formato: 'word',
    colaborador: 'Luis Torres',
    cargo: 'Auxiliar de Almacén',
    tipo: 'Anexo',
    version: 'V3',
    estado: 'Vigente',
    area: 'Jefe de Área',
    fechaCreacion: '13/10/2026',
    ultimaActualizacion: '15/10/2026',
    ubicacion: 'Constancias',
    ubicacionTipo: 'carpeta',
  },
  {
    archivo: 'Ficha de datos.pdf',
    formato: 'pdf',
    colaborador: 'Luis Torres',
    cargo: 'Auxiliar de Almacén',
    tipo: 'Ficha',
    version: 'V1',
    estado: 'Archivado',
    area: 'Jefe de Área',
    fechaCreacion: '13/10/2026',
    ultimaActualizacion: '15/10/2026',
    ubicacion: 'Ficha',
    ubicacionTipo: 'carpeta',
  },
  {
    archivo: 'Ficha de datos.pdf',
    formato: 'pdf',
    colaborador: 'Luis Torres',
    cargo: 'Auxiliar de Almacén',
    tipo: 'Ficha',
    version: 'V1',
    estado: 'En papelera',
    area: 'Jefe de Área',
    fechaCreacion: '13/10/2026',
    ultimaActualizacion: '15/10/2026',
    ubicacion: 'Papelera',
    ubicacionTipo: 'papelera',
  },
]

export const PAGINAS_DOCUMENTAL = [1, 2, 3, 4, 5, 6] as const

export const PASOS_GENERACION_DOCUMENTAL = [
  'Tipo de Documento',
  'Información del Documento',
  'Contenido y Variables',
  'Confirmación',
] as const

export interface PestanaTipoDocumento {
  readonly etiqueta: string
  readonly ancho: number
}

export const PESTANAS_TIPO_DOCUMENTO: readonly PestanaTipoDocumento[] = [
  { etiqueta: 'Contratos', ancho: 182 },
  { etiqueta: 'Constancias', ancho: 236 },
  { etiqueta: 'Formatos', ancho: 182 },
  { etiqueta: 'Otros', ancho: 182 },
]

export interface PlantillaDocumento {
  readonly nombre: string
  readonly descripcion: string
  readonly seleccionada?: boolean
}

export const PLANTILLAS_CONTRATOS: readonly PlantillaDocumento[] = [
  {
    nombre: 'Contrato de trabajo',
    descripcion: 'Contrato laboral para\ncolaboradores activos.',
    seleccionada: true,
  },
  {
    nombre: 'Anexo de contrato',
    // La maqueta dibuja «Modifiacón» sin la segunda «c».
    descripcion: 'Modifiacón o actualización\nde condiciones.',
  },
  {
    nombre: 'Renovación de contrato',
    descripcion: 'Renovación por periodo\ndeterminado.',
  },
  {
    nombre: 'Contrato de incremento',
    descripcion: 'Actualización por cambio de\npuesto o remuneración.',
  },
  {
    nombre: 'Contrato de teletrabajo',
    descripcion: 'Condiciones para modalidad\nremota o híbrida.',
  },
  {
    nombre: 'Otro contrato',
    descripcion: 'Genera un contrato personalizado\ndesde una plantilla',
  },
]

export interface ColaboradorDocumental {
  readonly nombre: string
  readonly nacionalidad: string
  readonly documento: string
  readonly cargo: string
  readonly correo: string
  readonly telefono: string
}

export const COLABORADOR_DOCUMENTAL: ColaboradorDocumental = {
  nombre: 'Luis Torres',
  nacionalidad: 'Nac: Peruano',
  documento: 'DNI: 7142123456',
  cargo: 'Operario de Almacén',
  correo: 'correodeluisito@gmail.com',
  telefono: '999 999 999',
}

export const COLABORADORES_DOCUMENTAL: readonly ColaboradorDocumental[] = [
  COLABORADOR_DOCUMENTAL,
  { ...COLABORADOR_DOCUMENTAL },
  { ...COLABORADOR_DOCUMENTAL },
  { ...COLABORADOR_DOCUMENTAL },
]

export interface ResumenGeneracionDocumental {
  readonly nombre: string
  readonly documento: string
  readonly cargo: string
  readonly tipoDocumento: string
  readonly ingreso: string
  readonly fechaRegistro: string
  readonly responsable: string
}

export const RESUMEN_GENERACION_DOCUMENTAL: ResumenGeneracionDocumental = {
  nombre: 'Luis Torres',
  documento: 'DNI: 7142123456',
  cargo: 'Operario de Almacén',
  tipoDocumento: 'Contrato de\nTrabajo',
  ingreso: '08/08/2026',
  fechaRegistro: '15/10/2026',
  responsable: 'Ricardo Cisterna',
}

export interface DatoPlantilla {
  readonly etiqueta: string
  readonly valor: string
}

export const DATOS_PLANTILLA: readonly DatoPlantilla[] = [
  { etiqueta: 'Plantilla seleccionada', valor: 'Contrato de trabajo' },
  { etiqueta: 'Categoría', valor: 'Contratos' },
  { etiqueta: 'Versión de plantilla', valor: 'V2.0' },
]

export type TipoCampoInformacion = 'texto' | 'select' | 'fecha'

export interface CampoInformacion {
  readonly etiqueta: string
  readonly valor: string
  readonly tipo: TipoCampoInformacion
}

export const CAMPOS_INFORMACION_IZQUIERDA: readonly CampoInformacion[] = [
  {
    etiqueta: 'Título del documento',
    valor: 'Contrato de Trabajo - Luis Torres',
    tipo: 'texto',
  },
  { etiqueta: 'Tipo de contrato', valor: 'Plazo indeterminado', tipo: 'select' },
  { etiqueta: 'Fecha de inicio', valor: '20/11/2026', tipo: 'fecha' },
  { etiqueta: 'Área / Subárea', valor: 'Operaciones / Almacén', tipo: 'select' },
  { etiqueta: 'Puesto', valor: 'Operario de Almacén', tipo: 'select' },
  { etiqueta: 'Modalidad de trabajo', valor: 'Presencial', tipo: 'select' },
  { etiqueta: 'Jornada Laboral', valor: 'Completa (48h / semana)', tipo: 'select' },
]

export const CAMPOS_INFORMACION_DERECHA: readonly CampoInformacion[] = [
  // El dibujo repite «Plazo indeterminado» en Remuneración Mensual.
  { etiqueta: 'Remuneración Mensual', valor: 'Plazo indeterminado', tipo: 'select' },
  { etiqueta: 'Periodo de prueba', valor: '20/11/2026', tipo: 'fecha' },
  { etiqueta: 'Moneda', valor: 'Soles (PEN)', tipo: 'select' },
]

export const OBSERVACIONES_INFORMACION =
  'Agregar información relevante para el documento...'

export const AVISO_INFORMACION =
  'Esta información se usará para completar automáticamente las variables de la plantilla'

export interface VariableContenido {
  readonly nombre: string
  readonly valor: string
}

export const VARIABLES_CONTENIDO: readonly VariableContenido[] = [
  { nombre: 'Nombre Completo', valor: 'Luis Torres' },
  // La maqueta dibuja el DNI de la variable con un dígito menos que el del resumen.
  { nombre: 'Dni', valor: '712123456' },
  { nombre: 'Puesto', valor: 'Operario de Almacén' },
  { nombre: 'Área', valor: 'Operaciones / Almacén' },
  { nombre: 'Fecha_Inicio', valor: '20/11/2026' },
  { nombre: 'Remuneración', valor: 's/1,500.00' },
  { nombre: 'Tipo de Contrato', valor: 'Plazo indeterminado' },
]

export interface DatoConfirmacion {
  readonly etiqueta: string
  readonly valor: string
}

export interface ConfirmacionGeneracionDocumental {
  readonly titulo: string
  readonly subtitulo: string
  readonly archivo: string
  readonly version: string
  readonly envio: string
  readonly estado: string
  readonly colaborador: readonly DatoConfirmacion[]
  readonly documento: readonly DatoConfirmacion[]
}

// La p. 41 copia el cromo de Alta (breadcrumb «Colaborades» y hero «Alta de Colaborador»)
// y dibuja «accesión» en el subtítulo; se replican los artefactos literales.
export const CONFIRMACION_GENERACION_DOCUMENTAL: ConfirmacionGeneracionDocumental = {
  titulo: 'Documento generado exitosamente',
  subtitulo:
    'El documento ha sido creado y se ha ejecutado la accesión seleccionada.',
  archivo: 'Contrato de Trabajo.pdf',
  version: 'Contrato de trabajo (v2.0)',
  envio: 'Enviado a firmas',
  estado: 'Finalizado',
  colaborador: [
    { etiqueta: 'Colaborador', valor: 'Luis Torres Caycho' },
    { etiqueta: 'Puesto', valor: 'Operario de Almacén' },
    { etiqueta: 'Área / Subárea', valor: 'Operaciones / Almacén' },
  ],
  documento: [
    { etiqueta: 'Fecha de generación', valor: '15/10/2026' },
    { etiqueta: 'Código de Documento', valor: 'DOC-CTR-0000458' },
    { etiqueta: 'Versión', valor: 'V2.0' },
  ],
}

// Saltos y texto literales de la hoja dibujada en la p. 40, incluido «cons ectetuer» partido.
export const LINEAS_HOJA_CONTENIDO: readonly string[] = [
  'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore',
  'magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut',
  'aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat,',
  'vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril',
  'delenit augue duis dolore te feugait nulla facilisi.',
  'Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore',
]
