import { createClient } from "@/lib/supabase/server"
import { ScreenDetail } from "@/components/screens/screen-detail"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import type { Screen } from "@/types"

interface ScreenPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ScreenPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: screen } = await supabase
    .from("screens")
    .select("name, city, format_type, price_range_min, price_range_max")
    .eq("slug", slug)
    .single()

  if (!screen) return { title: "Pantalla no encontrada" }

  return {
    title: screen.name + " — " + screen.city,
    description: `${screen.name} en ${screen.city}. Publicidad exterior disponible desde $${screen.price_range_min?.toLocaleString() || "consultar"}/mes.`,
  }
}

export default async function ScreenPage({ params }: ScreenPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: screen } = await supabase
    .from("screens")
    .select("*, media_owner:media_owners(id, company_name, slug, logo_url, phone, email, is_verified, description, years_experience), photos:screen_photos(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  if (!screen) notFound()

  // Get similar screens (same city, different id)
  const { data: similar } = await supabase
    .from("screens")
    .select("*, photos:screen_photos(*)")
    .eq("city", screen.city)
    .eq("is_active", true)
    .eq("is_approved", true)
    .neq("id", screen.id)
    .limit(3)

  return <ScreenDetail screen={screen as Screen} similarScreens={(similar as Screen[]) || []} />
}
