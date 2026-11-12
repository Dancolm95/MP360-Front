import type {
  ComandoAbrirProcesoSeleccion,
  ComandoAjustarPlazoAdministrativo,
  ComandoAprobar,
  ComandoCancelar,
  ComandoCrearRequerimiento,
  ComandoEnviarAprobacion,
  ComandoFijarPlazoAdministrativo,
  ComandoGuardarBorrador,
  ComandoObservar,
  ComandoSolicitarReversionCobertura,
  ComandosRequerimientosPort,
  ResultadoAbrirProceso,
  ResultadoAjustarPlazo,
  ResultadoAprobar,
  ResultadoCancelar,
  ResultadoCrearRequerimiento,
  ResultadoEnvioAprobacion,
  ResultadoFijarPlazo,
  ResultadoGuardarBorrador,
  ResultadoObservar,
  ResultadoSolicitarReversion,
} from '../contracts'
import { cloneFixtureValue, MOCK_KIND, type MockAdapter } from './support'

export interface MockCommandResults {
  readonly crear: ResultadoCrearRequerimiento
  readonly guardarBorrador: ResultadoGuardarBorrador
  readonly enviarAprobacion: ResultadoEnvioAprobacion
  readonly aprobar: ResultadoAprobar
  readonly observar: ResultadoObservar
  readonly cancelar: ResultadoCancelar
  readonly fijarPlazoAdministrativo: ResultadoFijarPlazo
  readonly ajustarPlazoAdministrativo: ResultadoAjustarPlazo
  readonly abrirProcesoSeleccion: ResultadoAbrirProceso
  readonly solicitarReversionCobertura: ResultadoSolicitarReversion
}

export interface MockCommandCalls {
  readonly crear: readonly ComandoCrearRequerimiento[]
  readonly guardarBorrador: readonly ComandoGuardarBorrador[]
  readonly enviarAprobacion: readonly ComandoEnviarAprobacion[]
  readonly aprobar: readonly ComandoAprobar[]
  readonly observar: readonly ComandoObservar[]
  readonly cancelar: readonly ComandoCancelar[]
  readonly fijarPlazoAdministrativo: readonly ComandoFijarPlazoAdministrativo[]
  readonly ajustarPlazoAdministrativo: readonly ComandoAjustarPlazoAdministrativo[]
  readonly abrirProcesoSeleccion: readonly ComandoAbrirProcesoSeleccion[]
  readonly solicitarReversionCobertura: readonly ComandoSolicitarReversionCobertura[]
}

export interface MockComandosRequerimientosPort
  extends ComandosRequerimientosPort,
    MockAdapter {
  readonly calls: MockCommandCalls
}

export function createMockComandosRequerimientos(
  configuredResults: MockCommandResults,
): MockComandosRequerimientosPort {
  const results = cloneFixtureValue(configuredResults)
  const calls = {
    crear: [] as ComandoCrearRequerimiento[],
    guardarBorrador: [] as ComandoGuardarBorrador[],
    enviarAprobacion: [] as ComandoEnviarAprobacion[],
    aprobar: [] as ComandoAprobar[],
    observar: [] as ComandoObservar[],
    cancelar: [] as ComandoCancelar[],
    fijarPlazoAdministrativo: [] as ComandoFijarPlazoAdministrativo[],
    ajustarPlazoAdministrativo: [] as ComandoAjustarPlazoAdministrativo[],
    abrirProcesoSeleccion: [] as ComandoAbrirProcesoSeleccion[],
    solicitarReversionCobertura: [] as ComandoSolicitarReversionCobertura[],
  }

  return {
    kind: MOCK_KIND,
    get calls() {
      return cloneFixtureValue(calls)
    },
    async crear(command) {
      calls.crear.push(cloneFixtureValue(command))
      return cloneFixtureValue(results.crear)
    },
    async guardarBorrador(command) {
      calls.guardarBorrador.push(cloneFixtureValue(command))
      return cloneFixtureValue(results.guardarBorrador)
    },
    async enviarAprobacion(command) {
      calls.enviarAprobacion.push(cloneFixtureValue(command))
      return cloneFixtureValue(results.enviarAprobacion)
    },
    async aprobar(command) {
      calls.aprobar.push(cloneFixtureValue(command))
      return cloneFixtureValue(results.aprobar)
    },
    async observar(command) {
      calls.observar.push(cloneFixtureValue(command))
      return cloneFixtureValue(results.observar)
    },
    async cancelar(command) {
      calls.cancelar.push(cloneFixtureValue(command))
      return cloneFixtureValue(results.cancelar)
    },
    async fijarPlazoAdministrativo(command) {
      calls.fijarPlazoAdministrativo.push(cloneFixtureValue(command))
      return cloneFixtureValue(results.fijarPlazoAdministrativo)
    },
    async ajustarPlazoAdministrativo(command) {
      calls.ajustarPlazoAdministrativo.push(cloneFixtureValue(command))
      return cloneFixtureValue(results.ajustarPlazoAdministrativo)
    },
    async abrirProcesoSeleccion(command) {
      calls.abrirProcesoSeleccion.push(cloneFixtureValue(command))
      return cloneFixtureValue(results.abrirProcesoSeleccion)
    },
    async solicitarReversionCobertura(command) {
      calls.solicitarReversionCobertura.push(cloneFixtureValue(command))
      return cloneFixtureValue(results.solicitarReversionCobertura)
    },
  }
}
