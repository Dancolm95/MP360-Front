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
export { evaluarTransicion } from './maquina'
export type { EfectoVencimiento } from './vencimiento'
export { efectoVencimiento } from './vencimiento'
