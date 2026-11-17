import { useEffect, useState } from 'react'
import { Cabecera, Icono, Navegacion, PanelLateral, Pie } from '../ux02/Cromo'
import {
  ALERTAS,
  COBERTURA,
  FILTROS_INICIO,
  INDICADORES,
  MODULOS_INICIO,
  type Alerta,
  type Indicador,
} from './datos'

function Migas() {
  return (
    <p className="ux04-migas">
      <span>R.R.H.H</span>
      <span className="ux04-migas__sep">/</span>
      <span className="ux04-migas__activo">Inicio</span>
    </p>
  )
}

function Filtros() {
  return (
    <section className="ux-inicio-filtros" aria-label="Filtros del tablero">
      {FILTROS_INICIO.map((filtro) => (
        <label key={filtro.etiqueta} className="ux-inicio-filtro" style={{ width: filtro.ancho }}>
          <span className="ux-inicio-filtro__etiqueta">{filtro.etiqueta}</span>
          <button type="button" className="ux-inicio-filtro__control">
            {filtro.icono ? <Icono nombre={filtro.icono} /> : null}
            <span>{filtro.marcador}</span>
            {filtro.icono ? null : <Icono nombre="expand_more" />}
          </button>
        </label>
      ))}

      <div className="ux-inicio-filtros__acciones">
        <button type="button" className="ux-inicio-btn-filtro">
          <Icono nombre="filter_alt" />
          Aplicar Filtros
        </button>
        <button type="button" className="ux-inicio-btn-filtro ux-inicio-btn-filtro--fantasma">
          Limpiar
        </button>
      </div>
    </section>
  )
}

function IndicadorCard({ indicador }: { indicador: Indicador }) {
  return (
    <article className="ux-inicio-kpi" data-tono={indicador.tono}>
      <span className="ux-inicio-kpi__icono">
        <Icono nombre={indicador.icono} />
      </span>
      <span className="ux-inicio-kpi__etiqueta">{indicador.etiqueta}</span>
      <strong className="ux-inicio-kpi__valor">{indicador.valor}</strong>
      <span className="ux-inicio-kpi__chip">
        <Icono nombre={indicador.iconoChip} />
        {indicador.chip}
      </span>
    </article>
  )
}

function Badge({ alerta }: { alerta: Alerta }) {
  return (
    <span
      className="ux-inicio-badge"
      data-estado={alerta.estado === 'Crítico' ? 'critico' : 'advertencia'}
    >
      <Icono nombre={alerta.estado === 'Crítico' ? 'error' : 'warning'} />
      {alerta.estado}
    </span>
  )
}

function Alertas() {
  return (
    <section className="ux-inicio-card ux-inicio-alertas" aria-labelledby="ux-inicio-alertas-titulo">
      <h2 id="ux-inicio-alertas-titulo" className="ux-inicio-card__titulo">
        Alertas prioritarias
      </h2>

      <div className="ux-inicio-tabla" role="table" aria-label="Alertas prioritarias">
        <div className="ux-inicio-tabla__cabecera" role="row">
          <div role="columnheader">Descripción</div>
          <div role="columnheader">Estado</div>
          <div role="columnheader">Fecha</div>
          <div role="columnheader">Descripción</div>
          <div role="columnheader" aria-label="Acciones" />
        </div>

        {ALERTAS.map((alerta, indice) => (
          <div key={`${alerta.titulo}-${indice}`} className="ux-inicio-tabla__fila" role="row">
            <div className="ux-inicio-alerta__descripcion" role="cell">
              <span className="ux-inicio-alerta__titulo">{alerta.titulo}</span>
              <span className="ux-inicio-alerta__detalle">{alerta.detalle}</span>
            </div>
            <div role="cell">
              <Badge alerta={alerta} />
            </div>
            <div role="cell">{alerta.fecha}</div>
            <div className="ux-inicio-alerta__responsable" role="cell">
              <span className="ux-inicio-alerta__titulo">{alerta.responsable}</span>
              <span className="ux-inicio-alerta__nota">{alerta.nota}</span>
            </div>
            <div role="cell">
              <button type="button" className="ux-inicio-enlace">
                Detalles
              </button>
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="ux-inicio-mas">
        Más información
        <Icono nombre="arrow_forward" />
      </button>
    </section>
  )
}

function Cobertura() {
  return (
    <section className="ux-inicio-card ux-inicio-cobertura" aria-labelledby="ux-inicio-cobertura-titulo">
      <h2 id="ux-inicio-cobertura-titulo" className="ux-inicio-card__titulo">
        Cobertura por Cliente
      </h2>

      <div className="ux-inicio-cobertura__tabla" role="table" aria-label="Cobertura por cliente">
        <div className="ux-inicio-cobertura__cabecera" role="row">
          <div role="columnheader">Cliente</div>
          <div role="columnheader">Cobertura</div>
          <div role="columnheader">Vacantes</div>
          <div role="columnheader" aria-label="Acciones" />
        </div>

        {COBERTURA.map((cliente) => (
          <div key={cliente.cliente} className="ux-inicio-cobertura__fila" role="row">
            <div className="ux-inicio-cobertura__cliente" role="cell">
              <span className="ux-inicio-cobertura__nombre">{cliente.cliente}</span>
              <span className="ux-inicio-cobertura__tipo">Cliente</span>
            </div>
            <div className="ux-inicio-cobertura__valor" role="cell">
              {cliente.cobertura}
              <Icono nombre="check_circle" />
            </div>
            <div role="cell">{cliente.vacantes}</div>
            <div role="cell">
              <button type="button" className="ux02-menu-puntos" aria-label={`Acciones de ${cliente.cliente}`}>
                <Icono nombre="more_vert" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="ux-inicio-mas">
        Más información
        <Icono nombre="arrow_forward" />
      </button>
    </section>
  )
}

function SelectorModulos({ alCerrar }: { alCerrar: () => void }) {
  return (
    <>
      <div className="ux-inicio-scrim" aria-hidden="true" onClick={alCerrar} />
      <div className="ux-inicio-modulos" role="menu" aria-label="Módulos de MP 360">
        {MODULOS_INICIO.map((modulo) => (
          <button
            key={modulo.nombre}
            type="button"
            role="menuitem"
            className="ux-inicio-modulos__tesela"
            style={{ background: modulo.color }}
            onClick={alCerrar}
          >
            <Icono nombre={modulo.icono} />
            <span className="ux-inicio-modulos__etiqueta">{modulo.nombre}</span>
          </button>
        ))}
      </div>
    </>
  )
}

export function DisenoInicio({ selectorAbierto = false }: { selectorAbierto?: boolean }) {
  const [moduloAbierto, setModuloAbierto] = useState(selectorAbierto)

  useEffect(() => {
    setModuloAbierto(selectorAbierto)
  }, [selectorAbierto])

  useEffect(() => {
    if (!moduloAbierto) return
    const cerrarConEscape = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') setModuloAbierto(false)
    }
    document.addEventListener('keydown', cerrarConEscape)
    return () => document.removeEventListener('keydown', cerrarConEscape)
  }, [moduloAbierto])

  return (
    <div className="ux02-lienzo">
      <Cabecera />
      <Navegacion
        submenu={false}
        activo="Inicio"
        moduloAbierto={moduloAbierto}
        onModulo={() => setModuloAbierto((abierto) => !abierto)}
      />
      <main className="ux02-main ux-inicio-main">
        <div className="ux02-columna ux-inicio-columna">
          <header className="ux-inicio-cabecera">
            <Migas />
            <div className="ux04-cabecera__fila">
              <h1 className="ux04-titulo">Dashboard de Gestión de RR.HH.</h1>
              <p className="ux02-subtitulo">
                Resumen de indicadores clave y alertas de tu gestión de talento.
              </p>
            </div>
          </header>

          <Filtros />

          <section className="ux-inicio-kpis" aria-label="Indicadores">
            {INDICADORES.map((indicador) => (
              <IndicadorCard key={indicador.etiqueta} indicador={indicador} />
            ))}
          </section>

          <div className="ux-inicio-tablas">
            <Alertas />
            <Cobertura />
          </div>
        </div>
        <PanelLateral />
      </main>
      <Pie />
      {moduloAbierto ? <SelectorModulos alCerrar={() => setModuloAbierto(false)} /> : null}
    </div>
  )
}
