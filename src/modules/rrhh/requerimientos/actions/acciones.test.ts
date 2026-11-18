import { describe, expect, it } from 'vitest'
import type { ContractError } from '../../../../shared'
import type {
  AccionRequerimiento,
  Area,
  AreaId,
  AutorizacionRequerimiento,
  BorradorRequerimiento,
  CausalCancelacion,
  Clasificacion,
  Departamento,
  DepartamentoId,
  DepartamentoUbicacion,
  DepartamentoUbicacionId,
  DetalleRequerimiento,
  DetalleRequerimientoBorrador,
  DetalleRequerimientoCanceladoCompleto,
  DetalleRequerimientoCompleto,
  DiasHabilesAdministrativos,
  Distrito,
  DistritoId,
  Empresa,
  EmpresaId,
  ErrorIntegracion,
  EstadoRequerimientoCompleto,
  InstanteISO,
  PlazoAdministrativoFijado,
  PlazoAdministrativoPendiente,
  PlazoOperativo,
  PlazoRequerimiento,
  Provincia,
  ProvinciaId,
  Puesto,
  PuestoId,
  RequerimientoId,
  Subarea,
  SubareaId,
  Usuario,
  UsuarioId,
} from '..'
import {
  aprobarRequerimiento,
  cancelarRequerimiento,
  evaluarAcciones,
  fijarPlazoAdministrativo,
  observarRequerimiento,
} from '..'
import {
  comandoFixture,
  createMockComandosRequerimientos,
  creacionFixture,
} from '../fixtures'
import type { AccionGestion } from '..'
import type {
  MockCommandResults,
  MockComandosRequerimientosPort,
} from '../fixtures'

const id = <T>(value: string) => value as T
const instante = (value: string) => value as InstanteISO

const requerimientoId = id<RequerimientoId>('req-1')

const empresa: Empresa = {
  id: id<EmpresaId>('empresa-a'),
  nombre: 'Empresa A',
}
const departamento: Departamento = {
  id: id<DepartamentoId>('departamento-a'),
  nombre: 'Departamento A',
}
const area: Area = {
  id: id<AreaId>('area-a'),
  nombre: 'Área A',
  departamentoId: departamento.id,
}
const subarea: Subarea = {
  id: id<SubareaId>('subarea-a'),
  nombre: 'Subárea A',
  areaId: area.id,
}
const puestoAdministrativo: Puesto = {
  id: id<PuestoId>('puesto-administrativo'),
  nombre: 'Puesto Administrativo',
  areaId: area.id,
  subareaId: subarea.id,
  clasificacion: 'administrativo',
}
const puestoOperativo: Puesto = {
  id: id<PuestoId>('puesto-operativo'),
  nombre: 'Puesto Operativo',
  areaId: area.id,
  subareaId: null,
  clasificacion: 'operativo',
}
const ubicacion: DepartamentoUbicacion = {
  id: id<DepartamentoUbicacionId>('ubicacion-a'),
  nombre: 'Lima',
}
const provincia: Provincia = {
  id: id<ProvinciaId>('provincia-a'),
  nombre: 'Lima',
  departamentoId: ubicacion.id,
}
const distrito: Distrito = {
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

function crearAutorizacion(
  acciones: readonly AccionRequerimiento[],
  version = 3,
): AutorizacionRequerimiento {
  return {
    requerimientoId,
    version,
    capacidades: [],
    accionesPermitidas: acciones,
  }
}

function plazoOperativo(): PlazoOperativo {
  return {
    clasificacion: 'operativo',
    fechaAprobacion: null,
    fechaObjetivo: null,
    cumplimiento: 'pendiente',
    duracionDiasHabiles: 10,
    origen: 'operativo-fijo',
    alerta: null,
  }
}

function plazoAdministrativoPendiente(): PlazoAdministrativoPendiente {
  return {
    clasificacion: 'administrativo',
    fechaAprobacion: null,
    fechaObjetivo: null,
    cumplimiento: 'pendiente',
    duracionDiasHabiles: null,
    origen: 'pendiente',
    alerta: null,
  }
}

function plazoAdministrativoFijado(dias: number): PlazoAdministrativoFijado {
  return {
    clasificacion: 'administrativo',
    fechaAprobacion: null,
    fechaObjetivo: null,
    cumplimiento: 'pendiente',
    duracionDiasHabiles: dias as DiasHabilesAdministrativos,
    origen: 'fijado-administrativo',
    alerta: null,
  }
}

interface OpcionesDetalleCompleto {
  readonly estado?: EstadoRequerimientoCompleto
  readonly clasificacion?: Clasificacion
  readonly plazo?: PlazoRequerimiento
  readonly acciones?: readonly AccionRequerimiento[]
  readonly version?: number
}

function detalleCompleto(
  opciones: OpcionesDetalleCompleto = {},
): DetalleRequerimientoCompleto {
  const clasificacion = opciones.clasificacion ?? 'administrativo'
  const version = opciones.version ?? 3
  return {
    id: requerimientoId,
    version,
    estado: opciones.estado ?? 'pendiente-aprobacion',
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
    subarea: clasificacion === 'operativo' ? null : subarea,
    puesto:
      clasificacion === 'operativo' ? puestoOperativo : puestoAdministrativo,
    remuneracion: { monto: 1500, moneda: 'PEN' },
    ubicacion: {
      departamento: ubicacion,
      provincia,
      distrito,
    },
    usuarioProximaTarea: usuario,
    comentario: 'Justificación del requerimiento',
    plazo:
      opciones.plazo ??
      (clasificacion === 'operativo'
        ? plazoOperativo()
        : plazoAdministrativoPendiente()),
    cobertura: {
      solicitadas: 2,
      cubiertas: 0,
      pendientes: 2,
      primerosDiasReales: [],
    },
    remuneracionPreviaAlta: null,
    procesoSeleccion: null,
  }
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

function detalleBorrador(
  acciones: readonly AccionRequerimiento[] = TODAS_LAS_ACCIONES,
): DetalleRequerimientoBorrador {
  return {
    id: requerimientoId,
    version: 1,
    estado: 'borrador',
    fechaCreacion: instante('2026-11-09T08:00:00Z'),
    historial: [],
    autorizacion: crearAutorizacion(acciones, 1),
    borrador: borradorVacio,
    plazo: null,
    cobertura: null,
    remuneracionPreviaAlta: null,
    procesoSeleccion: null,
  }
}

function detalleCanceladoCompleto(
  acciones: readonly AccionRequerimiento[] = TODAS_LAS_ACCIONES,
): DetalleRequerimientoCanceladoCompleto {
  return {
    ...detalleCompleto({ estado: 'aprobado', acciones }),
    estado: 'cancelado',
    datos: 'completos',
  }
}

function crearPuerto(
  resultados: Partial<MockCommandResults> = {},
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
    solicitarReversionCobertura: comandoFixture.sesionFinalizada(),
    ...resultados,
  })
}

function detalleDeEstado(
  estado: EstadoRequerimientoCompleto,
  clasificacion: Clasificacion = 'administrativo',
): DetalleRequerimiento {
  return detalleCompleto({ estado, clasificacion })
}

describe('elegibilidad de acciones de gestión', () => {
  const casos: readonly {
    readonly estado: string
    readonly clasificacion?: Clasificacion
    readonly esperadas: readonly AccionGestion[]
  }[] = [
    { estado: 'borrador', esperadas: ['cancelar'] },
    {
      estado: 'pendiente-aprobacion',
      clasificacion: 'operativo',
      esperadas: ['aprobar', 'observar', 'cancelar'],
    },
    {
      estado: 'pendiente-aprobacion',
      clasificacion: 'administrativo',
      esperadas: ['aprobar', 'observar', 'cancelar', 'fijar-plazo'],
    },
    { estado: 'observado', esperadas: ['cancelar'] },
    { estado: 'aprobado', esperadas: ['cancelar'] },
    { estado: 'en-reclutamiento', esperadas: ['cancelar'] },
    { estado: 'cubierto', esperadas: [] },
    { estado: 'cancelado', esperadas: [] },
  ]

  it.each(casos)(
    'en $estado permite $esperadas',
    ({ estado, clasificacion, esperadas }) => {
      const detalle =
        estado === 'borrador'
          ? detalleBorrador()
          : estado === 'cancelado'
            ? detalleCanceladoCompleto()
            : detalleDeEstado(
                estado as EstadoRequerimientoCompleto,
                clasificacion,
              )

      const evaluacion = evaluarAcciones(detalle)

      expect(evaluacion.estado).toBe(estado)
      expect(evaluacion.acciones).toHaveLength(4)
      expect(evaluacion.acciones.every((accion) => accion.visible)).toBe(true)
      expect(evaluacion.ejecutables).toEqual(esperadas)
    },
  )

  it('solo hace visibles las acciones concedidas por el backend', () => {
    const detalle = detalleCompleto({ acciones: ['cancelar'] })

    const evaluacion = evaluarAcciones(detalle)

    expect(evaluacion.ejecutables).toEqual(['cancelar'])
    for (const accion of evaluacion.acciones.filter(
      (item) => item.accion !== 'cancelar',
    )) {
      expect(accion.visible).toBe(false)
      expect(accion.ejecutable).toBe(false)
      expect(accion.motivo).toBe('sin-autorizacion')
      expect(accion.mensaje).not.toBeNull()
    }
  })

  it('explica una acción visible que el estado no admite', () => {
    const detalle = detalleCompleto({ estado: 'aprobado' })

    const evaluacion = evaluarAcciones(detalle)
    const aprobar = evaluacion.acciones.find(
      (accion) => accion.accion === 'aprobar',
    )

    expect(aprobar).toMatchObject({
      visible: true,
      ejecutable: false,
      motivo: 'estado-no-aplicable',
    })
    expect(aprobar?.mensaje).toContain('pendiente de aprobación')
    expect(evaluacion.ejecutables).toEqual(['cancelar'])
  })

  it('no ofrece fijar plazo a un Operativo aunque el backend lo conceda', () => {
    const detalle = detalleCompleto({
      clasificacion: 'operativo',
      acciones: ['fijar-plazo'],
    })

    const evaluacion = evaluarAcciones(detalle)

    expect(evaluacion.acciones[3]).toMatchObject({
      accion: 'fijar-plazo',
      visible: true,
      ejecutable: false,
      motivo: 'clasificacion-no-aplicable',
    })
    expect(evaluacion.acciones[3]?.mensaje).toContain('administrativa')
    expect(evaluacion.ejecutables).toEqual([])
  })
})

describe('aprobar', () => {
  it('rechaza un Administrativo sin plazo entero 15–30 sin llamar al puerto', async () => {
    const puerto = crearPuerto()

    const resultado = await aprobarRequerimiento(
      detalleCompleto({ plazo: plazoAdministrativoPendiente() }),
      {},
      puerto,
    )

    expect(resultado.status).toBe('validacion')
    if (resultado.status === 'validacion') {
      expect(resultado.errores).toEqual([
        {
          campo: 'plazo-administrativo',
          mensaje:
            'El plazo administrativo debe ser un entero entre 15 y 30 días hábiles antes de aprobar.',
        },
      ])
      expect(resultado.entradaConservada).toBe(true)
      expect(resultado.reintentable).toBe(true)
    }
    expect(puerto.calls.aprobar).toHaveLength(0)
  })

  it('rechaza un Administrativo cuyo plazo llegó ausente', async () => {
    const detalle = detalleCompleto({
      clasificacion: 'administrativo',
      plazo: null as unknown as PlazoRequerimiento,
    })

    const resultado = await aprobarRequerimiento(detalle, {}, crearPuerto())

    expect(resultado.status).toBe('validacion')
  })

  it.each([14, 31, 17.5])(
    'rechaza el plazo administrativo %s',
    async (dias) => {
      const puerto = crearPuerto()

      const resultado = await aprobarRequerimiento(
        detalleCompleto({ plazo: plazoAdministrativoFijado(dias) }),
        {},
        puerto,
      )

      expect(resultado.status).toBe('validacion')
      if (resultado.status === 'validacion') {
        expect(resultado.errores[0]?.campo).toBe('plazo-administrativo')
      }
      expect(puerto.calls.aprobar).toHaveLength(0)
    },
  )

  it.each([15, 30])(
    'aprueba un Administrativo con plazo %i',
    async (dias) => {
      const confirmado = detalleCompleto({
        estado: 'aprobado',
        plazo: plazoAdministrativoFijado(dias),
      })
      const puerto = crearPuerto({
        aprobar: comandoFixture.confirmado(confirmado),
      })

      const resultado = await aprobarRequerimiento(
        detalleCompleto({ plazo: plazoAdministrativoFijado(dias) }),
        {},
        puerto,
      )

      expect(resultado).toEqual({
        status: 'confirmado',
        accion: 'aprobar',
        detalle: confirmado,
      })
      expect(puerto.calls.aprobar).toEqual([
        { requerimientoId, version: 3 },
      ])
    },
  )

  it('aprueba un Operativo sin exigir plazo administrativo', async () => {
    const confirmado = detalleCompleto({
      estado: 'aprobado',
      clasificacion: 'operativo',
      plazo: plazoOperativo(),
    })
    const puerto = crearPuerto({
      aprobar: comandoFixture.confirmado(confirmado),
    })

    const resultado = await aprobarRequerimiento(
      detalleCompleto({
        clasificacion: 'operativo',
        plazo: plazoOperativo(),
      }),
      {},
      puerto,
    )

    expect(resultado.status).toBe('confirmado')
    expect(puerto.calls.aprobar).toEqual([{ requerimientoId, version: 3 }])
  })

  it('envía el comentario recortado cuando existe', async () => {
    const puerto = crearPuerto({
      aprobar: comandoFixture.confirmado(
        detalleCompleto({ estado: 'aprobado' }),
      ),
    })

    await aprobarRequerimiento(
      detalleCompleto({ plazo: plazoAdministrativoFijado(17) }),
      { comentario: '  Conforme  ' },
      puerto,
    )

    expect(puerto.calls.aprobar).toEqual([
      {
        requerimientoId,
        version: 3,
        comentario: 'Conforme',
      },
    ])
  })

  it('no invoca al puerto si la acción no es elegible', async () => {
    const puerto = crearPuerto()

    const resultado = await aprobarRequerimiento(
      detalleCompleto({ estado: 'aprobado' }),
      {},
      puerto,
    )

    expect(resultado).toMatchObject({
      status: 'accion-no-disponible',
      accion: 'aprobar',
      motivo: 'estado-no-aplicable',
      entradaConservada: true,
      reintentable: false,
    })
    expect(puerto.calls.aprobar).toHaveLength(0)
  })
})

describe('observar', () => {
  it.each([null, undefined, '', '   '])(
    'rechaza el comentario %j sin llamar al puerto',
    async (comentario) => {
      const puerto = crearPuerto()

      const resultado = await observarRequerimiento(
        detalleCompleto(),
        comentario,
        puerto,
      )

      expect(resultado.status).toBe('validacion')
      if (resultado.status === 'validacion') {
        expect(resultado.errores).toEqual([
          {
            campo: 'comentario',
            mensaje:
              'El comentario es obligatorio para observar el requerimiento.',
          },
        ])
      }
      expect(puerto.calls.observar).toHaveLength(0)
    },
  )

  it('envía identificador, versión y comentario recortado', async () => {
    const confirmado = detalleCompleto({ estado: 'observado' })
    const puerto = crearPuerto({
      observar: comandoFixture.confirmado(confirmado),
    })

    const resultado = await observarRequerimiento(
      detalleCompleto(),
      '  Falta detallar el puesto  ',
      puerto,
    )

    expect(resultado).toEqual({
      status: 'confirmado',
      accion: 'observar',
      detalle: confirmado,
    })
    expect(puerto.calls.observar).toEqual([
      {
        requerimientoId,
        version: 3,
        comentario: 'Falta detallar el puesto',
      },
    ])
  })

  it('no invoca al puerto fuera de Pendiente de aprobación', async () => {
    const puerto = crearPuerto()

    const resultado = await observarRequerimiento(
      detalleCompleto({ estado: 'observado' }),
      'Comentario',
      puerto,
    )

    expect(resultado).toMatchObject({
      status: 'accion-no-disponible',
      accion: 'observar',
      motivo: 'estado-no-aplicable',
    })
    expect(puerto.calls.observar).toHaveLength(0)
  })
})

describe('cancelar', () => {
  it('exige confirmación explícita', async () => {
    const puerto = crearPuerto()

    const resultado = await cancelarRequerimiento(
      detalleCompleto(),
      { confirmado: false, causal: 'menor-carga-laboral' },
      puerto,
    )

    expect(resultado.status).toBe('validacion')
    if (resultado.status === 'validacion') {
      expect(resultado.errores.map((error) => error.campo)).toEqual([
        'confirmacion',
      ])
    }
    expect(puerto.calls.cancelar).toHaveLength(0)
  })

  it('exige una causal válida', async () => {
    const puerto = crearPuerto()

    const resultado = await cancelarRequerimiento(
      detalleCompleto(),
      { confirmado: true, causal: null },
      puerto,
    )

    expect(resultado.status).toBe('validacion')
    if (resultado.status === 'validacion') {
      expect(resultado.errores.map((error) => error.campo)).toEqual([
        'causal',
      ])
    }
    expect(puerto.calls.cancelar).toHaveLength(0)
  })

  it('acumula confirmación y causal ausentes sin ejecutar', async () => {
    const puerto = crearPuerto()

    const resultado = await cancelarRequerimiento(
      detalleCompleto(),
      { confirmado: false, causal: null },
      puerto,
    )

    expect(resultado.status).toBe('validacion')
    if (resultado.status === 'validacion') {
      expect(resultado.errores.map((error) => error.campo)).toEqual([
        'confirmacion',
        'causal',
      ])
    }
    expect(puerto.calls.cancelar).toHaveLength(0)
  })

  it('rechaza una causal fuera del catálogo', async () => {
    const puerto = crearPuerto()

    const resultado = await cancelarRequerimiento(
      detalleCompleto(),
      {
        confirmado: true,
        causal: 'otra-causal' as unknown as CausalCancelacion,
      },
      puerto,
    )

    expect(resultado.status).toBe('validacion')
    expect(puerto.calls.cancelar).toHaveLength(0)
  })

  it.each(['menor-carga-laboral', 'creacion-por-error'] as const)(
    'envía la causal %s con identificador y versión',
    async (causal) => {
      const confirmado = detalleCanceladoCompleto()
      const puerto = crearPuerto({
        cancelar: comandoFixture.confirmado(confirmado),
      })

      const resultado = await cancelarRequerimiento(
        detalleCompleto(),
        { confirmado: true, causal },
        puerto,
      )

      expect(resultado).toEqual({
        status: 'confirmado',
        accion: 'cancelar',
        detalle: confirmado,
      })
      expect(puerto.calls.cancelar).toEqual([
        { requerimientoId, version: 3, causal },
      ])
    },
  )

  it('omite un comentario vacío y recorta el informado', async () => {
    const puerto = crearPuerto({
      cancelar: comandoFixture.confirmado(detalleCanceladoCompleto()),
    })

    await cancelarRequerimiento(
      detalleCompleto(),
      {
        confirmado: true,
        causal: 'creacion-por-error',
        comentario: '   ',
      },
      puerto,
    )
    await cancelarRequerimiento(
      detalleCompleto(),
      {
        confirmado: true,
        causal: 'creacion-por-error',
        comentario: '  Registro duplicado  ',
      },
      puerto,
    )

    expect(puerto.calls.cancelar).toEqual([
      { requerimientoId, version: 3, causal: 'creacion-por-error' },
      {
        requerimientoId,
        version: 3,
        causal: 'creacion-por-error',
        comentario: 'Registro duplicado',
      },
    ])
  })

  it('no invoca al puerto si el estado ya no admite cancelación', async () => {
    const puerto = crearPuerto()

    const resultado = await cancelarRequerimiento(
      detalleCompleto({ estado: 'cubierto' }),
      { confirmado: true, causal: 'menor-carga-laboral' },
      puerto,
    )

    expect(resultado).toMatchObject({
      status: 'accion-no-disponible',
      accion: 'cancelar',
      motivo: 'estado-no-aplicable',
    })
    expect(puerto.calls.cancelar).toHaveLength(0)
  })
})

describe('fijar plazo administrativo', () => {
  it('no invoca al puerto para un Operativo', async () => {
    const puerto = crearPuerto()

    const resultado = await fijarPlazoAdministrativo(
      detalleCompleto({
        clasificacion: 'operativo',
        plazo: plazoOperativo(),
      }),
      20,
      puerto,
    )

    expect(resultado).toMatchObject({
      status: 'accion-no-disponible',
      accion: 'fijar-plazo',
      motivo: 'clasificacion-no-aplicable',
    })
    expect(puerto.calls.fijarPlazoAdministrativo).toHaveLength(0)
  })

  it('no invoca al puerto fuera de Pendiente de aprobación', async () => {
    const puerto = crearPuerto()

    const resultado = await fijarPlazoAdministrativo(
      detalleCompleto({ estado: 'aprobado' }),
      20,
      puerto,
    )

    expect(resultado).toMatchObject({
      status: 'accion-no-disponible',
      accion: 'fijar-plazo',
      motivo: 'estado-no-aplicable',
    })
    expect(puerto.calls.fijarPlazoAdministrativo).toHaveLength(0)
  })

  it.each([14, 31, 17.5, '20', null, undefined, Number.NaN])(
    'rechaza el valor %j sin llamar al puerto',
    async (valor) => {
      const puerto = crearPuerto()

      const resultado = await fijarPlazoAdministrativo(
        detalleCompleto(),
        valor,
        puerto,
      )

      expect(resultado.status).toBe('validacion')
      if (resultado.status === 'validacion') {
        expect(resultado.errores[0]?.campo).toBe('plazo-administrativo')
      }
      expect(puerto.calls.fijarPlazoAdministrativo).toHaveLength(0)
    },
  )

  it.each([15, 30])('fija el plazo %i con identificador y versión', async (dias) => {
    const confirmado = detalleCompleto({
      plazo: plazoAdministrativoFijado(dias),
    })
    const puerto = crearPuerto({
      fijarPlazoAdministrativo: comandoFixture.confirmado(confirmado),
    })

    const resultado = await fijarPlazoAdministrativo(
      detalleCompleto(),
      dias,
      puerto,
    )

    expect(resultado).toEqual({
      status: 'confirmado',
      accion: 'fijar-plazo',
      detalle: confirmado,
    })
    expect(puerto.calls.fijarPlazoAdministrativo).toEqual([
      { requerimientoId, version: 3, diasHabiles: dias },
    ])
  })
})

describe('mapeo de resultados del comando', () => {
  const detalle = detalleCompleto({ plazo: plazoAdministrativoFijado(17) })

  it('conserva la entrada ante un conflicto de versión', async () => {
    const conflicto = {
      versionEsperada: 3,
      versionVigente: 4,
      datosVigentes: detalleCompleto({ version: 4 }),
    }
    const puerto = crearPuerto({
      observar: comandoFixture.conflicto(conflicto),
    })

    const resultado = await observarRequerimiento(
      detalle,
      'Comentario',
      puerto,
    )

    expect(resultado).toEqual({
      status: 'conflicto-version',
      conflicto,
      entradaConservada: true,
      reintentable: true,
    })
  })

  it('traduce los errores de validación del backend', async () => {
    const puerto = crearPuerto({
      observar: comandoFixture.validacion([
        { campo: 'comentario', mensaje: 'Comentario rechazado por backend' },
        { campo: 'vacantes', mensaje: 'Vacantes rechazadas por backend' },
      ]),
    })

    const resultado = await observarRequerimiento(
      detalle,
      'Comentario',
      puerto,
    )

    expect(resultado).toEqual({
      status: 'validacion',
      errores: [
        { campo: 'comentario', mensaje: 'Comentario rechazado por backend' },
        { campo: 'general', mensaje: 'Vacantes rechazadas por backend' },
      ],
      entradaConservada: true,
      reintentable: true,
    })
  })

  it.each(['capacidad', 'ambito'] as const)(
    'mapea la denegación por %s sin reintento',
    async (motivo) => {
      const puerto = crearPuerto({
        observar: comandoFixture.sinAutorizacion(motivo),
      })

      const resultado = await observarRequerimiento(
        detalle,
        'Comentario',
        puerto,
      )

      expect(resultado).toEqual({
        status: 'sin-autorizacion',
        motivo,
        entradaConservada: true,
        reintentable: false,
      })
    },
  )

  it('mapea el estado inválido devuelto por el backend', async () => {
    const puerto = crearPuerto({
      observar: comandoFixture.estadoInvalido('observado'),
    })

    const resultado = await observarRequerimiento(
      detalle,
      'Comentario',
      puerto,
    )

    expect(resultado).toEqual({
      status: 'estado-invalido',
      estadoActual: 'observado',
      entradaConservada: true,
      reintentable: false,
    })
  })

  it('mapea un error de integración y su posibilidad de reintento', async () => {
    const error: ErrorIntegracion = {
      origen: 'seleccion',
      error: { message: 'Selección no disponible', retryable: true },
    }
    const puerto = crearPuerto({
      observar: comandoFixture.errorIntegracion(error),
    })

    const resultado = await observarRequerimiento(
      detalle,
      'Comentario',
      puerto,
    )

    expect(resultado).toEqual({
      status: 'error-integracion',
      error,
      entradaConservada: true,
      reintentable: true,
    })
  })

  it('mapea un error de contrato y su posibilidad de reintento', async () => {
    const error: ContractError = {
      message: 'No se pudo completar la operación',
      retryable: false,
    }
    const puerto = crearPuerto({ observar: comandoFixture.error(error) })

    const resultado = await observarRequerimiento(
      detalle,
      'Comentario',
      puerto,
    )

    expect(resultado).toEqual({
      status: 'error',
      error,
      entradaConservada: true,
      reintentable: false,
    })
  })

  it('mapea la sesión finalizada', async () => {
    const puerto = crearPuerto({
      observar: comandoFixture.sesionFinalizada(),
    })

    const resultado = await observarRequerimiento(
      detalle,
      'Comentario',
      puerto,
    )

    expect(resultado).toEqual({
      status: 'sesion-finalizada',
      entradaConservada: true,
      reintentable: false,
    })
  })

  it('no invoca al puerto cuando la acción no fue concedida', async () => {
    const puerto = crearPuerto()
    const sinAcciones = detalleCompleto({
      plazo: plazoAdministrativoFijado(17),
      acciones: [],
    })

    const resultado = await observarRequerimiento(
      sinAcciones,
      'Comentario',
      puerto,
    )

    expect(resultado).toMatchObject({
      status: 'accion-no-disponible',
      motivo: 'sin-autorizacion',
    })
    expect(puerto.calls.observar).toHaveLength(0)
  })
})
