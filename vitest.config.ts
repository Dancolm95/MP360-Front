import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.ts'

// Configuración mínima del runner de tests. Reutiliza la configuración de Vite
// (React + TypeScript) y añade únicamente el bloque `test` con entorno `node`:
// las pruebas de contratos no tocan el DOM, así que no se instala `jsdom`.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'node',
      include: ['src/**/*.test.ts'],
    },
  }),
)
