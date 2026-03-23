"use client"
import { motion } from "framer-motion"
import { Building2 } from "lucide-react"

export default function PerfilPage() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading font-bold text-2xl mb-1">Perfil de empresa</h1>
        <p className="text-sm text-muted-foreground mb-8">Administra la información de tu empresa</p>
      </motion.div>
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <Building2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Próximamente</p>
      </div>
    </div>
  )
}
