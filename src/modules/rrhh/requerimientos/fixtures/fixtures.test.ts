import { describe, expect, expectTypeOf, it, vi } from 'vitest'
import type { Capability } from '../../../../shared'
import {
  CAP_RRHH_REQUERIMIENTOS_READ,
  DEST_RRHH_SELECCION,
  createDeferred,
} from '../../../../container/fixtures'
import type {
  Area,
  AreaId,
  AutorizacionRequerimiento,
  BandejaRequerimientosPort,
  BorradorRequerimiento,
  CalendarioLaboralId,
  CatalogoRequerimientosPort,
  CatalogosRequerimientos,
  ComandosRequerimientosPort,
  Departamento,
  DepartamentoId,
  DepartamentoUbicacion,
  DepartamentoUbicacionId,
  DetalleRequerimientoBorrador,
  DetalleRequerimientoCompleto,
  DetalleRequerimientosPort,
  Distrito,
  DistritoId,
  Empresa,
  EmpresaId,
  EventoHistorialId,
  FechaISO,
  InstanteISO,
  NavegacionSeleccionPort,
  ProcesoSeleccionId,
  Provincia,
  ProvinciaId,
  Puesto,
  PuestoId,
  RequerimientoId,
  ResultadoAbrirProceso,
  ResultadoAprobar,
  ResultadoCancelar,
  ResultadoCrearRequerimiento,
  ResultadoGuardarBorrador,
  ResultadoSolicitarReversion,
  SolicitudReversionId,
  Usuario,
  UsuarioId,
} from '../contracts'
import {
  comandoFixture,
  creacionFixture,
  createMockBandejaRequerimientos,
  createMockCatalogoRequerimientos,
  createMockComandosRequerimientos,
  createMockDetalleRequerimientos,
  createMockNavegacionSeleccion,
  createRequerimientosFixture,
  detalleFixture,
  lecturaFixture,
  MOCK_KIND,
  type MockCommandResults,
  type RequerimientosFixtureConfig,
} from './index'

const capability = CAP_RRHH_REQUERIMIENTOS_READ as Capability
const requerimientoId = 'req-fixture' as RequerimientoId
const empresaId = 'empresa-fixture' as EmpresaId
const departamentoId = 'departamento-fixture' as DepartamentoId
const areaId = 'area-fixture' as AreaId
const puestoId = 'puesto-fixture' as PuestoId
const departamentoUbicacionId = 'ubicacion-fixture' as DepartamentoUbicacionId
const provinciaId = 'provincia-fixture' as ProvinciaId
const distritoId = 'distrito-fixture' as DistritoId
const usuarioId = 'usuario-fixture' as UsuarioId
const procesoId = 'proceso-fixture' as ProcesoSeleccionId
const solicitudId = 'solicitud-fixture' as SolicitudReversionId
const fecha = '2026-01-01' as FechaISO
const instante = '2026-01-01T00:00:00Z' as InstanteISO

const empresa: Empresa = { id: empresaId, nombre: 'Empresa fixture' }
const departamento: Departamento = { id: departamentoId, nombre: 'Departamento fixture' }
const area: Area = { id: areaId, departamentoId, nombre: 'Área fixture' }
const puesto: Puesto = {
  id: puestoId,
  areaId,
  subareaId: null,
  nombre: 'Puesto fixture',
  clasificacion: 'operativo',
}
const departamentoUbicacion: DepartamentoUbicacion = {
  id: departamentoUbicacionId,
  nombre: 'Departamento ubicación fixture',
}
const provincia: Provincia = {
  id: provinciaId,
  departamentoId: departamentoUbicacionId,
  nombre: 'Provincia fixture',
}
const distrito: Distrito = {
  id: distritoId,
  provinciaId,
  nombre: 'Distrito fixture',
}
const usuario: Usuario = { id: usuarioId, nombre: 'Usuario fixture' }

const borradorIncompleto: BorradorRequerimiento = {
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

function authorization(
  accionesPermitidas: AutorizacionRequerimiento['accionesPermitidas'] = [],
): AutorizacionRequerimiento {
  return {
    requerimientoId,
    version: 1,
    capacidades: [capability],
    accionesPermitidas,
  }
}

function draftDetail(): DetalleRequerimientoBorrador {
  return {
    id: requerimientoId,
    version: 1,
    estado: 'borrador',
    fechaCreacion: instante,
    historial: [],
    autorizacion: authorization(['editar', 'enviar', 'cancelar']),
    borrador: borradorIncompleto,
    plazo: null,
    cobertura: null,
    remuneracionPreviaAlta: null,
    procesoSeleccion: null,
  }
}

function completeDetail(
  estado: DetalleRequerimientoCompleto['estado'] = 'aprobado',
): DetalleRequerimientoCompleto {
  return {
    id: requerimientoId,
    version: 1,
    estado,
    fechaCreacion: instante,
    historial: [],
    autorizacion: authorization([
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
    ]),
    motivo: 'nueva-vacante',
    empresa,
    colaboradorAReemplazar: null,
    departamento,
    area,
    subarea: null,
    puesto,
    remuneracion: { monto: 1, moneda: 'PEN' },
    ubicacion: { departamento: departamentoUbicacion, provincia, distrito },
    usuarioProximaTarea: usuario,
    comentario: 'Contenido fixture',
    plazo: {
      clasificacion: 'operativo',
      duracionDiasHabiles: 10,
      origen: 'operativo-fijo',
      fechaAprobacion: fecha,
      fechaObjetivo: fecha,
      cumplimiento: 'en-plazo',
      alerta: null,
    },
    cobertura: {
      solicitadas: 1,
      cubiertas: 0,
      pendientes: 1,
      primerosDiasReales: [],
    },
    remuneracionPreviaAlta: {
      remuneracionAprobada: { monto: 1, moneda: 'PEN' },
      remuneracionVigente: { monto: 2, moneda: 'PEN' },
      ajustadaAntesDelAlta: true,
    },
    procesoSeleccion: estado === 'en-reclutamiento' ? { id: procesoId } : null,
  }
}

const contractError = { message: 'Error fixture', retryable: true }

function commandResults(
  overrides: Partial<MockCommandResults> = {},
): MockCommandResults {
  const error = { status: 'error', error: contractError } as const
  return {
    crear: error,
    guardarBorrador: error,
    enviarAprobacion: error,
    aprobar: error,
    observar: error,
    cancelar: error,
    fijarPlazoAdministrativo: error,
    ajustarPlazoAdministrativo: error,
    abrirProcesoSeleccion: error,
    solicitarReversionCobertura: error,
    ...overrides,
  }
}

function emptyCatalogs(): CatalogosRequerimientos {
  return {
    motivos: [],
    empresas: [],
    departamentos: [],
    areas: [],
    subareas: [],
    puestos: [],
    departamentosUbicacion: [],
    provincias: [],
    distritos: [],
    usuariosProximaTarea: [],
    usuarioProximaTareaPredeterminado: null,
    calendarioLaboral: {
      id: 'calendario-fixture' as CalendarioLaboralId,
      diasHabiles: [],
      excepciones: [],
    },
  }
}

function fixtureConfig(
  overrides: Partial<RequerimientosFixtureConfig> = {},
): RequerimientosFixtureConfig {
  return {
    scenario: 'escenario fixture',
    access: {
      capabilities: [capability],
      trayActions: ['crear'],
      recordActions: ['editar'],
    },
    catalogos: lecturaFixture.ok(emptyCatalogs()),
    bandeja: lecturaFixture.ok({
      elementos: [],
      total: 0,
      pagina: 1,
      tamanoPagina: 10,
      capacidades: { capacidades: [capability], accionesPermitidas: ['crear'] },
    }),
    detalle: { status: 'ok', datos: draftDetail() },
    comandos: commandResults(),
    asociarCandidato: { status: 'sin-proceso' },
    ...overrides,
  }
}

describe('adaptadores mock y puertos', () => {
  it('implementa todos los puertos y cada adaptador se identifica como mock', () => {
    const fixture = createRequerimientosFixture(fixtureConfig())

    expectTypeOf(fixture.catalogos).toMatchTypeOf<CatalogoRequerimientosPort>()
    expectTypeOf(fixture.bandeja).toMatchTypeOf<BandejaRequerimientosPort>()
    expectTypeOf(fixture.detalle).toMatchTypeOf<DetalleRequerimientosPort>()
    expectTypeOf(fixture.comandos).toMatchTypeOf<ComandosRequerimientosPort>()
    expectTypeOf(fixture.seleccion).toMatchTypeOf<NavegacionSeleccionPort>()
    expect(fixture.kind).toBe(MOCK_KIND)
    expect([
      fixture.catalogos.kind,
      fixture.bandeja.kind,
      fixture.detalle.kind,
      fixture.comandos.kind,
      fixture.seleccion.kind,
    ]).toEqual(['mock', 'mock', 'mock', 'mock', 'mock'])
  })

  it('parametriza capacidades y acciones efectivas sin nombres de rol', () => {
    const fixture = createRequerimientosFixture(
      fixtureConfig({
        access: {
          capabilities: [capability],
          trayActions: [],
          recordActions: ['abrir-proceso-seleccion'],
        },
      }),
    )

    expect(fixture.access).toEqual({
      capabilities: [capability],
      trayActions: [],
      recordActions: ['abrir-proceso-seleccion'],
    })
    expect('role' in fixture.access).toBe(false)
  })
})

describe('familias de lectura de RH-REQ-01 §10', () => {
  it('permite mantener una lectura en carga hasta resolver el fixture', async () => {
    const deferred = createDeferred<ReturnType<typeof lecturaFixture.ok<CatalogosRequerimientos>>>()
    const catalog = createMockCatalogoRequerimientos(() => deferred.promise)
    let settled = false
    const pending = catalog.obtener().then((result) => {
      settled = true
      return result
    })

    await Promise.resolve()
    expect(settled).toBe(false)
    deferred.resolve(lecturaFixture.ok(emptyCatalogs()))
    expect((await pending).status).toBe('ok')
  })

  it('inyecta éxito con datos, lista vacía/sin resultados, errores, permisos y sesión', async () => {
    const data = createMockCatalogoRequerimientos(lecturaFixture.ok(emptyCatalogs()))
    const empty = createMockBandejaRequerimientos(fixtureConfig().bandeja)
    const retryable = createMockCatalogoRequerimientos(
      lecturaFixture.error({ message: 'recuperable', retryable: true }),
    )
    const terminal = createMockCatalogoRequerimientos(
      lecturaFixture.error({ message: 'terminal', retryable: false }),
    )
    const forbidden = createMockCatalogoRequerimientos(lecturaFixture.forbidden())
    const ended = createMockCatalogoRequerimientos(lecturaFixture.sesionFinalizada())

    expect((await data.obtener()).status).toBe('ok')
    const emptyResult = await empty.consultar({
      filtros: {},
      orden: { campo: 'fecha-creacion', direccion: 'desc' },
      paginacion: { pagina: 1, tamanoPagina: 10 },
    })
    expect(emptyResult).toMatchObject({ status: 'ok', datos: { elementos: [], total: 0 } })
    expect(await retryable.obtener()).toMatchObject({
      status: 'error',
      error: { retryable: true },
    })
    expect(await terminal.obtener()).toMatchObject({
      status: 'error',
      error: { retryable: false },
    })
    expect((await forbidden.obtener()).status).toBe('forbidden')
    expect((await ended.obtener()).status).toBe('sesion-finalizada')
  })

  it('inyecta detalle no encontrado además de error, sin permisos y sesión finalizada', async () => {
    const results = [
      detalleFixture.noEncontrado(),
      detalleFixture.error(contractError),
      detalleFixture.forbidden(),
      detalleFixture.sesionFinalizada(),
    ]
    const statuses = await Promise.all(
      results.map((result) =>
        createMockDetalleRequerimientos(result)
          .obtener(requerimientoId)
          .then((value) => value.status),
      ),
    )
    expect(statuses).toEqual([
      'no-encontrado',
      'error',
      'forbidden',
      'sesion-finalizada',
    ])
  })

  it('devuelve el historial configurado sin generarlo en el adaptador', async () => {
    const detail = draftDetail()
    const configured: DetalleRequerimientoBorrador = {
      ...detail,
      historial: [
        {
          id: 'historial-fixture' as EventoHistorialId,
          usuario,
          fechaHora: instante,
          accion: 'creacion',
          estadoNuevo: 'borrador',
          comentario: null,
        },
      ],
    }
    const result = await createMockDetalleRequerimientos({
      status: 'ok',
      datos: configured,
    }).obtener(requerimientoId)
    expect(result).toMatchObject({
      status: 'ok',
      datos: { historial: [{ accion: 'creacion' }] },
    })
  })
})

describe('familias de escritura y comandos versionados', () => {
  it('inyecta confirmado, validación, conflicto, autorización, estado, errores y sesión', async () => {
    const detail = completeDetail()
    const results: readonly ResultadoAprobar[] = [
      comandoFixture.confirmado<DetalleRequerimientoCompleto>(detail),
      comandoFixture.validacion([{ campo: 'comentario', mensaje: 'Requerido' }]),
      comandoFixture.conflicto({
        versionEsperada: 1,
        versionVigente: 2,
        datosVigentes: detail,
      }),
      comandoFixture.sinAutorizacion('capacidad'),
      comandoFixture.sinAutorizacion('ambito'),
      comandoFixture.estadoInvalido('cancelado'),
      comandoFixture.error({ message: 'reintentar', retryable: true }),
      comandoFixture.error({ message: 'terminal', retryable: false }),
      comandoFixture.sesionFinalizada(),
    ]
    const statuses = await Promise.all(
      results.map((aprobar) =>
        createMockComandosRequerimientos(commandResults({ aprobar }))
          .aprobar({ requerimientoId, version: 1 })
          .then((result) => result.status),
      ),
    )

    expect(statuses).toEqual([
      'confirmado',
      'validacion',
      'conflicto-version',
      'sin-autorizacion',
      'sin-autorizacion',
      'estado-invalido',
      'error',
      'error',
      'sesion-finalizada',
    ])
    expect(creacionFixture.validacion([]).status).toBe('validacion')
    expect(creacionFixture.sinAutorizacion('ambito').status).toBe('sin-autorizacion')
    expect(creacionFixture.error(contractError).status).toBe('error')
    expect(creacionFixture.sesionFinalizada().status).toBe('sesion-finalizada')
  })

  it('registra trazas de todos los comandos sin ejecutar reglas ni transiciones', async () => {
    const commands = createMockComandosRequerimientos(commandResults())
    const versioned = { requerimientoId, version: 1 }

    await commands.crear({ contenido: borradorIncompleto })
    await commands.guardarBorrador({ ...versioned, borrador: borradorIncompleto })
    await commands.enviarAprobacion({ ...versioned, contenido: borradorIncompleto })
    await commands.aprobar(versioned)
    await commands.observar({ ...versioned, comentario: 'Observación fixture' })
    await commands.cancelar({ ...versioned, causal: 'creacion-por-error' })
    await commands.fijarPlazoAdministrativo({ ...versioned, diasHabiles: 15 })
    await commands.ajustarPlazoAdministrativo({
      ...versioned,
      diasHabiles: 20,
      motivo: 'Motivo fixture',
    })
    await commands.abrirProcesoSeleccion(versioned)
    await commands.solicitarReversionCobertura({
      ...versioned,
      motivo: 'Motivo fixture',
    })

    expect(Object.values(commands.calls).map((calls) => calls.length)).toEqual(
      Array(10).fill(1),
    )
    expect(commands.calls.aprobar[0]).toEqual(versioned)
  })
})

describe('creación, guardado y Cancelado parcial', () => {
  it('inyecta creación y guardado confirmado de un Borrador incompleto', async () => {
    const draft = draftDetail()
    const crear: ResultadoCrearRequerimiento = {
      status: 'confirmado',
      datos: { id: requerimientoId, version: 1, detalle: draft },
    }
    const guardar: ResultadoGuardarBorrador = { status: 'confirmado', datos: draft }
    const commands = createMockComandosRequerimientos(
      commandResults({ crear, guardarBorrador: guardar }),
    )

    expect(await commands.crear({ contenido: borradorIncompleto })).toEqual(crear)
    expect(
      await commands.guardarBorrador({
        requerimientoId,
        version: 1,
        borrador: borradorIncompleto,
      }),
    ).toEqual(guardar)
  })

  it.each(['borrador', 'pendiente-aprobacion', 'observado'] as const)(
    'inyecta guardado confirmado conservando el estado %s',
    async (estado) => {
      const datos =
        estado === 'borrador' ? draftDetail() : { ...completeDetail(), estado }
      const result: ResultadoGuardarBorrador = { status: 'confirmado', datos }
      const commands = createMockComandosRequerimientos(
        commandResults({ guardarBorrador: result }),
      )
      const returned = await commands.guardarBorrador({
        requerimientoId,
        version: 1,
        borrador: borradorIncompleto,
      })
      expect(returned).toMatchObject({ status: 'confirmado', datos: { estado } })
    },
  )

  it('inyecta Cancelado que conserva datos parciales', async () => {
    const draft = draftDetail()
    const cancelar: ResultadoCancelar = {
      status: 'confirmado',
      datos: { ...draft, estado: 'cancelado', datos: 'parciales' },
    }
    const commands = createMockComandosRequerimientos(
      commandResults({ cancelar }),
    )
    const returned = await commands.cancelar({
      requerimientoId,
      version: 1,
      causal: 'creacion-por-error',
    })
    expect(returned).toMatchObject({
      status: 'confirmado',
      datos: { estado: 'cancelado', datos: 'parciales', borrador: borradorIncompleto },
    })
  })
})

describe('INT-01 Selección/Alta', () => {
  it.each([false, true])(
    'inyecta apertura confirmada con idempotencia=%s',
    async (idempotente) => {
      const result: ResultadoAbrirProceso = {
        status: 'confirmado',
        datos: {
          proceso: { id: procesoId },
          requerimiento: completeDetail('en-reclutamiento'),
          idempotente,
        },
      }
      const commands = createMockComandosRequerimientos(
        commandResults({ abrirProcesoSeleccion: result }),
      )
      expect(await commands.abrirProcesoSeleccion({ requerimientoId, version: 1 })).toEqual(
        result,
      )
    },
  )

  it('inyecta fallo reintentable de Selección sin fabricar transición optimista', async () => {
    const result: ResultadoAbrirProceso = comandoFixture.errorIntegracion({
      origen: 'seleccion',
      error: { message: 'Selección no confirmó', retryable: true },
    })
    const commands = createMockComandosRequerimientos(
      commandResults({ abrirProcesoSeleccion: result }),
    )
    expect(await commands.abrirProcesoSeleccion({ requerimientoId, version: 1 })).toEqual(
      result,
    )
  })

  it('inyecta solicitud de reversión registrada, rechazada y fallida sin cambiar contadores', async () => {
    const unchanged = completeDetail('en-reclutamiento')
    const registered: ResultadoSolicitarReversion = {
      status: 'confirmado',
      datos: {
        solicitudId,
        estado: 'pendiente-confirmacion',
        requerimiento: unchanged,
      },
    }
    const rejected: ResultadoSolicitarReversion = comandoFixture.estadoInvalido(
      'en-reclutamiento',
    )
    const failed: ResultadoSolicitarReversion = comandoFixture.errorIntegracion({
      origen: 'seleccion',
      error: { message: 'Fallo de reversión', retryable: true },
    })

    expect(registered.datos.requerimiento.cobertura).toEqual(unchanged.cobertura)
    expect(rejected.status).toBe('estado-invalido')
    expect(failed.status).toBe('error-integracion')
  })

  it('inyecta primer día real y remuneración previa al alta como datos de solo lectura', async () => {
    const detail = completeDetail('en-reclutamiento')
    const withAlta: DetalleRequerimientoCompleto = {
      ...detail,
      cobertura: {
        solicitadas: 1,
        cubiertas: 1,
        pendientes: 0,
        primerosDiasReales: [{ fecha }],
      },
    }
    const result = await createMockDetalleRequerimientos({
      status: 'ok',
      datos: withAlta,
    }).obtener(requerimientoId)

    expect(result).toMatchObject({
      status: 'ok',
      datos: {
        cobertura: { primerosDiasReales: [{ fecha }] },
        remuneracionPreviaAlta: { ajustadaAntesDelAlta: true },
      },
    })
  })

  it('inyecta navegación Asociar candidato sin crear proceso ni vínculo', async () => {
    const navigation = createMockNavegacionSeleccion({
      status: 'navegar',
      proceso: { id: procesoId },
      destino: DEST_RRHH_SELECCION,
    })
    const result = await navigation.asociarCandidato({ requerimientoId })
    expect(result).toMatchObject({ status: 'navegar', proceso: { id: procesoId } })
    expect(navigation.calls).toEqual([{ requerimientoId }])
  })
})

describe('aislamiento y ausencia de efectos reales', () => {
  it('aísla trazas entre instancias y no muta configuración ni resultados', async () => {
    const configured = fixtureConfig()
    const first = createRequerimientosFixture(configured)
    const second = createRequerimientosFixture(configured)
    const query = {
      filtros: {},
      orden: { campo: 'fecha-creacion', direccion: 'desc' },
      paginacion: { pagina: 1, tamanoPagina: 10 },
    } as const

    const firstResult = await first.bandeja.consultar(query)
    if (firstResult.status === 'ok') {
      ;(firstResult.datos.elementos as unknown[]).push('mutación externa')
    }
    const repeated = await first.bandeja.consultar(query)

    expect(first.bandeja.calls).toHaveLength(2)
    expect(second.bandeja.calls).toHaveLength(0)
    expect(repeated).toEqual(configured.bandeja)
    expect(configured.bandeja).toEqual(fixtureConfig().bandeja)
  })

  it('no usa red, localStorage ni sessionStorage', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    const storage = { getItem: vi.fn(), setItem: vi.fn(), removeItem: vi.fn(), clear: vi.fn() }
    const localDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
    const sessionDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'sessionStorage')
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: storage })
    Object.defineProperty(globalThis, 'sessionStorage', { configurable: true, value: storage })

    try {
      const fixture = createRequerimientosFixture(fixtureConfig())
      await fixture.catalogos.obtener()
      await fixture.detalle.obtener(requerimientoId)
      await fixture.comandos.aprobar({ requerimientoId, version: 1 })
      expect(fetchSpy).not.toHaveBeenCalled()
      expect(storage.getItem).not.toHaveBeenCalled()
      expect(storage.setItem).not.toHaveBeenCalled()
    } finally {
      fetchSpy.mockRestore()
      if (localDescriptor) Object.defineProperty(globalThis, 'localStorage', localDescriptor)
      else Reflect.deleteProperty(globalThis, 'localStorage')
      if (sessionDescriptor)
        Object.defineProperty(globalThis, 'sessionStorage', sessionDescriptor)
      else Reflect.deleteProperty(globalThis, 'sessionStorage')
    }
  })
})
