export type {
  MotivoRechazoTransicion,
  ResultadoTransicionEstado,
  SolicitudTransicion,
  SucesoTransicion,
  TransicionPermitida,
  TransicionRechazada,
} from './types'
export { SUCESOS_TRANSICION } from './types'
export type {
  DefinicionTransicion,
  DestinoTransicion,
} from './model'
export { TRANSICIONES } from './model'
export { evaluarTransicion, MENSAJES_RECHAZO } from './maquina'
export type { ResultadoConfirmacionAperturaProceso } from './apertura-proceso'
export { confirmarAperturaProcesoSeleccion } from './apertura-proceso'
export type { ResultadoNavegacionAsociarCandidato } from './asociar-candidato'
export {
  MENSAJE_SIN_PROCESO,
  resolverNavegacionAsociarCandidato,
} from './asociar-candidato'
export type {
  ConfirmacionPrimerDiaReal,
  ResultadoConfirmacionPrimerDiaReal,
} from './primer-dia-real'
export { confirmarPrimerDiaReal } from './primer-dia-real'
export type {
  ConfirmacionReversionCobertura,
  MotivoRechazoReversion,
  ResultadoConfirmacionReversionCobertura,
} from './reversion-cobertura'
export {
  confirmarReversionCobertura,
  MENSAJE_REVERSION_NO_RETROCEDE,
} from './reversion-cobertura'
export type { EfectoVencimiento } from './vencimiento'
export { efectoVencimiento } from './vencimiento'
