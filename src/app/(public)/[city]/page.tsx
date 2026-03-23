import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { MapPin, ArrowRight, Monitor, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScreenCard } from "@/components/screens/screen-card"
import { ScreenMap } from "@/components/maps/screen-map"
import { FORMAT_TYPES } from "@/lib/constants"
import type { Screen } from "@/types"
import type { Metadata } from "next"

const CITY_DATA: Record<string, { name: string; state: string; lat: number; lng: number; description: string }> = {
  mexicali: {
    name: "Mexicali",
    state: "Baja California",
    lat: 32.6245,
    lng: -115.4523,
    description: "Capital de Baja California y una de las ciudades con mayor actividad comercial en la frontera norte. Encuentra espectaculares, pantallas digitales y mupis en las principales avenidas y centros comerciales de Mexicali.",
  },
  tijuana: {
    name: "Tijuana",
    state: "Baja California",
    lat: 32.5149,
    lng: -117.0382,
    description: "La ciudad fronteriza más visitada del mundo. Publicita tu marca en espectaculares sobre la Vía Rápida, pantallas digitales en Zona Río y espacios premium en los centros comerciales más concurridos de Tijuana.",
  },
}

interface CityPageProps {
  params: Promise<{ city: string }>
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { city: slug } = await params
  const city = CITY_DATA[slug]
  if (!city) return { title: "Ciudad no encontrada" }
  return {
    title: `Publicidad exterior en ${city.name} — Espectaculares y pantallas`,
    description: `Encuentra espectaculares, pantallas digitales y espacios publicitarios en ${city.name}, ${city.state}. Directorio completo con precios, ubicaciones y disponibilidad.`,
  }
}

export async function generateStaticParams() {
  return [{ city: "mexicali" }, { city: "tijuana" }]
}

export default async function CityPage({ params }: CityPageProps) {
  const { city: slug } = await params
  const city = CITY_DATA[slug]
  if (!city) notFound()

  const supabase = await createClient()

  const { data: screens } = await supabase
    .from("screens")
    .select("*, photos:screen_photos(*)")
    .eq("city", city.name)
    .eq("is_active", true)
    .eq("is_approved", true)
    .order("availability_status", { ascending: true })
    .order("views_count", { ascending: false })

  const allScreens = (screens as Screen[]) || []

  // Count by format
  const formatCounts: Record<string, number> = {}
  allScreens.forEach((s) => {
    formatCounts[s.format_type] = (formatCounts[s.format_type] || 0) + 1
  })

  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
            <span>/</span>
            <span>{city.name}</span>
          </div>
          <h1 className="font-heading font-bold text-3xl md:text-4xl mb-3" style={{ letterSpacing: "-0.03em" }}>
            Publicidad exterior en {city.name}
          </h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed mb-6">{city.description}</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(formatCounts).map(([key, count]) => {
              const format = FORMAT_TYPES[key as keyof typeof FORMAT_TYPES]
              return (
                <Link key={key} href={`/buscar?ciudad=${slug}&formato=${key}`}>
                  <Badge variant="secondary" className="px-3 py-1.5 cursor-pointer hover:bg-accent transition-colors">
                    {format?.label || key} ({count})
                  </Badge>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Map */}
        <div className="h-[300px] md:h-[400px] rounded-2xl overflow-hidden border border-border mb-12">
          <ScreenMap screens={allScreens} center={[city.lat, city.lng]} zoom={13} />
        </div>

        {/* Screens grid */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-semibold text-xl">
            {allScreens.length} {allScreens.length === 1 ? "espacio disponible" : "espacios disponibles"}
          </h2>
          <Link href={`/buscar?ciudad=${slug}`}>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Search className="w-3.5 h-3.5" />
              Filtrar
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {allScreens.map((screen, i) => (
            <ScreenCard key={screen.id} screen={screen} index={i} />
          ))}
        </div>

        {allScreens.length === 0 && (
          <div className="text-center py-16">
            <Monitor className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <h3 className="font-heading font-semibold mb-1">Sin espacios registrados aún</h3>
            <p className="text-sm text-muted-foreground mb-4">Sé el primero en publicar tus pantallas en {city.name}</p>
            <Link href="/registro"><Button>Registrarse como proveedor</Button></Link>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 text-center p-10 rounded-2xl bg-card border border-border">
          <h3 className="font-heading font-semibold text-xl mb-2">¿Tienes pantallas en {city.name}?</h3>
          <p className="text-muted-foreground mb-6">Publica tus espacios y recibe solicitudes de anunciantes.</p>
          <Link href="/registro"><Button size="lg">Publicar gratis</Button></Link>
        </div>
      </div>
    </div>
  )
}
