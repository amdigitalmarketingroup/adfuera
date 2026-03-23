import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProfileEditor } from "@/components/dashboard/profile-editor"

export default async function PerfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: mediaOwner } = await supabase
    .from("media_owners")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!mediaOwner) redirect("/login")

  return <ProfileEditor initialData={mediaOwner} />
}
