import Link from "next/link"
import { MapPin, Search, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
          <MapPin className="w-7 h-7 text-primary" />
        </div>
        <h1 className="font-heading font-bold text-6xl text-primary mb-2">404</h1>
        <h2 className="font-heading font-semibold text-xl mb-3">Página no encontrada</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Lo sentimos, la página que buscas no existe o fue movida. Intenta buscar espacios publicitarios disponibles.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio
            </Button>
          </Link>
          <Link href="/buscar">
            <Button className="gap-2 w-full sm:w-auto">
              <Search className="w-4 h-4" />
              Buscar espacios
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
