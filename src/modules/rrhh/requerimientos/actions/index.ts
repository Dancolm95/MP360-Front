export type {
  AccionAjustePlazo,
  AccionEvaluable,
  AccionEvaluada,
  AccionGestion,
  CampoAccion,
  ErrorAccion,
  EvaluacionAcciones,
  FalloAccion,
  MotivoAccionNoDisponible,
  OpcionesAprobar,
  ResultadoAccion,
  ResultadoAccionAprobar,
  ResultadoAccionCancelar,
  ResultadoAccionFijarPlazo,
  ResultadoAccionObservar,
  ResultadoPlazoValidado,
  SolicitudCancelacion,
} from './types'
export {
  ACCIONES_GESTION,
  CAUSALES_CANCELACION,
} from './types'
export type {
  AjustePlazoProyectado,
  ContextoAjustePlazo,
  ResultadoAccionAjustarPlazo,
  ResultadoAjusteCalculado,
  SolicitudAjustePlazo,
} from './ajuste-plazo'
export {
  ajustarPlazoAdministrativo,
  calcularAjustePlazoAdministrativo,
} from './ajuste-plazo'
export {
  clasificacionDeDetalle,
  esAccionEjecutable,
  evaluarAccion,
  evaluarAcciones,
} from './elegibilidad'
export {
  comentarioNormalizado,
  esCausalCancelacion,
  validarCancelacion,
  validarComentarioObservacion,
  validarDiasHabilesAdministrativos,
  validarPlazoAdministrativoParaAprobar,
} from './reglas'
export {
  aprobarRequerimiento,
  cancelarRequerimiento,
  fijarPlazoAdministrativo,
  observarRequerimiento,
} from './ejecucion'
export type { FalloComandoContrato } from './resultados'
export { mapearFalloComando } from './resultados'
