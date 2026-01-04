import type React from "react"
import type { Metadata } from "next"
import { Fira_Code } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "NEXUS_TERMINAL // Portfolio Interface",
  description: "Cyberpunk DeFi Portfolio Dashboard",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${firaCode.className} antialiased`}>
        <div className="scanline-overlay" />
        <div className="crt-effect">{children}</div>
        <Analytics />
      </body>
    </html>
  )
}
