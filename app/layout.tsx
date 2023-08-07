import './globals.css'
import type { Metadata } from 'next'
import { Lato } from 'next/font/google'

const lato = Lato({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'lcstore',
  description: 'An ecommerce created by luan'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={lato.className}>
      <body>
        {children}
      </body>
    </html>
  )
}
