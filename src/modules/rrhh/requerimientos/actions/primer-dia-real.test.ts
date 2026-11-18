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
import {
  comandoConVersionVigente,
  confirmarPrimerDiaReal,
  leerPrimerDiaRealVigente,
  MENSAJE_CONFLICTO_VERSION,
} from '..'
import { detalleFixture, createMockDetalleRequerimientos } from '../fixtures'

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

function detalleCompleto(
  opciones: {
    readonly version?: number
    readonly cobertura?: CoberturaRequerimiento
  } = {},
): DetalleRequerimientoCompleto {
  const version = opciones.version ?? 3
  const acciones: readonly AccionRequerimiento[] = ['cancelar']
  return {
    id: requerimientoId,
    version,
    estado: 'en-reclutamiento',
    fechaCreacion: instante('2026-11-09T08:00:00Z'),
    historial: [],
    autorizacion: {
      requerimientoId,
      version,
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
    cobertura: opciones.cobertura ?? cobertura(2, 1),
    remuneracionPreviaAlta: null,
    procesoSeleccion: null,
  }
}

function eventoPrimerDia(): EventoPrimerDiaReal {
  return {
    id: id<EventoHistorialId>('evento-primer-dia'),
    usuario,
    fechaHora: instante('2026-11-18T23:30:00Z'),
    accion: 'primer-dia-real',
    fecha: fecha('2026-12-01'),
  }
}

function comando(evento = eventoPrimerDia(), version = 3) {
  return {
    requerimientoId,
    version,
    evento,
  }
}

function puertoDetalle(detalle: DetalleRequerimientoCompleto) {
  return createMockDetalleRequerimientos({ status: 'ok', datos: detalle })
}

describe('lectura versionada del primer día real', () => {
  it('entrega el detalle vigente y el evento sin aplicarlo', async () => {
    const detalle = detalleCompleto()
    const puerto = puertoDetalle(detalle)
    const solicitud = comando()

    const resultado = await leerPrimerDiaRealVigente(solicitud, puerto)

    expect(resultado).toEqual({
      status: 'vigente',
      comando: solicitud,
      detalle,
      evento: solicitud.evento,
    })
    expect(puerto.calls).toEqual([requerimientoId])
    expect(detalle.cobertura).toEqual(cobertura(2, 1))
    expect(detalle.estado).toBe('en-reclutamiento')
  })

  it('solo aplica la cobertura con la proyección pura, no con la lectura', async () => {
    const detalle = detalleCompleto()
    const puerto = puertoDetalle(detalle)

    const lectura = await leerPrimerDiaRealVigente(comando(), puerto)

    expect(lectura.status).toBe('vigente')
    if (lectura.status !== 'vigente') return
    expect(lectura.detalle.cobertura?.cubiertas).toBe(1)

    const confirmacion = confirmarPrimerDiaReal(
      lectura.detalle,
      lectura.evento,
    )

    expect(confirmacion.status).toBe('confirmado')
    if (confirmacion.status !== 'confirmado') return
    expect(confirmacion.confirmacion.cobertura).toMatchObject({
      cubiertas: 2,
      pendientes: 0,
    })
    expect(confirmacion.confirmacion.estado).toBe('cubierto')
  })

  it('rechaza sin persistir si la versión vigente ya avanzó y conserva la entrada', async () => {
    const vigente = detalleCompleto({
      version: 4,
      cobertura: cobertura(2, 2),
    })
    const puerto = puertoDetalle(vigente)
    const solicitud = comando()
    const antes = structuredClone(solicitud)

    const resultado = await leerPrimerDiaRealVigente(solicitud, puerto)

    expect(resultado).toMatchObject({
      status: 'conflicto-version',
      conflicto: {
        versionEsperada: 3,
        versionVigente: 4,
        datosVigentes: vigente,
      },
      entrada: solicitud,
      datosVigentes: vigente,
      versionVigente: 4,
      mensaje: MENSAJE_CONFLICTO_VERSION,
      entradaConservada: true,
      reintentable: true,
    })
    expect('detalle' in resultado).toBe(false)
    expect(solicitud).toEqual(antes)
  })

  it('permite reintentar con la versión vigente y la misma confirmación', async () => {
    const solicitud = comando()
    const vigente = detalleCompleto({ version: 4 })
    const conflicto = await leerPrimerDiaRealVigente(
      solicitud,
      puertoDetalle(detalleCompleto({ version: 4 })),
    )

    expect(conflicto.status).toBe('conflicto-version')
    if (conflicto.status !== 'conflicto-version') return

    const reintento = comandoConVersionVigente(conflicto)
    expect(reintento).toEqual({ ...solicitud, version: 4 })

    const resultado = await leerPrimerDiaRealVigente(
      reintento,
      puertoDetalle(vigente),
    )

    expect(resultado.status).toBe('vigente')
    if (resultado.status !== 'vigente') return
    expect(resultado.comando.version).toBe(4)
    expect(resultado.evento).toEqual(solicitud.evento)
  })

  it('conserva la entrada y permite reintentar ante un fallo de lectura reintentable', async () => {
    const error = { message: 'No se pudo leer el requerimiento', retryable: true }
    const puerto = createMockDetalleRequerimientos(detalleFixture.error(error))
    const solicitud = comando()

    const resultado = await leerPrimerDiaRealVigente(solicitud, puerto)

    expect(resultado).toEqual({
      status: 'error',
      error,
      entradaConservada: true,
      reintentable: true,
    })
    expect('detalle' in resultado).toBe(false)
    expect(solicitud).toEqual(comando())
  })

  it('distingue el fallo de lectura no reintentable', async () => {
    const error = { message: 'Lectura no disponible', retryable: false }

    const resultado = await leerPrimerDiaRealVigente(
      comando(),
      createMockDetalleRequerimientos(detalleFixture.error(error)),
    )

    expect(resultado).toEqual({
      status: 'error',
      error,
      entradaConservada: true,
      reintentable: false,
    })
  })

  it('declara sin permisos y sin encontrar sin inventar cobertura', async () => {
    const sinPermisos = await leerPrimerDiaRealVigente(
      comando(),
      createMockDetalleRequerimientos(detalleFixture.forbidden()),
    )
    const inexistente = await leerPrimerDiaRealVigente(
      comando(),
      createMockDetalleRequerimientos(detalleFixture.noEncontrado()),
    )

    expect(sinPermisos).toEqual({
      status: 'forbidden',
      comando: comando(),
      entradaConservada: true,
      reintentable: false,
    })
    expect(inexistente).toEqual({
      status: 'no-encontrado',
      comando: comando(),
      entradaConservada: true,
      reintentable: false,
    })
  })

  it('propaga la sesión finalizada sin aplicar nada', async () => {
    const resultado = await leerPrimerDiaRealVigente(
      comando(),
      createMockDetalleRequerimientos(detalleFixture.sesionFinalizada()),
    )

    expect(resultado).toEqual({
      status: 'sesion-finalizada',
      entradaConservada: true,
      reintentable: false,
    })
  })
})
