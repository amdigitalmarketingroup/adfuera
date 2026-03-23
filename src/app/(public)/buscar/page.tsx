import { createClient } from "@/lib/supabase/server"
import { SearchResults } from "@/components/search/search-results"
import type { Screen } from "@/types"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Buscar espacios publicitarios",
  description: "Encuentra espectaculares, pantallas digitales y espacios publicitarios en Mexicali y Tijuana.",
}

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    ciudad?: string
    formato?: string
    disponibilidad?: string
    precio?: string
  }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from("screens")
    .select("*, media_owner:media_owners(id, company_name, slug, logo_url, is_verified), photos:screen_photos(*)")
    .eq("is_active", true)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })

  if (params.ciudad) {
    // Map slug to city name
    const cityMap: Record<string, string> = { mexicali: "Mexicali", tijuana: "Tijuana" }
    const cityName = cityMap[params.ciudad]
    if (cityName) query = query.eq("city", cityName)
  }

  if (params.formato) {
    query = query.eq("format_type", params.formato)
  }

  if (params.disponibilidad) {
    query = query.eq("availability_status", params.disponibilidad)
  }

  if (params.precio) {
    const [min, max] = params.precio.split("-").map(Number)
    if (min) query = query.gte("price_range_min", min)
    if (max) query = query.lte("price_range_max", max)
    if (params.precio === "20000+") query = query.gte("price_range_min", 20000)
  }

  if (params.q) {
    query = query.or(`name.ilike.%${params.q}%,address.ilike.%${params.q}%,zone_neighborhood.ilike.%${params.q}%`)
  }

  const { data: screens } = await query

  return <SearchResults screens={(screens as Screen[]) || []} initialParams={params} />
}
