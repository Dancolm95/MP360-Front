'use client'

import { useEffect, useRef, useState } from 'react'
import { DisenoPagina6 } from './DisenoPagina6'

const ANCHO = 1920
const ALTO = 1176

export function VistaEscalada() {
  const contenedor = useRef<HTMLDivElement>(null)
  const [escala, setEscala] = useState(0)

  useEffect(() => {
    const nodo = contenedor.current
    if (!nodo) return

    const medir = () => setEscala(nodo.clientWidth / ANCHO)
    medir()

    const observador = new ResizeObserver(medir)
    observador.observe(nodo)
    return () => observador.disconnect()
  }, [])

  return (
    <div
      ref={contenedor}
      style={{ width: '100%', height: ALTO * escala, overflow: 'hidden' }}
    >
      <div
        style={{
          width: ANCHO,
          height: ALTO,
          transform: `scale(${escala})`,
          transformOrigin: 'top left',
          visibility: escala > 0 ? 'visible' : 'hidden',
        }}
      >
        <DisenoPagina6 />
      </div>
    </div>
  )
}
