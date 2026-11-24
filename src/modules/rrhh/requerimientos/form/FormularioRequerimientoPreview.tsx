'use client'

import { useId, useState } from 'react'
import type { ReactNode } from 'react'
import type {
  AreaId,
  BorradorRequerimiento,
  CatalogosRequerimientos,
  ColaboradorId,
  ColaboradorReemplazo,
  DepartamentoId,
  DepartamentoUbicacionId,
  DistritoId,
  EmpresaId,
  MotivoRequerimiento,
  ProvinciaId,
  PuestoId,
  SubareaId,
  UsuarioId,
} from '../contracts'
import { AVISO_DURACION, MOTIVO_LABELS } from '../model/etiquetas'
import { MOTIVOS } from '../state/valores-bandeja'
import styles from './FormularioRequerimiento.module.css'

export type PasoFormularioPreview = 'datos' | 'revision' | 'confirmacion'

export interface FormularioRequerimientoPreviewProps {
  readonly catalogos: CatalogosRequerimientos
  /** Colaboradores seleccionables para «Colaborador a reemplazar». */
  readonly colaboradores?: readonly ColaboradorReemplazo[]
  readonly borradorInicial?: BorradorRequerimiento
  /** Código mostrado en la confirmación; lo asigna el backend al confirmar. */
  readonly codigoConfirmacion?: string
  /** Paso inicial; permite presentar la confirmación como variante de prop. */
  readonly pasoInicial?: PasoFormularioPreview
  readonly onCancelar?: () => void
  readonly onGuardarBorrador?: (borrador: BorradorRequerimiento) => void
  readonly onEnviar?: (borrador: BorradorRequerimiento) => void
  readonly onRevisar?: () => void
  /** 'modal' (por defecto) muestra el velo de pantalla completa; 'embebido' ocupa solo su contenedor. */
  readonly variante?: 'modal' | 'embebido'
}

interface EstadoCampos {
  motivo: string
  empresaId: string
  colaboradorAReemplazarId: string
  departamentoId: string
  areaId: string
  subareaId: string
  puestoId: string
  vacantes: string
  remuneracionMensual: string
  departamentoUbicacionId: string
  provinciaId: string
  distritoId: string
  usuarioProximaTareaId: string
  comentario: string
}

const CAMPOS_VACIOS: EstadoCampos = {
  motivo: '',
  empresaId: '',
  colaboradorAReemplazarId: '',
  departamentoId: '',
  areaId: '',
  subareaId: '',
  puestoId: '',
  vacantes: '',
  remuneracionMensual: '',
  departamentoUbicacionId: '',
  provinciaId: '',
  distritoId: '',
  usuarioProximaTareaId: '',
  comentario: '',
}

function inicializarCampos(borrador?: BorradorRequerimiento): EstadoCampos {
  if (!borrador) return CAMPOS_VACIOS
  return {
    motivo: borrador.motivo ?? '',
    empresaId: borrador.empresaId ?? '',
    colaboradorAReemplazarId: borrador.colaboradorAReemplazarId ?? '',
    departamentoId: borrador.departamentoId ?? '',
    areaId: borrador.areaId ?? '',
    subareaId: borrador.subareaId ?? '',
    puestoId: borrador.puestoId ?? '',
    vacantes: borrador.vacantes === null ? '' : String(borrador.vacantes),
    remuneracionMensual:
      borrador.remuneracion === null ? '' : String(borrador.remuneracion.monto),
    departamentoUbicacionId: borrador.ubicacion?.departamentoId ?? '',
    provinciaId: borrador.ubicacion?.provinciaId ?? '',
    distritoId: borrador.ubicacion?.distritoId ?? '',
    usuarioProximaTareaId: borrador.usuarioProximaTareaId ?? '',
    comentario: borrador.comentario ?? '',
  }
}

function parsearNumero(valor: string): number | null {
  if (valor === '') return null
  const numero = Number(valor)
  return Number.isNaN(numero) ? null : numero
}

function construirBorrador(campos: EstadoCampos): BorradorRequerimiento {
  const monto = parsearNumero(campos.remuneracionMensual)
  const vacantes = parsearNumero(campos.vacantes)
  const ubicacion =
    campos.departamentoUbicacionId && campos.provinciaId && campos.distritoId
      ? {
          departamentoId:
            campos.departamentoUbicacionId as DepartamentoUbicacionId,
          provinciaId: campos.provinciaId as ProvinciaId,
          distritoId: campos.distritoId as DistritoId,
        }
      : null

  return {
    motivo: (campos.motivo || null) as MotivoRequerimiento | null,
    empresaId: (campos.empresaId || null) as EmpresaId | null,
    colaboradorAReemplazarId:
      (campos.colaboradorAReemplazarId || null) as ColaboradorId | null,
    departamentoId: (campos.departamentoId || null) as DepartamentoId | null,
    areaId: (campos.areaId || null) as AreaId | null,
    subareaId: (campos.subareaId || null) as SubareaId | null,
    puestoId: (campos.puestoId || null) as PuestoId | null,
    vacantes,
    remuneracion: monto === null ? null : { monto, moneda: 'PEN' },
    ubicacion,
    usuarioProximaTareaId:
      (campos.usuarioProximaTareaId || null) as UsuarioId | null,
    comentario: campos.comentario || null,
  }
}

function formatearMonto(monto: string): string {
  const numero = Number(monto)
  return `S/ ${numero.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function ValorAusente() {
  return (
    <span className={styles['rrhh-form__ausente']}>
      —<span className="sr-only"> Sin dato</span>
    </span>
  )
}

function Valor({ texto }: { readonly texto: string | null | undefined }) {
  return texto ? <>{texto}</> : <ValorAusente />
}

function Campo({
  id,
  etiqueta,
  obligatorio,
  anchoCompleto,
  children,
}: {
  readonly id: string
  readonly etiqueta: string
  readonly obligatorio?: boolean
  readonly anchoCompleto?: boolean
  readonly children: ReactNode
}) {
  const clase = anchoCompleto
    ? `${styles['rrhh-form__campo']} ${styles['rrhh-form__campo--ancho-completo']}`
    : styles['rrhh-form__campo']
  return (
    <div className={clase}>
      <label className={styles['rrhh-form__etiqueta']} htmlFor={id}>
        {etiqueta}
        {obligatorio ? (
          <span className={styles['rrhh-form__asterisco']} aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {children}
    </div>
  )
}

function Leyenda({
  etiqueta,
  obligatorio,
}: {
  readonly etiqueta: string
  readonly obligatorio?: boolean
}) {
  return (
    <legend className={styles['rrhh-form__leyenda']}>
      {etiqueta}
      {obligatorio ? (
        <span className={styles['rrhh-form__asterisco']} aria-hidden="true">
          *
        </span>
      ) : null}
    </legend>
  )
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

function IndicadorPasos({ paso }: { readonly paso: PasoFormularioPreview }) {
  const completado = paso !== 'datos'
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
            paso === 'datos'
              ? styles['rrhh-form__paso-etiqueta--activo']
              : ''
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

export function FormularioRequerimientoPreview({
  catalogos,
  colaboradores = [],
  borradorInicial,
  codigoConfirmacion,
  pasoInicial = 'datos',
  onCancelar = () => {},
  onGuardarBorrador = () => {},
  onEnviar = () => {},
  onRevisar = () => {},
  variante = 'modal',
}: FormularioRequerimientoPreviewProps) {
  const idBase = useId()
  const [paso, setPaso] = useState<PasoFormularioPreview>(pasoInicial)
  const [campos, setCampos] = useState<EstadoCampos>(() =>
    inicializarCampos(borradorInicial),
  )

  const idTitulo = `${idBase}-titulo`
  const idMotivo = `${idBase}-motivo`
  const idEmpresa = `${idBase}-empresa`
  const idDepartamento = `${idBase}-departamento`
  const idArea = `${idBase}-area`
  const idSubarea = `${idBase}-subarea`
  const idPuesto = `${idBase}-puesto`
  const idVacantes = `${idBase}-vacantes`
  const idColaborador = `${idBase}-colaborador`
  const idRemuneracion = `${idBase}-remuneracion`
  const idDepUbicacion = `${idBase}-dep-ubicacion`
  const idProvincia = `${idBase}-provincia`
  const idDistrito = `${idBase}-distrito`
  const idResponsable = `${idBase}-responsable`
  const idComentario = `${idBase}-comentario`
  const idResumen = `${idBase}-resumen`
  const idConfirmacion = `${idBase}-confirmacion`

  const opcionesMotivo =
    catalogos.motivos.length > 0
      ? catalogos.motivos
      : MOTIVOS.map((motivo) => ({
          motivo,
          etiqueta: MOTIVO_LABELS[motivo],
        }))

  const areas = campos.departamentoId
    ? catalogos.areas.filter(
        (area) => area.departamentoId === campos.departamentoId,
      )
    : []
  const subareas = campos.areaId
    ? catalogos.subareas.filter((subarea) => subarea.areaId === campos.areaId)
    : []
  const puestos = campos.areaId
    ? catalogos.puestos.filter(
        (puesto) =>
          puesto.areaId === campos.areaId &&
          (!campos.subareaId || puesto.subareaId === campos.subareaId),
      )
    : []
  const provincias = campos.departamentoUbicacionId
    ? catalogos.provincias.filter(
        (provincia) =>
          provincia.departamentoId === campos.departamentoUbicacionId,
      )
    : []
  const distritos = campos.provinciaId
    ? catalogos.distritos.filter(
        (distrito) => distrito.provinciaId === campos.provinciaId,
      )
    : []

  const esReemplazo = campos.motivo === 'reemplazo'

  const puestoSeleccionado = catalogos.puestos.find(
    (puesto) => puesto.id === campos.puestoId,
  )
  const duracionTexto = puestoSeleccionado
    ? puestoSeleccionado.clasificacion === 'operativo'
      ? '10 días hábiles'
      : 'Pendiente de definir'
    : null

  const motivoEtiqueta = opcionesMotivo.find(
    (item) => item.motivo === campos.motivo,
  )?.etiqueta
  const empresaEtiqueta = catalogos.empresas.find(
    (empresa) => empresa.id === campos.empresaId,
  )?.nombre
  const colaboradorEtiqueta = colaboradores.find(
    (colaborador) => colaborador.id === campos.colaboradorAReemplazarId,
  )?.nombre
  const departamentoEtiqueta = catalogos.departamentos.find(
    (departamento) => departamento.id === campos.departamentoId,
  )?.nombre
  const areaEtiqueta = catalogos.areas.find(
    (area) => area.id === campos.areaId,
  )?.nombre
  const subareaEtiqueta = catalogos.subareas.find(
    (subarea) => subarea.id === campos.subareaId,
  )?.nombre
  const puestoEtiqueta = catalogos.puestos.find(
    (puesto) => puesto.id === campos.puestoId,
  )?.nombre
  const depUbicacionEtiqueta = catalogos.departamentosUbicacion.find(
    (departamento) => departamento.id === campos.departamentoUbicacionId,
  )?.nombre
  const provinciaEtiqueta = catalogos.provincias.find(
    (provincia) => provincia.id === campos.provinciaId,
  )?.nombre
  const distritoEtiqueta = catalogos.distritos.find(
    (distrito) => distrito.id === campos.distritoId,
  )?.nombre
  const responsableEtiqueta = catalogos.usuariosProximaTarea.find(
    (usuario) => usuario.id === campos.usuarioProximaTareaId,
  )?.nombre

  const textoAreaSubarea = subareaEtiqueta
    ? `${areaEtiqueta} / ${subareaEtiqueta}`
    : areaEtiqueta
  const textoUbicacion =
    depUbicacionEtiqueta && provinciaEtiqueta && distritoEtiqueta
      ? `${depUbicacionEtiqueta} / ${provinciaEtiqueta} / ${distritoEtiqueta}`
      : undefined

  const cambiarCampo = (campo: keyof EstadoCampos, valor: string) => {
    setCampos((previo) => {
      const siguiente: EstadoCampos = { ...previo, [campo]: valor }

      if (campo === 'motivo' && valor !== 'reemplazo') {
        siguiente.colaboradorAReemplazarId = ''
      }

      if (
        campo === 'departamentoId' &&
        !catalogos.areas.some(
          (area) =>
            area.id === siguiente.areaId &&
            area.departamentoId === siguiente.departamentoId,
        )
      ) {
        siguiente.areaId = ''
      }
      if (
        (campo === 'departamentoId' || campo === 'areaId') &&
        !catalogos.subareas.some(
          (subarea) =>
            subarea.id === siguiente.subareaId &&
            subarea.areaId === siguiente.areaId,
        )
      ) {
        siguiente.subareaId = ''
      }
      if (
        (campo === 'departamentoId' ||
          campo === 'areaId' ||
          campo === 'subareaId') &&
        !catalogos.puestos.some(
          (puesto) =>
            puesto.id === siguiente.puestoId &&
            puesto.areaId === siguiente.areaId &&
            (!siguiente.subareaId || puesto.subareaId === siguiente.subareaId),
        )
      ) {
        siguiente.puestoId = ''
      }

      if (
        campo === 'departamentoUbicacionId' &&
        !catalogos.provincias.some(
          (provincia) =>
            provincia.id === siguiente.provinciaId &&
            provincia.departamentoId === siguiente.departamentoUbicacionId,
        )
      ) {
        siguiente.provinciaId = ''
      }
      if (
        (campo === 'departamentoUbicacionId' || campo === 'provinciaId') &&
        !catalogos.distritos.some(
          (distrito) =>
            distrito.id === siguiente.distritoId &&
            distrito.provinciaId === siguiente.provinciaId,
        )
      ) {
        siguiente.distritoId = ''
      }

      return siguiente
    })
  }

  const titulo = borradorInicial
    ? 'Editar requerimiento de personal'
    : 'Nuevo requerimiento de personal'
  const subtitulo = borradorInicial
    ? 'Actualiza los datos y solicita su revisión'
    : 'Llena el formulario y solicita su revisión'

  const embebido = variante === 'embebido'

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
              {titulo}
            </h1>
            <p className={styles['rrhh-form__subtitulo']}>{subtitulo}</p>
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

        {paso === 'datos' ? (
          <div className={styles['rrhh-form__cuerpo']}>
            <div className={styles['rrhh-form__grid']}>
              <Campo id={idMotivo} etiqueta="Motivo" obligatorio>
                <select
                  id={idMotivo}
                  className={styles['rrhh-form__control']}
                  value={campos.motivo}
                  onChange={(evento) => cambiarCampo('motivo', evento.target.value)}
                >
                  <option value="">Seleccionar motivo</option>
                  {opcionesMotivo.map(({ motivo, etiqueta }) => (
                    <option key={motivo} value={motivo}>
                      {etiqueta}
                    </option>
                  ))}
                </select>
              </Campo>

              <Campo id={idEmpresa} etiqueta="Empresa" obligatorio>
                <select
                  id={idEmpresa}
                  className={styles['rrhh-form__control']}
                  value={campos.empresaId}
                  onChange={(evento) =>
                    cambiarCampo('empresaId', evento.target.value)
                  }
                >
                  <option value="">Seleccionar empresa</option>
                  {catalogos.empresas.map((empresa) => (
                    <option key={empresa.id} value={empresa.id}>
                      {empresa.nombre}
                    </option>
                  ))}
                </select>
              </Campo>

              <Campo id={idDepartamento} etiqueta="Departamento" obligatorio>
                <select
                  id={idDepartamento}
                  className={styles['rrhh-form__control']}
                  value={campos.departamentoId}
                  onChange={(evento) =>
                    cambiarCampo('departamentoId', evento.target.value)
                  }
                >
                  <option value="">Seleccionar departamento</option>
                  {catalogos.departamentos.map((departamento) => (
                    <option key={departamento.id} value={departamento.id}>
                      {departamento.nombre}
                    </option>
                  ))}
                </select>
              </Campo>

              <fieldset className={styles['rrhh-form__campo']}>
                <Leyenda etiqueta="Área / Subárea" obligatorio />
                <div className={styles['rrhh-form__grupo']}>
                  <div className={styles['rrhh-form__subcampo']}>
                    <label
                      className={styles['rrhh-form__etiqueta']}
                      htmlFor={idArea}
                    >
                      Área
                    </label>
                    <select
                      id={idArea}
                      className={styles['rrhh-form__control']}
                      value={campos.areaId}
                      disabled={!campos.departamentoId}
                      onChange={(evento) =>
                        cambiarCampo('areaId', evento.target.value)
                      }
                    >
                      <option value="">Seleccionar área</option>
                      {areas.map((area) => (
                        <option key={area.id} value={area.id}>
                          {area.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles['rrhh-form__subcampo']}>
                    <label
                      className={styles['rrhh-form__etiqueta']}
                      htmlFor={idSubarea}
                    >
                      Subárea
                    </label>
                    <select
                      id={idSubarea}
                      className={styles['rrhh-form__control']}
                      value={campos.subareaId}
                      disabled={!campos.areaId}
                      onChange={(evento) =>
                        cambiarCampo('subareaId', evento.target.value)
                      }
                    >
                      <option value="">Sin subárea</option>
                      {subareas.map((subarea) => (
                        <option key={subarea.id} value={subarea.id}>
                          {subarea.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </fieldset>

              <Campo id={idPuesto} etiqueta="Puesto solicitado" obligatorio>
                <select
                  id={idPuesto}
                  className={styles['rrhh-form__control']}
                  value={campos.puestoId}
                  disabled={!campos.areaId}
                  onChange={(evento) =>
                    cambiarCampo('puestoId', evento.target.value)
                  }
                >
                  <option value="">Seleccionar puesto</option>
                  {puestos.map((puesto) => (
                    <option key={puesto.id} value={puesto.id}>
                      {puesto.nombre}
                    </option>
                  ))}
                </select>
              </Campo>

              <Campo id={idVacantes} etiqueta="Cantidad de vacantes" obligatorio>
                <input
                  id={idVacantes}
                  className={styles['rrhh-form__control']}
                  type="number"
                  min={1}
                  step={1}
                  inputMode="numeric"
                  value={campos.vacantes}
                  onChange={(evento) =>
                    cambiarCampo('vacantes', evento.target.value)
                  }
                />
              </Campo>

              {esReemplazo ? (
                <Campo
                  id={idColaborador}
                  etiqueta="Colaborador a reemplazar"
                  obligatorio
                >
                  <select
                    id={idColaborador}
                    className={styles['rrhh-form__control']}
                    value={campos.colaboradorAReemplazarId}
                    onChange={(evento) =>
                      cambiarCampo('colaboradorAReemplazarId', evento.target.value)
                    }
                  >
                    <option value="">Seleccionar colaborador</option>
                    {colaboradores.map((colaborador) => (
                      <option key={colaborador.id} value={colaborador.id}>
                        {colaborador.nombre}
                      </option>
                    ))}
                  </select>
                </Campo>
              ) : null}

              <Campo id={idRemuneracion} etiqueta="Remuneración mensual (S/)" obligatorio>
                <input
                  id={idRemuneracion}
                  className={styles['rrhh-form__control']}
                  type="number"
                  min={0}
                  step="0.01"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={campos.remuneracionMensual}
                  onChange={(evento) =>
                    cambiarCampo('remuneracionMensual', evento.target.value)
                  }
                />
              </Campo>

              <div className={styles['rrhh-form__campo']}>
                <span className={styles['rrhh-form__etiqueta']}>
                  Duración del plazo
                </span>
                <p className={styles['rrhh-form__duracion']}>
                  {duracionTexto ? duracionTexto : <ValorAusente />}
                </p>
                <p className={styles['rrhh-form__aviso']}>{AVISO_DURACION}</p>
              </div>

              <Campo id={idResponsable} etiqueta="Responsable de aprobación" obligatorio>
                <select
                  id={idResponsable}
                  className={styles['rrhh-form__control']}
                  value={campos.usuarioProximaTareaId}
                  onChange={(evento) =>
                    cambiarCampo('usuarioProximaTareaId', evento.target.value)
                  }
                >
                  <option value="">Selecciona a un responsable</option>
                  {catalogos.usuariosProximaTarea.map((usuario) => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.nombre}
                    </option>
                  ))}
                </select>
              </Campo>

              <fieldset
                className={`${styles['rrhh-form__campo']} ${styles['rrhh-form__campo--ancho-completo']}`}
              >
                <Leyenda etiqueta="Ubicación" obligatorio />
                <div className={styles['rrhh-form__ubicacion']}>
                  <div className={styles['rrhh-form__subcampo']}>
                    <label
                      className={styles['rrhh-form__etiqueta']}
                      htmlFor={idDepUbicacion}
                    >
                      Departamento
                    </label>
                    <select
                      id={idDepUbicacion}
                      className={styles['rrhh-form__control']}
                      value={campos.departamentoUbicacionId}
                      onChange={(evento) =>
                        cambiarCampo('departamentoUbicacionId', evento.target.value)
                      }
                    >
                      <option value="">Seleccionar departamento</option>
                      {catalogos.departamentosUbicacion.map((departamento) => (
                        <option key={departamento.id} value={departamento.id}>
                          {departamento.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles['rrhh-form__subcampo']}>
                    <label
                      className={styles['rrhh-form__etiqueta']}
                      htmlFor={idProvincia}
                    >
                      Provincia
                    </label>
                    <select
                      id={idProvincia}
                      className={styles['rrhh-form__control']}
                      value={campos.provinciaId}
                      disabled={!campos.departamentoUbicacionId}
                      onChange={(evento) =>
                        cambiarCampo('provinciaId', evento.target.value)
                      }
                    >
                      <option value="">Seleccionar provincia</option>
                      {provincias.map((provincia) => (
                        <option key={provincia.id} value={provincia.id}>
                          {provincia.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles['rrhh-form__subcampo']}>
                    <label
                      className={styles['rrhh-form__etiqueta']}
                      htmlFor={idDistrito}
                    >
                      Distrito
                    </label>
                    <select
                      id={idDistrito}
                      className={styles['rrhh-form__control']}
                      value={campos.distritoId}
                      disabled={!campos.provinciaId}
                      onChange={(evento) =>
                        cambiarCampo('distritoId', evento.target.value)
                      }
                    >
                      <option value="">Seleccionar distrito</option>
                      {distritos.map((distrito) => (
                        <option key={distrito.id} value={distrito.id}>
                          {distrito.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </fieldset>

              <Campo
                id={idComentario}
                etiqueta="Comentario"
                obligatorio
                anchoCompleto
              >
                <textarea
                  id={idComentario}
                  className={styles['rrhh-form__control']}
                  rows={3}
                  placeholder="Añade información sobre el requerimiento..."
                  value={campos.comentario}
                  onChange={(evento) =>
                    cambiarCampo('comentario', evento.target.value)
                  }
                />
              </Campo>
            </div>
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
            <div className={styles['rrhh-form__resumen-grid']}>
              <ResumenItem etiqueta="Motivo" valor={<Valor texto={motivoEtiqueta} />} />
              <ResumenItem etiqueta="Empresa" valor={<Valor texto={empresaEtiqueta} />} />
              {esReemplazo ? (
                <ResumenItem
                  etiqueta="Colaborador a reemplazar"
                  valor={<Valor texto={colaboradorEtiqueta} />}
                />
              ) : null}
              <ResumenItem
                etiqueta="Departamento"
                valor={<Valor texto={departamentoEtiqueta} />}
              />
              <ResumenItem
                etiqueta="Área / Subárea"
                valor={<Valor texto={textoAreaSubarea} />}
              />
              <ResumenItem
                etiqueta="Puesto solicitado"
                valor={<Valor texto={puestoEtiqueta} />}
              />
              <ResumenItem
                etiqueta="Cantidad de vacantes"
                valor={<Valor texto={campos.vacantes || undefined} />}
              />
              <ResumenItem
                etiqueta="Remuneración mensual (S/)"
                valor={
                  campos.remuneracionMensual ? (
                    formatearMonto(campos.remuneracionMensual)
                  ) : (
                    <ValorAusente />
                  )
                }
              />
              <ResumenItem
                etiqueta="Ubicación"
                valor={<Valor texto={textoUbicacion} />}
              />
              <ResumenItem
                etiqueta="Responsable de aprobación"
                valor={<Valor texto={responsableEtiqueta} />}
              />
              <ResumenItem
                etiqueta="Duración del plazo"
                valor={duracionTexto ? duracionTexto : <ValorAusente />}
              />
              <ResumenItem
                etiqueta="Comentario"
                valor={<Valor texto={campos.comentario || undefined} />}
              />
            </div>
            {!duracionTexto ? (
              <p className={styles['rrhh-form__aviso']}>{AVISO_DURACION}</p>
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
                valor={codigoConfirmacion ?? '—'}
              />
              <ResumenItem
                etiqueta="Puesto solicitado"
                valor={<Valor texto={puestoEtiqueta} />}
              />
              <ResumenItem
                etiqueta="Área / Subárea"
                valor={<Valor texto={textoAreaSubarea} />}
              />
              <ResumenItem etiqueta="Motivo" valor={<Valor texto={motivoEtiqueta} />} />
              <ResumenItem
                etiqueta="Cantidad de vacantes"
                valor={<Valor texto={campos.vacantes || undefined} />}
              />
              <ResumenItem etiqueta="Empresa" valor={<Valor texto={empresaEtiqueta} />} />
              <ResumenItem
                etiqueta="Responsable de aprobación"
                valor={<Valor texto={responsableEtiqueta} />}
              />
              <ResumenItem
                etiqueta="Remuneración mensual (S/)"
                valor={
                  campos.remuneracionMensual ? (
                    formatearMonto(campos.remuneracionMensual)
                  ) : (
                    <ValorAusente />
                  )
                }
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
          {paso === 'datos' ? (
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
                onClick={() => {
                  onRevisar()
                  setPaso('revision')
                }}
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
                onClick={() => setPaso('datos')}
              >
                Cancelar edición
              </button>
              <button
                type="button"
                className={styles['rrhh-form__boton-secundario']}
                onClick={() => onGuardarBorrador(construirBorrador(campos))}
              >
                Guardar borrador
              </button>
              <button
                type="button"
                className={styles['rrhh-form__boton-primario']}
                onClick={() => {
                  onEnviar(construirBorrador(campos))
                  setPaso('confirmacion')
                }}
              >
                Enviar
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
