import type { ReactNode } from 'react'
import { Cabecera, Icono, Navegacion, PanelLateral, Pie } from '../ux02/Cromo'
import {
  CLIENTES_DOTACION,
  CUPO_DOTACION,
  FICHA_DOTACION,
  FILTROS_DOTACION,
  INDICADORES_DOTACION,
  NAVEGACION_DOTACION,
} from './datos'

export function MarcoDotacion({ children }: { children: ReactNode }) {
  return (
    <div className="ux02-lienzo ux18-lienzo">
      <Cabecera />
      <Navegacion
        activo="Organización y Dotación"
        submenu={false}
        chevronActivo={false}
        tabs={NAVEGACION_DOTACION}
      />
      <div className="ux02-main">
        <div className="ux02-columna ux18-columna">{children}</div>
        <PanelLateral
          iconoAcciones="edit"
          iconoAccesos={null}
          iconoEventos="expand_more"
          iconoAccionPrincipal="close"
        />
      </div>
      <Pie />
    </div>
  )
}

function Flecha({ sentido }: { sentido: 'izquierda' | 'derecha' }) {
  return (
    <svg
      className="ux18-flecha"
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

function Encabezado() {
  return (
    <section className="ux18-encabezado">
      <p className="ux02-breadcrumb ux18-breadcrumb">
        <span className="ux02-breadcrumb__activo">R.R.H.H</span>
        <span className="ux02-breadcrumb__sep">/</span>
        <span className="ux18-breadcrumb__fin">Organización y Dotación</span>
      </p>

      <div className="ux18-titulo-fila">
        <h1 className="ux18-titulo">Organización y Dotación</h1>
        <p className="ux18-subtitulo">
          Consulta la dotación requerida, cubierta y pendiente por cliente y gestiona los cupos
          de colaboradores.
        </p>
      </div>

      <button type="button" className="ux18-btn-operacion">
        Agregar Operación
      </button>
    </section>
  )
}

function Persona() {
  return (
    <span className="ux18-icono ux18-icono--persona" aria-hidden="true">
      <svg
        viewBox="0 0 23 27"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        focusable="false"
      >
        <circle cx="11.5" cy="6.4" r="5.1" />
        <path d="M1.7 25.9c.5-6.2 4.4-9.6 9.8-9.6s9.3 3.4 9.8 9.6" strokeLinecap="round" />
      </svg>
    </span>
  )
}

function OperacionesIcono() {
  return (
    <span className="ux18-icono ux18-icono--operaciones" aria-hidden="true">
      <svg
        viewBox="0 0 15 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        focusable="false"
      >
        <circle cx="11.7" cy="3" r="2.6" />
        <circle cx="3.1" cy="7" r="2.6" />
        <circle cx="11.7" cy="11" r="2.6" />
        <path d="M5.4 5.8 9.5 3.9M5.4 8.2l4.1 1.9" />
      </svg>
    </span>
  )
}

function Resumen() {
  return (
    <section className="ux18-resumen" aria-label="Resumen de dotación">
      {INDICADORES_DOTACION.map((indicador, indice) => (
        <div key={indicador.etiqueta} className="ux18-resumen__bloque">
          <div className={`ux18-indicador ux18-indicador--${indicador.tono}`}>
            {indicador.tono === 'azul' ? <OperacionesIcono /> : <Persona />}
            <strong className="ux18-indicador__valor">{indicador.valor}</strong>
            <span className="ux18-indicador__detalle">
              {indicador.fraccion ? (
                <span className="ux18-indicador__fraccion">{indicador.fraccion}</span>
              ) : null}
              <span className="ux18-indicador__etiqueta">{indicador.etiqueta}</span>
            </span>
          </div>
          {indice < INDICADORES_DOTACION.length - 1 ? (
            <span className="ux18-separador" aria-hidden="true" />
          ) : null}
        </div>
      ))}
    </section>
  )
}

function Filtros() {
  return (
    <section className="ux18-filtros" aria-label="Filtros de dotación">
      <div className="ux18-filtros__fila">
        {FILTROS_DOTACION.map((filtro) => (
          <div key={filtro} className="ux18-campo">
            <span className="ux18-campo__etiqueta">{filtro}</span>
            <button type="button" className="ux18-select" aria-label={`${filtro}: Todos`}>
              <span>Todos</span>
              <Icono nombre="expand_more" />
            </button>
          </div>
        ))}
      </div>

      <div className="ux18-filtros__pie">
        <button type="button" className="ux18-enlace">
          <Icono nombre="filter_alt" />
          Más Filtros
        </button>
        <div className="ux18-filtros__acciones">
          <button type="button" className="ux18-btn-aplicar">
            <Icono nombre="filter_alt" />
            Aplicar Filtros
          </button>
          <button type="button" className="ux18-btn-limpiar">
            <Icono nombre="restart_alt" />
            Limpiar
          </button>
        </div>
      </div>
    </section>
  )
}

function Cifra({
  valor,
  cupo,
  etiqueta,
  tono,
}: {
  valor: string
  cupo: string
  etiqueta: string
  tono: 'verde' | 'ambar'
}) {
  return (
    <div className={`ux18-cifra ux18-cifra--${tono}`}>
      <Persona />
      <strong className="ux18-cifra__valor">{valor}</strong>
      <span className="ux18-cifra__detalle">
        <span className="ux18-cifra__cupo">{cupo}</span>
        <span className="ux18-cifra__etiqueta">{etiqueta}</span>
      </span>
    </div>
  )
}

function Datos({ pares }: { pares: readonly { etiqueta: string; valor: string }[] }) {
  return (
    <dl className="ux18-datos">
      {pares.map((par) => (
        <div key={par.etiqueta} className="ux18-datos__par">
          <dt>{par.etiqueta}</dt>
          <dd>{par.valor}</dd>
        </div>
      ))}
    </dl>
  )
}

function TarjetaCliente({ nombre }: { nombre: string }) {
  const id = `ux18-cliente-${nombre.toLowerCase().replace(/[^a-z]+/g, '-')}`

  return (
    <article className="ux18-cliente" aria-labelledby={id}>
      <header className="ux18-cliente__cabecera">
        <span className="ux18-casilla" aria-hidden="true" />
        <h2 className="ux18-cliente__nombre" id={id}>
          {nombre}
        </h2>
        <span className="ux18-cobertura">{FICHA_DOTACION.cobertura}</span>
      </header>

      <div className="ux18-cliente__cuerpo">
        <div className="ux18-cifras">
          <Cifra
            valor={FICHA_DOTACION.cubiertos.valor}
            cupo={CUPO_DOTACION}
            etiqueta={FICHA_DOTACION.cubiertos.etiqueta}
            tono="verde"
          />
          <Cifra
            valor={FICHA_DOTACION.pendientes.valor}
            cupo={CUPO_DOTACION}
            etiqueta={FICHA_DOTACION.pendientes.etiqueta}
            tono="ambar"
          />
        </div>

        <span className="ux18-cliente__linea" aria-hidden="true" />

        <div className="ux18-cliente__datos">
          <Datos pares={FICHA_DOTACION.izquierda} />
          <Datos pares={FICHA_DOTACION.derecha} />
        </div>

        <button
          type="button"
          className="ux18-btn-detalle"
          aria-label={`Ver detalle de ${nombre}`}
        >
          <Icono nombre="visibility" />
          Ver Detalle
        </button>
      </div>
    </article>
  )
}

function Paginacion() {
  return (
    <nav className="ux18-paginacion" aria-label="Paginación de clientes">
      <button type="button" className="ux18-pagina" aria-label="Página anterior">
        <Flecha sentido="izquierda" />
      </button>
      <button type="button" className="ux18-pagina ux18-pagina--activa" aria-current="page">
        1
      </button>
      <button type="button" className="ux18-pagina" aria-label="Página siguiente">
        <Flecha sentido="derecha" />
      </button>
    </nav>
  )
}

export function ResumenDotacion() {
  return (
    <MarcoDotacion>
      <Encabezado />
      <div className="ux18-contenido">
        <Resumen />
        <Filtros />
        <section className="ux18-rejilla" aria-label="Dotación por cliente">
          {CLIENTES_DOTACION.map((cliente) => (
            <TarjetaCliente key={cliente} nombre={cliente} />
          ))}
        </section>
        <Paginacion />
      </div>
    </MarcoDotacion>
  )
}
