import type { Metadata } from "next"
import { Plus_Jakarta_Sans, DM_Sans, JetBrains_Mono } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const heading = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
})

const body = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: {
    default: "Pantallas MX — Marketplace de Publicidad Exterior en México",
    template: "%s | Pantallas MX",
  },
  description:
    "Encuentra espectaculares, pantallas digitales y espacios publicitarios en Mexicali, Tijuana y toda Baja California. Conectamos anunciantes con los mejores espacios de publicidad exterior.",
  keywords: [
    "publicidad exterior",
    "espectaculares",
    "pantallas digitales",
    "billboard",
    "Mexicali",
    "Tijuana",
    "Baja California",
    "marketplace",
    "anuncios",
  ],
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "Pantallas MX",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${heading.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
