"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, SlidersHorizontal, X, MapPin, Monitor, Eye, DollarSign, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FORMAT_TYPES, AVAILABILITY_STATUS } from "@/lib/constants"

const PRICE_RANGES = [
  { label: "Cualquier precio", value: "any" },
  { label: "Menos de $5,000", value: "0-5000" },
  { label: "$5,000 - $10,000", value: "5000-10000" },
  { label: "$10,000 - $20,000", value: "10000-20000" },
  { label: "Más de $20,000", value: "20000+" },
]

const CITIES_OPTIONS = [
  { label: "Todas las ciudades", value: "all" },
  { label: "Mexicali", value: "mexicali" },
  { label: "Tijuana", value: "tijuana" },
]

interface Filters {
  query: string
  city: string
  format: string
  availability: string
  priceRange: string
}

export function HeroSearch() {
  const router = useRouter()
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    query: "",
    city: "all",
    format: "all",
    availability: "all",
    priceRange: "any",
  })

  const activeFilterCount = [
    filters.city !== "all",
    filters.format !== "all",
    filters.availability !== "all",
    filters.priceRange !== "any",
  ].filter(Boolean).length

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (filters.query) params.set("q", filters.query)
    if (filters.city !== "all") params.set("ciudad", filters.city)
    if (filters.format !== "all") params.set("formato", filters.format)
    if (filters.availability !== "all") params.set("disponibilidad", filters.availability)
    if (filters.priceRange !== "any") params.set("precio", filters.priceRange)
    router.push("/buscar?" + params.toString())
  }

  const clearFilters = () => {
    setFilters({ query: filters.query, city: "all", format: "all", availability: "all", priceRange: "any" })
  }

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  // Get active filter labels for badges
  const getActiveFilterLabels = () => {
    const labels: { key: keyof Filters; label: string }[] = []
    if (filters.city !== "all") {
      const city = CITIES_OPTIONS.find((c) => c.value === filters.city)
      if (city) labels.push({ key: "city", label: city.label })
    }
    if (filters.format !== "all") {
      const fmt = FORMAT_TYPES[filters.format as keyof typeof FORMAT_TYPES]
      if (fmt) labels.push({ key: "format", label: fmt.label })
    }
    if (filters.availability !== "all") {
      const avail = AVAILABILITY_STATUS[filters.availability as keyof typeof AVAILABILITY_STATUS]
      if (avail) labels.push({ key: "availability", label: avail.label })
    }
    if (filters.priceRange !== "any") {
      const price = PRICE_RANGES.find((p) => p.value === filters.priceRange)
      if (price) labels.push({ key: "priceRange", label: price.label })
    }
    return labels
  }

  return (
    <div className="relative max-w-2xl mx-auto">
      {/* Main search bar */}
      <div className="glass flex items-center rounded-2xl border border-border/60 shadow-[var(--shadow-lg)] p-1.5 bg-card/80">
        <div className="flex items-center gap-2.5 flex-1 px-4">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <Input
            type="text"
            placeholder="Buscar por zona, dirección o nombre..."
            value={filters.query}
            onChange={(e) => updateFilter("query", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="border-0 shadow-none focus-visible:ring-0 bg-transparent px-0 h-12 text-base"
          />
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`relative p-2.5 rounded-xl mr-1.5 transition-all duration-200 ${
            showFilters || activeFilterCount > 0
              ? "bg-primary/10 text-primary"
              : "hover:bg-accent text-muted-foreground"
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        <Button size="lg" onClick={handleSearch} className="shrink-0 font-semibold px-8 rounded-xl">
          Buscar
        </Button>
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-3 p-5 rounded-2xl bg-card/90 glass border border-border/60 shadow-[var(--shadow-md)]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-heading font-semibold text-foreground">Filtros</span>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* City */}
                <FilterSelect
                  icon={<MapPin className="w-3.5 h-3.5" />}
                  label="Ciudad"
                  value={filters.city}
                  onChange={(v) => updateFilter("city", v)}
                  options={CITIES_OPTIONS}
                />

                {/* Format */}
                <FilterSelect
                  icon={<Monitor className="w-3.5 h-3.5" />}
                  label="Formato"
                  value={filters.format}
                  onChange={(v) => updateFilter("format", v)}
                  options={[
                    { label: "Todos los formatos", value: "all" },
                    ...Object.entries(FORMAT_TYPES).map(([key, val]) => ({
                      label: val.label,
                      value: key,
                    })),
                  ]}
                />

                {/* Availability */}
                <FilterSelect
                  icon={<Eye className="w-3.5 h-3.5" />}
                  label="Disponibilidad"
                  value={filters.availability}
                  onChange={(v) => updateFilter("availability", v)}
                  options={[
                    { label: "Cualquier estado", value: "all" },
                    ...Object.entries(AVAILABILITY_STATUS).map(([key, val]) => ({
                      label: val.label,
                      value: key,
                    })),
                  ]}
                />

                {/* Price */}
                <FilterSelect
                  icon={<DollarSign className="w-3.5 h-3.5" />}
                  label="Precio"
                  value={filters.priceRange}
                  onChange={(v) => updateFilter("priceRange", v)}
                  options={PRICE_RANGES}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active filter badges */}
      <AnimatePresence>
        {activeFilterCount > 0 && !showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex flex-wrap items-center gap-2 mt-3 justify-center"
          >
            {getActiveFilterLabels().map((filter) => (
              <Badge
                key={filter.key}
                variant="secondary"
                className="pl-2.5 pr-1.5 py-1 text-xs font-medium border border-border cursor-pointer hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-colors gap-1"
                onClick={() =>
                  updateFilter(
                    filter.key,
                    filter.key === "priceRange" ? "any" : "all"
                  )
                }
              >
                {filter.label}
                <X className="w-3 h-3 ml-0.5" />
              </Badge>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Filter Select Dropdown ─── */
interface FilterSelectProps {
  icon: React.ReactNode
  label: string
  value: string
  onChange: (value: string) => void
  options: { label: string; value: string }[]
}

function FilterSelect({ icon, label, value, onChange, options }: FilterSelectProps) {
  const [open, setOpen] = useState(false)
  const selected = options.find((o) => o.value === value)
  const isDefault = value === "all" || value === "any"

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-left transition-all duration-200 border ${
          !isDefault
            ? "bg-primary/5 border-primary/20 text-foreground"
            : "bg-background border-border hover:border-border/80 text-muted-foreground"
        }`}
      >
        <span className="shrink-0 opacity-60">{icon}</span>
        <span className="flex-1 truncate text-xs font-medium">
          {selected?.label || label}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 mt-1.5 z-40 bg-card border border-border rounded-xl shadow-[var(--shadow-lg)] overflow-hidden"
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value)
                    setOpen(false)
                  }}
                  className={`w-full text-left px-3.5 py-2.5 text-xs font-medium transition-colors ${
                    option.value === value
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-accent text-foreground"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
