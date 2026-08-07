import { cn } from "@workspace/ui/lib/utils"
import { LoadingFallbackShell } from "@/components/loading-fallback"

type DashboardPageShellProps = {
  children: React.ReactNode
  className?: string
}

export function DashboardPageShell({
  children,
  className,
}: DashboardPageShellProps) {
  return (
    <section className={cn("flex flex-1 flex-col gap-6 p-4 sm:p-6", className)}>
      {children}
    </section>
  )
}

export function DashboardPageFallback() {
  return <LoadingFallbackShell />
}
