/** @vitest-environment jsdom */
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Capability } from '../../../../shared'
import { CAP_RRHH_REQUERIMIENTOS_READ } from '../../identifiers'
import type {
  Area,
  AreaId,
  AutorizacionRequerimiento,
  CoberturaRequerimiento,
  ColaboradorId,
  ColaboradorReemplazo,
  Departamento,
  DepartamentoId,
  DepartamentoUbicacion,
  DepartamentoUbicacionId,
  DetalleRequerimientoBorrador,
  DetalleRequerimientoCompleto,
  Distrito,
  DistritoId,
  Empresa,
  EmpresaId,
  EventoCreacion,
  EventoHistorialId,
  FechaISO,
  InstanteISO,
  PlazoOperativo,
  Provincia,
  ProvinciaId,
  Puesto,
  PuestoId,
  RequerimientoId,
  Subarea,
  SubareaId,
  Usuario,
  UsuarioId,
} from '../contracts'
import { DetalleRequerimiento } from './DetalleRequerimiento'

afterEach(cleanup)

const capability = CAP_RRHH_REQUERIMIENTOS_READ as Capability

const empresa: Empresa = { id: 'empresa-1' as EmpresaId, nombre: 'Honda' }
const departamento: Departamento = {
  id: 'departamento-1' as DepartamentoId,
  nombre: 'Operaciones',
}
const area: Area = {
  id: 'area-1' as AreaId,
  nombre: 'Almacén',
  departamentoId: departamento.id,
}
const subarea: Subarea = {
  id: 'subarea-1' as SubareaId,
  nombre: 'Despacho',
  areaId: area.id,
}
const puesto: Puesto = {
  id: 'puesto-1' as PuestoId,
  nombre: 'Operario de Almacén',
  areaId: area.id,
  subareaId: subarea.id,
  clasificacion: 'operativo',
}
const departamentoUbicacion: DepartamentoUbicacion = {
  id: 'dep-ubic-1' as DepartamentoUbicacionId,
  nombre: 'Callao',
}
const provincia: Provincia = {
  id: 'provincia-1' as ProvinciaId,
  nombre: 'Callao',
  departamentoId: departamentoUbicacion.id,
}
const distrito: Distrito = {
  id: 'distrito-1' as DistritoId,
  nombre: 'Callao',
  provinciaId: provincia.id,
}
const solicitante: Usuario = {
  id: 'usuario-1' as UsuarioId,
  nombre: 'Francisco Schenone',
}

const colaboradorAReemplazar: ColaboradorReemplazo = {
  id: 'colaborador-1' as ColaboradorId,
  nombre: 'Luis Torres',
}

const plazoOperativo: PlazoOperativo = {
  clasificacion: 'operativo',
  duracionDiasHabiles: 10,
  origen: 'operativo-fijo',
  fechaAprobacion: '2026-01-05' as FechaISO,
  fechaObjetivo: '2026-01-19' as FechaISO,
  cumplimiento: 'en-plazo',
  alerta: null,
}

const cobertura: CoberturaRequerimiento = {
  solicitadas: 4,
  cubiertas: 2,
  pendientes: 2,
  primerosDiasReales: [],
}

function autorizacion(id: RequerimientoId): AutorizacionRequerimiento {
  return {
    requerimientoId: id,
    version: 1,
    capacidades: [capability],
    accionesPermitidas: [],
  }
}

function eventoCreacion(): EventoCreacion {
  return {
    id: 'evento-1' as EventoHistorialId,
    usuario: solicitante,
    fechaHora: '2026-01-02T10:30:00Z' as InstanteISO,
    accion: 'creacion',
    estadoNuevo: 'borrador',
    comentario: null,
  }
}

function detalleCompleto(
  overrides: Partial<DetalleRequerimientoCompleto> = {},
): DetalleRequerimientoCompleto {
  const id = overrides.id ?? ('req-1' as RequerimientoId)
  return {
    id,
    version: 1,
    estado: 'pendiente-aprobacion',
    fechaCreacion: '2026-01-02T10:30:00Z' as InstanteISO,
    historial: [eventoCreacion()],
    autorizacion: autorizacion(id),
    motivo: 'reemplazo',
    empresa,
    colaboradorAReemplazar,
    departamento,
    area,
    subarea,
    puesto,
    remuneracion: { monto: 1800, moneda: 'PEN' },
    ubicacion: { departamento: departamentoUbicacion, provincia, distrito },
    usuarioProximaTarea: solicitante,
    comentario: 'Reemplazo por rotación',
    plazo: plazoOperativo,
    cobertura,
    remuneracionPreviaAlta: null,
    procesoSeleccion: null,
    ...overrides,
  }
}

function detalleBorrador(): DetalleRequerimientoBorrador {
  const id = 'req-borrador' as RequerimientoId
  return {
    id,
    version: 1,
    estado: 'borrador',
    fechaCreacion: '2026-01-01T09:00:00Z' as InstanteISO,
    historial: [],
    autorizacion: autorizacion(id),
    borrador: {
      motivo: null,
      empresaId: null,
      colaboradorAReemplazarId: null,
      departamentoId: null,
      areaId: null,
      subareaId: null,
      puestoId: null,
      vacantes: null,
      remuneracion: null,
      ubicacion: null,
      usuarioProximaTareaId: null,
      comentario: null,
    },
    plazo: null,
    cobertura: null,
    remuneracionPreviaAlta: null,
    procesoSeleccion: null,
  }
}

describe('DetalleRequerimiento (UX-04, presentacional)', () => {
  it('muestra el título, la etiqueta del estado y el botón «Asociar candidato»', () => {
    render(<DetalleRequerimiento detalle={detalleCompleto()} />)

    expect(
      screen.getByRole('heading', { name: 'Detalle de requerimiento' }),
    ).toBeDefined()
    expect(screen.getByText('Pendiente de aprobación')).toBeDefined()
    expect(
      screen.getByRole('button', { name: /Asociar candidato/ }),
    ).toBeDefined()
  })

  it('invoca onAsociarCandidato y onVolver desde los botones de acción', () => {
    const onAsociarCandidato = vi.fn()
    const onVolver = vi.fn()
    render(
      <DetalleRequerimiento
        detalle={detalleCompleto()}
        onAsociarCandidato={onAsociarCandidato}
        onVolver={onVolver}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /Asociar candidato/ }))
    fireEvent.click(
      screen.getByRole('button', { name: /Volver a la bandeja/ }),
    )

    expect(onAsociarCandidato).toHaveBeenCalledTimes(1)
    expect(onVolver).toHaveBeenCalledTimes(1)
  })

  it('renderiza un borrador sin campos completos usando marcadores de dato ausente', () => {
    render(<DetalleRequerimiento detalle={detalleBorrador()} />)

    expect(
      screen.getByRole('heading', { name: 'Detalle de requerimiento' }),
    ).toBeDefined()
    expect(screen.getByText('Borrador')).toBeDefined()
    expect(screen.getAllByText(/Sin dato/).length).toBeGreaterThan(0)
  })
})
