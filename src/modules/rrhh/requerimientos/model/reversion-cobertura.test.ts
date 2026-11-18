import { describe, expect, it } from 'vitest'
import type {
  CoberturaRequerimiento,
  EventoHistorial,
  EventoHistorialId,
  EventoPrimerDiaReal,
  EventoReversionCobertura,
  FechaISO,
  InstanteISO,
  SolicitudReversionId,
  UsuarioId,
} from '..'
import { aplicarEfectoReversion, reversionAplicada } from '..'

const id = <T>(value: string) => value as T
const fecha = (value: string) => value as FechaISO
const instante = (value: string) => value as InstanteISO

const usuario = { id: id<UsuarioId>('usuario-a'), nombre: 'Usuario A' }

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

function eventoReversion(
  opciones: {
    readonly id?: string
    readonly solicitudId?: string
  } = {},
): EventoReversionCobertura {
  return {
    id: id<EventoHistorialId>(opciones.id ?? 'evento-reversion'),
    usuario,
    fechaHora: instante('2026-11-19T10:00:00Z'),
    accion: 'reversion-cobertura',
    solicitudId: id<SolicitudReversionId>(opciones.solicitudId ?? 'solicitud-a'),
    origen: 'seleccion',
    motivo: 'Cobertura registrada por error',
    colaboradorAfectadoId: null,
    efectoCobertura: {
      solicitadas: 2,
      cubiertas: 0,
      pendientes: 2,
      estadoResultante: 'en-reclutamiento',
    },
  }
}

function eventoPrimerDia(): EventoPrimerDiaReal {
  return {
    id: id<EventoHistorialId>('evento-primer-dia'),
    usuario,
    fechaHora: instante('2026-11-18T10:00:00Z'),
    accion: 'primer-dia-real',
    fecha: fecha('2026-12-01'),
  }
}

describe('efecto de la reversión sobre la cobertura', () => {
  it('deriva pendientes de las vacantes registradas y no copia el contador del evento', () => {
    const actual = cobertura(4, 3, [{ fecha: fecha('2026-12-01') }])

    const resultado = aplicarEfectoReversion(actual, {
      solicitadas: 4,
      cubiertas: 1,
      pendientes: 99,
      estadoResultante: 'en-reclutamiento',
    })

    expect(resultado).toEqual({
      solicitadas: 4,
      cubiertas: 1,
      pendientes: 3,
      primerosDiasReales: [{ fecha: '2026-12-01' }],
    })
    expect(actual).toEqual(cobertura(4, 3, [{ fecha: fecha('2026-12-01') }]))
  })

  it('conserva las vacantes registradas aunque el evento declare otras', () => {
    const resultado = aplicarEfectoReversion(cobertura(3, 2), {
      solicitadas: 5,
      cubiertas: 0,
      pendientes: 5,
      estadoResultante: 'en-reclutamiento',
    })

    expect(resultado.solicitadas).toBe(3)
    expect(resultado.pendientes).toBe(3)
  })
})

describe('detección de una reversión ya aplicada', () => {
  const aplicado = eventoReversion()

  it('reconoce el mismo evento por identificador', () => {
    expect(reversionAplicada({ historial: [aplicado] }, aplicado)).toBe(true)
  })

  it('reconoce la misma solicitud emitida de nuevo con otro identificador', () => {
    const reemision = eventoReversion({ id: 'evento-reversion-2' })

    expect(reversionAplicada({ historial: [aplicado] }, reemision)).toBe(true)
  })

  it('no confunde una solicitud distinta ni un primer día real', () => {
    const historial: readonly EventoHistorial[] = [
      aplicado,
      eventoPrimerDia(),
    ]
    const otraSolicitud = eventoReversion({
      id: 'evento-reversion-3',
      solicitudId: 'solicitud-b',
    })

    expect(reversionAplicada({ historial }, otraSolicitud)).toBe(false)
  })

  it('no considera aplicada una reversión sin historial', () => {
    expect(reversionAplicada({ historial: [] }, aplicado)).toBe(false)
  })
})
