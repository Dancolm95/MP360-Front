import type {
  AreaId,
  BorradorRequerimiento,
  CatalogosRequerimientos,
  Clasificacion,
  ColaboradorId,
  DepartamentoId,
  DepartamentoUbicacionId,
  DetalleRequerimientoEditable,
  DistritoId,
  EmpresaId,
  MotivoRequerimiento,
  ProvinciaId,
  PuestoId,
  Remuneracion,
  SubareaId,
  UsuarioId,
} from '../contracts'
import type {
  ContextoValidacionFormulario,
  FormularioRequerimientoInput,
} from './types'
import { derivarClasificacion } from './validation'

export const FORMULARIO_VACIO: FormularioRequerimientoInput = {
  motivo: null,
  empresaId: null,
  colaboradorAReemplazarId: null,
  departamentoId: null,
  areaId: null,
  subareaId: null,
  puestoId: null,
  vacantes: null,
  remuneracionMensual: null,
  departamentoUbicacionId: null,
  provinciaId: null,
  distritoId: null,
  usuarioProximaTareaId: null,
  comentario: null,
}

/**
 * Formulario inicial de un alta. Solo preselecciona al responsable por defecto
 * del catálogo; el resto queda incompleto a propósito (no se rellenan valores
 * ficticios). Una preselección que no pertenece al catálogo se descarta.
 */
export function crearFormularioVacio(
  catalogos: CatalogosRequerimientos,
): FormularioRequerimientoInput {
  const predeterminado = catalogos.usuarioProximaTareaPredeterminado
  const predeterminadoExiste =
    predeterminado !== null &&
    catalogos.usuariosProximaTarea.some(
      (usuario) => usuario.id === predeterminado,
    )
  const usuarioProximaTareaId = predeterminadoExiste ? predeterminado : null

  return {
    ...FORMULARIO_VACIO,
    usuarioProximaTareaId,
  }
}

export function contextoDesdeCatalogos(
  catalogos: CatalogosRequerimientos,
): ContextoValidacionFormulario {
  return {
    empresas: catalogos.empresas,
    departamentos: catalogos.departamentos,
    areas: catalogos.areas,
    subareas: catalogos.subareas,
    puestos: catalogos.puestos,
    departamentosUbicacion: catalogos.departamentosUbicacion,
    provincias: catalogos.provincias,
    distritos: catalogos.distritos,
    usuariosProximaTarea: catalogos.usuariosProximaTarea,
  }
}

type FormularioMutable = {
  -readonly [K in keyof FormularioRequerimientoInput]: FormularioRequerimientoInput[K]
}

export type CambioFormulario =
  | { readonly campo: 'motivo'; readonly valor: MotivoRequerimiento | null }
  | { readonly campo: 'empresaId'; readonly valor: EmpresaId | null }
  | {
      readonly campo: 'colaboradorAReemplazarId'
      readonly valor: ColaboradorId | null
    }
  | { readonly campo: 'departamentoId'; readonly valor: DepartamentoId | null }
  | { readonly campo: 'areaId'; readonly valor: AreaId | null }
  | { readonly campo: 'subareaId'; readonly valor: SubareaId | null }
  | { readonly campo: 'puestoId'; readonly valor: PuestoId | null }
  | { readonly campo: 'vacantes'; readonly valor: string | number | null }
  | { readonly campo: 'remuneracionMensual'; readonly valor: string | null }
  | {
      readonly campo: 'departamentoUbicacionId'
      readonly valor: DepartamentoUbicacionId | null
    }
  | { readonly campo: 'provinciaId'; readonly valor: ProvinciaId | null }
  | { readonly campo: 'distritoId'; readonly valor: DistritoId | null }
  | {
      readonly campo: 'usuarioProximaTareaId'
      readonly valor: UsuarioId | null
    }
  | { readonly campo: 'comentario'; readonly valor: string | null }

/**
 * Aplica un cambio y limpia las selecciones hijas que dejan de ser válidas.
 * Cambiar de padre descarta el hijo (ningún hijo pertenece a dos padres) y
 * cambiar de motivo descarta el colaborador cuando deja de ser Reemplazo.
 */
export function aplicarCambio(
  actual: FormularioRequerimientoInput,
  cambio: CambioFormulario,
): FormularioRequerimientoInput {
  const siguiente = { ...actual } as FormularioMutable
  const mutable = siguiente as Record<
    keyof FormularioRequerimientoInput,
    unknown
  >
  mutable[cambio.campo] = cambio.valor

  switch (cambio.campo) {
    case 'motivo':
      if (cambio.valor !== 'reemplazo') {
        siguiente.colaboradorAReemplazarId = null
      }
      break
    case 'departamentoId':
      siguiente.areaId = null
      siguiente.subareaId = null
      siguiente.puestoId = null
      break
    case 'areaId':
      siguiente.subareaId = null
      siguiente.puestoId = null
      break
    case 'subareaId':
      siguiente.puestoId = null
      break
    case 'departamentoUbicacionId':
      siguiente.provinciaId = null
      siguiente.distritoId = null
      break
    case 'provinciaId':
      siguiente.distritoId = null
      break
  }

  return siguiente
}

export function clasificacionFormulario(
  valor: FormularioRequerimientoInput,
  catalogos: CatalogosRequerimientos,
): Clasificacion | null {
  if (
    valor.departamentoId === null ||
    valor.areaId === null ||
    valor.puestoId === null
  ) {
    return null
  }

  return derivarClasificacion(
    {
      departamentoId: valor.departamentoId,
      areaId: valor.areaId,
      subareaId: valor.subareaId,
      puestoId: valor.puestoId,
    },
    contextoDesdeCatalogos(catalogos),
  )
}

function formatearMonto(remuneracion: Remuneracion | null): string | null {
  return remuneracion === null ? null : remuneracion.monto.toFixed(2)
}

export function formularioDesdeBorrador(
  borrador: BorradorRequerimiento,
): FormularioRequerimientoInput {
  return {
    motivo: borrador.motivo,
    empresaId: borrador.empresaId,
    colaboradorAReemplazarId: borrador.colaboradorAReemplazarId,
    departamentoId: borrador.departamentoId,
    areaId: borrador.areaId,
    subareaId: borrador.subareaId,
    puestoId: borrador.puestoId,
    vacantes: borrador.vacantes,
    remuneracionMensual: formatearMonto(borrador.remuneracion),
    departamentoUbicacionId: borrador.ubicacion?.departamentoId ?? null,
    provinciaId: borrador.ubicacion?.provinciaId ?? null,
    distritoId: borrador.ubicacion?.distritoId ?? null,
    usuarioProximaTareaId: borrador.usuarioProximaTareaId,
    comentario: borrador.comentario,
  }
}

/**
 * Reconstruye el formulario de un detalle que el contrato permite editar:
 * Borrador, Pendiente de aprobación y Observado. El Cancelado parcial conserva
 * datos, pero no es editable desde UX-03.
 */
export function formularioDesdeDetalle(
  detalle: DetalleRequerimientoEditable,
): FormularioRequerimientoInput {
  if (detalle.estado === 'borrador') {
    return formularioDesdeBorrador(detalle.borrador)
  }

  return {
    motivo: detalle.motivo,
    empresaId: detalle.empresa.id,
    colaboradorAReemplazarId: detalle.colaboradorAReemplazar?.id ?? null,
    departamentoId: detalle.departamento.id,
    areaId: detalle.area.id,
    subareaId: detalle.subarea?.id ?? null,
    puestoId: detalle.puesto.id,
    vacantes: detalle.cobertura.solicitadas,
    remuneracionMensual: formatearMonto(detalle.remuneracion),
    departamentoUbicacionId: detalle.ubicacion.departamento.id,
    provinciaId: detalle.ubicacion.provincia.id,
    distritoId: detalle.ubicacion.distrito.id,
    usuarioProximaTareaId: detalle.usuarioProximaTarea?.id ?? null,
    comentario: detalle.comentario,
  }
}
