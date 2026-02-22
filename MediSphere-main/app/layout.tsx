import type React from "react"
import type { Metadata } from "next"
// Removed Geist font imports due to prerendering issues
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AuthProvider } from "@/contexts/firebase-auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "MediSphere — Smart Healthcare",
  description: "Real-Time Hospital Management and Emergency Assistance"
}

function ThemeScript() {
  const code = `
  try {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored || (prefersDark ? 'dark' : 'light');
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  } catch {}
  `
  return <script dangerouslySetInnerHTML={{ __html: code }} />
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <Suspense fallback={null}>
          <ThemeProvider>
            <AuthProvider>
              <ThemeScript />
              {children}
            </AuthProvider>
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
