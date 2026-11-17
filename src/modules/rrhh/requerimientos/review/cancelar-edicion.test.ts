import { describe, expect, it } from 'vitest'
import type {
  Area,
  AreaId,
  BorradorRequerimiento,
  CalendarioLaboralId,
  CatalogosRequerimientos,
  ColaboradorId,
  ColaboradorReemplazo,
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
import type { CambioFormulario } from '../form/helpers'
import {
  FORMULARIO_VACIO,
  crearFormularioVacio,
  formularioDesdeDetalle,
} from '../form/helpers'
import type { FormularioRequerimientoInput } from '../model'
import {
  crearEstadoEdicion,
  editarFormulario,
  enviarAprobacion,
  revisar,
} from './estado'
import {
  crearEdicionEnCurso,
  guardarBorradorEnCurso,
  registrarGuardado,
  resolverDescarte,
  solicitarCancelarEdicion,
  type EdicionEnCurso,
} from './cancelar-edicion'

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
const puestoA: Puesto = {
  id: id<PuestoId>('puesto-a'),
  nombre: 'Puesto A',
  areaId: areaA.id,
  subareaId: subareaA.id,
  clasificacion: 'operativo',
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
const usuarioB: Usuario = { id: id<UsuarioId>('usuario-b'), nombre: 'Usuario B' }
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
  puestos: [puestoA],
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

const autorizacion = {
  requerimientoId,
  version: 2,
  capacidades: [],
  accionesPermitidas: [],
}

const formularioPersistido: FormularioRequerimientoInput = {
  motivo: 'reemplazo',
  empresaId: empresaA.id,
  colaboradorAReemplazarId: colaboradorA.id,
  departamentoId: departamentoA.id,
  areaId: areaA.id,
  subareaId: subareaA.id,
  puestoId: puestoA.id,
  vacantes: 2,
  remuneracionMensual: '1500.00',
  departamentoUbicacionId: ubicacionA.id,
  provinciaId: provinciaA.id,
  distritoId: distritoA.id,
  usuarioProximaTareaId: usuarioA.id,
  comentario: 'Justificación persistida',
}

const borradorPersistido: BorradorRequerimiento = {
  motivo: 'reemplazo',
  empresaId: empresaA.id,
  colaboradorAReemplazarId: colaboradorA.id,
  departamentoId: departamentoA.id,
  areaId: areaA.id,
  subareaId: subareaA.id,
  puestoId: puestoA.id,
  vacantes: 2,
  remuneracion: { monto: 1500, moneda: 'PEN' },
  ubicacion: {
    departamentoId: ubicacionA.id,
    provinciaId: provinciaA.id,
    distritoId: distritoA.id,
  },
  usuarioProximaTareaId: usuarioA.id,
  comentario: 'Justificación persistida',
}

const detalleGuardado: DetalleRequerimientoEditable = {
  id: requerimientoId,
  version: 3,
  estado: 'borrador',
  fechaCreacion: instante,
  historial: [],
  autorizacion,
  borrador: borradorPersistido,
  plazo: null,
  cobertura: null,
  remuneracionPreviaAlta: null,
  procesoSeleccion: null,
}

const detalleConfirmado: DetalleRequerimientoEditable = {
  ...detalleGuardado,
  version: 4,
  borrador: {
    ...borradorPersistido,
    comentario: 'Cambio sin guardar (normalizado por el backend)',
    usuarioProximaTareaId: usuarioB.id,
  },
}

const confirmacionEnvio: ConfirmacionEnvio = {
  id: requerimientoId,
  resumen: {
    id: requerimientoId,
    version: 4,
    fechaCreacion: instante,
    motivo: 'reemplazo',
    empresa: empresaA,
    puesto: puestoA,
    solicitadas: 2,
    cubiertas: 0,
    pendientes: 2,
    fechaObjetivo: null,
    duracionAplicable: { clasificacion: 'operativo', diasHabiles: 10 },
    responsable: usuarioA,
    alerta: null,
    autorizacion: { ...autorizacion, version: 4 },
    estado: 'pendiente-aprobacion',
  },
  responsable: usuarioA,
  estado: 'pendiente-aprobacion',
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

function editar(
  edicion: EdicionEnCurso,
  cambio: CambioFormulario,
): EdicionEnCurso {
  const resultado = editarFormulario(edicion.estado, cambio)
  if (!resultado.ok) throw new Error('Se esperaba una edición válida')
  return { ...edicion, estado: resultado.estado }
}

function enRevision(edicion: EdicionEnCurso): EdicionEnCurso {
  const resultado = revisar(edicion.estado, catalogos)
  if (!resultado.ok) throw new Error('Se esperaba una revisión válida')
  return { ...edicion, estado: resultado.estado }
}

describe('cancelar edición: confirmación de descarte', () => {
  it('no descarta al solicitarlo: exige la confirmación y conserva los valores', () => {
    const base = crearEdicionEnCurso(formularioPersistido)
    const edicion = editar(base, {
      campo: 'comentario',
      valor: 'Cambio sin guardar',
    })

    const solicitud = solicitarCancelarEdicion(edicion)

    expect(solicitud.status).toBe('confirmacion-pendiente')
    if (solicitud.status !== 'confirmacion-pendiente') return
    expect(solicitud.edicion.descartePendiente).toBe(true)
    expect(solicitud.edicion.estado).toBe(edicion.estado)
    expect(solicitud.edicion.estado.formulario.comentario).toBe(
      'Cambio sin guardar',
    )
    expect(solicitud.edicion.formularioDePartida).toEqual(formularioPersistido)
    expect(solicitud.edicion.estado.paso).toBe('edicion')
  })

  it('aceptar descarta los cambios no persistidos y vuelve al punto de partida', () => {
    const comandos = createMockComandosRequerimientos(resultadosComandos())
    const base = crearEdicionEnCurso(formularioPersistido)
    const conComentario = editar(base, {
      campo: 'comentario',
      valor: 'Cambio sin guardar',
    })
    const edicion = editar(conComentario, { campo: 'vacantes', valor: '5' })
    const solicitud = solicitarCancelarEdicion(edicion)
    if (solicitud.status !== 'confirmacion-pendiente') {
      throw new Error('Se esperaba la confirmación del descarte')
    }

    const resultado = resolverDescarte(solicitud.edicion, 'aceptar')

    expect(resultado.status).toBe('descartado')
    if (resultado.status !== 'descartado') return
    expect(resultado.volverAlContextoAnterior).toBe(true)
    expect(resultado.edicion.descartePendiente).toBe(false)
    expect(resultado.edicion.estado).toEqual({
      paso: 'edicion',
      formulario: formularioPersistido,
      revision: null,
      operacion: null,
    })
    expect(resultado.edicion.estado.formulario.comentario).toBe(
      'Justificación persistida',
    )
    expect(resultado.edicion.estado.formulario.vacantes).toBe(2)
    expect(comandos.calls.guardarBorrador).toHaveLength(0)
    expect(comandos.calls.cancelar).toHaveLength(0)
  })

  it('rechazar conserva todos los valores y el paso, incluso en revisión', () => {
    const base = crearEdicionEnCurso(formularioPersistido)
    const edicion = enRevision(
      editar(base, { campo: 'comentario', valor: 'Cambio sin guardar' }),
    )
    const revisionAntes = edicion.estado.paso === 'revision'
      ? edicion.estado.revision
      : null
    const solicitud = solicitarCancelarEdicion(edicion)
    if (solicitud.status !== 'confirmacion-pendiente') {
      throw new Error('Se esperaba la confirmación del descarte')
    }

    const resultado = resolverDescarte(solicitud.edicion, 'rechazar')

    expect(resultado.status).toBe('conservado')
    if (resultado.status !== 'conservado') return
    expect(resultado.decision).toBe('rechazar')
    expect(resultado.edicion.estado).toBe(edicion.estado)
    expect(resultado.edicion.estado.paso).toBe('revision')
    expect(resultado.edicion.estado.formulario).toEqual({
      ...formularioPersistido,
      comentario: 'Cambio sin guardar',
    })
    expect(
      resultado.edicion.estado.paso === 'revision'
        ? resultado.edicion.estado.revision
        : null,
    ).toBe(revisionAntes)
    expect(resultado.edicion.descartePendiente).toBe(false)
  })

  it('cancelar la confirmación no altera el estado de la edición', () => {
    const base = crearEdicionEnCurso(formularioPersistido)
    const edicion = editar(base, {
      campo: 'comentario',
      valor: 'Cambio sin guardar',
    })
    const solicitud = solicitarCancelarEdicion(edicion)
    if (solicitud.status !== 'confirmacion-pendiente') {
      throw new Error('Se esperaba la confirmación del descarte')
    }

    const resultado = resolverDescarte(solicitud.edicion, 'cancelar')

    expect(resultado.status).toBe('conservado')
    if (resultado.status !== 'conservado') return
    expect(resultado.decision).toBe('cancelar')
    expect(resultado.edicion.estado).toBe(edicion.estado)
    expect(resultado.edicion).toEqual(edicion)
  })

  it('sin cambios no pide confirmación y vuelve al contexto anterior', () => {
    const base = crearEdicionEnCurso(formularioPersistido)
    const conCambio = editar(base, {
      campo: 'comentario',
      valor: 'Cambio sin guardar',
    })
    const sinCambios = editar(conCambio, {
      campo: 'comentario',
      valor: 'Justificación persistida',
    })

    const solicitud = solicitarCancelarEdicion(sinCambios)

    expect(solicitud.status).toBe('sin-cambios')
    if (solicitud.status !== 'sin-cambios') return
    expect(solicitud.volverAlContextoAnterior).toBe(true)
    expect(solicitud.edicion.descartePendiente).toBe(false)
    expect(solicitud.edicion.estado.formulario).toEqual(formularioPersistido)
    expect(solicitud.edicion.estado.paso).toBe('edicion')
  })

  it('equipara solo las formas canónicas válidas de los controles', () => {
    const desdeDetalle = crearEdicionEnCurso(
      {
        ...formularioPersistido,
        vacantes: '2',
        remuneracionMensual: '1500.0',
      },
      formularioPersistido,
    )

    expect(solicitarCancelarEdicion(desdeDetalle).status).toBe('sin-cambios')

    const conOtroImporte = editar(desdeDetalle, {
      campo: 'remuneracionMensual',
      valor: '1500.01',
    })
    expect(solicitarCancelarEdicion(conOtroImporte).status).toBe(
      'confirmacion-pendiente',
    )
  })

  it('no pide confirmación con un formulario vacío', () => {
    const edicion = crearEdicionEnCurso(crearFormularioVacio(catalogos))

    expect(solicitarCancelarEdicion(edicion).status).toBe('sin-cambios')
  })

  it('no pide confirmación con un borrador de vacantes y remuneración vacías', () => {
    const edicion = crearEdicionEnCurso({
      ...FORMULARIO_VACIO,
      motivo: 'reemplazo',
      empresaId: empresaA.id,
      vacantes: null,
      remuneracionMensual: null,
    })

    expect(solicitarCancelarEdicion(edicion).status).toBe('sin-cambios')
  })

  it('equipara el importe con ceros a la izquierda', () => {
    const edicion = crearEdicionEnCurso(
      { ...formularioPersistido, remuneracionMensual: '01500.00' },
      formularioPersistido,
    )

    expect(solicitarCancelarEdicion(edicion).status).toBe('sin-cambios')
  })

  it('equipara 0.00 en Practicante', () => {
    const practicante: FormularioRequerimientoInput = {
      ...FORMULARIO_VACIO,
      motivo: 'practicante',
      remuneracionMensual: '0.00',
    }
    const edicion = crearEdicionEnCurso(
      { ...practicante, remuneracionMensual: '0.0' },
      practicante,
    )

    expect(solicitarCancelarEdicion(edicion).status).toBe('sin-cambios')
  })

  it('equipara textos inválidos idénticos pero no uno distinto', () => {
    const baseInvalida: FormularioRequerimientoInput = {
      ...FORMULARIO_VACIO,
      motivo: 'otros',
      remuneracionMensual: '1500.000',
      vacantes: ' 2 ',
    }
    const edicion = crearEdicionEnCurso(baseInvalida)

    expect(solicitarCancelarEdicion(edicion).status).toBe('sin-cambios')

    const conOtroTexto = editar(edicion, {
      campo: 'remuneracionMensual',
      valor: '1500.00x',
    })
    expect(solicitarCancelarEdicion(conOtroTexto).status).toBe(
      'confirmacion-pendiente',
    )
  })

  it.each([
    '1500.000',
    ' 1500 ',
    '1e3',
    '0x5DC',
    '+1500',
    '1500.',
    '.5',
    '-0',
  ])('trata el importe inválido «%s» como cambio', (valor) => {
    const edicion = editar(crearEdicionEnCurso(formularioPersistido), {
      campo: 'remuneracionMensual',
      valor,
    })

    expect(solicitarCancelarEdicion(edicion).status).toBe(
      'confirmacion-pendiente',
    )
  })

  it('trata las vacantes con espacios como cambio', () => {
    const edicion = editar(crearEdicionEnCurso(formularioPersistido), {
      campo: 'vacantes',
      valor: ' 2 ',
    })

    expect(solicitarCancelarEdicion(edicion).status).toBe(
      'confirmacion-pendiente',
    )
  })

  it('no resuelve un descarte que no se solicitó', () => {
    const edicion = crearEdicionEnCurso(formularioPersistido)

    const resultado = resolverDescarte(edicion, 'aceptar')

    expect(resultado).toEqual({
      status: 'sin-descarte-pendiente',
      decision: 'aceptar',
      edicion,
    })
    expect(resultado.edicion.estado).toBe(edicion.estado)
  })

  it('rechaza cancelar la edición después de confirmar el envío', async () => {
    const comandos = createMockComandosRequerimientos(
      resultadosComandos({
        enviarAprobacion: comandoFixture.confirmado(confirmacionEnvio),
      }),
    )
    const revision = enRevision(crearEdicionEnCurso(formularioPersistido))
    const envio = await enviarAprobacion(
      revision.estado,
      { requerimientoId, version: 2 },
      comandos,
    )
    if (envio.estado.paso !== 'confirmacion') {
      throw new Error('Se esperaba la confirmación del envío')
    }
    const edicion: EdicionEnCurso = { ...revision, estado: envio.estado }

    const solicitud = solicitarCancelarEdicion(edicion)

    expect(solicitud).toEqual({
      status: 'paso-invalido',
      pasoActual: 'confirmacion',
      accion: 'cancelar-edicion',
      edicion,
    })
    expect(comandos.calls.cancelar).toHaveLength(0)
  })
})

describe('cancelar edición: límites con las otras acciones', () => {
  it('distingue guardar borrador, cancelar edición y cancelar el requerimiento', async () => {
    const comandos = createMockComandosRequerimientos(
      resultadosComandos({
        guardarBorrador: comandoFixture.confirmado(detalleConfirmado),
      }),
    )
    const base = crearEdicionEnCurso(formularioPersistido)
    const edicion = editar(base, {
      campo: 'comentario',
      valor: 'Cambio sin guardar',
    })

    const guardado = await guardarBorradorEnCurso(
      edicion,
      { requerimientoId, version: 2 },
      comandos,
    )
    expect(comandos.calls.guardarBorrador).toHaveLength(1)
    expect(comandos.calls.guardarBorrador[0].borrador).toMatchObject({
      comentario: 'Cambio sin guardar',
    })
    expect(guardado.operacion.status).toBe('confirmado')
    if (
      guardado.operacion.status !== 'confirmado' ||
      guardado.operacion.accion !== 'borrador'
    ) {
      return
    }

    const confirmado = formularioDesdeDetalle(guardado.operacion.detalle)
    expect(guardado.edicion.formularioDePartida).toEqual(confirmado)
    expect(guardado.edicion.formularioDePartida.comentario).toBe(
      'Cambio sin guardar (normalizado por el backend)',
    )
    expect(guardado.edicion.formularioDePartida.comentario).not.toBe(
      'Cambio sin guardar',
    )
    expect(guardado.edicion.formularioDePartida.usuarioProximaTareaId).toBe(
      usuarioB.id,
    )
    expect(guardado.edicion.estado.formulario).toEqual(confirmado)
    expect(solicitarCancelarEdicion(guardado.edicion).status).toBe(
      'sin-cambios',
    )

    const paraDescartar = editar(base, {
      campo: 'comentario',
      valor: 'Otro cambio sin guardar',
    })
    const solicitud = solicitarCancelarEdicion(paraDescartar)
    if (solicitud.status !== 'confirmacion-pendiente') {
      throw new Error('Se esperaba la confirmación del descarte')
    }
    const descarte = resolverDescarte(solicitud.edicion, 'aceptar')

    expect(descarte.status).toBe('descartado')
    if (descarte.status !== 'descartado') return
    expect(descarte.edicion.estado.formulario).toEqual(formularioPersistido)
    expect(comandos.calls.guardarBorrador).toHaveLength(1)
    expect(comandos.calls.cancelar).toHaveLength(0)
    expect(comandos.calls.aprobar).toHaveLength(0)
    expect(comandos.calls.observar).toHaveLength(0)
  })

  it('registrarGuardado toma los valores del detalle confirmado, no los locales', () => {
    const local = editar(crearEdicionEnCurso(formularioPersistido), {
      campo: 'comentario',
      valor: 'Cambio sin guardar',
    })

    const sesion = registrarGuardado({
      status: 'confirmado',
      accion: 'borrador',
      detalle: detalleConfirmado,
    })

    expect(local.estado.formulario.comentario).toBe('Cambio sin guardar')
    expect(sesion.formularioDePartida).toEqual(
      formularioDesdeDetalle(detalleConfirmado),
    )
    expect(sesion.formularioDePartida.comentario).toBe(
      'Cambio sin guardar (normalizado por el backend)',
    )
    expect(sesion.formularioDePartida.usuarioProximaTareaId).toBe(usuarioB.id)
    expect(sesion.estado.formulario).toEqual(sesion.formularioDePartida)
    expect(solicitarCancelarEdicion(sesion).status).toBe('sin-cambios')
  })

  it('un guardado fallido conserva los valores y el punto de partida anterior', async () => {
    const comandos = createMockComandosRequerimientos(
      resultadosComandos({
        guardarBorrador: comandoFixture.error({
          message: 'No se pudo guardar',
          retryable: true,
        }),
      }),
    )
    const edicion = editar(crearEdicionEnCurso(formularioPersistido), {
      campo: 'comentario',
      valor: 'Cambio sin guardar',
    })

    const guardado = await guardarBorradorEnCurso(
      edicion,
      { requerimientoId, version: 2 },
      comandos,
    )

    expect(guardado.operacion.status).toBe('error')
    expect(guardado.edicion.estado.formulario.comentario).toBe(
      'Cambio sin guardar',
    )
    expect(guardado.edicion.formularioDePartida).toEqual(formularioPersistido)
    expect(solicitarCancelarEdicion(guardado.edicion).status).toBe(
      'confirmacion-pendiente',
    )
  })

  it('no expone un cambio de estado de dominio al descartar', () => {
    const edicion = editar(crearEdicionEnCurso(formularioPersistido), {
      campo: 'comentario',
      valor: 'Cambio sin guardar',
    })
    const solicitud = solicitarCancelarEdicion(edicion)
    if (solicitud.status !== 'confirmacion-pendiente') {
      throw new Error('Se esperaba la confirmación del descarte')
    }

    const resultado = resolverDescarte(solicitud.edicion, 'aceptar')

    expect(resultado).toMatchObject({
      status: 'descartado',
      volverAlContextoAnterior: true,
    })
    expect(Object.keys(resultado).sort()).toEqual([
      'edicion',
      'status',
      'volverAlContextoAnterior',
    ])
    expect(edicion.estado.formulario.comentario).toBe('Cambio sin guardar')
    if (resultado.status !== 'descartado') return
    expect(resultado.edicion.estado).toEqual(
      crearEstadoEdicion(formularioPersistido),
    )
  })
})
