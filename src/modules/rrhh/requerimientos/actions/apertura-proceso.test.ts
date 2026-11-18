import { describe, expect, it } from 'vitest'
import type {
  AccionRequerimiento,
  AreaId,
  AutorizacionRequerimiento,
  DepartamentoId,
  DepartamentoUbicacionId,
  DetalleRequerimientoCompleto,
  DiasHabilesAdministrativos,
  DistritoId,
  EmpresaId,
  ErrorIntegracion,
  EstadoRequerimientoCompleto,
  EventoAperturaProceso,
  EventoHistorialId,
  FechaISO,
  InstanteISO,
  PlazoAdministrativoFijado,
  ProcesoSeleccionId,
  ProcesoSeleccionRef,
  ProvinciaId,
  PuestoId,
  RequerimientoId,
  SubareaId,
  Usuario,
  UsuarioId,
} from '..'
import {
  confirmarAperturaProcesoSeleccion,
  evaluarTransicion,
  iniciarAperturaProcesoSeleccion,
} from '..'
import {
  comandoFixture,
  createMockComandosRequerimientos,
  creacionFixture,
} from '../fixtures'
import type {
  MockCommandResults,
  MockComandosRequerimientosPort,
} from '../fixtures'

const id = <T>(value: string) => value as T
const fecha = (value: string) => value as FechaISO
const instante = (value: string) => value as InstanteISO

const requerimientoId = id<RequerimientoId>('req-1')
const proceso: ProcesoSeleccionRef = {
  id: id<ProcesoSeleccionId>('proceso-1'),
}

const empresa = {
  id: id<EmpresaId>('empresa-a'),
  nombre: 'Empresa A',
}
const departamento = {
  id: id<DepartamentoId>('departamento-a'),
  nombre: 'Departamento A',
}
const area = {
  id: id<AreaId>('area-a'),
  nombre: 'Área A',
  departamentoId: departamento.id,
}
const subarea = {
  id: id<SubareaId>('subarea-a'),
  nombre: 'Subárea A',
  areaId: area.id,
}
const puesto = {
  id: id<PuestoId>('puesto-administrativo'),
  nombre: 'Puesto Administrativo',
  areaId: area.id,
  subareaId: subarea.id,
  clasificacion: 'administrativo' as const,
}
const ubicacion = {
  id: id<DepartamentoUbicacionId>('ubicacion-a'),
  nombre: 'Lima',
}
const provincia = {
  id: id<ProvinciaId>('provincia-a'),
  nombre: 'Lima',
  departamentoId: ubicacion.id,
}
const distrito = {
  id: id<DistritoId>('distrito-a'),
  nombre: 'Miraflores',
  provinciaId: provincia.id,
}
const usuario: Usuario = {
  id: id<UsuarioId>('usuario-a'),
  nombre: 'Usuario A',
}

const TODAS_LAS_ACCIONES: readonly AccionRequerimiento[] = [
  'editar',
  'enviar',
  'aprobar',
  'observar',
  'cancelar',
  'fijar-plazo',
  'ajustar-plazo',
  'abrir-proceso-seleccion',
  'solicitar-reversion-cobertura',
  'asociar-candidato',
]

interface OpcionesDetalle {
  readonly estado?: EstadoRequerimientoCompleto
  readonly version?: number
  readonly acciones?: readonly AccionRequerimiento[]
  readonly procesoSeleccion?: ProcesoSeleccionRef | null
}

function crearAutorizacion(
  acciones: readonly AccionRequerimiento[],
  version: number,
): AutorizacionRequerimiento {
  return {
    requerimientoId,
    version,
    capacidades: [],
    accionesPermitidas: acciones,
  }
}

function plazoAdministrativo(): PlazoAdministrativoFijado {
  return {
    clasificacion: 'administrativo',
    fechaAprobacion: fecha('2026-11-16'),
    fechaObjetivo: null,
    cumplimiento: 'pendiente',
    duracionDiasHabiles: 17 as DiasHabilesAdministrativos,
    origen: 'fijado-administrativo',
    alerta: null,
  }
}

function detalleCompleto(
  opciones: OpcionesDetalle = {},
): DetalleRequerimientoCompleto {
  const version = opciones.version ?? 3
  return {
    id: requerimientoId,
    version,
    estado: opciones.estado ?? 'aprobado',
    fechaCreacion: instante('2026-11-09T08:00:00Z'),
    historial: [],
    autorizacion: crearAutorizacion(
      opciones.acciones ?? TODAS_LAS_ACCIONES,
      version,
    ),
    motivo: 'nueva-vacante',
    empresa,
    colaboradorAReemplazar: null,
    departamento,
    area,
    subarea,
    puesto,
    remuneracion: { monto: 1500, moneda: 'PEN' },
    ubicacion: { departamento: ubicacion, provincia, distrito },
    usuarioProximaTarea: usuario,
    comentario: 'Justificación del requerimiento',
    plazo: plazoAdministrativo(),
    cobertura: {
      solicitadas: 2,
      cubiertas: 0,
      pendientes: 2,
      primerosDiasReales: [],
    },
    remuneracionPreviaAlta: null,
    procesoSeleccion: opciones.procesoSeleccion ?? null,
  }
}

function veredictoDeInicio(detalle: DetalleRequerimientoCompleto) {
  return evaluarTransicion(detalle, { suceso: 'iniciar-apertura-proceso' })
}

function crearPuerto(
  abrirProcesoSeleccion: MockCommandResults['abrirProcesoSeleccion'] = comandoFixture.sesionFinalizada(),
): MockComandosRequerimientosPort {
  return createMockComandosRequerimientos({
    crear: creacionFixture.sesionFinalizada(),
    guardarBorrador: comandoFixture.sesionFinalizada(),
    enviarAprobacion: comandoFixture.sesionFinalizada(),
    aprobar: comandoFixture.sesionFinalizada(),
    observar: comandoFixture.sesionFinalizada(),
    cancelar: comandoFixture.sesionFinalizada(),
    fijarPlazoAdministrativo: comandoFixture.sesionFinalizada(),
    ajustarPlazoAdministrativo: comandoFixture.sesionFinalizada(),
    abrirProcesoSeleccion,
    solicitarReversionCobertura: comandoFixture.sesionFinalizada(),
  })
}

function totalLlamadas(puerto: MockComandosRequerimientosPort): number {
  return Object.values(puerto.calls).reduce(
    (total, llamadas) => total + llamadas.length,
    0,
  )
}

function eventoApertura(): EventoAperturaProceso {
  return {
    id: id<EventoHistorialId>('evento-apertura'),
    usuario,
    fechaHora: instante('2026-11-18T10:00:00Z'),
    accion: 'apertura-proceso',
    proceso,
  }
}

describe('inicio de la apertura del proceso en Selección', () => {
  it('inicia con la versión vigente y usa la referencia de proceso del contrato', async () => {
    const detalle = detalleCompleto()
    const confirmado = detalleCompleto({
      estado: 'en-reclutamiento',
      version: 4,
      procesoSeleccion: proceso,
    })
    const puerto = crearPuerto(
      comandoFixture.confirmado({
        proceso,
        requerimiento: confirmado,
        idempotente: false,
      }),
    )
    const veredicto = veredictoDeInicio(detalle)

    expect(veredicto).toMatchObject({
      permitida: true,
      estadoOrigen: 'aprobado',
      estadoDestino: 'aprobado',
      requiereConfirmacion: 'apertura-proceso',
    })

    const resultado = await iniciarAperturaProcesoSeleccion(
      { detalle, veredicto },
      puerto,
    )

    expect(resultado).toEqual({
      status: 'confirmado',
      accion: 'abrir-proceso-seleccion',
      apertura: {
        proceso,
        requerimiento: confirmado,
        idempotente: false,
      },
    })
    expect(puerto.calls.abrirProcesoSeleccion).toEqual([
      { requerimientoId, version: 3 },
    ])
    expect(totalLlamadas(puerto)).toBe(1)
  })

  it('rechaza el inicio si el requerimiento ya no está Aprobado y no llama al puerto', async () => {
    const detalle = detalleCompleto({
      estado: 'en-reclutamiento',
      procesoSeleccion: proceso,
    })
    const puerto = crearPuerto(
      comandoFixture.confirmado({
        proceso,
        requerimiento: detalle,
        idempotente: true,
      }),
    )
    const veredicto = veredictoDeInicio(detalle)

    expect(veredicto).toMatchObject({
      permitida: false,
      motivo: 'suceso-no-aplica-al-estado',
    })

    const resultado = await iniciarAperturaProcesoSeleccion(
      { detalle, veredicto },
      puerto,
    )

    expect(resultado).toMatchObject({
      status: 'transicion-rechazada',
      mensaje:
        'El suceso no está permitido desde el estado actual del requerimiento.',
      entradaConservada: true,
      reintentable: false,
    })
    expect('apertura' in resultado).toBe(false)
    expect(totalLlamadas(puerto)).toBe(0)
    expect(detalle.estado).toBe('en-reclutamiento')
  })

  it('rechaza el inicio sin abrir-proceso-seleccion y no llama al puerto', async () => {
    const detalle = detalleCompleto({
      acciones: TODAS_LAS_ACCIONES.filter(
        (accion) => accion !== 'abrir-proceso-seleccion',
      ),
    })
    const puerto = crearPuerto(
      comandoFixture.confirmado({
        proceso,
        requerimiento: detalleCompleto({ estado: 'en-reclutamiento' }),
        idempotente: false,
      }),
    )
    const veredicto = veredictoDeInicio(detalle)

    expect(veredicto).toMatchObject({
      permitida: false,
      motivo: 'sin-autorizacion',
    })

    const resultado = await iniciarAperturaProcesoSeleccion(
      { detalle, veredicto },
      puerto,
    )

    expect(resultado).toMatchObject({
      status: 'transicion-rechazada',
      entradaConservada: true,
      reintentable: false,
    })
    expect('apertura' in resultado).toBe(false)
    expect(totalLlamadas(puerto)).toBe(0)
    expect(detalle.estado).toBe('aprobado')
  })

  it('conserva la entrada y el estado ante un fallo de integración reintentable', async () => {
    const detalle = detalleCompleto()
    const antes = structuredClone(detalle)
    const error: ErrorIntegracion = {
      origen: 'seleccion',
      error: { message: 'Selección no disponible', retryable: true },
    }
    const puerto = crearPuerto(comandoFixture.errorIntegracion(error))

    const resultado = await iniciarAperturaProcesoSeleccion(
      { detalle, veredicto: veredictoDeInicio(detalle) },
      puerto,
    )

    expect(resultado).toEqual({
      status: 'error-integracion',
      error,
      entradaConservada: true,
      reintentable: true,
    })
    expect('apertura' in resultado).toBe(false)
    expect(detalle).toEqual(antes)
    expect(puerto.calls.abrirProcesoSeleccion).toHaveLength(1)
  })

  it('distingue el fallo de integración no reintentable', async () => {
    const detalle = detalleCompleto()
    const antes = structuredClone(detalle)
    const error: ErrorIntegracion = {
      origen: 'seleccion',
      error: { message: 'Proceso rechazado por Selección', retryable: false },
    }
    const puerto = crearPuerto(comandoFixture.errorIntegracion(error))

    const resultado = await iniciarAperturaProcesoSeleccion(
      { detalle, veredicto: veredictoDeInicio(detalle) },
      puerto,
    )

    expect(resultado).toEqual({
      status: 'error-integracion',
      error,
      entradaConservada: true,
      reintentable: false,
    })
    expect('apertura' in resultado).toBe(false)
    expect(detalle).toEqual(antes)
    expect(detalle.estado).toBe('aprobado')
  })

  it('no adelanta En reclutamiento: respeta el estado confirmado por el backend', async () => {
    const detalle = detalleCompleto()
    const antes = structuredClone(detalle)
    const puerto = crearPuerto(
      comandoFixture.confirmado({
        proceso,
        requerimiento: detalleCompleto({ version: 4 }),
        idempotente: false,
      }),
    )

    const resultado = await iniciarAperturaProcesoSeleccion(
      { detalle, veredicto: veredictoDeInicio(detalle) },
      puerto,
    )

    expect(resultado.status).toBe('confirmado')
    if (resultado.status !== 'confirmado') return
    expect(resultado.apertura.requerimiento.estado).toBe('aprobado')
    expect(resultado.apertura.requerimiento.procesoSeleccion).toBeNull()
    expect(JSON.stringify(resultado)).not.toContain('en-reclutamiento')
    expect(detalle).toEqual(antes)
  })

  it('conserva la idempotencia declarada por Selección al reintentar', async () => {
    const detalle = detalleCompleto()
    const confirmado = detalleCompleto({
      estado: 'en-reclutamiento',
      version: 4,
      procesoSeleccion: proceso,
    })
    const puerto = crearPuerto(
      comandoFixture.confirmado({
        proceso,
        requerimiento: confirmado,
        idempotente: true,
      }),
    )

    const resultado = await iniciarAperturaProcesoSeleccion(
      { detalle, veredicto: veredictoDeInicio(detalle) },
      puerto,
    )

    expect(resultado).toMatchObject({
      status: 'confirmado',
      apertura: { proceso, idempotente: true },
    })
  })
})

describe('confirmación de Selección de la apertura', () => {
  it('sin evento confirmado se rechaza con motivo explícito y no cambia el estado', () => {
    const detalle = detalleCompleto()

    const resultado = confirmarAperturaProcesoSeleccion(detalle, null)

    expect(resultado).toEqual({
      status: 'rechazado',
      evento: null,
      motivo: 'integracion-sin-confirmar',
      mensaje:
        'La transición requiere una confirmación de integración que aún no existe.',
    })
    expect(detalle.estado).toBe('aprobado')
  })

  it('aplica Aprobado → En reclutamiento solo con el evento confirmado', () => {
    const detalle = detalleCompleto()
    const antes = structuredClone(detalle)
    const evento = eventoApertura()

    const resultado = confirmarAperturaProcesoSeleccion(detalle, evento)

    expect(resultado).toEqual({
      status: 'confirmado',
      estadoAnterior: 'aprobado',
      estado: 'en-reclutamiento',
      proceso,
      evento,
    })
    expect(detalle).toEqual(antes)
  })

  it('rechaza la confirmación si el requerimiento ya no está Aprobado', () => {
    const detalle = detalleCompleto({
      estado: 'en-reclutamiento',
      procesoSeleccion: proceso,
    })

    const resultado = confirmarAperturaProcesoSeleccion(
      detalle,
      eventoApertura(),
    )

    expect(resultado).toMatchObject({
      status: 'rechazado',
      motivo: 'suceso-no-aplica-al-estado',
      evento: eventoApertura(),
    })
  })

  it('el inicio no confirma por sí solo: el fallo deja Aprobado y solo el evento aplica la transición', async () => {
    const detalle = detalleCompleto()
    const error: ErrorIntegracion = {
      origen: 'seleccion',
      error: { message: 'Selección no disponible', retryable: true },
    }
    const puerto = crearPuerto(comandoFixture.errorIntegracion(error))

    const inicio = await iniciarAperturaProcesoSeleccion(
      { detalle, veredicto: veredictoDeInicio(detalle) },
      puerto,
    )

    expect(inicio.status).toBe('error-integracion')
    expect(detalle.estado).toBe('aprobado')
    expect('apertura' in inicio).toBe(false)

    const confirmacion = confirmarAperturaProcesoSeleccion(
      detalle,
      eventoApertura(),
    )

    expect(confirmacion).toMatchObject({
      status: 'confirmado',
      estado: 'en-reclutamiento',
    })
  })
})
