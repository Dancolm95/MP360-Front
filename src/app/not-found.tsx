/**
 * Página 404 informativa (plan CORE-01 §2.3, resultado `not-found`).
 *
 * No muestra datos ni acciones: un destino desconocido no se convierte en
 * «Próximamente» ni en una vista ficticia.
 */
export default function NotFound() {
  return (
    <main>
      <h1>Página no encontrada</h1>
      <p>La dirección solicitada no existe o no está disponible.</p>
    </main>
  )
}
