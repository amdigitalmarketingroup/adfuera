"use client"
import { motion } from "framer-motion"
import { CreditCard } from "lucide-react"

export default function CuentaPage() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading font-bold text-2xl mb-1">Suscripción</h1>
        <p className="text-sm text-muted-foreground mb-8">Gestiona tu plan y método de pago</p>
      </motion.div>
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <CreditCard className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Próximamente — integración con Stripe</p>
      </div>
    </div>
  )
}
