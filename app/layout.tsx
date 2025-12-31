import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AnimatedBackground } from "@/components/animated-background"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata = {
  title: 'Monexi | AI-Powered Finance Intelligence',
  description: 'Master your money with smart budgeting, real-time market tracking, and AI financial analysis. The future of personal finance is here.',
  icons: {
    icon: '/favicon.ico', 
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0f1729",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AnimatedBackground />
        <div className="relative z-10">{children}</div>
        <Analytics />
      </body>
    </html>
  )
}
