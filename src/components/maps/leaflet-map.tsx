"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import MarkerClusterGroup from "react-leaflet-cluster"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { formatPrice } from "@/lib/utils"
import { FORMAT_TYPES } from "@/lib/constants"
import type { Screen } from "@/types"

// Fix default marker icon issue in webpack/next
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

// Custom colored marker
function createColoredIcon(color: string) {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="width:32px;height:32px;border-radius:50% 50% 50% 0;background:${color};transform:rotate(-45deg);position:relative;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"><div style="width:10px;height:10px;border-radius:50%;background:white;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(45deg)"></div></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })
}

const FORMAT_COLORS: Record<string, string> = {
  billboard: "#2563eb",
  digital: "#7c3aed",
  mupi: "#059669",
  indoor_screen: "#ea580c",
  wall: "#dc2626",
  canvas: "#ca8a04",
  rooftop: "#6b7280",
  other: "#64748b",
}

interface LeafletMapProps {
  screens: Screen[]
  center?: [number, number]
  zoom?: number
  className?: string
  singleMarker?: boolean
}

export default function LeafletMap({
  screens,
  center,
  zoom = 12,
  className = "h-full w-full",
  singleMarker = false,
}: LeafletMapProps) {
  // Calculate center from screens if not provided
  const mapCenter: [number, number] = center || (screens.length > 0
    ? [
        screens.reduce((sum, s) => sum + Number(s.latitude), 0) / screens.length,
        screens.reduce((sum, s) => sum + Number(s.longitude), 0) / screens.length,
      ]
    : [32.57, -116.5]) // Default: between Mexicali and Tijuana

  const markers = screens.map((screen) => {
    const format = FORMAT_TYPES[screen.format_type]
    const color = FORMAT_COLORS[screen.format_type] || "#2563eb"
    const price = screen.price_range_min
      ? formatPrice(screen.price_range_min) + (screen.price_range_max ? " \u2014 " + formatPrice(screen.price_range_max) : "")
      : "Consultar"

    return (
      <Marker
        key={screen.id}
        position={[Number(screen.latitude), Number(screen.longitude)]}
        icon={createColoredIcon(color)}
      >
        <Popup>
          <div style={{ minWidth: 200, fontFamily: "system-ui, sans-serif" }}>
            <div style={{ padding: "4px 0" }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: color, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>
                {format?.label || screen.format_type}
              </span>
              <h3 style={{ fontSize: 14, fontWeight: 600, margin: "4px 0 2px", lineHeight: 1.3 }}>
                {screen.name}
              </h3>
              <p style={{ fontSize: 12, color: "#71717a", margin: 0 }}>
                {screen.zone_neighborhood ? screen.zone_neighborhood + ", " : ""}{screen.city}
              </p>
              <p style={{ fontSize: 16, fontWeight: 700, margin: "8px 0 4px", fontFamily: "monospace" }}>
                {price}
                <span style={{ fontSize: 11, fontWeight: 400, color: "#71717a" }}> /mes</span>
              </p>
              <a
                href={"/pantalla/" + screen.slug}
                style={{
                  display: "inline-block",
                  marginTop: 6,
                  padding: "6px 14px",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "white",
                  background: "#2563eb",
                  borderRadius: 8,
                  textDecoration: "none",
                }}
              >
                Ver detalle \u2192
              </a>
            </div>
          </div>
        </Popup>
      </Marker>
    )
  })

  return (
    <MapContainer
      center={mapCenter}
      zoom={singleMarker ? 16 : zoom}
      className={className}
      scrollWheelZoom={!singleMarker}
      style={{ borderRadius: "inherit" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      {singleMarker ? markers : (
        <MarkerClusterGroup chunkedLoading>
          {markers}
        </MarkerClusterGroup>
      )}
    </MapContainer>
  )
}
