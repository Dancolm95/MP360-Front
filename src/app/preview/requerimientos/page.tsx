'use client'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { DetalleRequerimiento } from '../../../modules/rrhh/requerimientos/detail'
import { FormularioRequerimiento } from '../../../modules/rrhh/requerimientos/form'
import { CATALOGOS, COLABORADORES, DETALLE } from './data'
import { DisenoConfirmacion } from './ux03/DisenoConfirmacion'
import { DisenoFormulario } from './ux03/DisenoFormulario'
import { DisenoLogin, DisenoModulos, DisenoPerfiles } from './acceso/DisenosAcceso'
import { DisenoInicio } from './inicio/DisenoInicio'
import { DisenoDetalle } from './ux04/DisenoDetalle'
import { BandejaCandidatos } from './candidatos/BandejaCandidatos'
import { DetalleCandidato } from './candidato/DetalleCandidato'
import { BandejaColaboradores } from './colaboradores/BandejaColaboradores'
import { FichaColaborador } from './colaborador/FichaColaborador'
import { AltaSeleccion } from './alta/AltaSeleccion'
import { AltaDatos } from './alta/AltaDatos'
import { AltaResumen } from './alta/AltaResumen'
import { AltaConfirmacion } from './alta/AltaConfirmacion'
import { BandejaLicencias } from './licencias/BandejaLicencias'
import { RegistroLicencia } from './licencias/RegistroLicencia'
import { DisenoPagina6 } from './ux02/DisenoPagina6'
import { VistaEscalada } from './ux02/VistaEscalada'
import styles from './preview.module.css'

type Modo = 'diseno' | 'comparar' | 'crear' | 'detalle'
type Diseno =
  | 'inicio'
  | 'inicio-modulo'
  | 'ux02'
  | 'ux03-formulario'
  | 'ux03-confirmacion'
  | 'ux04'
  | 'candidatos'
  | 'candidato'
  | 'colaboradores'
  | 'colaborador'
  | 'colaborador-boletas'
  | 'colaborador-boletas-proceso'
  | 'alta-seleccion'
  | 'alta-datos'
  | 'alta-resumen'
  | 'alta-confirmacion'
  | 'licencias'
  | 'licencia-registro'
  | 'login'
  | 'perfiles'
  | 'modulos'

interface OpcionDiseno {
  readonly id: Diseno
  readonly etiqueta: string
  readonly referencia: string
  readonly descripcion: string
  readonly ancho: number
  readonly alto: number
  readonly componente: ReactNode
}

const DISENOS: readonly OpcionDiseno[] = [
  {
    id: 'inicio',
    etiqueta: 'Inicio',
    referencia: '/preview/mp360/img/referencia-inicio.jpg',
    descripcion: 'Dashboard de RR. HH.',
    ancho: 1920,
    alto: 1176,
    componente: <DisenoInicio />,
  },
  {
    id: 'inicio-modulo',
    etiqueta: 'Inicio módulo',
    referencia: '/preview/mp360/img/referencia-inicio-modulo.jpg',
    descripcion: 'Dashboard con selector de módulo',
    ancho: 1920,
    alto: 1176,
    componente: <DisenoInicio selectorAbierto />,
  },
  {
    id: 'ux02',
    etiqueta: 'UX-02',
    referencia: '/preview/mp360/img/referencia-ux02.jpg',
    descripcion: 'Bandeja de requerimientos',
    ancho: 1920,
    alto: 1176,
    componente: <DisenoPagina6 />,
  },
  {
    id: 'ux03-formulario',
    etiqueta: 'UX-03a',
    referencia: '/preview/mp360/img/referencia-ux03-formulario.jpg',
    descripcion: 'Nuevo requerimiento',
    ancho: 1920,
    alto: 1176,
    componente: <DisenoFormulario />,
  },
  {
    id: 'ux03-confirmacion',
    etiqueta: 'UX-03b',
    referencia: '/preview/mp360/img/referencia-ux03-confirmacion.jpg',
    descripcion: 'Confirmación de envío',
    ancho: 1920,
    alto: 1176,
    componente: <DisenoConfirmacion />,
  },
  {
    id: 'ux04',
    etiqueta: 'UX-04',
    referencia: '/preview/mp360/img/referencia-ux04.jpg',
    descripcion: 'Detalle del requerimiento',
    ancho: 1920,
    alto: 1176,
    componente: <DisenoDetalle />,
  },
  {
    id: 'candidatos',
    etiqueta: 'Candidatos',
    referencia: '/preview/mp360/img/referencia-candidatos.jpg',
    descripcion: 'Bandeja de candidatos',
    ancho: 1920,
    alto: 1176,
    componente: <BandejaCandidatos />,
  },
  {
    id: 'candidato',
    etiqueta: 'Candidato',
    referencia: '/preview/mp360/img/referencia-candidato.jpg',
    descripcion: 'Detalle y evaluación de candidato',
    ancho: 1920,
    alto: 1176,
    componente: <DetalleCandidato />,
  },
  {
    id: 'colaboradores',
    etiqueta: 'Colaboradores',
    referencia: '/preview/mp360/img/referencia-colaboradores.jpg',
    descripcion: 'Bandeja de colaboradores',
    ancho: 1920,
    alto: 1176,
    componente: <BandejaColaboradores />,
  },
  {
    id: 'colaborador',
    etiqueta: 'Colaborador',
    referencia: '/preview/mp360/img/referencia-colaborador.jpg',
    descripcion: 'Ficha de colaborador',
    ancho: 1920,
    alto: 1176,
    componente: <FichaColaborador />,
  },
  {
    id: 'colaborador-boletas',
    etiqueta: 'Colaborador boletas',
    referencia: '/preview/mp360/img/referencia-colaborador-boletas.jpg',
    descripcion: 'Ficha: boletas de pago',
    ancho: 1920,
    alto: 1176,
    componente: <FichaColaborador tabActiva={1} />,
  },
  {
    id: 'colaborador-boletas-proceso',
    etiqueta: 'Colaborador boletas · proceso',
    referencia: '/preview/mp360/img/referencia-colaborador-boletas-proceso.jpg',
    descripcion: 'Ficha: boletas de pago con proceso',
    ancho: 1920,
    alto: 1176,
    componente: <FichaColaborador tabActiva={1} varianteBoletas="proceso" />,
  },
  {
    id: 'alta-seleccion',
    etiqueta: 'Alta · selección',
    referencia: '/preview/mp360/img/referencia-alta-seleccion.jpg',
    descripcion: 'Alta: selección de candidato y requerimiento',
    ancho: 1920,
    alto: 1176,
    componente: <AltaSeleccion />,
  },
  {
    id: 'alta-datos',
    etiqueta: 'Alta · datos',
    referencia: '/preview/mp360/img/referencia-alta-datos.jpg',
    descripcion: 'Alta: datos personales y de trabajo',
    ancho: 1920,
    alto: 1176,
    componente: <AltaDatos />,
  },
  {
    id: 'alta-resumen',
    etiqueta: 'Alta · resumen',
    referencia: '/preview/mp360/img/referencia-alta-resumen.jpg',
    descripcion: 'Alta: resumen de validaciones',
    ancho: 1920,
    alto: 1176,
    componente: <AltaResumen />,
  },
  {
    id: 'alta-confirmacion',
    etiqueta: 'Alta · confirmación',
    referencia: '/preview/mp360/img/referencia-alta-confirmacion.jpg',
    descripcion: 'Alta: confirmación',
    ancho: 1920,
    alto: 1176,
    componente: <AltaConfirmacion />,
  },
  {
    id: 'licencias',
    etiqueta: 'Licencias',
    referencia: '/preview/mp360/img/referencia-licencias.jpg',
    descripcion: 'Bandeja de licencias y ausencias',
    ancho: 1920,
    alto: 1176,
    componente: <BandejaLicencias />,
  },
  {
    id: 'licencia-registro',
    etiqueta: 'Licencia · registro',
    referencia: '/preview/mp360/img/referencia-licencia-registro.jpg',
    descripcion: 'Registro de licencia/ausencia',
    ancho: 1920,
    alto: 1176,
    componente: <RegistroLicencia />,
  },
  {
    id: 'login',
    etiqueta: 'Login',
    referencia: '/preview/mp360/img/referencia-acceso-login.jpg',
    descripcion: 'Acceso a MP 360',
    ancho: 1920,
    alto: 1080,
    componente: <DisenoLogin />,
  },
  {
    id: 'perfiles',
    etiqueta: 'Perfiles',
    referencia: '/preview/mp360/img/referencia-acceso-perfiles.jpg',
    descripcion: 'Selección de perfil',
    ancho: 1920,
    alto: 1080,
    componente: <DisenoPerfiles />,
  },
  {
    id: 'modulos',
    etiqueta: 'Módulos',
    referencia: '/preview/mp360/img/referencia-acceso-modulos.jpg',
    descripcion: 'Selección de módulo',
    ancho: 1920,
    alto: 1080,
    componente: <DisenoModulos />,
  },
]

const MODO_INICIAL: Modo = 'diseno'

function esModo(valor: string | null): valor is Modo {
  return valor === 'diseno' || valor === 'comparar' || valor === 'crear' || valor === 'detalle'
}

function esDiseno(valor: string | null): valor is Diseno {
  return DISENOS.some(({ id }) => id === valor)
}

export default function PreviewRequerimientos() {
  const [modo, setModo] = useState<Modo>(MODO_INICIAL)
  const [diseno, setDiseno] = useState<Diseno>('inicio')

  useEffect(() => {
    const parametros = new URLSearchParams(window.location.search)
    const modoUrl = parametros.get('modo')
    const disenoUrl = parametros.get('ux')
    if (esModo(modoUrl)) setModo(modoUrl)
    if (esDiseno(disenoUrl)) setDiseno(disenoUrl)
  }, [])

  const activo = DISENOS.find(({ id }) => id === diseno) ?? DISENOS[0]
  const mostrarDiseno = modo === 'diseno' || modo === 'comparar'

  return (
    <>
      {mostrarDiseno ? (
        <main className={modo === 'comparar' ? styles['comparacion'] : styles['lienzo']}>
          {modo === 'comparar' ? (
            <>
              <div className={styles['comparacion__columna']}>
                <p className={styles['comparacion__etiqueta']}>
                  {activo.descripcion} · diseño 1920 × 1176
                </p>
                <img
                  className={styles['comparacion__referencia']}
                  src={activo.referencia}
                  alt={`Render de referencia: ${activo.descripcion}`}
                />
              </div>
              <div className={styles['comparacion__columna']}>
                <p className={styles['comparacion__etiqueta']}>Implementación</p>
                <div className={styles['comparacion__implementacion']}>
                  <VistaEscalada ancho={activo.ancho} alto={activo.alto}>
                    {activo.componente}
                  </VistaEscalada>
                </div>
              </div>
            </>
          ) : (
            <VistaEscalada ancho={activo.ancho} alto={activo.alto}>
              {activo.componente}
            </VistaEscalada>
          )}
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

        {DISENOS.map(({ id, etiqueta }) => (
          <button
            key={id}
            type="button"
            className={styles['barra__opcion']}
            aria-pressed={mostrarDiseno && diseno === id}
            onClick={() => {
              setDiseno(id)
              setModo('diseno')
            }}
          >
            {etiqueta}
          </button>
        ))}

        <span className={styles['barra__separador']} aria-hidden="true" />

        <button
          type="button"
          className={styles['barra__opcion']}
          aria-pressed={modo === 'comparar'}
          onClick={() => setModo(modo === 'comparar' ? 'diseno' : 'comparar')}
        >
          Comparar
        </button>

        <span className={styles['barra__separador']} aria-hidden="true" />

        <button
          type="button"
          className={styles['barra__opcion']}
          aria-pressed={modo === 'crear'}
          onClick={() => setModo('crear')}
        >
          Funcional UX-03
        </button>
        <button
          type="button"
          className={styles['barra__opcion']}
          aria-pressed={modo === 'detalle'}
          onClick={() => setModo('detalle')}
        >
          Funcional UX-04
        </button>
      </div>
    </>
  )
}
