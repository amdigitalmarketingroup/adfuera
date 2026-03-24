"use client"

interface AnimatedGradientBorderProps {
  children: React.ReactNode
  className?: string
}

export function AnimatedGradientBorder({ children, className = "" }: AnimatedGradientBorderProps) {
  return (
    <div className={`relative rounded-2xl p-[1px] overflow-hidden ${className}`}>
      <div
        className="absolute inset-0 animate-gradient-shift"
        style={{
          background: "linear-gradient(135deg, oklch(0.48 0.18 250), oklch(0.55 0.2 280), oklch(0.72 0.17 55), oklch(0.48 0.18 250))",
          backgroundSize: "300% 300%",
        }}
      />
      <div className="relative rounded-[15px] bg-card">
        {children}
      </div>
    </div>
  )
}
