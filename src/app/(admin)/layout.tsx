import Link from "next/link"
import { MapPin, Shield } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="h-14 border-b border-border bg-card flex items-center px-6 gap-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <MapPin className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-heading font-bold text-sm">Adfuera</span>
        </Link>
        <div className="flex items-center gap-1.5 ml-4 px-2 py-1 rounded bg-amber-100 text-amber-700 text-xs font-medium">
          <Shield className="w-3 h-3" />
          Admin
        </div>
      </header>
      <main className="p-6 md:p-8 max-w-6xl mx-auto">{children}</main>
    </div>
  )
}
