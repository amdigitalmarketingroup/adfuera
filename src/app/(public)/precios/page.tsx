import { Metadata } from "next"
import Link from "next/link"
import { CheckCircle2, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Precios — Planes para proveedores",
  description: "Publica tus pantallas y espectaculares desde $299 MXN/mes. Sin comisiones por contacto.",
}

const plans = [
  {
    name: "Básico",
    price: 299,
    description: "Para proveedores que inician",
    screens: "3 pantallas",
    photos: "3 fotos por pantalla",
    features: ["Perfil público", "Recibir leads", "Estadísticas básicas (30 días)"],
    cta: "Empezar gratis",
    popular: false,
  },
  {
    name: "Estándar",
    price: 599,
    description: "Para proveedores en crecimiento",
    screens: "15 pantallas",
    photos: "5 fotos por pantalla",
    features: ["Todo lo del Básico", "Destacado en búsqueda", "Estadísticas completas (90 días)", "Botón de WhatsApp", "Soporte WhatsApp"],
    cta: "Empezar gratis",
    popular: true,
  },
  {
    name: "Pro",
    price: 1199,
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
  { q: "¿Cómo funciona el pago?", a: "Aceptamos tarjeta de crédito/débito y transferencia bancaria. El cobro es mensual." },
]

export default function PreciosPage() {
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
                <span className="font-mono font-bold text-4xl">${plan.price.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground ml-1">MXN/mes</span>
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
