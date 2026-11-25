'use client'

import { useId } from 'react'
import type { ReactNode } from 'react'
import type {
  AreaId,
  ColaboradorId,
  ColaboradorReemplazo,
  CatalogosRequerimientos,
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
import type { FormularioRequerimientoInput } from '../model'
import {
  AVISO_DURACION,
  CLASIFICACION_ETIQUETAS,
  MOTIVO_ETIQUETAS,
  aplicarCambio,
  clasificacionFormulario,
  type CambioFormulario,
  type CampoFormulario,
} from '../model'
import { derivarDuracionAplicable } from '../deadlines'
import {
  areasDisponibles,
  distritosDisponibles,
  provinciasDisponibles,
  puestosDisponibles,
  subareasDisponibles,
} from './helpers'

export interface FormularioRequerimientoProps {
  readonly catalogos: CatalogosRequerimientos
  readonly valor: FormularioRequerimientoInput
  readonly onCambio: (valor: FormularioRequerimientoInput) => void
  /** El contrato de catálogos no expone colaboradores; los aporta el consumidor. */
  readonly colaboradores?: readonly ColaboradorReemplazo[]
  /** Plazo administrativo ya fijado por RR. HH.; si falta, queda pendiente. */
  readonly plazoAdministrativoDias?: number | null
  readonly deshabilitado?: boolean
  /**
   * Errores ya calculados por el consumidor, asociados a su campo. Solo añaden
   * `aria-invalid`/`aria-describedby` y el mensaje visible; la validación sigue
   * siendo la de `validarParaEnvio`.
   */
  readonly erroresPorCampo?: Readonly<Partial<Record<CampoFormulario, string>>>
}

function comoId<T extends string>(value: string): T | null {
  return value === '' ? null : (value as T)
}

function EtiquetaObligatoria({
  htmlFor,
  children,
}: {
  readonly htmlFor: string
  readonly children: ReactNode
}) {
  // El asterisco es decorativo (CSS); la obligatoriedad va en `required` y
  // `aria-required` para que el nombre accesible del control siga siendo el
  // de la etiqueta.
  return (
    <label htmlFor={htmlFor} className="rrhh-form__obligatorio">
      {children}
    </label>
  )
}

function MensajeErrorCampo({
  id,
  mensaje,
}: {
  readonly id: string
  readonly mensaje?: string
}) {
  return mensaje ? (
    <p id={id} className="rrhh-form__error-campo">
      {mensaje}
    </p>
  ) : null
}

export function FormularioRequerimiento({
  catalogos,
  valor,
  onCambio,
  colaboradores = [],
  plazoAdministrativoDias,
  deshabilitado = false,
  erroresPorCampo,
}: FormularioRequerimientoProps) {
  const idBase = useId()
  const id = (sufijo: string) => `${idBase}-${sufijo}`
  const cambiar = (cambio: CambioFormulario) =>
    onCambio(aplicarCambio(valor, cambio))

  const errorDe = (campo: CampoFormulario) => erroresPorCampo?.[campo]
  const propsError = (campo: CampoFormulario, sufijo: string) =>
    errorDe(campo)
      ? {
          'aria-invalid': true as const,
          'aria-describedby': id(`error-${sufijo}`),
        }
      : {}

  const clasificacion = clasificacionFormulario(valor, catalogos)
  const duracion = derivarDuracionAplicable(
    clasificacion,
    plazoAdministrativoDias,
  )

  const motivos =
    catalogos.motivos.length > 0
      ? catalogos.motivos
      : (Object.keys(MOTIVO_ETIQUETAS) as MotivoRequerimiento[]).map(
          (motivo) => ({ motivo, etiqueta: MOTIVO_ETIQUETAS[motivo] }),
        )

  const sinDepartamento = valor.departamentoId === null
  const sinArea = valor.areaId === null
  const sinUbicacionDepartamento = valor.departamentoUbicacionId === null
  const sinProvincia = valor.provinciaId === null

  return (
    <form
      className="rrhh-form"
      aria-label="Formulario de requerimiento"
      noValidate
    >
      <fieldset className="rrhh-form__grupo" disabled={deshabilitado}>
        <legend>Datos generales</legend>
        <div className="rrhh-form__campos">
          <div className="rrhh-form__campo">
            <EtiquetaObligatoria htmlFor={id('motivo')}>Motivo</EtiquetaObligatoria>
            <select
              id={id('motivo')}
              name="motivo"
              value={valor.motivo ?? ''}
              required
              aria-required="true"
              {...propsError('motivo', 'motivo')}
              onChange={(evento) =>
                cambiar({
                  campo: 'motivo',
                  valor: comoId<MotivoRequerimiento>(evento.target.value),
                })
              }
            >
              <option value="">Selecciona un motivo</option>
              {motivos.map(({ motivo, etiqueta }) => (
                <option key={motivo} value={motivo}>
                  {etiqueta}
                </option>
              ))}
            </select>
            <MensajeErrorCampo
              id={id('error-motivo')}
              mensaje={errorDe('motivo')}
            />
          </div>

          <div className="rrhh-form__campo">
            <EtiquetaObligatoria htmlFor={id('empresa')}>Empresa</EtiquetaObligatoria>
            <select
              id={id('empresa')}
              name="empresa"
              value={valor.empresaId ?? ''}
              required
              aria-required="true"
              {...propsError('empresaId', 'empresa')}
              onChange={(evento) =>
                cambiar({
                  campo: 'empresaId',
                  valor: comoId<EmpresaId>(evento.target.value),
                })
              }
            >
              <option value="">Selecciona una empresa</option>
              {catalogos.empresas.map((empresa) => (
                <option key={empresa.id} value={empresa.id}>
                  {empresa.nombre}
                </option>
              ))}
            </select>
            <MensajeErrorCampo
              id={id('error-empresa')}
              mensaje={errorDe('empresaId')}
            />
          </div>

          {valor.motivo === 'reemplazo' ? (
            <div className="rrhh-form__campo">
              <EtiquetaObligatoria htmlFor={id('colaborador')}>
                Colaborador a reemplazar
              </EtiquetaObligatoria>
              <select
                id={id('colaborador')}
                name="colaborador-a-reemplazar"
                value={valor.colaboradorAReemplazarId ?? ''}
                required
                aria-required="true"
                {...propsError('colaboradorAReemplazarId', 'colaborador')}
                onChange={(evento) =>
                  cambiar({
                    campo: 'colaboradorAReemplazarId',
                    valor: comoId<ColaboradorId>(evento.target.value),
                  })
                }
              >
                <option value="">Selecciona un colaborador</option>
                {colaboradores.map((colaborador) => (
                  <option key={colaborador.id} value={colaborador.id}>
                    {colaborador.nombre}
                  </option>
                ))}
              </select>
              <MensajeErrorCampo
                id={id('error-colaborador')}
                mensaje={errorDe('colaboradorAReemplazarId')}
              />
            </div>
          ) : null}

          <div className="rrhh-form__campo">
            <EtiquetaObligatoria htmlFor={id('vacantes')}>
              Cantidad de vacantes
            </EtiquetaObligatoria>
            <input
              id={id('vacantes')}
              name="vacantes"
              type="number"
              min={1}
              step={1}
              inputMode="numeric"
              required
              aria-required="true"
              {...propsError('vacantes', 'vacantes')}
              value={valor.vacantes ?? ''}
              onChange={(evento) =>
                cambiar({
                  campo: 'vacantes',
                  valor: evento.target.value === '' ? null : evento.target.value,
                })
              }
            />
            <MensajeErrorCampo
              id={id('error-vacantes')}
              mensaje={errorDe('vacantes')}
            />
          </div>

          <div className="rrhh-form__campo">
            <EtiquetaObligatoria htmlFor={id('remuneracion')}>
              Remuneración mensual (PEN)
            </EtiquetaObligatoria>
            <input
              id={id('remuneracion')}
              name="remuneracion-mensual"
              type="text"
              inputMode="decimal"
              required
              aria-required="true"
              {...propsError('remuneracionMensual', 'remuneracion')}
              value={valor.remuneracionMensual ?? ''}
              onChange={(evento) =>
                cambiar({
                  campo: 'remuneracionMensual',
                  valor: evento.target.value === '' ? null : evento.target.value,
                })
              }
            />
            <MensajeErrorCampo
              id={id('error-remuneracion')}
              mensaje={errorDe('remuneracionMensual')}
            />
          </div>

          <div className="rrhh-form__campo">
            <EtiquetaObligatoria htmlFor={id('usuario')}>
              Usuario de próxima tarea
            </EtiquetaObligatoria>
            <select
              id={id('usuario')}
              name="usuario-proxima-tarea"
              value={valor.usuarioProximaTareaId ?? ''}
              required
              aria-required="true"
              {...propsError('usuarioProximaTareaId', 'usuario')}
              onChange={(evento) =>
                cambiar({
                  campo: 'usuarioProximaTareaId',
                  valor: comoId<UsuarioId>(evento.target.value),
                })
              }
            >
              <option value="">Selecciona un usuario</option>
              {catalogos.usuariosProximaTarea.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nombre}
                </option>
              ))}
            </select>
            <MensajeErrorCampo
              id={id('error-usuario')}
              mensaje={errorDe('usuarioProximaTareaId')}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="rrhh-form__grupo" disabled={deshabilitado}>
        <legend>Clasificación y ubicación del puesto</legend>
        <div className="rrhh-form__campos">
          <div className="rrhh-form__campo">
            <EtiquetaObligatoria htmlFor={id('departamento')}>
              Departamento
            </EtiquetaObligatoria>
            <select
              id={id('departamento')}
              name="departamento"
              value={valor.departamentoId ?? ''}
              required
              aria-required="true"
              {...propsError('departamentoId', 'departamento')}
              onChange={(evento) =>
                cambiar({
                  campo: 'departamentoId',
                  valor: comoId<DepartamentoId>(evento.target.value),
                })
              }
            >
              <option value="">Selecciona un departamento</option>
              {catalogos.departamentos.map((departamento) => (
                <option key={departamento.id} value={departamento.id}>
                  {departamento.nombre}
                </option>
              ))}
            </select>
            <MensajeErrorCampo
              id={id('error-departamento')}
              mensaje={errorDe('departamentoId')}
            />
          </div>

          <div className="rrhh-form__campo">
            <EtiquetaObligatoria htmlFor={id('area')}>Área</EtiquetaObligatoria>
            <select
              id={id('area')}
              name="area"
              value={valor.areaId ?? ''}
              disabled={sinDepartamento}
              required
              aria-required="true"
              {...propsError('areaId', 'area')}
              onChange={(evento) =>
                cambiar({
                  campo: 'areaId',
                  valor: comoId<AreaId>(evento.target.value),
                })
              }
            >
              <option value="">Selecciona un área</option>
              {areasDisponibles(catalogos, valor.departamentoId).map((area) => (
                <option key={area.id} value={area.id}>
                  {area.nombre}
                </option>
              ))}
            </select>
            <MensajeErrorCampo id={id('error-area')} mensaje={errorDe('areaId')} />
          </div>

          <div className="rrhh-form__campo">
            <label htmlFor={id('subarea')}>Subárea</label>
            <select
              id={id('subarea')}
              name="subarea"
              value={valor.subareaId ?? ''}
              disabled={sinArea}
              {...propsError('subareaId', 'subarea')}
              onChange={(evento) =>
                cambiar({
                  campo: 'subareaId',
                  valor: comoId<SubareaId>(evento.target.value),
                })
              }
            >
              <option value="">Sin subárea</option>
              {subareasDisponibles(catalogos, valor.areaId).map((subarea) => (
                <option key={subarea.id} value={subarea.id}>
                  {subarea.nombre}
                </option>
              ))}
            </select>
            <MensajeErrorCampo
              id={id('error-subarea')}
              mensaje={errorDe('subareaId')}
            />
          </div>

          <div className="rrhh-form__campo">
            <EtiquetaObligatoria htmlFor={id('puesto')}>Puesto</EtiquetaObligatoria>
            <select
              id={id('puesto')}
              name="puesto"
              value={valor.puestoId ?? ''}
              disabled={sinArea}
              required
              aria-required="true"
              {...propsError('puestoId', 'puesto')}
              onChange={(evento) =>
                cambiar({
                  campo: 'puestoId',
                  valor: comoId<PuestoId>(evento.target.value),
                })
              }
            >
              <option value="">Selecciona un puesto</option>
              {puestosDisponibles(
                catalogos,
                valor.areaId,
                valor.subareaId,
              ).map((puesto) => (
                <option key={puesto.id} value={puesto.id}>
                  {puesto.nombre}
                </option>
              ))}
            </select>
            <MensajeErrorCampo
              id={id('error-puesto')}
              mensaje={errorDe('puestoId')}
            />
          </div>
        </div>

        <div className="rrhh-form__derivados">
          <p className="rrhh-form__derivado">
            <span className="rrhh-form__derivado-label">Clasificación</span>
            <span aria-live="polite">
              {clasificacion
                ? CLASIFICACION_ETIQUETAS[clasificacion]
                : 'Se calcula con el puesto'}
            </span>
          </p>
          <p className="rrhh-form__derivado">
            <span className="rrhh-form__derivado-label">Duración aplicable</span>
            <span aria-live="polite">
              {duracion
                ? duracion.diasHabiles === null
                  ? 'Plazo pendiente de definir'
                  : `${duracion.diasHabiles} días hábiles`
                : 'Se calcula al aprobar'}
            </span>
            <span className="rrhh-form__ayuda">{AVISO_DURACION}</span>
          </p>
        </div>
      </fieldset>

      <fieldset className="rrhh-form__grupo" disabled={deshabilitado}>
        <legend>Ubicación</legend>
        <div className="rrhh-form__campos">
          <div className="rrhh-form__campo">
            <EtiquetaObligatoria htmlFor={id('departamento-ubicacion')}>
              Departamento de ubicación
            </EtiquetaObligatoria>
            <select
              id={id('departamento-ubicacion')}
              name="departamento-ubicacion"
              value={valor.departamentoUbicacionId ?? ''}
              required
              aria-required="true"
              {...propsError('departamentoUbicacionId', 'departamento-ubicacion')}
              onChange={(evento) =>
                cambiar({
                  campo: 'departamentoUbicacionId',
                  valor: comoId<DepartamentoUbicacionId>(evento.target.value),
                })
              }
            >
              <option value="">Selecciona un departamento</option>
              {catalogos.departamentosUbicacion.map((departamento) => (
                <option key={departamento.id} value={departamento.id}>
                  {departamento.nombre}
                </option>
              ))}
            </select>
            <MensajeErrorCampo
              id={id('error-departamento-ubicacion')}
              mensaje={errorDe('departamentoUbicacionId')}
            />
          </div>

          <div className="rrhh-form__campo">
            <EtiquetaObligatoria htmlFor={id('provincia')}>
              Provincia
            </EtiquetaObligatoria>
            <select
              id={id('provincia')}
              name="provincia"
              value={valor.provinciaId ?? ''}
              disabled={sinUbicacionDepartamento}
              required
              aria-required="true"
              {...propsError('provinciaId', 'provincia')}
              onChange={(evento) =>
                cambiar({
                  campo: 'provinciaId',
                  valor: comoId<ProvinciaId>(evento.target.value),
                })
              }
            >
              <option value="">Selecciona una provincia</option>
              {provinciasDisponibles(
                catalogos,
                valor.departamentoUbicacionId,
              ).map((provincia) => (
                <option key={provincia.id} value={provincia.id}>
                  {provincia.nombre}
                </option>
              ))}
            </select>
            <MensajeErrorCampo
              id={id('error-provincia')}
              mensaje={errorDe('provinciaId')}
            />
          </div>

          <div className="rrhh-form__campo">
            <EtiquetaObligatoria htmlFor={id('distrito')}>
              Distrito
            </EtiquetaObligatoria>
            <select
              id={id('distrito')}
              name="distrito"
              value={valor.distritoId ?? ''}
              disabled={sinProvincia}
              required
              aria-required="true"
              {...propsError('distritoId', 'distrito')}
              onChange={(evento) =>
                cambiar({
                  campo: 'distritoId',
                  valor: comoId<DistritoId>(evento.target.value),
                })
              }
            >
              <option value="">Selecciona un distrito</option>
              {distritosDisponibles(catalogos, valor.provinciaId).map(
                (distrito) => (
                  <option key={distrito.id} value={distrito.id}>
                    {distrito.nombre}
                  </option>
                ),
              )}
            </select>
            <MensajeErrorCampo
              id={id('error-distrito')}
              mensaje={errorDe('distritoId')}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="rrhh-form__grupo" disabled={deshabilitado}>
        <legend>Justificación</legend>
        <div className="rrhh-form__campo rrhh-form__campo--ancho">
          <EtiquetaObligatoria htmlFor={id('comentario')}>
            Comentario
          </EtiquetaObligatoria>
          <textarea
            id={id('comentario')}
            name="comentario"
            rows={4}
            required
            aria-required="true"
            {...propsError('comentario', 'comentario')}
            value={valor.comentario ?? ''}
            onChange={(evento) =>
              cambiar({
                campo: 'comentario',
                valor: evento.target.value === '' ? null : evento.target.value,
              })
            }
          />
          <MensajeErrorCampo
            id={id('error-comentario')}
            mensaje={errorDe('comentario')}
          />
        </div>
      </fieldset>
    </form>
  )
}
