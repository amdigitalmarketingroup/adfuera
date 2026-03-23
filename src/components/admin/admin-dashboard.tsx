"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Monitor, Users, MessageSquare, Clock, CheckCircle2, XCircle, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { FORMAT_TYPES } from "@/lib/constants"

interface AdminDashboardProps {
  stats: { totalScreens: number; pendingScreens: number; totalOwners: number; totalLeads: number }
  pendingScreens: any[]
}

export function AdminDashboard({ stats, pendingScreens: initial }: AdminDashboardProps) {
  const [pending, setPending] = useState(initial)

  const handleApprove = async (id: string) => {
    const supabase = createClient()
    await supabase.from("screens").update({ is_approved: true }).eq("id", id)
    setPending((p) => p.filter((s) => s.id !== id))
  }

  const handleReject = async (id: string) => {
    const supabase = createClient()
    await supabase.from("screens").update({ is_active: false }).eq("id", id)
    setPending((p) => p.filter((s) => s.id !== id))
  }

  const metricCards = [
    { label: "Pantallas totales", value: stats.totalScreens, icon: Monitor },
    { label: "Pendientes", value: stats.pendingScreens, icon: Clock },
    { label: "Proveedores", value: stats.totalOwners, icon: Users },
    { label: "Leads totales", value: stats.totalLeads, icon: MessageSquare },
  ]

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading font-bold text-2xl mb-1">Panel de administración</h1>
        <p className="text-sm text-muted-foreground mb-8">Gestión global de Pantallas MX</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metricCards.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">{m.label}</span>
              <m.icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="font-mono font-bold text-2xl">{m.value}</p>
          </motion.div>
        ))}
      </div>

      <h2 className="font-heading font-semibold text-lg mb-4">Pantallas pendientes de aprobación</h2>
      {pending.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-500/40 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No hay pantallas pendientes</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pending.map((screen: any) => {
            const format = FORMAT_TYPES[screen.format_type as keyof typeof FORMAT_TYPES]
            return (
              <div key={screen.id} className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-semibold text-sm">{screen.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />{screen.city}
                    {" · "}{screen.media_owner?.company_name}
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs">{format?.label}</Badge>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="outline" onClick={() => handleReject(screen.id)} className="text-red-600 hover:bg-red-50 gap-1">
                    <XCircle className="w-3.5 h-3.5" />
                    Rechazar
                  </Button>
                  <Button size="sm" onClick={() => handleApprove(screen.id)} className="gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Aprobar
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
