import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Building2, MapPin, Phone, Mail, Globe, Shield, Calendar, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScreenCard } from "@/components/screens/screen-card"
import type { Screen, MediaOwner } from "@/types"
import type { Metadata } from "next"

interface ProviderPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProviderPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: owner } = await supabase
    .from("media_owners")
    .select("company_name, description")
    .eq("slug", slug)
    .single()

  if (!owner) return { title: "Proveedor no encontrado" }
  return {
    title: owner.company_name + " — Proveedor de publicidad exterior",
    description: owner.description || "Proveedor de espacios publicitarios en Baja California.",
  }
}

export default async function ProviderPage({ params }: ProviderPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: owner } = await supabase
    .from("media_owners")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!owner) notFound()

  const { data: screens } = await supabase
    .from("screens")
    .select("*, photos:screen_photos(*)")
    .eq("media_owner_id", owner.id)
    .eq("is_active", true)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })

  const ownerScreens = (screens as Screen[]) || []

  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <div className="mb-6">
          <Link href="/buscar" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Volver a resultados
          </Link>
        </div>

        {/* Provider header */}
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 mb-8 shadow-[var(--shadow-card)]">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <Building2 className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-heading font-bold text-2xl" style={{ letterSpacing: "-0.02em" }}>
                  {owner.company_name}
                </h1>
                {owner.is_verified && (
                  <Badge className="bg-primary/10 text-primary border-0 gap-1">
                    <Shield className="w-3 h-3" />
                    Verificado
                  </Badge>
                )}
              </div>
              {owner.description && (
                <p className="text-muted-foreground leading-relaxed mb-4 max-w-2xl">{owner.description}</p>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {owner.cities_operating && owner.cities_operating.length > 0 && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {owner.cities_operating.join(", ")}
                  </span>
                )}
                {owner.years_experience && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {owner.years_experience} años de experiencia
                  </span>
                )}
                {owner.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    {owner.phone}
                  </span>
                )}
                {owner.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    {owner.email}
                  </span>
                )}
                {owner.website && (
                  <a href={owner.website} target="_blank" rel="noopener" className="flex items-center gap-1.5 text-primary hover:underline">
                    <Globe className="w-3.5 h-3.5" />
                    Sitio web
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Screens */}
        <h2 className="font-heading font-semibold text-xl mb-6">
          {ownerScreens.length} {ownerScreens.length === 1 ? "espacio publicado" : "espacios publicados"}
        </h2>

        {ownerScreens.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {ownerScreens.map((screen, i) => (
              <ScreenCard key={screen.id} screen={screen} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-xl border border-border bg-card">
            <p className="text-muted-foreground">Este proveedor aún no tiene espacios publicados.</p>
          </div>
        )}
      </div>
    </div>
  )
}
