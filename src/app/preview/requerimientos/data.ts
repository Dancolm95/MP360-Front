import { CAP_RRHH_REQUERIMIENTOS_READ } from '../../../modules/rrhh/identifiers'
import type {
  AlertaPlazoOperativo,
  Area,
  AreaId,
  AutorizacionRequerimiento,
  CalendarioLaboralId,
  CalendarioLaboralUnico,
  CatalogosRequerimientos,
  CoberturaRequerimiento,
  ColaboradorId,
  ColaboradorReemplazo,
  Departamento,
  DepartamentoId,
  DepartamentoUbicacion,
  DepartamentoUbicacionId,
  DetalleRequerimientoCompleto,
  Distrito,
  DistritoId,
  DuracionAplicable,
  Empresa,
  EmpresaId,
  EventoAlertaHistorial,
  EventoCambioEstado,
  EventoCreacion,
  EventoHistorialId,
  FechaISO,
  InstanteISO,
  MotivoCatalogoItem,
  PaginaRequerimientos,
  PlazoOperativo,
  Provincia,
  ProvinciaId,
  Puesto,
  PuestoId,
  RequerimientoId,
  ResumenRequerimiento,
  ResumenRequerimientoBorrador,
  ResumenRequerimientoCompleto,
  Subarea,
  SubareaId,
  Usuario,
  UsuarioId,
} from '../../../modules/rrhh/requerimientos/contracts'
import { MOTIVOS, MOTIVO_LABELS } from '../../../modules/rrhh/requerimientos/tray/formato'

const EMPRESA_HONDA: Empresa = {
  id: 'emp-honda' as EmpresaId,
  nombre: 'Honda del Perú',
}
const EMPRESA_YAMAHA: Empresa = {
  id: 'emp-yamaha' as EmpresaId,
  nombre: 'Yamaha Motor',
}

const DEPARTAMENTO_OPERACIONES: Departamento = {
  id: 'dep-operaciones' as DepartamentoId,
  nombre: 'Operaciones',
}
const DEPARTAMENTO_COMERCIAL: Departamento = {
  id: 'dep-comercial' as DepartamentoId,
  nombre: 'Comercial',
}

const AREA_ALMACEN: Area = {
  id: 'area-almacen' as AreaId,
  nombre: 'Almacén',
  departamentoId: DEPARTAMENTO_OPERACIONES.id,
}
const AREA_LOGISTICA: Area = {
  id: 'area-logistica' as AreaId,
  nombre: 'Logística',
  departamentoId: DEPARTAMENTO_OPERACIONES.id,
}
const AREA_VENTAS: Area = {
  id: 'area-ventas' as AreaId,
  nombre: 'Ventas',
  departamentoId: DEPARTAMENTO_COMERCIAL.id,
}

const SUBAREA_DESPACHO: Subarea = {
  id: 'sub-despacho' as SubareaId,
  nombre: 'Despacho',
  areaId: AREA_ALMACEN.id,
}
const SUBAREA_RECEPCION: Subarea = {
  id: 'sub-recepcion' as SubareaId,
  nombre: 'Recepción',
  areaId: AREA_ALMACEN.id,
}
const SUBAREA_DISTRIBUCION: Subarea = {
  id: 'sub-distribucion' as SubareaId,
  nombre: 'Distribución',
  areaId: AREA_LOGISTICA.id,
}

const PUESTO_OPERARIO: Puesto = {
  id: 'puesto-operario' as PuestoId,
  nombre: 'Operario de Almacén',
  areaId: AREA_ALMACEN.id,
  subareaId: SUBAREA_DESPACHO.id,
  clasificacion: 'operativo',
}
const PUESTO_AUXILIAR: Puesto = {
  id: 'puesto-auxiliar' as PuestoId,
  nombre: 'Auxiliar de Despacho',
  areaId: AREA_ALMACEN.id,
  subareaId: SUBAREA_DESPACHO.id,
  clasificacion: 'operativo',
}
const PUESTO_SUPERVISOR: Puesto = {
  id: 'puesto-supervisor' as PuestoId,
  nombre: 'Supervisor de Logística',
  areaId: AREA_LOGISTICA.id,
  subareaId: SUBAREA_DISTRIBUCION.id,
  clasificacion: 'administrativo',
}
const PUESTO_ANALISTA_VENTAS: Puesto = {
  id: 'puesto-analista-ventas' as PuestoId,
  nombre: 'Analista de Ventas',
  areaId: AREA_VENTAS.id,
  subareaId: null,
  clasificacion: 'administrativo',
}

const DEP_UBICACION_CALLAO: DepartamentoUbicacion = {
  id: 'dep-ubic-callao' as DepartamentoUbicacionId,
  nombre: 'Callao',
}
const DEP_UBICACION_LIMA: DepartamentoUbicacion = {
  id: 'dep-ubic-lima' as DepartamentoUbicacionId,
  nombre: 'Lima',
}
const PROVINCIA_CALLAO: Provincia = {
  id: 'prov-callao' as ProvinciaId,
  nombre: 'Callao',
  departamentoId: DEP_UBICACION_CALLAO.id,
}
const PROVINCIA_LIMA: Provincia = {
  id: 'prov-lima' as ProvinciaId,
  nombre: 'Lima',
  departamentoId: DEP_UBICACION_LIMA.id,
}
const DISTRITO_CALLAO: Distrito = {
  id: 'dist-callao' as DistritoId,
  nombre: 'Callao',
  provinciaId: PROVINCIA_CALLAO.id,
}
const DISTRITO_VENTANILLA: Distrito = {
  id: 'dist-ventanilla' as DistritoId,
  nombre: 'Ventanilla',
  provinciaId: PROVINCIA_CALLAO.id,
}
const DISTRITO_SAN_MIGUEL: Distrito = {
  id: 'dist-san-miguel' as DistritoId,
  nombre: 'San Miguel',
  provinciaId: PROVINCIA_LIMA.id,
}

const USUARIO_SCHENONE: Usuario = {
  id: 'usr-schenone' as UsuarioId,
  nombre: 'Francisco Schenone',
}
const USUARIO_RIOS: Usuario = {
  id: 'usr-rios' as UsuarioId,
  nombre: 'María Ríos',
}
const USUARIO_PAREDES: Usuario = {
  id: 'usr-paredes' as UsuarioId,
  nombre: 'Carlos Paredes',
}

const CALENDARIO_LABORAL: CalendarioLaboralUnico = {
  id: 'calendario-unico' as CalendarioLaboralId,
  diasHabiles: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'],
  excepciones: [
    { fecha: '2026-01-01' as FechaISO, habil: false },
    { fecha: '2026-07-28' as FechaISO, habil: false },
  ],
}

const MOTIVOS_CATALOGO: readonly MotivoCatalogoItem[] = MOTIVOS.map((motivo) => ({
  motivo,
  etiqueta: MOTIVO_LABELS[motivo],
}))

export const CATALOGOS: CatalogosRequerimientos = {
  motivos: MOTIVOS_CATALOGO,
  empresas: [EMPRESA_HONDA, EMPRESA_YAMAHA],
  departamentos: [DEPARTAMENTO_OPERACIONES, DEPARTAMENTO_COMERCIAL],
  areas: [AREA_ALMACEN, AREA_LOGISTICA, AREA_VENTAS],
  subareas: [SUBAREA_DESPACHO, SUBAREA_RECEPCION, SUBAREA_DISTRIBUCION],
  puestos: [
    PUESTO_OPERARIO,
    PUESTO_AUXILIAR,
    PUESTO_SUPERVISOR,
    PUESTO_ANALISTA_VENTAS,
  ],
  departamentosUbicacion: [DEP_UBICACION_CALLAO, DEP_UBICACION_LIMA],
  provincias: [PROVINCIA_CALLAO, PROVINCIA_LIMA],
  distritos: [DISTRITO_CALLAO, DISTRITO_VENTANILLA, DISTRITO_SAN_MIGUEL],
  usuariosProximaTarea: [USUARIO_SCHENONE, USUARIO_RIOS, USUARIO_PAREDES],
  usuarioProximaTareaPredeterminado: USUARIO_SCHENONE.id,
  calendarioLaboral: CALENDARIO_LABORAL,
}

export const SOLICITANTES: readonly Usuario[] = [
  USUARIO_SCHENONE,
  USUARIO_RIOS,
  USUARIO_PAREDES,
]

const COLABORADOR_LUIS_TORRES: ColaboradorReemplazo = {
  id: 'col-luis-torres' as ColaboradorId,
  nombre: 'Luis Torres',
}

export const COLABORADORES: readonly ColaboradorReemplazo[] = [
  COLABORADOR_LUIS_TORRES,
  { id: 'col-ana-gutierrez' as ColaboradorId, nombre: 'Ana Gutiérrez' },
  { id: 'col-jorge-salas' as ColaboradorId, nombre: 'Jorge Salas' },
]

const ALERTA_CRITICA_BANDEJA: AlertaPlazoOperativo = {
  nivel: 'critica',
  umbral: { tipo: 'dias-fijos', clasificacion: 'operativo', diaHabil: 9 },
  diaHabil: 9,
  fecha: '2026-01-16' as FechaISO,
}

function autorizacion(id: RequerimientoId, version: number): AutorizacionRequerimiento {
  return {
    requerimientoId: id,
    version,
    capacidades: [CAP_RRHH_REQUERIMIENTOS_READ],
    accionesPermitidas: [],
  }
}

function resumenCompleto(
  id: string,
  overrides: Partial<ResumenRequerimientoCompleto> = {},
): ResumenRequerimientoCompleto {
  const requerimientoId = id as RequerimientoId
  return {
    id: requerimientoId,
    version: 1,
    fechaCreacion: '2026-01-02T10:00:00Z' as InstanteISO,
    estado: 'aprobado',
    motivo: 'nueva-vacante',
    empresa: EMPRESA_HONDA,
    puesto: PUESTO_OPERARIO,
    solicitadas: 1,
    cubiertas: 0,
    pendientes: 1,
    fechaObjetivo: null,
    duracionAplicable: null,
    responsable: null,
    alerta: null,
    autorizacion: autorizacion(requerimientoId, 1),
    ...overrides,
  }
}

function resumenBorrador(id: string): ResumenRequerimientoBorrador {
  const requerimientoId = id as RequerimientoId
  return {
    id: requerimientoId,
    version: 1,
    fechaCreacion: '2026-01-12T08:30:00Z' as InstanteISO,
    estado: 'borrador',
    motivo: null,
    empresa: null,
    puesto: null,
    solicitadas: null,
    cubiertas: null,
    pendientes: null,
    fechaObjetivo: null,
    duracionAplicable: null,
    responsable: null,
    alerta: null,
    autorizacion: autorizacion(requerimientoId, 1),
  }
}

export const PAGINA_REQUERIMIENTOS: PaginaRequerimientos = {
  elementos: [
    resumenCompleto('req-1001', {
      version: 3,
      fechaCreacion: '2026-01-02T10:30:00Z' as InstanteISO,
      estado: 'aprobado',
      motivo: 'reemplazo',
      empresa: EMPRESA_HONDA,
      puesto: PUESTO_OPERARIO,
      solicitadas: 4,
      cubiertas: 2,
      pendientes: 2,
      fechaObjetivo: '2026-01-19' as FechaISO,
      responsable: USUARIO_RIOS,
      alerta: ALERTA_CRITICA_BANDEJA,
    }),
    resumenCompleto('req-1002', {
      fechaCreacion: '2026-01-10T09:00:00Z' as InstanteISO,
      estado: 'pendiente-aprobacion',
      motivo: 'nueva-vacante',
      empresa: EMPRESA_YAMAHA,
      puesto: PUESTO_OPERARIO,
      solicitadas: 2,
      cubiertas: 0,
      pendientes: 2,
      fechaObjetivo: null,
      duracionAplicable: {
        clasificacion: 'operativo',
        diasHabiles: 10,
      } satisfies DuracionAplicable,
      responsable: USUARIO_SCHENONE,
    }),
    resumenCompleto('req-1003', {
      version: 2,
      fechaCreacion: '2026-01-08T11:00:00Z' as InstanteISO,
      estado: 'observado',
      motivo: 'practicante',
      empresa: EMPRESA_HONDA,
      puesto: PUESTO_ANALISTA_VENTAS,
      solicitadas: 1,
      cubiertas: 0,
      pendientes: 1,
      fechaObjetivo: null,
      duracionAplicable: {
        clasificacion: 'administrativo',
        diasHabiles: null,
      } satisfies DuracionAplicable,
      responsable: USUARIO_RIOS,
    }),
    resumenBorrador('req-1004'),
    resumenCompleto('req-1005', {
      version: 5,
      fechaCreacion: '2026-01-03T10:00:00Z' as InstanteISO,
      estado: 'en-reclutamiento',
      motivo: 'otros',
      empresa: EMPRESA_YAMAHA,
      puesto: PUESTO_SUPERVISOR,
      solicitadas: 3,
      cubiertas: 1,
      pendientes: 2,
      fechaObjetivo: '2026-02-02' as FechaISO,
      responsable: USUARIO_PAREDES,
    }),
  ] satisfies readonly ResumenRequerimiento[],
  total: 5,
  pagina: 1,
  tamanoPagina: 10,
  capacidades: {
    capacidades: [CAP_RRHH_REQUERIMIENTOS_READ],
    accionesPermitidas: [],
  },
}

const EVENTO_CREACION: EventoCreacion = {
  id: 'evt-1' as EventoHistorialId,
  usuario: USUARIO_SCHENONE,
  fechaHora: '2026-01-02T10:30:00Z' as InstanteISO,
  accion: 'creacion',
  estadoNuevo: 'borrador',
  comentario: null,
}

const EVENTO_ENVIO: EventoCambioEstado = {
  id: 'evt-2' as EventoHistorialId,
  usuario: USUARIO_SCHENONE,
  fechaHora: '2026-01-02T11:00:00Z' as InstanteISO,
  accion: 'envio',
  estadoAnterior: 'borrador',
  estadoNuevo: 'pendiente-aprobacion',
  comentario: 'Enviado para aprobación de Operaciones.',
}

const EVENTO_ALERTA: EventoAlertaHistorial = {
  id: 'evt-3' as EventoHistorialId,
  usuario: USUARIO_RIOS,
  fechaHora: '2026-01-14T09:00:00Z' as InstanteISO,
  accion: 'alerta',
  nivel: 'media',
  fechaObjetivo: '2026-01-19' as FechaISO,
}

const PLAZO_OPERATIVO: PlazoOperativo = {
  clasificacion: 'operativo',
  duracionDiasHabiles: 10,
  origen: 'operativo-fijo',
  fechaAprobacion: '2026-01-05' as FechaISO,
  fechaObjetivo: '2026-01-19' as FechaISO,
  cumplimiento: 'en-plazo',
  alerta: {
    nivel: 'media',
    umbral: { tipo: 'dias-fijos', clasificacion: 'operativo', diaHabil: 7 },
    diaHabil: 7,
    fecha: '2026-01-14' as FechaISO,
  },
}

const COBERTURA: CoberturaRequerimiento = {
  solicitadas: 4,
  cubiertas: 2,
  pendientes: 2,
  primerosDiasReales: [],
}

export const DETALLE: DetalleRequerimientoCompleto = {
  id: 'req-1001' as RequerimientoId,
  version: 3,
  estado: 'aprobado',
  fechaCreacion: '2026-01-02T10:30:00Z' as InstanteISO,
  historial: [EVENTO_CREACION, EVENTO_ENVIO, EVENTO_ALERTA],
  autorizacion: autorizacion('req-1001' as RequerimientoId, 3),
  motivo: 'reemplazo',
  empresa: EMPRESA_HONDA,
  colaboradorAReemplazar: COLABORADOR_LUIS_TORRES,
  departamento: DEPARTAMENTO_OPERACIONES,
  area: AREA_ALMACEN,
  subarea: SUBAREA_DESPACHO,
  puesto: PUESTO_OPERARIO,
  remuneracion: { monto: 1800, moneda: 'PEN' },
  ubicacion: {
    departamento: DEP_UBICACION_CALLAO,
    provincia: PROVINCIA_CALLAO,
    distrito: DISTRITO_CALLAO,
  },
  usuarioProximaTarea: USUARIO_RIOS,
  comentario: 'Reemplazo por rotación en turno de despacho.',
  plazo: PLAZO_OPERATIVO,
  cobertura: COBERTURA,
  remuneracionPreviaAlta: null,
  procesoSeleccion: null,
}
