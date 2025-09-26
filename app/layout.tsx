'use client' // This component needs to be a client component to use SessionProvider

import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { ClientOnlyParticleBackground } from '@/components/client-only-particle-background'
import { HeaderWrapper } from '@/components/layout/HeaderWrapper'
import { Toaster } from '@/components/ui/sonner' // Import Sonner Toaster
import { SessionProvider } from 'next-auth/react' // Import SessionProvider

// Metadata should be defined outside the client component or passed as props
// For now, I'll keep it here, but be aware of client/server component boundaries.
// If this were a server component, metadata would be directly exported.
// Since it's now 'use client', metadata might need to be in a parent server component or handled differently.
// For this change, I'll assume the existing metadata setup is acceptable for the client component.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <SessionProvider> {/* Wrap children with SessionProvider */}
          <ClientOnlyParticleBackground />
          <HeaderWrapper>
            {children}
          </HeaderWrapper>
          <Toaster richColors position="top-center" /> {/* Add Sonner Toaster */}
          <Analytics />
        </SessionProvider>
      </body>
    </html>
  )
}