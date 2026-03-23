"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft, Upload, X, Image as ImageIcon, MapPin, Save, Loader2
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FORMAT_TYPES } from "@/lib/constants"
import { createClient } from "@/lib/supabase/client"
import { slugify } from "@/lib/utils"

const MATERIALS = [
  { value: "canvas", label: "Lona" },
  { value: "vinyl", label: "Vinil" },
  { value: "led", label: "LED" },
  { value: "lcd", label: "LCD" },
  { value: "backlight", label: "Backlight" },
  { value: "other", label: "Otro" },
]

const ILLUMINATIONS = [
  { value: "none", label: "Sin iluminación" },
  { value: "front", label: "Frontal" },
  { value: "backlight", label: "Retroiluminado" },
  { value: "led_own", label: "LED propio" },
]

const CONTRACT_PERIODS = [
  { value: "1_month", label: "1 mes" },
  { value: "3_months", label: "3 meses" },
  { value: "6_months", label: "6 meses" },
  { value: "1_year", label: "1 año" },
  { value: "negotiable", label: "Negociable" },
]

export default function NuevaPantallaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [photos, setPhotos] = useState<File[]>([])
  const [form, setForm] = useState({
    name: "",
    format_type: "billboard",
    city: "Mexicali",
    zone_neighborhood: "",
    address: "",
    latitude: "",
    longitude: "",
    dimensions_width: "",
    dimensions_height: "",
    material: "vinyl",
    illumination: "front",
    orientation: "",
    faces_count: "1",
    price_range_min: "",
    price_range_max: "",
    min_contract_period: "negotiable",
    description: "",
  })

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }))

  const handlePhotoDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"))
    setPhotos((prev) => [...prev, ...files].slice(0, 5))
  }, [])

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter((f) => f.type.startsWith("image/"))
      setPhotos((prev) => [...prev, ...files].slice(0, 5))
    }
  }

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("No autorizado")

      const { data: mediaOwner } = await supabase
        .from("media_owners")
        .select("id")
        .eq("user_id", user.id)
        .single()

      if (!mediaOwner) throw new Error("Perfil de proveedor no encontrado")

      const slug = slugify(form.name + " " + form.city)

      // Create screen
      const { data: screen, error: screenError } = await supabase
        .from("screens")
        .insert({
          media_owner_id: mediaOwner.id,
          name: form.name,
          slug,
          format_type: form.format_type,
          city: form.city,
          zone_neighborhood: form.zone_neighborhood || null,
          address: form.address || null,
          latitude: parseFloat(form.latitude) || 32.6245,
          longitude: parseFloat(form.longitude) || -115.4523,
          dimensions_width: parseFloat(form.dimensions_width) || null,
          dimensions_height: parseFloat(form.dimensions_height) || null,
          material: form.material || null,
          illumination: form.illumination || null,
          orientation: form.orientation || null,
          faces_count: parseInt(form.faces_count) || 1,
          price_range_min: parseFloat(form.price_range_min) || null,
          price_range_max: parseFloat(form.price_range_max) || null,
          min_contract_period: form.min_contract_period,
          description: form.description || null,
          is_active: true,
          is_approved: false,
        })
        .select()
        .single()

      if (screenError) throw new Error(screenError.message)

      // Upload photos
      for (let i = 0; i < photos.length; i++) {
        const file = photos[i]
        const ext = file.name.split(".").pop()
        const filePath = `${screen.id}/${i}-${Date.now()}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from("screen-photos")
          .upload(filePath, file)

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from("screen-photos")
            .getPublicUrl(filePath)

          await supabase.from("screen_photos").insert({
            screen_id: screen.id,
            photo_url: urlData.publicUrl,
            position: i,
            is_primary: i === 0,
          })
        }
      }

      router.push("/dashboard/pantallas")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Error al crear la pantalla")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/dashboard/pantallas" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Volver a mis pantallas
        </Link>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading font-bold text-2xl mb-1" style={{ letterSpacing: "-0.02em" }}>
          Nueva pantalla
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Agrega un nuevo espacio publicitario a tu inventario
        </p>
      </motion.div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-8 max-w-3xl">
          {/* Basic info */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-heading font-semibold mb-4">Información básica</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="name">Nombre del espacio *</Label>
                <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Ej: Espectacular Blvd. Juárez" className="mt-1.5" required />
              </div>
              <div>
                <Label htmlFor="format_type">Formato *</Label>
                <select id="format_type" value={form.format_type} onChange={(e) => update("format_type", e.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm">
                  {Object.entries(FORMAT_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="city">Ciudad *</Label>
                <select id="city" value={form.city} onChange={(e) => update("city", e.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm">
                  <option value="Mexicali">Mexicali</option>
                  <option value="Tijuana">Tijuana</option>
                </select>
              </div>
              <div>
                <Label htmlFor="zone">Zona / Colonia</Label>
                <Input id="zone" value={form.zone_neighborhood} onChange={(e) => update("zone_neighborhood", e.target.value)} placeholder="Ej: Zona Centro" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="address">Dirección</Label>
                <Input id="address" value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="Ej: Blvd. Juárez #2450" className="mt-1.5" />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-heading font-semibold mb-4">Ubicación</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lat">Latitud *</Label>
                <Input id="lat" type="number" step="any" value={form.latitude} onChange={(e) => update("latitude", e.target.value)} placeholder="32.6245" className="mt-1.5" required />
              </div>
              <div>
                <Label htmlFor="lng">Longitud *</Label>
                <Input id="lng" type="number" step="any" value={form.longitude} onChange={(e) => update("longitude", e.target.value)} placeholder="-115.4523" className="mt-1.5" required />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Tip: busca tu ubicación en Google Maps, haz clic derecho y copia las coordenadas.</p>
          </div>

          {/* Specs */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-heading font-semibold mb-4">Especificaciones</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <Label>Ancho (metros)</Label>
                <Input type="number" step="0.01" value={form.dimensions_width} onChange={(e) => update("dimensions_width", e.target.value)} placeholder="12" className="mt-1.5" />
              </div>
              <div>
                <Label>Alto (metros)</Label>
                <Input type="number" step="0.01" value={form.dimensions_height} onChange={(e) => update("dimensions_height", e.target.value)} placeholder="4" className="mt-1.5" />
              </div>
              <div>
                <Label>Caras</Label>
                <Input type="number" value={form.faces_count} onChange={(e) => update("faces_count", e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label>Material</Label>
                <select value={form.material} onChange={(e) => update("material", e.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm">
                  {MATERIALS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
              <div>
                <Label>Iluminación</Label>
                <select value={form.illumination} onChange={(e) => update("illumination", e.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm">
                  {ILLUMINATIONS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
              <div>
                <Label>Orientación</Label>
                <Input value={form.orientation} onChange={(e) => update("orientation", e.target.value)} placeholder="Norte-Sur" className="mt-1.5" />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-heading font-semibold mb-4">Precio y contrato</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <Label>Precio mínimo (MXN/mes) *</Label>
                <Input type="number" value={form.price_range_min} onChange={(e) => update("price_range_min", e.target.value)} placeholder="12000" className="mt-1.5" required />
              </div>
              <div>
                <Label>Precio máximo (MXN/mes)</Label>
                <Input type="number" value={form.price_range_max} onChange={(e) => update("price_range_max", e.target.value)} placeholder="15000" className="mt-1.5" />
              </div>
              <div>
                <Label>Contrato mínimo</Label>
                <select value={form.min_contract_period} onChange={(e) => update("min_contract_period", e.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm">
                  {CONTRACT_PERIODS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-heading font-semibold mb-4">Descripción</h2>
            <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Describe tu espacio publicitario, ubicación, ventajas, tráfico..." rows={4} />
          </div>

          {/* Photos */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-heading font-semibold mb-4">Fotos (máximo 5)</h2>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handlePhotoDrop}
              className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => document.getElementById("photo-input")?.click()}
            >
              <Upload className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Arrastra fotos aquí o haz clic para seleccionar</p>
              <p className="text-xs text-muted-foreground/60 mt-1">JPG, PNG — máximo 5MB por foto</p>
              <input id="photo-input" type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoSelect} />
            </div>
            {photos.length > 0 && (
              <div className="flex gap-3 mt-4 flex-wrap">
                {photos.map((photo, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
                    <img src={URL.createObjectURL(photo)} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removePhoto(i)} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center">
                      <X className="w-3 h-3" />
                    </button>
                    {i === 0 && <span className="absolute bottom-0 left-0 right-0 bg-primary text-white text-[9px] text-center py-0.5">Principal</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error & Submit */}
          {error && (
            <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={loading} className="gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {loading ? "Publicando..." : "Publicar pantalla"}
            </Button>
            <Link href="/dashboard/pantallas">
              <Button type="button" variant="outline">Cancelar</Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground">
            Tu pantalla será revisada antes de aparecer en el catálogo público. Recibirás una notificación cuando sea aprobada.
          </p>
        </div>
      </form>
    </div>
  )
}
