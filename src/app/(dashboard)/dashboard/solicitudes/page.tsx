import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { LeadsList } from "@/components/dashboard/leads-list"

export default async function SolicitudesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: mediaOwner } = await supabase
    .from("media_owners")
    .select("id")
    .eq("user_id", user.id)
    .single()

  const { data: leads } = await supabase
    .from("leads")
    .select("*, screen:screens(name, slug)")
    .eq("media_owner_id", mediaOwner?.id)
    .order("created_at", { ascending: false })

  return <LeadsList leads={leads || []} />
}
