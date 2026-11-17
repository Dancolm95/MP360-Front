import { describe, expect, it } from 'vitest'
import { createInMemoryStore } from '../../../../container/fixtures'
import type {
  AreaId,
  CalendarioLaboralId,
  CatalogosRequerimientos,
  DepartamentoId,
  EmpresaId,
  FechaISO,
  FiltrosBandeja,
  PuestoId,
  SubareaId,
  Usuario,
  UsuarioId,
} from '../contracts'
import {
  CLAVES_FILTRO_BANDEJA,
  contextoBandejaInicial,
  crearStoreContextoBandeja,
  type ContextoBandeja,
} from './contexto-bandeja'
import {
  restaurarConsultaBandeja,
  type OpcionesRestauracionBandeja,
} from './restauracion-bandeja'
import { ORDEN_INICIAL } from './valores-bandeja'

const id = <T>(valor: string) => valor as T
const fecha = (valor: string) => valor as FechaISO

const empresaA = { id: id<EmpresaId>('empresa-a'), nombre: 'Empresa A' }
const areaA = {
  id: id<AreaId>('area-a'),
  nombre: 'Área A',
  departamentoId: id<DepartamentoId>('departamento-a'),
}
const subareaA = {
  id: id<SubareaId>('subarea-a'),
  nombre: 'Subárea A',
  areaId: areaA.id,
}
const puestoA = {
  id: id<PuestoId>('puesto-a'),
  nombre: 'Puesto A',
  areaId: areaA.id,
  subareaId: subareaA.id,
  clasificacion: 'administrativo' as const,
}
const usuarioA: Usuario = {
  id: id<UsuarioId>('usuario-a'),
  nombre: 'Usuario A',
}

const catalogos: CatalogosRequerimientos = {
  motivos: [
    { motivo: 'reemplazo', etiqueta: 'Reemplazo' },
    { motivo: 'nueva-vacante', etiqueta: 'Nueva vacante' },
    { motivo: 'practicante', etiqueta: 'Practicante' },
    { motivo: 'otros', etiqueta: 'Otros' },
  ],
  empresas: [empresaA],
  departamentos: [
    { id: id<DepartamentoId>('departamento-a'), nombre: 'Departamento A' },
  ],
  areas: [areaA],
  subareas: [subareaA],
  puestos: [puestoA],
  departamentosUbicacion: [],
  provincias: [],
  distritos: [],
  usuariosProximaTarea: [],
  usuarioProximaTareaPredeterminado: null,
  calendarioLaboral: {
    id: id<CalendarioLaboralId>('calendario-1'),
    diasHabiles: [],
    excepciones: [],
  },
}

const opciones: OpcionesRestauracionBandeja = {
  tamanoPaginaInicial: 10,
  tamanosPagina: [10, 25],
  catalogos,
  solicitantes: [usuarioA],
}

const contextoCompleto: ContextoBandeja = {
  filtros: {
    estados: ['aprobado'],
    motivos: ['reemplazo'],
    empresas: [empresaA.id],
    areas: [areaA.id],
    subareas: [subareaA.id],
    puestos: [puestoA.id],
    solicitantes: [usuarioA.id],
    periodoAprobacion: {
      desde: fecha('2026-01-01'),
      hasta: fecha('2026-01-31'),
    },
  },
  orden: { campo: 'motivo', direccion: 'asc' },
  paginacion: { pagina: 3, tamanoPagina: 25 },
}

function congelarProfundo<T>(valor: T): T {
  if (valor !== null && typeof valor === 'object') {
    Object.freeze(valor)
    for (const hijo of Object.values(valor as Record<string, unknown>)) {
      congelarProfundo(hijo)
    }
  }
  return valor
}

describe('restauración del contexto de bandeja (RH-REQ-01 §7.3, §10-22)', () => {
  it('restaura exactamente un contexto completo y compatible', () => {
    const resultado = restaurarConsultaBandeja(contextoCompleto, opciones)

    expect(resultado.estado).toBe('restaurado')
    expect(resultado.consulta).toEqual(contextoCompleto)
    expect(resultado.ajustes).toEqual([])
  })

  it('conserva todos los filtros que acepta el saneo compartido', () => {
    const filtros: FiltrosBandeja = {
      estados: ['aprobado'],
      motivos: ['reemplazo'],
      empresas: [empresaA.id],
      areas: [areaA.id],
      subareas: [subareaA.id],
      puestos: [puestoA.id],
      solicitantes: [usuarioA.id],
      periodoAprobacion: {
        desde: fecha('2026-01-01'),
        hasta: fecha('2026-01-31'),
      },
    }

    expect(Object.keys(filtros).sort()).toEqual(
      [...CLAVES_FILTRO_BANDEJA].sort(),
    )

    const resultado = restaurarConsultaBandeja(
      {
        filtros,
        orden: { ...ORDEN_INICIAL },
        paginacion: { pagina: 1, tamanoPagina: 10 },
      },
      opciones,
    )

    expect(resultado.estado).toBe('restaurado')
    expect(resultado.consulta.filtros).toEqual(filtros)
    expect(resultado.ajustes).toEqual([])
  })

  it('distingue que nunca se guardó un contexto', () => {
    const resultado = restaurarConsultaBandeja(undefined, opciones)

    expect(resultado.estado).toBe('sin-contexto')
    expect(resultado.consulta).toEqual(contextoBandejaInicial(opciones))
    expect(resultado.ajustes).toEqual([
      {
        campo: 'contexto',
        accion: 'descartado',
        motivo: 'contexto-ausente',
      },
    ])
  })

  it('trata un contexto nulo o no objeto como incompleto, no como ausente', () => {
    for (const contexto of [null, 'contexto', 42, []]) {
      const resultado = restaurarConsultaBandeja(contexto, opciones)

      expect(resultado.estado).toBe('incompleto')
      expect(resultado.consulta).toEqual(contextoBandejaInicial(opciones))
      expect(resultado.ajustes).toEqual([
        {
          campo: 'contexto',
          accion: 'descartado',
          motivo: 'contexto-mal-formado',
          valor: contexto,
        },
      ])
    }
  })

  it('conserva los filtros válidos de un contexto parcial y repone orden y página', () => {
    const resultado = restaurarConsultaBandeja(
      { filtros: { estados: ['aprobado'] } },
      opciones,
    )

    expect(resultado.estado).toBe('incompleto')
    expect(resultado.consulta).toEqual({
      filtros: { estados: ['aprobado'] },
      orden: { ...ORDEN_INICIAL },
      paginacion: { pagina: 1, tamanoPagina: 10 },
    })
    expect(resultado.ajustes).toEqual([
      { campo: 'orden', accion: 'descartado', motivo: 'campo-ausente' },
      { campo: 'paginacion', accion: 'descartado', motivo: 'campo-ausente' },
    ])
  })

  it('rechaza campos presentes pero nulos y devuelve la consulta inicial', () => {
    const resultado = restaurarConsultaBandeja(
      { filtros: null, orden: null, paginacion: null },
      opciones,
    )

    expect(resultado.estado).toBe('incompleto')
    expect(resultado.consulta).toEqual(contextoBandejaInicial(opciones))
    expect(resultado.ajustes).toEqual([
      {
        campo: 'filtros',
        accion: 'descartado',
        motivo: 'campo-mal-formado',
        valor: null,
      },
      {
        campo: 'orden',
        accion: 'descartado',
        motivo: 'campo-mal-formado',
        valor: null,
      },
      {
        campo: 'paginacion',
        accion: 'descartado',
        motivo: 'campo-mal-formado',
        valor: null,
      },
    ])
  })

  it.each([0, -3, 1.5, '2'])(
    'normaliza la página inválida %s sin perder filtros ni orden válidos',
    (pagina) => {
      const resultado = restaurarConsultaBandeja(
        {
          filtros: { estados: ['aprobado'] },
          orden: { campo: 'empresa', direccion: 'asc' },
          paginacion: { pagina, tamanoPagina: 25 },
        },
        opciones,
      )

      expect(resultado.estado).toBe('incompleto')
      expect(resultado.consulta).toEqual({
        filtros: { estados: ['aprobado'] },
        orden: { campo: 'empresa', direccion: 'asc' },
        paginacion: { pagina: 1, tamanoPagina: 25 },
      })
      expect(resultado.ajustes).toEqual([
        {
          campo: 'paginacion.pagina',
          accion: 'normalizado',
          motivo: 'pagina-invalida',
          valor: pagina,
        },
      ])
    },
  )

  it.each([7, 0, 30, '25'])(
    'descarta el tamaño de página no permitido %s y conserva la página',
    (tamanoPagina) => {
      const resultado = restaurarConsultaBandeja(
        {
          filtros: {},
          orden: { ...ORDEN_INICIAL },
          paginacion: { pagina: 4, tamanoPagina },
        },
        opciones,
      )

      expect(resultado.estado).toBe('incompleto')
      expect(resultado.consulta.paginacion).toEqual({
        pagina: 4,
        tamanoPagina: 10,
      })
      expect(resultado.ajustes).toEqual([
        {
          campo: 'paginacion.tamanoPagina',
          accion: 'normalizado',
          motivo: 'tamano-pagina-no-permitido',
          valor: tamanoPagina,
        },
      ])
    },
  )

  it('repone el orden inicial ante un campo de orden desconocido', () => {
    const resultado = restaurarConsultaBandeja(
      {
        filtros: {},
        orden: { campo: 'urgencia', direccion: 'asc' },
        paginacion: { pagina: 1, tamanoPagina: 10 },
      },
      opciones,
    )

    expect(resultado.estado).toBe('incompleto')
    expect(resultado.consulta.orden).toEqual(ORDEN_INICIAL)
    expect(resultado.ajustes).toEqual([
      {
        campo: 'orden.campo',
        accion: 'normalizado',
        motivo: 'orden-campo-desconocido',
        valor: 'urgencia',
      },
    ])
  })

  it('repone la dirección inicial ante una dirección de orden desconocida', () => {
    const resultado = restaurarConsultaBandeja(
      {
        filtros: {},
        orden: { campo: 'empresa', direccion: 'lateral' },
        paginacion: { pagina: 1, tamanoPagina: 10 },
      },
      opciones,
    )

    expect(resultado.estado).toBe('incompleto')
    expect(resultado.consulta.orden).toEqual({
      campo: 'empresa',
      direccion: 'desc',
    })
    expect(resultado.ajustes).toEqual([
      {
        campo: 'orden.direccion',
        accion: 'normalizado',
        motivo: 'orden-direccion-invalida',
        valor: 'lateral',
      },
    ])
  })

  it('descarta un periodo de aprobación invertido con su motivo', () => {
    const periodo = { desde: '2026-03-01', hasta: '2026-02-01' }
    const resultado = restaurarConsultaBandeja(
      {
        filtros: { periodoAprobacion: periodo },
        orden: { ...ORDEN_INICIAL },
        paginacion: { pagina: 1, tamanoPagina: 10 },
      },
      opciones,
    )

    expect(resultado.estado).toBe('incompleto')
    expect(resultado.consulta.filtros).toEqual({})
    expect(resultado.ajustes).toEqual([
      {
        campo: 'filtros.periodoAprobacion',
        accion: 'descartado',
        motivo: 'periodo-incoherente',
        valor: periodo,
      },
    ])
  })

  it('descarta un periodo con una fecha civil inexistente', () => {
    const periodo = { desde: '2026-02-30', hasta: '2026-03-01' }
    const resultado = restaurarConsultaBandeja(
      {
        filtros: { periodoAprobacion: periodo },
        orden: { ...ORDEN_INICIAL },
        paginacion: { pagina: 1, tamanoPagina: 10 },
      },
      opciones,
    )

    expect(resultado.estado).toBe('incompleto')
    expect(resultado.consulta.filtros).toEqual({})
    expect(resultado.ajustes).toEqual([
      {
        campo: 'filtros.periodoAprobacion',
        accion: 'descartado',
        motivo: 'periodo-mal-formado',
        valor: periodo,
      },
    ])
  })

  it('descarta un valor canónico de estado que ya no existe', () => {
    const resultado = restaurarConsultaBandeja(
      {
        filtros: { estados: ['aprobado', 'urgente'] },
        orden: { ...ORDEN_INICIAL },
        paginacion: { pagina: 1, tamanoPagina: 10 },
      },
      opciones,
    )

    expect(resultado.estado).toBe('incompleto')
    expect(resultado.consulta.filtros).toEqual({ estados: ['aprobado'] })
    expect(resultado.ajustes).toEqual([
      {
        campo: 'filtros.estados',
        accion: 'descartado',
        motivo: 'filtro-no-canonico',
        valor: 'urgente',
      },
    ])
  })

  it('descarta un filtro con identificador ausente del catálogo', () => {
    const resultado = restaurarConsultaBandeja(
      {
        filtros: {
          estados: ['aprobado'],
          empresas: [empresaA.id, id<EmpresaId>('empresa-z')],
        },
        orden: { ...ORDEN_INICIAL },
        paginacion: { pagina: 1, tamanoPagina: 10 },
      },
      opciones,
    )

    expect(resultado.estado).toBe('incompatible')
    expect(resultado.consulta.filtros).toEqual({
      estados: ['aprobado'],
      empresas: [empresaA.id],
    })
    expect(resultado.ajustes).toEqual([
      {
        campo: 'filtros.empresas',
        accion: 'descartado',
        motivo: 'referencia-no-disponible',
        valor: 'empresa-z',
      },
    ])
  })

  it('descarta varios identificadores ausentes a la vez y conserva los disponibles', () => {
    const resultado = restaurarConsultaBandeja(
      {
        filtros: {
          empresas: [empresaA.id, id<EmpresaId>('empresa-z')],
          areas: [areaA.id, id<AreaId>('area-z')],
          subareas: [subareaA.id, id<SubareaId>('subarea-z')],
          puestos: [puestoA.id, id<PuestoId>('puesto-z')],
          solicitantes: [usuarioA.id, id<UsuarioId>('usuario-z')],
        },
        orden: { ...ORDEN_INICIAL },
        paginacion: { pagina: 1, tamanoPagina: 10 },
      },
      opciones,
    )

    expect(resultado.estado).toBe('incompatible')
    expect(resultado.consulta.filtros).toEqual({
      empresas: [empresaA.id],
      areas: [areaA.id],
      subareas: [subareaA.id],
      puestos: [puestoA.id],
      solicitantes: [usuarioA.id],
    })
    expect(resultado.ajustes).toEqual([
      {
        campo: 'filtros.empresas',
        accion: 'descartado',
        motivo: 'referencia-no-disponible',
        valor: 'empresa-z',
      },
      {
        campo: 'filtros.areas',
        accion: 'descartado',
        motivo: 'referencia-no-disponible',
        valor: 'area-z',
      },
      {
        campo: 'filtros.subareas',
        accion: 'descartado',
        motivo: 'referencia-no-disponible',
        valor: 'subarea-z',
      },
      {
        campo: 'filtros.puestos',
        accion: 'descartado',
        motivo: 'referencia-no-disponible',
        valor: 'puesto-z',
      },
      {
        campo: 'filtros.solicitantes',
        accion: 'descartado',
        motivo: 'referencia-no-disponible',
        valor: 'usuario-z',
      },
    ])
  })

  it('retira el filtro completo cuando ninguna referencia existe ya', () => {
    const resultado = restaurarConsultaBandeja(
      {
        filtros: { puestos: [id<PuestoId>('puesto-z')] },
        orden: { ...ORDEN_INICIAL },
        paginacion: { pagina: 1, tamanoPagina: 10 },
      },
      opciones,
    )

    expect(resultado.estado).toBe('incompatible')
    expect(resultado.consulta.filtros).toEqual({})
    expect(resultado.ajustes).toEqual([
      {
        campo: 'filtros.puestos',
        accion: 'descartado',
        motivo: 'referencia-no-disponible',
        valor: 'puesto-z',
      },
    ])
  })

  it('declara un filtro que el contrato ya no reconoce', () => {
    const resultado = restaurarConsultaBandeja(
      {
        filtros: { estado: ['aprobado'] },
        orden: { ...ORDEN_INICIAL },
        paginacion: { pagina: 1, tamanoPagina: 10 },
      },
      opciones,
    )

    expect(resultado.estado).toBe('incompatible')
    expect(resultado.consulta.filtros).toEqual({})
    expect(resultado.ajustes).toEqual([
      {
        campo: 'filtros.estado',
        accion: 'descartado',
        motivo: 'filtro-desconocido',
        valor: ['aprobado'],
      },
    ])
  })

  it('respaldo selectivo: repone solo las dimensiones inservibles', () => {
    const resultado = restaurarConsultaBandeja(
      {
        filtros: { estados: ['aprobado'], empresas: [empresaA.id] },
        orden: { campo: 'urgencia', direccion: 'asc' },
        paginacion: { pagina: 0, tamanoPagina: 7 },
      },
      opciones,
    )

    expect(resultado.estado).toBe('incompleto')
    expect(resultado.consulta).toEqual({
      filtros: { estados: ['aprobado'], empresas: [empresaA.id] },
      orden: { ...ORDEN_INICIAL },
      paginacion: { pagina: 1, tamanoPagina: 10 },
    })
  })

  it('es idempotente: restaurar la consulta restaurada no aplica ajustes', () => {
    const primera = restaurarConsultaBandeja(contextoCompleto, opciones)
    const segunda = restaurarConsultaBandeja(primera.consulta, opciones)

    expect(segunda.estado).toBe('restaurado')
    expect(segunda.consulta).toEqual(primera.consulta)
    expect(segunda.ajustes).toEqual([])
  })

  it('ida y vuelta a través de la persistencia de T-RH-06', () => {
    const primera = restaurarConsultaBandeja(contextoCompleto, opciones)
    const base = createInMemoryStore<unknown>()
    const store = crearStoreContextoBandeja(base, opciones)

    store.set(primera.consulta)
    const persistido = store.get()

    expect(persistido).toEqual(primera.consulta)
    expect(restaurarConsultaBandeja(persistido, opciones)).toEqual({
      estado: 'restaurado',
      consulta: primera.consulta,
      ajustes: [],
    })
  })

  it('una segunda restauración de un contexto degradado ya no ajusta nada', () => {
    const primera = restaurarConsultaBandeja(
      {
        filtros: {
          empresas: [empresaA.id, id<EmpresaId>('empresa-z')],
          estados: ['aprobado', 'urgente'],
        },
        orden: { campo: 'urgencia', direccion: 'lateral' },
        paginacion: { pagina: 0, tamanoPagina: 7 },
      },
      opciones,
    )

    expect(primera.estado).toBe('incompleto')
    const segunda = restaurarConsultaBandeja(primera.consulta, opciones)

    expect(segunda.estado).toBe('restaurado')
    expect(segunda.consulta).toEqual(primera.consulta)
    expect(segunda.ajustes).toEqual([])
  })

  it('no muta la entrada, ni siquiera congelada en profundidad', () => {
    const entrada = congelarProfundo({
      filtros: {
        estados: ['aprobado', 'urgente'],
        empresas: [empresaA.id, id<EmpresaId>('empresa-z')],
        periodoAprobacion: { desde: '2026-03-01', hasta: '2026-02-01' },
      },
      orden: { campo: 'urgencia', direccion: 'lateral' },
      paginacion: { pagina: 0, tamanoPagina: 7 },
    })
    const copia = structuredClone(entrada)

    expect(() => restaurarConsultaBandeja(entrada, opciones)).not.toThrow()
    expect(entrada).toEqual(copia)
  })

  it('entrega una consulta válida y no lanza ante cualquier entrada degradada', () => {
    const entradas: readonly unknown[] = [
      undefined,
      null,
      [],
      { filtros: 'todas', orden: 1, paginacion: [] },
      { filtros: { empresas: 'empresa-a' }, orden: {}, paginacion: {} },
    ]

    for (const entrada of entradas) {
      const resultado = restaurarConsultaBandeja(entrada, opciones)
      expect(resultado.consulta.orden.campo).toBe('fecha-creacion')
      expect(resultado.consulta.paginacion.pagina).toBeGreaterThanOrEqual(1)
      expect(resultado.consulta.paginacion.tamanoPagina).toBeGreaterThan(0)
    }
  })
})
