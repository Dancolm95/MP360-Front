import { describe, expect, it } from 'vitest'
import { createInMemoryStore } from '../../../../container/fixtures'
import type {
  AreaId,
  ContextoBandeja,
  EmpresaId,
  EstadoRequerimiento,
  FechaISO,
  MotivoRequerimiento,
  PuestoId,
  SubareaId,
  UsuarioId,
} from '../index'
import { ESTADOS, MOTIVOS } from '../tray/formato'
import {
  contextoBandejaInicial,
  crearStoreContextoBandeja,
  sanearContextoBandeja,
  type OpcionesContextoBandeja,
} from './contexto-bandeja'

const opciones: OpcionesContextoBandeja = {
  tamanoPaginaInicial: 10,
  tamanosPagina: [10, 25],
}

const contextoValido: ContextoBandeja = {
  filtros: {
    estados: ['aprobado'],
    motivos: ['reemplazo'],
    empresas: ['empresa-a' as EmpresaId],
    areas: ['area-a' as AreaId],
    subareas: ['subarea-a' as SubareaId],
    puestos: ['puesto-a' as PuestoId],
    solicitantes: ['usuario-a' as UsuarioId],
    periodoAprobacion: {
      desde: '2026-01-01' as FechaISO,
      hasta: '2026-01-31' as FechaISO,
    },
  },
  orden: { campo: 'motivo', direccion: 'asc' },
  paginacion: { pagina: 3, tamanoPagina: 25 },
}

describe('contexto inicial y saneo (RH-REQ-01 §7.1, §10-14)', () => {
  it('parte de la consulta inicial sin filtros y con creación descendente', () => {
    expect(contextoBandejaInicial(opciones)).toEqual({
      filtros: {},
      orden: { campo: 'fecha-creacion', direccion: 'desc' },
      paginacion: { pagina: 1, tamanoPagina: 10 },
    })
  })

  it('conserva intacto un contexto válido, incluidos periodo y página', () => {
    expect(sanearContextoBandeja(contextoValido, opciones)).toEqual(
      contextoValido,
    )
  })

  it('devuelve el contexto inicial ante valores ausentes o corruptos', () => {
    const inicial = contextoBandejaInicial(opciones)
    for (const valor of [undefined, null, 'texto', 42, [], true]) {
      expect(sanearContextoBandeja(valor, opciones)).toEqual(inicial)
    }
  })

  it('sanea página y tamaño de página no utilizables', () => {
    const casos: readonly {
      readonly paginacion: unknown
      readonly esperado: { pagina: number; tamanoPagina: number }
    }[] = [
      { paginacion: { pagina: '2', tamanoPagina: 25 }, esperado: { pagina: 1, tamanoPagina: 25 } },
      { paginacion: { pagina: 0, tamanoPagina: 25 }, esperado: { pagina: 1, tamanoPagina: 25 } },
      { paginacion: { pagina: -3, tamanoPagina: 25 }, esperado: { pagina: 1, tamanoPagina: 25 } },
      { paginacion: { pagina: 1.5, tamanoPagina: 25 }, esperado: { pagina: 1, tamanoPagina: 25 } },
      { paginacion: { pagina: 4, tamanoPagina: 7 }, esperado: { pagina: 4, tamanoPagina: 10 } },
      { paginacion: { pagina: 4, tamanoPagina: '25' }, esperado: { pagina: 4, tamanoPagina: 10 } },
      { paginacion: null, esperado: { pagina: 1, tamanoPagina: 10 } },
    ]

    for (const { paginacion, esperado } of casos) {
      expect(
        sanearContextoBandeja({ paginacion }, opciones).paginacion,
      ).toEqual(esperado)
    }
  })

  it('descarta un orden desconocido y una dirección inválida', () => {
    expect(
      sanearContextoBandeja(
        { orden: { campo: 'desconocido', direccion: 'asc' } },
        opciones,
      ).orden,
    ).toEqual({ campo: 'fecha-creacion', direccion: 'desc' })

    expect(
      sanearContextoBandeja(
        { orden: { campo: 'empresa', direccion: 'lado' } },
        opciones,
      ).orden,
    ).toEqual({ campo: 'empresa', direccion: 'desc' })

    expect(sanearContextoBandeja({ orden: null }, opciones).orden).toEqual({
      campo: 'fecha-creacion',
      direccion: 'desc',
    })
  })

  it('descarta filtros desconocidos y conserva solo valores canónicos e identificadores no vacíos', () => {
    const filtros = sanearContextoBandeja(
      {
        filtros: {
          estados: ['aprobado', 'urgente'],
          motivos: ['otro-motivo'],
          empresas: ['empresa-a', '', 42],
          areas: ['area-a'],
          subareas: [],
          puestos: [null],
          solicitantes: ['usuario-a', ' '],
          filtroInventado: 'x',
        },
      },
      opciones,
    ).filtros

    expect(filtros).toEqual({
      estados: ['aprobado'],
      empresas: ['empresa-a'],
      areas: ['area-a'],
      solicitantes: ['usuario-a'],
    })
    expect(Object.keys(filtros)).not.toContain('filtroInventado')
  })

  it('conserva los catálogos canónicos de estado y motivo completos', () => {
    const estados = sanearContextoBandeja(
      { filtros: { estados: ESTADOS } },
      opciones,
    ).filtros.estados
    const motivos = sanearContextoBandeja(
      { filtros: { motivos: MOTIVOS } },
      opciones,
    ).filtros.motivos

    expect(estados).toEqual(ESTADOS as readonly EstadoRequerimiento[])
    expect(motivos).toEqual(MOTIVOS as readonly MotivoRequerimiento[])
  })

  it('descarta periodos incompletos, imposibles o invertidos', () => {
    const casos: readonly unknown[] = [
      { desde: '2026-01-01' },
      { hasta: '2026-01-31' },
      { desde: '2026-02-30', hasta: '2026-03-01' },
      { desde: '2026-01-01T00:00:00Z', hasta: '2026-01-31' },
      { desde: '2026-03-01', hasta: '2026-02-01' },
      { desde: 20260101, hasta: 20260131 },
    ]

    for (const periodoAprobacion of casos) {
      expect(
        sanearContextoBandeja({ filtros: { periodoAprobacion } }, opciones)
          .filtros.periodoAprobacion,
      ).toBeUndefined()
    }
  })
})

describe('store intra-sesión del contexto de bandeja (C-04, RH-REQ-01 §7.1)', () => {
  it('guarda, lee y limpia el contexto sobre el almacén del contenedor', () => {
    const base = createInMemoryStore<unknown>()
    const store = crearStoreContextoBandeja(base, opciones)

    expect(store.get()).toBeUndefined()

    store.set(contextoValido)
    expect(base.get()).toEqual(contextoValido)
    expect(store.get()).toEqual(contextoValido)

    store.clear()
    expect(base.get()).toBeUndefined()
    expect(store.get()).toBeUndefined()
  })

  it('sanea al guardar y al leer valores corruptos sin romper la consulta', () => {
    const base = createInMemoryStore<unknown>()
    const store = crearStoreContextoBandeja(base, opciones)

    store.set({
      ...contextoValido,
      paginacion: { pagina: 0, tamanoPagina: 7 },
    })
    expect(store.get()?.paginacion).toEqual({ pagina: 1, tamanoPagina: 10 })

    base.set({ filtros: { estados: ['no-existe'] }, orden: { campo: 'x' } })
    expect(store.get()).toEqual(contextoBandejaInicial(opciones))
  })

  it('solo persiste filtros, orden y paginación, sin datos sensibles', () => {
    const base = createInMemoryStore<unknown>()
    const store = crearStoreContextoBandeja(base, opciones)

    store.set(contextoValido)

    const persistido = base.get()
    expect(persistido).toEqual(contextoValido)
    expect(Object.keys(persistido as Record<string, unknown>).sort()).toEqual([
      'filtros',
      'orden',
      'paginacion',
    ])
    expect(JSON.stringify(persistido)).not.toMatch(/token|password|credencial/i)
  })
})
