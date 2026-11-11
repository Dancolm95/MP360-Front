import type { NextConfig } from 'next'

// Configuración mínima de Next.js. La entrega usa `next start` (servidor Node);
// `output: 'export'` queda revisable cuando exista backend real (plan CORE-01 §6).
const nextConfig: NextConfig = {
  // `next dev` no debe escribir su bloque de agentes en el `AGENTS.md` versionado.
  agentRules: false,
}

export default nextConfig
