"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import {
  CreditCard,
  Check,
  Crown,
  Zap,
  Rocket,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react"

interface SubscriptionContentProps {
  plan: string
  status: string
  hasStripeCustomer: boolean
  trialEndsAt: string | null
}

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    icon: Zap,
    monthlyPrice: 299,
    annualPrice: 2_990,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    features: [
      "Hasta 5 pantallas",
      "Listado en marketplace",
      "Solicitudes de cotización",
      "Soporte por email",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    icon: Crown,
    monthlyPrice: 599,
    annualPrice: 5_990,
    popular: true,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
    features: [
      "Hasta 20 pantallas",
      "Listado destacado",
      "Solicitudes de cotización",
      "Analytics básicos",
      "Soporte prioritario",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    icon: Rocket,
    monthlyPrice: 999,
    annualPrice: 9_990,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/30",
    features: [
      "Pantallas ilimitadas",
      "Listado premium + badge",
      "Solicitudes de cotización",
      "Analytics avanzados",
      "API access",
      "Soporte dedicado",
    ],
  },
]

export default function SubscriptionContent({
  plan,
  status,
  hasStripeCustomer,
  trialEndsAt,
}: SubscriptionContentProps) {
  const searchParams = useSearchParams()
  const success = searchParams.get("success")
  const canceled = searchParams.get("canceled")

  const [isAnnual, setIsAnnual] = useState(false)
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [portalLoading, setPortalLoading] = useState(false)

  const isSubscribed = plan !== "free" && status === "active"
  const isPastDue = status === "past_due"

  async function handleCheckout(planId: string) {
    setLoadingPlan(planId)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId, period: isAnnual ? "annual" : "monthly" }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || "Error al crear sesión de pago")
      }
    } catch {
      alert("Error de conexión")
    } finally {
      setLoadingPlan(null)
    }
  }

  async function handlePortal() {
    setPortalLoading(true)
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || "Error al abrir portal")
      }
    } catch {
      alert("Error de conexión")
    } finally {
      setPortalLoading(false)
    }
  }

  const currentPlan = PLANS.find((p) => p.id === plan)

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading font-bold text-2xl mb-1" style={{ letterSpacing: "-0.02em" }}>
          Suscripción
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Gestiona tu plan y método de pago
        </p>
      </motion.div>

      {/* Success / Canceled banners */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 mb-6 flex items-center gap-3"
        >
          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-700 dark:text-green-400">
              Suscripción activada exitosamente
            </p>
            <p className="text-xs text-green-600/80 dark:text-green-400/70 mt-0.5">
              Tu plan se ha actualizado. Los cambios pueden tardar unos segundos en reflejarse.
            </p>
          </div>
        </motion.div>
      )}

      {canceled && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 mb-6 flex items-center gap-3"
        >
          <XCircle className="w-5 h-5 text-amber-500 shrink-0" />
          <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
            El proceso de pago fue cancelado. Puedes intentar de nuevo cuando quieras.
          </p>
        </motion.div>
      )}

      {isPastDue && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 mb-6 flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-700 dark:text-red-400">
              Pago pendiente
            </p>
            <p className="text-xs text-red-600/80 dark:text-red-400/70 mt-0.5">
              Tu último pago no pudo procesarse. Actualiza tu método de pago para mantener tu suscripción.
            </p>
          </div>
        </motion.div>
      )}

      {/* Current plan card (if subscribed) */}
      {isSubscribed && currentPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-xl border border-border bg-card p-6 mb-8 shadow-[var(--shadow-card)]"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${currentPlan.bgColor} flex items-center justify-center`}>
                <currentPlan.icon className={`w-5 h-5 ${currentPlan.color}`} />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-lg">
                  Plan {currentPlan.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Estado: <span className="text-green-500 font-medium">Activo</span>
                </p>
              </div>
            </div>
            <button
              onClick={handlePortal}
              disabled={portalLoading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-border bg-card hover:bg-accent transition-colors disabled:opacity-50"
            >
              {portalLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ExternalLink className="w-4 h-4" />
              )}
              Gestionar suscripción
            </button>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex flex-wrap gap-3">
              {currentPlan.features.map((f) => (
                <span key={f} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Check className="w-3.5 h-3.5 text-primary" />
                  {f}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Plans grid (if not subscribed or wants to upgrade) */}
      {!isSubscribed && (
        <>
          {/* Period toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <span className={`text-sm font-medium ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
              Mensual
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                isAnnual ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  isAnnual ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
              Anual
            </span>
            {isAnnual && (
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                Ahorra 17%
              </span>
            )}
          </motion.div>

          {/* Plan cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLANS.map((p, i) => {
              const price = isAnnual ? p.annualPrice : p.monthlyPrice
              const isCurrentPlan = p.id === plan

              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06 }}
                  className={`relative rounded-xl border bg-card p-6 shadow-[var(--shadow-card)] transition-shadow hover:shadow-lg ${
                    p.popular ? `${p.borderColor} border-2` : "border-border"
                  }`}
                >
                  {p.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold text-primary bg-primary/10 border border-primary/20 px-3 py-0.5 rounded-full">
                      Más popular
                    </span>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg ${p.bgColor} flex items-center justify-center`}>
                      <p.icon className={`w-5 h-5 ${p.color}`} />
                    </div>
                    <h3 className="font-heading font-semibold text-lg">{p.name}</h3>
                  </div>

                  <div className="mb-5">
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono font-bold text-3xl">
                        ${price.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        MXN / {isAnnual ? "año" : "mes"}
                      </span>
                    </div>
                    {isAnnual && (
                      <p className="text-xs text-muted-foreground mt-1">
                        ${Math.round(p.annualPrice / 12).toLocaleString()} MXN / mes
                      </p>
                    )}
                  </div>

                  <ul className="space-y-2.5 mb-6">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className={`w-4 h-4 shrink-0 ${p.color}`} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleCheckout(p.id)}
                    disabled={loadingPlan !== null || isCurrentPlan}
                    className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      p.popular
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                        : "border border-border bg-card hover:bg-accent"
                    }`}
                  >
                    {loadingPlan === p.id ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Procesando...
                      </span>
                    ) : isCurrentPlan ? (
                      "Plan actual"
                    ) : (
                      "Elegir plan"
                    )}
                  </button>
                </motion.div>
              )
            })}
          </div>

          {/* Free plan note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-6"
          >
            <p className="text-xs text-muted-foreground">
              Plan gratuito: 1 pantalla, listado básico.{" "}
              {plan === "free" && (
                <span className="text-foreground font-medium">Es tu plan actual.</span>
              )}
            </p>
          </motion.div>
        </>
      )}

      {/* Subscribed — option to change plan */}
      {isSubscribed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]"
        >
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-heading font-semibold">Facturación</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Desde el portal de Stripe puedes cambiar de plan, actualizar tu método de pago, ver facturas y cancelar tu suscripción.
          </p>
          <button
            onClick={handlePortal}
            disabled={portalLoading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {portalLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ExternalLink className="w-4 h-4" />
            )}
            Abrir portal de facturación
          </button>
        </motion.div>
      )}
    </div>
  )
}
