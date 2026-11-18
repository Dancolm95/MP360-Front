import { describe, expect, it } from 'vitest'
import type {
  AccionRequerimiento,
  AreaId,
  AutorizacionRequerimiento,
  BorradorRequerimiento,
  Clasificacion,
  ComandoAbrirProcesoSeleccion,
  ComandoAjustarPlazoAdministrativo,
  ComandoAprobar,
  ComandoCancelar,
  ComandoEnviarAprobacion,
  ComandoFijarPlazoAdministrativo,
  ComandoGuardarBorrador,
  ComandoObservar,
  ComandoSolicitarReversionCobertura,
  ComandoVersionado,
  ConfirmacionEnvio,
  DepartamentoId,
  DepartamentoUbicacionId,
  DetalleRequerimiento,
  DetalleRequerimientoBorrador,
  DetalleRequerimientoCanceladoCompleto,
  DetalleRequerimientoCompleto,
  DiasHabilesAdministrativos,
  DistritoId,
  EmpresaId,
  EstadoRequerimientoCompleto,
  FechaISO,
  InstanteISO,
  PlazoAdministrativoFijado,
  PlazoRequerimiento,
  ProcesoSeleccionId,
  ProvinciaId,
  PuestoId,
  RequerimientoId,
  ResultadoAbrirProceso,
  ResultadoAjustarPlazo,
  ResultadoAperturaProceso,
  ResultadoAprobar,
  ResultadoCancelar,
  ResultadoComando,
  ResultadoEnvioAprobacion,
  ResultadoFijarPlazo,
  ResultadoGuardarBorrador,
  ResultadoObservar,
  ResultadoSolicitarReversion,
  SolicitudReversionId,
  SolicitudReversionRegistrada,
  SolicitudTransicion,
  SubareaId,
  UsuarioId,
} from '..'
import {
  comandoConVersionVigente,
  ejecutarComandoVersionado,
  evaluarTransicion,
} from '..'
import type {
  ConflictoVersion,
  DecisionTransicionComando,
  ResultadoComandoVersionado,
} from '..'
import {
  comandoFixture,
  createMockComandosRequerimientos,
  creacionFixture,
} from '../fixtures'
import type {
  MockCommandResults,
  MockComandosRequerimientosPort,
} from '../fixtures'

const id = <T>(value: string) => value as T
const fecha = (value: string) => value as FechaISO
const instante = (value: string) => value as InstanteISO

const requerimientoId = id<RequerimientoId>('req-1')

const empresa = {
  id: id<EmpresaId>('empresa-a'),
  nombre: 'Empresa A',
}
const departamento = {
  id: id<DepartamentoId>('departamento-a'),
  nombre: 'Departamento A',
}
const area = {
  id: id<AreaId>('area-a'),
  nombre: 'Área A',
  departamentoId: departamento.id,
}
const subarea = {
  id: id<SubareaId>('subarea-a'),
  nombre: 'Subárea A',
  areaId: area.id,
}
const puestoAdministrativo = {
  id: id<PuestoId>('puesto-administrativo'),
  nombre: 'Puesto Administrativo',
  areaId: area.id,
  subareaId: subarea.id,
  clasificacion: 'administrativo' as const,
}
const puestoOperativo = {
  id: id<PuestoId>('puesto-operativo'),
  nombre: 'Puesto Operativo',
  areaId: area.id,
  subareaId: null,
  clasificacion: 'operativo' as const,
}
const ubicacion = {
  id: id<DepartamentoUbicacionId>('ubicacion-a'),
  nombre: 'Lima',
}
const provincia = {
  id: id<ProvinciaId>('provincia-a'),
  nombre: 'Lima',
  departamentoId: ubicacion.id,
}
const distrito = {
  id: id<DistritoId>('distrito-a'),
  nombre: 'Miraflores',
  provinciaId: provincia.id,
}
const usuario = {
  id: id<UsuarioId>('usuario-a'),
  nombre: 'Usuario A',
}

const TODAS_LAS_ACCIONES: readonly AccionRequerimiento[] = [
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
]

const borradorContenido: BorradorRequerimiento = {
  motivo: 'nueva-vacante',
  empresaId: empresa.id,
  colaboradorAReemplazarId: null,
  departamentoId: departamento.id,
  areaId: area.id,
  subareaId: subarea.id,
  puestoId: puestoAdministrativo.id,
  vacantes: 2,
  remuneracion: { monto: 1500, moneda: 'PEN' },
  ubicacion: {
    departamentoId: ubicacion.id,
    provinciaId: provincia.id,
    distritoId: distrito.id,
  },
  usuarioProximaTareaId: usuario.id,
  // Los espacios prueban que la puerta conserva la entrada sin reescribirla.
  comentario: '  Comentario escrito por la persona  ',
}

function crearAutorizacion(
  acciones: readonly AccionRequerimiento[],
  version: number,
): AutorizacionRequerimiento {
  return {
    requerimientoId,
    version,
    capacidades: [],
    accionesPermitidas: acciones,
  }
}

function plazoAdministrativo(
  dias: DiasHabilesAdministrativos,
): PlazoAdministrativoFijado {
  return {
    clasificacion: 'administrativo',
    fechaAprobacion: fecha('2026-11-16'),
    fechaObjetivo: null,
    cumplimiento: 'pendiente',
    duracionDiasHabiles: dias,
    origen: 'fijado-administrativo',
    alerta: null,
  }
}

interface OpcionesDetalle {
  readonly estado?: EstadoRequerimientoCompleto
  readonly clasificacion?: Clasificacion
  readonly plazo?: PlazoRequerimiento
  readonly version?: number
  readonly acciones?: readonly AccionRequerimiento[]
}

function detalleCompleto(
  opciones: OpcionesDetalle = {},
): DetalleRequerimientoCompleto {
  const clasificacion = opciones.clasificacion ?? 'administrativo'
  const version = opciones.version ?? 3
  return {
    id: requerimientoId,
    version,
    estado: opciones.estado ?? 'pendiente-aprobacion',
    fechaCreacion: instante('2026-11-09T08:00:00Z'),
    historial: [],
    autorizacion: crearAutorizacion(
      opciones.acciones ?? TODAS_LAS_ACCIONES,
      version,
    ),
    motivo: 'nueva-vacante',
    empresa,
    colaboradorAReemplazar: null,
    departamento,
    area,
    subarea: clasificacion === 'operativo' ? null : subarea,
    puesto:
      clasificacion === 'operativo' ? puestoOperativo : puestoAdministrativo,
    remuneracion: { monto: 1500, moneda: 'PEN' },
    ubicacion: {
      departamento: ubicacion,
      provincia,
      distrito,
    },
    usuarioProximaTarea: usuario,
    comentario: 'Justificación del requerimiento',
    plazo: opciones.plazo ?? plazoAdministrativo(17),
    cobertura: {
      solicitadas: 2,
      cubiertas: 0,
      pendientes: 2,
      primerosDiasReales: [],
    },
    remuneracionPreviaAlta: null,
    procesoSeleccion: null,
  }
}

function detalleBorrador(version = 3): DetalleRequerimientoBorrador {
  return {
    id: requerimientoId,
    version,
    estado: 'borrador',
    fechaCreacion: instante('2026-11-09T08:00:00Z'),
    historial: [],
    autorizacion: crearAutorizacion(TODAS_LAS_ACCIONES, version),
    borrador: borradorContenido,
    plazo: null,
    cobertura: null,
    remuneracionPreviaAlta: null,
    procesoSeleccion: null,
  }
}

function detalleCanceladoCompleto(
  version = 3,
): DetalleRequerimientoCanceladoCompleto {
  return {
    ...detalleCompleto({ version }),
    estado: 'cancelado',
    datos: 'completos',
  }
}

function confirmacionEnvio(): ConfirmacionEnvio {
  const detalle = detalleCompleto({ version: 4 })
  return {
    id: detalle.id,
    resumen: {
      id: detalle.id,
      version: detalle.version,
      fechaCreacion: detalle.fechaCreacion,
      motivo: detalle.motivo,
      empresa: detalle.empresa,
      puesto: detalle.puesto,
      solicitadas: detalle.cobertura.solicitadas,
      cubiertas: detalle.cobertura.cubiertas,
      pendientes: detalle.cobertura.pendientes,
      fechaObjetivo: detalle.plazo.fechaObjetivo,
      duracionAplicable: null,
      responsable: detalle.usuarioProximaTarea,
      alerta: detalle.plazo.alerta,
      autorizacion: detalle.autorizacion,
      estado: 'pendiente-aprobacion',
    },
    responsable: detalle.usuarioProximaTarea,
    estado: 'pendiente-aprobacion',
  }
}

function aperturaConfirmada(): ResultadoAperturaProceso {
  return {
    proceso: { id: id<ProcesoSeleccionId>('proceso-1') },
    requerimiento: detalleCompleto({
      estado: 'en-reclutamiento',
      version: 4,
    }),
    idempotente: false,
  }
}

function reversionRegistrada(): SolicitudReversionRegistrada {
  return {
    solicitudId: id<SolicitudReversionId>('solicitud-1'),
    estado: 'pendiente-confirmacion',
    requerimiento: detalleCompleto({
      estado: 'en-reclutamiento',
      version: 4,
    }),
  }
}

interface CasoComando {
  readonly nombre: string
  readonly detalle: DetalleRequerimiento
  readonly suceso: SolicitudTransicion | null
  readonly comando: (version: number) => ComandoVersionado
  readonly datosVigentes: () => DetalleRequerimiento
  readonly confirmado: unknown
  readonly resultado: (resultado: unknown) => Partial<MockCommandResults>
  readonly ejecutar: (
    puerto: MockComandosRequerimientosPort,
    comando: ComandoVersionado,
  ) => Promise<ResultadoComando<unknown>>
  readonly llamadas: (
    puerto: MockComandosRequerimientosPort,
  ) => readonly ComandoVersionado[]
}

const casoGuardar: CasoComando = {
  nombre: 'editar/guardar',
  detalle: detalleCompleto({ estado: 'pendiente-aprobacion' }),
  suceso: { suceso: 'editar' },
  comando: (version) => ({
    requerimientoId,
    version,
    borrador: borradorContenido,
  }),
  datosVigentes: () => detalleCompleto({ version: 4 }),
  confirmado: detalleCompleto({ version: 4 }),
  resultado: (resultado) => ({
    guardarBorrador: resultado as ResultadoGuardarBorrador,
  }),
  ejecutar: (puerto, comando) =>
    puerto.guardarBorrador(comando as ComandoGuardarBorrador),
  llamadas: (puerto) => puerto.calls.guardarBorrador,
}

const casoEnviar: CasoComando = {
  nombre: 'enviar',
  detalle: detalleBorrador(),
  suceso: { suceso: 'enviar' },
  comando: (version) => ({
    requerimientoId,
    version,
    contenido: borradorContenido,
  }),
  datosVigentes: () => detalleBorrador(4),
  confirmado: confirmacionEnvio(),
  resultado: (resultado) => ({
    enviarAprobacion: resultado as ResultadoEnvioAprobacion,
  }),
  ejecutar: (puerto, comando) =>
    puerto.enviarAprobacion(comando as ComandoEnviarAprobacion),
  llamadas: (puerto) => puerto.calls.enviarAprobacion,
}

const casoReenviar: CasoComando = {
  nombre: 'reenviar',
  detalle: detalleCompleto({ estado: 'observado' }),
  suceso: { suceso: 'reenviar' },
  comando: (version) => ({
    requerimientoId,
    version,
    contenido: borradorContenido,
  }),
  datosVigentes: () => detalleCompleto({ estado: 'observado', version: 4 }),
  confirmado: confirmacionEnvio(),
  resultado: (resultado) => ({
    enviarAprobacion: resultado as ResultadoEnvioAprobacion,
  }),
  ejecutar: (puerto, comando) =>
    puerto.enviarAprobacion(comando as ComandoEnviarAprobacion),
  llamadas: (puerto) => puerto.calls.enviarAprobacion,
}

const casoFijar: CasoComando = {
  nombre: 'fijar plazo',
  detalle: detalleCompleto({ estado: 'pendiente-aprobacion' }),
  suceso: { suceso: 'fijar-plazo' },
  comando: (version) => ({
    requerimientoId,
    version,
    diasHabiles: 17,
  }),
  datosVigentes: () => detalleCompleto({ version: 4 }),
  confirmado: detalleCompleto({ version: 4 }),
  resultado: (resultado) => ({
    fijarPlazoAdministrativo: resultado as ResultadoFijarPlazo,
  }),
  ejecutar: (puerto, comando) =>
    puerto.fijarPlazoAdministrativo(comando as ComandoFijarPlazoAdministrativo),
  llamadas: (puerto) => puerto.calls.fijarPlazoAdministrativo,
}

const casoAjustar: CasoComando = {
  nombre: 'ajustar plazo',
  detalle: detalleCompleto({ estado: 'aprobado' }),
  suceso: { suceso: 'ajustar-plazo' },
  comando: (version) => ({
    requerimientoId,
    version,
    diasHabiles: 20,
    motivo: 'Ajuste por campaña',
  }),
  datosVigentes: () => detalleCompleto({ estado: 'aprobado', version: 4 }),
  confirmado: detalleCompleto({
    estado: 'aprobado',
    version: 4,
    plazo: plazoAdministrativo(20),
  }),
  resultado: (resultado) => ({
    ajustarPlazoAdministrativo: resultado as ResultadoAjustarPlazo,
  }),
  ejecutar: (puerto, comando) =>
    puerto.ajustarPlazoAdministrativo(
      comando as ComandoAjustarPlazoAdministrativo,
    ),
  llamadas: (puerto) => puerto.calls.ajustarPlazoAdministrativo,
}

const casoAbrir: CasoComando = {
  nombre: 'abrir proceso en Selección',
  detalle: detalleCompleto({ estado: 'aprobado' }),
  suceso: { suceso: 'iniciar-apertura-proceso' },
  comando: (version) => ({ requerimientoId, version }),
  datosVigentes: () => detalleCompleto({ estado: 'aprobado', version: 4 }),
  confirmado: aperturaConfirmada(),
  resultado: (resultado) => ({
    abrirProcesoSeleccion: resultado as ResultadoAbrirProceso,
  }),
  ejecutar: (puerto, comando) =>
    puerto.abrirProcesoSeleccion(comando as ComandoAbrirProcesoSeleccion),
  llamadas: (puerto) => puerto.calls.abrirProcesoSeleccion,
}

const casoCancelar: CasoComando = {
  nombre: 'cancelar',
  detalle: detalleCompleto({ estado: 'pendiente-aprobacion' }),
  suceso: {
    suceso: 'cancelar',
    confirmado: true,
    causal: 'menor-carga-laboral',
  },
  comando: (version) => ({
    requerimientoId,
    version,
    causal: 'menor-carga-laboral',
    comentario: 'Causal explicada por la persona',
  }),
  datosVigentes: () =>
    detalleCompleto({ estado: 'pendiente-aprobacion', version: 4 }),
  confirmado: detalleCanceladoCompleto(4),
  resultado: (resultado) => ({
    cancelar: resultado as ResultadoCancelar,
  }),
  ejecutar: (puerto, comando) =>
    puerto.cancelar(comando as ComandoCancelar),
  llamadas: (puerto) => puerto.calls.cancelar,
}

const casoSolicitarReversion: CasoComando = {
  nombre: 'solicitar reversión de cobertura',
  detalle: detalleCompleto({ estado: 'en-reclutamiento' }),
  suceso: null,
  comando: (version) => ({
    requerimientoId,
    version,
    motivo: 'Cobertura registrada por error',
  }),
  datosVigentes: () =>
    detalleCompleto({ estado: 'en-reclutamiento', version: 4 }),
  confirmado: reversionRegistrada(),
  resultado: (resultado) => ({
    solicitarReversionCobertura: resultado as ResultadoSolicitarReversion,
  }),
  ejecutar: (puerto, comando) =>
    puerto.solicitarReversionCobertura(
      comando as ComandoSolicitarReversionCobertura,
    ),
  llamadas: (puerto) => puerto.calls.solicitarReversionCobertura,
}

const casoAprobar: CasoComando = {
  nombre: 'aprobar',
  detalle: detalleCompleto({ estado: 'pendiente-aprobacion' }),
  suceso: { suceso: 'aprobar' },
  comando: (version) => ({
    requerimientoId,
    version,
    comentario: 'Aprobado tras revisar',
  }),
  datosVigentes: () => detalleCompleto({ version: 4 }),
  confirmado: detalleCompleto({ estado: 'aprobado', version: 4 }),
  resultado: (resultado) => ({
    aprobar: resultado as ResultadoAprobar,
  }),
  ejecutar: (puerto, comando) => puerto.aprobar(comando as ComandoAprobar),
  llamadas: (puerto) => puerto.calls.aprobar,
}

const casoObservar: CasoComando = {
  nombre: 'observar',
  detalle: detalleCompleto({ estado: 'pendiente-aprobacion' }),
  suceso: { suceso: 'observar' },
  comando: (version) => ({
    requerimientoId,
    version,
    comentario: 'Falta precisar la justificación',
  }),
  datosVigentes: () => detalleCompleto({ version: 4 }),
  confirmado: detalleCompleto({ estado: 'observado', version: 4 }),
  resultado: (resultado) => ({
    observar: resultado as ResultadoObservar,
  }),
  ejecutar: (puerto, comando) => puerto.observar(comando as ComandoObservar),
  llamadas: (puerto) => puerto.calls.observar,
}

const casos: readonly CasoComando[] = [
  casoGuardar,
  casoEnviar,
  casoReenviar,
  casoFijar,
  casoAjustar,
  casoAbrir,
  casoCancelar,
  casoSolicitarReversion,
  casoAprobar,
  casoObservar,
]

function crearPuerto(
  caso: CasoComando,
  resultado: unknown,
): MockComandosRequerimientosPort {
  return createMockComandosRequerimientos({
    crear: creacionFixture.sesionFinalizada(),
    guardarBorrador: comandoFixture.sesionFinalizada(),
    enviarAprobacion: comandoFixture.sesionFinalizada(),
    aprobar: comandoFixture.sesionFinalizada(),
    observar: comandoFixture.sesionFinalizada(),
    cancelar: comandoFixture.sesionFinalizada(),
    fijarPlazoAdministrativo: comandoFixture.sesionFinalizada(),
    ajustarPlazoAdministrativo: comandoFixture.sesionFinalizada(),
    abrirProcesoSeleccion: comandoFixture.sesionFinalizada(),
    solicitarReversionCobertura: comandoFixture.sesionFinalizada(),
    ...caso.resultado(resultado),
  })
}

function totalLlamadas(puerto: MockComandosRequerimientosPort): number {
  return Object.values(puerto.calls).reduce(
    (total, llamadas) => total + llamadas.length,
    0,
  )
}

function decisionDe(caso: CasoComando): DecisionTransicionComando {
  return caso.suceso === null
    ? { tipo: 'no-transicion' }
    : {
        tipo: 'transicion',
        veredicto: evaluarTransicion(caso.detalle, caso.suceso),
      }
}

async function ejecutarCaso(
  caso: CasoComando,
  comando: ComandoVersionado,
  resultadoBackend: unknown,
): Promise<{
  readonly resultado: ResultadoComandoVersionado<ComandoVersionado, unknown>
  readonly puerto: MockComandosRequerimientosPort
}> {
  const puerto = crearPuerto(caso, resultadoBackend)
  const resultado = await ejecutarComandoVersionado({
    comando,
    decision: decisionDe(caso),
    ejecutar: (enviado) => caso.ejecutar(puerto, enviado),
  })
  return { resultado, puerto }
}

function conflictoCon(
  versionEnviada: number,
  datosVigentes: DetalleRequerimiento,
): ConflictoVersion {
  return {
    versionEsperada: versionEnviada,
    versionVigente: 4,
    datosVigentes,
  }
}

describe.each(casos)('concurrencia versionada: $nombre', (caso) => {
  it('rechaza el conflicto sin persistir, conserva la entrada y expone los datos vigentes', async () => {
    const comando = caso.comando(3)
    const datosVigentes = caso.datosVigentes()
    const conflicto = conflictoCon(3, datosVigentes)
    const detalleAntes = structuredClone(caso.detalle)
    const decisionAntes = decisionDe(caso)

    const { resultado, puerto } = await ejecutarCaso(
      caso,
      comando,
      comandoFixture.conflicto(conflicto),
    )

    expect(resultado.status).toBe('conflicto-version')
    if (resultado.status !== 'conflicto-version') return

    expect(resultado.entrada).toBe(comando)
    expect(resultado.conflicto).toEqual(conflicto)
    expect(resultado.datosVigentes).toEqual(datosVigentes)
    expect(resultado.versionVigente).toBe(4)
    expect(resultado.mensaje).toContain('datos del requerimiento cambiaron')
    expect(resultado.entradaConservada).toBe(true)
    expect(resultado.reintentable).toBe(true)
    expect('datos' in resultado).toBe(false)

    expect(caso.llamadas(puerto)).toEqual([comando])
    expect(totalLlamadas(puerto)).toBe(1)

    expect(caso.detalle).toEqual(detalleAntes)
    expect(decisionDe(caso)).toEqual(decisionAntes)

    if (caso.suceso !== null) {
      expect(evaluarTransicion(datosVigentes, caso.suceso)).toMatchObject({
        permitida: true,
      })
    }
  })

  it.each([2, 5])(
    'conserva la entrada enviada con la versión %i y permite reintentar con la vigente',
    async (versionEnviada) => {
      const comando = caso.comando(versionEnviada)
      const { resultado: conflicto, puerto: puertoConflicto } =
        await ejecutarCaso(
          caso,
          comando,
          comandoFixture.conflicto(
            conflictoCon(versionEnviada, caso.datosVigentes()),
          ),
        )

      expect(conflicto.status).toBe('conflicto-version')
      if (conflicto.status !== 'conflicto-version') return

      expect(conflicto.entrada.version).toBe(versionEnviada)
      expect(conflicto.conflicto.versionEsperada).toBe(versionEnviada)
      expect(caso.llamadas(puertoConflicto)).toEqual([comando])
      const reintento = comandoConVersionVigente(conflicto)
      expect(reintento).toEqual({ ...comando, version: 4 })
      expect(conflicto.entrada.version).toBe(versionEnviada)

      const { resultado, puerto } = await ejecutarCaso(
        caso,
        reintento,
        comandoFixture.confirmado(caso.confirmado),
      )

      expect(resultado).toMatchObject({
        status: 'confirmado',
        datos: caso.confirmado,
      })
      expect(caso.llamadas(puerto)).toEqual([reintento])
      expect(totalLlamadas(puerto)).toBe(1)
    },
  )

  it('confirma con la versión vigente sin conflicto', async () => {
    const comando = caso.comando(3)
    const { resultado, puerto } = await ejecutarCaso(
      caso,
      comando,
      comandoFixture.confirmado(caso.confirmado),
    )

    expect(resultado).toEqual({
      status: 'confirmado',
      comando,
      datos: caso.confirmado,
    })
    expect(caso.llamadas(puerto)).toEqual([comando])
    expect(totalLlamadas(puerto)).toBe(1)
  })
})

describe('puerta única de comandos versionados', () => {
  it('no invoca el puerto cuando la máquina de estados rechaza la transición', async () => {
    const detalle = detalleBorrador()
    const veredicto = evaluarTransicion(detalle, { suceso: 'aprobar' })
    expect(veredicto.permitida).toBe(false)

    const comando = casoAprobar.comando(3)
    const puerto = crearPuerto(
      casoAprobar,
      comandoFixture.confirmado(casoAprobar.confirmado),
    )
    const resultado = await ejecutarComandoVersionado({
      comando,
      decision: { tipo: 'transicion', veredicto },
      ejecutar: (enviado) => casoAprobar.ejecutar(puerto, enviado),
    })

    expect(resultado.status).toBe('transicion-rechazada')
    if (resultado.status !== 'transicion-rechazada') return
    expect(resultado.entrada).toBe(comando)
    expect(resultado.veredicto).toEqual(veredicto)
    if (!veredicto.permitida) {
      expect(resultado.mensaje).toBe(veredicto.mensaje)
    }
    expect(resultado.entradaConservada).toBe(true)
    expect(resultado.reintentable).toBe(false)
    expect(totalLlamadas(puerto)).toBe(0)
  })

  it('permite una nueva decisión con los datos vigentes: la máquina rechaza si el estado cambió', async () => {
    const { resultado } = await ejecutarCaso(
      casoAprobar,
      casoAprobar.comando(3),
      comandoFixture.conflicto(
        conflictoCon(3, detalleCompleto({ estado: 'aprobado', version: 4 })),
      ),
    )

    expect(resultado.status).toBe('conflicto-version')
    if (resultado.status !== 'conflicto-version') return

    expect(
      evaluarTransicion(resultado.datosVigentes, { suceso: 'aprobar' }),
    ).toMatchObject({
      permitida: false,
      motivo: 'suceso-no-aplica-al-estado',
    })
  })

  it('delega el resto de fallos en el mapeo común de comandos', async () => {
    const comando = casoObservar.comando(3)
    const { resultado } = await ejecutarCaso(
      casoObservar,
      comando,
      comandoFixture.validacion([
        { campo: 'comentario', mensaje: 'Comentario rechazado por backend' },
        { campo: 'vacantes', mensaje: 'Vacantes rechazadas por backend' },
      ]),
    )

    expect(resultado).toEqual({
      status: 'validacion',
      errores: [
        { campo: 'comentario', mensaje: 'Comentario rechazado por backend' },
        { campo: 'general', mensaje: 'Vacantes rechazadas por backend' },
      ],
      entradaConservada: true,
      reintentable: true,
    })
  })
})
