import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kitten in the Rain - Cinematic Story',
  description: 'A touching cinematic story of a mother cat protecting her kitten in the rain',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
