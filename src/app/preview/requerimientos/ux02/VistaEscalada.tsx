'use client'

import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

export function VistaEscalada({
  children,
  ancho = 1920,
  alto = 1176,
}: {
  children: ReactNode
  ancho?: number
  alto?: number
}) {
  const contenedor = useRef<HTMLDivElement>(null)
  const [escala, setEscala] = useState(0)

  useEffect(() => {
    const nodo = contenedor.current
    if (!nodo) return

    const medir = () => setEscala(nodo.clientWidth / ancho)
    medir()

    const observador = new ResizeObserver(medir)
    observador.observe(nodo)
    return () => observador.disconnect()
  }, [ancho])

  return (
    <div
      ref={contenedor}
      style={{ width: '100%', height: alto * escala, overflow: 'hidden' }}
    >
      <div
        style={{
          width: ancho,
          height: alto,
          transform: `scale(${escala})`,
          transformOrigin: 'top left',
          visibility: escala > 0 ? 'visible' : 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  )
}
