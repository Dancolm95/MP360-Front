import { describe, expect, it } from 'vitest'
import type {
  AccionRequerimiento,
  Area,
  AreaId,
  AutorizacionRequerimiento,
  BorradorRequerimiento,
  CalendarioLaboralId,
  CalendarioLaboralUnico,
  Clasificacion,
  CoberturaRequerimiento,
  Departamento,
  DepartamentoId,
  DepartamentoUbicacion,
  DepartamentoUbicacionId,
  DetalleRequerimiento,
  DetalleRequerimientoBorrador,
  DetalleRequerimientoCanceladoCompleto,
  DetalleRequerimientoCompleto,
  DiaSemana,
  Distrito,
  DistritoId,
  Empresa,
  EmpresaId,
  EstadoRequerimiento,
  EstadoRequerimientoCompleto,
  EventoAperturaProceso,
  EventoHistorialId,
  EventoPrimerDiaReal,
  EventoReversionCobertura,
  EvaluacionPlazo,
  FechaISO,
  InstanteISO,
  PlazoAdministrativoFijado,
  PlazoAdministrativoPendiente,
  PlazoOperativo,
  PlazoRequerimiento,
  ProcesoSeleccionId,
  Provincia,
  ProvinciaId,
  Puesto,
  PuestoId,
  RequerimientoId,
  SolicitudReversionId,
  Subarea,
  SubareaId,
  Usuario,
  UsuarioId,
  ColaboradorId,
} from '..'
import {
  ACCIONES_ELEGIBLES,
  CAUSALES_CANCELACION,
  ESTADOS_CANCELABLES,
  ESTADOS_TERMINALES,
  SUCESOS_TRANSICION,
  TRANSICIONES,
  efectoVencimiento,
  evaluarPlazo,
  evaluarTransicion,
} from '..'
import {
  comandoFixture,
  createMockComandosRequerimientos,
  creacionFixture,
} from '../fixtures'

const id = <T>(value: string) => value as T
const instante = (value: string) => value as InstanteISO
const fecha = (value: string) => value as FechaISO

const requerimientoId = id<RequerimientoId>('req-1')
const actor: Usuario = {
  id: id<UsuarioId>('usuario-a'),
  nombre: 'Usuario A',
}

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

const ESTADOS: readonly EstadoRequerimiento[] = [
  'borrador',
  'pendiente-aprobacion',
  'observado',
  'aprobado',
  'en-reclutamiento',
  'cubierto',
  'cancelado',
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
    duracionDiasHabiles: dias as PlazoAdministrativoFijado['duracionDiasHabiles'],
    origen: 'fijado-administrativo',
    alerta: null,
  }
}

function cobertura(
  solicitadas: number,
  cubiertas: number,
  pendientes = solicitadas - cubiertas,
): CoberturaRequerimiento {
  return { solicitadas, cubiertas, pendientes, primerosDiasReales: [] }
}

interface OpcionesDetalleCompleto {
  readonly estado?: EstadoRequerimientoCompleto
  readonly clasificacion?: Clasificacion
  readonly plazo?: PlazoRequerimiento
  readonly cobertura?: CoberturaRequerimiento
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
    ubicacion: { departamento: ubicacion, provincia, distrito },
    usuarioProximaTarea: actor,
    comentario: 'Justificación del requerimiento',
    plazo:
      opciones.plazo ??
      (clasificacion === 'operativo'
        ? plazoOperativo()
        : plazoAdministrativoFijado(17)),
    cobertura: opciones.cobertura ?? cobertura(2, 0),
    remuneracionPreviaAlta: null,
    procesoSeleccion: null,
  }
}

const borradorParcial: BorradorRequerimiento = {
  motivo: 'nueva-vacante',
  empresaId: empresa.id,
  colaboradorAReemplazarId: null,
  departamentoId: departamento.id,
  areaId: area.id,
  subareaId: subarea.id,
  puestoId: puestoAdministrativo.id,
  vacantes: 2,
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
    borrador: borradorParcial,
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

function coberturaDe(estado: EstadoRequerimiento): CoberturaRequerimiento {
  if (estado === 'cubierto') return cobertura(2, 2)
  if (estado === 'en-reclutamiento') return cobertura(2, 1)
  return cobertura(2, 0)
}

function detallePara(estado: EstadoRequerimiento): DetalleRequerimiento {
  if (estado === 'borrador') return detalleBorrador()
  if (estado === 'cancelado') return detalleCanceladoCompleto()
  return detalleCompleto({ estado, cobertura: coberturaDe(estado) })
}

function detalleConAcciones(
  estado: EstadoRequerimiento,
  acciones: readonly AccionRequerimiento[],
): DetalleRequerimiento {
  if (estado === 'borrador') return detalleBorrador(acciones)
  if (estado === 'cancelado') return detalleCanceladoCompleto(acciones)
  return detalleCompleto({ estado, acciones })
}

function eventoApertura(): EventoAperturaProceso {
  return {
    id: id<EventoHistorialId>('evento-apertura'),
    usuario: actor,
    fechaHora: instante('2026-11-17T10:00:00Z'),
    accion: 'apertura-proceso',
    proceso: { id: id<ProcesoSeleccionId>('proceso-a') },
  }
}

function eventoPrimerDia(): EventoPrimerDiaReal {
  return {
    id: id<EventoHistorialId>('evento-primer-dia'),
    usuario: actor,
    fechaHora: instante('2026-11-18T10:00:00Z'),
    accion: 'primer-dia-real',
    fecha: fecha('2026-11-18'),
  }
}

interface OpcionesReversion {
  readonly motivo?: string
  readonly solicitadas?: number
  readonly cubiertas?: number
  readonly pendientes?: number
}

function eventoReversion(
  opciones: OpcionesReversion = {},
): EventoReversionCobertura {
  return {
    id: id<EventoHistorialId>('evento-reversion'),
    usuario: actor,
    fechaHora: instante('2026-11-19T10:00:00Z'),
    accion: 'reversion-cobertura',
    solicitudId: id<SolicitudReversionId>('solicitud-a'),
    origen: 'seleccion',
    motivo: opciones.motivo ?? 'Cobertura registrada por error',
    colaboradorAfectadoId: id<ColaboradorId>('colaborador-a'),
    efectoCobertura: {
      solicitadas: opciones.solicitadas ?? 2,
      cubiertas: opciones.cubiertas ?? 0,
      pendientes: opciones.pendientes ?? 2,
      estadoResultante: 'en-reclutamiento',
    },
  }
}

const ORIGENES_ESPERADOS: Readonly<
  Record<(typeof SUCESOS_TRANSICION)[number], readonly EstadoRequerimiento[]>
> = {
  editar: ['pendiente-aprobacion'],
  enviar: ['borrador'],
  reenviar: ['observado'],
  aprobar: ['pendiente-aprobacion'],
  observar: ['pendiente-aprobacion'],
  'fijar-plazo': ['pendiente-aprobacion'],
  'ajustar-plazo': ['aprobado', 'en-reclutamiento'],
  'iniciar-apertura-proceso': ['aprobado'],
  'confirmar-apertura-proceso': ['aprobado'],
  'confirmar-primer-dia-real': ['en-reclutamiento'],
  'confirmar-reversion-cobertura': ['cubierto', 'en-reclutamiento'],
  cancelar: ESTADOS_CANCELABLES,
}

type Suceso = (typeof SUCESOS_TRANSICION)[number]

function destinoEsperado(
  suceso: Suceso,
  origen: EstadoRequerimiento,
): EstadoRequerimiento {
  switch (suceso) {
    case 'editar':
    case 'fijar-plazo':
    case 'ajustar-plazo':
    case 'iniciar-apertura-proceso':
      return origen
    case 'enviar':
    case 'reenviar':
      return 'pendiente-aprobacion'
    case 'aprobar':
      return 'aprobado'
    case 'observar':
      return 'observado'
    case 'confirmar-apertura-proceso':
    case 'confirmar-reversion-cobertura':
      return 'en-reclutamiento'
    case 'confirmar-primer-dia-real':
      return 'en-reclutamiento'
    case 'cancelar':
      return 'cancelado'
  }
}

function solicitudPara(suceso: Suceso) {
  switch (suceso) {
    case 'confirmar-apertura-proceso':
      return { suceso, evento: eventoApertura() } as const
    case 'confirmar-primer-dia-real':
      return {
        suceso,
        evento: eventoPrimerDia(),
        cobertura: cobertura(2, 1),
      } as const
    case 'confirmar-reversion-cobertura':
      return { suceso, evento: eventoReversion() } as const
    case 'cancelar':
      return {
        suceso,
        confirmado: true,
        causal: 'menor-carga-laboral',
      } as const
    case 'editar':
    case 'enviar':
    case 'reenviar':
    case 'aprobar':
    case 'observar':
    case 'fijar-plazo':
    case 'ajustar-plazo':
    case 'iniciar-apertura-proceso':
      return { suceso } as const
  }
}

describe('modelo explícito de transiciones', () => {
  it('declara exactamente los orígenes de la spec §6', () => {
    for (const suceso of SUCESOS_TRANSICION) {
      expect(TRANSICIONES[suceso].origenes).toEqual(ORIGENES_ESPERADOS[suceso])
    }
  })

  it('mantiene una única lista de acciones elegibles con el ajuste de plazo', () => {
    expect(ACCIONES_ELEGIBLES).toEqual([
      'aprobar',
      'observar',
      'cancelar',
      'fijar-plazo',
      'ajustar-plazo',
    ])
  })

  it('solo declara Cancelado como estado terminal', () => {
    expect(ESTADOS_TERMINALES).toEqual(['cancelado'])
  })

  it('declara exactamente las causales de cancelación de §6', () => {
    expect(CAUSALES_CANCELACION).toEqual([
      'menor-carga-laboral',
      'creacion-por-error',
    ])
  })
})

describe('matriz de transiciones permitidas y rechazadas', () => {
  it('evalúa cada suceso desde todos los estados', () => {
    for (const suceso of SUCESOS_TRANSICION) {
      for (const origen of ESTADOS) {
        const resultado = evaluarTransicion(
          detallePara(origen),
          solicitudPara(suceso),
        )
        const permitido = ORIGENES_ESPERADOS[suceso].includes(origen)

        expect(resultado.estadoOrigen).toBe(origen)
        expect(resultado.permitida, `${suceso} desde ${origen}`).toBe(permitido)

        if (resultado.permitida) {
          const destino = destinoEsperado(suceso, origen)
          expect(resultado.estadoDestino).toBe(destino)
          expect(resultado.cambiaEstado).toBe(origen !== destino)
        } else {
          expect(resultado.motivo).toBe('suceso-no-aplica-al-estado')
        }
      }
    }
  })

  it('cubre la matriz completa de pares origen → destino', () => {
    const permitidos = new Set([
      'borrador->pendiente-aprobacion',
      'borrador->cancelado',
      'pendiente-aprobacion->pendiente-aprobacion',
      'pendiente-aprobacion->observado',
      'pendiente-aprobacion->aprobado',
      'pendiente-aprobacion->cancelado',
      'observado->pendiente-aprobacion',
      'observado->cancelado',
      'aprobado->aprobado',
      'aprobado->en-reclutamiento',
      'aprobado->cancelado',
      'en-reclutamiento->en-reclutamiento',
      'en-reclutamiento->cubierto',
      'en-reclutamiento->cancelado',
      'cubierto->en-reclutamiento',
    ])

    const reales = new Set<string>()
    for (const origen of ESTADOS) {
      for (const suceso of SUCESOS_TRANSICION) {
        if (!ORIGENES_ESPERADOS[suceso].includes(origen)) continue
        const resultado = evaluarTransicion(
          detallePara(origen),
          solicitudPara(suceso),
        )
        if (resultado.permitida) {
          reales.add(`${origen}->${resultado.estadoDestino}`)
        }
      }
    }

    const completo = evaluarTransicion(detallePara('en-reclutamiento'), {
      suceso: 'confirmar-primer-dia-real',
      evento: eventoPrimerDia(),
      cobertura: cobertura(2, 2),
    })
    if (completo.permitida) {
      reales.add(`en-reclutamiento->${completo.estadoDestino}`)
    }

    for (const origen of ESTADOS) {
      for (const destino of ESTADOS) {
        const clave = `${origen}->${destino}`
        expect(reales.has(clave), clave).toBe(permitidos.has(clave))
      }
    }
    expect(reales).toEqual(permitidos)
  })

  it('Cancelado no admite ninguna transición', () => {
    for (const suceso of SUCESOS_TRANSICION) {
      const resultado = evaluarTransicion(
        detalleCanceladoCompleto(),
        solicitudPara(suceso),
      )
      expect(resultado.permitida, suceso).toBe(false)
      if (!resultado.permitida) {
        expect(resultado.motivo).toBe('suceso-no-aplica-al-estado')
      }
    }
  })

  it('Cubierto solo sale por reversión de cobertura', () => {
    for (const suceso of SUCESOS_TRANSICION) {
      const resultado = evaluarTransicion(
        detallePara('cubierto'),
        solicitudPara(suceso),
      )
      if (suceso === 'confirmar-reversion-cobertura') {
        expect(resultado.permitida).toBe(true)
        if (resultado.permitida) {
          expect(resultado.estadoDestino).toBe('en-reclutamiento')
        }
      } else {
        expect(resultado.permitida, suceso).toBe(false)
      }
    }
  })
})

describe('guardas de capacidad', () => {
  const ACCION_DE: Partial<Record<Suceso, AccionRequerimiento>> = {
    editar: 'editar',
    enviar: 'enviar',
    reenviar: 'enviar',
    aprobar: 'aprobar',
    observar: 'observar',
    'fijar-plazo': 'fijar-plazo',
    'ajustar-plazo': 'ajustar-plazo',
    'iniciar-apertura-proceso': 'abrir-proceso-seleccion',
    cancelar: 'cancelar',
  }

  it.each(Object.entries(ACCION_DE))(
    'rechaza %s sin la acción %s',
    (suceso, accion) => {
      const origen = ORIGENES_ESPERADOS[suceso as Suceso][0]
      const detalle = detalleConAcciones(
        origen,
        TODAS_LAS_ACCIONES.filter((candidata) => candidata !== accion),
      )

      const resultado = evaluarTransicion(
        detalle,
        solicitudPara(suceso as Suceso),
      )

      expect(resultado.permitida).toBe(false)
      if (!resultado.permitida) {
        expect(resultado.motivo).toBe('sin-autorizacion')
      }
    },
  )

  it.each([
    'confirmar-apertura-proceso',
    'confirmar-primer-dia-real',
    'confirmar-reversion-cobertura',
  ] as const)('%s no exige una acción de usuario', (suceso) => {
    const origen = ORIGENES_ESPERADOS[suceso][0]
    const detalle = detalleConAcciones(origen, [])

    const resultado = evaluarTransicion(detalle, solicitudPara(suceso))

    expect(resultado.permitida).toBe(true)
  })
})

describe('guardas de clasificación y plazo', () => {
  it('fijar plazo exige clasificación administrativa', () => {
    const operativo = detalleCompleto({
      clasificacion: 'operativo',
      estado: 'pendiente-aprobacion',
    })

    const resultado = evaluarTransicion(operativo, { suceso: 'fijar-plazo' })

    expect(resultado.permitida).toBe(false)
    if (!resultado.permitida) {
      expect(resultado.motivo).toBe('clasificacion-no-aplicable')
    }
  })

  it('ajustar plazo exige clasificación administrativa y estado Aprobado o En reclutamiento', () => {
    const operativo = detalleCompleto({
      clasificacion: 'operativo',
      estado: 'aprobado',
    })
    const pendiente = detalleCompleto({ estado: 'pendiente-aprobacion' })

    const porClasificacion = evaluarTransicion(operativo, {
      suceso: 'ajustar-plazo',
    })
    const porEstado = evaluarTransicion(pendiente, {
      suceso: 'ajustar-plazo',
    })

    expect(porClasificacion.permitida).toBe(false)
    if (!porClasificacion.permitida) {
      expect(porClasificacion.motivo).toBe('clasificacion-no-aplicable')
    }
    expect(porEstado.permitida).toBe(false)
    if (!porEstado.permitida) {
      expect(porEstado.motivo).toBe('suceso-no-aplica-al-estado')
    }
  })

  it.each([null, 14, 31, 17.5])(
    'rechaza aprobar un Administrativo con plazo %j',
    (dias) => {
      const detalle = detalleCompleto({
        estado: 'pendiente-aprobacion',
        plazo:
          dias === null
            ? plazoAdministrativoPendiente()
            : plazoAdministrativoFijado(dias),
      })

      const resultado = evaluarTransicion(detalle, { suceso: 'aprobar' })

      expect(resultado.permitida).toBe(false)
      if (!resultado.permitida) {
        expect(resultado.motivo).toBe('plazo-administrativo-invalido')
      }
    },
  )

  it.each([15, 30])('aprueba un Administrativo con plazo %i', (dias) => {
    const detalle = detalleCompleto({
      estado: 'pendiente-aprobacion',
      plazo: plazoAdministrativoFijado(dias),
    })

    const resultado = evaluarTransicion(detalle, { suceso: 'aprobar' })

    expect(resultado.permitida).toBe(true)
    if (resultado.permitida) {
      expect(resultado.estadoDestino).toBe('aprobado')
    }
  })

  it('aprueba un Operativo sin plazo administrativo', () => {
    const detalle = detalleCompleto({
      clasificacion: 'operativo',
      estado: 'pendiente-aprobacion',
      plazo: plazoOperativo(),
    })

    const resultado = evaluarTransicion(detalle, { suceso: 'aprobar' })

    expect(resultado.permitida).toBe(true)
  })
})

describe('integración Selección/Alta', () => {
  it('la apertura iniciada no cambia el estado y queda pendiente de confirmación', () => {
    const detalle = detalleCompleto({ estado: 'aprobado' })

    const resultado = evaluarTransicion(detalle, {
      suceso: 'iniciar-apertura-proceso',
    })

    expect(resultado).toMatchObject({
      permitida: true,
      estadoOrigen: 'aprobado',
      estadoDestino: 'aprobado',
      cambiaEstado: false,
      requiereConfirmacion: 'apertura-proceso',
    })
  })

  it('Aprobado → En reclutamiento sin confirmación de Selección se rechaza', () => {
    const resultado = evaluarTransicion(
      detalleCompleto({ estado: 'aprobado' }),
      { suceso: 'confirmar-apertura-proceso', evento: null },
    )

    expect(resultado.permitida).toBe(false)
    if (!resultado.permitida) {
      expect(resultado.motivo).toBe('integracion-sin-confirmar')
    }
  })

  it('Aprobado → En reclutamiento con la confirmación de Selección', () => {
    const resultado = evaluarTransicion(
      detalleCompleto({ estado: 'aprobado' }),
      { suceso: 'confirmar-apertura-proceso', evento: eventoApertura() },
    )

    expect(resultado).toMatchObject({
      permitida: true,
      estadoOrigen: 'aprobado',
      estadoDestino: 'en-reclutamiento',
      cambiaEstado: true,
    })
  })

  it('Cubierto → En reclutamiento sin evento auditado se rechaza', () => {
    const resultado = evaluarTransicion(detallePara('cubierto'), {
      suceso: 'confirmar-reversion-cobertura',
      evento: null,
    })

    expect(resultado.permitida).toBe(false)
    if (!resultado.permitida) {
      expect(resultado.motivo).toBe('integracion-sin-confirmar')
    }
  })

  it('Cubierto → En reclutamiento con el evento auditado de Selección', () => {
    const resultado = evaluarTransicion(detallePara('cubierto'), {
      suceso: 'confirmar-reversion-cobertura',
      evento: eventoReversion(),
    })

    expect(resultado).toMatchObject({
      permitida: true,
      estadoOrigen: 'cubierto',
      estadoDestino: 'en-reclutamiento',
    })
  })

  it('una reversión con pendientes previos permanece En reclutamiento', () => {
    const resultado = evaluarTransicion(detallePara('en-reclutamiento'), {
      suceso: 'confirmar-reversion-cobertura',
      evento: eventoReversion({ solicitadas: 3, cubiertas: 1, pendientes: 2 }),
    })

    expect(resultado).toMatchObject({
      permitida: true,
      estadoOrigen: 'en-reclutamiento',
      estadoDestino: 'en-reclutamiento',
      cambiaEstado: false,
    })
  })

  it('rechaza una reversión sin motivo', () => {
    const resultado = evaluarTransicion(detallePara('cubierto'), {
      suceso: 'confirmar-reversion-cobertura',
      evento: eventoReversion({ motivo: '   ' }),
    })

    expect(resultado.permitida).toBe(false)
    if (!resultado.permitida) {
      expect(resultado.motivo).toBe('motivo-requerido')
    }
  })

  it('rechaza una reversión que no deja vacantes pendientes', () => {
    const resultado = evaluarTransicion(detallePara('cubierto'), {
      suceso: 'confirmar-reversion-cobertura',
      evento: eventoReversion({ solicitadas: 2, cubiertas: 2, pendientes: 0 }),
    })

    expect(resultado.permitida).toBe(false)
    if (!resultado.permitida) {
      expect(resultado.motivo).toBe('cobertura-sin-pendientes')
    }
  })

  it('Cubierto solo se alcanza cuando pendientes llega a cero', () => {
    const conPendientes = evaluarTransicion(detallePara('en-reclutamiento'), {
      suceso: 'confirmar-primer-dia-real',
      evento: eventoPrimerDia(),
      cobertura: cobertura(3, 1),
    })
    const completo = evaluarTransicion(detallePara('en-reclutamiento'), {
      suceso: 'confirmar-primer-dia-real',
      evento: eventoPrimerDia(),
      cobertura: cobertura(3, 3),
    })

    expect(conPendientes).toMatchObject({
      permitida: true,
      estadoDestino: 'en-reclutamiento',
      cambiaEstado: false,
    })
    expect(completo).toMatchObject({
      permitida: true,
      estadoDestino: 'cubierto',
      cambiaEstado: true,
    })
  })

  it('rechaza el primer día real sin evento confirmado por Alta', () => {
    const resultado = evaluarTransicion(detallePara('en-reclutamiento'), {
      suceso: 'confirmar-primer-dia-real',
      evento: null,
      cobertura: cobertura(2, 1),
    })

    expect(resultado.permitida).toBe(false)
    if (!resultado.permitida) {
      expect(resultado.motivo).toBe('integracion-sin-confirmar')
    }
  })

  it('rechaza una cobertura que no cumple pendientes = solicitadas − cubiertas', () => {
    const resultado = evaluarTransicion(detallePara('en-reclutamiento'), {
      suceso: 'confirmar-primer-dia-real',
      evento: eventoPrimerDia(),
      cobertura: cobertura(3, 1, 1),
    })

    expect(resultado.permitida).toBe(false)
    if (!resultado.permitida) {
      expect(resultado.motivo).toBe('cobertura-inconsistente')
    }
  })
})

describe('cancelación', () => {
  const casos = ESTADOS_CANCELABLES.flatMap((estado) =>
    CAUSALES_CANCELACION.map((causal) => ({ estado, causal })),
  )

  it.each(casos)('cancela desde $estado con $causal', ({ estado, causal }) => {
    const resultado = evaluarTransicion(detallePara(estado), {
      suceso: 'cancelar',
      confirmado: true,
      causal,
    })

    expect(resultado.permitida).toBe(true)
    if (resultado.permitida) {
      expect(resultado.estadoOrigen).toBe(estado)
      expect(resultado.estadoDestino).toBe('cancelado')
      expect(resultado.cambiaEstado).toBe(true)
      expect(resultado.datosConservados).toBe(
        estado === 'borrador' ? 'parciales' : 'completos',
      )
    }
  })

  it.each(['cubierto', 'cancelado'] as const)(
    'rechaza cancelar desde %s',
    (estado) => {
      const resultado = evaluarTransicion(detallePara(estado), {
        suceso: 'cancelar',
        confirmado: true,
        causal: 'menor-carga-laboral',
      })

      expect(resultado.permitida).toBe(false)
      if (!resultado.permitida) {
        expect(resultado.motivo).toBe('suceso-no-aplica-al-estado')
      }
    },
  )

  it('exige confirmación explícita', () => {
    const resultado = evaluarTransicion(detallePara('pendiente-aprobacion'), {
      suceso: 'cancelar',
      confirmado: false,
      causal: 'menor-carga-laboral',
    })

    expect(resultado.permitida).toBe(false)
    if (!resultado.permitida) {
      expect(resultado.motivo).toBe('confirmacion-requerida')
    }
  })

  it.each([null, 'otra-causal' as unknown as 'menor-carga-laboral'])(
    'exige una causal del catálogo (%j)',
    (causal) => {
      const resultado = evaluarTransicion(detallePara('pendiente-aprobacion'), {
        suceso: 'cancelar',
        confirmado: true,
        causal,
      })

      expect(resultado.permitida).toBe(false)
      if (!resultado.permitida) {
        expect(resultado.motivo).toBe('causal-requerida')
      }
    },
  )

  it('un Borrador incompleto conserva sus datos parciales sin inventar campos', () => {
    const detalle = Object.freeze(detalleBorrador())

    const resultado = evaluarTransicion(detalle, {
      suceso: 'cancelar',
      confirmado: true,
      causal: 'creacion-por-error',
    })

    expect(resultado.permitida).toBe(true)
    expect(Object.keys(resultado).sort()).toEqual([
      'cambiaEstado',
      'datosConservados',
      'estadoDestino',
      'estadoOrigen',
      'nuevaVersion',
      'permitida',
      'requiereConfirmacion',
      'suceso',
    ])
    expect(resultado).not.toHaveProperty('borrador')
    expect(resultado).not.toHaveProperty('datos')
    if (resultado.permitida) {
      expect(resultado.datosConservados).toBe('parciales')
    }
    expect(detalle.borrador).toEqual(borradorParcial)
  })
})

describe('corrección de un Observado', () => {
  it('reenviar devuelve Observado a Pendiente de aprobación', () => {
    const resultado = evaluarTransicion(detallePara('observado'), {
      suceso: 'reenviar',
    })

    expect(resultado).toMatchObject({
      permitida: true,
      estadoOrigen: 'observado',
      estadoDestino: 'pendiente-aprobacion',
      cambiaEstado: true,
    })
  })
})

describe('vencimiento sin transición', () => {
  const LUNES_A_VIERNES: readonly DiaSemana[] = [
    'lunes',
    'martes',
    'miercoles',
    'jueves',
    'viernes',
  ]

  const calendario = (): CalendarioLaboralUnico => ({
    id: id<CalendarioLaboralId>('calendario-erp'),
    diasHabiles: LUNES_A_VIERNES,
    excepciones: [],
  })

  function evaluacionVencida(): EvaluacionPlazo {
    const resultado = evaluarPlazo(
      {
        clasificacion: 'operativo',
        diasHabiles: null,
        fechaAprobacion: fecha('2026-11-16'),
      },
      fecha('2026-12-01'),
      calendario(),
    )
    if (!resultado.ok) throw new Error(resultado.error.mensaje)
    return resultado.evaluacion
  }

  it('consume el incumplido de deadlines sin cambiar estado ni fechas', () => {
    const evaluacion = evaluacionVencida()
    const efecto = efectoVencimiento('en-reclutamiento', evaluacion)

    expect(evaluacion.cumplimiento).toBe('incumplido')
    expect(efecto).toEqual({
      estado: 'en-reclutamiento',
      estadoDestino: 'en-reclutamiento',
      cambiaEstado: false,
      vencido: true,
      cumplimiento: 'incumplido',
      fechaAprobacion: evaluacion.fechaAprobacion,
      fechaObjetivo: evaluacion.fechaObjetivo,
      duracionDiasHabiles: evaluacion.duracionDiasHabiles,
    })
  })

  it.each(ESTADOS)('mantiene el estado %s', (estado) => {
    const efecto = efectoVencimiento(estado, evaluacionVencida())

    expect(efecto.estado).toBe(estado)
    expect(efecto.estadoDestino).toBe(estado)
    expect(efecto.cambiaEstado).toBe(false)
    expect(efecto.vencido).toBe(true)
  })

  it('no ofrece un suceso de vencimiento en la máquina', () => {
    expect(SUCESOS_TRANSICION).not.toContain('vencimiento')
  })
})

describe('API pura', () => {
  function crearPuerto() {
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
    })
  }

  it('no invoca puertos ni comandos al evaluar', () => {
    const puerto = crearPuerto()

    const resultado = evaluarTransicion(detallePara('pendiente-aprobacion'), {
      suceso: 'aprobar',
    })

    expect(resultado).not.toBeInstanceOf(Promise)
    for (const llamadas of Object.values(puerto.calls)) {
      expect(llamadas).toHaveLength(0)
    }
  })

  it('es determinista al evaluar todos los sucesos', () => {
    const primero = SUCESOS_TRANSICION.map((suceso) =>
      evaluarTransicion(
        detallePara(ORIGENES_ESPERADOS[suceso][0]),
        solicitudPara(suceso),
      ),
    )
    const segundo = SUCESOS_TRANSICION.map((suceso) =>
      evaluarTransicion(
        detallePara(ORIGENES_ESPERADOS[suceso][0]),
        solicitudPara(suceso),
      ),
    )

    expect(primero).toEqual(segundo)
  })

  it('no muta el detalle recibido', () => {
    const detalle = Object.freeze(
      detalleCompleto({ estado: 'pendiente-aprobacion' }),
    )
    const copia = structuredClone(detalle)

    evaluarTransicion(detalle, { suceso: 'aprobar' })

    expect(detalle).toEqual(copia)
  })
})
