'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import type { ContractError } from '../../../../shared'
import type {
  AreaId,
  BandejaRequerimientosPort,
  CampoOrdenBandeja,
  CatalogosRequerimientos,
  ConsultaBandeja,
  EstadoRequerimiento,
  FiltrosBandeja,
  OrdenBandeja,
  PaginaRequerimientos,
  ResumenRequerimiento,
  ResultadoBandeja,
  SubareaId,
  Usuario,
} from '../contracts'
import {
  ALERTA_LABELS,
  ESTADOS,
  ESTADO_LABELS,
  MOTIVOS,
  MOTIVO_LABELS,
  formatearFecha,
} from './formato'
import {
  FILTROS_FORMULARIO_VACIOS,
  ORDEN_INICIAL,
  construirFiltros,
  crearConsulta,
  hayFiltrosActivos,
  puestosDisponibles,
  siguienteOrden,
  subareasDisponibles,
  validarPeriodo,
  type EstadoFiltrosFormulario,
} from './filtros'

type EstadoResultado =
  | { readonly status: 'loading' }
  | { readonly status: 'ok'; readonly datos: PaginaRequerimientos }
  | { readonly status: 'forbidden' }
  | { readonly status: 'sesion-finalizada' }
  | { readonly status: 'error'; readonly error: ContractError }

interface DefinicionColumna {
  readonly campo: CampoOrdenBandeja
  readonly etiqueta: string
}

const COLUMNAS: readonly DefinicionColumna[] = [
  { campo: 'id', etiqueta: 'ID' },
  { campo: 'fecha-creacion', etiqueta: 'Fecha de creación' },
  { campo: 'motivo', etiqueta: 'Motivo' },
  { campo: 'empresa', etiqueta: 'Empresa' },
  { campo: 'puesto', etiqueta: 'Puesto' },
  { campo: 'solicitadas', etiqueta: 'Solicitadas' },
  { campo: 'cubiertas', etiqueta: 'Cubiertas' },
  { campo: 'pendientes', etiqueta: 'Pendientes' },
  { campo: 'estado', etiqueta: 'Estado' },
  { campo: 'fecha-objetivo', etiqueta: 'Fecha objetivo' },
  { campo: 'responsable', etiqueta: 'Responsable' },
]

const ERROR_LECTURA: ContractError = {
  message: 'No se pudieron cargar los requerimientos.',
  retryable: true,
}

export interface BandejaRequerimientosProps {
  readonly port: BandejaRequerimientosPort
  readonly catalogos: CatalogosRequerimientos
  /** El contrato de catálogos no expone la lista de solicitantes; la aporta el consumidor. */
  readonly solicitantes?: readonly Usuario[]
  readonly tamanoPaginaInicial: number
  /** Tamaños que permite el consumidor. Si falta o solo hay uno, no se muestra el selector. */
  readonly tamanosPagina?: readonly number[]
}

function ValorAusente() {
  return (
    <span className="rrhh-tray__ausente">
      —<span className="sr-only"> Sin dato</span>
    </span>
  )
}

function EstadoConAlerta({ fila }: { readonly fila: ResumenRequerimiento }) {
  return (
    <span className="rrhh-tray__estado-contenedor">
      <span className={`rrhh-tray__estado rrhh-tray__estado--${fila.estado}`}>
        {ESTADO_LABELS[fila.estado]}
      </span>
      {fila.alerta ? (
        <span className={`rrhh-tray__alerta rrhh-tray__alerta--${fila.alerta.nivel}`}>
          <span aria-hidden="true">▲</span> Alerta: {ALERTA_LABELS[fila.alerta.nivel]}
        </span>
      ) : null}
    </span>
  )
}

function renderCelda(
  fila: ResumenRequerimiento,
  campo: CampoOrdenBandeja,
): ReactNode {
  switch (campo) {
    case 'id':
      return String(fila.id)
    case 'fecha-creacion':
      return formatearFecha(fila.fechaCreacion)
    case 'motivo':
      return fila.motivo ? MOTIVO_LABELS[fila.motivo] : <ValorAusente />
    case 'empresa':
      return fila.empresa ? fila.empresa.nombre : <ValorAusente />
    case 'puesto':
      return fila.puesto ? fila.puesto.nombre : <ValorAusente />
    case 'solicitadas':
      return fila.solicitadas ?? <ValorAusente />
    case 'cubiertas':
      return fila.cubiertas ?? <ValorAusente />
    case 'pendientes':
      return fila.pendientes ?? <ValorAusente />
    case 'estado':
      return <EstadoConAlerta fila={fila} />
    case 'fecha-objetivo':
      return fila.fechaObjetivo ? (
        formatearFecha(fila.fechaObjetivo)
      ) : (
        <span className="rrhh-tray__sin-fecha">Sin fecha</span>
      )
    case 'responsable':
      return fila.responsable ? (
        fila.responsable.nombre
      ) : (
        <span className="rrhh-tray__sin-asignar">Sin asignar</span>
      )
  }
}

interface ResultadoProps {
  readonly datos: PaginaRequerimientos
  readonly filtros: FiltrosBandeja
  readonly orden: OrdenBandeja
  readonly onOrdenar: (campo: CampoOrdenBandeja) => void
  readonly onPagina: (pagina: number) => void
  readonly onTamano: (tamano: number) => void
  readonly tamanosDisponibles: readonly number[]
  readonly mostrarSelectorTamano: boolean
  readonly idTamano: string
}

function ResultadoBandeja({
  datos,
  filtros,
  orden,
  onOrdenar,
  onPagina,
  onTamano,
  tamanosDisponibles,
  mostrarSelectorTamano,
  idTamano,
}: ResultadoProps) {
  if (datos.elementos.length === 0) {
    const mensaje =
      datos.total > 0
        ? 'No hay requerimientos en esta página.'
        : hayFiltrosActivos(filtros)
          ? 'No hay requerimientos que coincidan con los filtros.'
          : 'No hay requerimientos registrados.'
    return (
      <p role="status" aria-live="polite" className="rrhh-tray__vacio">
        {mensaje}
      </p>
    )
  }

  const totalPaginas = Math.max(1, Math.ceil(datos.total / datos.tamanoPagina))

  return (
    <>
      <p role="status" aria-live="polite" className="rrhh-tray__resumen">
        {datos.total} {datos.total === 1 ? 'requerimiento' : 'requerimientos'} ·
        Página {datos.pagina} de {totalPaginas}
      </p>
      <div className="rrhh-tray__tabla-contenedor">
        <table className="rrhh-tray__tabla">
          <caption className="sr-only">Requerimientos de personal</caption>
          <thead>
            <tr>
              {COLUMNAS.map(({ campo, etiqueta }) => {
                const esActual = orden.campo === campo
                const ariaSort = esActual
                  ? orden.direccion === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : 'none'
                return (
                  <th key={campo} scope="col" aria-sort={ariaSort}>
                    <button
                      type="button"
                      className="rrhh-tray__orden"
                      aria-label={`Ordenar por ${etiqueta}`}
                      onClick={() => onOrdenar(campo)}
                    >
                      {etiqueta}
                      <span className="rrhh-tray__orden-icono" aria-hidden="true">
                        {esActual ? (orden.direccion === 'asc' ? '▲' : '▼') : '↕'}
                      </span>
                    </button>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {datos.elementos.map((fila) => (
              <tr key={String(fila.id)}>
                {COLUMNAS.map(({ campo }) => (
                  <td key={campo}>{renderCelda(fila, campo)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <nav className="rrhh-tray__paginacion" aria-label="Paginación de requerimientos">
        <button
          type="button"
          onClick={() => onPagina(datos.pagina - 1)}
          disabled={datos.pagina <= 1}
          aria-label="Página anterior"
        >
          Anterior
        </button>
        <p>
          Página {datos.pagina} de {totalPaginas}
        </p>
        <button
          type="button"
          onClick={() => onPagina(datos.pagina + 1)}
          disabled={datos.pagina >= totalPaginas}
          aria-label="Página siguiente"
        >
          Siguiente
        </button>
        {mostrarSelectorTamano ? (
          <span className="rrhh-tray__tamano">
            <label htmlFor={idTamano}>Elementos por página</label>
            <select
              id={idTamano}
              value={String(datos.tamanoPagina)}
              onChange={(evento) => onTamano(Number(evento.target.value))}
            >
              {tamanosDisponibles.map((tamano) => (
                <option key={tamano} value={tamano}>
                  {tamano}
                </option>
              ))}
            </select>
          </span>
        ) : null}
      </nav>
    </>
  )
}

export function BandejaRequerimientos({
  port,
  catalogos,
  solicitantes = [],
  tamanoPaginaInicial,
  tamanosPagina = [],
}: BandejaRequerimientosProps) {
  const idBase = useId()
  const [filtros, setFiltros] = useState<EstadoFiltrosFormulario>(
    FILTROS_FORMULARIO_VACIOS,
  )
  const [errorPeriodo, setErrorPeriodo] = useState<string | null>(null)
  const [consulta, setConsulta] = useState<ConsultaBandeja>(() =>
    crearConsulta({}, ORDEN_INICIAL, 1, tamanoPaginaInicial),
  )
  const [resultado, setResultado] = useState<EstadoResultado>({
    status: 'loading',
  })
  const solicitudRef = useRef(0)

  const cargar = useCallback(
    async (siguienteConsulta: ConsultaBandeja) => {
      const solicitud = ++solicitudRef.current
      setResultado({ status: 'loading' })

      let respuesta: ResultadoBandeja
      try {
        respuesta = await port.consultar(siguienteConsulta)
      } catch {
        if (solicitud === solicitudRef.current) {
          setResultado({ status: 'error', error: ERROR_LECTURA })
        }
        return
      }
      if (solicitud !== solicitudRef.current) return

      if (respuesta.status === 'ok') {
        setResultado({ status: 'ok', datos: respuesta.datos })
      } else if (respuesta.status === 'forbidden') {
        setResultado({ status: 'forbidden' })
      } else if (respuesta.status === 'sesion-finalizada') {
        setResultado({ status: 'sesion-finalizada' })
      } else {
        setResultado({ status: 'error', error: respuesta.error })
      }
    },
    [port],
  )

  useEffect(() => {
    void cargar(consulta)
  }, [cargar, consulta])

  useEffect(
    () => () => {
      solicitudRef.current += 1
    },
    [],
  )

  const cambiarCampo = (
    campo: keyof EstadoFiltrosFormulario,
    valor: string,
  ) => {
    setFiltros((previo) => {
      const siguiente = { ...previo, [campo]: valor } as EstadoFiltrosFormulario

      if (campo === 'area') {
        const area = valor as AreaId | ''
        if (
          siguiente.subarea &&
          !subareasDisponibles(catalogos, area).some(
            (subarea) => subarea.id === siguiente.subarea,
          )
        ) {
          siguiente.subarea = ''
        }
        if (
          siguiente.puesto &&
          !puestosDisponibles(catalogos, area, siguiente.subarea).some(
            (puesto) => puesto.id === siguiente.puesto,
          )
        ) {
          siguiente.puesto = ''
        }
      }

      if (campo === 'subarea') {
        const subarea = valor as SubareaId | ''
        if (
          siguiente.puesto &&
          !puestosDisponibles(catalogos, siguiente.area, subarea).some(
            (puesto) => puesto.id === siguiente.puesto,
          )
        ) {
          siguiente.puesto = ''
        }
      }

      return siguiente
    })
  }

  const aplicarFiltros = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    const error = validarPeriodo(filtros)
    if (error) {
      setErrorPeriodo(error)
      return
    }
    setErrorPeriodo(null)
    setConsulta({
      filtros: construirFiltros(filtros),
      orden: consulta.orden,
      paginacion: {
        pagina: 1,
        tamanoPagina: consulta.paginacion.tamanoPagina,
      },
    })
  }

  const limpiarFiltros = () => {
    setFiltros({ ...FILTROS_FORMULARIO_VACIOS })
    setErrorPeriodo(null)
    setConsulta({
      filtros: {},
      orden: consulta.orden,
      paginacion: {
        pagina: 1,
        tamanoPagina: consulta.paginacion.tamanoPagina,
      },
    })
  }

  const ordenarPor = (campo: CampoOrdenBandeja) => {
    setConsulta({
      ...consulta,
      orden: siguienteOrden(consulta.orden, campo),
      paginacion: {
        pagina: 1,
        tamanoPagina: consulta.paginacion.tamanoPagina,
      },
    })
  }

  const irAPagina = (pagina: number) => {
    setConsulta({
      ...consulta,
      paginacion: {
        pagina,
        tamanoPagina: consulta.paginacion.tamanoPagina,
      },
    })
  }

  const cambiarTamano = (tamanoPagina: number) => {
    setConsulta({ ...consulta, paginacion: { pagina: 1, tamanoPagina } })
  }

  const reintentar = () => {
    void cargar(consulta)
  }

  const opcionesMotivo =
    catalogos.motivos.length > 0
      ? catalogos.motivos
      : MOTIVOS.map((motivo) => ({
          motivo,
          etiqueta: MOTIVO_LABELS[motivo],
        }))

  const tamanosDisponibles = tamanosPagina.includes(
    consulta.paginacion.tamanoPagina,
  )
    ? tamanosPagina
    : [consulta.paginacion.tamanoPagina, ...tamanosPagina]

  const idTitulo = `${idBase}-titulo`
  const idEstado = `${idBase}-estado`
  const idMotivo = `${idBase}-motivo`
  const idEmpresa = `${idBase}-empresa`
  const idArea = `${idBase}-area`
  const idSubarea = `${idBase}-subarea`
  const idPuesto = `${idBase}-puesto`
  const idSolicitante = `${idBase}-solicitante`
  const idDesde = `${idBase}-desde`
  const idHasta = `${idBase}-hasta`
  const idAyudaPeriodo = `${idBase}-ayuda-periodo`
  const idTamano = `${idBase}-tamano`

  return (
    <section className="rrhh-tray" aria-labelledby={idTitulo}>
      <h2 id={idTitulo}>Bandeja de requerimientos</h2>

      <form
        className="rrhh-tray__filtros"
        aria-label="Filtros de la bandeja de requerimientos"
        onSubmit={aplicarFiltros}
        noValidate
      >
        <div className="rrhh-tray__campos">
          <div className="rrhh-tray__campo">
            <label htmlFor={idEstado}>Estado</label>
            <select
              id={idEstado}
              value={filtros.estado}
              onChange={(evento) =>
                cambiarCampo(
                  'estado',
                  evento.target.value as EstadoRequerimiento | '',
                )
              }
            >
              <option value="">Todos los estados</option>
              {ESTADOS.map((estado) => (
                <option key={estado} value={estado}>
                  {ESTADO_LABELS[estado]}
                </option>
              ))}
            </select>
          </div>

          <div className="rrhh-tray__campo">
            <label htmlFor={idMotivo}>Motivo</label>
            <select
              id={idMotivo}
              value={filtros.motivo}
              onChange={(evento) => cambiarCampo('motivo', evento.target.value)}
            >
              <option value="">Todos los motivos</option>
              {opcionesMotivo.map(({ motivo, etiqueta }) => (
                <option key={motivo} value={motivo}>
                  {etiqueta}
                </option>
              ))}
            </select>
          </div>

          <div className="rrhh-tray__campo">
            <label htmlFor={idEmpresa}>Empresa</label>
            <select
              id={idEmpresa}
              value={filtros.empresa}
              onChange={(evento) => cambiarCampo('empresa', evento.target.value)}
            >
              <option value="">Todas las empresas</option>
              {catalogos.empresas.map((empresa) => (
                <option key={empresa.id} value={empresa.id}>
                  {empresa.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="rrhh-tray__campo">
            <label htmlFor={idArea}>Área</label>
            <select
              id={idArea}
              value={filtros.area}
              onChange={(evento) => cambiarCampo('area', evento.target.value)}
            >
              <option value="">Todas las áreas</option>
              {catalogos.areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="rrhh-tray__campo">
            <label htmlFor={idSubarea}>Subárea</label>
            <select
              id={idSubarea}
              value={filtros.subarea}
              onChange={(evento) => cambiarCampo('subarea', evento.target.value)}
            >
              <option value="">Todas las subáreas</option>
              {subareasDisponibles(catalogos, filtros.area).map((subarea) => (
                <option key={subarea.id} value={subarea.id}>
                  {subarea.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="rrhh-tray__campo">
            <label htmlFor={idPuesto}>Puesto</label>
            <select
              id={idPuesto}
              value={filtros.puesto}
              onChange={(evento) => cambiarCampo('puesto', evento.target.value)}
            >
              <option value="">Todos los puestos</option>
              {puestosDisponibles(catalogos, filtros.area, filtros.subarea).map(
                (puesto) => (
                  <option key={puesto.id} value={puesto.id}>
                    {puesto.nombre}
                  </option>
                ),
              )}
            </select>
          </div>

          <div className="rrhh-tray__campo">
            <label htmlFor={idSolicitante}>Solicitante</label>
            <select
              id={idSolicitante}
              value={filtros.solicitante}
              onChange={(evento) =>
                cambiarCampo('solicitante', evento.target.value)
              }
            >
              <option value="">Todos los solicitantes</option>
              {solicitantes.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nombre}
                </option>
              ))}
            </select>
          </div>

          <fieldset className="rrhh-tray__periodo">
            <legend>Periodo de aprobación</legend>
            <p id={idAyudaPeriodo} className="rrhh-tray__ayuda">
              Solo coincide con requerimientos que tengan fecha de aprobación.
            </p>
            <div className="rrhh-tray__campo">
              <label htmlFor={idDesde}>Aprobado desde</label>
              <input
                id={idDesde}
                type="date"
                value={filtros.desde}
                aria-describedby={idAyudaPeriodo}
                onChange={(evento) => cambiarCampo('desde', evento.target.value)}
              />
            </div>
            <div className="rrhh-tray__campo">
              <label htmlFor={idHasta}>Aprobado hasta</label>
              <input
                id={idHasta}
                type="date"
                value={filtros.hasta}
                aria-describedby={idAyudaPeriodo}
                onChange={(evento) => cambiarCampo('hasta', evento.target.value)}
              />
            </div>
          </fieldset>
        </div>

        {errorPeriodo ? (
          <p role="alert" className="rrhh-tray__error-periodo">
            {errorPeriodo}
          </p>
        ) : null}

        <div className="rrhh-tray__acciones">
          <button type="submit">Aplicar filtros</button>
          <button type="button" onClick={limpiarFiltros}>
            Limpiar filtros
          </button>
        </div>
      </form>

      {resultado.status === 'loading' ? (
        <p role="status" aria-live="polite" className="rrhh-tray__carga">
          Cargando requerimientos…
        </p>
      ) : null}

      {resultado.status === 'forbidden' ? (
        <div role="alert" className="rrhh-tray__error">
          <h3>Sin permisos</h3>
          <p>No tienes acceso a la bandeja de requerimientos.</p>
        </div>
      ) : null}

      {resultado.status === 'sesion-finalizada' ? (
        <div role="alert" className="rrhh-tray__error">
          <h3>La sesión finalizó</h3>
          <p>Vuelve a iniciar sesión para consultar los requerimientos.</p>
        </div>
      ) : null}

      {resultado.status === 'error' ? (
        <div role="alert" className="rrhh-tray__error">
          <h3>No se pudieron cargar los requerimientos</h3>
          <p>{resultado.error.message}</p>
          {resultado.error.retryable ? (
            <button type="button" onClick={reintentar}>
              Reintentar
            </button>
          ) : null}
        </div>
      ) : null}

      {resultado.status === 'ok' ? (
        <ResultadoBandeja
          datos={resultado.datos}
          filtros={consulta.filtros}
          orden={consulta.orden}
          onOrdenar={ordenarPor}
          onPagina={irAPagina}
          onTamano={cambiarTamano}
          tamanosDisponibles={tamanosDisponibles}
          mostrarSelectorTamano={tamanosDisponibles.length > 1}
          idTamano={idTamano}
        />
      ) : null}
    </section>
  )
}
