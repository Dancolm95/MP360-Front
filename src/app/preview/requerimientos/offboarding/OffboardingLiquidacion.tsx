import { MarcoOffboarding } from './BandejaOffboarding'
import {
  FichaProcesoOffboarding,
  PieProcesoOffboarding,
} from './OffboardingChecklist'
import { StepperOffboarding } from './OffboardingDatos'
import {
  FILAS_LIQUIDACION_OFFBOARDING,
  RESUMEN_LIQUIDACION_OFFBOARDING,
  TOTAL_LIQUIDACION_OFFBOARDING,
} from './datos'

export function OffboardingLiquidacion() {
  return (
    <MarcoOffboarding
      breadcrumbFin="Procesos de offboarding"
      titulo="Proceso de Offboarding"
      subtitulo="Registra la causal de cese y gestiona la hoja de ruta de salida del colaborador."
      clase="ux16-lienzo--liquidacion"
    >
      <div className="ux16-liquidacion">
        <div className="ux16-liquidacion__stepper">
          <StepperOffboarding activo={4} activos={[1, 2, 3, 4]} />
        </div>

        <FichaProcesoOffboarding />

        <section className="ux16-liquidacion__card" aria-labelledby="ux16-liquidacion-titulo">
          <div className="ux16-liquidacion__cabecera">
            <span className="ux16-liquidacion__marca" aria-hidden="true" />
            <h2 className="ux16-liquidacion__titulo" id="ux16-liquidacion-titulo">
              Detalle de Liquidación
            </h2>
          </div>

          <div className="ux16-liquidacion__cuerpo">
            <div className="ux16-liquidacion__resumen">
              <h3 className="ux16-liquidacion__resumen-titulo">Resumen general</h3>
              <dl className="ux16-liquidacion__resumen-lista">
                {RESUMEN_LIQUIDACION_OFFBOARDING.map((dato) => (
                  <div key={dato.etiqueta} className="ux16-liquidacion__resumen-fila">
                    <dt>{dato.etiqueta}</dt>
                    <dd>{dato.valor}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div
              className="ux16-liquidacion__tabla"
              role="table"
              aria-label="Detalle de liquidación"
            >
              <div
                className="ux16-liquidacion__fila ux16-liquidacion__fila--cabecera"
                role="row"
              >
                <span role="columnheader">Concepto</span>
                <span role="columnheader">Detalle</span>
                <span role="columnheader" aria-label="Monto" />
              </div>

              {FILAS_LIQUIDACION_OFFBOARDING.map((fila) => (
                <div key={fila.concepto} className="ux16-liquidacion__fila" role="row">
                  <span role="cell">{fila.concepto}</span>
                  <span role="cell">{fila.detalle}</span>
                  <span role="cell" className="ux16-liquidacion__monto">
                    {fila.monto}
                  </span>
                </div>
              ))}

              <div
                className="ux16-liquidacion__fila ux16-liquidacion__fila--total"
                role="row"
              >
                <span role="cell">{TOTAL_LIQUIDACION_OFFBOARDING.etiqueta}</span>
                <span role="cell" />
                <span role="cell" className="ux16-liquidacion__monto">
                  {TOTAL_LIQUIDACION_OFFBOARDING.monto}
                </span>
              </div>
            </div>
          </div>
        </section>

        <PieProcesoOffboarding />
      </div>
    </MarcoOffboarding>
  )
}
