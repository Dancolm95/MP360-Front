import { describe, expect, it } from 'vitest'
import * as containerContracts from '../container/contracts'
import type { Capability } from '../shared/contracts'

/**
 * Prueba de humo: demuestra que el runner de tests arranca, ejecuta y resuelve
 * los imports TypeScript de los contratos del contenedor. No verifica reglas de
 * negocio (eso corresponde a T-CORE-03+); solo confirma el andamiaje de Vitest.
 */
describe('runner de tests (humo)', () => {
  it('resuelve los contratos TypeScript de src/', () => {
    // `import * as` obliga a Vitest a resolver y transpilar el módulo .ts;
    // `Capability` se compila como tipo opaco sin producir valores en runtime.
    const capability: Capability = 'rrhh:requerimientos:read' as Capability
    expect(containerContracts).toBeDefined()
    expect(typeof capability).toBe('string')
  })
})
