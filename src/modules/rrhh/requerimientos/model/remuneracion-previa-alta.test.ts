import { describe, expect, it } from 'vitest'
import type {
  AccionRequerimiento,
  AreaId,
  DepartamentoId,
  DepartamentoUbicacionId,
  DetalleRequerimientoBorrador,
  DetalleRequerimientoCanceladoCompleto,
  DetalleRequerimientoCompleto,
  DiasHabilesAdministrativos,
  DistritoId,
  EmpresaId,
  EstadoRequerimientoCompleto,
  FechaISO,
  InstanteISO,
  MotivoRequerimiento,
  PlazoAdministrativoFijado,
  PlazoAdministrativoPendiente,
  ProvinciaId,
  PuestoId,
  Remuneracion,
  RemuneracionPreviaAlta,
  RequerimientoId,
  SubareaId,
  UsuarioId,
} from '..'
import {
  MENSAJE_ALTA_NO_CONFIRMA_CERO,
  MENSAJE_EXCEPCION_CERO_PRACTICANTE,
  evaluarConfirmacionRemuneracionAlta,
  leerRemuneracionPreviaAlta,
} from '..'
import type {
  LecturaRemuneracionPreviaAlta,
  ResultadoConfirmacionRemuneracionAlta,
  ResultadoLecturaRemuneracionPreviaAlta,
} from '..'

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

const TODAS_LAS_ACCIONES: readonly AccionRequerimiento[] = ['aprobar']

function plazoPendiente(): PlazoAdministrativoPendiente {
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

function plazoFijado(): PlazoAdministrativoFijado {
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

interface OpcionesDetalle {
  readonly estado?: EstadoRequerimientoCompleto
  readonly motivo?: MotivoRequerimiento
  /** `null` y valores fuera de contrato solo se usan en pruebas defensivas. */
  readonly remuneracion?: Remuneracion | null
  readonly remuneracionPreviaAlta?: RemuneracionPreviaAlta | null
}

function detalleCompleto(
  opciones: OpcionesDetalle = {},
): DetalleRequerimientoCompleto {
  const version = 4
  const estado = opciones.estado ?? 'aprobado'
  const remuneracion =
    opciones.remuneracion === undefined
      ? ({ monto: 1500, moneda: 'PEN' } as const)
      : opciones.remuneracion

  return {
    id: requerimientoId,
    version,
    estado,
    fechaCreacion: instante('2026-11-09T08:00:00Z'),
    historial: [],
    autorizacion: {
      requerimientoId,
      version,
      capacidades: [],
      accionesPermitidas: TODAS_LAS_ACCIONES,
    },
    motivo: opciones.motivo ?? 'nueva-vacante',
    empresa,
    colaboradorAReemplazar: null,
    departamento,
    area,
    subarea,
    puesto,
    remuneracion: remuneracion as Remuneracion,
    ubicacion: { departamento: ubicacion, provincia, distrito },
    usuarioProximaTarea: usuario,
    comentario: 'Justificación del requerimiento',
    plazo:
      estado === 'aprobado' ||
      estado === 'en-reclutamiento' ||
      estado === 'cubierto'
        ? plazoFijado()
        : plazoPendiente(),
    cobertura: {
      solicitadas: 2,
      cubiertas: 0,
      pendientes: 2,
      primerosDiasReales: [],
    },
    remuneracionPreviaAlta: opciones.remuneracionPreviaAlta ?? null,
    procesoSeleccion: null,
  }
}

function detalleBorrador(): DetalleRequerimientoBorrador {
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
      accionesPermitidas: TODAS_LAS_ACCIONES,
    },
    borrador: {
      motivo: 'practicante',
      empresaId: empresa.id,
      colaboradorAReemplazarId: null,
      departamentoId: departamento.id,
      areaId: area.id,
      subareaId: subarea.id,
      puestoId: puesto.id,
      vacantes: 2,
      remuneracion: { monto: 0, moneda: 'PEN' },
      ubicacion: null,
      usuarioProximaTareaId: usuario.id,
      comentario: 'Borrador',
    },
    plazo: null,
    cobertura: null,
    remuneracionPreviaAlta: null,
    procesoSeleccion: null,
  }
}

function detalleCancelado(): DetalleRequerimientoCanceladoCompleto {
  return {
    ...detalleCompleto(),
    estado: 'cancelado',
    datos: 'completos',
  }
}

function lecturaDisponible(
  resultado: ResultadoLecturaRemuneracionPreviaAlta,
): LecturaRemuneracionPreviaAlta {
  if (resultado.status !== 'disponible') {
    throw new Error(`Se esperaba disponible: ${resultado.motivo}`)
  }
  return resultado.lectura
}

function confirmacionRechazada(
  resultado: ResultadoConfirmacionRemuneracionAlta,
): Extract<ResultadoConfirmacionRemuneracionAlta, { status: 'rechazado' }> {
  if (resultado.status !== 'rechazado') {
    throw new Error('Se esperaba un rechazo de Alta')
  }
  return resultado
}

function detallePracticanteCero(
  remuneracionPreviaAlta: RemuneracionPreviaAlta | null = null,
): DetalleRequerimientoCompleto {
  return detalleCompleto({
    motivo: 'practicante',
    remuneracion: { monto: 0, moneda: 'PEN' },
    remuneracionPreviaAlta,
  })
}

describe('lectura de la remuneración previa al alta', () => {
  it('expone la remuneración aprobada sin copiarla ni alterar el requerimiento', () => {
    const detalle = detalleCompleto()
    const antes = structuredClone(detalle)

    const lectura = lecturaDisponible(leerRemuneracionPreviaAlta(detalle))

    expect(lectura.remuneracionAprobada).toBe(detalle.remuneracion)
    expect(lectura.remuneracionVigente).toBe(detalle.remuneracion)
    expect(lectura).toEqual({
      remuneracionAprobada: { monto: 1500, moneda: 'PEN' },
      remuneracionVigente: { monto: 1500, moneda: 'PEN' },
      origenVigente: 'requerimiento',
      ajustadaAntesDelAlta: false,
      excepcionCero: null,
    })
    expect(detalle).toEqual(antes)
  })

  it('detecta la excepción 0.00 de Practicante y no la hereda en Alta', () => {
    const detalle = detallePracticanteCero()
    const antes = structuredClone(detalle)

    const lectura = lecturaDisponible(leerRemuneracionPreviaAlta(detalle))

    expect(lectura.remuneracionAprobada.monto).toBe(0)
    expect(lectura.remuneracionVigente.monto).toBe(0)
    expect(lectura.origenVigente).toBe('requerimiento')
    expect(lectura.excepcionCero).toEqual({
      tipo: 'cero-practicante',
      vigenteEnAlta: false,
      mensaje: MENSAJE_EXCEPCION_CERO_PRACTICANTE,
    })

    const confirmacion = confirmacionRechazada(
      evaluarConfirmacionRemuneracionAlta(detalle),
    )
    expect(confirmacion).toEqual({
      status: 'rechazado',
      motivo: 'importe-cero',
      mensaje: MENSAJE_ALTA_NO_CONFIRMA_CERO,
      requiereAjuste: true,
    })
    expect(confirmacion).not.toHaveProperty('remuneracion')
    expect(detalle).toEqual(antes)
    expect(detalle.remuneracion.monto).toBe(0)
  })

  it('no trata como excepción un 0.00 fuera de Practicante', () => {
    const detalle = detalleCompleto({
      motivo: 'nueva-vacante',
      remuneracion: { monto: 0, moneda: 'PEN' },
    })
    const antes = structuredClone(detalle)

    const lectura = lecturaDisponible(leerRemuneracionPreviaAlta(detalle))
    expect(lectura.excepcionCero).toBeNull()

    expect(confirmacionRechazada(evaluarConfirmacionRemuneracionAlta(detalle)))
      .toMatchObject({ motivo: 'importe-cero', requiereAjuste: true })
    expect(detalle).toEqual(antes)
  })

  it('permite confirmar cuando Alta ya ajustó el 0.00, sin tocar el requerimiento', () => {
    const remuneracionVigente: Remuneracion = { monto: 1200, moneda: 'PEN' }
    const detalle = detallePracticanteCero({
      remuneracionAprobada: { monto: 0, moneda: 'PEN' },
      remuneracionVigente,
      ajustadaAntesDelAlta: true,
    })
    const antes = structuredClone(detalle)

    const lectura = lecturaDisponible(leerRemuneracionPreviaAlta(detalle))
    expect(lectura.remuneracionAprobada).toBe(detalle.remuneracion)
    expect(lectura.remuneracionAprobada.monto).toBe(0)
    expect(lectura.remuneracionVigente).toBe(remuneracionVigente)
    expect(lectura.origenVigente).toBe('ajuste-alta')
    expect(lectura.ajustadaAntesDelAlta).toBe(true)
    expect(lectura.excepcionCero).toMatchObject({
      tipo: 'cero-practicante',
      vigenteEnAlta: false,
    })

    const confirmacion = evaluarConfirmacionRemuneracionAlta(detalle)
    expect(confirmacion).toEqual({
      status: 'confirmable',
      remuneracion: remuneracionVigente,
      origenVigente: 'ajuste-alta',
    })
    if (confirmacion.status === 'confirmable') {
      expect(confirmacion.remuneracion).toBe(remuneracionVigente)
    }

    expect(detalle).toEqual(antes)
    expect(detalle.remuneracion.monto).toBe(0)
  })

  it('confirma un importe válido sin sustituirlo', () => {
    const detalle = detalleCompleto()
    const antes = structuredClone(detalle)

    const confirmacion = evaluarConfirmacionRemuneracionAlta(detalle)

    expect(confirmacion).toEqual({
      status: 'confirmable',
      remuneracion: { monto: 1500, moneda: 'PEN' },
      origenVigente: 'requerimiento',
    })
    if (confirmacion.status === 'confirmable') {
      expect(confirmacion.remuneracion).toBe(detalle.remuneracion)
    }
    expect(detalle).toEqual(antes)
  })

  it('no toma por vigente un importe que el ajuste de Alta no declara', () => {
    const detalle = detallePracticanteCero({
      remuneracionAprobada: { monto: 0, moneda: 'PEN' },
      remuneracionVigente: { monto: 1200, moneda: 'PEN' },
      ajustadaAntesDelAlta: false,
    })

    const lectura = lecturaDisponible(leerRemuneracionPreviaAlta(detalle))
    expect(lectura.remuneracionVigente).toBe(detalle.remuneracion)
    expect(lectura.remuneracionVigente.monto).toBe(0)
    expect(lectura.origenVigente).toBe('requerimiento')

    expect(confirmacionRechazada(evaluarConfirmacionRemuneracionAlta(detalle)))
      .toMatchObject({ motivo: 'importe-cero' })
  })

  it('rechaza en Alta un importe negativo sin convertirlo', () => {
    const detalle = detalleCompleto({
      remuneracion: { monto: -100, moneda: 'PEN' },
    })

    expect(confirmacionRechazada(evaluarConfirmacionRemuneracionAlta(detalle)))
      .toEqual({
        status: 'rechazado',
        motivo: 'importe-negativo',
        mensaje: 'El importe no puede ser negativo.',
        requiereAjuste: true,
      })
  })

  it.each([
    ['borrador', detalleBorrador],
    ['pendiente-aprobacion', () => detalleCompleto({ estado: 'pendiente-aprobacion' })],
    ['observado', () => detalleCompleto({ estado: 'observado' })],
    ['cancelado', detalleCancelado],
  ] as const)(
    'no expone un importe inventado en estado %s',
    (_estado, crearDetalle) => {
      const detalle = crearDetalle()
      const antes = structuredClone(detalle)

      const resultado = leerRemuneracionPreviaAlta(detalle)
      expect(resultado).toMatchObject({
        status: 'no-disponible',
        motivo: 'requerimiento-no-aprobado',
      })
      expect(resultado).not.toHaveProperty('lectura')
      expect(resultado).not.toHaveProperty('remuneracion')
      expect(JSON.stringify(resultado)).not.toContain('monto')

      expect(confirmacionRechazada(evaluarConfirmacionRemuneracionAlta(detalle)))
        .toMatchObject({
          motivo: 'remuneracion-no-disponible',
          requiereAjuste: false,
        })
      expect(detalle).toEqual(antes)
    },
  )

  it.each([
    ['ausente', null],
    ['no finita', { monto: Number.NaN, moneda: 'PEN' }],
    ['en otra moneda', { monto: 1500, moneda: 'USD' }],
    ['no numérica', { monto: '1500', moneda: 'PEN' }],
  ] as const)(
    'declara no disponible una remuneración %s sin inventar 0.00',
    (_caso, remuneracion) => {
      const detalle = detalleCompleto({
        remuneracion: remuneracion as unknown as Remuneracion,
      })
      const antes = structuredClone(detalle)

      const resultado = leerRemuneracionPreviaAlta(detalle)
      expect(resultado.status).toBe('no-disponible')
      if (resultado.status === 'no-disponible') {
        expect(resultado.motivo).toBe(
          remuneracion === null
            ? 'remuneracion-ausente'
            : 'remuneracion-incompleta',
        )
        expect(resultado).not.toHaveProperty('lectura')
      }
      expect(JSON.stringify(resultado)).not.toContain('0.00')

      expect(confirmacionRechazada(evaluarConfirmacionRemuneracionAlta(detalle)))
        .toMatchObject({ motivo: 'remuneracion-no-disponible' })
      expect(detalle).toEqual(antes)
    },
  )

  it('declara no disponible un ajuste de Alta incompleto', () => {
    const detalle = detalleCompleto({
      remuneracionPreviaAlta: {
        remuneracionAprobada: { monto: 1500, moneda: 'PEN' },
        remuneracionVigente: null as unknown as Remuneracion,
        ajustadaAntesDelAlta: true,
      },
    })
    const antes = structuredClone(detalle)

    const resultado = leerRemuneracionPreviaAlta(detalle)
    expect(resultado).toMatchObject({
      status: 'no-disponible',
      motivo: 'ajuste-alta-incompleto',
    })
    expect(resultado).not.toHaveProperty('lectura')
    expect(confirmacionRechazada(evaluarConfirmacionRemuneracionAlta(detalle)))
      .toMatchObject({ motivo: 'remuneracion-no-disponible' })
    expect(detalle).toEqual(antes)
  })

  it('no muta el detalle ni cambia el estado al leer y comprobar Alta', () => {
    const detalle = detallePracticanteCero({
      remuneracionAprobada: { monto: 0, moneda: 'PEN' },
      remuneracionVigente: { monto: 0, moneda: 'PEN' },
      ajustadaAntesDelAlta: true,
    })
    const antes = structuredClone(detalle)

    leerRemuneracionPreviaAlta(detalle)
    evaluarConfirmacionRemuneracionAlta(detalle)

    expect(detalle).toEqual(antes)
    expect(detalle.estado).toBe('aprobado')
    expect(detalle.version).toBe(4)
    expect(detalle.remuneracion.monto).toBe(0)
    expect(detalle.remuneracionPreviaAlta?.remuneracionVigente.monto).toBe(0)
  })
})
