import { Cabecera, Icono, Navegacion, PanelLateral, Pie } from '../ux02/Cromo'
import type { ParDato } from './datos'
import {
  BOLETAS,
  BOLETAS_PROCESO,
  COLABORADOR,
  DATOS_CONTRATO,
  DATOS_LABORALES,
  DATOS_PERSONALES,
  PAGINAS_BOLETAS,
  PANELES,
  REMUNERACION,
  TABS,
} from './datos'

function Avatar() {
  return (
    <span className="ux08f-avatar" aria-hidden="true">
      <svg viewBox="0 0 88 88" focusable="false">
        <circle cx="44" cy="44" r="44" fill="#808080" />
        <circle cx="43.5" cy="34" r="12.5" fill="#f2f2f2" />
        <path
          d="M43.5 54c-13.5 0-22.5 8-23 18-.3 6 6.5 10 15.5 10h15c9 0 15.8-4 15.5-10-.5-10-9.5-18-23-18z"
          fill="#f2f2f2"
        />
      </svg>
      <span className="ux08f-avatar__editar">
        <Icono nombre="edit" />
      </span>
    </span>
  )
}

function PilaDatos({ pares }: { pares: readonly (readonly [ParDato, ParDato])[] }) {
  return (
    <dl className="ux08f-pares">
      {pares.map((fila) => (
        <div key={fila[0].etiqueta} className="ux08f-par">
          {fila.map((dato) => (
            <div key={dato.etiqueta} className="ux08f-par__dato">
              <dt>{dato.etiqueta}</dt>
              <dd>{dato.valor}</dd>
            </div>
          ))}
        </div>
      ))}
    </dl>
  )
}

function Perfil() {
  return (
    <aside className="ux08f-perfil" aria-label="Datos del colaborador">
      <div className="ux08f-perfil__persona">
        <Avatar />
        <div className="ux08f-perfil__datos">
          <h2 className="ux08f-perfil__nombre">{COLABORADOR.nombre}</h2>
          <p className="ux08f-perfil__cargo">{COLABORADOR.cargo}</p>
          <p className="ux08f-perfil__ubicacion">{COLABORADOR.ubicacion}</p>
          <span className="ux08f-badge-activo">
            <span className="ux08f-badge-activo__marca" aria-hidden="true">
              <Icono nombre="check" />
            </span>
            {COLABORADOR.estado}
          </span>
        </div>
      </div>

      <h3 className="ux08f-perfil__titulo">Información General</h3>
      <PilaDatos pares={DATOS_PERSONALES} />
      <PilaDatos pares={DATOS_LABORALES} />

      <div className="ux08f-perfil__acciones">
        <button type="button" className="ux08f-btn ux08f-btn--solido">
          Renovar Contrato
        </button>
        <button type="button" className="ux08f-btn ux08f-btn--peligro">
          Finalizar Trabajo
        </button>
        <button type="button" className="ux08f-btn ux08f-btn--contorno">
          Editar Trabajo
        </button>
      </div>
    </aside>
  )
}

function Encabezado() {
  return (
    <header className="ux08f-encabezado">
      <p className="ux02-breadcrumb ux08f-breadcrumb">
        <span className="ux02-breadcrumb__activo">R.R.H.H</span>
        <span className="ux02-breadcrumb__sep">/</span>
        <span>Colaboradores</span>
      </p>

      <h1 className="ux08f-titulo">Ficha de Colaborador</h1>
      <p className="ux08f-subtitulo">
        Consulta y administra la información del colaborador y su expediente
      </p>

      <div className="ux08f-estado">
        <span className="ux08f-estado__etiqueta">Estado</span>
        <button type="button" className="ux08f-estado__selector">
          <span className="ux08f-estado__punto" aria-hidden="true" />
          <span className="ux08f-estado__valor">{COLABORADOR.estado}</span>
          <Icono nombre="expand_more" />
        </button>
      </div>
    </header>
  )
}

function Tabs({ activa }: { activa: number }) {
  return (
    <div className="ux08f-tabs" role="tablist" aria-label="Secciones de la ficha">
      {TABS.map((tab, indice) => (
        <button
          key={tab.etiqueta}
          type="button"
          role="tab"
          aria-selected={indice === activa}
          className={`ux08f-tab${indice === activa ? ' ux08f-tab--activo' : ''}`}
        >
          <Icono nombre={tab.icono} />
          <span>{tab.etiqueta}</span>
        </button>
      ))}
    </div>
  )
}

function Contrato() {
  return (
    <dl className="ux08f-contrato">
      {DATOS_CONTRATO.map((dato) => (
        <div key={dato.etiqueta} className="ux08f-contrato__fila">
          <dt>{dato.etiqueta}</dt>
          <dd>{dato.valor}</dd>
        </div>
      ))}
    </dl>
  )
}

function Panel({ titulo, clave, campos }: (typeof PANELES)[number]) {
  return (
    <section className={`ux08f-panel ux08f-panel--${clave}`} aria-label={titulo}>
      <div className="ux08f-panel__cabecera">
        <span className="ux08f-cuadro" aria-hidden="true" />
        <h3 className="ux08f-panel__titulo">{titulo}</h3>
      </div>
      <button type="button" className="ux08f-btn-editar">
        <Icono nombre="edit" />
        Editar
      </button>

      <dl className="ux08f-campos">
        {campos.map((campo) => (
          <div key={campo.etiqueta} className="ux08f-campo">
            <dt>{campo.etiqueta}</dt>
            <dd>{campo.valor}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function ResumenDerecha() {
  return (
    <div className="ux08f-derecha">
      <div className="ux08f-remuneracion__cabecera">
        <span className="ux08f-cuadro" aria-hidden="true" />
        <h2 className="ux08f-panel__titulo">Remuneración Vigente</h2>
        <button type="button" className="ux08f-btn-historial">
          Ver historial
        </button>
      </div>

      <div className="ux08f-remuneracion">
        <div className="ux08f-remuneracion__monto">
          <span className="ux08f-remuneracion__cifra">{REMUNERACION.monto}</span>
          <span className="ux08f-remuneracion__detalle">{REMUNERACION.detalle}</span>
        </div>
        <span className="ux08f-badge-vigente">
          <span className="ux08f-badge-vigente__marca" aria-hidden="true">
            <Icono nombre="check" />
          </span>
          {REMUNERACION.estado}
        </span>
      </div>

      {PANELES.map((panel) => (
        <Panel key={panel.clave} {...panel} />
      ))}
    </div>
  )
}

function Casilla() {
  return <span className="ux08f-boletas__casilla" aria-hidden="true" />
}

function AccionesBoleta() {
  return (
    <div className="ux08f-proceso__acciones">
      <button type="button" className="ux08f-proceso__accion" aria-label="Ver boleta">
        <Icono nombre="visibility" />
      </button>
      <button
        type="button"
        className="ux08f-proceso__accion ux08f-proceso__accion--imprimir"
        aria-label="Imprimir boleta"
      >
        <Icono nombre="print" />
      </button>
    </div>
  )
}

function Paginacion() {
  return (
    <div className="ux08f-boletas__paginacion">
      <span className="ux08f-boletas__resumen">Mostrando 10 de 246</span>
      <div className="ux08f-boletas__paginas">
        <button
          type="button"
          className="ux08f-boletas__pagina ux08f-boletas__pagina--anterior"
          aria-label="Página anterior"
        >
          <Icono nombre="chevron_left" />
        </button>
        {PAGINAS_BOLETAS.map((pagina) => (
          <button
            key={pagina}
            type="button"
            className={`ux08f-boletas__pagina${pagina === 1 ? ' ux08f-boletas__pagina--activa' : ''}`}
            aria-current={pagina === 1 ? 'page' : undefined}
          >
            {pagina}
          </button>
        ))}
        <button type="button" className="ux08f-boletas__pagina" aria-label="Página siguiente">
          <Icono nombre="chevron_right" />
        </button>
        <button type="button" className="ux08f-boletas__pagina" aria-label="Última página">
          <Icono nombre="chevron_right" />
        </button>
      </div>
    </div>
  )
}

function BoletasProceso() {
  return (
    <div
      className="ux08f-boletas__tabla ux08f-proceso__tabla"
      role="table"
      aria-label="Boletas de pago por proceso"
    >
      <div className="ux08f-boletas__fila ux08f-boletas__cabecera ux08f-proceso__fila" role="row">
        <div role="columnheader" className="ux08f-boletas__th ux08f-boletas__th--mes">
          <Casilla />
          <span className="ux08f-boletas__rotulo">
            Mes
            <Icono nombre="unfold_more" />
          </span>
        </div>
        <div role="columnheader" className="ux08f-boletas__th">
          Horas
          <br />
          Extras
        </div>
        <div role="columnheader" className="ux08f-boletas__th">
          Recargos
        </div>
        <div role="columnheader" className="ux08f-boletas__th">
          Horas no
          <br />
          Trabajadas
        </div>
        <div role="columnheader" className="ux08f-boletas__th">
          Días no
          <br />
          Trabajados
        </div>
        <div role="columnheader" className="ux08f-boletas__th">
          Proceso
        </div>
        <div role="columnheader" className="ux08f-boletas__th">
          Acciones
        </div>
      </div>

      <div className="ux08f-boletas__cuerpo">
        {BOLETAS_PROCESO.map((boleta, indice) => (
          <div key={indice} className="ux08f-boletas__fila ux08f-proceso__fila" role="row">
            <div role="cell" className="ux08f-boletas__celda-mes">
              <Casilla />
              <span>{boleta.mes}</span>
            </div>
            <div role="cell" className="ux08f-boletas__celda">
              {boleta.horasExtras}
            </div>
            <div role="cell" className="ux08f-boletas__celda">
              {boleta.recargos}
            </div>
            <div role="cell" className="ux08f-boletas__celda">
              {boleta.horasNoTrabajadas}
            </div>
            <div role="cell" className="ux08f-boletas__celda">
              {boleta.diasNoTrabajados}
            </div>
            <div role="cell" className="ux08f-boletas__celda">
              {boleta.proceso}
            </div>
            <div role="cell" className="ux08f-boletas__celda ux08f-proceso__celda-acciones">
              <AccionesBoleta />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Boletas({ variante }: { variante?: 'proceso' }) {
  if (variante === 'proceso') {
    return (
      <div className="ux08f-boletas">
        <div className="ux08f-boletas__scroll ux08f-proceso__scroll" aria-hidden="true" />
        <BoletasProceso />
        <Paginacion />
      </div>
    )
  }

  return (
    <div className="ux08f-boletas">
      <div className="ux08f-boletas__scroll" aria-hidden="true" />

      <div className="ux08f-boletas__tabla" role="table" aria-label="Boletas de pago">
        <div className="ux08f-boletas__fila ux08f-boletas__cabecera" role="row">
          <div role="columnheader" className="ux08f-boletas__th ux08f-boletas__th--mes">
            <Casilla />
            <span className="ux08f-boletas__rotulo">
              Mes
              <Icono nombre="unfold_more" />
            </span>
          </div>
          <div role="columnheader" className="ux08f-boletas__th">
            Sueldo
            <br />
            Bruto
          </div>
          <div role="columnheader" className="ux08f-boletas__th">
            Sueldo
            <br />
            Neto
          </div>
          <div role="columnheader" className="ux08f-boletas__th">
            Aporte
            <br />
            Empleador
          </div>
          <div role="columnheader" className="ux08f-boletas__th">
            Horas
            <br />
            Extras
          </div>
          <div role="columnheader" className="ux08f-boletas__th">
            Recargos
          </div>
          <div role="columnheader" className="ux08f-boletas__th">
            Horas no
            <br />
            Trabajadas
          </div>
          <div role="columnheader" className="ux08f-boletas__th">
            Días no
            <br />
            Trabajados
          </div>
        </div>

        <div className="ux08f-boletas__cuerpo">
          {BOLETAS.map((boleta, indice) => (
            <div key={indice} className="ux08f-boletas__fila" role="row">
              <div role="cell" className="ux08f-boletas__celda-mes">
                <Casilla />
                <span>{boleta.mes}</span>
              </div>
              <div role="cell" className="ux08f-boletas__celda">
                {boleta.sueldoBruto}
              </div>
              <div role="cell" className="ux08f-boletas__celda">
                {boleta.sueldoNeto}
              </div>
              <div role="cell" className="ux08f-boletas__celda">
                {boleta.aporteEmpleador}
              </div>
              <div role="cell" className="ux08f-boletas__celda">
                {boleta.horasExtras}
              </div>
              <div role="cell" className="ux08f-boletas__celda">
                {boleta.recargos}
              </div>
              <div role="cell" className="ux08f-boletas__celda">
                {boleta.horasNoTrabajadas}
              </div>
              <div role="cell" className="ux08f-boletas__celda">
                {boleta.diasNoTrabajados}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Paginacion />
    </div>
  )
}

export function FichaColaborador({
  tabActiva = 0,
  varianteBoletas,
}: {
  tabActiva?: number
  varianteBoletas?: 'proceso'
} = {}) {
  return (
    <div className="ux02-lienzo ux08f-lienzo">
      <Cabecera />
      <Navegacion activo="Colaboradores" submenu={false} chevronActivo={false} />
      <div className="ux02-main">
        <div className="ux02-columna">
          <Encabezado />
          <div className="ux08f-tablero">
            <Perfil />
            <section className="ux08f-ficha" aria-label="Ficha del colaborador">
              <Tabs activa={tabActiva} />
              {tabActiva === 1 ? (
                <Boletas variante={varianteBoletas} />
              ) : (
                <>
                  <Contrato />
                  <ResumenDerecha />
                </>
              )}
            </section>
          </div>
        </div>
        <PanelLateral iconoAcciones="edit" iconoAccesos={null} iconoEventos="expand_more" />
      </div>
      <Pie />
    </div>
  )
}
