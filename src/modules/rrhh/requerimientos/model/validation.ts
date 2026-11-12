import type { Clasificacion, MotivoRequerimiento } from '../contracts'
import type {
  ContextoValidacionFormulario,
  ErrorFormulario,
  FormularioRequerimientoInput,
  RemuneracionPenParseada,
  ResultadoValidacionCampo,
  ResultadoValidacionFormulario,
  SeleccionOrganizacional,
  SeleccionUbicacion,
} from './types'

export function validarVacantes(value: unknown): ResultadoValidacionCampo<number> {
  const parsed =
    typeof value === 'number'
      ? value
      : typeof value === 'string' && /^\d+$/.test(value)
        ? Number(value)
        : Number.NaN

  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    return { ok: false, code: 'entero-minimo' }
  }
  return { ok: true, value: parsed }
}

export function parsearRemuneracionPen(
  value: unknown,
  motivo: MotivoRequerimiento | null,
): ResultadoValidacionCampo<RemuneracionPenParseada> {
  if (typeof value !== 'string') {
    return { ok: false, code: 'formato-decimal' }
  }
  if (value.startsWith('-')) {
    return { ok: false, code: 'importe-negativo' }
  }

  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(value)
  if (!match) {
    return { ok: false, code: 'formato-decimal' }
  }

  const centavos =
    Number(match[1]) * 100 + Number((match[2] ?? '').padEnd(2, '0'))
  if (!Number.isSafeInteger(centavos)) {
    return { ok: false, code: 'formato-decimal' }
  }
  if (centavos === 0 && motivo !== 'practicante') {
    return { ok: false, code: 'importe-debe-ser-positivo' }
  }

  return {
    ok: true,
    value: {
      centavos,
      remuneracion: { monto: centavos / 100, moneda: 'PEN' },
    },
  }
}

export function comprobarJerarquiaOrganizacional(
  seleccion: SeleccionOrganizacional,
  context: ContextoValidacionFormulario,
): boolean {
  const area = context.areas.find((item) => item.id === seleccion.areaId)
  const subarea = context.subareas.find((item) => item.id === seleccion.subareaId)
  const puesto = context.puestos.find((item) => item.id === seleccion.puestoId)

  return Boolean(
    context.departamentos.some((item) => item.id === seleccion.departamentoId) &&
      area?.departamentoId === seleccion.departamentoId &&
      subarea?.areaId === area.id &&
      puesto?.areaId === area.id &&
      puesto.subareaId === subarea.id,
  )
}

export function comprobarJerarquiaUbicacion(
  seleccion: SeleccionUbicacion,
  context: ContextoValidacionFormulario,
): boolean {
  const provincia = context.provincias.find(
    (item) => item.id === seleccion.provinciaId,
  )
  const distrito = context.distritos.find(
    (item) => item.id === seleccion.distritoId,
  )

  return Boolean(
    context.departamentosUbicacion.some(
      (item) => item.id === seleccion.departamentoId,
    ) &&
      provincia?.departamentoId === seleccion.departamentoId &&
      distrito?.provinciaId === provincia.id,
  )
}

export function derivarClasificacion(
  seleccion: SeleccionOrganizacional,
  context: ContextoValidacionFormulario,
): Clasificacion | null {
  if (!comprobarJerarquiaOrganizacional(seleccion, context)) return null
  return (
    context.puestos.find((item) => item.id === seleccion.puestoId)
      ?.clasificacion ?? null
  )
}

function requiredErrors(input: FormularioRequerimientoInput): ErrorFormulario[] {
  const errors: ErrorFormulario[] = []
  const required = <T>(field: ErrorFormulario['field'], value: T | null) => {
    if (value === null) errors.push({ field, code: 'obligatorio' })
  }

  required('motivo', input.motivo)
  required('empresaId', input.empresaId)
  required('departamentoId', input.departamentoId)
  required('areaId', input.areaId)
  required('subareaId', input.subareaId)
  required('puestoId', input.puestoId)
  required('vacantes', input.vacantes)
  required('remuneracionMensual', input.remuneracionMensual)
  required('departamentoUbicacionId', input.departamentoUbicacionId)
  required('provinciaId', input.provinciaId)
  required('distritoId', input.distritoId)
  required('usuarioProximaTareaId', input.usuarioProximaTareaId)
  if (input.motivo === 'reemplazo') {
    required('colaboradorAReemplazarId', input.colaboradorAReemplazarId)
  }
  if (input.comentario === null || input.comentario.trim() === '') {
    errors.push({ field: 'comentario', code: 'obligatorio' })
  }
  return errors
}

function pushSelectionError(
  errors: ErrorFormulario[],
  field: ErrorFormulario['field'],
  exists: boolean,
) {
  if (!exists) errors.push({ field, code: 'seleccion-no-disponible' })
}

export function validarParaEnvio(
  input: FormularioRequerimientoInput,
  context: ContextoValidacionFormulario,
): ResultadoValidacionFormulario {
  const errors = requiredErrors(input)

  if (input.empresaId !== null) {
    pushSelectionError(
      errors,
      'empresaId',
      context.empresas.some((item) => item.id === input.empresaId),
    )
  }
  if (input.usuarioProximaTareaId !== null) {
    pushSelectionError(
      errors,
      'usuarioProximaTareaId',
      context.usuariosProximaTarea.some(
        (item) => item.id === input.usuarioProximaTareaId,
      ),
    )
  }

  const vacantes = input.vacantes === null ? null : validarVacantes(input.vacantes)
  if (vacantes && !vacantes.ok) {
    errors.push({ field: 'vacantes', code: vacantes.code })
  }

  const remuneracion =
    input.remuneracionMensual === null
      ? null
      : parsearRemuneracionPen(input.remuneracionMensual, input.motivo)
  if (remuneracion && !remuneracion.ok) {
    errors.push({ field: 'remuneracionMensual', code: remuneracion.code })
  }

  let clasificacion: Clasificacion | null = null
  if (
    input.departamentoId !== null &&
    input.areaId !== null &&
    input.subareaId !== null &&
    input.puestoId !== null
  ) {
    clasificacion = derivarClasificacion(
      {
        departamentoId: input.departamentoId,
        areaId: input.areaId,
        subareaId: input.subareaId,
        puestoId: input.puestoId,
      },
      context,
    )
    if (clasificacion === null) {
      errors.push({ field: 'puestoId', code: 'jerarquia-inconsistente' })
    }
  }

  if (
    input.departamentoUbicacionId !== null &&
    input.provinciaId !== null &&
    input.distritoId !== null &&
    !comprobarJerarquiaUbicacion(
      {
        departamentoId: input.departamentoUbicacionId,
        provinciaId: input.provinciaId,
        distritoId: input.distritoId,
      },
      context,
    )
  ) {
    errors.push({ field: 'distritoId', code: 'jerarquia-inconsistente' })
  }

  if (errors.length > 0) return { ok: false, errors }

  if (!vacantes?.ok || !remuneracion?.ok || clasificacion === null) {
    return { ok: false, errors }
  }

  return {
    ok: true,
    value: {
      motivo: input.motivo!,
      empresaId: input.empresaId!,
      colaboradorAReemplazarId: input.colaboradorAReemplazarId,
      departamentoId: input.departamentoId!,
      areaId: input.areaId!,
      subareaId: input.subareaId!,
      puestoId: input.puestoId!,
      clasificacion: clasificacion!,
      vacantes: vacantes.value,
      remuneracion: remuneracion.value.remuneracion,
      ubicacion: {
        departamentoId: input.departamentoUbicacionId!,
        provinciaId: input.provinciaId!,
        distritoId: input.distritoId!,
      },
      usuarioProximaTareaId: input.usuarioProximaTareaId!,
      comentario: input.comentario!,
    },
  }
}
