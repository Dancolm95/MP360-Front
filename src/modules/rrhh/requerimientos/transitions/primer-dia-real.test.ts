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
  EventoPrimerDiaReal,
  FechaISO,
  InstanteISO,
  PlazoAdministrativoFijado,
  ProvinciaId,
  PuestoId,
  RequerimientoId,
  SubareaId,
  UsuarioId,
} from '..'
import { confirmarPrimerDiaReal } from '..'

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
    // Valor deliberadamente ajeno al cómputo: si el alta recalculara, cambiaría.
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
    estado: opciones.estado ?? 'en-reclutamiento',
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
    comentario: 'Justificación',
    plazo: plazo(),
    cobertura: opciones.cobertura ?? cobertura(2, 0),
    remuneracionPreviaAlta: null,
    procesoSeleccion: null,
  }
}

function eventoPrimerDia(
  opciones: { readonly id?: string; readonly fecha?: string } = {},
): EventoPrimerDiaReal {
  return {
    id: id<EventoHistorialId>(opciones.id ?? 'evento-primer-dia'),
    usuario,
    fechaHora: instante('2026-11-18T23:30:00Z'),
    accion: 'primer-dia-real',
    fecha: fecha(opciones.fecha ?? '2026-12-01'),
  }
}

describe('confirmación del primer día real', () => {
  it('suma una cubierta y permanece En reclutamiento si quedan pendientes', () => {
    const detalle = detalleCompleto({ cobertura: cobertura(3, 0) })

    const resultado = confirmarPrimerDiaReal(detalle, eventoPrimerDia())

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
      primerDiaReal: { fecha: '2026-12-01' },
      yaAplicado: false,
    })
  })

  it('pasa a Cubierto solo cuando las pendientes llegan a cero', () => {
    const detalle = detalleCompleto({ cobertura: cobertura(2, 1) })

    const resultado = confirmarPrimerDiaReal(detalle, eventoPrimerDia())

    expect(resultado.status).toBe('confirmado')
    if (resultado.status !== 'confirmado') return
    expect(resultado.confirmacion).toMatchObject({
      estadoAnterior: 'en-reclutamiento',
      estado: 'cubierto',
      cobertura: { solicitadas: 2, cubiertas: 2, pendientes: 0 },
    })
  })

  it('no suma sin confirmación de Alta', () => {
    const detalle = detalleCompleto({ cobertura: cobertura(2, 0) })
    const antes = structuredClone(detalle)

    const resultado = confirmarPrimerDiaReal(detalle, null)

    expect(resultado).toEqual({
      status: 'rechazado',
      evento: null,
      cobertura: detalle.cobertura,
      motivo: 'integracion-sin-confirmar',
      mensaje:
        'La transición requiere una confirmación de integración que aún no existe.',
    })
    expect(detalle).toEqual(antes)
  })

  it('rechaza el paso a Cubierto fuera de la máquina de estados', () => {
    const detalle = detalleCompleto({
      estado: 'aprobado',
      cobertura: cobertura(2, 1),
    })

    const resultado = confirmarPrimerDiaReal(detalle, eventoPrimerDia())

    expect(resultado).toMatchObject({
      status: 'rechazado',
      motivo: 'suceso-no-aplica-al-estado',
    })
    expect(detalle.estado).toBe('aprobado')
    expect(detalle.cobertura?.cubiertas).toBe(1)
  })

  it('rechaza una confirmación que excedería las vacantes sin tocar la cobertura', () => {
    const detalle = detalleCompleto({ cobertura: cobertura(2, 2) })
    const antes = structuredClone(detalle)

    const resultado = confirmarPrimerDiaReal(detalle, eventoPrimerDia())

    expect(resultado).toMatchObject({
      status: 'rechazado',
      motivo: 'cobertura-inconsistente',
    })
    expect(detalle).toEqual(antes)
  })

  it('no vuelve a contar un evento ya confirmado en el historial', () => {
    const evento = eventoPrimerDia()
    const detalle = detalleCompleto({
      estado: 'cubierto',
      cobertura: cobertura(2, 2, [{ fecha: evento.fecha }]),
      historial: [evento],
    })

    const resultado = confirmarPrimerDiaReal(detalle, evento)

    expect(resultado.status).toBe('confirmado')
    if (resultado.status !== 'confirmado') return
    expect(resultado.confirmacion.yaAplicado).toBe(true)
    expect(resultado.confirmacion.cobertura).toBe(detalle.cobertura)
    expect(resultado.confirmacion.estado).toBe('cubierto')
  })

  it('cuenta dos altas el mismo día como dos vacantes cubiertas', () => {
    const detalle = detalleCompleto({
      cobertura: cobertura(3, 1, [{ fecha: fecha('2026-12-01') }]),
    })

    const resultado = confirmarPrimerDiaReal(
      detalle,
      eventoPrimerDia({ id: 'evento-primer-dia-2', fecha: '2026-12-01' }),
    )

    expect(resultado.status).toBe('confirmado')
    if (resultado.status !== 'confirmado') return
    expect(resultado.confirmacion.cobertura).toMatchObject({
      cubiertas: 2,
      pendientes: 1,
      primerosDiasReales: [
        { fecha: '2026-12-01' },
        { fecha: '2026-12-01' },
      ],
    })
  })

  it('conserva la fecha objetivo y el plazo sin recalcularlos', () => {
    const detalle = detalleCompleto({ cobertura: cobertura(2, 1) })
    const antes = structuredClone(detalle)

    const resultado = confirmarPrimerDiaReal(detalle, eventoPrimerDia())

    expect(resultado.status).toBe('confirmado')
    if (resultado.status !== 'confirmado') return
    expect(resultado.confirmacion.plazo).toBe(detalle.plazo)
    expect(resultado.confirmacion.plazo?.fechaObjetivo).toBe('1999-01-01')
    expect(detalle).toEqual(antes)
  })
})
