import { describe, expect, it } from 'vitest'
import type {
  Area,
  AreaId,
  BorradorRequerimiento,
  CalendarioLaboralId,
  CatalogosRequerimientos,
  ColaboradorId,
  Departamento,
  DepartamentoId,
  DepartamentoUbicacion,
  DepartamentoUbicacionId,
  DetalleRequerimientoBorrador,
  DetalleRequerimientoCompleto,
  Distrito,
  DistritoId,
  Empresa,
  EmpresaId,
  InstanteISO,
  Provincia,
  ProvinciaId,
  Puesto,
  PuestoId,
  RequerimientoId,
  Subarea,
  SubareaId,
  Usuario,
  UsuarioId,
} from '../contracts'
import {
  FORMULARIO_VACIO,
  aplicarCambio,
  clasificacionFormulario,
  crearFormularioVacio,
  derivarDuracionAplicable,
  formularioDesdeBorrador,
  formularioDesdeDetalle,
  puestosDisponibles,
} from './helpers'

const id = <T>(value: string) => value as T

const empresaA: Empresa = { id: id<EmpresaId>('empresa-a'), nombre: 'Empresa A' }
const departamentoA: Departamento = {
  id: id<DepartamentoId>('departamento-a'),
  nombre: 'Departamento A',
}
const areaA: Area = {
  id: id<AreaId>('area-a'),
  nombre: 'Área A',
  departamentoId: departamentoA.id,
}
const subareaA: Subarea = {
  id: id<SubareaId>('subarea-a'),
  nombre: 'Subárea A',
  areaId: areaA.id,
}
const puestoOperativoA: Puesto = {
  id: id<PuestoId>('puesto-operativo-a'),
  nombre: 'Puesto Operativo A',
  areaId: areaA.id,
  subareaId: subareaA.id,
  clasificacion: 'operativo',
}
const puestoDirectoA: Puesto = {
  id: id<PuestoId>('puesto-directo-a'),
  nombre: 'Puesto Directo A',
  areaId: areaA.id,
  subareaId: null,
  clasificacion: 'administrativo',
}
const ubicacionA: DepartamentoUbicacion = {
  id: id<DepartamentoUbicacionId>('ubicacion-a'),
  nombre: 'Ubicación A',
}
const provinciaA: Provincia = {
  id: id<ProvinciaId>('provincia-a'),
  nombre: 'Provincia A',
  departamentoId: ubicacionA.id,
}
const distritoA: Distrito = {
  id: id<DistritoId>('distrito-a'),
  nombre: 'Distrito A',
  provinciaId: provinciaA.id,
}
const usuarioA: Usuario = { id: id<UsuarioId>('usuario-a'), nombre: 'Usuario A' }
const colaboradorA = {
  id: id<ColaboradorId>('colaborador-a'),
  nombre: 'Colaborador A',
}

const catalogos: CatalogosRequerimientos = {
  motivos: [
    { motivo: 'reemplazo', etiqueta: 'Reemplazo' },
    { motivo: 'nueva-vacante', etiqueta: 'Nueva Vacante' },
    { motivo: 'practicante', etiqueta: 'Practicante' },
    { motivo: 'otros', etiqueta: 'Otros' },
  ],
  empresas: [empresaA],
  departamentos: [departamentoA],
  areas: [areaA],
  subareas: [subareaA],
  puestos: [puestoOperativoA, puestoDirectoA],
  departamentosUbicacion: [ubicacionA],
  provincias: [provinciaA],
  distritos: [distritoA],
  usuariosProximaTarea: [usuarioA],
  usuarioProximaTareaPredeterminado: usuarioA.id,
  calendarioLaboral: {
    id: id<CalendarioLaboralId>('calendario-1'),
    diasHabiles: [],
    excepciones: [],
  },
}

const borradorCompleto: BorradorRequerimiento = {
  motivo: 'reemplazo',
  empresaId: empresaA.id,
  colaboradorAReemplazarId: colaboradorA.id,
  departamentoId: departamentoA.id,
  areaId: areaA.id,
  subareaId: subareaA.id,
  puestoId: puestoOperativoA.id,
  vacantes: 3,
  remuneracion: { monto: 1234.5, moneda: 'PEN' },
  ubicacion: {
    departamentoId: ubicacionA.id,
    provinciaId: provinciaA.id,
    distritoId: distritoA.id,
  },
  usuarioProximaTareaId: usuarioA.id,
  comentario: 'Justificación neutral',
}

const detalleCompleto: DetalleRequerimientoCompleto = {
  id: id<RequerimientoId>('req-1'),
  version: 2,
  estado: 'observado',
  fechaCreacion: '2026-01-02T10:00:00Z' as InstanteISO,
  historial: [],
  autorizacion: {
    requerimientoId: id<RequerimientoId>('req-1'),
    version: 2,
    capacidades: [],
    accionesPermitidas: [],
  },
  motivo: 'reemplazo',
  empresa: empresaA,
  colaboradorAReemplazar: colaboradorA,
  departamento: departamentoA,
  area: areaA,
  subarea: subareaA,
  puesto: puestoOperativoA,
  remuneracion: { monto: 1234.5, moneda: 'PEN' },
  ubicacion: {
    departamento: ubicacionA,
    provincia: provinciaA,
    distrito: distritoA,
  },
  usuarioProximaTarea: usuarioA,
  comentario: 'Justificación neutral',
  plazo: {
    clasificacion: 'operativo',
    duracionDiasHabiles: 10,
    origen: 'operativo-fijo',
    fechaAprobacion: null,
    fechaObjetivo: null,
    cumplimiento: 'pendiente',
    alerta: null,
  },
  cobertura: {
    solicitadas: 3,
    cubiertas: 0,
    pendientes: 3,
    primerosDiasReales: [],
  },
  remuneracionPreviaAlta: null,
  procesoSeleccion: null,
}

const detalleBorrador: DetalleRequerimientoBorrador = {
  id: id<RequerimientoId>('req-1'),
  version: 1,
  estado: 'borrador',
  fechaCreacion: '2026-01-02T10:00:00Z' as InstanteISO,
  historial: [],
  autorizacion: {
    requerimientoId: id<RequerimientoId>('req-1'),
    version: 1,
    capacidades: [],
    accionesPermitidas: [],
  },
  borrador: borradorCompleto,
  plazo: null,
  cobertura: null,
  remuneracionPreviaAlta: null,
  procesoSeleccion: null,
}

describe('formulario: estado inicial y mapeo', () => {
  it('deja todo incompleto y solo preselecciona al usuario por defecto', () => {
    const formulario = crearFormularioVacio(catalogos)
    expect(formulario).toEqual({
      ...FORMULARIO_VACIO,
      usuarioProximaTareaId: usuarioA.id,
    })
  })

  it('mapea un borrador aplanando la ubicación y formateando el importe', () => {
    expect(formularioDesdeBorrador(borradorCompleto)).toEqual({
      motivo: 'reemplazo',
      empresaId: empresaA.id,
      colaboradorAReemplazarId: colaboradorA.id,
      departamentoId: departamentoA.id,
      areaId: areaA.id,
      subareaId: subareaA.id,
      puestoId: puestoOperativoA.id,
      vacantes: 3,
      remuneracionMensual: '1234.50',
      departamentoUbicacionId: ubicacionA.id,
      provinciaId: provinciaA.id,
      distritoId: distritoA.id,
      usuarioProximaTareaId: usuarioA.id,
      comentario: 'Justificación neutral',
    })
  })

  it('mapea un borrador incompleto sin inventar valores', () => {
    expect(
      formularioDesdeBorrador({
        motivo: 'otros',
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
      }),
    ).toEqual({ ...FORMULARIO_VACIO, motivo: 'otros' })
  })

  it('reutiliza el mapeo del borrador al editar un detalle en Borrador', () => {
    expect(formularioDesdeDetalle(detalleBorrador)).toEqual(
      formularioDesdeBorrador(borradorCompleto),
    )
  })

  it('mapea un detalle completo con datos aprobados reflejados en el formulario', () => {
    expect(formularioDesdeDetalle(detalleCompleto)).toEqual({
      motivo: 'reemplazo',
      empresaId: empresaA.id,
      colaboradorAReemplazarId: colaboradorA.id,
      departamentoId: departamentoA.id,
      areaId: areaA.id,
      subareaId: subareaA.id,
      puestoId: puestoOperativoA.id,
      vacantes: 3,
      remuneracionMensual: '1234.50',
      departamentoUbicacionId: ubicacionA.id,
      provinciaId: provinciaA.id,
      distritoId: distritoA.id,
      usuarioProximaTareaId: usuarioA.id,
      comentario: 'Justificación neutral',
    })
  })
})

describe('formulario: limpieza de dependencias', () => {
  const completo = formularioDesdeBorrador(borradorCompleto)

  it('limpia área, subárea y puesto al cambiar de departamento', () => {
    const siguiente = aplicarCambio(completo, {
      campo: 'departamentoId',
      valor: id<DepartamentoId>('departamento-b'),
    })
    expect(siguiente.areaId).toBeNull()
    expect(siguiente.subareaId).toBeNull()
    expect(siguiente.puestoId).toBeNull()
  })

  it('limpia subárea y puesto al cambiar de área', () => {
    const siguiente = aplicarCambio(completo, {
      campo: 'areaId',
      valor: id<AreaId>('area-b'),
    })
    expect(siguiente.subareaId).toBeNull()
    expect(siguiente.puestoId).toBeNull()
    expect(siguiente.departamentoId).toBe(departamentoA.id)
  })

  it('limpia el puesto al cambiar de subárea', () => {
    const siguiente = aplicarCambio(completo, {
      campo: 'subareaId',
      valor: null,
    })
    expect(siguiente.puestoId).toBeNull()
    expect(siguiente.areaId).toBe(areaA.id)
  })

  it('limpia provincia y distrito al cambiar de departamento de ubicación', () => {
    const siguiente = aplicarCambio(completo, {
      campo: 'departamentoUbicacionId',
      valor: id<DepartamentoUbicacionId>('ubicacion-b'),
    })
    expect(siguiente.provinciaId).toBeNull()
    expect(siguiente.distritoId).toBeNull()
  })

  it('limpia el distrito al cambiar de provincia', () => {
    const siguiente = aplicarCambio(completo, {
      campo: 'provinciaId',
      valor: id<ProvinciaId>('provincia-b'),
    })
    expect(siguiente.distritoId).toBeNull()
    expect(siguiente.departamentoUbicacionId).toBe(ubicacionA.id)
  })

  it('descarta el colaborador al dejar de ser Reemplazo y lo conserva al volver', () => {
    const fuera = aplicarCambio(completo, {
      campo: 'motivo',
      valor: 'nueva-vacante',
    })
    expect(fuera.colaboradorAReemplazarId).toBeNull()

    const dentro = aplicarCambio(fuera, { campo: 'motivo', valor: 'reemplazo' })
    expect(dentro.colaboradorAReemplazarId).toBeNull()
  })

  it('no toca campos no jerárquicos', () => {
    const siguiente = aplicarCambio(completo, {
      campo: 'comentario',
      valor: 'Texto actualizado',
    })
    expect(siguiente.comentario).toBe('Texto actualizado')
    expect(siguiente.puestoId).toBe(puestoOperativoA.id)
    expect(siguiente.distritoId).toBe(distritoA.id)
  })
})

describe('formulario: opciones jerárquicas', () => {
  it('solo ofrece puestos directos del área hasta elegir una subárea', () => {
    expect(
      puestosDisponibles(catalogos, areaA.id, null).map((puesto) => puesto.id),
    ).toEqual([puestoDirectoA.id])

    expect(
      puestosDisponibles(catalogos, areaA.id, subareaA.id).map(
        (puesto) => puesto.id,
      ),
    ).toEqual([puestoOperativoA.id])
  })
})

describe('formulario: clasificación y duración derivadas', () => {
  it('deriva la clasificación solo cuando la jerarquía es coherente', () => {
    expect(
      clasificacionFormulario(formularioDesdeBorrador(borradorCompleto), catalogos),
    ).toBe('operativo')

    expect(
      clasificacionFormulario(
        { ...FORMULARIO_VACIO, motivo: 'otros' },
        catalogos,
      ),
    ).toBeNull()

    expect(
      clasificacionFormulario(
        {
          ...formularioDesdeBorrador(borradorCompleto),
          puestoId: puestoDirectoA.id,
        },
        catalogos,
      ),
    ).toBeNull()
  })

  it('devuelve la duración operativa de 10 días hábiles', () => {
    expect(derivarDuracionAplicable('operativo')).toEqual({
      clasificacion: 'operativo',
      diasHabiles: 10,
    })
  })

  it('deja el plazo administrativo pendiente si no hay un valor válido', () => {
    expect(derivarDuracionAplicable('administrativo')).toEqual({
      clasificacion: 'administrativo',
      diasHabiles: null,
    })
    expect(derivarDuracionAplicable('administrativo', 12)).toEqual({
      clasificacion: 'administrativo',
      diasHabiles: null,
    })
    expect(derivarDuracionAplicable('administrativo', 31)).toEqual({
      clasificacion: 'administrativo',
      diasHabiles: null,
    })
  })

  it('usa el plazo administrativo fijado dentro del rango', () => {
    expect(derivarDuracionAplicable('administrativo', 20)).toEqual({
      clasificacion: 'administrativo',
      diasHabiles: 20,
    })
  })

  it('no deriva duración sin clasificación', () => {
    expect(derivarDuracionAplicable(null)).toBeNull()
  })
})
