import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const { data: mediaOwner } = await supabase
      .from("media_owners")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single()

    if (!mediaOwner?.stripe_customer_id) {
      return NextResponse.json({ error: "No tienes suscripción activa" }, { status: 400 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://adfuera.25ocho.agency"

    const session = await stripe.billingPortal.sessions.create({
      customer: mediaOwner.stripe_customer_id,
      return_url: `${appUrl}/dashboard/cuenta`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error("Portal error:", err)
    return NextResponse.json({ error: "Error al abrir portal" }, { status: 500 })
  }
}
