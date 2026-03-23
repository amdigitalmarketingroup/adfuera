"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, SlidersHorizontal, X, MapPin, Monitor, Eye, DollarSign, ChevronDown, List, Map as MapIcon, Frown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScreenCard } from "@/components/screens/screen-card"
import { ScreenMap } from "@/components/maps/screen-map"
import { FORMAT_TYPES, AVAILABILITY_STATUS } from "@/lib/constants"
import type { Screen } from "@/types"

// Same filter options as hero-search
const PRICE_RANGES = [
  { label: "Cualquier precio", value: "any" },
  { label: "Menos de $5,000", value: "0-5000" },
  { label: "$5,000 - $10,000", value: "5000-10000" },
  { label: "$10,000 - $20,000", value: "10000-20000" },
  { label: "Más de $20,000", value: "20000+" },
]

const CITIES_OPTIONS = [
  { label: "Todas las ciudades", value: "" },
  { label: "Mexicali", value: "mexicali" },
  { label: "Tijuana", value: "tijuana" },
]

interface SearchResultsProps {
  screens: Screen[]
  initialParams: {
    q?: string
    ciudad?: string
    formato?: string
    disponibilidad?: string
    precio?: string
  }
}

export function SearchResults({ screens, initialParams }: SearchResultsProps) {
  const router = useRouter()
  const [view, setView] = useState<"list" | "map">("list")
  const [query, setQuery] = useState(initialParams.q || "")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    city: initialParams.ciudad || "",
    format: initialParams.formato || "",
    availability: initialParams.disponibilidad || "",
    priceRange: initialParams.precio || "any",
  })

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (filters.city) params.set("ciudad", filters.city)
    if (filters.format) params.set("formato", filters.format)
    if (filters.availability) params.set("disponibilidad", filters.availability)
    if (filters.priceRange && filters.priceRange !== "any") params.set("precio", filters.priceRange)
    router.push("/buscar?" + params.toString())
  }

  const activeFilterCount = [filters.city, filters.format, filters.availability, filters.priceRange !== "any" && filters.priceRange].filter(Boolean).length

  return (
    <div className="min-h-screen pt-20">
      {/* Top filter bar */}
      <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3">
            {/* Search input */}
            <div className="flex items-center gap-2 flex-1 bg-card border border-border rounded-xl px-3">
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              <Input
                type="text"
                placeholder="Buscar por zona o nombre..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                className="border-0 shadow-none focus-visible:ring-0 bg-transparent px-0 h-10"
              />
            </div>

            {/* Filter toggle */}
            <Button
              variant={activeFilterCount > 0 ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-1.5 shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtros
              {activeFilterCount > 0 && (
                <span className="ml-1 w-5 h-5 rounded-full bg-primary-foreground text-primary text-xs font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            {/* View toggle (mobile) */}
            <div className="flex lg:hidden border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setView("list")}
                className={`p-2 ${view === "list" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView("map")}
                className={`p-2 ${view === "map" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}
              >
                <MapIcon className="w-4 h-4" />
              </button>
            </div>

            <Button size="sm" onClick={applyFilters} className="shrink-0">
              Buscar
            </Button>
          </div>

          {/* Expandable filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 pb-1">
                  <select
                    value={filters.city}
                    onChange={(e) => setFilters(f => ({ ...f, city: e.target.value }))}
                    className="rounded-xl border border-border bg-card px-3 py-2 text-sm"
                  >
                    {CITIES_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <select
                    value={filters.format}
                    onChange={(e) => setFilters(f => ({ ...f, format: e.target.value }))}
                    className="rounded-xl border border-border bg-card px-3 py-2 text-sm"
                  >
                    <option value="">Todos los formatos</option>
                    {Object.entries(FORMAT_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                  <select
                    value={filters.availability}
                    onChange={(e) => setFilters(f => ({ ...f, availability: e.target.value }))}
                    className="rounded-xl border border-border bg-card px-3 py-2 text-sm"
                  >
                    <option value="">Cualquier estado</option>
                    {Object.entries(AVAILABILITY_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => setFilters(f => ({ ...f, priceRange: e.target.value }))}
                    className="rounded-xl border border-border bg-card px-3 py-2 text-sm"
                  >
                    {PRICE_RANGES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{screens.length}</span> {screens.length === 1 ? "espacio encontrado" : "espacios encontrados"}
          </p>
        </div>

        <div className="flex gap-6">
          {/* List */}
          <div className={`flex-1 ${view === "map" ? "hidden lg:block" : ""}`}>
            {screens.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
                  <Frown className="w-7 h-7 text-muted-foreground" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">No encontramos resultados</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Intenta cambiar los filtros o buscar en otra ciudad. Estamos agregando nuevos espacios constantemente.
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {screens.map((screen, i) => (
                  <ScreenCard key={screen.id} screen={screen} index={i} />
                ))}
              </div>
            )}
          </div>

          {/* Map */}
          <div className={`hidden lg:block w-[400px] xl:w-[480px] shrink-0 ${view === "map" ? "!block w-full lg:w-[480px]" : ""}`}>
            <div className="sticky top-36 h-[calc(100vh-10rem)] rounded-2xl border border-border overflow-hidden">
              <ScreenMap screens={screens} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
