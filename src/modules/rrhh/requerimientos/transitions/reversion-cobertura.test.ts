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
  EstadoRequerimientoCompleto,
  EventoHistorial,
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
  confirmarReversionCobertura,
  evaluarTransicion,
  MENSAJE_REVERSION_NO_RETROCEDE,
} from '..'

const id = <T>(value: string) => value as T
const fecha = (value: string) => value as FechaISO
const instante = (value: string) => value as InstanteISO

const requerimientoId = id<RequerimientoId>('req-1')
const solicitada = id<SolicitudReversionId>('solicitud-a')

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

function plazo(): PlazoAdministrativoFijado {
  return {
    clasificacion: 'administrativo',
    fechaAprobacion: fecha('2026-11-16'),
    // Deliberadamente ajeno al cómputo: una reversión que recalculara cambia.
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
  readonly cobertura?: CoberturaRequerimiento
  readonly historial?: readonly EventoHistorial[]
}

function detalleCompleto(
  opciones: OpcionesDetalle = {},
): DetalleRequerimientoCompleto {
  const acciones: readonly AccionRequerimiento[] = ['cancelar']
  return {
    id: requerimientoId,
    version: 4,
    estado: opciones.estado ?? 'cubierto',
    fechaCreacion: instante('2026-11-09T08:00:00Z'),
    historial: opciones.historial ?? [],
    autorizacion: {
      requerimientoId,
      version: 4,
      capacidades: [],
      accionesPermitidas: acciones,
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

function eventoReversion(
  opciones: {
    readonly id?: string
    readonly solicitudId?: string
    readonly solicitadas?: number
    readonly cubiertas?: number
    readonly pendientes?: number
    readonly motivo?: string
  } = {},
): EventoReversionCobertura {
  return {
    id: id<EventoHistorialId>(opciones.id ?? 'evento-reversion'),
    usuario,
    fechaHora: instante('2026-11-19T10:00:00Z'),
    accion: 'reversion-cobertura',
    solicitudId: id<SolicitudReversionId>(opciones.solicitudId ?? solicitada),
    origen: 'seleccion',
    motivo: opciones.motivo ?? 'Cobertura registrada por error',
    colaboradorAfectadoId: null,
    efectoCobertura: {
      solicitadas: opciones.solicitadas ?? 2,
      cubiertas: opciones.cubiertas ?? 1,
      pendientes: opciones.pendientes ?? 1,
      estadoResultante: 'en-reclutamiento',
    },
  }
}

describe('confirmación de la reversión de cobertura', () => {
  it('sin evento auditado de Selección no toca estado ni contadores', () => {
    const detalle = detalleCompleto()
    const antes = structuredClone(detalle)

    const resultado = confirmarReversionCobertura(detalle, null)

    expect(resultado).toEqual({
      status: 'rechazado',
      evento: null,
      cobertura: detalle.cobertura,
      motivo: 'integracion-sin-confirmar',
      mensaje:
        'La transición requiere una confirmación de integración que aún no existe.',
    })
    expect(detalle).toEqual(antes)
    expect(detalle.cobertura).toMatchObject({ cubiertas: 2, pendientes: 0 })
  })

  it('aplica el decremento y Cubierto → En reclutamiento por la máquina de estados', () => {
    const detalle = detalleCompleto({ cobertura: cobertura(2, 2) })
    const antes = structuredClone(detalle)
    const evento = eventoReversion({ cubiertas: 1 })
    const transicion = evaluarTransicion(detalle, {
      suceso: 'confirmar-reversion-cobertura',
      evento,
    })

    const resultado = confirmarReversionCobertura(detalle, evento)

    expect(transicion).toMatchObject({
      permitida: true,
      estadoDestino: 'en-reclutamiento',
    })
    expect(resultado).toEqual({
      status: 'confirmado',
      evento,
      confirmacion: {
        solicitudId: solicitada,
        estadoAnterior: 'cubierto',
        estado: 'en-reclutamiento',
        cobertura: {
          solicitadas: 2,
          cubiertas: 1,
          pendientes: 1,
          primerosDiasReales: [],
        },
        plazo: detalle.plazo,
        yaAplicado: false,
      },
    })
    if (resultado.status !== 'confirmado') return
    if (!transicion.permitida) return
    expect(resultado.confirmacion.estado).toBe(transicion.estadoDestino)
    expect(detalle).toEqual(antes)
  })

  it('con pendientes previas permanece En reclutamiento y conserva los primeros días reales', () => {
    const detalle = detalleCompleto({
      estado: 'en-reclutamiento',
      cobertura: cobertura(3, 2, [{ fecha: fecha('2026-12-01') }]),
    })

    const resultado = confirmarReversionCobertura(
      detalle,
      eventoReversion({ solicitadas: 3, cubiertas: 1, pendientes: 2 }),
    )

    expect(resultado.status).toBe('confirmado')
    if (resultado.status !== 'confirmado') return
    expect(resultado.confirmacion).toMatchObject({
      estadoAnterior: 'en-reclutamiento',
      estado: 'en-reclutamiento',
      cobertura: {
        solicitadas: 3,
        cubiertas: 1,
        pendientes: 2,
        primerosDiasReales: [{ fecha: '2026-12-01' }],
      },
      yaAplicado: false,
    })
    expect(detalle.cobertura).toMatchObject({ cubiertas: 2, pendientes: 1 })
  })

  it('no vuelve a decrementar un evento ya aplicado con el mismo identificador', () => {
    const aplicado = eventoReversion({
      solicitadas: 3,
      cubiertas: 2,
      pendientes: 1,
    })
    const detalle = detalleCompleto({
      estado: 'en-reclutamiento',
      cobertura: cobertura(3, 1),
      historial: [aplicado],
    })
    const antes = structuredClone(detalle)

    const resultado = confirmarReversionCobertura(detalle, aplicado)

    expect(resultado.status).toBe('confirmado')
    if (resultado.status !== 'confirmado') return
    expect(resultado.confirmacion).toMatchObject({
      estadoAnterior: 'en-reclutamiento',
      estado: 'en-reclutamiento',
      cobertura: { solicitadas: 3, cubiertas: 1, pendientes: 2 },
      yaAplicado: true,
    })
    expect(detalle).toEqual(antes)
  })

  it('tampoco reaplica la misma solicitud reemitida con otro identificador', () => {
    const aplicado = eventoReversion({
      solicitadas: 3,
      cubiertas: 2,
      pendientes: 1,
    })
    const reemision = eventoReversion({
      id: 'evento-reversion-2',
      solicitadas: 3,
      cubiertas: 2,
      pendientes: 1,
    })
    const detalle = detalleCompleto({
      estado: 'en-reclutamiento',
      cobertura: cobertura(3, 1),
      historial: [aplicado],
    })

    const resultado = confirmarReversionCobertura(detalle, reemision)

    expect(resultado.status).toBe('confirmado')
    if (resultado.status !== 'confirmado') return
    expect(resultado.confirmacion.yaAplicado).toBe(true)
    expect(resultado.confirmacion.cobertura.cubiertas).toBe(1)
  })

  it('rechaza una reversión que dejaría cubiertas negativas sin aplicarla', () => {
    const detalle = detalleCompleto({ cobertura: cobertura(2, 1) })
    const antes = structuredClone(detalle)

    const resultado = confirmarReversionCobertura(
      detalle,
      eventoReversion({ cubiertas: -1, pendientes: 3 }),
    )

    expect(resultado).toMatchObject({
      status: 'rechazado',
      cobertura: detalle.cobertura,
      motivo: 'cobertura-inconsistente',
    })
    expect(detalle).toEqual(antes)
    expect(detalle.cobertura).toMatchObject({ cubiertas: 1, pendientes: 1 })
  })

  it('rechaza el evento que no reduce las cubiertas registradas', () => {
    const detalle = detalleCompleto({
      estado: 'en-reclutamiento',
      cobertura: cobertura(3, 2),
    })
    const antes = structuredClone(detalle)

    const resultado = confirmarReversionCobertura(
      detalle,
      eventoReversion({ solicitadas: 3, cubiertas: 2, pendientes: 1 }),
    )

    expect(resultado).toEqual({
      status: 'rechazado',
      evento: eventoReversion({
        solicitadas: 3,
        cubiertas: 2,
        pendientes: 1,
      }),
      cobertura: detalle.cobertura,
      motivo: 'cobertura-no-retrocede',
      mensaje: MENSAJE_REVERSION_NO_RETROCEDE,
    })
    expect(detalle).toEqual(antes)
  })

  it('rechaza el evento que cambia las vacantes solicitadas', () => {
    const detalle = detalleCompleto({
      estado: 'en-reclutamiento',
      cobertura: cobertura(3, 2),
    })

    const resultado = confirmarReversionCobertura(
      detalle,
      eventoReversion({ solicitadas: 4, cubiertas: 1, pendientes: 3 }),
    )

    expect(resultado).toMatchObject({
      status: 'rechazado',
      motivo: 'cobertura-no-retrocede',
    })
    expect(detalle.cobertura?.solicitadas).toBe(3)
  })

  it('rechaza un evento sin motivo y no aplica la cobertura', () => {
    const detalle = detalleCompleto()

    const resultado = confirmarReversionCobertura(
      detalle,
      eventoReversion({ motivo: '   ' }),
    )

    expect(resultado).toMatchObject({
      status: 'rechazado',
      motivo: 'motivo-requerido',
      cobertura: detalle.cobertura,
    })
    expect(detalle.cobertura).toMatchObject({ cubiertas: 2, pendientes: 0 })
  })

  it('rechaza el evento fuera de los estados de origen de la máquina', () => {
    const detalle = detalleCompleto({ estado: 'aprobado' })
    const antes = structuredClone(detalle)

    const resultado = confirmarReversionCobertura(detalle, eventoReversion())

    expect(resultado).toMatchObject({
      status: 'rechazado',
      motivo: 'suceso-no-aplica-al-estado',
    })
    expect(detalle).toEqual(antes)
  })

  it('no recalcula la fecha objetivo ni el plazo', () => {
    const detalle = detalleCompleto()

    const resultado = confirmarReversionCobertura(
      detalle,
      eventoReversion({ cubiertas: 1 }),
    )

    expect(resultado.status).toBe('confirmado')
    if (resultado.status !== 'confirmado') return
    expect(resultado.confirmacion.plazo).toBe(detalle.plazo)
    expect(resultado.confirmacion.plazo?.fechaObjetivo).toBe('1999-01-01')
  })
})
