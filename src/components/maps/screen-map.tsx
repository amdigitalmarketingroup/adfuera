"use client"

import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"
import type { Screen } from "@/types"

const LeafletMap = dynamic(() => import("./leaflet-map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-muted rounded-inherit">
      <Skeleton className="h-full w-full" />
    </div>
  ),
})

interface ScreenMapProps {
  screens: Screen[]
  center?: [number, number]
  zoom?: number
  className?: string
  singleMarker?: boolean
}

export function ScreenMap(props: ScreenMapProps) {
  return <LeafletMap {...props} />
}
