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
export type { EfectoVencimiento } from './vencimiento'
export { efectoVencimiento } from './vencimiento'
