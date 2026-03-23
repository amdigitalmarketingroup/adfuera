import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

const ADMIN_EMAILS = ["25ochoagency@gmail.com", "marioandrearreola@gmail.com"]

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !ADMIN_EMAILS.includes(user.email || "")) redirect("/")

  const { count: totalScreens } = await supabase.from("screens").select("*", { count: "exact", head: true })
  const { count: pendingScreens } = await supabase.from("screens").select("*", { count: "exact", head: true }).eq("is_approved", false)
  const { count: totalOwners } = await supabase.from("media_owners").select("*", { count: "exact", head: true })
  const { count: totalLeads } = await supabase.from("leads").select("*", { count: "exact", head: true })

  const { data: pendingList } = await supabase
    .from("screens")
    .select("*, media_owner:media_owners(company_name)")
    .eq("is_approved", false)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  return (
    <AdminDashboard
      stats={{ totalScreens: totalScreens || 0, pendingScreens: pendingScreens || 0, totalOwners: totalOwners || 0, totalLeads: totalLeads || 0 }}
      pendingScreens={pendingList || []}
    />
  )
}
