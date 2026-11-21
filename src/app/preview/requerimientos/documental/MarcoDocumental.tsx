import type { ReactNode } from 'react'
import { Cabecera, Icono, Navegacion, PanelLateral, Pie } from '../ux02/Cromo'

export function MarcoDocumental({
  children,
  stepper,
  breadcrumbMedio,
  breadcrumbFin = 'Gestión Documental',
  titulo = 'Gestión Documental',
  subtitulo = 'Centraliza la revisión, consulta archivos y seguimientos de documentos de colaboradores.',
  accionEtiqueta = 'Generar Documento',
  accionIcono = 'description',
  mostrarAccion = true,
  clase,
}: {
  children: ReactNode
  stepper?: ReactNode
  breadcrumbMedio?: string
  breadcrumbFin?: string
  titulo?: string
  subtitulo?: string
  accionEtiqueta?: string
  accionIcono?: string
  mostrarAccion?: boolean
  clase?: string
}) {
  return (
    <div className={`ux02-lienzo ux13-lienzo ux23-lienzo${clase ? ` ${clase}` : ''}`}>
      <Cabecera />
      <Navegacion activo="Gestión Documental" submenu={false} chevronActivo={false} />
      <div className="ux02-main">
        <div className="ux02-columna">
          <section className="ux13-encabezado ux23-encabezado">
            <p className="ux02-breadcrumb ux13-breadcrumb">
              <span className="ux02-breadcrumb__activo">R.R.H.H</span>
              <span className="ux02-breadcrumb__sep">/</span>
              {breadcrumbMedio ? (
                <>
                  <span>{breadcrumbMedio}</span>
                  <span className="ux02-breadcrumb__sep">/</span>
                </>
              ) : null}
              <span>{breadcrumbFin}</span>
            </p>

            <div className="ux13-titulo-fila">
              <h1 className="ux13-titulo">{titulo}</h1>
              <p className="ux13-subtitulo">{subtitulo}</p>
            </div>

            {mostrarAccion ? (
              <button type="button" className="ux13-btn-registrar ux23-btn-generar">
                <Icono nombre={accionIcono} />
                {accionEtiqueta}
              </button>
            ) : null}
          </section>

          {stepper}
          {children}
        </div>

        <PanelLateral
          iconoAcciones="edit"
          iconoAccesos={null}
          iconoEventos="expand_more"
          iconoAccionPrincipal={null}
        />
      </div>
      <Pie />
    </div>
  )
}
