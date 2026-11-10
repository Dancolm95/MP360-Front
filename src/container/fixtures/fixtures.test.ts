import { describe, expect, it } from 'vitest'
import {
  CAP_RRHH_REQUERIMIENTOS_READ,
  CAP_RRHH_SELECCION_VISIBLE,
  DEST_RRHH_REQUERIMIENTOS_BANDEJA,
  DEST_RRHH_SELECCION,
  SECTION_ALTA,
  SECTION_REQUERIMIENTOS,
  SECTION_SELECCION,
  buildRrhhCatalog,
  capabilitySet,
  createContextErrorFixture,
  createExpiredFixture,
  createInMemoryStore,
  createLoadingFixture,
  createNotImplementedVisibleFixture,
  createSessionWithoutUx02Fixture,
  createSessionWithUx02Fixture,
  createSignOutErrorFixture,
  createSignOutSuccessFixture,
  createTerminatedFixture,
  isMock,
} from './index'

/**
 * Pruebas de los fixtures del contenedor (T-CORE-03).
 *
 * Demuestran que cada escenario de CORE-01 §5/§7 se puede inyectar por
 * fixture, que la parametrización es por capacidades opacas (no por rol ni
 * etiqueta del PDF) y que los adaptadores son distinguibles de operaciones
 * reales. No prueban vistas ni lógica de negocio (T-CORE-04+).
 */

describe('fixtures del contenedor: marcado de mock', () => {
  it('todo adaptador de fixture se distingue de una operación real', () => {
    const fixture = createSessionWithUx02Fixture()
    expect(isMock(fixture.session)).toBe(true)
    expect(isMock(fixture.catalog)).toBe(true)
    expect(isMock(fixture.navigation)).toBe(true)
    expect(isMock(fixture.signOut)).toBe(true)
    expect(isMock(fixture.store)).toBe(true)
    // Un objeto ajeno no se confunde con un mock.
    expect(isMock({})).toBe(false)
  })
})

describe('CORE-01 §7 criterio 1: sesión válida con lectura UX-02', () => {
  it('entrega contexto autenticado con la capacidad de lectura y Requerimientos visible', async () => {
    const fixture = createSessionWithUx02Fixture()

    const context = await fixture.session.getContext()
    expect(context.status).toBe('authenticated')
    if (context.status === 'authenticated') {
      expect(context.context.capabilities).toContain(CAP_RRHH_REQUERIMIENTOS_READ)
    }

    const catalog = await fixture.catalog.getCatalog()
    expect(catalog.status).toBe('ready')
    if (catalog.status === 'ready') {
      const requerimientos = catalog.catalog.modules[0].sections.find(
        (section) => section.id === SECTION_REQUERIMIENTOS,
      )
      expect(requerimientos?.status).toBe('implemented')
      expect(requerimientos?.visible).toBe(true)
    }
  })
})

describe('CORE-01 §7 criterio 2: sesión válida sin lectura UX-02', () => {
  it('no entrega la capacidad y Requerimientos no es visible', async () => {
    const fixture = createSessionWithoutUx02Fixture()

    const context = await fixture.session.getContext()
    expect(context.status).toBe('authenticated')
    if (context.status === 'authenticated') {
      expect(context.context.capabilities).not.toContain(
        CAP_RRHH_REQUERIMIENTOS_READ,
      )
    }

    const catalog = await fixture.catalog.getCatalog()
    if (catalog.status === 'ready') {
      const requerimientos = catalog.catalog.modules[0].sections.find(
        (section) => section.id === SECTION_REQUERIMIENTOS,
      )
      expect(requerimientos?.visible).toBe(false)
    }
  })
})

describe('CORE-01 §7 criterio 3: sección no implementada visible («Próximamente»)', () => {
  it('la sección no implementada es visible pero no operable', async () => {
    const fixture = createNotImplementedVisibleFixture()

    const catalog = await fixture.catalog.getCatalog()
    expect(catalog.status).toBe('ready')
    if (catalog.status === 'ready') {
      const sections = catalog.catalog.modules[0].sections

      const seleccion = sections.find((s) => s.id === SECTION_SELECCION)
      expect(seleccion?.status).toBe('not-implemented')
      expect(seleccion?.visible).toBe(true)
      expect(seleccion?.capabilities).toEqual([])

      // Otra sección no habilitada explícitamente no se ofrece.
      const alta = sections.find((s) => s.id === SECTION_ALTA)
      expect(alta?.visible).toBe(false)
    }
  })
})

describe('parametrización por capacidad, no por rol', () => {
  it('el catálogo deriva la visibilidad de la presencia de la capacidad', () => {
    const sinCapacidad = buildRrhhCatalog(capabilitySet())
    const conLectura = buildRrhhCatalog(
      capabilitySet(CAP_RRHH_REQUERIMIENTOS_READ),
    )

    const visibleDe = (catalog: ReturnType<typeof buildRrhhCatalog>, id: string) =>
      catalog.modules[0].sections.find((s) => s.id === id)?.visible

    expect(visibleDe(sinCapacidad, SECTION_REQUERIMIENTOS)).toBe(false)
    expect(visibleDe(conLectura, SECTION_REQUERIMIENTOS)).toBe(true)
    expect(visibleDe(sinCapacidad, SECTION_SELECCION)).toBe(false)
  })

  it('la visibilidad de una sección no implementada se habilita por capacidad explícita', () => {
    const catalog = buildRrhhCatalog(
      capabilitySet(CAP_RRHH_REQUERIMIENTOS_READ, CAP_RRHH_SELECCION_VISIBLE),
    )
    const seleccion = catalog.modules[0].sections.find(
      (s) => s.id === SECTION_SELECCION,
    )
    expect(seleccion?.visible).toBe(true)
  })
})

describe('CORE-01 §7 criterio 5: carga y error de contexto/capacidades', () => {
  it('la carga queda pendiente hasta resolverla a demanda', async () => {
    const loading = createLoadingFixture()
    let resolved = false
    const pending = loading.fixture.session.getContext().then((result) => {
      resolved = true
      return result
    })

    // Un tick de microtareas no resuelve una carga controlada.
    await Promise.resolve()
    expect(resolved).toBe(false)

    loading.resolveSession({
      status: 'authenticated',
      context: { capabilities: [] },
    })
    await pending
    expect(resolved).toBe(true)
  })

  it('el error de contexto expone mensaje y reintentabilidad', async () => {
    const error = { message: 'No se pudo obtener el contexto', retryable: true }
    const fixture = createContextErrorFixture(error)

    const result = await fixture.session.getContext()
    expect(result.status).toBe('error')
    if (result.status === 'error') {
      expect(result.error.message).toBe(error.message)
      expect(result.error.retryable).toBe(true)
    }

    const catalog = await fixture.catalog.getCatalog()
    expect(catalog.status).toBe('error')
  })
})

describe('CORE-01 §7 criterio 6: vencimiento y terminación externa', () => {
  it('representa el vencimiento y la terminación como estados de sesión', async () => {
    expect((await createExpiredFixture().session.getContext()).status).toBe(
      'expired',
    )
    expect((await createTerminatedFixture().session.getContext()).status).toBe(
      'terminated',
    )
  })

  it('onEnded notifica el fin de sesión a los suscriptores', () => {
    const session = createExpiredFixture().session
    const reasons: string[] = []
    session.onEnded((event) => reasons.push(event.reason))
    session.emitEnded('expired')
    session.emitEnded('terminated')
    expect(reasons).toEqual(['expired', 'terminated'])
  })
})

describe('CORE-01 §7 criterio 7: salida voluntaria', () => {
  it('la salida con éxito devuelve el destino indicado', async () => {
    expect(await createSignOutSuccessFixture('provider').signOut.signOut()).toEqual({
      status: 'success',
      destination: 'provider',
    })
    expect(await createSignOutSuccessFixture('local').signOut.signOut()).toEqual({
      status: 'success',
      destination: 'local',
    })
  })

  it('la salida con error conserva el error reintentable', async () => {
    const error = { message: 'El proveedor no respondió', retryable: true }
    const result = await createSignOutErrorFixture(error).signOut.signOut()
    expect(result).toEqual({ status: 'error', error })
  })
})

describe('CORE-01 §7: navegación lógica', () => {
  it('resuelve destinos con resultado discriminado y no convierte lo desconocido en «Próximamente»', async () => {
    const conLectura = createSessionWithUx02Fixture()
    expect(
      await conLectura.navigation.resolve(DEST_RRHH_REQUERIMIENTOS_BANDEJA),
    ).toEqual({
      status: 'ok',
      destination: DEST_RRHH_REQUERIMIENTOS_BANDEJA,
    })
    // Sección no visible → destino desconocido, no «Próximamente».
    expect(
      (await conLectura.navigation.resolve(DEST_RRHH_SELECCION)).status,
    ).toBe('not-found')

    const conSeleccion = createNotImplementedVisibleFixture()
    expect(
      (await conSeleccion.navigation.resolve(DEST_RRHH_SELECCION)).status,
    ).toBe('ok')
  })
})

describe('almacén intra-sesión en memoria', () => {
  it('lee, escribe y limpia sin persistencia real', () => {
    const store = createInMemoryStore<{ filtro: string }>()
    expect(store.get()).toBeUndefined()

    store.set({ filtro: 'pendientes' })
    expect(store.get()).toEqual({ filtro: 'pendientes' })

    store.clear()
    expect(store.get()).toBeUndefined()
  })
})
