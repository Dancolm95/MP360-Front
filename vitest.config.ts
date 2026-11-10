import { defineConfig } from 'vitest/config'

// Configuración propia del runner, independiente de la de la aplicación
// (Next.js no usa Vite). `esbuild.jsx: 'automatic'` es obligatorio: el
// `tsconfig.json` de Next usa `jsx: "preserve"` y sin esto Vitest no
// transforma el JSX de las pruebas de componente.
//
// Entorno `node` por defecto para contratos y fixtures; las pruebas de
// componente declaran `jsdom` por archivo con `@vitest-environment jsdom`.
export default defineConfig({
  esbuild: { jsx: 'automatic' },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
