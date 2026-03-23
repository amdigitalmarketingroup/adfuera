import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
})

export const PRICE_IDS = {
  basic: {
    monthly: process.env.STRIPE_PRICE_BASIC_MONTHLY!,
    annual: process.env.STRIPE_PRICE_BASIC_ANNUAL!,
  },
  standard: {
    monthly: process.env.STRIPE_PRICE_STANDARD_MONTHLY!,
    annual: process.env.STRIPE_PRICE_STANDARD_ANNUAL!,
  },
  pro: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY!,
    annual: process.env.STRIPE_PRICE_PRO_ANNUAL!,
  },
} as const
