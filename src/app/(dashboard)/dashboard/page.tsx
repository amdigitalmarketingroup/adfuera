"use client"

import { motion } from "framer-motion"
import { Monitor, MessageSquare, Eye, TrendingUp } from "lucide-react"

const metrics = [
  { label: "Pantallas activas", value: "—", icon: Monitor, change: null },
  { label: "Solicitudes", value: "—", icon: MessageSquare, change: null },
  { label: "Vistas totales", value: "—", icon: Eye, change: null },
  { label: "Tasa de respuesta", value: "—", icon: TrendingUp, change: null },
]

export default function DashboardPage() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading font-bold text-2xl mb-1" style={{ letterSpacing: "-0.02em" }}>
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Resumen de tu cuenta y actividad reciente
        </p>
      </motion.div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-muted-foreground">{metric.label}</p>
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <metric.icon className="w-4 h-4 text-primary" />
              </div>
            </div>
            <p className="font-mono font-bold text-2xl">{metric.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Placeholder sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-heading font-semibold mb-4">Solicitudes recientes</h3>
          <div className="text-center py-8">
            <MessageSquare className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Las solicitudes aparecerán aquí</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-heading font-semibold mb-4">Actividad de vistas</h3>
          <div className="text-center py-8">
            <Eye className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Las estadísticas aparecerán aquí</p>
          </div>
        </div>
      </div>
    </div>
  )
}
