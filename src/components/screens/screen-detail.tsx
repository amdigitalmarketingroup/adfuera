"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  MapPin, Maximize2, Eye, Phone, Mail, Globe, ArrowLeft,
  Building2, Calendar, Ruler, Lightbulb, Compass, Layers,
  Car, Users, Clock, CheckCircle2, Send, Shield
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScreenCard } from "./screen-card"
import { FORMAT_TYPES, AVAILABILITY_STATUS } from "@/lib/constants"
import { formatPrice, formatNumber } from "@/lib/utils"
import type { Screen } from "@/types"

interface ScreenDetailProps {
  screen: Screen
  similarScreens: Screen[]
}

export function ScreenDetail({ screen, similarScreens }: ScreenDetailProps) {
  const [formSent, setFormSent] = useState(false)
  const [sending, setSending] = useState(false)
  const format = FORMAT_TYPES[screen.format_type]
  const status = AVAILABILITY_STATUS[screen.availability_status]

  const price =
    screen.price_range_min && screen.price_range_max
      ? `${formatPrice(screen.price_range_min)} — ${formatPrice(screen.price_range_max)}`
      : formatPrice(screen.price_monthly || screen.price_range_min)

  const specs = [
    screen.dimensions_width && screen.dimensions_height
      ? { icon: Ruler, label: "Dimensiones", value: `${screen.dimensions_width}x${screen.dimensions_height}m` }
      : null,
    screen.material ? { icon: Layers, label: "Material", value: screen.material } : null,
    screen.illumination ? { icon: Lightbulb, label: "Iluminación", value: screen.illumination === "none" ? "Sin iluminación" : screen.illumination === "front" ? "Frontal" : screen.illumination === "backlight" ? "Retroiluminado" : "LED propio" } : null,
    screen.orientation ? { icon: Compass, label: "Orientación", value: screen.orientation } : null,
    screen.faces_count > 1 ? { icon: Layers, label: "Caras", value: `${screen.faces_count} caras` } : null,
    screen.estimated_traffic ? { icon: screen.traffic_unit === "vehicles_day" ? Car : Users, label: "Tráfico estimado", value: `${formatNumber(screen.estimated_traffic)} ${screen.traffic_unit === "vehicles_day" ? "vehículos/día" : "personas/día"}` } : null,
    { icon: Clock, label: "Contrato mínimo", value: screen.min_contract_period === "negotiable" ? "Negociable" : screen.min_contract_period === "1_month" ? "1 mes" : screen.min_contract_period === "3_months" ? "3 meses" : screen.min_contract_period === "6_months" ? "6 meses" : "1 año" },
  ].filter(Boolean)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSending(true)
    // Simulate sending
    await new Promise(r => setTimeout(r, 1500))
    setFormSent(true)
    setSending(false)
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
          <Link href="/buscar" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Volver a resultados
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero image area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative h-64 md:h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 via-primary/5 to-transparent"
            >
              <div className="absolute inset-0 bg-grid opacity-30" />
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge variant="secondary" className="bg-black/30 text-white backdrop-blur-md border-0 font-semibold">
                  {format.label}
                </Badge>
                <Badge className={`backdrop-blur-md border-0 font-semibold ${screen.availability_status === "available" ? "bg-emerald-500/90 text-white" : screen.availability_status === "occupied" ? "bg-red-500/90 text-white" : "bg-amber-500/90 text-white"}`}>
                  {status.label}
                </Badge>
              </div>
            </motion.div>

            {/* Title */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h1 className="font-heading font-bold text-2xl md:text-3xl mb-2" style={{ letterSpacing: "-0.02em" }}>
                {screen.name}
              </h1>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>{screen.address || ""}{screen.zone_neighborhood ? `, ${screen.zone_neighborhood}` : ""}, {screen.city}</span>
              </div>
            </motion.div>

            {/* Description */}
            {screen.description && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <h2 className="font-heading font-semibold text-lg mb-2">Descripción</h2>
                <p className="text-muted-foreground leading-relaxed">{screen.description}</p>
              </motion.div>
            )}

            {/* Specs grid */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="font-heading font-semibold text-lg mb-4">Especificaciones</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {specs.map((spec: any) => (
                  <div key={spec.label} className="flex items-start gap-3 p-3.5 rounded-xl bg-card border border-border">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <spec.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{spec.label}</p>
                      <p className="text-sm font-medium mt-0.5">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Similar screens */}
            {similarScreens.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <h2 className="font-heading font-semibold text-lg mb-4">Espacios similares en {screen.city}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {similarScreens.map((s, i) => (
                    <ScreenCard key={s.id} screen={s} index={i} />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="sticky top-24 space-y-6"
            >
              <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
                <p className="text-xs text-muted-foreground mb-1">Precio mensual</p>
                <p className="font-mono font-bold text-3xl text-foreground mb-1">{price}</p>
                <p className="text-xs text-muted-foreground">/mes • {screen.min_contract_period === "negotiable" ? "contrato negociable" : ""}</p>
              </div>

              {/* Media owner card */}
              {screen.media_owner && (
                <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-heading font-semibold text-sm">{screen.media_owner.company_name}</p>
                        {screen.media_owner.is_verified && <Shield className="w-3.5 h-3.5 text-primary" />}
                      </div>
                      <p className="text-xs text-muted-foreground">Proveedor verificado</p>
                    </div>
                  </div>
                  {screen.media_owner.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{screen.media_owner.description}</p>
                  )}
                  <Link href={`/proveedor/${screen.media_owner.slug}`}>
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      Ver perfil del proveedor
                    </Button>
                  </Link>
                </div>
              )}

              {/* Lead form */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
                <h3 className="font-heading font-semibold text-base mb-4">Solicitar cotización</h3>
                {formSent ? (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-100 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    </div>
                    <p className="font-heading font-semibold mb-1">Solicitud enviada</p>
                    <p className="text-xs text-muted-foreground">El proveedor te contactará pronto.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                      <Label htmlFor="name" className="text-xs">Nombre *</Label>
                      <Input id="name" name="name" required placeholder="Tu nombre completo" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="company" className="text-xs">Empresa</Label>
                      <Input id="company" name="company" placeholder="Nombre de tu empresa" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-xs">Teléfono *</Label>
                      <Input id="phone" name="phone" type="tel" required placeholder="+52 686 000 0000" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-xs">Email *</Label>
                      <Input id="email" name="email" type="email" required placeholder="tu@empresa.com" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="message" className="text-xs">Mensaje</Label>
                      <Textarea id="message" name="message" placeholder="Cuéntanos sobre tu campaña..." rows={3} className="mt-1" />
                    </div>
                    <Button type="submit" className="w-full" disabled={sending}>
                      {sending ? "Enviando..." : "Enviar solicitud"}
                      {!sending && <Send className="w-4 h-4 ml-2" />}
                    </Button>
                    <p className="text-[10px] text-muted-foreground text-center">
                      Al enviar aceptas nuestros términos de servicio
                    </p>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
