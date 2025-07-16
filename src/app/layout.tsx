import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Regex Wars',
  description: 'A cyberpunk-themed puzzle game that teaches regex mastery',
  keywords: ['regex', 'game', 'puzzle', 'educational', 'cyberpunk'],
  authors: [{ name: 'Jakob Grant' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="min-h-screen bg-cyber-black antialiased">
        {children}
      </body>
    </html>
  )
}