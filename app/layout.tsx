import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Cajá — Gestão de Festivais Culturais",
  description:
    "Plataforma de gestão operacional para festivais culturais brasileiros: programação, equipes, fornecedores e prestação de contas em um só lugar.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} bg-background text-foreground antialiased`}>
        {children}
        <Toaster richColors closeButton />
      </body>
    </html>
  )
}
