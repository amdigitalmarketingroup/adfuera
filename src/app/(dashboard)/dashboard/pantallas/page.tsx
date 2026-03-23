import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Plus, Monitor, MapPin, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FORMAT_TYPES, AVAILABILITY_STATUS } from "@/lib/constants"
import { formatPrice } from "@/lib/utils"

export default async function PantallasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: mediaOwner } = await supabase
    .from("media_owners")
    .select("id")
    .eq("user_id", user.id)
    .single()

  const { data: screens } = await supabase
    .from("screens")
    .select("*")
    .eq("media_owner_id", mediaOwner?.id)
    .order("created_at", { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading font-bold text-2xl" style={{ letterSpacing: "-0.02em" }}>Mis pantallas</h1>
          <p className="text-sm text-muted-foreground mt-1">Administra tus espacios publicitarios</p>
        </div>
        <Link href="/dashboard/pantallas/nueva">
          <Button className="gap-2"><Plus className="w-4 h-4" />Nueva pantalla</Button>
        </Link>
      </div>

      {(!screens || screens.length === 0) ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <Monitor className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <h3 className="font-heading font-semibold mb-1">No tienes pantallas registradas</h3>
          <p className="text-sm text-muted-foreground mb-4">Agrega tu primer espacio publicitario para comenzar a recibir solicitudes.</p>
          <Link href="/dashboard/pantallas/nueva"><Button variant="outline">Agregar pantalla</Button></Link>
        </div>
      ) : (
        <div className="space-y-3">
          {screens.map((screen: any) => {
            const format = FORMAT_TYPES[screen.format_type as keyof typeof FORMAT_TYPES]
            const status = AVAILABILITY_STATUS[screen.availability_status as keyof typeof AVAILABILITY_STATUS]
            return (
              <div key={screen.id} className="rounded-xl border border-border bg-card p-4 flex items-center gap-4 hover:shadow-[var(--shadow-card)] transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Monitor className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-semibold text-sm truncate">{screen.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />{screen.city}{screen.zone_neighborhood ? `, ${screen.zone_neighborhood}` : ""}
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs shrink-0">{format?.label}</Badge>
                <Badge className={`text-xs shrink-0 ${screen.availability_status === "available" ? "bg-emerald-100 text-emerald-700 border-0" : screen.availability_status === "occupied" ? "bg-red-100 text-red-700 border-0" : "bg-amber-100 text-amber-700 border-0"}`}>
                  {status?.label}
                </Badge>
                <p className="font-mono font-semibold text-sm shrink-0">
                  {formatPrice(screen.price_range_min)}
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                  <Eye className="w-3 h-3" />{screen.views_count || 0}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
