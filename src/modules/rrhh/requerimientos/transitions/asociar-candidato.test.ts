import { describe, expect, it } from 'vitest'
import type {
  AccionRequerimiento,
  AreaId,
  AutorizacionRequerimiento,
  BorradorRequerimiento,
  DepartamentoId,
  DepartamentoUbicacionId,
  DetalleRequerimientoBorrador,
  DetalleRequerimientoCanceladoCompleto,
  DetalleRequerimientoCompleto,
  DiasHabilesAdministrativos,
  DistritoId,
  EmpresaId,
  EstadoRequerimientoCompleto,
  EventoAperturaProceso,
  EventoHistorialId,
  FechaISO,
  InstanteISO,
  PlazoAdministrativoFijado,
  ProcesoSeleccionId,
  ProcesoSeleccionRef,
  ProvinciaId,
  PuestoId,
  RequerimientoId,
  SubareaId,
  Usuario,
  UsuarioId,
} from '..'
import {
  MENSAJE_SIN_PROCESO,
  MENSAJES_RECHAZO,
  confirmarAperturaProcesoSeleccion,
  resolverNavegacionAsociarCandidato,
} from '..'
import { DEST_RRHH_SELECCION } from '../../identifiers'

const id = <T>(value: string) => value as T
const fecha = (value: string) => value as FechaISO
const instante = (value: string) => value as InstanteISO

const requerimientoId = id<RequerimientoId>('req-1')
const proceso: ProcesoSeleccionRef = {
  id: id<ProcesoSeleccionId>('proceso-1'),
}

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

interface OpcionesDetalle {
  readonly estado?: EstadoRequerimientoCompleto
  readonly version?: number
  readonly acciones?: readonly AccionRequerimiento[]
  readonly procesoSeleccion?: ProcesoSeleccionRef | null
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

function plazoAdministrativo(): PlazoAdministrativoFijado {
  return {
    clasificacion: 'administrativo',
    fechaAprobacion: fecha('2026-11-16'),
    fechaObjetivo: null,
    cumplimiento: 'pendiente',
    duracionDiasHabiles: 17 as DiasHabilesAdministrativos,
    origen: 'fijado-administrativo',
    alerta: null,
  }
}

function detalleCompleto(
  opciones: OpcionesDetalle = {},
): DetalleRequerimientoCompleto {
  const version = opciones.version ?? 4
  return {
    id: requerimientoId,
    version,
    estado: opciones.estado ?? 'en-reclutamiento',
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
    subarea,
    puesto,
    remuneracion: { monto: 1500, moneda: 'PEN' },
    ubicacion: { departamento: ubicacion, provincia, distrito },
    usuarioProximaTarea: usuario,
    comentario: 'Justificación del requerimiento',
    plazo: plazoAdministrativo(),
    cobertura: {
      solicitadas: 2,
      cubiertas: 1,
      pendientes: 1,
      primerosDiasReales: [],
    },
    remuneracionPreviaAlta: null,
    procesoSeleccion: opciones.procesoSeleccion ?? null,
  }
}

const borradorParcial: BorradorRequerimiento = {
  motivo: 'nueva-vacante',
  empresaId: empresa.id,
  colaboradorAReemplazarId: null,
  departamentoId: departamento.id,
  areaId: area.id,
  subareaId: subarea.id,
  puestoId: puesto.id,
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

function detalleCancelado(): DetalleRequerimientoCanceladoCompleto {
  return {
    ...detalleCompleto({ estado: 'aprobado', procesoSeleccion: null }),
    estado: 'cancelado',
    datos: 'completos',
  }
}

function detalleCubierto(): DetalleRequerimientoCompleto {
  return detalleCompleto({
    estado: 'cubierto',
    procesoSeleccion: proceso,
  })
}

function eventoApertura(): EventoAperturaProceso {
  return {
    id: id<EventoHistorialId>('evento-apertura'),
    usuario,
    fechaHora: instante('2026-11-18T10:00:00Z'),
    accion: 'apertura-proceso',
    proceso,
  }
}

const MENSAJE_ESTADO_INVALIDO = MENSAJES_RECHAZO['suceso-no-aplica-al-estado']

describe('navegación de «Asociar candidato»', () => {
  it('resuelve el destino al proceso existente en En reclutamiento con capacidad', () => {
    const detalle = detalleCompleto({ procesoSeleccion: proceso })
    const antes = structuredClone(detalle)

    const resultado = resolverNavegacionAsociarCandidato(detalle)

    expect(resultado).toEqual({
      status: 'navegar',
      proceso,
      destino: DEST_RRHH_SELECCION,
    })
    if (resultado.status === 'navegar') {
      // La misma referencia del detalle: no se crea un proceso ni un vínculo.
      expect(resultado.proceso).toBe(detalle.procesoSeleccion)
    }
    expect(Object.keys(resultado).sort()).toEqual([
      'destino',
      'proceso',
      'status',
    ])
    expect(detalle).toEqual(antes)
  })

  it('rechaza sin la capacidad asociar-candidato sin resolver destino', () => {
    const detalle = detalleCompleto({
      acciones: TODAS_LAS_ACCIONES.filter(
        (accion) => accion !== 'asociar-candidato',
      ),
      procesoSeleccion: proceso,
    })
    const antes = structuredClone(detalle)

    const resultado = resolverNavegacionAsociarCandidato(detalle)

    expect(resultado).toEqual({
      status: 'sin-autorizacion',
      motivo: 'capacidad',
      mensaje: MENSAJES_RECHAZO['sin-autorizacion'],
    })
    expect(resultado).not.toHaveProperty('proceso')
    expect(resultado).not.toHaveProperty('destino')
    expect(detalle).toEqual(antes)
  })

  it.each([
    ['aprobado', () => detalleCompleto({ estado: 'aprobado', procesoSeleccion: proceso })],
    ['cubierto', detalleCubierto],
    ['borrador', () => detalleBorrador()],
    ['cancelado', detalleCancelado],
  ] as const)(
    'rechaza el destino desde %s aunque haya capacidad',
    (estado, crearDetalle) => {
      const detalle = crearDetalle()
      const antes = structuredClone(detalle)

      const resultado = resolverNavegacionAsociarCandidato(detalle)

      expect(resultado).toEqual({
        status: 'estado-invalido',
        estadoActual: estado,
        mensaje: MENSAJE_ESTADO_INVALIDO,
      })
      expect(resultado).not.toHaveProperty('proceso')
      expect(resultado).not.toHaveProperty('destino')
      expect(detalle).toEqual(antes)
    },
  )

  it('rechaza explícitamente En reclutamiento sin referencia de proceso', () => {
    const detalle = detalleCompleto({ procesoSeleccion: null })
    const antes = structuredClone(detalle)

    const resultado = resolverNavegacionAsociarCandidato(detalle)

    expect(resultado).toEqual({
      status: 'sin-proceso',
      mensaje: MENSAJE_SIN_PROCESO,
    })
    expect(resultado).not.toHaveProperty('proceso')
    expect(resultado).not.toHaveProperty('destino')
    expect(detalle).toEqual(antes)
  })

  it('solo navega después de la confirmación de Selección de T-RH-18', () => {
    const aprobado = detalleCompleto({
      estado: 'aprobado',
      procesoSeleccion: null,
    })
    const antes = structuredClone(aprobado)

    expect(resolverNavegacionAsociarCandidato(aprobado)).toMatchObject({
      status: 'estado-invalido',
      estadoActual: 'aprobado',
    })

    const confirmacion = confirmarAperturaProcesoSeleccion(
      aprobado,
      eventoApertura(),
    )
    expect(confirmacion).toMatchObject({
      status: 'confirmado',
      estadoAnterior: 'aprobado',
      estado: 'en-reclutamiento',
      proceso,
    })
    expect(aprobado).toEqual(antes)

    const confirmado = detalleCompleto({ procesoSeleccion: proceso })
    expect(resolverNavegacionAsociarCandidato(confirmado)).toEqual({
      status: 'navegar',
      proceso,
      destino: DEST_RRHH_SELECCION,
    })
  })
})
