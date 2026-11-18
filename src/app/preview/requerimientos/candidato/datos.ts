export interface FichaCandidato {
  readonly clave: string
  readonly etiqueta: string
  readonly valor: string
  readonly insignia?: boolean
}

export const CANDIDATO = {
  nombre: 'Luis Torres',
  documento: '7142123456',
  nacionalidad: 'Peruano',
  estado: 'Preseleccionado',
} as const

export const FICHA: readonly FichaCandidato[] = [
  { clave: 'puesto', etiqueta: 'Puesto solicitado', valor: 'Operario de Almacén' },
  { clave: 'empresa', etiqueta: 'Empresa', valor: 'Honda', insignia: true },
  { clave: 'tipo', etiqueta: 'Tipo de Personal', valor: 'Operativo' },
  { clave: 'responsable', etiqueta: 'Responsable', valor: 'Mirella Lazo' },
  { clave: 'actualizacion', etiqueta: 'Última actualización', valor: '12/09/2026 - 10:30' },
]

export type EstadoEtapa = 'completada' | 'actual' | 'pendiente'

export const ETAPAS: readonly { etiqueta: string; estado: EstadoEtapa }[] = [
  { etiqueta: 'Evaluación', estado: 'completada' },
  { etiqueta: 'Preselección', estado: 'actual' },
  { etiqueta: 'Formulario', estado: 'pendiente' },
  { etiqueta: 'Etapa de Prueba', estado: 'pendiente' },
  { etiqueta: 'Decisión', estado: 'pendiente' },
]

export const EVALUACION = {
  entrevista: 'Entrevista realizada - 20 / 10 / 2026',
  campos: [
    { etiqueta: 'Formación', valor: 'Secundaria Completa' },
    { etiqueta: 'Experiencia', valor: '2 años en almacén' },
    { etiqueta: 'Conocimientos', valor: 'Inventario, picking y packing' },
    { etiqueta: 'Disponibilidad', valor: 'Inmediata' },
  ],
  comentario:
    'Cuenta con experiencia y despacho de mercancía. Buen conocimiento de inventarios.',
} as const

export type VarianteAccion = 'primario' | 'contorno' | 'peligro'

export const ACCIONES: readonly {
  etiqueta: string
  variante: VarianteAccion
  icono?: string
}[] = [
  { etiqueta: 'Enviar Formulario', variante: 'primario' },
  { etiqueta: 'Registrar Feedback', variante: 'contorno' },
  { etiqueta: 'Marcar como no Viable', variante: 'peligro', icono: 'block' },
]

export const DOCUMENTOS: readonly {
  nombre: string
  detalle: string
  estado: string
}[] = [
  { nombre: 'CV documentado', detalle: 'Adjunto . PDF. 425KB', estado: 'Validado' },
  { nombre: 'CUL', detalle: 'Adjunto . PDF. 425KB', estado: 'Validado' },
  { nombre: 'Documento de Identidad', detalle: 'Adjunto . PDF. 425KB', estado: 'Validado' },
]

export const HISTORIAL: readonly {
  fecha: string
  titulo: string
  completado: boolean
}[] = [
  { fecha: '12/10/2026', titulo: 'Requerimiento aprobado', completado: true },
  { fecha: '12/10/2026', titulo: 'Postulante vinculado al requerimiento', completado: true },
  { fecha: '13/10/2026', titulo: 'Entrevista realizada', completado: true },
  { fecha: '13/10/2026', titulo: 'Candidato preseleccionado', completado: false },
]
