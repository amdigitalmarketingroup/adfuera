"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Maximize2, Eye, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { FORMAT_TYPES, AVAILABILITY_STATUS } from "@/lib/constants"
import { formatPrice, formatNumber } from "@/lib/utils"
import type { Screen } from "@/types"

interface ScreenCardProps {
  screen: Screen
  index?: number
}

export function ScreenCard({ screen, index = 0 }: ScreenCardProps) {
  const format = FORMAT_TYPES[screen.format_type]
  const status = AVAILABILITY_STATUS[screen.availability_status]
  const photo = screen.photos?.find((p) => p.is_primary) ?? screen.photos?.[0]

  const price =
    screen.price_range_min && screen.price_range_max
      ? `${formatPrice(screen.price_range_min)} - ${formatPrice(screen.price_range_max)}`
      : formatPrice(screen.price_monthly)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Link href={`/pantalla/${screen.slug}`} className="group block">
        <div className="rounded-xl overflow-hidden bg-card border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1">
          {/* Image */}
          <div className="relative aspect-[16/10] overflow-hidden bg-muted">
            {photo ? (
              <Image
                src={photo.photo_url}
                alt={screen.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <Maximize2 className="w-8 h-8" />
              </div>
            )}

            {/* Badges over image */}
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge
                variant="secondary"
                className="backdrop-blur-md bg-background/70 text-foreground text-xs font-medium"
              >
                {format.label}
              </Badge>
            </div>
            <div className="absolute top-3 right-3">
              <Badge
                className={`text-xs font-medium backdrop-blur-md ${
                  screen.availability_status === "available"
                    ? "bg-emerald-500/90 text-white"
                    : screen.availability_status === "occupied"
                    ? "bg-red-500/90 text-white"
                    : "bg-amber-500/90 text-white"
                }`}
              >
                <span
                  className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${
                    screen.availability_status === "available"
                      ? "bg-white animate-pulse-dot"
                      : "bg-white/70"
                  }`}
                />
                {status.label}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-heading font-semibold text-base leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-1">
              {screen.name}
            </h3>
            <p className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                {screen.zone_neighborhood ? `${screen.zone_neighborhood}, ` : ""}
                {screen.city}
              </span>
            </p>

            {/* Specs row */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 pb-3 border-b border-border">
              {screen.dimensions_width && screen.dimensions_height && (
                <span className="font-mono">
                  {screen.dimensions_width}x{screen.dimensions_height}m
                </span>
              )}
              {screen.estimated_traffic && (
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {formatNumber(screen.estimated_traffic)}{" "}
                  {screen.traffic_unit === "vehicles_day" ? "veh\u00edculos/d\u00eda" : "personas/d\u00eda"}
                </span>
              )}
            </div>

            {/* Price + CTA */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono font-semibold text-lg text-foreground leading-none">
                  {price}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">/mes</p>
              </div>
              <span className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Cotizar
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
