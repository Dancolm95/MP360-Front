/** @vitest-environment jsdom */
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Capability } from '../../../../shared'
import { CAP_RRHH_REQUERIMIENTOS_READ } from '../../identifiers'
import type {
  AlertaPlazoOperativo,
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
  EventoCambioEstado,
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

const eventoAprobacion: EventoCambioEstado = {
  id: 'evento-2' as EventoHistorialId,
  usuario: solicitante,
  fechaHora: '2026-01-03T09:00:00Z' as InstanteISO,
  accion: 'aprobacion',
  estadoAnterior: 'pendiente-aprobacion',
  estadoNuevo: 'aprobado',
  comentario: 'Aprobación registrada',
}

const alertaCritica: AlertaPlazoOperativo = {
  nivel: 'critica',
  umbral: { tipo: 'dias-fijos', clasificacion: 'operativo', diaHabil: 9 },
  diaHabil: 9,
  fecha: '2026-01-16' as FechaISO,
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

  it('estructura el resumen y la cobertura con encabezados y listas de definición', () => {
    render(<DetalleRequerimiento detalle={detalleCompleto()} />)

    expect(
      screen.getAllByRole('heading', { level: 2 }).map((h2) => h2.textContent),
    ).toEqual(['Resumen', 'Cobertura', 'Plazo', 'Historial', 'Postulantes'])

    const resumen = screen.getByRole('heading', { name: 'Resumen' }).closest('section')
    expect(resumen).not.toBeNull()
    const resumenDl = within(resumen as HTMLElement).getByText('Motivo')
    expect(resumenDl.tagName).toBe('DT')
    expect(resumenDl.closest('dl')).not.toBeNull()
    expect(
      within(resumen as HTMLElement).getByText('Reemplazo').tagName,
    ).toBe('DD')

    const coberturaSeccion = screen
      .getByRole('heading', { name: 'Cobertura' })
      .closest('section')
    expect(coberturaSeccion).not.toBeNull()
    expect(
      within(coberturaSeccion as HTMLElement).getByText('Vacantes solicitadas')
        .tagName,
    ).toBe('DT')
    expect(
      within(coberturaSeccion as HTMLElement).getByText('4').tagName,
    ).toBe('DD')
  })

  it('expone el invariante de cobertura por texto y no lo deja al color', () => {
    const { rerender } = render(
      <DetalleRequerimiento detalle={detalleCompleto()} />,
    )
    expect(
      screen.getByText(
        'Cobertura consistente: pendientes = solicitadas − cubiertas (2).',
      ),
    ).toBeDefined()

    rerender(
      <DetalleRequerimiento
        detalle={detalleCompleto({
          cobertura: {
            solicitadas: 4,
            cubiertas: 2,
            pendientes: 3,
            primerosDiasReales: [],
          },
        })}
      />,
    )
    expect(screen.getByText(/Cobertura inconsistente/)).toBeDefined()
  })

  it('presenta la alerta con texto e icono y la distingue del incumplimiento del plazo', () => {
    render(
      <DetalleRequerimiento
        detalle={detalleCompleto({
          plazo: {
            ...plazoOperativo,
            cumplimiento: 'incumplido',
            alerta: alertaCritica,
          },
        })}
      />,
    )

    const alerta = screen.getByText(/Alerta: Crítica/)
    expect(alerta.querySelector('[aria-hidden="true"]')?.textContent).toBe('▲')

    const plazoSeccion = screen.getByRole('heading', { name: 'Plazo' }).closest('section')
    expect(plazoSeccion).not.toBeNull()
    expect(within(plazoSeccion as HTMLElement).getByText('Incumplido').tagName)
      .toBe('DD')
    expect(within(plazoSeccion as HTMLElement).queryByText(/Alerta/)).toBeNull()
  })

  it('ordena el historial del más reciente al más antiguo y muestra estado y comentario', () => {
    render(
      <DetalleRequerimiento
        detalle={detalleCompleto({
          estado: 'aprobado',
          historial: [eventoCreacion(), eventoAprobacion],
        })}
      />,
    )

    const historial = screen
      .getByRole('heading', { name: 'Historial' })
      .closest('section')
    expect(historial).not.toBeNull()
    expect(
      within(historial as HTMLElement).getByText(
        'Orden: del más reciente al más antiguo.',
      ),
    ).toBeDefined()

    const entradas = within(historial as HTMLElement).getAllByRole('listitem')
    expect(entradas).toHaveLength(2)
    expect(entradas[0].textContent).toContain('Aprobación')
    expect(entradas[0].textContent).toContain(
      'Pendiente de aprobación → Aprobado',
    )
    expect(entradas[0].textContent).toContain('Aprobación registrada')
    expect(entradas[0].textContent).toContain('03/01/2026 09:00')
    expect(entradas[1].textContent).toContain('Creación')
    expect(entradas[1].textContent).toContain('Borrador')
  })

  it('lleva el foco al título del detalle al abrirse', () => {
    render(<DetalleRequerimiento detalle={detalleCompleto()} />)

    expect(document.activeElement).toBe(
      screen.getByRole('heading', { name: 'Detalle de requerimiento' }),
    )
  })

  it('anuncia la carga, el error con reintento y la lectura sin permisos', () => {
    const reintentar = vi.fn()
    const { rerender } = render(<DetalleRequerimiento estado="cargando" />)

    expect(screen.getByRole('status').textContent).toContain(
      'Cargando requerimiento',
    )
    expect(screen.queryByRole('heading', { name: 'Resumen' })).toBeNull()

    rerender(
      <DetalleRequerimiento
        estado="error"
        mensajeError="Fallo de red"
        onReintentar={reintentar}
      />,
    )
    const error = screen.getByRole('alert')
    expect(error.textContent).toContain('No se pudo cargar el requerimiento')
    expect(error.textContent).toContain('Fallo de red')
    fireEvent.click(within(error).getByRole('button', { name: 'Reintentar' }))
    expect(reintentar).toHaveBeenCalledTimes(1)

    rerender(<DetalleRequerimiento estado="sin-permisos" />)
    const sinPermisos = screen.getByRole('alert')
    expect(sinPermisos.textContent).toContain('Sin permisos')
    expect(sinPermisos.textContent).toContain(
      'No tienes acceso de lectura a este requerimiento.',
    )
  })
})
