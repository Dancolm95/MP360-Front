'use client'

import { useMemo, useState } from 'react'
import { DetalleRequerimiento } from '../../../modules/rrhh/requerimientos/detail'
import { FormularioRequerimiento } from '../../../modules/rrhh/requerimientos/form'
import {
  createMockBandejaRequerimientos,
  lecturaFixture,
} from '../../../modules/rrhh/requerimientos/fixtures'
import { BandejaRequerimientos } from '../../../modules/rrhh/requerimientos/tray'
import {
  CATALOGOS,
  COLABORADORES,
  DETALLE,
  PAGINA_REQUERIMIENTOS,
  SOLICITANTES,
} from './data'
import styles from './preview.module.css'

type Vista = 'bandeja' | 'crear' | 'detalle'

const VISTAS: readonly { id: Vista; etiqueta: string }[] = [
  { id: 'bandeja', etiqueta: 'Bandeja (UX-02)' },
  { id: 'crear', etiqueta: 'Crear (UX-03)' },
  { id: 'detalle', etiqueta: 'Detalle (UX-04)' },
]

export default function PreviewRequerimientos() {
  const [vista, setVista] = useState<Vista>('bandeja')

  const bandejaPort = useMemo(
    () =>
      createMockBandejaRequerimientos(lecturaFixture.ok(PAGINA_REQUERIMIENTOS)),
    [],
  )

  return (
    <main className={styles['preview']}>
      <header className={styles['preview__cabecera']}>
        <h1 className={styles['preview__titulo']}>
          Preview de Requerimientos
        </h1>
        <p className={styles['preview__nota']} role="note">
          Preview experimental: monta las ventanas presentacionales UX-02/03/04
          con datos de ejemplo. No está integrado al contenedor ni representa
          sesión, autorización o persistencia reales.
        </p>
      </header>

      <div
        className={styles['preview__selector']}
        role="group"
        aria-label="Vista a previsualizar"
      >
        {VISTAS.map(({ id, etiqueta }) => (
          <button
            key={id}
            type="button"
            className={styles['preview__opcion']}
            aria-pressed={vista === id}
            onClick={() => setVista(id)}
          >
            {etiqueta}
          </button>
        ))}
      </div>

      <section className={styles['preview__vista']} aria-live="polite">
        {vista === 'bandeja' ? (
          <BandejaRequerimientos
            port={bandejaPort}
            catalogos={CATALOGOS}
            solicitantes={SOLICITANTES}
            tamanoPaginaInicial={10}
          />
        ) : null}
        {vista === 'crear' ? (
          <FormularioRequerimiento
            catalogos={CATALOGOS}
            colaboradores={COLABORADORES}
            onCancelar={() => setVista('bandeja')}
          />
        ) : null}
        {vista === 'detalle' ? (
          <DetalleRequerimiento
            detalle={DETALLE}
            onVolver={() => setVista('bandeja')}
          />
        ) : null}
      </section>
    </main>
  )
}
