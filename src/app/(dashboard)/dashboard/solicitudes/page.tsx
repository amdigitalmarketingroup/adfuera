"use client"

import { motion } from "framer-motion"
import { MessageSquare } from "lucide-react"

export default function SolicitudesPage() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading font-bold text-2xl mb-1" style={{ letterSpacing: "-0.02em" }}>Solicitudes</h1>
        <p className="text-sm text-muted-foreground mb-8">Gestiona las solicitudes de cotización de anunciantes</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-border bg-card p-12 text-center"
      >
        <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
        <h3 className="font-heading font-semibold mb-1">Sin solicitudes aún</h3>
        <p className="text-sm text-muted-foreground">Cuando un anunciante solicite cotización, aparecerá aquí.</p>
      </motion.div>
    </div>
  )
}
