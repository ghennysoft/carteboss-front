import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BOSS — Transformez chaque contact en opportunité',
  description: 'Digitalisez votre carte de visite, développez votre réseau et créez de nouvelles opportunités avec BOSS — la solution moderne, élégante et performante.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}