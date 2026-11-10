/**
 * Componentes y patrones comunes del ERP (tablas, filtros, formularios,
 * diálogos, estados y mensajes).
 *
 * No duplican el contenedor ni la lógica transversal; los módulos los
 * reutilizan. Implementación en tareas posteriores; este andamiaje solo
 * reserva la carpeta y su barril.
 *
 * `contracts/` reúne tipos transversales (T-CORE-02): valores opacos,
 * error de contrato, capacidad efectiva y persistencia intra-sesión.
 */
export const SHARED_LAYER = 'shared' as const

export type * from './contracts'
