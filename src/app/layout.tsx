import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import AuthProvider from '@/components/AuthProvider'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Algoree | Discover YouTube',
  description: 'Break the algorithm bubble with discovery-driven video engine.',
}

import Footer from '@/components/Footer'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white min-h-screen selection:bg-rose-500/30`}>
        <AuthProvider>
          <Navbar />
          <main className="pt-28 px-6">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
