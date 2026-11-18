import { Cabecera, Icono, Navegacion, PanelLateral, Pie } from '../ux02/Cromo'
import type { ParDato } from './datos'
import {
  COLABORADOR,
  DATOS_CONTRATO,
  DATOS_LABORALES,
  DATOS_PERSONALES,
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

function Tabs() {
  return (
    <div className="ux08f-tabs" role="tablist" aria-label="Secciones de la ficha">
      {TABS.map((tab, indice) => (
        <button
          key={tab.etiqueta}
          type="button"
          role="tab"
          aria-selected={indice === 0}
          className={`ux08f-tab${indice === 0 ? ' ux08f-tab--activo' : ''}`}
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

export function FichaColaborador() {
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
              <Tabs />
              <Contrato />
              <ResumenDerecha />
            </section>
          </div>
        </div>
        <PanelLateral iconoAcciones="edit" iconoAccesos={null} iconoEventos="expand_more" />
      </div>
      <Pie />
    </div>
  )
}
