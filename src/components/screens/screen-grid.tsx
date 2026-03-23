import { ScreenCard } from "./screen-card"
import type { Screen } from "@/types"

interface ScreenGridProps {
  screens: Screen[]
  className?: string
}

export function ScreenGrid({ screens, className }: ScreenGridProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 ${className ?? ""}`}>
      {screens.map((screen, i) => (
        <ScreenCard key={screen.id} screen={screen} index={i} />
      ))}
    </div>
  )
}
