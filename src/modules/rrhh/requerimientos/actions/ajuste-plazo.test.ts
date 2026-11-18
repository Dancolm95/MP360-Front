import { describe, expect, it } from 'vitest'
import type { ContractError } from '../../../../shared'
import type {
  AccionRequerimiento,
  Area,
  AreaId,
  AutorizacionRequerimiento,
  CalendarioLaboralId,
  CalendarioLaboralUnico,
  Clasificacion,
  Departamento,
  DepartamentoId,
  DepartamentoUbicacion,
  DepartamentoUbicacionId,
  DetalleRequerimientoBorrador,
  DetalleRequerimientoCanceladoCompleto,
  DetalleRequerimientoCompleto,
  DiaSemana,
  DiasHabilesAdministrativos,
  Distrito,
  DistritoId,
  Empresa,
  EmpresaId,
  ErrorIntegracion,
  EstadoRequerimientoCompleto,
  EventoAjustePlazo,
  EventoHistorial,
  EventoHistorialId,
  FechaISO,
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
import { ajustarPlazoAdministrativo, calcularPlazo } from '..'
import {
  comandoFixture,
  createMockComandosRequerimientos,
  creacionFixture,
} from '../fixtures'
import type {
  ContextoAjustePlazo,
  SolicitudAjustePlazo,
} from '..'
import type {
  MockCommandResults,
  MockComandosRequerimientosPort,
} from '../fixtures'

const id = <T>(value: string) => value as T
const fecha = (value: string) => value as FechaISO
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

const calendario = {
  id: id<CalendarioLaboralId>('calendario-erp'),
  diasHabiles: [
    'lunes',
    'martes',
    'miercoles',
    'jueves',
    'viernes',
  ] as readonly DiaSemana[],
  excepciones: [],
} satisfies CalendarioLaboralUnico

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

const contexto: ContextoAjustePlazo = {
  actor: usuario,
  fechaHora: instante('2026-12-20T10:30:00Z'),
  eventoId: id<EventoHistorialId>('evento-ajuste-1'),
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

function plazoOperativo(): PlazoOperativo {
  return {
    clasificacion: 'operativo',
    fechaAprobacion: fecha('2026-11-16'),
    fechaObjetivo: fecha('2026-11-30'),
    cumplimiento: 'en-plazo',
    duracionDiasHabiles: 10,
    origen: 'operativo-fijo',
    alerta: null,
  }
}

function plazoAdministrativoPendiente(): PlazoAdministrativoPendiente {
  return {
    clasificacion: 'administrativo',
    fechaAprobacion: fecha('2026-11-16'),
    fechaObjetivo: null,
    cumplimiento: 'pendiente',
    duracionDiasHabiles: null,
    origen: 'pendiente',
    alerta: null,
  }
}

function plazoAdministrativoFijado(
  dias: number,
  fechaObjetivo = '2026-12-09',
): PlazoAdministrativoFijado {
  return {
    clasificacion: 'administrativo',
    fechaAprobacion: fecha('2026-11-16'),
    fechaObjetivo: fecha(fechaObjetivo),
    cumplimiento: 'en-plazo',
    duracionDiasHabiles: dias as DiasHabilesAdministrativos,
    origen: 'fijado-administrativo',
    alerta: null,
  }
}

const historialPrevio: readonly EventoHistorial[] = [
  {
    id: id<EventoHistorialId>('evento-aprobacion'),
    usuario,
    fechaHora: instante('2026-11-16T15:04:00Z'),
    accion: 'aprobacion',
    estadoAnterior: 'pendiente-aprobacion',
    estadoNuevo: 'aprobado',
    comentario: 'Aprobado por el Jefe de Operaciones',
  },
  {
    id: id<EventoHistorialId>('evento-alerta'),
    usuario,
    fechaHora: instante('2026-11-26T09:00:00Z'),
    accion: 'alerta',
    nivel: 'temprana',
    fechaObjetivo: fecha('2026-12-09'),
  },
  {
    id: id<EventoHistorialId>('evento-vencimiento'),
    usuario,
    fechaHora: instante('2026-12-10T00:05:00Z'),
    accion: 'vencimiento',
    fechaObjetivo: fecha('2026-12-09'),
    fechaIncumplimiento: fecha('2026-12-10'),
  },
]

interface OpcionesDetalle {
  readonly estado?: EstadoRequerimientoCompleto
  readonly clasificacion?: Clasificacion
  readonly plazo?: PlazoRequerimiento
  readonly acciones?: readonly AccionRequerimiento[]
  readonly version?: number
  readonly historial?: readonly EventoHistorial[]
}

function detalleCompleto(
  opciones: OpcionesDetalle = {},
): DetalleRequerimientoCompleto {
  const clasificacion = opciones.clasificacion ?? 'administrativo'
  const version = opciones.version ?? 3
  return {
    id: requerimientoId,
    version,
    estado: opciones.estado ?? 'aprobado',
    fechaCreacion: instante('2026-11-09T08:00:00Z'),
    historial: opciones.historial ?? historialPrevio,
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
    ubicacion: { departamento: ubicacion, provincia, distrito },
    usuarioProximaTarea: usuario,
    comentario: 'Justificación del requerimiento',
    plazo:
      opciones.plazo ??
      (clasificacion === 'operativo'
        ? plazoOperativo()
        : plazoAdministrativoFijado(17)),
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

function detalleCancelado(): DetalleRequerimientoCanceladoCompleto {
  return {
    ...detalleCompleto({ plazo: plazoAdministrativoFijado(17) }),
    estado: 'cancelado',
    datos: 'completos',
  }
}

function detalleBorrador(): DetalleRequerimientoBorrador {
  return {
    id: requerimientoId,
    version: 1,
    estado: 'borrador',
    fechaCreacion: instante('2026-11-09T08:00:00Z'),
    historial: [],
    autorizacion: crearAutorizacion(TODAS_LAS_ACCIONES, 1),
    borrador: {
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
    },
    plazo: null,
    cobertura: null,
    remuneracionPreviaAlta: null,
    procesoSeleccion: null,
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

function solicitud(
  diasHabiles: unknown,
  motivo: string | null | undefined = 'Ajuste por campaña',
): SolicitudAjustePlazo {
  return { diasHabiles, motivo }
}

const eventoAjuste: EventoAjustePlazo = {
  id: contexto.eventoId,
  usuario,
  fechaHora: contexto.fechaHora,
  accion: 'ajuste-plazo',
  motivo: 'Ajuste por campaña',
  plazoAnteriorDias: 17,
  plazoNuevoDias: 20,
  fechaObjetivoAnterior: fecha('2026-12-09'),
  fechaObjetivoNueva: fecha('2026-12-14'),
}

const detalleDe17 = detalleCompleto({ plazo: plazoAdministrativoFijado(17) })
const confirmadoDe20 = detalleCompleto({
  version: 4,
  plazo: plazoAdministrativoFijado(20, '2026-12-14'),
  historial: [...historialPrevio, eventoAjuste],
})

describe('rechazos del ajuste sin invocar al puerto', () => {
  it.each([null, undefined, '', '   '])(
    'rechaza el motivo %j',
    async (motivo) => {
      const puerto = crearPuerto()

      const resultado = await ajustarPlazoAdministrativo(
        detalleDe17,
        { diasHabiles: 20, motivo },
        contexto,
        calendario,
        puerto,
      )

      expect(resultado).toEqual({
        status: 'validacion',
        errores: [
          {
            campo: 'motivo',
            mensaje: 'El motivo del ajuste es obligatorio.',
          },
        ],
        entradaConservada: true,
        reintentable: true,
      })
      expect(puerto.calls.ajustarPlazoAdministrativo).toHaveLength(0)
    },
  )

  it.each([14, 31, 17.5, 20.25, -20, '20', Number.NaN])(
    'rechaza el plazo %j',
    async (dias) => {
      const puerto = crearPuerto()

      const resultado = await ajustarPlazoAdministrativo(
        detalleDe17,
        solicitud(dias),
        contexto,
        calendario,
        puerto,
      )

      expect(resultado.status).toBe('validacion')
      if (resultado.status === 'validacion') {
        expect(resultado.errores).toEqual([
          {
            campo: 'plazo-administrativo',
            mensaje:
              'El plazo administrativo debe ser un entero entre 15 y 30 días hábiles.',
          },
        ])
        expect(resultado.entradaConservada).toBe(true)
        expect(resultado.reintentable).toBe(true)
      }
      expect(puerto.calls.ajustarPlazoAdministrativo).toHaveLength(0)
    },
  )

  it('acumula motivo y plazo inválidos', async () => {
    const puerto = crearPuerto()

    const resultado = await ajustarPlazoAdministrativo(
      detalleDe17,
      solicitud(14, '  '),
      contexto,
      calendario,
      puerto,
    )

    expect(resultado.status).toBe('validacion')
    if (resultado.status === 'validacion') {
      expect(resultado.errores.map((error) => error.campo)).toEqual([
        'motivo',
        'plazo-administrativo',
      ])
    }
    expect(puerto.calls.ajustarPlazoAdministrativo).toHaveLength(0)
  })

  it.each([
    { estado: 'borrador', crear: detalleBorrador },
    {
      estado: 'pendiente de aprobación',
      crear: () => detalleCompleto({ estado: 'pendiente-aprobacion' }),
    },
    {
      estado: 'cubierto',
      crear: () => detalleCompleto({ estado: 'cubierto' }),
    },
    { estado: 'cancelado', crear: detalleCancelado },
  ])(
    'rechaza un requerimiento en $estado',
    async ({ crear }) => {
      const puerto = crearPuerto()

      const resultado = await ajustarPlazoAdministrativo(
        crear(),
        solicitud(20),
        contexto,
        calendario,
        puerto,
      )

      expect(resultado).toMatchObject({
        status: 'accion-no-disponible',
        accion: 'ajustar-plazo',
        motivo: 'estado-no-aplicable',
        entradaConservada: true,
        reintentable: false,
      })
      expect(puerto.calls.ajustarPlazoAdministrativo).toHaveLength(0)
    },
  )

  it('rechaza un Operativo aunque el backend conceda la acción', async () => {
    const puerto = crearPuerto()

    const resultado = await ajustarPlazoAdministrativo(
      detalleCompleto({
        clasificacion: 'operativo',
        plazo: plazoOperativo(),
      }),
      solicitud(20),
      contexto,
      calendario,
      puerto,
    )

    expect(resultado).toMatchObject({
      status: 'accion-no-disponible',
      accion: 'ajustar-plazo',
      motivo: 'clasificacion-no-aplicable',
      entradaConservada: true,
      reintentable: false,
    })
    expect(puerto.calls.ajustarPlazoAdministrativo).toHaveLength(0)
  })

  it('rechaza sin la acción concedida por el backend', async () => {
    const puerto = crearPuerto()

    const resultado = await ajustarPlazoAdministrativo(
      detalleCompleto({ acciones: ['cancelar'] }),
      solicitud(20),
      contexto,
      calendario,
      puerto,
    )

    expect(resultado).toMatchObject({
      status: 'accion-no-disponible',
      accion: 'ajustar-plazo',
      motivo: 'sin-autorizacion',
      entradaConservada: true,
      reintentable: false,
    })
    expect(puerto.calls.ajustarPlazoAdministrativo).toHaveLength(0)
  })

  it('rechaza si no hay plazo vigente que ajustar', async () => {
    const puerto = crearPuerto()

    const resultado = await ajustarPlazoAdministrativo(
      detalleCompleto({ plazo: plazoAdministrativoPendiente() }),
      solicitud(20),
      contexto,
      calendario,
      puerto,
    )

    expect(resultado).toMatchObject({
      status: 'validacion',
      entradaConservada: true,
      reintentable: true,
    })
    if (resultado.status === 'validacion') {
      expect(resultado.errores[0]?.campo).toBe('plazo-administrativo')
    }
    expect(puerto.calls.ajustarPlazoAdministrativo).toHaveLength(0)
  })

  it('rechaza si falta la aprobación original', async () => {
    const puerto = crearPuerto()
    const sinAprobacion: PlazoAdministrativoFijado = {
      ...plazoAdministrativoFijado(17),
      fechaAprobacion: null,
    }

    const resultado = await ajustarPlazoAdministrativo(
      detalleCompleto({ plazo: sinAprobacion }),
      solicitud(20),
      contexto,
      calendario,
      puerto,
    )

    expect(resultado).toMatchObject({
      status: 'validacion',
      entradaConservada: true,
      reintentable: true,
    })
    expect(puerto.calls.ajustarPlazoAdministrativo).toHaveLength(0)
  })
})

describe('ajuste aceptado y recálculo desde la aprobación original', () => {
  it('17 → 20 recalcula la fecha objetivo desde el día 0 original', async () => {
    const puerto = crearPuerto({
      ajustarPlazoAdministrativo: comandoFixture.confirmado(confirmadoDe20),
    })

    const resultado = await ajustarPlazoAdministrativo(
      detalleDe17,
      solicitud(20, '  Ajuste por campaña  '),
      contexto,
      calendario,
      puerto,
    )

    expect(resultado.status).toBe('confirmado')
    if (resultado.status !== 'confirmado') return

    const directo = calcularPlazo(
      {
        clasificacion: 'administrativo',
        diasHabiles: 20,
        fechaAprobacion: fecha('2026-11-16'),
      },
      calendario,
    )
    const desdeElAjuste = calcularPlazo(
      {
        clasificacion: 'administrativo',
        diasHabiles: 20,
        fechaAprobacion: fecha('2026-12-20'),
      },
      calendario,
    )
    if (!directo.ok || !desdeElAjuste.ok) {
      throw new Error('El cómputo de referencia debería ser válido')
    }

    expect(resultado.ajuste.plazo).toEqual(directo.plazo)
    expect(resultado.ajuste.plazo.fechaAprobacion).toBe('2026-11-16')
    expect(resultado.ajuste.plazo.duracionDiasHabiles).toBe(20)
    expect(resultado.ajuste.plazo.fechaObjetivo).toBe('2026-12-14')
    expect(resultado.ajuste.plazo.fechaObjetivo).not.toBe(
      desdeElAjuste.plazo.fechaObjetivo,
    )
    expect(resultado.ajuste.plazo.fechaVencimiento).toBe('2026-12-15')
    expect(
      resultado.ajuste.plazo.umbrales.map(
        (umbral) => `${umbral.nivel}:${umbral.diaHabil}:${umbral.fecha}`,
      ),
    ).toEqual([
      'temprana:10:2026-11-30',
      'media:15:2026-12-07',
      'critica:18:2026-12-10',
    ])

    expect(puerto.calls.ajustarPlazoAdministrativo).toEqual([
      {
        requerimientoId,
        version: 3,
        diasHabiles: 20,
        motivo: 'Ajuste por campaña',
      },
    ])
    expect(resultado.detalle).toEqual(confirmadoDe20)
  })

  it('genera el evento auditado con motivo, valores, fechas, actor y momento', async () => {
    const puerto = crearPuerto({
      ajustarPlazoAdministrativo: comandoFixture.confirmado(confirmadoDe20),
    })

    const resultado = await ajustarPlazoAdministrativo(
      detalleDe17,
      solicitud(20),
      contexto,
      calendario,
      puerto,
    )

    if (resultado.status !== 'confirmado') {
      throw new Error(`Se esperaba confirmación: ${resultado.status}`)
    }

    expect(resultado.ajuste.evento).toEqual({
      id: id<EventoHistorialId>('evento-ajuste-1'),
      usuario,
      fechaHora: instante('2026-12-20T10:30:00Z'),
      accion: 'ajuste-plazo',
      motivo: 'Ajuste por campaña',
      plazoAnteriorDias: 17,
      plazoNuevoDias: 20,
      fechaObjetivoAnterior: '2026-12-09',
      fechaObjetivoNueva: '2026-12-14',
    })

    expect(Object.keys(resultado.ajuste).sort()).toEqual([
      'evento',
      'fechaObjetivoAnterior',
      'motivo',
      'plazo',
      'plazoAnteriorDias',
      'plazoNuevoDias',
    ])

    expect(resultado.detalle.historial).toEqual([
      ...historialPrevio,
      resultado.ajuste.evento,
    ])
    expect(
      resultado.detalle.historial.filter((evento) => evento.accion === 'alerta'),
    ).toEqual([historialPrevio[1]])
    expect(
      resultado.detalle.historial
        .filter((evento) => evento.accion === 'vencimiento')
        .map((evento) => evento.fechaObjetivo),
    ).toEqual(['2026-12-09'])
  })

  it('no modifica los eventos históricos del detalle leído', async () => {
    const puerto = crearPuerto({
      ajustarPlazoAdministrativo: comandoFixture.confirmado(confirmadoDe20),
    })
    const historialAntes = structuredClone(detalleDe17.historial)
    const plazoAntes = structuredClone(detalleDe17.plazo)

    await ajustarPlazoAdministrativo(
      detalleDe17,
      solicitud(20),
      contexto,
      calendario,
      puerto,
    )

    expect(detalleDe17.historial).toEqual(historialAntes)
    expect(detalleDe17.plazo).toEqual(plazoAntes)
  })

  it.each([15, 30])('acepta el límite administrativo %i', async (dias) => {
    const confirmado = detalleCompleto({
      version: 4,
      plazo: plazoAdministrativoFijado(dias),
    })
    const puerto = crearPuerto({
      ajustarPlazoAdministrativo: comandoFixture.confirmado(confirmado),
    })

    const resultado = await ajustarPlazoAdministrativo(
      detalleDe17,
      solicitud(dias),
      contexto,
      calendario,
      puerto,
    )

    expect(resultado.status).toBe('confirmado')
    expect(puerto.calls.ajustarPlazoAdministrativo).toEqual([
      {
        requerimientoId,
        version: 3,
        diasHabiles: dias,
        motivo: 'Ajuste por campaña',
      },
    ])
  })

  it('acepta el ajuste en En reclutamiento', async () => {
    const puerto = crearPuerto({
      ajustarPlazoAdministrativo: comandoFixture.confirmado(confirmadoDe20),
    })

    const resultado = await ajustarPlazoAdministrativo(
      detalleCompleto({
        estado: 'en-reclutamiento',
        plazo: plazoAdministrativoFijado(17),
      }),
      solicitud(20),
      contexto,
      calendario,
      puerto,
    )

    expect(resultado.status).toBe('confirmado')
    expect(puerto.calls.ajustarPlazoAdministrativo).toHaveLength(1)
  })
})

describe('mapeo de resultados del comando', () => {
  async function ejecutarCon(
    resultado: MockCommandResults['ajustarPlazoAdministrativo'],
  ) {
    return ajustarPlazoAdministrativo(
      detalleDe17,
      solicitud(20),
      contexto,
      calendario,
      crearPuerto({ ajustarPlazoAdministrativo: resultado }),
    )
  }

  it('conserva la entrada ante un conflicto de versión', async () => {
    const conflicto = {
      versionEsperada: 3,
      versionVigente: 4,
      datosVigentes: detalleCompleto({
        version: 4,
        plazo: plazoAdministrativoFijado(17),
      }),
    }

    const resultado = await ejecutarCon(comandoFixture.conflicto(conflicto))

    expect(resultado).toEqual({
      status: 'conflicto-version',
      conflicto,
      entradaConservada: true,
      reintentable: true,
    })
  })

  it('conserva la entrada del comando enviado ante el conflicto', async () => {
    const puerto = crearPuerto({
      ajustarPlazoAdministrativo: comandoFixture.conflicto({
        versionEsperada: 3,
        versionVigente: 4,
        datosVigentes: detalleCompleto({ version: 4 }),
      }),
    })

    await ajustarPlazoAdministrativo(
      detalleDe17,
      solicitud(20, '  Cobertura ampliada  '),
      contexto,
      calendario,
      puerto,
    )

    expect(puerto.calls.ajustarPlazoAdministrativo).toEqual([
      {
        requerimientoId,
        version: 3,
        diasHabiles: 20,
        motivo: 'Cobertura ampliada',
      },
    ])
  })

  it('traduce los errores de validación del backend', async () => {
    const resultado = await ejecutarCon(
      comandoFixture.validacion([
        { campo: 'motivo', mensaje: 'Motivo rechazado por backend' },
        {
          campo: 'plazo-administrativo',
          mensaje: 'Plazo rechazado por backend',
        },
        { campo: 'comentario', mensaje: 'Comentario rechazado por backend' },
        { campo: 'vacantes', mensaje: 'Vacantes rechazadas por backend' },
      ]),
    )

    expect(resultado).toEqual({
      status: 'validacion',
      errores: [
        { campo: 'motivo', mensaje: 'Motivo rechazado por backend' },
        { campo: 'plazo-administrativo', mensaje: 'Plazo rechazado por backend' },
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
      const resultado = await ejecutarCon(comandoFixture.sinAutorizacion(motivo))

      expect(resultado).toEqual({
        status: 'sin-autorizacion',
        motivo,
        entradaConservada: true,
        reintentable: false,
      })
    },
  )

  it('mapea el estado inválido devuelto por el backend', async () => {
    const resultado = await ejecutarCon(
      comandoFixture.estadoInvalido('cubierto'),
    )

    expect(resultado).toEqual({
      status: 'estado-invalido',
      estadoActual: 'cubierto',
      entradaConservada: true,
      reintentable: false,
    })
  })

  it('mapea un error de integración y su posibilidad de reintento', async () => {
    const error: ErrorIntegracion = {
      origen: 'alta',
      error: { message: 'Alta no disponible', retryable: true },
    }

    const resultado = await ejecutarCon(comandoFixture.errorIntegracion(error))

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

    const resultado = await ejecutarCon(comandoFixture.error(error))

    expect(resultado).toEqual({
      status: 'error',
      error,
      entradaConservada: true,
      reintentable: false,
    })
  })

  it('mapea la sesión finalizada', async () => {
    const resultado = await ejecutarCon(comandoFixture.sesionFinalizada())

    expect(resultado).toEqual({
      status: 'sesion-finalizada',
      entradaConservada: true,
      reintentable: false,
    })
  })
})
