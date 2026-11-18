import { describe, expect, it } from 'vitest'
import type {
  AreaId,
  BorradorRequerimiento,
  CoberturaRequerimiento,
  DepartamentoId,
  DepartamentoUbicacionId,
  DetalleRequerimientoBorrador,
  DetalleRequerimientoCompleto,
  DiasHabilesAdministrativos,
  DistritoId,
  EmpresaId,
  EventoHistorialId,
  EventoPrimerDiaReal,
  FechaISO,
  InstanteISO,
  PlazoAdministrativoFijado,
  ProvinciaId,
  PuestoId,
  RequerimientoId,
  SubareaId,
  UsuarioId,
} from '../contracts'
import {
  incrementarCobertura,
  leerPrimerosDiasReales,
  primerDiaRealDeEvento,
} from './cobertura'

const id = <T>(value: string) => value as T
const fecha = (value: string) => value as FechaISO
const instante = (value: string) => value as InstanteISO

const requerimientoId = id<RequerimientoId>('req-1')

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
  id: id<PuestoId>('puesto-a'),
  nombre: 'Puesto A',
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

const borrador: BorradorRequerimiento = {
  motivo: 'nueva-vacante',
  empresaId: empresa.id,
  colaboradorAReemplazarId: null,
  departamentoId: departamento.id,
  areaId: area.id,
  subareaId: subarea.id,
  puestoId: puesto.id,
  vacantes: 2,
  remuneracion: { monto: 1500, moneda: 'PEN' },
  ubicacion: {
    departamentoId: ubicacion.id,
    provinciaId: provincia.id,
    distritoId: distrito.id,
  },
  usuarioProximaTareaId: null,
  comentario: 'Justificación',
}

function plazo(): PlazoAdministrativoFijado {
  return {
    clasificacion: 'administrativo',
    fechaAprobacion: fecha('2026-11-16'),
    fechaObjetivo: fecha('2026-12-09'),
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

function detalleCompleto(
  opciones: { readonly cobertura?: CoberturaRequerimiento } = {},
): DetalleRequerimientoCompleto {
  return {
    id: requerimientoId,
    version: 4,
    estado: 'en-reclutamiento',
    fechaCreacion: instante('2026-11-09T08:00:00Z'),
    historial: [],
    autorizacion: {
      requerimientoId,
      version: 4,
      capacidades: [],
      accionesPermitidas: [],
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
    usuarioProximaTarea: null,
    comentario: 'Justificación',
    plazo: plazo(),
    cobertura: opciones.cobertura ?? cobertura(2, 0),
    remuneracionPreviaAlta: null,
    procesoSeleccion: null,
  }
}

function detalleParcial(): DetalleRequerimientoBorrador {
  return {
    id: requerimientoId,
    version: 1,
    estado: 'borrador',
    fechaCreacion: instante('2026-11-09T08:00:00Z'),
    historial: [],
    autorizacion: {
      requerimientoId,
      version: 1,
      capacidades: [],
      accionesPermitidas: [],
    },
    borrador,
    plazo: null,
    cobertura: null,
    remuneracionPreviaAlta: null,
    procesoSeleccion: null,
  }
}

function eventoPrimerDia(): EventoPrimerDiaReal {
  return {
    id: id<EventoHistorialId>('evento-primer-dia'),
    usuario: { id: id<UsuarioId>('usuario-a'), nombre: 'Usuario A' },
    // Distinto de fecha a propósito: el alta usa el día real, no el instante.
    fechaHora: instante('2026-11-18T23:30:00Z'),
    accion: 'primer-dia-real',
    fecha: fecha('2026-12-01'),
  }
}

describe('primer día real en solo lectura', () => {
  it('toma la fecha del alta y no la del instante del evento', () => {
    const dia = primerDiaRealDeEvento(eventoPrimerDia())

    expect(dia).toEqual({ fecha: '2026-12-01' })
    expect(dia.fecha).not.toBe('2026-11-18')
  })

  it('expone los días reales tal como los entrega el detalle, sin copiarlos ni completarlos', () => {
    const dias = [{ fecha: fecha('2026-12-01') }]
    const detalle = detalleCompleto({
      cobertura: cobertura(2, 1, dias),
    })

    const leidos = leerPrimerosDiasReales(detalle)

    expect(leidos).toBe(dias)
    expect(leidos).toEqual([{ fecha: '2026-12-01' }])
  })

  it('no inventa días reales cuando el detalle aún no tiene cobertura', () => {
    expect(leerPrimerosDiasReales(detalleParcial())).toEqual([])
  })
})

describe('incremento de cobertura por día real confirmado', () => {
  it('suma exactamente una cubierta y deriva los pendientes', () => {
    const inicial = cobertura(3, 1, [{ fecha: fecha('2026-11-30') }])

    const actualizada = incrementarCobertura(inicial, {
      fecha: fecha('2026-12-01'),
    })

    expect(actualizada).toEqual({
      solicitadas: 3,
      cubiertas: 2,
      pendientes: 1,
      primerosDiasReales: [
        { fecha: '2026-11-30' },
        { fecha: '2026-12-01' },
      ],
    })
    expect(actualizada.pendientes).toBe(
      actualizada.solicitadas - actualizada.cubiertas,
    )
  })

  it('no muta la cobertura recibida', () => {
    const inicial = cobertura(2, 0)
    const antes = structuredClone(inicial)

    incrementarCobertura(inicial, { fecha: fecha('2026-12-01') })

    expect(inicial).toEqual(antes)
  })

  it('deriva los pendientes del total y las cubiertas, sin confiar en un valor previo', () => {
    const inconsistente: CoberturaRequerimiento = {
      solicitadas: 4,
      cubiertas: 2,
      pendientes: 99,
      primerosDiasReales: [],
    }

    const actualizada = incrementarCobertura(inconsistente, {
      fecha: fecha('2026-12-01'),
    })

    expect(actualizada).toMatchObject({ cubiertas: 3, pendientes: 1 })
  })
})
