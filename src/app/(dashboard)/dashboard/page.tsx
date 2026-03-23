import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardContent from "@/components/dashboard/dashboard-content"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Get media owner
  const { data: mediaOwner } = await supabase
    .from("media_owners")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!mediaOwner) {
    return (
      <div className="text-center py-20">
        <h2 className="font-heading font-semibold text-xl mb-2">Perfil no encontrado</h2>
        <p className="text-muted-foreground">No se encontró un perfil de proveedor asociado a tu cuenta.</p>
      </div>
    )
  }

  // Get counts
  const { count: screensCount } = await supabase
    .from("screens")
    .select("*", { count: "exact", head: true })
    .eq("media_owner_id", mediaOwner.id)
    .eq("is_active", true)

  const { count: leadsCount } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true })
    .eq("media_owner_id", mediaOwner.id)

  const { count: newLeadsCount } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true })
    .eq("media_owner_id", mediaOwner.id)
    .eq("status", "new")

  // Get total views
  const { data: screens } = await supabase
    .from("screens")
    .select("views_count")
    .eq("media_owner_id", mediaOwner.id)

  const totalViews = screens?.reduce((sum, s) => sum + (s.views_count || 0), 0) || 0

  // Recent leads
  const { data: recentLeads } = await supabase
    .from("leads")
    .select("*, screen:screens(name, slug)")
    .eq("media_owner_id", mediaOwner.id)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <DashboardContent
      companyName={mediaOwner.company_name}
      metrics={{
        screens: screensCount || 0,
        leads: leadsCount || 0,
        newLeads: newLeadsCount || 0,
        views: totalViews,
      }}
      recentLeads={recentLeads || []}
    />
  )
}
