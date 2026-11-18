import { describe, expect, it } from 'vitest'
import type {
  AccionRequerimiento,
  AreaId,
  CoberturaRequerimiento,
  DepartamentoId,
  DepartamentoUbicacionId,
  DetalleRequerimientoCompleto,
  DiasHabilesAdministrativos,
  DistritoId,
  EmpresaId,
  ErrorIntegracion,
  EstadoRequerimientoCompleto,
  EventoHistorialId,
  EventoReversionCobertura,
  FechaISO,
  InstanteISO,
  PlazoAdministrativoFijado,
  ProvinciaId,
  PuestoId,
  RequerimientoId,
  SolicitudReversionId,
  SubareaId,
  UsuarioId,
} from '..'
import {
  comandoConVersionVigente,
  confirmarReversionCobertura,
  MENSAJE_CONFLICTO_VERSION,
  solicitarReversionCobertura,
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
const solicitudId = id<SolicitudReversionId>('solicitud-a')

const empresa = { id: id<EmpresaId>('empresa-a'), nombre: 'Empresa A' }
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
const usuario = { id: id<UsuarioId>('usuario-a'), nombre: 'Usuario A' }

const ACCION_REVERSION: AccionRequerimiento = 'solicitar-reversion-cobertura'

function plazo(): PlazoAdministrativoFijado {
  return {
    clasificacion: 'administrativo',
    fechaAprobacion: fecha('2026-11-16'),
    fechaObjetivo: fecha('1999-01-01'),
    cumplimiento: 'en-plazo',
    duracionDiasHabiles: 17 as DiasHabilesAdministrativos,
    origen: 'fijado-administrativo',
    alerta: null,
  }
}

function cobertura(
  solicitadas: number,
  cubiertas: number,
  primerosDiasReales: CoberturaRequerimiento['primerosDiasReales'] = [],
): CoberturaRequerimiento {
  return {
    solicitadas,
    cubiertas,
    pendientes: solicitadas - cubiertas,
    primerosDiasReales,
  }
}

interface OpcionesDetalle {
  readonly estado?: EstadoRequerimientoCompleto
  readonly version?: number
  readonly acciones?: readonly AccionRequerimiento[]
  readonly cobertura?: CoberturaRequerimiento
}

function detalleCompleto(
  opciones: OpcionesDetalle = {},
): DetalleRequerimientoCompleto {
  const version = opciones.version ?? 3
  return {
    id: requerimientoId,
    version,
    estado: opciones.estado ?? 'cubierto',
    fechaCreacion: instante('2026-11-09T08:00:00Z'),
    historial: [],
    autorizacion: {
      requerimientoId,
      version,
      capacidades: [],
      accionesPermitidas: opciones.acciones ?? ['cancelar', ACCION_REVERSION],
    },
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
    plazo: plazo(),
    cobertura: opciones.cobertura ?? cobertura(2, 2),
    remuneracionPreviaAlta: null,
    procesoSeleccion: null,
  }
}

function crearPuerto(
  solicitar: MockCommandResults['solicitarReversionCobertura'],
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
    abrirProcesoSeleccion: comandoFixture.sesionFinalizada(),
    solicitarReversionCobertura: solicitar,
  })
}

function totalLlamadas(puerto: MockComandosRequerimientosPort): number {
  return Object.values(puerto.calls).reduce(
    (total, llamadas) => total + llamadas.length,
    0,
  )
}

function solicitudRegistrada(
  requerimiento: DetalleRequerimientoCompleto,
) {
  return {
    solicitudId,
    estado: 'pendiente-confirmacion' as const,
    requerimiento,
  }
}

function eventoReversion(
  opciones: {
    readonly id?: string
    readonly solicitud?: SolicitudReversionId
    readonly cubiertas?: number
  } = {},
): EventoReversionCobertura {
  return {
    id: id<EventoHistorialId>(opciones.id ?? 'evento-reversion'),
    usuario,
    fechaHora: instante('2026-11-19T10:00:00Z'),
    accion: 'reversion-cobertura',
    solicitudId: opciones.solicitud ?? solicitudId,
    origen: 'seleccion',
    motivo: 'Cobertura registrada por error',
    colaboradorAfectadoId: null,
    efectoCobertura: {
      solicitadas: 2,
      cubiertas: opciones.cubiertas ?? 1,
      pendientes: 1,
      estadoResultante: 'en-reclutamiento',
    },
  }
}

describe('solicitud motivada de reversión', () => {
  it('emite la solicitud con motivo, versión y capacidad sin cambiar estado ni cobertura', async () => {
    const detalle = detalleCompleto()
    const antes = structuredClone(detalle)
    const puerto = crearPuerto(
      comandoFixture.confirmado(solicitudRegistrada(detalle)),
    )

    const resultado = await solicitarReversionCobertura(
      detalle,
      'Cobertura registrada por error',
      puerto,
    )

    expect(resultado).toEqual({
      status: 'confirmado',
      accion: 'solicitar-reversion-cobertura',
      comando: {
        requerimientoId,
        version: 3,
        motivo: 'Cobertura registrada por error',
      },
      solicitud: solicitudRegistrada(detalle),
    })
    expect(puerto.calls.solicitarReversionCobertura).toEqual([
      {
        requerimientoId,
        version: 3,
        motivo: 'Cobertura registrada por error',
      },
    ])
    expect(detalle).toEqual(antes)
    expect(detalle.estado).toBe('cubierto')
    expect(detalle.cobertura).toMatchObject({ cubiertas: 2, pendientes: 0 })
  })

  it('acepta la solicitud también desde En reclutamiento con pendientes', async () => {
    const detalle = detalleCompleto({
      estado: 'en-reclutamiento',
      cobertura: cobertura(3, 1),
    })
    const puerto = crearPuerto(
      comandoFixture.confirmado(solicitudRegistrada(detalle)),
    )

    const resultado = await solicitarReversionCobertura(
      detalle,
      'Cobertura registrada por error',
      puerto,
    )

    expect(resultado.status).toBe('confirmado')
    expect(detalle.estado).toBe('en-reclutamiento')
    expect(detalle.cobertura).toMatchObject({ cubiertas: 1, pendientes: 2 })
  })

  it('normaliza el motivo antes de enviarlo', async () => {
    const detalle = detalleCompleto()
    const puerto = crearPuerto(
      comandoFixture.confirmado(solicitudRegistrada(detalle)),
    )

    await solicitarReversionCobertura(
      detalle,
      '  Cobertura registrada por error  ',
      puerto,
    )

    expect(puerto.calls.solicitarReversionCobertura).toEqual([
      {
        requerimientoId,
        version: 3,
        motivo: 'Cobertura registrada por error',
      },
    ])
  })

  it.each([
    ['ausente', undefined],
    ['nula', null],
    ['vacía', '   '],
  ])(
    'rechaza la solicitud con motivo %s sin llamar al puerto',
    async (_caso, motivo) => {
      const puerto = crearPuerto(
        comandoFixture.confirmado(solicitudRegistrada(detalleCompleto())),
      )

      const resultado = await solicitarReversionCobertura(
        detalleCompleto(),
        motivo,
        puerto,
      )

      expect(resultado).toEqual({
        status: 'validacion',
        errores: [
          {
            campo: 'motivo',
            mensaje: 'El motivo de la solicitud de reversión es obligatorio.',
          },
        ],
        entradaConservada: true,
        reintentable: true,
      })
      expect(totalLlamadas(puerto)).toBe(0)
    },
  )

  it('rechaza el estado de origen no permitido sin llamar al puerto', async () => {
    const detalle = detalleCompleto({ estado: 'aprobado' })
    const puerto = crearPuerto(
      comandoFixture.confirmado(solicitudRegistrada(detalle)),
    )

    const resultado = await solicitarReversionCobertura(
      detalle,
      'Cobertura registrada por error',
      puerto,
    )

    expect(resultado).toEqual({
      status: 'estado-invalido',
      estadoActual: 'aprobado',
      entradaConservada: true,
      reintentable: false,
    })
    expect(totalLlamadas(puerto)).toBe(0)
    expect(detalle.estado).toBe('aprobado')
  })

  it('rechaza sin la acción concedida por el backend sin llamar al puerto', async () => {
    const detalle = detalleCompleto({ acciones: ['cancelar'] })
    const puerto = crearPuerto(
      comandoFixture.confirmado(solicitudRegistrada(detalle)),
    )

    const resultado = await solicitarReversionCobertura(
      detalle,
      'Cobertura registrada por error',
      puerto,
    )

    expect(resultado).toEqual({
      status: 'sin-autorizacion',
      motivo: 'capacidad',
      entradaConservada: true,
      reintentable: false,
    })
    expect(totalLlamadas(puerto)).toBe(0)
  })

  it('conserva la entrada ante conflicto de versión y permite reintentar con la vigente', async () => {
    const detalle = detalleCompleto()
    const vigente = detalleCompleto({ version: 4, estado: 'en-reclutamiento' })
    const puerto = crearPuerto(
      comandoFixture.conflicto({
        versionEsperada: 3,
        versionVigente: 4,
        datosVigentes: vigente,
      }),
    )

    const resultado = await solicitarReversionCobertura(
      detalle,
      'Cobertura registrada por error',
      puerto,
    )

    expect(resultado).toMatchObject({
      status: 'conflicto-version',
      conflicto: { versionEsperada: 3, versionVigente: 4, datosVigentes: vigente },
      entrada: {
        requerimientoId,
        version: 3,
        motivo: 'Cobertura registrada por error',
      },
      datosVigentes: vigente,
      versionVigente: 4,
      mensaje: MENSAJE_CONFLICTO_VERSION,
      entradaConservada: true,
      reintentable: true,
    })
    if (resultado.status !== 'conflicto-version') return

    const reintento = comandoConVersionVigente(resultado)
    expect(reintento).toEqual({
      requerimientoId,
      version: 4,
      motivo: 'Cobertura registrada por error',
    })

    const puertoReintento = crearPuerto(
      comandoFixture.confirmado(solicitudRegistrada(vigente)),
    )
    const confirmado = await solicitarReversionCobertura(
      vigente,
      reintento.motivo,
      puertoReintento,
    )

    expect(confirmado).toMatchObject({
      status: 'confirmado',
      comando: { version: 4 },
    })
    expect(puertoReintento.calls.solicitarReversionCobertura).toEqual([
      reintento,
    ])
  })

  it.each([
    ['reintentable', true],
    ['no reintentable', false],
  ])(
    'conserva la entrada ante un fallo de integración %s sin aplicar la reversión',
    async (_caso, retryable) => {
      const detalle = detalleCompleto()
      const antes = structuredClone(detalle)
      const error: ErrorIntegracion = {
        origen: 'seleccion',
        error: { message: 'Selección no disponible', retryable },
      }
      const puerto = crearPuerto(comandoFixture.errorIntegracion(error))

      const resultado = await solicitarReversionCobertura(
        detalle,
        'Cobertura registrada por error',
        puerto,
      )

      expect(resultado).toEqual({
        status: 'error-integracion',
        error,
        entradaConservada: true,
        reintentable: retryable,
      })
      expect(detalle).toEqual(antes)
      expect(detalle.cobertura).toMatchObject({ cubiertas: 2, pendientes: 0 })
    },
  )
})

describe('trazabilidad solicitud → evento', () => {
  it('enlaza el evento confirmado con la solicitud emitida y recalcula la cobertura', async () => {
    const detalle = detalleCompleto()
    const puerto = crearPuerto(
      comandoFixture.confirmado(solicitudRegistrada(detalle)),
    )

    const solicitud = await solicitarReversionCobertura(
      detalle,
      'Cobertura registrada por error',
      puerto,
    )
    expect(solicitud.status).toBe('confirmado')
    if (solicitud.status !== 'confirmado') return

    const evento = eventoReversion({
      solicitud: solicitud.solicitud.solicitudId,
    })
    const confirmacion = confirmarReversionCobertura(detalle, evento)

    expect(confirmacion.status).toBe('confirmado')
    if (confirmacion.status !== 'confirmado') return
    expect(confirmacion.evento.solicitudId).toBe(
      solicitud.solicitud.solicitudId,
    )
    expect(confirmacion.confirmacion).toMatchObject({
      solicitudId: solicitud.solicitud.solicitudId,
      estadoAnterior: 'cubierto',
      estado: 'en-reclutamiento',
      cobertura: { solicitadas: 2, cubiertas: 1, pendientes: 1 },
      yaAplicado: false,
    })
    expect(solicitud.solicitud.estado).toBe('pendiente-confirmacion')
  })
})
