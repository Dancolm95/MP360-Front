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
  DuracionAplicable,
  EstadoRequerimiento,
  FiltrosBandeja,
  OrdenBandeja,
  PaginaRequerimientos,
  ResumenRequerimiento,
  ResultadoConsultaBandeja,
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
  formularioDesdeFiltros,
  hayFiltrosActivos,
  puestosDisponibles,
  siguienteOrden,
  subareasDisponibles,
  validarPeriodo,
  type EstadoFiltrosFormulario,
} from './filtros'
import type { ContextoBandeja, SeleccionRequerimiento } from '../state'

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

type DestinoFoco =
  | { readonly tipo: 'orden'; readonly campo: CampoOrdenBandeja }
  | { readonly tipo: 'paginacion'; readonly sentido: 'siguiente' | 'anterior' }

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

function esControlInteractivo(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    target.closest('button, a, input, select, textarea') !== null
  )
}

function FilaRequerimiento({
  fila,
  onSeleccionar,
  onEditar,
  onCancelar,
}: {
  readonly fila: ResumenRequerimiento
  readonly onSeleccionar?: (fila: ResumenRequerimiento) => void
  readonly onEditar?: (fila: ResumenRequerimiento) => void
  readonly onCancelar?: (fila: ResumenRequerimiento) => void
}) {
  const interactiva = onSeleccionar !== undefined
  const abrir = () => onSeleccionar?.(fila)
  const id = String(fila.id)
  const accionesPermitidas = fila.autorizacion.accionesPermitidas
  const puedeEditar = onEditar !== undefined && accionesPermitidas.includes('editar')
  const puedeCancelar =
    onCancelar !== undefined && accionesPermitidas.includes('cancelar')
  const muestraAcciones = onSeleccionar !== undefined || puedeEditar || puedeCancelar

  return (
    <tr
      // El estilo de foco visible (`tr:focus-visible`) queda para la
      // integración (T-CORE-09); aquí solo se garantiza el foco operable.
      tabIndex={interactiva ? 0 : undefined}
      aria-label={interactiva ? `Abrir requerimiento ${id}` : undefined}
      aria-keyshortcuts={interactiva ? 'Enter Space' : undefined}
      data-requerimiento={interactiva ? id : undefined}
      onClick={
        interactiva
          ? (evento) => {
              if (esControlInteractivo(evento.target)) return
              abrir()
            }
          : undefined
      }
      onKeyDown={
        interactiva
          ? (evento) => {
              if (evento.target !== evento.currentTarget) return
              if (evento.key !== 'Enter' && evento.key !== ' ') return
              evento.preventDefault()
              abrir()
            }
          : undefined
      }
    >
      {COLUMNAS.map(({ campo }) => (
        <td key={campo}>{renderCelda(fila, campo)}</td>
      ))}
      {muestraAcciones ? (
        <td>
          <div className="rrhh-tray__acciones">
            {onSeleccionar ? (
              <button
                type="button"
                aria-label={`Detalle requerimiento ${id}`}
                onClick={abrir}
              >
                Detalle
              </button>
            ) : null}
            {puedeEditar ? (
              <button
                type="button"
                aria-label={`Editar requerimiento ${id}`}
                onClick={() => onEditar?.(fila)}
              >
                Editar
              </button>
            ) : null}
            {puedeCancelar ? (
              <button
                type="button"
                aria-label={`Cancelar requerimiento ${id}`}
                onClick={() => onCancelar?.(fila)}
              >
                Cancelar
              </button>
            ) : null}
          </div>
        </td>
      ) : null}
    </tr>
  )
}

export interface BandejaRequerimientosProps {
  readonly port: BandejaRequerimientosPort
  readonly catalogos: CatalogosRequerimientos
  /** El contrato de catálogos no expone la lista de solicitantes; la aporta el consumidor. */
  readonly solicitantes?: readonly Usuario[]
  readonly tamanoPaginaInicial: number
  /** Tamaños que permite el consumidor. Si falta o solo hay uno, no se muestra el selector. */
  readonly tamanosPagina?: readonly number[]
  /**
   * Consulta previa que se repinta y se vuelve a pedir al montar. Para restaurar
   * un contexto distinto con la bandeja ya montada, remóntala (por ejemplo con
   * `key`); no se reaplica en caliente para no pisar lo que el usuario edita.
   */
  readonly contextoInicial?: ContextoBandeja
  /** Se invoca con la consulta aplicada cuando cambia por aplicar, ordenar o paginar. */
  readonly onContextoCambia?: (contexto: ContextoBandeja) => void
  /**
   * Habilita la fila como disparador del detalle. Sin consumidor, las filas no
   * son interactivas ni anuncian una navegación inexistente.
   */
  readonly onAbrirDetalle?: (seleccion: SeleccionRequerimiento) => void
  /**
   * Acciones de bandeja y de fila. Sin consumidor no se muestran ni se anuncia
   * un destino inexistente. La visibilidad por capacidad la decide el backend:
   * «Nuevo» exige «crear» de la bandeja; «Editar»/«Cancelar» exigen las
   * acciones de la fila; «Detalle» reutiliza `onAbrirDetalle` y aparece en toda
   * fila visible.
   */
  readonly onNuevo?: () => void
  readonly onEditar?: (seleccion: SeleccionRequerimiento) => void
  readonly onCancelar?: (seleccion: SeleccionRequerimiento) => void
}

function ValorAusente() {
  return (
    <span className="rrhh-tray__ausente">
      —<span className="sr-only"> Sin dato</span>
    </span>
  )
}

const AVISO_DURACION = 'La fecha objetivo se calcula al aprobar.'

function DuracionCelda({ duracion }: { readonly duracion: DuracionAplicable }) {
  return (
    <span className="rrhh-tray__duracion">
      <span>
        {duracion.diasHabiles === null
          ? 'Plazo pendiente de definir'
          : `${duracion.diasHabiles} días hábiles`}
      </span>
      <span className="rrhh-tray__duracion-aviso">{AVISO_DURACION}</span>
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
      if (fila.fechaObjetivo) return formatearFecha(fila.fechaObjetivo)
      return fila.duracionAplicable ? (
        <DuracionCelda duracion={fila.duracionAplicable} />
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
  readonly onSeleccionar?: (fila: ResumenRequerimiento) => void
  readonly onEditar?: (fila: ResumenRequerimiento) => void
  readonly onCancelar?: (fila: ResumenRequerimiento) => void
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
  onSeleccionar,
  onEditar,
  onCancelar,
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
  const hayAccionesFila =
    onSeleccionar !== undefined || onEditar !== undefined || onCancelar !== undefined

  return (
    <>
      <p role="status" aria-live="polite" className="rrhh-tray__resumen">
        {datos.total} {datos.total === 1 ? 'requerimiento' : 'requerimientos'}
      </p>
      <div className="rrhh-tray__tabla-contenedor">
        <table className="rrhh-tray__tabla">
          <caption className="sr-only">
            {onSeleccionar
              ? 'Requerimientos de personal. Pulsa Enter o Espacio sobre una fila para abrir su detalle.'
              : 'Requerimientos de personal'}
          </caption>
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
                      data-orden={campo}
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
              {hayAccionesFila ? (
                <th scope="col" className="sr-only">
                  Acciones
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {datos.elementos.map((fila) => (
              <FilaRequerimiento
                key={String(fila.id)}
                fila={fila}
                onSeleccionar={onSeleccionar}
                onEditar={onEditar}
                onCancelar={onCancelar}
              />
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
          data-paginacion="anterior"
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
          data-paginacion="siguiente"
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
  contextoInicial,
  onContextoCambia,
  onAbrirDetalle,
  onNuevo,
  onEditar,
  onCancelar,
}: BandejaRequerimientosProps) {
  const idBase = useId()
  const [filtros, setFiltros] = useState<EstadoFiltrosFormulario>(() =>
    formularioDesdeFiltros(contextoInicial?.filtros ?? {}),
  )
  const [errorPeriodo, setErrorPeriodo] = useState<string | null>(null)
  const [consulta, setConsulta] = useState<ConsultaBandeja>(
    () =>
      contextoInicial ?? crearConsulta({}, ORDEN_INICIAL, 1, tamanoPaginaInicial),
  )
  const [resultado, setResultado] = useState<EstadoResultado>({
    status: 'loading',
  })
  const solicitudRef = useRef(0)
  const seccionRef = useRef<HTMLElement>(null)
  const refDesde = useRef<HTMLInputElement>(null)
  const refHasta = useRef<HTMLInputElement>(null)
  /** El control accionado se desmonta durante la carga; se enfoca al volver. */
  const focoPendienteRef = useRef<DestinoFoco | null>(null)
  const onContextoCambiaRef = useRef(onContextoCambia)
  useEffect(() => {
    onContextoCambiaRef.current = onContextoCambia
  }, [onContextoCambia])
  const consultaPreviaRef = useRef<ConsultaBandeja | null>(null)
  useEffect(() => {
    const anterior = consultaPreviaRef.current
    consultaPreviaRef.current = consulta
    // El montaje (incluido el doble efecto de StrictMode) no emite: la consulta
    // inicial ya la aporta la persistencia. Solo una consulta distinta lo hace.
    if (anterior === null || anterior === consulta) return
    onContextoCambiaRef.current?.(consulta)
  }, [consulta])

  const cargar = useCallback(
    async (siguienteConsulta: ConsultaBandeja) => {
      const solicitud = ++solicitudRef.current
      setResultado({ status: 'loading' })

      let respuesta: ResultadoConsultaBandeja
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

  useEffect(() => {
    if (resultado.status !== 'ok') return
    if (resultado.datos.total === 0) return
    if (resultado.datos.elementos.length > 0) return
    if (consulta.paginacion.pagina <= 1) return

    // La página restaurada o vigente dejó de existir (el total cambió). La
    // primera siempre es válida con resultados; el contexto se vuelve a pedir.
    setConsulta({
      ...consulta,
      paginacion: { ...consulta.paginacion, pagina: 1 },
    })
  }, [consulta, resultado])

  useEffect(() => {
    const destino = focoPendienteRef.current
    if (!destino || resultado.status === 'loading') return
    if (resultado.status !== 'ok') {
      focoPendienteRef.current = null
      return
    }

    focoPendienteRef.current = null
    const seccion = seccionRef.current
    const selector =
      destino.tipo === 'orden'
        ? `[data-orden="${destino.campo}"]`
        : `[data-paginacion="${destino.sentido}"]`
    const control = seccion?.querySelector<HTMLButtonElement>(selector)
    if (control && !control.disabled) {
      control.focus()
      return
    }
    if (destino.tipo === 'paginacion') {
      const contrario =
        destino.sentido === 'siguiente' ? 'anterior' : 'siguiente'
      seccion
        ?.querySelector<HTMLButtonElement>(`[data-paginacion="${contrario}"]`)
        ?.focus()
    }
  }, [resultado])

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
    if (campo === 'desde' || campo === 'hasta') setErrorPeriodo(null)
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
      // El periodo es una pareja: si falta un extremo, el foco va al que falta.
      const primerCampo =
        filtros.desde === ''
          ? refDesde
          : filtros.hasta === ''
            ? refHasta
            : refDesde
      primerCampo.current?.focus()
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
    focoPendienteRef.current = { tipo: 'orden', campo }
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
    focoPendienteRef.current = {
      tipo: 'paginacion',
      sentido: pagina < consulta.paginacion.pagina ? 'anterior' : 'siguiente',
    }
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

  const seleccionarFila = (fila: ResumenRequerimiento) => {
    onAbrirDetalle?.({ requerimiento: fila, contexto: consulta })
  }

  const editarFila = (fila: ResumenRequerimiento) => {
    onEditar?.({ requerimiento: fila, contexto: consulta })
  }

  const cancelarFila = (fila: ResumenRequerimiento) => {
    onCancelar?.({ requerimiento: fila, contexto: consulta })
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
  const idErrorPeriodo = `${idBase}-error-periodo`
  const idTamano = `${idBase}-tamano`

  return (
    <section
      ref={seccionRef}
      className="rrhh-tray"
      aria-labelledby={idTitulo}
    >
      <h2 id={idTitulo}>Bandeja de requerimientos</h2>

      {resultado.status === 'ok' &&
      onNuevo &&
      resultado.datos.capacidades.accionesPermitidas.includes('crear') ? (
        <div className="rrhh-tray__acciones">
          <button type="button" onClick={() => onNuevo()}>
            Nuevo
          </button>
        </div>
      ) : null}

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
                ref={refDesde}
                aria-invalid={errorPeriodo ? true : undefined}
                aria-describedby={
                  errorPeriodo
                    ? `${idAyudaPeriodo} ${idErrorPeriodo}`
                    : idAyudaPeriodo
                }
                onChange={(evento) => cambiarCampo('desde', evento.target.value)}
              />
            </div>
            <div className="rrhh-tray__campo">
              <label htmlFor={idHasta}>Aprobado hasta</label>
              <input
                id={idHasta}
                type="date"
                value={filtros.hasta}
                ref={refHasta}
                aria-invalid={errorPeriodo ? true : undefined}
                aria-describedby={
                  errorPeriodo
                    ? `${idAyudaPeriodo} ${idErrorPeriodo}`
                    : idAyudaPeriodo
                }
                onChange={(evento) => cambiarCampo('hasta', evento.target.value)}
              />
            </div>
          </fieldset>
        </div>

        {errorPeriodo ? (
          <p
            id={idErrorPeriodo}
            role="alert"
            className="rrhh-tray__error-periodo"
          >
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
          onSeleccionar={onAbrirDetalle ? seleccionarFila : undefined}
          onEditar={onEditar ? editarFila : undefined}
          onCancelar={onCancelar ? cancelarFila : undefined}
          tamanosDisponibles={tamanosDisponibles}
          mostrarSelectorTamano={tamanosDisponibles.length > 1}
          idTamano={idTamano}
        />
      ) : null}
    </section>
  )
}
