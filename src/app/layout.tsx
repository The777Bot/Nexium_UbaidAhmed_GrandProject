import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import Link from 'next/link'
import { ThemeProvider } from '@/lib/theme'
import ThemeToggle from '@/components/ThemeToggle'
import './globals.css'

const manrope = Manrope({ 
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Mental Health Tracker - Nexium',
  description: 'Track your mental health journey with comprehensive analytics and insights. Your daily companion for emotional well-being.',
  keywords: 'mental health, mood tracker, wellness, self-care, emotional health',
  authors: [{ name: 'Nexium Team' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${manrope.variable} scroll-smooth`}>
      <body className="font-manrope antialiased min-h-screen">
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="header">
              <div className="header-content">
                <div className="logo">
                  <div className="logo-icon">
                    <span>N</span>
                  </div>
                  <h1 className="logo-text">Nexium</h1>
                </div>
                <nav className="nav">
                  <Link href="/">Dashboard</Link>
                  <Link href="/insights">Insights</Link>
                  <Link href="/journal">Journal</Link>
                </nav>
                <ThemeToggle />
              </div>
            </header>

            {/* Main Content */}
            <main className="main">
              <div className="main-content">
                {children}
              </div>
            </main>

            {/* Footer */}
            <footer className="footer">
              <div className="footer-content">
                <div className="text-gray-600 text-sm">
                  <p>© 2024 Nexium. Your mental health journey matters.</p>
                  <p className="mt-1 text-gray-500">Built with care for your well-being</p>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}