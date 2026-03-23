import { Skeleton } from "@/components/ui/skeleton"

export function ScreenCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-card border border-border shadow-[var(--shadow-card)]">
      <Skeleton className="aspect-[16/10] w-full animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-3 pt-1">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="border-t border-border pt-3">
          <Skeleton className="h-6 w-32" />
        </div>
      </div>
    </div>
  )
}
