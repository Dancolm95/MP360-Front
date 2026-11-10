import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'ERP MP 360',
}

/**
 * Layout raíz (Server Component).
 *
 * No resuelve sesión ni datos en el servidor: la sesión (C-01) es un puerto
 * opaco y el shell del contenedor se implementa como Client Component.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
