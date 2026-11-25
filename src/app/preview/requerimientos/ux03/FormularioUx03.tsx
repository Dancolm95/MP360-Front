'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import type {
  CatalogosRequerimientos,
  ColaboradorReemplazo,
  ComandosRequerimientosPort,
  ConfirmacionEnvio,
  DetalleRequerimientoBorrador,
  InstanteISO,
  RequerimientoId,
} from '../../../../modules/rrhh/requerimientos/contracts'
import type {
  CampoFormulario,
  FormularioRequerimientoInput,
} from '../../../../modules/rrhh/requerimientos/model'
import { crearFormularioVacio } from '../../../../modules/rrhh/requerimientos/model'
import type {
  DecisionDescarte,
  EdicionEnCurso,
  ErrorRevision,
  EstadoOperacion,
  PasoEdicionRevision,
  ResultadoOperacion,
  SolicitudVersionada,
} from '../../../../modules/rrhh/requerimientos/review'
import {
  crearEdicionEnCurso,
  crearEstadoEdicion,
  enviarAprobacion,
  guardarBorradorEnCurso,
  resolverDescarte,
  revisar,
  solicitarCancelarEdicion,
  volverAEditar,
} from '../../../../modules/rrhh/requerimientos/review'
import { FormularioRequerimiento } from '../../../../modules/rrhh/requerimientos/form'
import styles from './FormularioUx03.module.css'

export interface FormularioUx03Props {
  readonly catalogos: CatalogosRequerimientos
  /** Colaboradores seleccionables para «Colaborador a reemplazar». */
  readonly colaboradores?: readonly ColaboradorReemplazo[]
  readonly valorInicial?: FormularioRequerimientoInput
  /** Plazo administrativo ya fijado por RR. HH.; si falta, queda pendiente. */
  readonly plazoAdministrativoDias?: number | null
  readonly onCancelar?: () => void
  /** El preview inyecta el mock de envío; el componente no trae uno por defecto. */
  readonly puerto: ComandosRequerimientosPort
  readonly solicitud?: SolicitudVersionada
  /** 'modal' (por defecto) muestra el velo de pantalla completa; 'embebido' ocupa solo su contenedor. */
  readonly variante?: 'modal' | 'embebido'
}

const SOLICITUD_PREVIEW: SolicitudVersionada = {
  requerimientoId: 'req-preview' as RequerimientoId,
  version: 1,
}

const FECHA_PREVIEW = '2026-11-24T00:00:00Z' as InstanteISO

const FOCALIZABLES =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

async function noDisponible(): Promise<never> {
  throw new Error('Operación no disponible en la vista previa')
}

/** Mock de la vista previa: confirma el envío sin backend ni persistencia real. */
export function crearPuertoPreview(
  catalogos: CatalogosRequerimientos,
): ComandosRequerimientosPort {
  return {
    crear: noDisponible,
    // Mock explícito de la vista previa: no persiste nada; devuelve el mismo
    // borrador recibido con la versión incrementada para permitir reintentos.
    guardarBorrador: async (comando) => {
      const version = comando.version + 1
      const datos: DetalleRequerimientoBorrador = {
        id: comando.requerimientoId,
        version,
        estado: 'borrador',
        fechaCreacion: FECHA_PREVIEW,
        historial: [],
        autorizacion: {
          requerimientoId: comando.requerimientoId,
          version,
          capacidades: [],
          accionesPermitidas: [],
        },
        borrador: comando.borrador,
        plazo: null,
        cobertura: null,
        remuneracionPreviaAlta: null,
        procesoSeleccion: null,
      }
      return { status: 'confirmado', datos }
    },
    enviarAprobacion: async (comando) => {
      const empresa = catalogos.empresas.find(
        (item) => item.id === comando.contenido.empresaId,
      )
      const puesto = catalogos.puestos.find(
        (item) => item.id === comando.contenido.puestoId,
      )
      if (!empresa || !puesto) {
        return {
          status: 'error',
          error: {
            message: 'No se pudo componer la confirmación de la vista previa.',
            retryable: false,
          },
        }
      }

      const responsable =
        catalogos.usuariosProximaTarea.find(
          (item) => item.id === comando.contenido.usuarioProximaTareaId,
        ) ?? null
      const solicitadas = comando.contenido.vacantes ?? 0
      const id = comando.requerimientoId
      const version = comando.version + 1
      const datos: ConfirmacionEnvio = {
        id,
        resumen: {
          id,
          version,
          fechaCreacion: FECHA_PREVIEW,
          estado: 'pendiente-aprobacion',
          motivo: comando.contenido.motivo ?? 'nueva-vacante',
          empresa,
          puesto,
          solicitadas,
          cubiertas: 0,
          pendientes: solicitadas,
          fechaObjetivo: null,
          duracionAplicable: null,
          responsable,
          alerta: null,
          autorizacion: {
            requerimientoId: id,
            version,
            capacidades: [],
            accionesPermitidas: [],
          },
        },
        responsable,
        estado: 'pendiente-aprobacion',
      }
      return { status: 'confirmado', datos }
    },
    aprobar: noDisponible,
    observar: noDisponible,
    cancelar: noDisponible,
    fijarPlazoAdministrativo: noDisponible,
    ajustarPlazoAdministrativo: noDisponible,
    abrirProcesoSeleccion: noDisponible,
    solicitarReversionCobertura: noDisponible,
  }
}

function ResumenItem({
  etiqueta,
  valor,
}: {
  readonly etiqueta: string
  readonly valor: ReactNode
}) {
  return (
    <div className={styles['rrhh-form__resumen-item']}>
      <span className={styles['rrhh-form__resumen-item-etiqueta']}>
        {etiqueta}
      </span>
      <span className={styles['rrhh-form__resumen-item-valor']}>{valor}</span>
    </div>
  )
}

function ListaErrores({
  errores,
  titulo,
}: {
  readonly errores: readonly ErrorRevision[]
  readonly titulo: string
}) {
  return (
    <div className={styles['rrhh-form__errores']} role="alert">
      <p className={styles['rrhh-form__errores-titulo']}>{titulo}</p>
      <ul className={styles['rrhh-form__errores-lista']}>
        {errores.map((error) => (
          <li key={`${error.campo}-${error.codigo}`}>
            <strong>{error.etiqueta}:</strong> {error.mensaje}
          </li>
        ))}
      </ul>
    </div>
  )
}

function IndicadorPasos({ paso }: { readonly paso: PasoEdicionRevision }) {
  const datosCompletados = paso !== 'edicion'
  const revisionActiva = paso === 'revision' || paso === 'confirmacion'
  return (
    <ol className={styles['rrhh-form__pasos']}>
      <li
        className={styles['rrhh-form__paso']}
        aria-current={paso === 'edicion' ? 'step' : undefined}
      >
        <span
          className={`${styles['rrhh-form__paso-circulo']} ${
            datosCompletados
              ? styles['rrhh-form__paso-circulo--completado']
              : styles['rrhh-form__paso-circulo--activo']
          }`}
          aria-hidden="true"
        >
          {datosCompletados ? '✓' : '1'}
        </span>
        <span
          className={`${styles['rrhh-form__paso-etiqueta']} ${
            paso === 'edicion' ? styles['rrhh-form__paso-etiqueta--activo'] : ''
          }`}
        >
          Datos del requerimiento
        </span>
      </li>
      <li className={styles['rrhh-form__paso-conector']} aria-hidden="true" />
      <li
        className={styles['rrhh-form__paso']}
        aria-current={revisionActiva ? 'step' : undefined}
      >
        <span
          className={`${styles['rrhh-form__paso-circulo']} ${
            revisionActiva
              ? styles['rrhh-form__paso-circulo--activo']
              : styles['rrhh-form__paso-circulo--inactivo']
          }`}
          aria-hidden="true"
        >
          2
        </span>
        <span
          className={`${styles['rrhh-form__paso-etiqueta']} ${
            revisionActiva ? styles['rrhh-form__paso-etiqueta--activo'] : ''
          }`}
        >
          Revisión y envío
        </span>
      </li>
    </ol>
  )
}

function mensajeOperacion(operacion: EstadoOperacion): string | null {
  switch (operacion.status) {
    case 'confirmado':
      return null
    case 'conflicto-version':
      return `La versión cambió (esperada ${operacion.conflicto.versionEsperada}, vigente ${operacion.conflicto.versionVigente}). Revisa los datos y vuelve a intentarlo.`
    case 'validacion':
      return operacion.errores
        .map((error) => `${error.etiqueta}: ${error.mensaje}`)
        .join(' · ')
    case 'sin-autorizacion':
      return 'No tienes autorización para enviar este requerimiento.'
    case 'estado-invalido':
      return `El requerimiento está en estado ${operacion.estadoActual} y no admite este envío.`
    case 'error-integracion':
      return operacion.error.error.message
    case 'error':
      return operacion.error.message
    case 'sesion-finalizada':
      return 'La sesión terminó. Vuelve a iniciar sesión para continuar.'
    case 'paso-invalido':
      return 'La acción no está disponible en el paso actual.'
    case 'revision-invalida':
      return 'La revisión tiene errores; corrige los datos antes de enviar.'
    case 'no-disponible':
      return operacion.accion === 'borrador'
        ? 'El guardado de borrador no está disponible en este entorno.'
        : 'El envío no está disponible en este entorno.'
  }
}

function erroresPorCampoDe(
  errores: readonly ErrorRevision[],
): Readonly<Partial<Record<CampoFormulario, string>>> {
  return errores.reduce<Partial<Record<CampoFormulario, string>>>(
    (acumulado, error) => {
      const previo = acumulado[error.campo]
      acumulado[error.campo] = previo
        ? `${previo} ${error.mensaje}`
        : error.mensaje
      return acumulado
    },
    {},
  )
}

function primerFocalizable(contenedor: HTMLElement | null): HTMLElement | null {
  return contenedor?.querySelector<HTMLElement>(FOCALIZABLES) ?? null
}

function ultimoFocalizable(contenedor: HTMLElement | null): HTMLElement | null {
  const elementos = contenedor?.querySelectorAll<HTMLElement>(FOCALIZABLES)
  return elementos && elementos.length > 0
    ? elementos[elementos.length - 1]
    : null
}

export function FormularioUx03({
  catalogos,
  colaboradores = [],
  valorInicial,
  plazoAdministrativoDias,
  onCancelar = () => {},
  puerto,
  solicitud,
  variante = 'modal',
}: FormularioUx03Props) {
  const idBase = useId()
  const contenedorRef = useRef<HTMLDivElement>(null)
  const descarteContenedorRef = useRef<HTMLDivElement>(null)
  const tituloRef = useRef<HTMLHeadingElement>(null)
  const descarteTituloRef = useRef<HTMLHeadingElement>(null)
  const revisionRef = useRef<HTMLHeadingElement>(null)
  const confirmacionRef = useRef<HTMLHeadingElement>(null)
  const disparadorDescarteRef = useRef<HTMLElement | null>(null)
  const primerRender = useRef(true)

  const [edicion, setEdicion] = useState<EdicionEnCurso>(() =>
    crearEdicionEnCurso(valorInicial ?? crearFormularioVacio(catalogos)),
  )
  const [erroresValidacion, setErroresValidacion] = useState<
    readonly ErrorRevision[]
  >([])
  const [enviando, setEnviando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [solicitudActual, setSolicitudActual] = useState<SolicitudVersionada>(
    solicitud ?? SOLICITUD_PREVIEW,
  )
  const [anuncio, setAnuncio] = useState('')
  const [avisoGuardado, setAvisoGuardado] = useState<string | null>(null)

  const modal = variante === 'modal'
  const estado = edicion.estado
  const paso = estado.paso

  const idTitulo = `${idBase}-titulo`
  const idResumen = `${idBase}-resumen`
  const idConfirmacion = `${idBase}-confirmacion`
  const idDescarte = `${idBase}-descarte`
  const idDescarteTexto = `${idBase}-descarte-texto`

  useEffect(() => {
    if (!modal) return
    const anterior =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    tituloRef.current?.focus()
    return () => anterior?.focus()
  }, [modal])

  useEffect(() => {
    if (primerRender.current) {
      primerRender.current = false
      return
    }
    if (!modal) return
    const destino =
      paso === 'revision'
        ? revisionRef.current
        : paso === 'confirmacion'
          ? confirmacionRef.current
          : tituloRef.current
    destino?.focus()
  }, [paso, modal])

  useEffect(() => {
    if (!edicion.descartePendiente) return
    descarteTituloRef.current?.focus()
  }, [edicion.descartePendiente])

  useEffect(() => {
    if (erroresValidacion.length === 0) return
    contenedorRef.current
      ?.querySelector<HTMLElement>('[aria-invalid="true"]')
      ?.focus()
  }, [erroresValidacion])

  const alCambiar = (valor: FormularioRequerimientoInput) => {
    setErroresValidacion([])
    setAvisoGuardado(null)
    setEdicion((actual) => ({
      ...actual,
      estado: crearEstadoEdicion(valor),
    }))
  }

  const continuar = () => {
    const resultado = revisar(estado, catalogos, {
      plazoAdministrativoDias,
      colaboradores,
    })
    if (!resultado.ok || resultado.estado.paso !== 'revision') return

    const revision = resultado.estado.revision
    if (!revision.puedeEnviar) {
      setErroresValidacion(revision.errores)
      return
    }

    setErroresValidacion([])
    setAvisoGuardado(null)
    setEdicion({ ...edicion, estado: resultado.estado })
    setAnuncio(
      'Paso 2 de 2: Revisión y envío. Revisa los datos antes de enviar.',
    )
  }

  const volver = () => {
    const resultado = volverAEditar(estado)
    if (!resultado.ok) return
    setAvisoGuardado(null)
    setEdicion({ ...edicion, estado: resultado.estado })
    setAnuncio('Paso 1 de 2: Datos del requerimiento.')
  }

  const adoptarVersionVigente = (operacion: EstadoOperacion) => {
    if (operacion.status !== 'conflicto-version') return
    setSolicitudActual({
      requerimientoId: operacion.conflicto.datosVigentes.id,
      version: operacion.conflicto.versionVigente,
    })
  }

  const enviar = async () => {
    if (estado.paso !== 'revision' || enviando) return
    setEnviando(true)
    try {
      const resultado: ResultadoOperacion = await enviarAprobacion(
        edicion.estado,
        solicitudActual,
        puerto,
      )
      if (
        resultado.operacion.status === 'confirmado' &&
        resultado.operacion.accion === 'envio'
      ) {
        const { confirmacion } = resultado.operacion
        setSolicitudActual({
          requerimientoId: confirmacion.id,
          version: confirmacion.version,
        })
        setAnuncio(
          `Envío confirmado. Requerimiento ${confirmacion.id} pendiente de aprobación.`,
        )
      } else {
        adoptarVersionVigente(resultado.operacion)
      }
      setEdicion({ ...edicion, estado: resultado.estado })
    } catch {
      const operacion: EstadoOperacion = {
        status: 'error',
        error: {
          message:
            'No se pudo enviar el requerimiento. Revisa tu conexión e inténtalo de nuevo.',
          retryable: true,
        },
        entradaConservada: true,
        reintentable: true,
      }
      setEdicion({ ...edicion, estado: { ...estado, operacion } })
    } finally {
      setEnviando(false)
    }
  }

  const guardar = async () => {
    if (edicion.estado.paso === 'confirmacion' || guardando || enviando) return
    const estadoActual = edicion.estado
    setGuardando(true)
    try {
      const resultado = await guardarBorradorEnCurso(
        edicion,
        solicitudActual,
        puerto,
      )
      const operacion = resultado.operacion
      if (operacion.status === 'confirmado' && operacion.accion === 'borrador') {
        setSolicitudActual({
          requerimientoId: operacion.detalle.id,
          version: operacion.detalle.version,
        })
        setErroresValidacion([])
        setAvisoGuardado('Borrador guardado correctamente.')
        setAnuncio('Borrador guardado correctamente.')
        if (estadoActual.paso === 'revision') {
          const revisado = revisar(resultado.edicion.estado, catalogos, {
            plazoAdministrativoDias,
            colaboradores,
          })
          setEdicion({
            ...resultado.edicion,
            estado: revisado.ok ? revisado.estado : resultado.edicion.estado,
          })
        } else {
          setEdicion(resultado.edicion)
        }
      } else {
        setAvisoGuardado(null)
        adoptarVersionVigente(operacion)
        setEdicion(resultado.edicion)
      }
    } catch {
      const operacion: EstadoOperacion = {
        status: 'error',
        error: {
          message:
            'No se pudo guardar el borrador. Revisa tu conexión e inténtalo de nuevo.',
          retryable: true,
        },
        entradaConservada: true,
        reintentable: true,
      }
      setAvisoGuardado(null)
      setEdicion({ ...edicion, estado: { ...estadoActual, operacion } })
    } finally {
      setGuardando(false)
    }
  }

  const devolverFocoDelDescarte = () => {
    const destino = disparadorDescarteRef.current ?? tituloRef.current
    destino?.focus()
  }

  const solicitarCancelar = (disparador?: HTMLElement | null) => {
    if (estado.paso === 'confirmacion') {
      onCancelar()
      return
    }
    const resultado = solicitarCancelarEdicion(edicion)
    if (resultado.status === 'sin-cambios') {
      onCancelar()
      return
    }
    if (resultado.status === 'confirmacion-pendiente') {
      disparadorDescarteRef.current = disparador ?? null
      setEdicion(resultado.edicion)
      setAnuncio('Hay cambios sin guardar. Confirma si deseas descartarlos.')
      return
    }
    onCancelar()
  }

  const resolverDescarteActual = (decision: DecisionDescarte) => {
    const resultado = resolverDescarte(edicion, decision)
    if (resultado.status === 'descartado') {
      onCancelar()
      return
    }
    setEdicion(resultado.edicion)
    setAnuncio('Se conservaron los cambios.')
    devolverFocoDelDescarte()
  }

  const alPulsarTecla = (evento: KeyboardEvent<HTMLDivElement>) => {
    if (!modal) return
    if (evento.key === 'Escape') {
      evento.stopPropagation()
      if (!edicion.descartePendiente) solicitarCancelar()
      return
    }
    if (evento.key !== 'Tab') return
    const contenedor = edicion.descartePendiente
      ? descarteContenedorRef.current
      : contenedorRef.current
    const primero = primerFocalizable(contenedor)
    const ultimo = ultimoFocalizable(contenedor)
    if (!primero || !ultimo) {
      evento.preventDefault()
      return
    }
    const activo = document.activeElement
    const fueraDelContenedor = !contenedor?.contains(activo)
    if (evento.shiftKey) {
      if (activo === primero || fueraDelContenedor) {
        evento.preventDefault()
        ultimo.focus()
      }
      return
    }
    if (activo === ultimo || fueraDelContenedor) {
      evento.preventDefault()
      primero.focus()
    }
  }

  const alPulsarTeclaDescarte = (evento: KeyboardEvent<HTMLDivElement>) => {
    if (evento.key !== 'Escape') return
    evento.stopPropagation()
    evento.preventDefault()
    resolverDescarteActual('cancelar')
  }

  const embebido = !modal
  const mensajeError =
    paso === 'confirmacion' || enviando || guardando
      ? null
      : estado.operacion
        ? mensajeOperacion(estado.operacion)
        : null
  const erroresPorCampo = erroresPorCampoDe(erroresValidacion)

  return (
    <div
      className={
        embebido ? styles['rrhh-form__embebido'] : styles['rrhh-form__velo']
      }
    >
      <div
        ref={contenedorRef}
        className={styles['rrhh-form__modal']}
        role={embebido ? 'region' : 'dialog'}
        aria-modal={embebido ? undefined : true}
        aria-labelledby={idTitulo}
        onKeyDown={alPulsarTecla}
      >
        <header className={styles['rrhh-form__cabecera']}>
          <span className={styles['rrhh-form__cabecera-icono']} aria-hidden="true">
            📋
          </span>
          <div className={styles['rrhh-form__cabecera-textos']}>
            <h2
              id={idTitulo}
              ref={tituloRef}
              tabIndex={-1}
              className={styles['rrhh-form__titulo']}
            >
              Nuevo requerimiento de personal
            </h2>
            <p className={styles['rrhh-form__subtitulo']}>
              Llena el formulario y solicita su revisión
            </p>
          </div>
          <button
            type="button"
            className={styles['rrhh-form__cerrar']}
            aria-label="Cerrar formulario"
            onClick={(evento) => solicitarCancelar(evento.currentTarget)}
          >
            ✕
          </button>
        </header>

        <p
          className={styles['rrhh-form__anuncio']}
          role="status"
          aria-atomic="true"
        >
          {anuncio}
        </p>

        {paso === 'confirmacion' ? null : <IndicadorPasos paso={paso} />}

        {paso === 'edicion' ? (
          <div className={styles['rrhh-form__cuerpo']}>
            {mensajeError ? (
              <div className={styles['rrhh-form__error-operacion']} role="alert">
                <p>{mensajeError}</p>
                <p className={styles['rrhh-form__aviso']}>
                  Los datos se conservan; puedes corregirlos o reintentar.
                </p>
              </div>
            ) : null}
            {avisoGuardado ? (
              <p className={styles['rrhh-form__aviso-guardado']}>
                {avisoGuardado}
              </p>
            ) : null}
            {erroresValidacion.length > 0 ? (
              <ListaErrores
                errores={erroresValidacion}
                titulo="Revisa los datos antes de continuar:"
              />
            ) : null}
            <FormularioRequerimiento
              catalogos={catalogos}
              colaboradores={colaboradores}
              valor={estado.formulario}
              onCambio={alCambiar}
              plazoAdministrativoDias={plazoAdministrativoDias}
              erroresPorCampo={erroresPorCampo}
            />
          </div>
        ) : null}

        {paso === 'revision' ? (
          <section
            className={styles['rrhh-form__resumen']}
            aria-labelledby={idResumen}
          >
            <h2
              id={idResumen}
              ref={revisionRef}
              tabIndex={-1}
              className={styles['rrhh-form__resumen-titulo']}
            >
              Revisión y envío
            </h2>
            <p className={styles['rrhh-form__resumen-subtitulo']}>
              Revisa los datos antes de enviar el requerimiento.
            </p>
            {mensajeError ? (
              <div className={styles['rrhh-form__error-operacion']} role="alert">
                <p>{mensajeError}</p>
                <p className={styles['rrhh-form__aviso']}>
                  Los datos se conservan; puedes corregirlos o reintentar el envío.
                </p>
              </div>
            ) : null}
            {avisoGuardado ? (
              <p className={styles['rrhh-form__aviso-guardado']}>
                {avisoGuardado}
              </p>
            ) : null}
            <div className={styles['rrhh-form__resumen-grid']}>
              {estado.revision.campos.map((campo) => (
                <ResumenItem
                  key={campo.campo}
                  etiqueta={campo.etiqueta}
                  valor={campo.valor}
                />
              ))}
            </div>
            {estado.revision.duracion ? (
              <p className={styles['rrhh-form__aviso']}>
                {estado.revision.duracion.aviso}
              </p>
            ) : null}
            {estado.revision.errores.length > 0 ? (
              <ListaErrores
                errores={estado.revision.errores}
                titulo="Corrige estos campos:"
              />
            ) : null}
          </section>
        ) : null}

        {paso === 'confirmacion' ? (
          <section
            className={styles['rrhh-form__confirmacion']}
            aria-labelledby={idConfirmacion}
          >
            <span className={styles['rrhh-form__exito-icono']} aria-hidden="true">
              ✓
            </span>
            <h2
              id={idConfirmacion}
              ref={confirmacionRef}
              tabIndex={-1}
              className={styles['rrhh-form__exito-titulo']}
            >
              ¡Requerimiento enviado para aprobar!
            </h2>
            <p className={styles['rrhh-form__exito-cuerpo']}>
              La solicitud se registró correctamente y fue enviada al
              responsable. Te detallamos el resumen del requerimiento:
            </p>
            <div className={styles['rrhh-form__resumen-panel']}>
              <ResumenItem
                etiqueta="Código de requerimiento"
                valor={estado.confirmacion.id}
              />
              <ResumenItem
                etiqueta="Resumen"
                valor={estado.confirmacion.resumen}
              />
              <ResumenItem
                etiqueta="Responsable"
                valor={estado.confirmacion.responsable}
              />
              <ResumenItem
                etiqueta="Estado actual"
                valor={
                  <span className={styles['rrhh-form__badge-estado']}>
                    Pendiente de aprobación
                  </span>
                }
              />
            </div>
            <div className={styles['rrhh-form__nota']}>
              <span className={styles['rrhh-form__nota-icono']} aria-hidden="true">
                ⓘ
              </span>
              <p>
                Recibirás una actualización cuando el responsable revise la
                solicitud.
              </p>
            </div>
          </section>
        ) : null}

        <footer className={styles['rrhh-form__pie']}>
          {paso === 'edicion' ? (
            <>
              <button
                type="button"
                className={styles['rrhh-form__boton-secundario']}
                onClick={(evento) => solicitarCancelar(evento.currentTarget)}
              >
                Cancelar edición
              </button>
              <button
                type="button"
                className={styles['rrhh-form__boton-secundario']}
                onClick={guardar}
                disabled={guardando || enviando}
              >
                {guardando ? 'Guardando…' : 'Guardar borrador'}
              </button>
              <button
                type="button"
                className={styles['rrhh-form__boton-primario']}
                onClick={continuar}
                disabled={guardando}
              >
                Continuar
              </button>
            </>
          ) : null}

          {paso === 'revision' ? (
            <>
              <button
                type="button"
                className={styles['rrhh-form__boton-secundario']}
                onClick={volver}
                disabled={enviando || guardando}
              >
                Volver a editar
              </button>
              <button
                type="button"
                className={styles['rrhh-form__boton-secundario']}
                onClick={guardar}
                disabled={enviando || guardando}
              >
                {guardando ? 'Guardando…' : 'Guardar borrador'}
              </button>
              <button
                type="button"
                className={styles['rrhh-form__boton-primario']}
                onClick={enviar}
                disabled={enviando || guardando}
              >
                {enviando ? 'Enviando…' : 'Enviar'}
              </button>
            </>
          ) : null}

          {paso === 'confirmacion' ? (
            <button
              type="button"
              className={styles['rrhh-form__boton-primario']}
              onClick={onCancelar}
            >
              Volver a la Bandeja
            </button>
          ) : null}
        </footer>
      </div>

      {edicion.descartePendiente ? (
        <div className={styles['rrhh-form__descarte-velo']}>
          <div
            ref={descarteContenedorRef}
            className={styles['rrhh-form__descarte']}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={idDescarte}
            aria-describedby={idDescarteTexto}
            onKeyDown={alPulsarTeclaDescarte}
          >
            <h2
              id={idDescarte}
              ref={descarteTituloRef}
              tabIndex={-1}
              className={styles['rrhh-form__descarte-titulo']}
            >
              ¿Descartar los cambios sin guardar?
            </h2>
            <p id={idDescarteTexto} className={styles['rrhh-form__descarte-texto']}>
              Se perderán los cambios que todavía no se han guardado. El
              requerimiento no se cancela ni se modifica.
            </p>
            <div className={styles['rrhh-form__descarte-acciones']}>
              <button
                type="button"
                className={styles['rrhh-form__boton-secundario']}
                onClick={() => resolverDescarteActual('rechazar')}
              >
                Seguir editando
              </button>
              <button
                type="button"
                className={styles['rrhh-form__boton-primario']}
                onClick={() => resolverDescarteActual('aceptar')}
              >
                Descartar cambios
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
