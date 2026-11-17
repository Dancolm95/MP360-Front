export type {
  BorradorConfirmado,
  DecisionDescarte,
  EdicionEnCurso,
  ResultadoDescarte,
  ResultadoGuardadoEnCurso,
  ResultadoSolicitudCancelacion,
} from './cancelar-edicion'
export {
  crearEdicionEnCurso,
  guardarBorradorEnCurso,
  registrarGuardado,
  resolverDescarte,
  solicitarCancelarEdicion,
} from './cancelar-edicion'
export type {
  LecturaObservacion,
  MotivoSinObservacion,
  ObservacionVigente,
} from './observacion'
export { observacionVigente } from './observacion'
export type {
  CabeceraRevision,
  CampoRevision,
  CampoRevisionValor,
  DuracionRevision,
  ErrorRevision,
  ModoRevision,
  OpcionesRevision,
  RevisionRequerimiento,
  TipoEnvio,
} from './modelo'
export {
  ETIQUETAS_CAMPO_REVISION,
  ETIQUETAS_ERROR_CAMPO,
  NO_APLICA,
  NO_DISPONIBLE,
  PENDIENTE_DEFINIR,
  SIN_ASIGNAR,
  SIN_COLABORADOR,
  SIN_COMPLETAR,
  SIN_DETERMINAR,
  SIN_SUBAREA,
  borradorDesdeFormulario,
  crearDuracionRevision,
  crearRevision,
  erroresRevision,
} from './modelo'
export type {
  AccionOperacion,
  DatoConfirmacion,
  ErrorOperacionRevision,
  EstadoConfirmacion,
  EstadoEdicion,
  EstadoEdicionRevision,
  EstadoOperacion,
  EstadoRevision,
  PasoEdicionRevision,
  ResultadoOperacion,
  ResultadoTransicion,
  SolicitudVersionada,
  TransicionIlegal,
} from './estado'
export {
  confirmacionDesdeEnvio,
  crearEstadoEdicion,
  editarFormulario,
  enviarAprobacion,
  erroresOperacionRevision,
  guardarBorrador,
  revisar,
  volverAEditar,
} from './estado'
