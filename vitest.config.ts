import { defineConfig } from 'vitest/config'

// Configuración propia del runner, independiente de la de la aplicación
// (Next.js no usa Vite). Vitest 4 transforma con oxc, sin opciones de
// transformación declaradas aquí.
//
// Entorno `node` por defecto para contratos y fixtures; las pruebas de
// componente declaran `jsdom` por archivo con `@vitest-environment jsdom`.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
