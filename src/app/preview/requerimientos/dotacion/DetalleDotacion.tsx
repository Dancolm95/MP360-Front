import { Icono } from '../ux02/Cromo'
import {
  ACCIONES_DETALLE_DOTACION,
  CLIENTE_DETALLE_DOTACION,
  COBERTURA_DETALLE_DOTACION,
  FILAS_ESTRUCTURA_DOTACION,
  INDICADORES_DETALLE_DOTACION,
  ORDEN_DETALLE_DOTACION,
  PESTANAS_DETALLE_DOTACION,
  RANGO_DETALLE_DOTACION,
  type PestanaDetalleDotacion,
} from './datos'
import { MarcoDotacion } from './ResumenDotacion'

function Avatar() {
  return (
    <svg viewBox="0 0 23 27" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true" focusable="false">
      <circle cx="11.5" cy="6.4" r="5.1" />
      <path d="M1.7 25.9c.5-6.2 4.4-9.6 9.8-9.6s9.3 3.4 9.8 9.6" strokeLinecap="round" />
    </svg>
  )
}

function Encabezado() {
  return (
    <section className="ux19-encabezado">
      <p className="ux02-breadcrumb ux19-breadcrumb">
        <span className="ux02-breadcrumb__activo">R.R.H.H</span>
        <span className="ux02-breadcrumb__sep">/</span>
        <span className="ux19-breadcrumb__fin">Colaborades</span>
      </p>

      <div className="ux19-titulo-fila">
        <h1 className="ux19-titulo">Detalle de dotación por cliente, área y cargo</h1>
        <p className="ux19-subtitulo">Visualiza la dotación requerida y pendiente.</p>
      </div>

      <div className="ux19-estado">
        <span className="ux19-estado__etiqueta">Estado</span>
        <button type="button" className="ux19-estado__select" aria-label="Estado: Activo">
          <span className="ux19-estado__punto" aria-hidden="true" />
          <span>{CLIENTE_DETALLE_DOTACION.estado}</span>
          <Icono nombre="expand_more" />
        </button>
      </div>
    </section>
  )
}

function Cliente() {
  const cliente = CLIENTE_DETALLE_DOTACION

  return (
    <article className="ux19-cliente" aria-labelledby="ux19-cliente-nombre">
      <header className="ux19-cliente__cabecera">
        <span className="ux19-cliente__avatar">
          <Avatar />
        </span>
        <div className="ux19-cliente__identidad">
          <h2 className="ux19-cliente__nombre" id="ux19-cliente-nombre">
            {cliente.nombre}
          </h2>
          <span className="ux19-cliente__empresa">{cliente.empresa}</span>
          <span className="ux19-cliente__contrato">{cliente.contrato}</span>
        </div>
        <span className="ux19-cliente__estado">
          <Icono nombre="check_circle" />
          {cliente.estado}
        </span>
      </header>

      <div className="ux19-cliente__cuerpo">
        <p className="ux19-cliente__rotulo">Información de la operación</p>
        <dl className="ux19-cliente__datos">
          {cliente.datos.map((dato) => (
            <div key={dato.etiqueta} className="ux19-cliente__dato">
              <dt>{dato.etiqueta}</dt>
              <dd>{dato.valor}</dd>
            </div>
          ))}
          <div className="ux19-cliente__dato ux19-cliente__dato--cobertura">
            <dt>Cobertura General</dt>
            <dd>
              <span className="ux19-cliente__cobertura">{cliente.cobertura}</span>
            </dd>
          </div>
        </dl>
      </div>

      <div className="ux19-cliente__acciones">
        <button type="button" className="ux19-btn-primario">
          Editar dotación
        </button>
        <button type="button" className="ux19-btn-secundario">
          Ver en organización
        </button>
      </div>
    </article>
  )
}

function Pestanas({ activa }: { activa: PestanaDetalleDotacion }) {
  return (
    <div className="ux19-pestanas" role="tablist" aria-label="Detalle de dotación">
      {PESTANAS_DETALLE_DOTACION.map((pestana) => (
        <button
          key={pestana.id}
          type="button"
          role="tab"
          aria-selected={pestana.id === activa}
          className={[
            'ux19-pestana',
            pestana.id === activa ? 'ux19-pestana--activa' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <Icono nombre={pestana.icono} />
          <span>{pestana.etiqueta}</span>
        </button>
      ))}
    </div>
  )
}

function Indicadores() {
  return (
    <section className="ux19-kpis" aria-label="Indicadores de dotación">
      {INDICADORES_DETALLE_DOTACION.map((indicador, indice) => (
        <div key={indicador.etiqueta} className={`ux19-kpi ux19-kpi--${indice + 1}`}>
          <span className={`ux19-kpi__icono ux19-kpi__icono--${indicador.tono}`}>
            <Icono nombre={indicador.icono} />
          </span>
          <div className="ux19-kpi__texto">
            <span className="ux19-kpi__etiqueta">{indicador.etiqueta}</span>
            <strong className="ux19-kpi__valor">{indicador.valor}</strong>
          </div>
        </div>
      ))}
      <div className="ux19-kpi ux19-kpi--cobertura">
        <strong className="ux19-kpi__cobertura">{COBERTURA_DETALLE_DOTACION.valor}</strong>
        <span className="ux19-kpi__cobertura-etiqueta">
          {COBERTURA_DETALLE_DOTACION.etiqueta}
        </span>
      </div>
    </section>
  )
}

function Orden() {
  return (
    <div className="ux19-orden">
      <span className="ux19-orden__etiqueta">Ordenar por:</span>
      <button type="button" className="ux19-orden__actual">
        <Icono nombre="arrow_downward" />
        {ORDEN_DETALLE_DOTACION}
      </button>
      <div className="ux19-orden__acciones">
        <button type="button" className="ux19-orden__icono" aria-label="Agrupar">
          <Icono nombre="layers" />
        </button>
        <button type="button" className="ux19-orden__rango">
          {RANGO_DETALLE_DOTACION}
        </button>
        <button type="button" className="ux19-orden__icono" aria-label="Exportar documento">
          <Icono nombre="description" />
        </button>
        <button type="button" className="ux19-orden__icono" aria-label="Descargar">
          <Icono nombre="download" />
        </button>
        <button type="button" className="ux19-orden__icono" aria-label="Ajustar columnas">
          <Icono nombre="tune" />
        </button>
      </div>
    </div>
  )
}

function Tabla() {
  return (
    <section className="ux19-tabla" aria-label="Estructura organizacional">
      <h2 className="ux19-tabla__titulo">Estructura organizacional</h2>

      <div className="ux19-tabla__cabecera" role="row">
        <span role="columnheader">Área / Subárea / Cargo</span>
        <span role="columnheader">Requeridos</span>
        <span role="columnheader">Cubiertos</span>
        <span role="columnheader">Pendientes</span>
        <span role="columnheader" className="ux19-col-cobertura">
          Cobertura
        </span>
      </div>

      <div className="ux19-tabla__cuerpo">
        {FILAS_ESTRUCTURA_DOTACION.map((fila) => (
          <div
            key={fila.etiqueta}
            className={`ux19-fila ux19-fila--n${fila.nivel}`}
            role="row"
          >
            <span className="ux19-fila__area">
              {fila.nivel < 2 ? <Icono nombre="keyboard_arrow_down" /> : null}
              <span>{fila.etiqueta}</span>
            </span>
            <span className="ux19-fila__valor">{fila.requeridos}</span>
            <span className="ux19-fila__valor">{fila.cubiertos}</span>
            <span className="ux19-fila__valor">{fila.pendientes}</span>
            <span className="ux19-fila__cobertura">
              <span className={`ux19-cob ux19-cob--${fila.tono}`}>{fila.cobertura}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

export function DetalleDotacion({
  pestanaActiva = 'dotacion',
}: {
  pestanaActiva?: PestanaDetalleDotacion
}) {
  return (
    <MarcoDotacion
      clase="ux19-lienzo"
      accionesRapidas={ACCIONES_DETALLE_DOTACION}
      iconoAccionPrincipal={null}
    >
      <div className="ux19-contenido">
        <Encabezado />
        <div className="ux19-filas">
          <Cliente />
          <div className="ux19-panel">
            <Pestanas activa={pestanaActiva} />
            <Indicadores />
            <Orden />
            <Tabla />
          </div>
        </div>
      </div>
    </MarcoDotacion>
  )
}
