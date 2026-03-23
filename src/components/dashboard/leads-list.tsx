"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Phone, Mail, Building2, Calendar, ChevronDown, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { LEAD_STATUS } from "@/lib/constants"

interface LeadsListProps {
  leads: any[]
}

export function LeadsList({ leads: initialLeads }: LeadsListProps) {
  const [leads, setLeads] = useState(initialLeads)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const updateStatus = async (leadId: string, newStatus: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from("leads")
      .update({ status: newStatus, responded_at: newStatus !== "new" ? new Date().toISOString() : null })
      .eq("id", leadId)

    if (!error) {
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
      )
    }
  }

  const statusColors: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    read: "bg-gray-100 text-gray-700",
    contacted: "bg-yellow-100 text-yellow-700",
    negotiating: "bg-orange-100 text-orange-700",
    won: "bg-emerald-100 text-emerald-700",
    lost: "bg-red-100 text-red-700",
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading font-bold text-2xl mb-1" style={{ letterSpacing: "-0.02em" }}>
          Solicitudes
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          {leads.length} {leads.length === 1 ? "solicitud" : "solicitudes"} de cotizaci\u00f3n
        </p>
      </motion.div>

      {leads.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <h3 className="font-heading font-semibold mb-1">Sin solicitudes a\u00fan</h3>
          <p className="text-sm text-muted-foreground">Cuando un anunciante solicite cotizaci\u00f3n, aparecer\u00e1 aqu\u00ed.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead: any, i: number) => {
            const status = LEAD_STATUS[lead.status as keyof typeof LEAD_STATUS]
            const expanded = expandedId === lead.id
            return (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card overflow-hidden"
              >
                <button
                  onClick={() => setExpandedId(expanded ? null : lead.id)}
                  className="w-full p-4 flex items-center gap-4 text-left hover:bg-accent/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-semibold text-sm truncate">{lead.advertiser_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{lead.screen?.name || "General"}</p>
                  </div>
                  <Badge className={`text-xs border-0 shrink-0 ${statusColors[lead.status] || ""}`}>
                    {status?.label || lead.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(lead.created_at).toLocaleDateString("es-MX")}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-0 border-t border-border">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div className="space-y-2 text-sm">
                            {lead.advertiser_company && (
                              <p className="flex items-center gap-2"><Building2 className="w-3.5 h-3.5 text-muted-foreground" />{lead.advertiser_company}</p>
                            )}
                            <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-muted-foreground" />{lead.advertiser_phone}</p>
                            <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-muted-foreground" />{lead.advertiser_email}</p>
                            {lead.estimated_budget && (
                              <p className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-muted-foreground" />Presupuesto: ${lead.estimated_budget.toLocaleString()} MXN</p>
                            )}
                          </div>
                          {lead.message && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Mensaje:</p>
                              <p className="text-sm bg-muted/50 rounded-lg p-3">{lead.message}</p>
                            </div>
                          )}
                        </div>

                        {/* Status actions */}
                        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-border">
                          <span className="text-xs text-muted-foreground mr-2 self-center">Cambiar estado:</span>
                          {Object.entries(LEAD_STATUS).map(([key, val]) => (
                            <button
                              key={key}
                              onClick={() => updateStatus(lead.id, key)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                                lead.status === key
                                  ? statusColors[key] + " ring-2 ring-offset-1 ring-primary/20"
                                  : "bg-muted text-muted-foreground hover:bg-accent"
                              }`}
                            >
                              {val.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
