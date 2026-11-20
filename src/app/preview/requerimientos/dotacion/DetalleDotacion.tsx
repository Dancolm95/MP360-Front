import { Icono } from '../ux02/Cromo'
import {
  ACCIONES_DETALLE_DOTACION,
  CLIENTE_DETALLE_DOTACION,
  COBERTURA_DETALLE_DOTACION,
  FILAS_ASIGNADOS_DOTACION,
  FILAS_ESTRUCTURA_DOTACION,
  FILTROS_ASIGNADOS_DOTACION,
  INDICADORES_ASIGNADOS_DOTACION,
  INDICADORES_DETALLE_DOTACION,
  ORDEN_DETALLE_DOTACION,
  PAGINACION_ASIGNADOS_DOTACION,
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
    <div
      className={[
        'ux19-pestanas',
        activa === 'asignados' ? 'ux19-pestanas--asignados' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      role="tablist"
      aria-label="Detalle de dotación"
    >
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

function IndicadoresAsignados() {
  return (
    <section className="ux19-asignados__kpis" aria-label="Indicadores de colaboradores">
      {INDICADORES_ASIGNADOS_DOTACION.map((indicador, indice) => (
        <div
          key={indicador.etiqueta}
          className={`ux19-asignados__kpi ux19-asignados__kpi--${indice + 1}`}
        >
          <span className={`ux19-asignados__icono ux19-asignados__icono--${indicador.tono}`}>
            <Icono nombre={indicador.icono} />
          </span>
          <div className="ux19-asignados__kpi-texto">
            <span className="ux19-asignados__kpi-etiqueta">{indicador.etiqueta}</span>
            <strong className="ux19-asignados__kpi-valor">{indicador.valor}</strong>
          </div>
        </div>
      ))}
    </section>
  )
}

function FiltrosAsignados() {
  return (
    <section className="ux19-asignados__filtros" aria-label="Filtros de colaboradores">
      <div className="ux19-asignados__campos">
        {FILTROS_ASIGNADOS_DOTACION.map((filtro) => (
          <div key={filtro} className="ux19-asignados__campo">
            <span className="ux19-asignados__campo-etiqueta">{filtro}</span>
            <button type="button" className="ux19-asignados__select" aria-label={`${filtro}: Todos`}>
              <span>Todos</span>
              <Icono nombre="expand_more" />
            </button>
          </div>
        ))}
      </div>

      <div className="ux19-asignados__filtros-acciones">
        <button type="button" className="ux19-asignados__aplicar">
          <Icono nombre="filter_alt" />
          Aplicar Filtros
        </button>
        <button type="button" className="ux19-asignados__limpiar">
          <Icono nombre="undo" />
          Limpiar
        </button>
      </div>
    </section>
  )
}

function Chevron({ sentido }: { sentido: 'izquierda' | 'derecha' }) {
  return (
    <svg
      className="ux19-asignados__flecha"
      viewBox="0 0 8 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={sentido === 'izquierda' ? 'M6.6 1 1.2 7l5.4 6' : 'M1.4 1l5.4 6-5.4 6'} />
    </svg>
  )
}

function FlechasOrden() {
  return (
    <svg
      className="ux19-asignados__flechas"
      viewBox="0 0 12 14"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6 0 11.4 5.6H0.6Z" />
      <path d="M6 14 0.6 8.4h10.8Z" />
    </svg>
  )
}

function CabeceraTabla() {
  return (
    <div className="ux19-asignados__cabecera" role="row">
      <span className="ux19-asignados__th ux19-asignados__th--candidato" role="columnheader">
        <span className="ux19-asignados__casilla" aria-hidden="true" />
        <span className="ux19-asignados__th-texto">Candidato</span>
        <span className="ux19-asignados__orden" aria-hidden="true">
          <FlechasOrden />
        </span>
      </span>
      <span className="ux19-asignados__th" role="columnheader">
        <span className="ux19-asignados__th-texto">
          <span>Documento</span>
          <span>de Identidad</span>
        </span>
        <span className="ux19-asignados__orden" aria-hidden="true">
          <FlechasOrden />
        </span>
      </span>
      <span className="ux19-asignados__th" role="columnheader">
        <span className="ux19-asignados__th-texto">Puesto</span>
        <span className="ux19-asignados__orden" aria-hidden="true">
          <FlechasOrden />
        </span>
      </span>
      <span className="ux19-asignados__th" role="columnheader">
        <span className="ux19-asignados__th-texto">
          <span>Tipo de</span>
          <span>Contrato</span>
        </span>
        <span className="ux19-asignados__orden" aria-hidden="true">
          <FlechasOrden />
        </span>
      </span>
      <span className="ux19-asignados__th" role="columnheader">
        <span className="ux19-asignados__th-texto">
          <span>Fecha de</span>
          <span>Ingreso</span>
        </span>
        <span className="ux19-asignados__orden" aria-hidden="true">
          <FlechasOrden />
        </span>
      </span>
      <span className="ux19-asignados__th" role="columnheader">
        <span className="ux19-asignados__th-texto">Estado</span>
        <span className="ux19-asignados__orden" aria-hidden="true">
          <FlechasOrden />
        </span>
      </span>
      <span className="ux19-asignados__th ux19-asignados__th--acciones" role="columnheader">
        <span className="ux19-asignados__kebab" aria-hidden="true">
          <Icono nombre="more_vert" />
        </span>
      </span>
    </div>
  )
}

function TablaAsignados() {
  return (
    <section className="ux19-asignados__tabla" aria-label="Colaboradores asignados">
      <CabeceraTabla />
      <div className="ux19-asignados__cuerpo">
        {FILAS_ASIGNADOS_DOTACION.map((fila, indice) => (
          <div
            key={`${fila.nombre}-${indice}`}
            className="ux19-asignados__fila"
            role="row"
          >
            <span className="ux19-asignados__celda ux19-asignados__celda--candidato">
              <span className="ux19-asignados__casilla" aria-hidden="true" />
              <span className="ux19-asignados__avatar" aria-hidden="true">
                <Icono nombre="person" />
              </span>
              <span className="ux19-asignados__identidad">
                <strong>{fila.nombre}</strong>
                <span>Nac: {fila.nacionalidad}</span>
              </span>
            </span>
            <span className="ux19-asignados__celda">{fila.documento}</span>
            <span className="ux19-asignados__celda ux19-asignados__celda--puesto">
              {fila.puesto}
            </span>
            <span className="ux19-asignados__celda ux19-asignados__celda--contrato">
              {fila.contrato}
            </span>
            <span className="ux19-asignados__celda ux19-asignados__celda--fecha">
              {fila.ingreso}
            </span>
            <span className="ux19-asignados__celda ux19-asignados__celda--estado">
              <span className={`ux19-asignados__badge ux19-asignados__badge--${fila.tono}`}>
                {fila.estado}
              </span>
            </span>
            <span className="ux19-asignados__celda ux19-asignados__celda--acciones">
              <span className="ux19-asignados__kebab" aria-hidden="true">
                <Icono nombre="more_vert" />
              </span>
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

function PaginacionAsignados() {
  return (
    <nav className="ux19-asignados__paginacion" aria-label="Paginación de colaboradores">
      <span className="ux19-asignados__resumen">{PAGINACION_ASIGNADOS_DOTACION.resumen}</span>
      <div className="ux19-asignados__paginas">
        <button type="button" className="ux19-asignados__pagina" aria-label="Página anterior">
          <Chevron sentido="izquierda" />
        </button>
        {PAGINACION_ASIGNADOS_DOTACION.paginas.map((pagina) => (
          <button
            key={pagina}
            type="button"
            className={[
              'ux19-asignados__pagina',
              pagina === PAGINACION_ASIGNADOS_DOTACION.activa
                ? 'ux19-asignados__pagina--activa'
                : '',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-current={pagina === PAGINACION_ASIGNADOS_DOTACION.activa ? 'page' : undefined}
          >
            {pagina}
          </button>
        ))}
        <button type="button" className="ux19-asignados__pagina" aria-label="Página siguiente">
          <Chevron sentido="derecha" />
        </button>
        <button type="button" className="ux19-asignados__pagina" aria-label="Última página">
          <Chevron sentido="derecha" />
        </button>
      </div>
    </nav>
  )
}

export function DetalleDotacion({
  pestanaActiva = 'dotacion',
}: {
  pestanaActiva?: PestanaDetalleDotacion
}) {
  const esAsignados = pestanaActiva === 'asignados'

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
            {esAsignados ? (
              <>
                <IndicadoresAsignados />
                <FiltrosAsignados />
                <Orden />
                <TablaAsignados />
                <PaginacionAsignados />
              </>
            ) : (
              <>
                <Indicadores />
                <Orden />
                <Tabla />
              </>
            )}
          </div>
        </div>
      </div>
    </MarcoDotacion>
  )
}
