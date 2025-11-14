import { Toaster } from '@/components/ui/sonner'
import { Ubuntu_Sans } from 'next/font/google'
import React from 'react'

const ubuntu = Ubuntu_Sans({
  subsets: ['latin'],
})

import './globals.css'

export const metadata = {
  description: 'Abastecimento popular de alimentos agroecológicos.',
  title: 'CCRU - Coletivo Consumo Rural Urbano',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" className={ubuntu.className}>
      <body>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  )
}
