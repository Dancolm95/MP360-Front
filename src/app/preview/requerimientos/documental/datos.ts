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
