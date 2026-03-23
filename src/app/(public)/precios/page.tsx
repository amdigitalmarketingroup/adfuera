"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckCircle2, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const plans = [
  {
    name: "Básico",
    monthlyPrice: 599,
    annualPrice: 5750,
    description: "Para proveedores que inician",
    screens: "3 pantallas",
    photos: "3 fotos por pantalla",
    features: ["Perfil público", "Recibir leads", "Estadísticas básicas (30 días)"],
    cta: "Empezar gratis",
    popular: false,
  },
  {
    name: "Estándar",
    monthlyPrice: 1199,
    annualPrice: 11510,
    description: "Para proveedores en crecimiento",
    screens: "15 pantallas",
    photos: "5 fotos por pantalla",
    features: ["Todo lo del Básico", "Destacado en búsqueda", "Estadísticas completas (90 días)", "Botón de WhatsApp", "Soporte WhatsApp"],
    cta: "Empezar gratis",
    popular: true,
  },
  {
    name: "Pro",
    monthlyPrice: 2399,
    annualPrice: 23030,
    description: "Para empresas establecidas",
    screens: "Pantallas ilimitadas",
    photos: "10 fotos por pantalla",
    features: ["Todo lo del Estándar", "Prioridad máxima en búsqueda", "Estadísticas + exportar (12 meses)", "Cotizaciones automáticas", "Soporte prioritario"],
    cta: "Empezar gratis",
    popular: false,
  },
]

const faqs = [
  { q: "¿Cuánto dura la prueba gratis?", a: "30 días completos sin necesidad de tarjeta de crédito. Puedes explorar todas las funciones del plan que elijas." },
  { q: "¿Cobran comisión por contacto?", a: "No. Los leads que recibes son 100% tuyos. No cobramos comisión por contacto ni por cierre." },
  { q: "¿Puedo cambiar de plan?", a: "Sí, puedes subir o bajar de plan en cualquier momento desde tu panel de control." },
  { q: "¿Cómo funciona el pago?", a: "Aceptamos tarjeta de crédito/débito y transferencia bancaria. El cobro es mensual o anual según tu preferencia." },
  { q: "¿El plan anual tiene descuento?", a: "Sí. Al pagar anualmente obtienes un 20% de descuento sobre el precio mensual." },
]

export default function PreciosPage() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm">
            30 días gratis
          </Badge>
          <h1 className="font-heading font-bold text-3xl md:text-4xl mb-4" style={{ letterSpacing: "-0.03em" }}>
            Planes simples y transparentes
          </h1>
          <p className="text-lg text-muted-foreground">
            Sin comisiones por contacto. Sin sorpresas. Cancela cuando quieras.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-sm font-medium transition-colors ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
            Mensual
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
              isAnnual ? "bg-primary" : "bg-muted"
            }`}
            role="switch"
            aria-checked={isAnnual}
            aria-label="Cambiar entre facturación mensual y anual"
          >
            <span
              className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ${
                isAnnual ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
          <span className={`text-sm font-medium transition-colors ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
            Anual
          </span>
          {isAnnual && (
            <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold">
              Ahorra 20%
            </Badge>
          )}
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-24">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border bg-card p-7 ${
                plan.popular
                  ? "border-primary shadow-[var(--shadow-lg)] scale-[1.02]"
                  : "border-border shadow-[var(--shadow-card)]"
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3">
                  Más popular
                </Badge>
              )}
              <div className="mb-6">
                <h3 className="font-heading font-semibold text-lg">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              </div>
              <div className="mb-6">
                {isAnnual ? (
                  <>
                    <span className="font-mono font-bold text-4xl">${plan.annualPrice.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground ml-1">MXN/año</span>
                    <div className="mt-1">
                      <span className="text-xs text-muted-foreground line-through">${(plan.monthlyPrice * 12).toLocaleString()}/año</span>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="font-mono font-bold text-4xl">${plan.monthlyPrice.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground ml-1">MXN/mes</span>
                  </>
                )}
              </div>
              <div className="text-sm font-medium mb-1">{plan.screens}</div>
              <div className="text-xs text-muted-foreground mb-6">{plan.photos}</div>
              <ul className="space-y-2.5 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/registro">
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading font-bold text-2xl text-center mb-10" style={{ letterSpacing: "-0.02em" }}>
            Preguntas frecuentes
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-heading font-semibold text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-primary shrink-0" />
                  {faq.q}
                </h3>
                <p className="text-sm text-muted-foreground mt-2 ml-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
