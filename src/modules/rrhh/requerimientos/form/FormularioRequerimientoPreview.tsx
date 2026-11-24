'use client'

import { useId, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type {
  CatalogosRequerimientos,
  ColaboradorReemplazo,
  ComandosRequerimientosPort,
  ConfirmacionEnvio,
  InstanteISO,
  RequerimientoId,
} from '../contracts'
import type { FormularioRequerimientoInput } from '../model'
import {
  contextoDesdeCatalogos,
  crearFormularioVacio,
  validarParaEnvio,
} from '../model'
import type {
  EstadoEdicion,
  EstadoEdicionRevision,
  EstadoOperacion,
  ErrorRevision,
  PasoEdicionRevision,
  ResultadoOperacion,
  SolicitudVersionada,
} from '../review'
import {
  crearEstadoEdicion,
  enviarAprobacion,
  erroresRevision,
  revisar,
  volverAEditar,
} from '../review'
import { FormularioRequerimiento } from './FormularioRequerimiento'
import styles from './FormularioRequerimiento.module.css'

export interface FormularioRequerimientoPreviewProps {
  readonly catalogos: CatalogosRequerimientos
  /** Colaboradores seleccionables para «Colaborador a reemplazar». */
  readonly colaboradores?: readonly ColaboradorReemplazo[]
  readonly valorInicial?: FormularioRequerimientoInput
  /** Plazo administrativo ya fijado por RR. HH.; si falta, queda pendiente. */
  readonly plazoAdministrativoDias?: number | null
  readonly onCancelar?: () => void
  /** Puerto de comandos; por defecto, el mock local de esta vista previa. */
  readonly puerto?: ComandosRequerimientosPort
  readonly solicitud?: SolicitudVersionada
  /** 'modal' (por defecto) muestra el velo de pantalla completa; 'embebido' ocupa solo su contenedor. */
  readonly variante?: 'modal' | 'embebido'
}

const SOLICITUD_PREVIEW: SolicitudVersionada = {
  requerimientoId: 'req-preview' as RequerimientoId,
  version: 1,
}

const FECHA_PREVIEW = '2026-11-24T00:00:00Z' as InstanteISO

async function noDisponible(): Promise<never> {
  throw new Error('Operación no disponible en la vista previa')
}

/**
 * Mock local de la vista previa: confirma el envío para poder ejercitar el flujo
 * sin backend. No representa persistencia real ni reemplaza al contrato.
 */
export function crearPuertoPreview(
  catalogos: CatalogosRequerimientos,
): ComandosRequerimientosPort {
  return {
    crear: noDisponible,
    guardarBorrador: noDisponible,
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
    <div
      className={styles['rrhh-form__errores']}
      role="alert"
      aria-live="assertive"
    >
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
  const completado = paso !== 'edicion'
  return (
    <ol className={styles['rrhh-form__pasos']}>
      <li className={styles['rrhh-form__paso']}>
        <span
          className={`${styles['rrhh-form__paso-circulo']} ${
            completado
              ? styles['rrhh-form__paso-circulo--completado']
              : styles['rrhh-form__paso-circulo--activo']
          }`}
          aria-hidden="true"
        >
          {completado ? '✓' : '1'}
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
      <li className={styles['rrhh-form__paso']}>
        <span
          className={`${styles['rrhh-form__paso-circulo']} ${
            paso === 'revision' || paso === 'confirmacion'
              ? styles['rrhh-form__paso-circulo--activo']
              : styles['rrhh-form__paso-circulo--inactivo']
          }`}
          aria-hidden="true"
        >
          2
        </span>
        <span
          className={`${styles['rrhh-form__paso-etiqueta']} ${
            paso === 'revision' || paso === 'confirmacion'
              ? styles['rrhh-form__paso-etiqueta--activo']
              : ''
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
      return 'El envío no está disponible en este entorno.'
  }
}

export function FormularioRequerimientoPreview({
  catalogos,
  colaboradores = [],
  valorInicial,
  plazoAdministrativoDias,
  onCancelar = () => {},
  puerto,
  solicitud,
  variante = 'modal',
}: FormularioRequerimientoPreviewProps) {
  const idBase = useId()
  const [estado, setEstado] = useState<EstadoEdicionRevision>(() =>
    crearEstadoEdicion(valorInicial ?? crearFormularioVacio(catalogos)),
  )
  const [erroresValidacion, setErroresValidacion] = useState<
    readonly ErrorRevision[]
  >([])
  const [errorOperacion, setErrorOperacion] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  const puertoEnvio = useMemo(
    () => puerto ?? crearPuertoPreview(catalogos),
    [puerto, catalogos],
  )
  const solicitudEnvio = solicitud ?? SOLICITUD_PREVIEW

  const idTitulo = `${idBase}-titulo`
  const idResumen = `${idBase}-resumen`
  const idConfirmacion = `${idBase}-confirmacion`

  const alCambiar = (valor: FormularioRequerimientoInput) => {
    setErroresValidacion([])
    setErrorOperacion(null)
    const edicion: EstadoEdicion = {
      paso: 'edicion',
      formulario: valor,
      revision: null,
      operacion: null,
    }
    setEstado(edicion)
  }

  const continuar = () => {
    const validacion = validarParaEnvio(
      estado.formulario,
      contextoDesdeCatalogos(catalogos),
    )
    if (!validacion.ok) {
      setErroresValidacion(erroresRevision(validacion.errors))
      setErrorOperacion(null)
      return
    }

    setErroresValidacion([])
    setErrorOperacion(null)
    const resultado = revisar(estado, catalogos, { plazoAdministrativoDias })
    if (resultado.ok) setEstado(resultado.estado)
  }

  const volver = () => {
    const resultado = volverAEditar(estado)
    if (!resultado.ok) return
    setErrorOperacion(null)
    setEstado(resultado.estado)
  }

  const enviar = async () => {
    if (estado.paso !== 'revision' || enviando) return
    setEnviando(true)
    setErrorOperacion(null)
    try {
      const resultado: ResultadoOperacion = await enviarAprobacion(
        estado,
        solicitudEnvio,
        puertoEnvio,
      )
      setEstado(resultado.estado)
      setErrorOperacion(mensajeOperacion(resultado.operacion))
    } catch {
      setErrorOperacion(
        'No se pudo enviar el requerimiento. Revisa tu conexión e inténtalo de nuevo.',
      )
    } finally {
      setEnviando(false)
    }
  }

  const embebido = variante === 'embebido'
  const paso = estado.paso

  return (
    <div
      className={
        embebido ? styles['rrhh-form__embebido'] : styles['rrhh-form__velo']
      }
    >
      <div
        className={styles['rrhh-form__modal']}
        role={embebido ? 'region' : 'dialog'}
        aria-modal={embebido ? undefined : true}
        aria-labelledby={idTitulo}
      >
        <header className={styles['rrhh-form__cabecera']}>
          <span className={styles['rrhh-form__cabecera-icono']} aria-hidden="true">
            📋
          </span>
          <div className={styles['rrhh-form__cabecera-textos']}>
            <h1 id={idTitulo} className={styles['rrhh-form__titulo']}>
              Nuevo requerimiento de personal
            </h1>
            <p className={styles['rrhh-form__subtitulo']}>
              Llena el formulario y solicita su revisión
            </p>
          </div>
          <button
            type="button"
            className={styles['rrhh-form__cerrar']}
            aria-label="Cerrar formulario"
            onClick={onCancelar}
          >
            ✕
          </button>
        </header>

        {paso === 'confirmacion' ? null : <IndicadorPasos paso={paso} />}

        {paso === 'edicion' ? (
          <div className={styles['rrhh-form__cuerpo']}>
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
            />
          </div>
        ) : null}

        {paso === 'revision' ? (
          <section
            className={styles['rrhh-form__resumen']}
            aria-labelledby={idResumen}
          >
            <h2 id={idResumen} className={styles['rrhh-form__resumen-titulo']}>
              Revisión y envío
            </h2>
            <p className={styles['rrhh-form__resumen-subtitulo']}>
              Revisa los datos antes de enviar el requerimiento.
            </p>
            {errorOperacion ? (
              <div className={styles['rrhh-form__error-operacion']} role="alert">
                <p>{errorOperacion}</p>
                <p className={styles['rrhh-form__aviso']}>
                  Los datos se conservan; puedes corregirlos o reintentar el envío.
                </p>
              </div>
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
            role="status"
            aria-live="polite"
          >
            <span className={styles['rrhh-form__exito-icono']} aria-hidden="true">
              ✓
            </span>
            <h2 id={idConfirmacion} className={styles['rrhh-form__exito-titulo']}>
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
                onClick={onCancelar}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={styles['rrhh-form__boton-primario']}
                onClick={continuar}
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
                disabled={enviando}
              >
                Volver a editar
              </button>
              <button
                type="button"
                className={styles['rrhh-form__boton-primario']}
                onClick={enviar}
                disabled={enviando}
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
    </div>
  )
}
