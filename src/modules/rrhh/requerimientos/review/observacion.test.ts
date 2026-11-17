import { describe, expect, it } from 'vitest'
import type {
  Area,
  AreaId,
  CalendarioLaboralId,
  CatalogosRequerimientos,
  ColaboradorId,
  ColaboradorReemplazo,
  ConfirmacionEnvio,
  Departamento,
  DepartamentoId,
  DepartamentoUbicacion,
  DepartamentoUbicacionId,
  DetalleRequerimientoCompleto,
  Distrito,
  DistritoId,
  Empresa,
  EmpresaId,
  EstadoRequerimientoCompleto,
  EventoHistorial,
  EventoHistorialId,
  InstanteISO,
  Provincia,
  ProvinciaId,
  Puesto,
  PuestoId,
  RequerimientoId,
  Subarea,
  SubareaId,
  Usuario,
  UsuarioId,
} from '../contracts'
import {
  createMockComandosRequerimientos,
  comandoFixture,
  creacionFixture,
  type MockCommandResults,
} from '../fixtures'
import { formularioDesdeDetalle } from '../form/helpers'
import {
  crearEstadoEdicion,
  editarFormulario,
  enviarAprobacion,
  revisar,
} from './estado'
import { observacionVigente } from './observacion'

const id = <T>(value: string) => value as T

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
const puestoA: Puesto = {
  id: id<PuestoId>('puesto-a'),
  nombre: 'Puesto A',
  areaId: areaA.id,
  subareaId: subareaA.id,
  clasificacion: 'operativo',
}
const ubicacionA: DepartamentoUbicacion = {
  id: id<DepartamentoUbicacionId>('ubicacion-a'),
  nombre: 'Ubicación A',
}
const provinciaA: Provincia = {
  id: id<ProvinciaId>('provincia-a'),
  nombre: 'Provincia A',
  departamentoId: ubicacionA.id,
}
const distritoA: Distrito = {
  id: id<DistritoId>('distrito-a'),
  nombre: 'Distrito A',
  provinciaId: provinciaA.id,
}
const usuarioA: Usuario = { id: id<UsuarioId>('usuario-a'), nombre: 'Usuario A' }
const jefeOperaciones: Usuario = {
  id: id<UsuarioId>('usuario-jefe'),
  nombre: 'Jefa de Operaciones',
}
const colaboradorA: ColaboradorReemplazo = {
  id: id<ColaboradorId>('colaborador-a'),
  nombre: 'Colaborador A',
}
const requerimientoId = id<RequerimientoId>('req-1')
const instante = '2026-11-16T10:00:00Z' as InstanteISO

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
  puestos: [puestoA],
  departamentosUbicacion: [ubicacionA],
  provincias: [provinciaA],
  distritos: [distritoA],
  usuariosProximaTarea: [usuarioA],
  usuarioProximaTareaPredeterminado: usuarioA.id,
  calendarioLaboral: {
    id: id<CalendarioLaboralId>('calendario-1'),
    diasHabiles: [],
    excepciones: [],
  },
}

const autorizacion = {
  requerimientoId,
  version: 3,
  capacidades: [],
  accionesPermitidas: [],
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
  puesto: puestoA,
  remuneracion: { monto: 1500, moneda: 'PEN' },
  ubicacion: {
    departamento: ubicacionA,
    provincia: provinciaA,
    distrito: distritoA,
  },
  usuarioProximaTarea: usuarioA,
  comentario: 'Justificación del requerimiento para la cobertura',
  plazo: {
    clasificacion: 'operativo',
    fechaAprobacion: null,
    fechaObjetivo: null,
    cumplimiento: 'pendiente',
    duracionDiasHabiles: 10,
    origen: 'operativo-fijo',
    alerta: null,
  },
  cobertura: {
    solicitadas: 2,
    cubiertas: 0,
    pendientes: 2,
    primerosDiasReales: [],
  },
  remuneracionPreviaAlta: null,
  procesoSeleccion: null,
}

const historialSinObservacion: EventoHistorial[] = [
  {
    id: id<EventoHistorialId>('evento-creacion'),
    usuario: usuarioA,
    fechaHora: '2026-11-09T08:00:00Z' as InstanteISO,
    accion: 'creacion',
    estadoNuevo: 'borrador',
    comentario: null,
  },
  {
    id: id<EventoHistorialId>('evento-envio'),
    usuario: usuarioA,
    fechaHora: '2026-11-09T09:00:00Z' as InstanteISO,
    accion: 'envio',
    estadoAnterior: 'borrador',
    estadoNuevo: 'pendiente-aprobacion',
    comentario: null,
  },
]

const historialObservado: EventoHistorial[] = [
  {
    id: id<EventoHistorialId>('evento-observacion-1'),
    usuario: jefeOperaciones,
    fechaHora: '2026-11-10T09:00:00Z' as InstanteISO,
    accion: 'observacion',
    estadoAnterior: 'pendiente-aprobacion',
    estadoNuevo: 'observado',
    comentario: 'Primera observación',
  },
  {
    id: id<EventoHistorialId>('evento-reenvio'),
    usuario: usuarioA,
    fechaHora: '2026-11-12T08:00:00Z' as InstanteISO,
    accion: 'reenvio',
    estadoAnterior: 'observado',
    estadoNuevo: 'pendiente-aprobacion',
    comentario: null,
  },
  {
    id: id<EventoHistorialId>('evento-observacion-2'),
    usuario: jefeOperaciones,
    fechaHora: '2026-11-14T15:30:00Z' as InstanteISO,
    accion: 'observacion',
    estadoAnterior: 'pendiente-aprobacion',
    estadoNuevo: 'observado',
    comentario: 'Falta detallar la ubicación del puesto',
  },
  ...historialSinObservacion,
]

function detalle<E extends EstadoRequerimientoCompleto>(
  estado: E,
  historial: readonly EventoHistorial[],
): DetalleRequerimientoCompleto & { readonly estado: E } {
  return {
    id: requerimientoId,
    version: 3,
    estado,
    fechaCreacion: instante,
    historial: [...historial],
    autorizacion,
    ...datosCompletos,
  }
}

const detalleObservado = detalle('observado', historialObservado)

const confirmacionEnvio: ConfirmacionEnvio = {
  id: requerimientoId,
  resumen: {
    id: requerimientoId,
    version: 4,
    fechaCreacion: instante,
    motivo: 'reemplazo',
    empresa: empresaA,
    puesto: puestoA,
    solicitadas: 2,
    cubiertas: 0,
    pendientes: 2,
    fechaObjetivo: null,
    duracionAplicable: { clasificacion: 'operativo', diasHabiles: 10 },
    responsable: usuarioA,
    alerta: null,
    autorizacion: { ...autorizacion, version: 4 },
    estado: 'pendiente-aprobacion',
  },
  responsable: usuarioA,
  estado: 'pendiente-aprobacion',
}

const errorNoUsado = { message: 'No usado', retryable: false }

function resultadosComandos(
  overrides: Partial<MockCommandResults> = {},
): MockCommandResults {
  return {
    crear: creacionFixture.error(errorNoUsado),
    guardarBorrador: comandoFixture.error(errorNoUsado),
    enviarAprobacion: comandoFixture.error(errorNoUsado),
    aprobar: comandoFixture.error(errorNoUsado),
    observar: comandoFixture.error(errorNoUsado),
    cancelar: comandoFixture.error(errorNoUsado),
    fijarPlazoAdministrativo: comandoFixture.error(errorNoUsado),
    ajustarPlazoAdministrativo: comandoFixture.error(errorNoUsado),
    abrirProcesoSeleccion: comandoFixture.error(errorNoUsado),
    solicitarReversionCobertura: comandoFixture.error(errorNoUsado),
    ...overrides,
  }
}

describe('comentario de la observación vigente', () => {
  it('devuelve la observación más reciente aunque venga desordenada, no la justificación', () => {
    const lectura = observacionVigente(detalleObservado)

    expect(lectura.status).toBe('disponible')
    if (lectura.status !== 'disponible') return
    expect(lectura.observacion).toEqual({
      autor: jefeOperaciones,
      fechaHora: '2026-11-14T15:30:00Z',
      comentario: 'Falta detallar la ubicación del puesto',
    })
    expect(lectura.observacion.comentario).not.toBe(detalleObservado.comentario)
  })

  it('compara instantes con distinto offset, no cadenas', () => {
    const detalleConOffsets = detalle('observado', [
      {
        id: id<EventoHistorialId>('evento-offset'),
        usuario: jefeOperaciones,
        fechaHora: '2026-11-14T17:00:00+02:00' as InstanteISO,
        accion: 'observacion',
        estadoAnterior: 'pendiente-aprobacion',
        estadoNuevo: 'observado',
        comentario: 'Observación anterior en UTC',
      },
      {
        id: id<EventoHistorialId>('evento-utc'),
        usuario: jefeOperaciones,
        fechaHora: '2026-11-14T15:30:00Z' as InstanteISO,
        accion: 'observacion',
        estadoAnterior: 'pendiente-aprobacion',
        estadoNuevo: 'observado',
        comentario: 'Observación vigente en UTC',
      },
    ])

    const lectura = observacionVigente(detalleConOffsets)

    expect(lectura.status).toBe('disponible')
    if (lectura.status !== 'disponible') return
    expect(lectura.observacion.comentario).toBe('Observación vigente en UTC')
  })

  it('declara la ausencia si el observado no tiene evento de observación', () => {
    const detalleSinEvento = detalle('observado', historialSinObservacion)

    const lectura = observacionVigente(detalleSinEvento)

    expect(lectura).toEqual({
      status: 'sin-observacion',
      motivo: 'sin-evento',
    })
  })

  it('declara la ausencia si la observación no trae comentario', () => {
    const detalleSinComentario = detalle('observado', [
      {
        id: id<EventoHistorialId>('evento-sin-comentario'),
        usuario: jefeOperaciones,
        fechaHora: '2026-11-14T15:30:00Z' as InstanteISO,
        accion: 'observacion',
        estadoAnterior: 'pendiente-aprobacion',
        estadoNuevo: 'observado',
        comentario: null,
      },
    ])

    const lectura = observacionVigente(detalleSinComentario)

    expect(lectura).toEqual({
      status: 'sin-observacion',
      motivo: 'comentario-ausente',
    })
  })

  it('no expone el comentario fuera del estado Observado', () => {
    const pendiente = detalle('pendiente-aprobacion', historialObservado)

    const lectura = observacionVigente(pendiente)

    expect(lectura).toEqual({
      status: 'no-observado',
      estado: 'pendiente-aprobacion',
    })
  })
})

describe('corrección de un Observado', () => {
  it('parte de la justificación y reenvía el contenido corregido con la versión leída', async () => {
    const comandos = createMockComandosRequerimientos(
      resultadosComandos({
        enviarAprobacion: comandoFixture.confirmado(confirmacionEnvio),
      }),
    )
    const formulario = formularioDesdeDetalle(detalleObservado)
    expect(formulario.comentario).toBe(detalleObservado.comentario)

    const editado = editarFormulario(crearEstadoEdicion(formulario), {
      campo: 'comentario',
      valor: 'Justificación con la ubicación corregida',
    })
    if (!editado.ok) throw new Error('Se esperaba una edición válida')

    const revision = revisar(editado.estado, catalogos, {
      modo: 'edicion',
      tipoEnvio: 'reenvio',
    })
    if (!revision.ok) throw new Error('Se esperaba una revisión válida')
    if (revision.estado.paso !== 'revision') {
      throw new Error('Se esperaba el paso de revisión')
    }
    expect(revision.estado.revision.cabecera.tipoEnvio).toBe('reenvio')
    expect(revision.estado.revision.puedeEnviar).toBe(true)

    const envio = await enviarAprobacion(
      revision.estado,
      { requerimientoId, version: detalleObservado.version },
      comandos,
    )

    expect(comandos.calls.enviarAprobacion).toHaveLength(1)
    expect(comandos.calls.enviarAprobacion[0]).toMatchObject({
      requerimientoId,
      version: 3,
    })
    expect(comandos.calls.enviarAprobacion[0].contenido).toMatchObject({
      comentario: 'Justificación con la ubicación corregida',
      vacantes: 2,
    })
    expect(envio.operacion).toMatchObject({
      status: 'confirmado',
      accion: 'envio',
    })
    expect(envio.estado.paso).toBe('confirmacion')
  })
})
