import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import AdminNavbar from '@/components/AdminNavbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ArtistryHub Admin',
  description: 'Administrative portal for ArtistryHub',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AdminNavbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}

