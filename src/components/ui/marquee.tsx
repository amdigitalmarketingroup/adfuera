"use client"

import { cn } from "@/lib/utils"

interface MarqueeProps {
  children: React.ReactNode
  className?: string
  speed?: number
  pauseOnHover?: boolean
  direction?: "left" | "right"
}

export function Marquee({
  children,
  className,
  speed = 40,
  pauseOnHover = true,
  direction = "left",
}: MarqueeProps) {
  return (
    <div className={cn("overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]", className)}>
      <div
        className={cn(
          "flex gap-8 w-max",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
        style={{
          animation: `marquee-${direction} ${speed}s linear infinite`,
        }}
      >
        {children}
        {children}
      </div>
      <style>{`
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
