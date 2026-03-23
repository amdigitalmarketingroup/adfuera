"use client"

import { motion } from "framer-motion"
import { Monitor, MessageSquare, Eye, Bell, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface DashboardContentProps {
  companyName: string
  metrics: { screens: number; leads: number; newLeads: number; views: number }
  recentLeads: any[]
}

export default function DashboardContent({ companyName, metrics, recentLeads }: DashboardContentProps) {
  const metricCards = [
    { label: "Pantallas activas", value: metrics.screens.toString(), icon: Monitor, change: null },
    { label: "Solicitudes totales", value: metrics.leads.toString(), icon: MessageSquare, change: metrics.newLeads > 0 ? `${metrics.newLeads} nuevas` : null },
    { label: "Vistas totales", value: metrics.views.toLocaleString(), icon: Eye, change: null },
  ]

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading font-bold text-2xl mb-1" style={{ letterSpacing: "-0.02em" }}>
          Hola, {companyName}
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Resumen de tu cuenta y actividad reciente
        </p>
      </motion.div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {metricCards.map((metric, i) => (
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
            {metric.change && (
              <Badge variant="secondary" className="mt-2 text-xs bg-primary/10 text-primary border-0">
                <Bell className="w-3 h-3 mr-1" />
                {metric.change}
              </Badge>
            )}
          </motion.div>
        ))}
      </div>

      {/* Recent leads */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="rounded-xl border border-border bg-card">
          <div className="p-5 border-b border-border">
            <h3 className="font-heading font-semibold">Solicitudes recientes</h3>
          </div>
          {recentLeads.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Las solicitudes aparecerán aquí</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentLeads.map((lead: any) => (
                <div key={lead.id} className="p-4 flex items-center gap-4 hover:bg-accent/50 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{lead.advertiser_name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {lead.screen?.name || "Pantalla"} • {lead.advertiser_email}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge variant={lead.status === "new" ? "default" : "secondary"} className="text-[10px]">
                      {lead.status === "new" ? "Nuevo" : lead.status === "read" ? "Leído" : lead.status}
                    </Badge>
                    <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1 justify-end">
                      <Clock className="w-2.5 h-2.5" />
                      {new Date(lead.created_at).toLocaleDateString("es-MX")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
