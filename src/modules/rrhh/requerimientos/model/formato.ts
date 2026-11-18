/** Fecha civil `YYYY-MM-DD` mostrada como `DD/MM/YYYY`, sin depender del huso. */
export function formatearFecha(valor: string): string {
  const [anio, mes, dia] = valor.slice(0, 10).split('-')
  if (!anio || !mes || !dia) return valor
  return `${dia}/${mes}/${anio}`
}
