/**
 * Contenedor ERP (CORE-01).
 *
 * Aquí vivirán la cabecera con identidad/contexto, la navegación horizontal,
 * el selector de módulos, los estados de sesión y el tratamiento de secciones
 * no implementadas. Implementación en T-CORE-04…T-CORE-08.
 *
 * `contracts/` define los puertos tipados del contenedor (T-CORE-02):
 * sesión/contexto/capacidades (C-01), catálogo de secciones (C-03), rutas
 * lógicas (C-04) y salida (C-02). Sin URLs, endpoints ni payloads.
 */
export const ERP_CONTAINER_LAYER = 'container' as const

export type * from './contracts'
