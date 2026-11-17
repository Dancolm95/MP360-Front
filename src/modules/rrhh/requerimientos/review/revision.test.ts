import { describe, expect, it } from 'vitest'
import type {
  Area,
  AreaId,
  BorradorRequerimiento,
  CalendarioLaboralId,
  CatalogosRequerimientos,
  ColaboradorId,
  ColaboradorReemplazo,
  ConflictoVersion,
  ConfirmacionEnvio,
  Departamento,
  DepartamentoId,
  DepartamentoUbicacion,
  DepartamentoUbicacionId,
  DetalleRequerimientoEditable,
  Distrito,
  DistritoId,
  Empresa,
  EmpresaId,
  InstanteISO,
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
import {
  createMockComandosRequerimientos,
  comandoFixture,
  creacionFixture,
  type MockCommandResults,
} from '../fixtures'
import {
  AVISO_DURACION,
  FORMULARIO_VACIO,
  contextoDesdeCatalogos,
  formularioDesdeDetalle,
} from '../form/helpers'
import { validarParaEnvio, type FormularioRequerimientoInput } from '../model'
import {
  NO_APLICA,
  PENDIENTE_DEFINIR,
  SIN_ASIGNAR,
  SIN_COMPLETAR,
  SIN_DETERMINAR,
  SIN_SUBAREA,
  crearRevision,
  type OpcionesRevision,
} from './modelo'
import {
  crearEstadoEdicion,
  editarFormulario,
  enviarAprobacion,
  guardarBorrador,
  revisar,
  volverAEditar,
  type EstadoEdicionRevision,
} from './estado'

const id = <T>(value: string) => value as T

const empresaA: Empresa = { id: id<EmpresaId>('empresa-a'), nombre: 'Empresa A' }
const departamentoA: Departamento = {
  id: id<DepartamentoId>('departamento-a'),
  nombre: 'Departamento A',
}
const areaA: Area = {
  id: id<AreaId>('area-a'),
  nombre: 'Área A',
  departamentoId: departamentoA.id,
}
const subareaA: Subarea = {
  id: id<SubareaId>('subarea-a'),
  nombre: 'Subárea A',
  areaId: areaA.id,
}
const puestoOperativoA: Puesto = {
  id: id<PuestoId>('puesto-operativo-a'),
  nombre: 'Puesto Operativo A',
  areaId: areaA.id,
  subareaId: subareaA.id,
  clasificacion: 'operativo',
}
const puestoAdministrativoA: Puesto = {
  id: id<PuestoId>('puesto-administrativo-a'),
  nombre: 'Puesto Administrativo A',
  areaId: areaA.id,
  subareaId: null,
  clasificacion: 'administrativo',
}
const ubicacionA: DepartamentoUbicacion = {
  id: id<DepartamentoUbicacionId>('ubicacion-a'),
  nombre: 'Ubicación A',
}
const provinciaA: Provincia = {
  id: id<ProvinciaId>('provincia-a'),
  nombre: 'Provincia A',
  departamentoId: ubicacionA.id,
}
const distritoA: Distrito = {
  id: id<DistritoId>('distrito-a'),
  nombre: 'Distrito A',
  provinciaId: provinciaA.id,
}
const usuarioA: Usuario = { id: id<UsuarioId>('usuario-a'), nombre: 'Usuario A' }
const colaboradorA: ColaboradorReemplazo = {
  id: id<ColaboradorId>('colaborador-a'),
  nombre: 'Colaborador A',
}
const requerimientoId = id<RequerimientoId>('req-1')
const instante = '2026-11-16T10:00:00Z' as InstanteISO

const catalogos: CatalogosRequerimientos = {
  motivos: [
    { motivo: 'reemplazo', etiqueta: 'Reemplazo' },
    { motivo: 'nueva-vacante', etiqueta: 'Nueva Vacante' },
    { motivo: 'practicante', etiqueta: 'Practicante' },
    { motivo: 'otros', etiqueta: 'Otros' },
  ],
  empresas: [empresaA],
  departamentos: [departamentoA],
  areas: [areaA],
  subareas: [subareaA],
  puestos: [puestoOperativoA, puestoAdministrativoA],
  departamentosUbicacion: [ubicacionA],
  provincias: [provinciaA],
  distritos: [distritoA],
  usuariosProximaTarea: [usuarioA],
  usuarioProximaTareaPredeterminado: usuarioA.id,
  calendarioLaboral: {
    id: id<CalendarioLaboralId>('calendario-1'),
    diasHabiles: [],
    excepciones: [],
  },
}

const formularioCompleto: FormularioRequerimientoInput = {
  motivo: 'reemplazo',
  empresaId: empresaA.id,
  colaboradorAReemplazarId: colaboradorA.id,
  departamentoId: departamentoA.id,
  areaId: areaA.id,
  subareaId: subareaA.id,
  puestoId: puestoOperativoA.id,
  vacantes: '3',
  remuneracionMensual: '1234.5',
  departamentoUbicacionId: ubicacionA.id,
  provinciaId: provinciaA.id,
  distritoId: distritoA.id,
  usuarioProximaTareaId: usuarioA.id,
  comentario: 'Justificación revisada',
}

const formularioIncompleto: FormularioRequerimientoInput = {
  ...FORMULARIO_VACIO,
  motivo: 'otros',
}

const formularioAdministrativo: FormularioRequerimientoInput = {
  ...formularioCompleto,
  puestoId: puestoAdministrativoA.id,
  subareaId: null,
  vacantes: 2,
  comentario: 'Cobertura administrativa',
}

const autorizacion = {
  requerimientoId,
  version: 2,
  capacidades: [],
  accionesPermitidas: [],
}

const resumenConfirmacion: ConfirmacionEnvio['resumen'] = {
  id: requerimientoId,
  version: 4,
  fechaCreacion: instante,
  motivo: 'reemplazo',
  empresa: empresaA,
  puesto: puestoOperativoA,
  solicitadas: 3,
  cubiertas: 0,
  pendientes: 3,
  fechaObjetivo: null,
  duracionAplicable: { clasificacion: 'operativo', diasHabiles: 10 },
  responsable: usuarioA,
  alerta: null,
  autorizacion: { ...autorizacion, version: 4 },
  estado: 'pendiente-aprobacion',
}

const confirmacionEnvio: ConfirmacionEnvio = {
  id: requerimientoId,
  resumen: resumenConfirmacion,
  responsable: usuarioA,
  estado: 'pendiente-aprobacion',
}

const borradorConfirmado: BorradorRequerimiento = {
  motivo: 'reemplazo',
  empresaId: empresaA.id,
  colaboradorAReemplazarId: colaboradorA.id,
  departamentoId: departamentoA.id,
  areaId: areaA.id,
  subareaId: subareaA.id,
  puestoId: puestoOperativoA.id,
  vacantes: 3,
  remuneracion: { monto: 1234.5, moneda: 'PEN' },
  ubicacion: {
    departamentoId: ubicacionA.id,
    provinciaId: provinciaA.id,
    distritoId: distritoA.id,
  },
  usuarioProximaTareaId: usuarioA.id,
  comentario: 'Justificación revisada',
}

const borradorIncompleto: BorradorRequerimiento = {
  motivo: 'otros',
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
}

const detalleGuardado: DetalleRequerimientoEditable = {
  id: requerimientoId,
  version: 3,
  estado: 'borrador',
  fechaCreacion: instante,
  historial: [],
  autorizacion,
  borrador: borradorConfirmado,
  plazo: null,
  cobertura: null,
  remuneracionPreviaAlta: null,
  procesoSeleccion: null,
}

const detalleIncompleto: DetalleRequerimientoEditable = {
  ...detalleGuardado,
  borrador: borradorIncompleto,
}

/** Reapertura del borrador rico: importe a dos decimales y vacantes numéricas. */
const formularioReabierto: FormularioRequerimientoInput = {
  motivo: 'reemplazo',
  empresaId: empresaA.id,
  colaboradorAReemplazarId: colaboradorA.id,
  departamentoId: departamentoA.id,
  areaId: areaA.id,
  subareaId: subareaA.id,
  puestoId: puestoOperativoA.id,
  vacantes: 3,
  remuneracionMensual: '1234.50',
  departamentoUbicacionId: ubicacionA.id,
  provinciaId: provinciaA.id,
  distritoId: distritoA.id,
  usuarioProximaTareaId: usuarioA.id,
  comentario: 'Justificación revisada',
}

const conflictoVersion: ConflictoVersion = {
  versionEsperada: 2,
  versionVigente: 3,
  datosVigentes: detalleGuardado,
}

const errorNoUsado = { message: 'No usado', retryable: false }

function resultadosComandos(
  overrides: Partial<MockCommandResults> = {},
): MockCommandResults {
  return {
    crear: creacionFixture.error(errorNoUsado),
    guardarBorrador: comandoFixture.error(errorNoUsado),
    enviarAprobacion: comandoFixture.error(errorNoUsado),
    aprobar: comandoFixture.error(errorNoUsado),
    observar: comandoFixture.error(errorNoUsado),
    cancelar: comandoFixture.error(errorNoUsado),
    fijarPlazoAdministrativo: comandoFixture.error(errorNoUsado),
    ajustarPlazoAdministrativo: comandoFixture.error(errorNoUsado),
    abrirProcesoSeleccion: comandoFixture.error(errorNoUsado),
    solicitarReversionCobertura: comandoFixture.error(errorNoUsado),
    ...overrides,
  }
}

function enRevision(
  formulario: FormularioRequerimientoInput = formularioCompleto,
  opciones?: OpcionesRevision,
): EstadoEdicionRevision {
  const resultado = revisar(crearEstadoEdicion(formulario), catalogos, opciones)
  if (!resultado.ok) throw new Error('Se esperaba una revisión válida')
  return resultado.estado
}

function campo(
  revision: ReturnType<typeof crearRevision>,
  nombre: string,
): string {
  return revision.campos.find((item) => item.campo === nombre)?.valor ?? ''
}

describe('revisión: instantánea de datos', () => {
  it('presenta etiquetas, valores y derivados de un formulario completo', () => {
    const revision = crearRevision(formularioCompleto, catalogos, {
      colaboradores: [colaboradorA],
    })

    expect(revision.puedeEnviar).toBe(true)
    expect(revision.errores).toEqual([])
    expect(revision.clasificacion).toBe('operativo')
    expect(revision.duracion).toEqual({
      clasificacion: 'operativo',
      diasHabiles: 10,
      valor: '10 días hábiles',
      aviso: AVISO_DURACION,
    })
    expect(campo(revision, 'motivo')).toBe('Reemplazo')
    expect(campo(revision, 'empresa')).toBe('Empresa A')
    expect(campo(revision, 'colaboradorAReemplazar')).toBe('Colaborador A')
    expect(campo(revision, 'departamento')).toBe('Departamento A')
    expect(campo(revision, 'area')).toBe('Área A')
    expect(campo(revision, 'subarea')).toBe('Subárea A')
    expect(campo(revision, 'puesto')).toBe('Puesto Operativo A')
    expect(campo(revision, 'clasificacion')).toBe('Operativo')
    expect(campo(revision, 'vacantes')).toBe('3')
    expect(campo(revision, 'remuneracion')).toBe('S/ 1,234.50')
    expect(campo(revision, 'departamentoUbicacion')).toBe('Ubicación A')
    expect(campo(revision, 'provincia')).toBe('Provincia A')
    expect(campo(revision, 'distrito')).toBe('Distrito A')
    expect(campo(revision, 'usuarioProximaTarea')).toBe('Usuario A')
    expect(campo(revision, 'comentario')).toBe('Justificación revisada')
    expect(campo(revision, 'duracionAplicable')).toBe('10 días hábiles')
    expect(revision.duracion?.aviso).toBe(AVISO_DURACION)
  })

  it('presenta «Sin subárea», «Sin asignar» y los huecos sin inventar datos', () => {
    const revision = crearRevision(formularioIncompleto, catalogos)

    expect(revision.puedeEnviar).toBe(false)
    expect(campo(revision, 'subarea')).toBe(SIN_SUBAREA)
    expect(campo(revision, 'usuarioProximaTarea')).toBe(SIN_ASIGNAR)
    expect(campo(revision, 'colaboradorAReemplazar')).toBe(NO_APLICA)
    expect(campo(revision, 'remuneracion')).toBe(SIN_COMPLETAR)
    expect(campo(revision, 'clasificacion')).toBe(SIN_DETERMINAR)
    expect(campo(revision, 'duracionAplicable')).toBe(SIN_DETERMINAR)
    expect(revision.duracion).toBeNull()
  })

  it('consolida todos los errores de T-RH-04 con la etiqueta del campo', () => {
    const revision = crearRevision(formularioIncompleto, catalogos)
    const validacion = validarParaEnvio(
      formularioIncompleto,
      contextoDesdeCatalogos(catalogos),
    )

    expect(validacion.ok).toBe(false)
    if (validacion.ok) return

    expect(
      revision.errores.map(({ campo, codigo }) => ({ campo, codigo })),
    ).toEqual(
      validacion.errors.map(({ field, code }) => ({
        campo: field,
        codigo: code,
      })),
    )
    expect(revision.errores[0]).toEqual({
      campo: 'empresaId',
      etiqueta: 'Empresa',
      codigo: 'obligatorio',
      mensaje: 'Campo obligatorio.',
    })
    expect(
      revision.errores.map((error) => error.etiqueta),
    ).toContain('Responsable de la próxima tarea')
    expect(revision.errores.map((error) => error.etiqueta)).toContain(
      'Remuneración mensual',
    )
  })

  it('deriva la duración administrativa pendiente o fijada sin usar fechas', () => {
    const pendiente = crearRevision(formularioAdministrativo, catalogos)
    expect(pendiente.clasificacion).toBe('administrativo')
    expect(pendiente.duracion?.diasHabiles).toBeNull()
    expect(campo(pendiente, 'duracionAplicable')).toBe(PENDIENTE_DEFINIR)

    const fijada = crearRevision(formularioAdministrativo, catalogos, {
      plazoAdministrativoDias: 20,
    })
    expect(fijada.duracion?.diasHabiles).toBe(20)
    expect(campo(fijada, 'duracionAplicable')).toBe('20 días hábiles')
  })

  it('es una instantánea inmutable: editar el origen no altera la revisión', () => {
    const formulario = { ...formularioCompleto }
    const revision = crearRevision(formulario, catalogos)

    formulario.comentario = 'Otro texto'
    formulario.vacantes = 99

    expect(revision.formulario.comentario).toBe('Justificación revisada')
    expect(revision.formulario.vacantes).toBe('3')
    expect(Object.isFrozen(revision)).toBe(true)
    expect(Object.isFrozen(revision.formulario)).toBe(true)
  })
})

describe('estado de la edición', () => {
  it('entra en revisión solo desde edición', () => {
    const edicion = crearEstadoEdicion(formularioCompleto)
    const resultado = revisar(edicion, catalogos)

    expect(resultado.ok).toBe(true)
    if (!resultado.ok) return
    expect(resultado.estado.paso).toBe('revision')
    expect(resultado.estado.formulario).toEqual(formularioCompleto)
    expect(resultado.estado.revision?.puedeEnviar).toBe(true)

    const segunda = revisar(resultado.estado, catalogos)
    expect(segunda).toEqual({
      ok: false,
      motivo: 'paso-invalido',
      pasoActual: 'revision',
      accion: 'revisar',
    })
  })

  it('volver a editar conserva todos los valores, incluidos los no persistidos', () => {
    const sinPersistir = {
      ...formularioCompleto,
      comentario: 'Cambio aún no persistido',
      vacantes: '4',
    }
    const revision = enRevision(sinPersistir)
    const vuelta = volverAEditar(revision)

    expect(vuelta.ok).toBe(true)
    if (!vuelta.ok) return
    expect(vuelta.estado).toEqual({
      paso: 'edicion',
      formulario: sinPersistir,
      revision: null,
      operacion: null,
    })
  })

  it('rechaza «Volver a editar» fuera de la revisión', () => {
    expect(volverAEditar(crearEstadoEdicion(formularioCompleto))).toEqual({
      ok: false,
      motivo: 'paso-invalido',
      pasoActual: 'edicion',
      accion: 'volver-a-editar',
    })
  })

  it('invalida la revisión si los datos cambian después', () => {
    const revision = enRevision()
    const resultado = editarFormulario(revision, {
      campo: 'comentario',
      valor: 'Texto posterior',
    })

    expect(resultado.ok).toBe(true)
    if (!resultado.ok) return
    expect(resultado.estado.paso).toBe('edicion')
    expect(resultado.estado.revision).toBeNull()
    expect(resultado.estado.formulario.comentario).toBe('Texto posterior')
    expect(resultado.estado.formulario.puestoId).toBe(puestoOperativoA.id)
  })
})

describe('envío a aprobación', () => {
  it('se rechaza fuera de la revisión sin llamar al puerto', async () => {
    const comandos = createMockComandosRequerimientos(resultadosComandos())
    const edicion = crearEstadoEdicion(formularioCompleto)

    const resultado = await enviarAprobacion(
      edicion,
      { requerimientoId, version: 2 },
      comandos,
    )

    expect(resultado.operacion).toEqual({
      status: 'paso-invalido',
      pasoActual: 'edicion',
      accion: 'envio',
      entradaConservada: true,
      reintentable: false,
    })
    expect(resultado.estado).toBe(edicion)
    expect(comandos.calls.enviarAprobacion).toHaveLength(0)
  })

  it('no envía una revisión con errores de validación', async () => {
    const comandos = createMockComandosRequerimientos(resultadosComandos())
    const revision = enRevision(formularioIncompleto)

    const resultado = await enviarAprobacion(
      revision,
      { requerimientoId, version: 2 },
      comandos,
    )

    expect(resultado.operacion.status).toBe('revision-invalida')
    expect(resultado.estado.paso).toBe('revision')
    expect(comandos.calls.enviarAprobacion).toHaveLength(0)
  })

  it('envía desde la revisión con la versión leída y el contenido revisado', async () => {
    const comandos = createMockComandosRequerimientos(
      resultadosComandos({
        enviarAprobacion: comandoFixture.confirmado(confirmacionEnvio),
      }),
    )
    const revision = enRevision()

    const resultado = await enviarAprobacion(
      revision,
      { requerimientoId, version: 7 },
      comandos,
    )

    expect(comandos.calls.enviarAprobacion).toHaveLength(1)
    expect(comandos.calls.enviarAprobacion[0]).toMatchObject({
      requerimientoId,
      version: 7,
    })
    expect(comandos.calls.enviarAprobacion[0].contenido).toMatchObject({
      motivo: 'reemplazo',
      vacantes: 3,
      remuneracion: { monto: 1234.5, moneda: 'PEN' },
      usuarioProximaTareaId: usuarioA.id,
    })
    expect(resultado.estado.paso).toBe('confirmacion')
    expect(resultado.operacion).toMatchObject({
      status: 'confirmado',
      accion: 'envio',
    })
  })

  it('construye la confirmación con ID, resumen, responsable y estado', async () => {
    const comandos = createMockComandosRequerimientos(
      resultadosComandos({
        enviarAprobacion: comandoFixture.confirmado(confirmacionEnvio),
      }),
    )
    const resultado = await enviarAprobacion(
      enRevision(),
      { requerimientoId, version: 2 },
      comandos,
    )

    if (resultado.estado.paso !== 'confirmacion') {
      throw new Error('Se esperaba la confirmación del envío')
    }
    expect(resultado.estado.confirmacion).toEqual({
      id: requerimientoId,
      version: 4,
      resumen: 'Reemplazo · Puesto Operativo A · Empresa A · 3 vacantes',
      responsable: 'Usuario A',
      estado: 'pendiente-aprobacion',
    })
    expect(resultado.estado.operacion.status).toBe('confirmado')
  })

  it('muestra «Sin asignar» si la confirmación no trae responsable', async () => {
    const comandos = createMockComandosRequerimientos(
      resultadosComandos({
        enviarAprobacion: comandoFixture.confirmado({
          ...confirmacionEnvio,
          responsable: null,
        }),
      }),
    )
    const resultado = await enviarAprobacion(
      enRevision(),
      { requerimientoId, version: 2 },
      comandos,
    )

    if (resultado.estado.paso !== 'confirmacion') {
      throw new Error('Se esperaba la confirmación del envío')
    }
    expect(resultado.estado.confirmacion.responsable).toBe(SIN_ASIGNAR)
  })

  it('conserva la entrada ante un conflicto de versión', async () => {
    const comandos = createMockComandosRequerimientos(
      resultadosComandos({
        enviarAprobacion: comandoFixture.conflicto(conflictoVersion),
      }),
    )
    const revision = enRevision()

    const resultado = await enviarAprobacion(
      revision,
      { requerimientoId, version: 2 },
      comandos,
    )

    expect(resultado.estado.paso).toBe('revision')
    expect(resultado.estado.formulario).toEqual(formularioCompleto)
    expect(resultado.operacion).toMatchObject({
      status: 'conflicto-version',
      conflicto: conflictoVersion,
      entradaConservada: true,
      reintentable: true,
    })
    if (resultado.operacion.status !== 'conflicto-version') return
    expect(resultado.operacion.conflicto.versionVigente).toBe(3)
    expect(comandos.calls.enviarAprobacion).toHaveLength(1)
  })

  it('mapea el error de validación del backend a etiquetas por campo', async () => {
    const comandos = createMockComandosRequerimientos(
      resultadosComandos({
        enviarAprobacion: comandoFixture.validacion<
          ConfirmacionEnvio
        >([
          { campo: 'remuneracion', mensaje: 'Importe no válido.' },
          { campo: 'general', mensaje: 'Revisa el formulario.' },
        ]),
      }),
    )

    const resultado = await enviarAprobacion(
      enRevision(),
      { requerimientoId, version: 2 },
      comandos,
    )

    expect(resultado.estado.paso).toBe('revision')
    expect(resultado.operacion).toEqual({
      status: 'validacion',
      errores: [
        {
          campo: 'remuneracion',
          etiqueta: 'Remuneración mensual',
          mensaje: 'Importe no válido.',
        },
        { campo: 'general', etiqueta: 'General', mensaje: 'Revisa el formulario.' },
      ],
      entradaConservada: true,
      reintentable: true,
    })
  })

  it('mapea el error de integración y respeta su reintento', async () => {
    const comandos = createMockComandosRequerimientos(
      resultadosComandos({
        enviarAprobacion: comandoFixture.errorIntegracion<ConfirmacionEnvio>({
          origen: 'seleccion',
          error: { message: 'Selección no disponible', retryable: true },
        }),
      }),
    )

    const resultado = await enviarAprobacion(
      enRevision(),
      { requerimientoId, version: 2 },
      comandos,
    )

    expect(resultado.operacion).toEqual({
      status: 'error-integracion',
      error: {
        origen: 'seleccion',
        error: { message: 'Selección no disponible', retryable: true },
      },
      entradaConservada: true,
      reintentable: true,
    })
  })

  it('mapea el estado inválido conservando la entrada sin reintento', async () => {
    const comandos = createMockComandosRequerimientos(
      resultadosComandos({
        enviarAprobacion: comandoFixture.estadoInvalido<ConfirmacionEnvio>(
          'aprobado',
        ),
      }),
    )

    const resultado = await enviarAprobacion(
      enRevision(),
      { requerimientoId, version: 2 },
      comandos,
    )

    expect(resultado.operacion).toEqual({
      status: 'estado-invalido',
      estadoActual: 'aprobado',
      entradaConservada: true,
      reintentable: false,
    })
    expect(resultado.estado.paso).toBe('revision')
    expect(resultado.estado.formulario).toEqual(formularioCompleto)
  })

  it('mapea la sesión finalizada sin cambiar de paso ni reintentar', async () => {
    const comandos = createMockComandosRequerimientos(
      resultadosComandos({
        enviarAprobacion: comandoFixture.sesionFinalizada<ConfirmacionEnvio>(),
      }),
    )

    const resultado = await enviarAprobacion(
      enRevision(),
      { requerimientoId, version: 2 },
      comandos,
    )

    expect(resultado.operacion).toEqual({
      status: 'sesion-finalizada',
      entradaConservada: true,
      reintentable: false,
    })
    expect(resultado.estado.paso).toBe('revision')
    expect(resultado.estado.formulario).toEqual(formularioCompleto)
  })

  it('distingue la denegación por capacidad de la denegación por ámbito', async () => {
    const capacidad = createMockComandosRequerimientos(
      resultadosComandos({
        enviarAprobacion: comandoFixture.sinAutorizacion<ConfirmacionEnvio>(
          'capacidad',
        ),
      }),
    )
    const ambito = createMockComandosRequerimientos(
      resultadosComandos({
        enviarAprobacion: comandoFixture.sinAutorizacion<ConfirmacionEnvio>(
          'ambito',
        ),
      }),
    )

    const porCapacidad = await enviarAprobacion(
      enRevision(),
      { requerimientoId, version: 2 },
      capacidad,
    )
    const porAmbito = await enviarAprobacion(
      enRevision(),
      { requerimientoId, version: 2 },
      ambito,
    )

    expect(porCapacidad.operacion).toMatchObject({
      status: 'sin-autorizacion',
      motivo: 'capacidad',
      reintentable: false,
    })
    expect(porAmbito.operacion).toMatchObject({
      status: 'sin-autorizacion',
      motivo: 'ambito',
      reintentable: false,
    })
  })

  it('no declara éxito sin un puerto de comandos disponible', async () => {
    const resultado = await enviarAprobacion(
      enRevision(),
      { requerimientoId, version: 2 },
      null,
    )

    expect(resultado.operacion).toEqual({
      status: 'no-disponible',
      accion: 'envio',
      entradaConservada: true,
      reintentable: false,
    })
    expect(resultado.estado.paso).toBe('revision')
  })

  it('rechaza editar, revisar o reenviar desde la confirmación', async () => {
    const comandos = createMockComandosRequerimientos(
      resultadosComandos({
        enviarAprobacion: comandoFixture.confirmado(confirmacionEnvio),
      }),
    )
    const envio = await enviarAprobacion(
      enRevision(),
      { requerimientoId, version: 2 },
      comandos,
    )
    const confirmacion = envio.estado
    if (confirmacion.paso !== 'confirmacion') {
      throw new Error('Se esperaba la confirmación del envío')
    }

    expect(volverAEditar(confirmacion)).toMatchObject({
      ok: false,
      pasoActual: 'confirmacion',
    })
    expect(revisar(confirmacion, catalogos)).toMatchObject({
      ok: false,
      pasoActual: 'confirmacion',
    })
    expect(
      editarFormulario(confirmacion, {
        campo: 'comentario',
        valor: 'Otro',
      }),
    ).toMatchObject({ ok: false, pasoActual: 'confirmacion' })

    const segundoEnvio = await enviarAprobacion(
      confirmacion,
      { requerimientoId, version: 4 },
      comandos,
    )
    expect(segundoEnvio.operacion).toMatchObject({
      status: 'paso-invalido',
      pasoActual: 'confirmacion',
      accion: 'envio',
    })
    expect(comandos.calls.enviarAprobacion).toHaveLength(1)
  })
})

describe('guardar borrador', () => {
  it('persiste por el puerto y reabre exactamente los valores confirmados', async () => {
    const comandos = createMockComandosRequerimientos(
      resultadosComandos({
        guardarBorrador: comandoFixture.confirmado(detalleGuardado),
      }),
    )

    const resultado = await guardarBorrador(
      crearEstadoEdicion(formularioCompleto),
      { requerimientoId, version: 1 },
      comandos,
    )

    expect(comandos.calls.guardarBorrador).toHaveLength(1)
    expect(comandos.calls.guardarBorrador[0]).toMatchObject({
      requerimientoId,
      version: 1,
    })
    expect(comandos.calls.guardarBorrador[0].borrador).toEqual(
      borradorConfirmado,
    )
    expect(resultado.estado.paso).toBe('edicion')
    expect(resultado.operacion).toMatchObject({
      status: 'confirmado',
      accion: 'borrador',
    })
    if (
      resultado.operacion.status !== 'confirmado' ||
      resultado.operacion.accion !== 'borrador'
    ) {
      return
    }
    expect(formularioDesdeDetalle(resultado.operacion.detalle)).toEqual(
      formularioReabierto,
    )
  })

  it('no inventa valores en un borrador realmente incompleto', async () => {
    const comandos = createMockComandosRequerimientos(
      resultadosComandos({
        guardarBorrador: comandoFixture.confirmado(detalleIncompleto),
      }),
    )

    const resultado = await guardarBorrador(
      crearEstadoEdicion(formularioIncompleto),
      { requerimientoId, version: 1 },
      comandos,
    )

    expect(comandos.calls.guardarBorrador[0].borrador).toEqual(
      borradorIncompleto,
    )
    if (
      resultado.operacion.status !== 'confirmado' ||
      resultado.operacion.accion !== 'borrador'
    ) {
      return
    }
    expect(formularioDesdeDetalle(resultado.operacion.detalle)).toEqual(
      formularioIncompleto,
    )
  })

  it('no simula persistencia si el adaptador no está disponible', async () => {
    const resultado = await guardarBorrador(
      crearEstadoEdicion(formularioIncompleto),
      { requerimientoId, version: 1 },
      null,
    )

    expect(resultado.operacion).toEqual({
      status: 'no-disponible',
      accion: 'borrador',
      entradaConservada: true,
      reintentable: false,
    })
    expect(resultado.estado).toMatchObject({
      paso: 'edicion',
      formulario: formularioIncompleto,
    })
  })

  it('conserva los valores si el guardado falla', async () => {
    const comandos = createMockComandosRequerimientos(
      resultadosComandos({
        guardarBorrador: comandoFixture.error({
          message: 'No se pudo guardar',
          retryable: true,
        }),
      }),
    )

    const estado = crearEstadoEdicion(formularioCompleto)
    const resultado = await guardarBorrador(
      estado,
      { requerimientoId, version: 1 },
      comandos,
    )

    expect(resultado.operacion).toEqual({
      status: 'error',
      error: { message: 'No se pudo guardar', retryable: true },
      entradaConservada: true,
      reintentable: true,
    })
    expect(resultado.estado.formulario).toEqual(formularioCompleto)
  })

  it('no guarda un borrador después de confirmar el envío', async () => {
    const comandos = createMockComandosRequerimientos(
      resultadosComandos({
        enviarAprobacion: comandoFixture.confirmado(confirmacionEnvio),
        guardarBorrador: comandoFixture.confirmado(detalleGuardado),
      }),
    )
    const envio = await enviarAprobacion(
      enRevision(),
      { requerimientoId, version: 2 },
      comandos,
    )
    const resultado = await guardarBorrador(
      envio.estado,
      { requerimientoId, version: 4 },
      comandos,
    )

    expect(resultado.operacion).toEqual({
      status: 'paso-invalido',
      pasoActual: 'confirmacion',
      accion: 'borrador',
      entradaConservada: true,
      reintentable: false,
    })
    expect(comandos.calls.guardarBorrador).toHaveLength(0)
  })
})
