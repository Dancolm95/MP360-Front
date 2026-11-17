import { describe, expect, it } from 'vitest'
import type { ContractError } from '../../../../shared'
import type {
  Area,
  AreaId,
  AutorizacionRequerimiento,
  BorradorRequerimiento,
  CalendarioLaboralId,
  CatalogosRequerimientos,
  CoberturaRequerimiento,
  ColaboradorId,
  ColaboradorReemplazo,
  Departamento,
  DepartamentoId,
  DepartamentoUbicacion,
  DepartamentoUbicacionId,
  DetalleRequerimientoBorrador,
  DetalleRequerimientoCanceladoCompleto,
  DetalleRequerimientoCanceladoParcial,
  DetalleRequerimientoCompleto,
  Distrito,
  DistritoId,
  Empresa,
  EmpresaId,
  EstadoRequerimientoCompleto,
  EventoHistorial,
  EventoHistorialId,
  FechaISO,
  InstanteISO,
  MensajeEstadoDetalle,
  PlazoAdministrativoFijado,
  PlazoAdministrativoPendiente,
  PlazoRequerimiento,
  ProcesoSeleccionId,
  Provincia,
  ProvinciaId,
  Puesto,
  PuestoId,
  RequerimientoId,
  ResultadoDetalleUx04,
  SolicitudReversionId,
  Subarea,
  SubareaId,
  Usuario,
  UsuarioId,
} from '..'
import { crearDetalleUx04, modelarResultadoDetalle, valorResumen } from '..'
import type { CampoResumen, DetalleUx04, EntradaHistorial } from '..'

const id = <T>(value: string) => value as T
const fecha = (value: string) => value as FechaISO
const instante = (value: string) => value as InstanteISO

const requerimientoId = id<RequerimientoId>('req-1')

const empresaA: Empresa = { id: id<EmpresaId>('empresa-a'), nombre: 'Empresa A' }
const departamentoA: Departamento = {
  id: id<DepartamentoId>('departamento-a'),
  nombre: 'Departamento A',
}
const areaA: Area = {
  id: id<AreaId>('area-a'),
  nombre: 'Área A',
  departamentoId: departamentoA.id,
}
const subareaA: Subarea = {
  id: id<SubareaId>('subarea-a'),
  nombre: 'Subárea A',
  areaId: areaA.id,
}
const puestoAdministrativo: Puesto = {
  id: id<PuestoId>('puesto-administrativo'),
  nombre: 'Puesto A',
  areaId: areaA.id,
  subareaId: subareaA.id,
  clasificacion: 'administrativo',
}
const puestoOperativo: Puesto = {
  id: id<PuestoId>('puesto-operativo'),
  nombre: 'Puesto Operativo',
  areaId: areaA.id,
  subareaId: null,
  clasificacion: 'operativo',
}
const ubicacionA: DepartamentoUbicacion = {
  id: id<DepartamentoUbicacionId>('ubicacion-a'),
  nombre: 'Lima',
}
const provinciaA: Provincia = {
  id: id<ProvinciaId>('provincia-a'),
  nombre: 'Lima',
  departamentoId: ubicacionA.id,
}
const distritoA: Distrito = {
  id: id<DistritoId>('distrito-a'),
  nombre: 'Miraflores',
  provinciaId: provinciaA.id,
}
const usuarioA: Usuario = {
  id: id<UsuarioId>('usuario-a'),
  nombre: 'Usuario Creador',
}
const jefeOperaciones: Usuario = {
  id: id<UsuarioId>('usuario-jefe'),
  nombre: 'Jefa de Operaciones',
}
const colaboradorA: ColaboradorReemplazo = {
  id: id<ColaboradorId>('colaborador-a'),
  nombre: 'Colaborador A',
}

const catalogos: CatalogosRequerimientos = {
  motivos: [
    { motivo: 'reemplazo', etiqueta: 'Reemplazo' },
    { motivo: 'nueva-vacante', etiqueta: 'Nueva Vacante' },
    { motivo: 'practicante', etiqueta: 'Practicante' },
    { motivo: 'otros', etiqueta: 'Otros' },
  ],
  empresas: [empresaA],
  departamentos: [departamentoA],
  areas: [areaA],
  subareas: [subareaA],
  puestos: [puestoAdministrativo, puestoOperativo],
  departamentosUbicacion: [ubicacionA],
  provincias: [provinciaA],
  distritos: [distritoA],
  usuariosProximaTarea: [jefeOperaciones],
  usuarioProximaTareaPredeterminado: jefeOperaciones.id,
  calendarioLaboral: {
    id: id<CalendarioLaboralId>('calendario-1'),
    diasHabiles: [],
    excepciones: [],
  },
}

const autorizacion: AutorizacionRequerimiento = {
  requerimientoId,
  version: 3,
  capacidades: [],
  accionesPermitidas: [],
}

const plazoAdministrativo: PlazoAdministrativoFijado = {
  clasificacion: 'administrativo',
  fechaAprobacion: fecha('2026-11-10'),
  fechaObjetivo: fecha('2026-12-03'),
  cumplimiento: 'en-plazo',
  duracionDiasHabiles: 17,
  origen: 'fijado-administrativo',
  alerta: {
    nivel: 'media',
    umbral: {
      tipo: 'porcentaje',
      clasificacion: 'administrativo',
      porcentaje: 75,
    },
    diaHabil: 13,
    fecha: fecha('2026-11-26'),
  },
}

type DatosCompletos = Omit<
  DetalleRequerimientoCompleto,
  'id' | 'version' | 'estado' | 'fechaCreacion' | 'historial' | 'autorizacion'
>

const datosCompletos: DatosCompletos = {
  motivo: 'reemplazo',
  empresa: empresaA,
  colaboradorAReemplazar: colaboradorA,
  departamento: departamentoA,
  area: areaA,
  subarea: subareaA,
  puesto: puestoAdministrativo,
  remuneracion: { monto: 1500, moneda: 'PEN' },
  ubicacion: {
    departamento: ubicacionA,
    provincia: provinciaA,
    distrito: distritoA,
  },
  usuarioProximaTarea: jefeOperaciones,
  comentario: 'Justificación del requerimiento para la cobertura',
  plazo: plazoAdministrativo,
  cobertura: {
    solicitadas: 2,
    cubiertas: 1,
    pendientes: 1,
    primerosDiasReales: [{ fecha: fecha('2026-11-09') }],
  },
  remuneracionPreviaAlta: null,
  procesoSeleccion: null,
}

const borradorVacio: BorradorRequerimiento = {
  motivo: null,
  empresaId: null,
  colaboradorAReemplazarId: null,
  departamentoId: null,
  areaId: null,
  subareaId: null,
  puestoId: null,
  vacantes: null,
  remuneracion: null,
  ubicacion: null,
  usuarioProximaTareaId: null,
  comentario: null,
}

const borradorConDatos: BorradorRequerimiento = {
  motivo: 'reemplazo',
  empresaId: empresaA.id,
  colaboradorAReemplazarId: colaboradorA.id,
  departamentoId: departamentoA.id,
  areaId: areaA.id,
  subareaId: subareaA.id,
  puestoId: puestoAdministrativo.id,
  vacantes: 2,
  remuneracion: { monto: 1500, moneda: 'PEN' },
  ubicacion: {
    departamentoId: ubicacionA.id,
    provinciaId: provinciaA.id,
    distritoId: distritoA.id,
  },
  usuarioProximaTareaId: jefeOperaciones.id,
  comentario: 'Borrador con datos completos',
}

function detalleCompleto<E extends EstadoRequerimientoCompleto>(
  estado: E,
  cambios: Partial<DatosCompletos> = {},
  historial: readonly EventoHistorial[] = [],
): DetalleRequerimientoCompleto & { readonly estado: E } {
  return {
    id: requerimientoId,
    version: 3,
    estado,
    fechaCreacion: instante('2026-11-09T08:00:00Z'),
    historial: [...historial],
    autorizacion,
    ...datosCompletos,
    ...cambios,
  }
}

function detalleCanceladoCompleto(
  cambios: Partial<DatosCompletos> = {},
  historial: readonly EventoHistorial[] = [],
): DetalleRequerimientoCanceladoCompleto {
  return {
    ...detalleCompleto('aprobado', cambios, historial),
    estado: 'cancelado',
    datos: 'completos',
  }
}

function detalleBorrador(
  borrador: BorradorRequerimiento = borradorVacio,
  plazo: PlazoRequerimiento | null = null,
  cobertura: CoberturaRequerimiento | null = null,
  historial: readonly EventoHistorial[] = [],
): DetalleRequerimientoBorrador {
  return {
    id: requerimientoId,
    version: 1,
    estado: 'borrador',
    fechaCreacion: instante('2026-11-09T08:00:00Z'),
    historial: [...historial],
    autorizacion: { ...autorizacion, version: 1 },
    borrador,
    plazo,
    cobertura,
    remuneracionPreviaAlta: null,
    procesoSeleccion: null,
  }
}

function detalleCanceladoParcial(
  borrador: BorradorRequerimiento = borradorVacio,
  plazo: PlazoRequerimiento | null = null,
  cobertura: CoberturaRequerimiento | null = null,
): DetalleRequerimientoCanceladoParcial {
  return {
    ...detalleBorrador(borrador, plazo, cobertura),
    estado: 'cancelado',
    datos: 'parciales',
  }
}

const eventoCreacion: EventoHistorial = {
  id: id<EventoHistorialId>('ev-creacion'),
  usuario: usuarioA,
  fechaHora: instante('2026-11-01T08:00:00Z'),
  accion: 'creacion',
  estadoNuevo: 'borrador',
  comentario: null,
}

const eventoEdicion: EventoHistorial = {
  id: id<EventoHistorialId>('ev-edicion'),
  usuario: usuarioA,
  fechaHora: instante('2026-11-01T10:00:00Z'),
  accion: 'edicion',
  estadoAnterior: 'borrador',
  estadoNuevo: 'borrador',
  comentario: 'Corrección de datos',
}

const eventoEnvio: EventoHistorial = {
  id: id<EventoHistorialId>('ev-envio'),
  usuario: usuarioA,
  fechaHora: instante('2026-11-01T11:00:00Z'),
  accion: 'envio',
  estadoAnterior: 'borrador',
  estadoNuevo: 'pendiente-aprobacion',
  comentario: null,
}

const eventoObservacion: EventoHistorial = {
  id: id<EventoHistorialId>('ev-observacion'),
  usuario: jefeOperaciones,
  fechaHora: instante('2026-11-02T10:00:00Z'),
  accion: 'observacion',
  estadoAnterior: 'pendiente-aprobacion',
  estadoNuevo: 'observado',
  comentario: 'Falta detallar el puesto',
}

const eventoReenvio: EventoHistorial = {
  id: id<EventoHistorialId>('ev-reenvio'),
  usuario: usuarioA,
  fechaHora: instante('2026-11-03T08:00:00Z'),
  accion: 'reenvio',
  estadoAnterior: 'observado',
  estadoNuevo: 'pendiente-aprobacion',
  comentario: null,
}

const eventoAprobacion: EventoHistorial = {
  id: id<EventoHistorialId>('ev-aprobacion'),
  usuario: jefeOperaciones,
  fechaHora: instante('2026-11-04T09:00:00Z'),
  accion: 'aprobacion',
  estadoAnterior: 'pendiente-aprobacion',
  estadoNuevo: 'aprobado',
  comentario: 'Aprobado por el Jefe de Operaciones',
}

const eventoFijacion: EventoHistorial = {
  id: id<EventoHistorialId>('ev-fijacion'),
  usuario: usuarioA,
  fechaHora: instante('2026-11-04T10:00:00Z'),
  accion: 'fijacion-plazo',
  plazoNuevoDias: 17,
  fechaObjetivoNueva: null,
}

const eventoAlerta: EventoHistorial = {
  id: id<EventoHistorialId>('ev-alerta'),
  usuario: usuarioA,
  fechaHora: instante('2026-11-06T09:00:00Z'),
  accion: 'alerta',
  nivel: 'media',
  fechaObjetivo: fecha('2026-12-03'),
}

const eventoAjuste: EventoHistorial = {
  id: id<EventoHistorialId>('ev-ajuste'),
  usuario: usuarioA,
  fechaHora: instante('2026-11-07T11:00:00Z'),
  accion: 'ajuste-plazo',
  motivo: 'Ampliación por complejidad',
  plazoAnteriorDias: 17,
  plazoNuevoDias: 20,
  fechaObjetivoAnterior: fecha('2026-12-03'),
  fechaObjetivoNueva: fecha('2026-12-08'),
}

const eventoApertura: EventoHistorial = {
  id: id<EventoHistorialId>('ev-apertura'),
  usuario: usuarioA,
  fechaHora: instante('2026-11-08T09:00:00Z'),
  accion: 'apertura-proceso',
  proceso: { id: id<ProcesoSeleccionId>('proceso-1') },
}

const eventoPrimerDia: EventoHistorial = {
  id: id<EventoHistorialId>('ev-primer-dia'),
  usuario: usuarioA,
  fechaHora: instante('2026-11-09T08:00:00Z'),
  accion: 'primer-dia-real',
  fecha: fecha('2026-11-18'),
}

const eventoSolicitud: EventoHistorial = {
  id: id<EventoHistorialId>('ev-solicitud'),
  usuario: usuarioA,
  fechaHora: instante('2026-11-10T09:00:00Z'),
  accion: 'solicitud-reversion',
  solicitudId: id<SolicitudReversionId>('solicitud-1'),
  motivo: 'Cobertura registrada por error',
}

const eventoReversion: EventoHistorial = {
  id: id<EventoHistorialId>('ev-reversion'),
  usuario: usuarioA,
  fechaHora: instante('2026-11-11T10:00:00Z'),
  accion: 'reversion-cobertura',
  solicitudId: id<SolicitudReversionId>('solicitud-1'),
  origen: 'seleccion',
  motivo: 'Cobertura registrada por error',
  colaboradorAfectadoId: colaboradorA.id,
  efectoCobertura: {
    solicitadas: 2,
    cubiertas: 1,
    pendientes: 1,
    estadoResultante: 'en-reclutamiento',
  },
}

const eventoVencimiento: EventoHistorial = {
  id: id<EventoHistorialId>('ev-vencimiento'),
  usuario: usuarioA,
  fechaHora: instante('2026-11-12T09:00:00Z'),
  accion: 'vencimiento',
  fechaObjetivo: fecha('2026-12-03'),
  fechaIncumplimiento: fecha('2026-12-04'),
}

const eventoCancelacion: EventoHistorial = {
  id: id<EventoHistorialId>('ev-cancelacion'),
  usuario: jefeOperaciones,
  fechaHora: instante('2026-11-13T09:00:00Z'),
  accion: 'cancelacion',
  estadoAnterior: 'en-reclutamiento',
  estadoNuevo: 'cancelado',
  causal: 'menor-carga-laboral',
  comentario: 'Cancelado por menor carga laboral',
}

const historialCompleto: readonly EventoHistorial[] = [
  eventoEnvio,
  eventoCreacion,
  eventoAjuste,
  eventoCancelacion,
  eventoAprobacion,
  eventoPrimerDia,
  eventoObservacion,
  eventoVencimiento,
  eventoFijacion,
  eventoReversion,
  eventoReenvio,
  eventoAlerta,
  eventoSolicitud,
  eventoApertura,
  eventoEdicion,
]

const ACCIONES_ESPERADAS: readonly EntradaHistorial['accion'][] = [
  'cancelacion',
  'vencimiento',
  'reversion-cobertura',
  'solicitud-reversion',
  'primer-dia-real',
  'apertura-proceso',
  'ajuste-plazo',
  'alerta',
  'fijacion-plazo',
  'aprobacion',
  'reenvio',
  'observacion',
  'envio',
  'edicion',
  'creacion',
]

const ESTADOS_PERSISTIDOS: readonly EstadoRequerimientoCompleto[] = [
  'pendiente-aprobacion',
  'observado',
  'aprobado',
  'en-reclutamiento',
  'cubierto',
]

const ETIQUETAS_ESTADO: Readonly<Record<EstadoRequerimientoCompleto, string>> = {
  'pendiente-aprobacion': 'Pendiente de aprobación',
  observado: 'Observado',
  aprobado: 'Aprobado',
  'en-reclutamiento': 'En reclutamiento',
  cubierto: 'Cubierto',
}

function valor(modelo: DetalleUx04, campo: CampoResumen): string {
  return valorResumen(modelo.resumen, campo)
}

function entrada(
  entradas: readonly EntradaHistorial[],
  accion: EntradaHistorial['accion'],
): EntradaHistorial {
  const encontrada = entradas.find((item) => item.accion === accion)
  if (encontrada === undefined) {
    throw new Error(`No se encontró el evento ${accion}`)
  }
  return encontrada
}

function dato(entradaHistorial: EntradaHistorial, etiqueta: string): string | undefined {
  return entradaHistorial.detalles.find((item) => item.etiqueta === etiqueta)
    ?.valor
}

function lectura(resultado: ResultadoDetalleUx04): MensajeEstadoDetalle {
  if (resultado.status === 'ok') {
    throw new Error('Se esperaba un estado de lectura sin detalle')
  }
  return resultado.lectura
}

describe('detalle UX-04: resumen en lectura', () => {
  it('presenta todos los campos del detalle completo', () => {
    const modelo = crearDetalleUx04(detalleCompleto('aprobado'))

    expect(modelo.cabecera).toEqual({
      id: 'req-1',
      version: 3,
      versionEtiqueta: 'Versión 3',
      estado: 'aprobado',
      estadoEtiqueta: 'Aprobado',
      fechaCreacion: '2026-11-09T08:00:00Z',
      fechaCreacionTexto: '09/11/2026 08:00',
    })
    expect(valor(modelo, 'motivo')).toBe('Reemplazo')
    expect(valor(modelo, 'empresa')).toBe('Empresa A')
    expect(valor(modelo, 'colaboradorAReemplazar')).toBe('Colaborador A')
    expect(valor(modelo, 'departamento')).toBe('Departamento A')
    expect(valor(modelo, 'area')).toBe('Área A')
    expect(valor(modelo, 'subarea')).toBe('Subárea A')
    expect(valor(modelo, 'puesto')).toBe('Puesto A')
    expect(valor(modelo, 'clasificacion')).toBe('Administrativo')
    expect(valor(modelo, 'remuneracion')).toBe('S/ 1,500.00')
    expect(valor(modelo, 'ubicacion')).toBe('Lima / Lima / Miraflores')
    expect(valor(modelo, 'usuarioProximaTarea')).toBe('Jefa de Operaciones')
    expect(valor(modelo, 'comentario')).toBe(
      'Justificación del requerimiento para la cobertura',
    )
  })

  it.each(ESTADOS_PERSISTIDOS)(
    'modela el detalle completo en el estado %s',
    (estado) => {
      const modelo = crearDetalleUx04(detalleCompleto(estado))

      expect(modelo.cabecera.estado).toBe(estado)
      expect(modelo.cabecera.estadoEtiqueta).toBe(ETIQUETAS_ESTADO[estado])
      expect(valor(modelo, 'motivo')).toBe('Reemplazo')
    },
  )

  it('modela el Cancelado completo y el Cancelado parcial por separado', () => {
    const completo = crearDetalleUx04(detalleCanceladoCompleto())
    expect(completo.cabecera.estadoEtiqueta).toBe('Cancelado')
    expect(completo.cobertura.disponible).toBe(true)
    expect(completo.plazo.disponible).toBe(true)

    const parcial = crearDetalleUx04(detalleCanceladoParcial())
    expect(parcial.cabecera.estadoEtiqueta).toBe('Cancelado')
    expect(parcial.cobertura.disponible).toBe(false)
    expect(parcial.plazo.disponible).toBe(false)
  })

  it('muestra «Sin subárea» cuando el puesto no tiene subárea', () => {
    const modelo = crearDetalleUx04(
      detalleCompleto('aprobado', {
        subarea: null,
        puesto: puestoOperativo,
      }),
    )

    expect(valor(modelo, 'subarea')).toBe('Sin subárea')
    expect(valor(modelo, 'clasificacion')).toBe('Operativo')
  })

  it('no presenta colaborador a reemplazar fuera del motivo Reemplazo', () => {
    const modelo = crearDetalleUx04(
      detalleCompleto('aprobado', {
        motivo: 'nueva-vacante',
        colaboradorAReemplazar: null,
      }),
    )

    expect(valor(modelo, 'colaboradorAReemplazar')).toBe('No aplica')
  })

  it('presenta el Borrador con los datos persistidos y sin inventar cobertura ni plazo', () => {
    const modelo = crearDetalleUx04(detalleBorrador(borradorConDatos), {
      catalogos,
      colaboradores: [colaboradorA],
    })

    expect(valor(modelo, 'motivo')).toBe('Reemplazo')
    expect(valor(modelo, 'empresa')).toBe('Empresa A')
    expect(valor(modelo, 'colaboradorAReemplazar')).toBe('Colaborador A')
    expect(valor(modelo, 'departamento')).toBe('Departamento A')
    expect(valor(modelo, 'area')).toBe('Área A')
    expect(valor(modelo, 'subarea')).toBe('Subárea A')
    expect(valor(modelo, 'puesto')).toBe('Puesto A')
    expect(valor(modelo, 'clasificacion')).toBe('Administrativo')
    expect(valor(modelo, 'remuneracion')).toBe('S/ 1,500.00')
    expect(valor(modelo, 'ubicacion')).toBe('Lima / Lima / Miraflores')
    expect(valor(modelo, 'usuarioProximaTarea')).toBe('Jefa de Operaciones')
    expect(valor(modelo, 'comentario')).toBe('Borrador con datos completos')

    expect(modelo.cobertura).toEqual({
      disponible: false,
      solicitadas: null,
      cubiertas: null,
      pendientes: null,
      primerosDiasReales: [],
      completa: false,
      invariante: null,
    })
    expect(modelo.plazo).toMatchObject({
      disponible: false,
      fechaAprobacion: null,
      fechaObjetivo: null,
      duracionDiasHabiles: null,
      duracionTexto: 'Sin determinar',
      cumplimiento: null,
      alerta: null,
    })
  })

  it('declara los campos ausentes del Borrador sin sustituirlos por datos ficticios', () => {
    const modelo = crearDetalleUx04(detalleBorrador())

    expect(valor(modelo, 'motivo')).toBe('Sin completar')
    expect(valor(modelo, 'empresa')).toBe('Sin completar')
    expect(valor(modelo, 'colaboradorAReemplazar')).toBe('Sin completar')
    expect(valor(modelo, 'departamento')).toBe('Sin completar')
    expect(valor(modelo, 'area')).toBe('Sin completar')
    expect(valor(modelo, 'subarea')).toBe('Sin subárea')
    expect(valor(modelo, 'puesto')).toBe('Sin completar')
    expect(valor(modelo, 'clasificacion')).toBe('Sin determinar')
    expect(valor(modelo, 'remuneracion')).toBe('Sin completar')
    expect(valor(modelo, 'ubicacion')).toBe('Sin completar')
    expect(valor(modelo, 'usuarioProximaTarea')).toBe('Sin asignar')
    expect(valor(modelo, 'comentario')).toBe('Sin completar')
  })
})

describe('detalle UX-04: cobertura', () => {
  it('expone los valores del contrato y verifica la invariante sin recalcularlos', () => {
    const modelo = crearDetalleUx04(
      detalleCompleto('en-reclutamiento', {
        cobertura: {
          solicitadas: 3,
          cubiertas: 1,
          pendientes: 2,
          primerosDiasReales: [
            { fecha: fecha('2026-11-09') },
            { fecha: fecha('2026-11-12') },
          ],
        },
      }),
    )

    expect(modelo.cobertura).toEqual({
      disponible: true,
      solicitadas: 3,
      cubiertas: 1,
      pendientes: 2,
      primerosDiasReales: [
        { fecha: '2026-11-09', fechaTexto: '09/11/2026' },
        { fecha: '2026-11-12', fechaTexto: '12/11/2026' },
      ],
      completa: false,
      invariante: { esperado: 2, consistente: true },
    })
  })

  it('marca completa solo cuando los pendientes son cero', () => {
    const modelo = crearDetalleUx04(
      detalleCompleto('cubierto', {
        cobertura: {
          solicitadas: 2,
          cubiertas: 2,
          pendientes: 0,
          primerosDiasReales: [{ fecha: fecha('2026-11-09') }],
        },
      }),
    )

    expect(modelo.cobertura.completa).toBe(true)
    expect(modelo.cobertura.pendientes).toBe(0)
    expect(modelo.cobertura.invariante).toEqual({
      esperado: 0,
      consistente: true,
    })
  })

  it('señala una invariante inconsistente sin sustituir el pendiente recibido', () => {
    const modelo = crearDetalleUx04(
      detalleCompleto('en-reclutamiento', {
        cobertura: {
          solicitadas: 3,
          cubiertas: 1,
          pendientes: 5,
          primerosDiasReales: [],
        },
      }),
    )

    expect(modelo.cobertura.pendientes).toBe(5)
    expect(modelo.cobertura.invariante).toEqual({
      esperado: 2,
      consistente: false,
    })
    expect(modelo.cobertura.completa).toBe(false)
  })
})

describe('detalle UX-04: plazo y alertas', () => {
  it('proyecta la clasificación, duración, fechas, cumplimiento y alerta del contrato', () => {
    const modelo = crearDetalleUx04(detalleCompleto('aprobado'))

    expect(modelo.plazo).toMatchObject({
      disponible: true,
      clasificacion: 'administrativo',
      clasificacionEtiqueta: 'Administrativo',
      origen: 'fijado-administrativo',
      origenEtiqueta: 'Fijado por RR. HH.',
      duracionDiasHabiles: 17,
      duracionTexto: '17 días hábiles',
      fechaAprobacion: '2026-11-10',
      fechaAprobacionTexto: '10/11/2026',
      fechaObjetivo: '2026-12-03',
      fechaObjetivoTexto: '03/12/2026',
      cumplimiento: 'en-plazo',
      cumplimientoEtiqueta: 'En plazo',
      incumplido: false,
    })
    expect(modelo.plazo.alerta).toMatchObject({
      nivel: 'media',
      nivelEtiqueta: 'Media',
      umbralTexto: '75 % del plazo',
      diaHabil: 13,
      fecha: '2026-11-26',
      fechaTexto: '26/11/2026',
    })
  })

  it('mantiene separados el estado, la alerta y el vencimiento', () => {
    const conAlerta = crearDetalleUx04(detalleCompleto('aprobado'))
    expect(conAlerta.cabecera.estado).toBe('aprobado')
    expect(conAlerta.plazo.cumplimiento).toBe('en-plazo')
    expect(conAlerta.plazo.incumplido).toBe(false)
    expect(conAlerta.plazo.alerta?.nivel).toBe('media')

    const vencido = crearDetalleUx04(
      detalleCompleto('en-reclutamiento', {
        plazo: {
          ...plazoAdministrativo,
          cumplimiento: 'incumplido',
          alerta: null,
        },
      }),
    )
    expect(vencido.cabecera.estado).toBe('en-reclutamiento')
    expect(vencido.plazo.alerta).toBeNull()
    expect(vencido.plazo.cumplimiento).toBe('incumplido')
    expect(vencido.plazo.incumplido).toBe(true)
  })

  it('no presenta fecha objetivo antes de aprobar y conserva la duración aplicable', () => {
    const modelo = crearDetalleUx04(
      detalleBorrador(borradorVacio, {
        clasificacion: 'operativo',
        fechaAprobacion: null,
        fechaObjetivo: null,
        cumplimiento: 'pendiente',
        duracionDiasHabiles: 10,
        origen: 'operativo-fijo',
        alerta: null,
      }),
    )

    expect(modelo.plazo).toMatchObject({
      disponible: true,
      clasificacion: 'operativo',
      duracionDiasHabiles: 10,
      duracionTexto: '10 días hábiles',
      fechaAprobacion: null,
      fechaObjetivo: null,
      cumplimiento: 'pendiente',
      cumplimientoEtiqueta: 'Pendiente',
      alerta: null,
    })
  })

  it('muestra «Pendiente de definir» para un administrativo sin plazo fijado', () => {
    const plazoPendiente: PlazoAdministrativoPendiente = {
      clasificacion: 'administrativo',
      fechaAprobacion: null,
      fechaObjetivo: null,
      cumplimiento: 'pendiente',
      duracionDiasHabiles: null,
      origen: 'pendiente',
      alerta: null,
    }

    const modelo = crearDetalleUx04(
      detalleBorrador(borradorVacio, plazoPendiente),
    )

    expect(modelo.plazo.duracionTexto).toBe('Pendiente de definir')
    expect(modelo.plazo.origenEtiqueta).toBe('Pendiente de definir')
    expect(modelo.plazo.fechaObjetivo).toBeNull()
  })

  it('no inventa duración, cumplimiento ni alerta cuando el plazo no existe', () => {
    const modelo = crearDetalleUx04(detalleBorrador())

    expect(modelo.plazo).toMatchObject({
      disponible: false,
      clasificacion: null,
      duracionDiasHabiles: null,
      duracionTexto: 'Sin determinar',
      fechaAprobacion: null,
      fechaObjetivo: null,
      cumplimiento: null,
      cumplimientoEtiqueta: 'Sin determinar',
      incumplido: false,
      alerta: null,
    })
  })
})

describe('detalle UX-04: historial', () => {
  const historial = crearDetalleUx04(
    detalleCanceladoCompleto({}, historialCompleto),
  ).historial

  it('normaliza los once tipos de evento y conserva sus detalles propios', () => {
    expect(historial.total).toBe(15)
    expect(historial.vacio).toBe(false)
    expect(new Set(historial.entradas.map((item) => item.accion))).toEqual(
      new Set(ACCIONES_ESPERADAS),
    )

    expect(entrada(historial.entradas, 'edicion').accionEtiqueta).toBe('Edición')
    expect(entrada(historial.entradas, 'envio').accionEtiqueta).toBe(
      'Envío a aprobación',
    )
    expect(entrada(historial.entradas, 'reenvio').accionEtiqueta).toBe(
      'Reenvío a aprobación',
    )
    expect(entrada(historial.entradas, 'aprobacion').accionEtiqueta).toBe(
      'Aprobación',
    )
    expect(entrada(historial.entradas, 'observacion').accionEtiqueta).toBe(
      'Observación',
    )

    const creacion = entrada(historial.entradas, 'creacion')
    expect(creacion.estadoAnterior).toBeNull()
    expect(creacion.estadoNuevo).toBe('borrador')
    expect(creacion.estadoNuevoEtiqueta).toBe('Borrador')
    expect(creacion.comentario).toBeNull()

    const cancelacion = entrada(historial.entradas, 'cancelacion')
    expect(cancelacion.estadoAnteriorEtiqueta).toBe('En reclutamiento')
    expect(cancelacion.estadoNuevoEtiqueta).toBe('Cancelado')
    expect(cancelacion.comentario).toBe('Cancelado por menor carga laboral')
    expect(dato(cancelacion, 'Causal')).toBe(
      'Menor carga laboral que la prevista',
    )

    const ajuste = entrada(historial.entradas, 'ajuste-plazo')
    expect(dato(ajuste, 'Motivo')).toBe('Ampliación por complejidad')
    expect(dato(ajuste, 'Plazo anterior')).toBe('17 días hábiles')
    expect(dato(ajuste, 'Plazo nuevo')).toBe('20 días hábiles')
    expect(dato(ajuste, 'Fecha objetivo anterior')).toBe('03/12/2026')
    expect(dato(ajuste, 'Fecha objetivo nueva')).toBe('08/12/2026')

    const fijacion = entrada(historial.entradas, 'fijacion-plazo')
    expect(dato(fijacion, 'Plazo fijado')).toBe('17 días hábiles')
    expect(dato(fijacion, 'Fecha objetivo')).toBe('Sin fecha objetivo')

    const alerta = entrada(historial.entradas, 'alerta')
    expect(alerta.accionEtiqueta).toBe('Alerta')
    expect(dato(alerta, 'Nivel de alerta')).toBe('Media')
    expect(dato(alerta, 'Fecha objetivo')).toBe('03/12/2026')
    expect(alerta.estadoNuevo).toBeNull()

    const vencimiento = entrada(historial.entradas, 'vencimiento')
    expect(vencimiento.accionEtiqueta).toBe('Vencimiento')
    expect(dato(vencimiento, 'Fecha objetivo')).toBe('03/12/2026')
    expect(dato(vencimiento, 'Fecha de incumplimiento')).toBe('04/12/2026')

    expect(dato(entrada(historial.entradas, 'apertura-proceso'), 'Proceso')).toBe(
      'proceso-1',
    )

    const solicitud = entrada(historial.entradas, 'solicitud-reversion')
    expect(dato(solicitud, 'Solicitud')).toBe('solicitud-1')
    expect(dato(solicitud, 'Motivo')).toBe('Cobertura registrada por error')

    const reversion = entrada(historial.entradas, 'reversion-cobertura')
    expect(dato(reversion, 'Solicitud')).toBe('solicitud-1')
    expect(dato(reversion, 'Origen')).toBe('Selección')
    expect(dato(reversion, 'Motivo')).toBe('Cobertura registrada por error')
    expect(dato(reversion, 'Colaborador afectado')).toBe('colaborador-a')
    expect(dato(reversion, 'Solicitadas')).toBe('2')
    expect(dato(reversion, 'Cubiertas')).toBe('1')
    expect(dato(reversion, 'Pendientes')).toBe('1')
    expect(dato(reversion, 'Estado resultante')).toBe('En reclutamiento')

    expect(
      dato(
        entrada(historial.entradas, 'primer-dia-real'),
        'Fecha del primer día real',
      ),
    ).toBe('18/11/2026')
  })

  it('ordena del evento más reciente al más antiguo aunque llegue desordenado', () => {
    expect(historial.orden).toBe('reciente-primero')
    expect(historial.entradas.map((item) => item.accion)).toEqual(
      ACCIONES_ESPERADAS,
    )

    const cancelacion = entrada(historial.entradas, 'cancelacion')
    expect(cancelacion.fecha).toBe('13/11/2026')
    expect(cancelacion.hora).toBe('09:00')
    expect(cancelacion.fechaHoraTexto).toBe('13/11/2026 09:00')
    expect(cancelacion.usuario).toEqual(jefeOperaciones)
  })

  it('declara el historial vacío sin inventar entradas', () => {
    expect(crearDetalleUx04(detalleBorrador()).historial).toEqual({
      orden: 'reciente-primero',
      entradas: [],
      vacio: true,
      total: 0,
    })
  })

  it('conserva el orden recibido cuando dos eventos comparten instante', () => {
    const eventosEmpate: readonly EventoHistorial[] = [
      {
        id: id<EventoHistorialId>('ev-empate-1'),
        usuario: usuarioA,
        fechaHora: instante('2026-11-10T09:00:00Z'),
        accion: 'envio',
        estadoAnterior: 'borrador',
        estadoNuevo: 'pendiente-aprobacion',
        comentario: null,
      },
      {
        id: id<EventoHistorialId>('ev-empate-2'),
        usuario: usuarioA,
        fechaHora: instante('2026-11-10T09:00:00Z'),
        accion: 'edicion',
        estadoAnterior: 'borrador',
        estadoNuevo: 'borrador',
        comentario: null,
      },
    ]

    const historialEmpate = crearDetalleUx04(
      detalleCompleto('pendiente-aprobacion', {}, eventosEmpate),
    ).historial

    expect(historialEmpate.entradas.map((item) => item.id)).toEqual([
      id<EventoHistorialId>('ev-empate-1'),
      id<EventoHistorialId>('ev-empate-2'),
    ])
  })

  it('deja el comentario en null cuando el evento no lo trae', () => {
    expect(entrada(historial.entradas, 'envio').comentario).toBeNull()
    expect(entrada(historial.entradas, 'ajuste-plazo').comentario).toBeNull()
  })
})

describe('detalle UX-04: estados de lectura', () => {
  it('entrega el detalle modelado cuando el contrato responde ok', () => {
    const resultado = modelarResultadoDetalle({
      status: 'ok',
      datos: detalleCompleto('aprobado'),
    })

    expect(resultado.status).toBe('ok')
    if (resultado.status !== 'ok') return
    expect(resultado.detalle.cabecera.id).toBe('req-1')
    expect(valor(resultado.detalle, 'motivo')).toBe('Reemplazo')
  })

  it('distingue los cuatro estados de lectura distintos de ok', () => {
    const noEncontrado = modelarResultadoDetalle({ status: 'no-encontrado' })
    const sinPermisos = modelarResultadoDetalle({ status: 'forbidden' })
    const sesionFinalizada = modelarResultadoDetalle({
      status: 'sesion-finalizada',
    })
    const error = modelarResultadoDetalle({
      status: 'error',
      error: { message: 'Fallo de red', retryable: true },
    })

    expect([
      noEncontrado.status,
      sinPermisos.status,
      sesionFinalizada.status,
      error.status,
    ]).toEqual([
      'no-encontrado',
      'forbidden',
      'sesion-finalizada',
      'error',
    ])

    const lecturas = [
      lectura(noEncontrado),
      lectura(sinPermisos),
      lectura(sesionFinalizada),
      lectura(error),
    ]
    expect(new Set(lecturas.map((item) => item.titulo)).size).toBe(4)
    expect(new Set(lecturas.map((item) => item.mensaje)).size).toBe(4)
    expect(lecturas.map((item) => item.puedeReintentar)).toEqual([
      false,
      false,
      false,
      true,
    ])
  })

  it('solo permite reintentar el error cuando el contrato lo indica', () => {
    const error: ContractError = {
      message: 'No se pudo cargar',
      retryable: false,
    }
    const resultado = modelarResultadoDetalle({ status: 'error', error })

    expect(lectura(resultado).puedeReintentar).toBe(false)
    expect(lectura(resultado).mensaje).toBe('No se pudo cargar')
    expect(resultado.status).not.toBe('ok')
    if (resultado.status === 'error') {
      expect(resultado.error).toBe(error)
    }

    const sinMensaje = modelarResultadoDetalle({
      status: 'error',
      error: { message: '   ', retryable: true },
    })
    expect(lectura(sinMensaje).mensaje).not.toBe('')
    expect(lectura(sinMensaje).puedeReintentar).toBe(true)
  })
})
