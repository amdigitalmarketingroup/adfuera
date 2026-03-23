import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import SubscriptionContent from "@/components/dashboard/subscription-content"

export default async function CuentaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: mediaOwner } = await supabase
    .from("media_owners")
    .select("id, company_name, email, subscription_plan, subscription_status, stripe_customer_id, stripe_subscription_id, trial_ends_at")
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

  return (
    <SubscriptionContent
      plan={mediaOwner.subscription_plan || "free"}
      status={mediaOwner.subscription_status || "trial"}
      hasStripeCustomer={!!mediaOwner.stripe_customer_id}
      trialEndsAt={mediaOwner.trial_ends_at}
    />
  )
}
