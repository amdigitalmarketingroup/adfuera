import { createClient } from "@/lib/supabase/server"
import HomeContent from "@/components/home/home-content"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pantallas MX — Marketplace de Publicidad Exterior en México",
  description: "Encuentra espectaculares, pantallas digitales y espacios publicitarios en Mexicali, Tijuana y toda Baja California.",
}

export default async function HomePage() {
  const supabase = await createClient()

  // Featured screens
  const { data: screens } = await supabase
    .from("screens")
    .select("id, name, slug, format_type, city, zone_neighborhood, dimensions_width, dimensions_height, price_range_min, price_range_max, price_monthly, estimated_traffic, traffic_unit, availability_status")
    .eq("is_active", true)
    .eq("is_approved", true)
    .eq("availability_status", "available")
    .order("views_count", { ascending: false })
    .limit(3)

  // City screen counts
  const { count: mexicaliScreens } = await supabase
    .from("screens")
    .select("*", { count: "exact", head: true })
    .eq("city", "Mexicali")
    .eq("is_active", true)
    .eq("is_approved", true)

  const { count: tijuanaScreens } = await supabase
    .from("screens")
    .select("*", { count: "exact", head: true })
    .eq("city", "Tijuana")
    .eq("is_active", true)
    .eq("is_approved", true)

  // Total screens count
  const { count: totalScreens } = await supabase
    .from("screens")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true)
    .eq("is_approved", true)

  return (
    <HomeContent
      featuredScreens={screens || []}
      totalScreens={totalScreens || 0}
      cityCounts={{ mexicali: mexicaliScreens || 0, tijuana: tijuanaScreens || 0 }}
    />
  )
}
