import { Toaster } from '@/components/ui/sonner'
import { Ubuntu_Sans } from 'next/font/google'
import React from 'react'

const ubuntu = Ubuntu_Sans({
  subsets: ['latin'],
})

import './globals.css'
import Link from 'next/link'

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
        <footer className="mx-auto container px-4 mt-4 mb-16">
          <p className="text-center text-xs text-muted-foreground">
            Desenvolvido por{' '}
            <Link href="https://www.viniciusofp.com.br" target="_blank" className="underline">
              viniciusofp
            </Link>
          </p>
        </footer>
        <Toaster />
      </body>
    </html>
  )
}
