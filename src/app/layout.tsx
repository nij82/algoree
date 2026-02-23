import './globals.css'
import type { Metadata } from 'next'
import AuthProvider from '@/components/AuthProvider'
import Navbar from '@/components/Navbar'


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
      <body className="bg-background text-on-surface min-h-screen selection:bg-rose-500/30">
        <AuthProvider>
          <Navbar />
          <main className="pt-32 pb-16 px-6 md:px-12 lg:px-16 max-w-[1920px] mx-auto">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
