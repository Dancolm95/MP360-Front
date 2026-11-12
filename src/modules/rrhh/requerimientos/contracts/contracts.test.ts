import { describe, expectTypeOf, it } from 'vitest'
import type {
  AccionBandeja,
  AccionRequerimiento,
  AlertaPlazoOperativo,
  BorradorRequerimiento,
  CapacidadesBandeja,
  CausalCancelacion,
  Clasificacion,
  CoberturaRequerimiento,
  ComandoAprobar,
  ComandoCrearRequerimiento,
  ComandoEnviarAprobacion,
  ComandoVersionado,
  ColaboradorId,
  ConsultaBandeja,
  DetalleRequerimiento,
  DetalleRequerimientoBorrador,
  DetalleRequerimientoCancelado,
  DetalleRequerimientoCanceladoCompleto,
  DetalleRequerimientoCanceladoParcial,
  DetalleRequerimientoCompleto,
  DetalleRequerimientoEditable,
  DiasHabilesAdministrativos,
  DuracionAplicable,
  EstadoRequerimiento,
  EstadoRequerimientoCompleto,
  EstadoRequerimientoPersistido,
  EventoAjustePlazo,
  EventoCancelacion,
  EventoCreacion,
  EventoReversionCobertura,
  FechaISO,
  FiltrosBandeja,
  MotivoRequerimiento,
  NivelAlerta,
  OrdenBandeja,
  PaginacionBandeja,
  PaginaRequerimientos,
  PlazoAdministrativoFijado,
  PlazoAdministrativoPendiente,
  PlazoOperativo,
  PlazoRequerimiento,
  ResultadoCancelar,
  ResultadoComando,
  ResultadoCrearRequerimiento,
  ResultadoGuardarBorrador,
  ResultadoLectura,
  ResultadoSolicitarReversion,
  RequerimientoCreado,
  ResumenRequerimiento,
  ResumenRequerimientoCanceladoParcial,
  SolicitudReversionId,
  SolicitudReversionRegistrada,
  UmbralAlerta,
} from './index'

const MOTIVOS_CANONICOS = [
  'reemplazo',
  'nueva-vacante',
  'practicante',
  'otros',
] as const satisfies readonly MotivoRequerimiento[]

const ESTADOS_CANONICOS = [
  'borrador',
  'pendiente-aprobacion',
  'observado',
  'aprobado',
  'en-reclutamiento',
  'cubierto',
  'cancelado',
] as const satisfies readonly EstadoRequerimiento[]

const ACCIONES_POR_REGISTRO = [
  'editar',
  'enviar',
  'aprobar',
  'observar',
  'cancelar',
  'fijar-plazo',
  'ajustar-plazo',
  'abrir-proceso-seleccion',
  'solicitar-reversion-cobertura',
  'asociar-candidato',
] as const satisfies readonly AccionRequerimiento[]

describe('contratos del dominio Requerimientos (T-RH-02)', () => {
  it('el catálogo canónico de motivo coincide con la spec §4', () => {
    expectTypeOf<MotivoRequerimiento>().toEqualTypeOf<
      (typeof MOTIVOS_CANONICOS)[number]
    >()
  })

  it('los estados canónicos cubren el ciclo de vida de la spec §6', () => {
    expectTypeOf<EstadoRequerimiento>().toEqualTypeOf<
      (typeof ESTADOS_CANONICOS)[number]
    >()
    expectTypeOf<EstadoRequerimientoPersistido>().toEqualTypeOf<
      Exclude<EstadoRequerimiento, 'borrador'>
    >()
    expectTypeOf<EstadoRequerimientoCompleto>().toEqualTypeOf<
      Exclude<EstadoRequerimiento, 'borrador' | 'cancelado'>
    >()
  })

  it('la consulta de bandeja reúne filtros, orden y paginación', () => {
    expectTypeOf<ConsultaBandeja>().toMatchTypeOf<{
      readonly filtros: FiltrosBandeja
      readonly orden: OrdenBandeja
      readonly paginacion: PaginacionBandeja
    }>()
  })

  it('la lectura distingue sin resultados, error recuperable y sin permisos', () => {
    expectTypeOf<ResultadoLectura<readonly string[]>['status']>().toEqualTypeOf<
      'ok' | 'forbidden' | 'sesion-finalizada' | 'error'
    >()
  })

  it('un borrador incompleto es representable en detalle, bandeja y guardado', () => {
    expectTypeOf<BorradorRequerimiento['motivo']>().toEqualTypeOf<
      MotivoRequerimiento | null
    >()
    expectTypeOf<BorradorRequerimiento['vacantes']>().toEqualTypeOf<
      number | null
    >()
    expectTypeOf<DetalleRequerimientoBorrador['borrador']>().toEqualTypeOf<
      BorradorRequerimiento
    >()
    expectTypeOf<
      Extract<DetalleRequerimiento, { estado: 'borrador' }>
    >().toEqualTypeOf<DetalleRequerimientoBorrador>()
    expectTypeOf<
      Extract<ResumenRequerimiento, { estado: 'borrador' }>['motivo']
    >().toEqualTypeOf<MotivoRequerimiento | null>()
    expectTypeOf<PaginaRequerimientos['elementos'][number]>().toEqualTypeOf<
      ResumenRequerimiento
    >()
  })

  it('guardar conserva el estado real de la edición y no lo rebaja a Borrador', () => {
    type DatosGuardado = Extract<
      ResultadoGuardarBorrador,
      { readonly status: 'confirmado' }
    >['datos']
    type EditablePendiente = Extract<
      DatosGuardado,
      { estado: 'pendiente-aprobacion' | 'observado' }
    >

    expectTypeOf<DatosGuardado>().toEqualTypeOf<DetalleRequerimientoEditable>()
    expectTypeOf<DatosGuardado['estado']>().toEqualTypeOf<
      'borrador' | 'pendiente-aprobacion' | 'observado'
    >()
    expectTypeOf<
      DetalleRequerimientoCompleto & {
        readonly estado: 'pendiente-aprobacion'
      }
    >().toMatchTypeOf<DatosGuardado>()
    expectTypeOf<
      DetalleRequerimientoCompleto & { readonly estado: 'observado' }
    >().toMatchTypeOf<DatosGuardado>()
    expectTypeOf<EditablePendiente['estado']>().toEqualTypeOf<
      'pendiente-aprobacion' | 'observado'
    >()
    expectTypeOf<EditablePendiente>().toMatchTypeOf<DetalleRequerimientoCompleto>()
    expectTypeOf<
      Extract<DatosGuardado, { estado: 'cancelado' }>
    >().toEqualTypeOf<never>()
  })

  it('la creación no exige identificador ni versión previos y devuelve ambos al confirmar', () => {
    type CrearTieneId = 'requerimientoId' extends keyof ComandoCrearRequerimiento
      ? true
      : false
    type CrearTieneVersion = 'version' extends keyof ComandoCrearRequerimiento
      ? true
      : false

    expectTypeOf<CrearTieneId>().toEqualTypeOf<false>()
    expectTypeOf<CrearTieneVersion>().toEqualTypeOf<false>()
    expectTypeOf<ResultadoCrearRequerimiento['status']>().toEqualTypeOf<
      'confirmado' | 'validacion' | 'sin-autorizacion' | 'error' | 'sesion-finalizada'
    >()
    expectTypeOf<
      Extract<ResultadoCrearRequerimiento, { status: 'confirmado' }>['datos']
    >().toEqualTypeOf<RequerimientoCreado>()
    expectTypeOf<RequerimientoCreado['detalle']>().toEqualTypeOf<
      DetalleRequerimientoBorrador
    >()
  })

  it('la capacidad de creación vive en la bandeja, no en el registro', () => {
    type CrearEnRegistro = 'crear' extends AccionRequerimiento ? true : false

    expectTypeOf<CrearEnRegistro>().toEqualTypeOf<false>()
    expectTypeOf<AccionBandeja>().toEqualTypeOf<'crear'>()
    expectTypeOf<PaginaRequerimientos['capacidades']>().toEqualTypeOf<
      CapacidadesBandeja
    >()
  })

  it('el envío lleva el contenido revisado completo y se persiste al enviar', () => {
    expectTypeOf<ComandoEnviarAprobacion['contenido']>().toEqualTypeOf<
      BorradorRequerimiento
    >()
  })

  it('la creación no exige estado anterior en el historial', () => {
    type CreacionTieneEstadoAnterior =
      'estadoAnterior' extends keyof EventoCreacion ? true : false

    expectTypeOf<CreacionTieneEstadoAnterior>().toEqualTypeOf<false>()
    expectTypeOf<EventoCreacion['estadoNuevo']>().toEqualTypeOf<'borrador'>()
  })

  it('la cancelación conserva su causal en el historial', () => {
    expectTypeOf<EventoCancelacion['causal']>().toEqualTypeOf<CausalCancelacion>()
  })

  it('la reversión confirmada enlaza la solicitud y conserva su efecto', () => {
    expectTypeOf<EventoReversionCobertura['solicitudId']>().toEqualTypeOf<
      SolicitudReversionId
    >()
    expectTypeOf<
      EventoReversionCobertura['efectoCobertura']['pendientes']
    >().toBeNumber()
    expectTypeOf<
      EventoReversionCobertura['efectoCobertura']['estadoResultante']
    >().toEqualTypeOf<'en-reclutamiento'>()
    expectTypeOf<
      EventoReversionCobertura['colaboradorAfectadoId']
    >().toEqualTypeOf<ColaboradorId | null>()
  })

  it('el conflicto de versión conserva la versión vigente y los datos vigentes', () => {
    type Conflicto = Extract<
      ResultadoComando<unknown>,
      { readonly status: 'conflicto-version' }
    >['conflicto']

    expectTypeOf<Conflicto['versionEsperada']>().toBeNumber()
    expectTypeOf<Conflicto['versionVigente']>().toBeNumber()
    expectTypeOf<Conflicto['datosVigentes']>().toEqualTypeOf<DetalleRequerimiento>()
  })

  it('los comandos versionados llevan la versión leída del recurso', () => {
    expectTypeOf<ComandoAprobar['version']>().toBeNumber()
    expectTypeOf<ComandoAprobar>().toMatchTypeOf<ComandoVersionado>()
  })

  it('el resultado de comando distingue éxito, conflicto y cada fallo', () => {
    expectTypeOf<ResultadoComando<unknown>['status']>().toEqualTypeOf<
      | 'confirmado'
      | 'conflicto-version'
      | 'validacion'
      | 'sin-autorizacion'
      | 'estado-invalido'
      | 'error'
      | 'error-integracion'
      | 'sesion-finalizada'
    >()
  })

  it('la solicitud de reversión confirmada solo registra la solicitud', () => {
    expectTypeOf<
      Extract<ResultadoSolicitarReversion, { status: 'confirmado' }>['datos']
    >().toEqualTypeOf<SolicitudReversionRegistrada>()
    expectTypeOf<SolicitudReversionRegistrada['estado']>().toEqualTypeOf<
      'pendiente-confirmacion'
    >()
  })

  it('la cobertura expone solicitadas, cubiertas y pendientes', () => {
    expectTypeOf<CoberturaRequerimiento>().toMatchTypeOf<{
      readonly solicitadas: number
      readonly cubiertas: number
      readonly pendientes: number
    }>()
  })

  it('un Cancelado desde Borrador incompleto conserva datos parciales', () => {
    type DatosCancelado = Extract<
      ResultadoCancelar,
      { readonly status: 'confirmado' }
    >['datos']

    expectTypeOf<DatosCancelado>().toEqualTypeOf<DetalleRequerimientoCancelado>()
    expectTypeOf<
      Extract<DatosCancelado, { datos: 'parciales' }>
    >().toEqualTypeOf<DetalleRequerimientoCanceladoParcial>()
    expectTypeOf<
      Extract<DatosCancelado, { datos: 'completos' }>
    >().toEqualTypeOf<DetalleRequerimientoCanceladoCompleto>()
    expectTypeOf<DetalleRequerimientoCanceladoParcial['borrador']>().toEqualTypeOf<
      BorradorRequerimiento
    >()
    expectTypeOf<DetalleRequerimientoCanceladoParcial['plazo']>().toEqualTypeOf<
      PlazoRequerimiento | null
    >()
    expectTypeOf<EstadoRequerimientoCompleto>().toEqualTypeOf<
      Exclude<EstadoRequerimiento, 'borrador' | 'cancelado'>
    >()
    type CompletoAdmiteCancelado =
      'cancelado' extends DetalleRequerimientoCompleto['estado'] ? true : false
    expectTypeOf<CompletoAdmiteCancelado>().toEqualTypeOf<false>()
  })

  it('la bandeja representa el Cancelado parcial sin inventar columnas', () => {
    type CanceladoParcial = Extract<
      ResumenRequerimiento,
      { estado: 'cancelado'; datos: 'parciales' }
    >

    expectTypeOf<CanceladoParcial>().toEqualTypeOf<ResumenRequerimientoCanceladoParcial>()
    expectTypeOf<CanceladoParcial['motivo']>().toEqualTypeOf<
      MotivoRequerimiento | null
    >()
    expectTypeOf<CanceladoParcial['solicitadas']>().toEqualTypeOf<number | null>()
    expectTypeOf<CanceladoParcial['fechaObjetivo']>().toEqualTypeOf<null>()
    expectTypeOf<CanceladoParcial['alerta']>().toEqualTypeOf<null>()
    expectTypeOf<ResumenRequerimiento['estado']>().toEqualTypeOf<
      EstadoRequerimiento
    >()
  })

  it('la duración aplicable no es una fecha y respeta el rango administrativo', () => {
    type DuracionAdministrativa = Extract<
      DuracionAplicable,
      { clasificacion: 'administrativo' }
    >
    type DuracionTieneFecha =
      'fechaObjetivo' extends keyof DuracionAplicable ? true : false
    type CatorceValido = 14 extends DuracionAdministrativa['diasHabiles']
      ? true
      : false

    expectTypeOf<DuracionAplicable['clasificacion']>().toEqualTypeOf<
      'operativo' | 'administrativo'
    >()
    expectTypeOf<DuracionAdministrativa['diasHabiles']>().toEqualTypeOf<
      DiasHabilesAdministrativos | null
    >()
    expectTypeOf<DuracionTieneFecha>().toEqualTypeOf<false>()
    expectTypeOf<CatorceValido>().toEqualTypeOf<false>()
    expectTypeOf<ResumenRequerimiento['duracionAplicable']>().toEqualTypeOf<
      DuracionAplicable | null
    >()
  })

  it('el plazo no admite combinaciones imposibles por clasificación', () => {
    expectTypeOf<PlazoOperativo['duracionDiasHabiles']>().toEqualTypeOf<10>()
    expectTypeOf<PlazoOperativo['origen']>().toEqualTypeOf<'operativo-fijo'>()
    expectTypeOf<PlazoOperativo['alerta']>().toEqualTypeOf<
      AlertaPlazoOperativo | null
    >()
    expectTypeOf<
      PlazoAdministrativoPendiente['duracionDiasHabiles']
    >().toEqualTypeOf<null>()
    expectTypeOf<PlazoAdministrativoFijado['duracionDiasHabiles']>().toEqualTypeOf<
      DiasHabilesAdministrativos
    >()
    type CatorceValido = 14 extends DiasHabilesAdministrativos ? true : false
    expectTypeOf<CatorceValido>().toEqualTypeOf<false>()
    expectTypeOf<
      Extract<UmbralAlerta, { tipo: 'dias-fijos' }>['clasificacion']
    >().toEqualTypeOf<'operativo'>()
    expectTypeOf<
      Extract<UmbralAlerta, { tipo: 'porcentaje' }>['clasificacion']
    >().toEqualTypeOf<'administrativo'>()
  })

  it('el ajuste de plazo conserva fechas objetivo existentes', () => {
    expectTypeOf<EventoAjustePlazo['fechaObjetivoAnterior']>().toEqualTypeOf<FechaISO>()
    expectTypeOf<EventoAjustePlazo['fechaObjetivoNueva']>().toEqualTypeOf<FechaISO>()
  })

  it('la fecha de aprobación no se duplica fuera del plazo', () => {
    type DetalleTieneFechaAprobacion =
      'fechaAprobacion' extends keyof DetalleRequerimiento ? true : false

    expectTypeOf<DetalleTieneFechaAprobacion>().toEqualTypeOf<false>()
  })

  it('las acciones, niveles y clasificaciones son uniones canónicas cerradas', () => {
    expectTypeOf<AccionRequerimiento>().toEqualTypeOf<
      (typeof ACCIONES_POR_REGISTRO)[number]
    >()
    expectTypeOf<NivelAlerta>().toEqualTypeOf<'temprana' | 'media' | 'critica'>()
    expectTypeOf<Clasificacion>().toEqualTypeOf<
      'operativo' | 'administrativo'
    >()
  })
})
