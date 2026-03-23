import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createAdminClient } from "@/lib/supabase/admin"
import Stripe from "stripe"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get("stripe-signature")

  let event: Stripe.Event

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (webhookSecret && webhookSecret !== "placeholder_will_set_after_webhook_creation") {
    try {
      event = stripe.webhooks.constructEvent(body, sig!, webhookSecret)
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }
  } else {
    event = JSON.parse(body) as Stripe.Event
  }

  const supabase = createAdminClient()

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      const mediaOwnerId = session.metadata?.media_owner_id
      const plan = session.metadata?.plan
      if (mediaOwnerId && plan) {
        await supabase
          .from("media_owners")
          .update({
            subscription_plan: plan,
            subscription_status: "active",
            stripe_subscription_id: session.subscription as string,
          })
          .eq("id", mediaOwnerId)
      }
      break
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice
      const subDetails = invoice.parent?.subscription_details
      const subscriptionId = subDetails?.subscription
        ? (typeof subDetails.subscription === "string"
          ? subDetails.subscription
          : subDetails.subscription.id)
        : null
      if (subscriptionId) {
        await supabase
          .from("media_owners")
          .update({ subscription_status: "active" })
          .eq("stripe_subscription_id", subscriptionId)
      }
      break
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice
      const subDetails = invoice.parent?.subscription_details
      const subscriptionId = subDetails?.subscription
        ? (typeof subDetails.subscription === "string"
          ? subDetails.subscription
          : subDetails.subscription.id)
        : null
      if (subscriptionId) {
        await supabase
          .from("media_owners")
          .update({ subscription_status: "past_due" })
          .eq("stripe_subscription_id", subscriptionId)
      }
      break
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription
      await supabase
        .from("media_owners")
        .update({
          subscription_plan: "free",
          subscription_status: "cancelled",
          stripe_subscription_id: null,
        })
        .eq("stripe_subscription_id", subscription.id)
      break
    }
  }

  return NextResponse.json({ received: true })
}
