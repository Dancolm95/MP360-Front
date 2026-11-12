import { describe, expect, expectTypeOf, it } from 'vitest'
import * as contratos from './index'
import type {
  AccionRequerimiento,
  Clasificacion,
  CoberturaRequerimiento,
  ComandoAprobar,
  ComandoVersionado,
  ConsultaBandeja,
  DetalleRequerimiento,
  EstadoRequerimiento,
  FiltrosBandeja,
  MotivoRequerimiento,
  NivelAlerta,
  OrdenBandeja,
  PaginacionBandeja,
  ResultadoComando,
  ResultadoLectura,
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

const ACCIONES_CANONICAS = [
  'crear',
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
  it('el barril de contratos se resuelve sin exponer lógica de dominio', () => {
    expect(contratos).toBeDefined()
  })

  it('el catálogo canónico de motivo coincide con la spec §4', () => {
    expect(MOTIVOS_CANONICOS).toEqual([
      'reemplazo',
      'nueva-vacante',
      'practicante',
      'otros',
    ])
    expectTypeOf<MotivoRequerimiento>().toEqualTypeOf<
      (typeof MOTIVOS_CANONICOS)[number]
    >()
  })

  it('los estados canónicos cubren el ciclo de vida de la spec §6', () => {
    expect(ESTADOS_CANONICOS).toEqual([
      'borrador',
      'pendiente-aprobacion',
      'observado',
      'aprobado',
      'en-reclutamiento',
      'cubierto',
      'cancelado',
    ])
    expectTypeOf<EstadoRequerimiento>().toEqualTypeOf<
      (typeof ESTADOS_CANONICOS)[number]
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

  it('la cobertura expone solicitadas, cubiertas y pendientes', () => {
    expectTypeOf<CoberturaRequerimiento>().toMatchTypeOf<{
      readonly solicitadas: number
      readonly cubiertas: number
      readonly pendientes: number
    }>()
  })

  it('las acciones y niveles son uniones canónicas cerradas', () => {
    expect(ACCIONES_CANONICAS).toHaveLength(11)
    expectTypeOf<AccionRequerimiento>().toEqualTypeOf<
      (typeof ACCIONES_CANONICAS)[number]
    >()
    expectTypeOf<NivelAlerta>().toEqualTypeOf<'temprana' | 'media' | 'critica'>()
    expectTypeOf<Clasificacion>().toEqualTypeOf<
      'operativo' | 'administrativo'
    >()
  })
})
