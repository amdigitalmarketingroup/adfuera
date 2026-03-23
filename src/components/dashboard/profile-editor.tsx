"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Building2, Save, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"

interface ProfileEditorProps {
  initialData: any
}

export function ProfileEditor({ initialData }: ProfileEditorProps) {
  const [form, setForm] = useState({
    company_name: initialData.company_name || "",
    description: initialData.description || "",
    phone: initialData.phone || "",
    email: initialData.email || "",
    website: initialData.website || "",
    years_experience: initialData.years_experience?.toString() || "",
    address: initialData.address || "",
    rfc: initialData.rfc || "",
    cities_mexicali: initialData.cities_operating?.includes("Mexicali") || false,
    cities_tijuana: initialData.cities_operating?.includes("Tijuana") || false,
  })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const update = (key: string, value: any) => {
    setForm((f) => ({ ...f, [key]: value }))
    setSaved(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()

    const cities = []
    if (form.cities_mexicali) cities.push("Mexicali")
    if (form.cities_tijuana) cities.push("Tijuana")

    const { error } = await supabase
      .from("media_owners")
      .update({
        company_name: form.company_name,
        description: form.description || null,
        phone: form.phone || null,
        email: form.email || null,
        website: form.website || null,
        years_experience: parseInt(form.years_experience) || null,
        address: form.address || null,
        rfc: form.rfc || null,
        cities_operating: cities,
      })
      .eq("id", initialData.id)

    setLoading(false)
    if (!error) setSaved(true)
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading font-bold text-2xl mb-1">Perfil de empresa</h1>
        <p className="text-sm text-muted-foreground mb-8">Administra la información pública de tu empresa</p>
      </motion.div>

      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-heading font-semibold mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            Información general
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label>Nombre de la empresa *</Label>
              <Input value={form.company_name} onChange={(e) => update("company_name", e.target.value)} className="mt-1.5" required />
            </div>
            <div className="md:col-span-2">
              <Label>Descripción</Label>
              <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Describe tu empresa y servicios..." rows={3} className="mt-1.5" />
            </div>
            <div>
              <Label>Teléfono</Label>
              <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+52 686 000 0000" className="mt-1.5" />
            </div>
            <div>
              <Label>Email de contacto</Label>
              <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="contacto@empresa.com" className="mt-1.5" />
            </div>
            <div>
              <Label>Sitio web</Label>
              <Input value={form.website} onChange={(e) => update("website", e.target.value)} placeholder="https://empresa.com" className="mt-1.5" />
            </div>
            <div>
              <Label>Años de experiencia</Label>
              <Input type="number" value={form.years_experience} onChange={(e) => update("years_experience", e.target.value)} placeholder="10" className="mt-1.5" />
            </div>
            <div>
              <Label>RFC</Label>
              <Input value={form.rfc} onChange={(e) => update("rfc", e.target.value)} placeholder="XAXX010101000" className="mt-1.5" />
            </div>
            <div>
              <Label>Dirección</Label>
              <Input value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="Dirección de la empresa" className="mt-1.5" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-heading font-semibold mb-4">Ciudades donde operas</h2>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.cities_mexicali} onChange={(e) => update("cities_mexicali", e.target.checked)} className="rounded border-border" />
              <span className="text-sm">Mexicali</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.cities_tijuana} onChange={(e) => update("cities_tijuana", e.target.checked)} className="rounded border-border" />
              <span className="text-sm">Tijuana</span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={loading} className="gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? "Guardando..." : "Guardar cambios"}
          </Button>
          {saved && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Guardado
            </motion.span>
          )}
        </div>
      </form>
    </div>
  )
}
