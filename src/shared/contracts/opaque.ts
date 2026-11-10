/**
 * Marca nominal para valores opacos del ERP (capacidades, identificadores
 * lógicos, rutas lógicas).
 *
 * El objetivo es impedir que una URL, un endpoint, un nombre de rol o un
 * `string` arbitrario se use donde se espera un valor opaco acordado entre
 * contenedor y módulos. `Tag` distingue dominios opacos entre sí: dos tipos
 * con `Tag` distinto son incompatibles aunque ambos deriven de `string`.
 *
 * Solo el adaptador (o el backend) produce estos valores; el frontend los
 * trata como opacos y no los interpreta.
 */
export type Opaque<T, Tag extends string> = T & { readonly __mp360Opaque: Tag }
