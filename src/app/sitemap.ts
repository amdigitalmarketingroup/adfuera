import type { MetadataRoute } from "next"
import { createAdminClient } from "@/lib/supabase/admin"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://pantallas.25ocho.agency"
  const supabase = createAdminClient()

  // Get all active screens
  const { data: screens } = await supabase
    .from("screens")
    .select("slug, updated_at")
    .eq("is_active", true)
    .eq("is_approved", true)

  // Get all media owners
  const { data: owners } = await supabase
    .from("media_owners")
    .select("slug, updated_at")

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/buscar`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/mexicali`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/tijuana`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/precios`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/como-funciona`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ]

  const screenPages: MetadataRoute.Sitemap = (screens || []).map((s) => ({
    url: `${baseUrl}/pantalla/${s.slug}`,
    lastModified: new Date(s.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  const ownerPages: MetadataRoute.Sitemap = (owners || []).map((o) => ({
    url: `${baseUrl}/proveedor/${o.slug}`,
    lastModified: new Date(o.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }))

  return [...staticPages, ...screenPages, ...ownerPages]
}
