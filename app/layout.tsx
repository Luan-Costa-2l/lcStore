import { Header } from '@/components/Header'
import './globals.css'
import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import { Footer } from '@/components/Footer'

const lato = Roboto({
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
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
