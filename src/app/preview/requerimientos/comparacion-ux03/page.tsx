'use client'

import { useState } from 'react'
import {
  FormularioRequerimiento,
  FormularioRequerimientoPreview,
} from '../../../../modules/rrhh/requerimientos/form'
import {
  crearFormularioVacio,
  type FormularioRequerimientoInput,
} from '../../../../modules/rrhh/requerimientos/model'
import { CATALOGOS, COLABORADORES } from '../data'
import styles from '../preview.module.css'

export default function ComparacionUx03Page() {
  const [valor, setValor] = useState<FormularioRequerimientoInput>(() =>
    crearFormularioVacio(CATALOGOS),
  )

  return (
    <main className={styles['comparacionUx03']}>
      <header className={styles['comparacionUx03__cabecera']}>
        <div>
          <h1 className={styles['preview__titulo']}>Comparación de UX-03</h1>
          <p className={styles['preview__nota']} role="note">
            Izquierda: formulario de producción de main. Derecha: formulario de la
            rama, expuesto solo como preview. Datos de ejemplo; no hay sesión,
            autorización ni persistencia reales. Esta pantalla compara, no decide.
          </p>
        </div>
        <a className={styles['comparacionUx03__volver']} href="/preview/requerimientos">
          Volver al preview
        </a>
      </header>

      <div className={styles['comparacionUx03__rejilla']}>
        <section
          className={styles['comparacion__columna']}
          aria-labelledby="comparacion-ux03-produccion"
        >
          <p className={styles['comparacion__etiqueta']} id="comparacion-ux03-produccion">
            Producción · main
          </p>
          <FormularioRequerimiento
            catalogos={CATALOGOS}
            colaboradores={COLABORADORES}
            valor={valor}
            onCambio={setValor}
            plazoAdministrativoDias={null}
          />
        </section>

        <section
          className={styles['comparacion__columna']}
          aria-labelledby="comparacion-ux03-preview"
        >
          <p className={styles['comparacion__etiqueta']} id="comparacion-ux03-preview">
            Preview · rama codex/rh-vis
          </p>
          <FormularioRequerimientoPreview
            catalogos={CATALOGOS}
            colaboradores={COLABORADORES}
            variante="embebido"
          />
        </section>
      </div>
    </main>
  )
}
