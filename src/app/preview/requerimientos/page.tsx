'use client'

import { useEffect, useState } from 'react'
import { DetalleRequerimiento } from '../../../modules/rrhh/requerimientos/detail'
import { FormularioRequerimiento } from '../../../modules/rrhh/requerimientos/form'
import { CATALOGOS, COLABORADORES, DETALLE } from './data'
import { VistaEscalada } from './ux02/VistaEscalada'
import styles from './preview.module.css'

type Modo = 'diseno' | 'comparar' | 'crear' | 'detalle'

const MODOS: readonly { id: Modo; etiqueta: string }[] = [
  { id: 'diseno', etiqueta: 'Diseño UX-02' },
  { id: 'comparar', etiqueta: 'Comparar' },
  { id: 'crear', etiqueta: 'Funcional UX-03' },
  { id: 'detalle', etiqueta: 'Funcional UX-04' },
]

export default function PreviewRequerimientos() {
  const [modo, setModo] = useState<Modo>('diseno')

  useEffect(() => {
    const solicitado = new URLSearchParams(window.location.search).get('modo')
    const valido = MODOS.find(({ id }) => id === solicitado)
    if (valido) setModo(valido.id)
  }, [])

  return (
    <>
      {modo === 'diseno' ? (
        <main className={styles['lienzo']}>
          <VistaEscalada />
        </main>
      ) : null}

      {modo === 'comparar' ? (
        <main className={styles['comparacion']}>
          <div className={styles['comparacion__columna']}>
            <p className={styles['comparacion__etiqueta']}>
              Render del diseño · 1920 × 1176
            </p>
            <img
              className={styles['comparacion__referencia']}
              src="/preview/mp360/img/referencia-ux02.jpg"
              alt="Render de referencia del diseño de la bandeja de requerimientos"
            />
          </div>
          <div className={styles['comparacion__columna']}>
            <p className={styles['comparacion__etiqueta']}>Implementación</p>
            <div className={styles['comparacion__implementacion']}>
              <VistaEscalada />
            </div>
          </div>
        </main>
      ) : null}

      {modo === 'crear' || modo === 'detalle' ? (
        <main className={styles['preview']}>
          <p className={styles['preview__nota']} role="note">
            Vista funcional experimental: usa datos de ejemplo y no representa
            sesión, autorización ni persistencia reales.
          </p>
        </main>
      ) : null}

      {modo === 'crear' ? (
        <FormularioRequerimiento
          catalogos={CATALOGOS}
          colaboradores={COLABORADORES}
          onCancelar={() => setModo('diseno')}
        />
      ) : null}

      {modo === 'detalle' ? (
        <DetalleRequerimiento detalle={DETALLE} onVolver={() => setModo('diseno')} />
      ) : null}

      <div className={styles['barra']} role="group" aria-label="Vista a previsualizar">
        <span className={styles['barra__etiqueta']}>Preview experimental</span>
        {MODOS.map(({ id, etiqueta }) => (
          <button
            key={id}
            type="button"
            className={styles['barra__opcion']}
            aria-pressed={modo === id}
            onClick={() => setModo(id)}
          >
            {etiqueta}
          </button>
        ))}
      </div>
    </>
  )
}
