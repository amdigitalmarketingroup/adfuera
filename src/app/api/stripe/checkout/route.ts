import { NextRequest, NextResponse } from "next/server"
import { stripe, PRICE_IDS } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const { plan, period } = await request.json()
    
    if (!plan || !period || !PRICE_IDS[plan as keyof typeof PRICE_IDS]) {
      return NextResponse.json({ error: "Plan inválido" }, { status: 400 })
    }

    const priceId = PRICE_IDS[plan as keyof typeof PRICE_IDS][period as "monthly" | "annual"]
    if (!priceId) return NextResponse.json({ error: "Periodo inválido" }, { status: 400 })

    // Get or create Stripe customer
    const { data: mediaOwner } = await supabase
      .from("media_owners")
      .select("id, stripe_customer_id, company_name, email")
      .eq("user_id", user.id)
      .single()

    if (!mediaOwner) return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 })

    let customerId = mediaOwner.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: mediaOwner.email || user.email,
        name: mediaOwner.company_name,
        metadata: { media_owner_id: mediaOwner.id, user_id: user.id },
      })
      customerId = customer.id
      await supabase
        .from("media_owners")
        .update({ stripe_customer_id: customerId })
        .eq("id", mediaOwner.id)
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pantallas.25ocho.agency"

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard/cuenta?success=true`,
      cancel_url: `${appUrl}/dashboard/cuenta?canceled=true`,
      metadata: { media_owner_id: mediaOwner.id, plan, period },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error("Checkout error:", err)
    return NextResponse.json({ error: "Error al crear sesión de pago" }, { status: 500 })
  }
}
