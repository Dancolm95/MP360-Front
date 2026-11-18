import type {
  Area,
  CatalogosRequerimientos,
  Distrito,
  Provincia,
  Puesto,
  Subarea,
} from '../contracts'
import type { FormularioRequerimientoInput } from '../model'

export function areasDisponibles(
  catalogos: CatalogosRequerimientos,
  departamentoId: FormularioRequerimientoInput['departamentoId'],
): readonly Area[] {
  return catalogos.areas.filter(
    (area) => !departamentoId || area.departamentoId === departamentoId,
  )
}

export function subareasDisponibles(
  catalogos: CatalogosRequerimientos,
  areaId: FormularioRequerimientoInput['areaId'],
): readonly Subarea[] {
  return catalogos.subareas.filter(
    (subarea) => !areaId || subarea.areaId === areaId,
  )
}

export function puestosDisponibles(
  catalogos: CatalogosRequerimientos,
  areaId: FormularioRequerimientoInput['areaId'],
  subareaId: FormularioRequerimientoInput['subareaId'],
): readonly Puesto[] {
  return catalogos.puestos.filter(
    (puesto) =>
      (!areaId || puesto.areaId === areaId) && puesto.subareaId === subareaId,
  )
}

export function provinciasDisponibles(
  catalogos: CatalogosRequerimientos,
  departamentoUbicacionId: FormularioRequerimientoInput['departamentoUbicacionId'],
): readonly Provincia[] {
  return catalogos.provincias.filter(
    (provincia) =>
      !departamentoUbicacionId ||
      provincia.departamentoId === departamentoUbicacionId,
  )
}

export function distritosDisponibles(
  catalogos: CatalogosRequerimientos,
  provinciaId: FormularioRequerimientoInput['provinciaId'],
): readonly Distrito[] {
  return catalogos.distritos.filter(
    (distrito) => !provinciaId || distrito.provinciaId === provinciaId,
  )
}
