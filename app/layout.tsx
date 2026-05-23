import type { Metadata } from "next"
import { Inter, Fraunces } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { SiteHeader } from "@/components/layout/header"
import "./globals.css"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
})

// CLAUDE.md §5: Fraunces (serif elegante) opcional para títulos/hero
const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Cajá — Gestão de Festivais Culturais",
  description:
    "A operação dos festivais culturais brasileiros, profissionalizada. Programação, contratações e curadoria com IA — em um só lugar.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} ${fraunces.variable} bg-background text-foreground antialiased`}
      >
        <SiteHeader />
        {children}
        <Toaster richColors closeButton />
      </body>
    </html>
  )
}
