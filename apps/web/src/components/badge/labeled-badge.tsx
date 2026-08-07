import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"
import type { ReactElement } from "react"

export type LabeledBadgeVariant =
  "default" | "secondary" | "destructive" | "outline"

export type LabeledBadgeConfig = {
  label: string
  variant: LabeledBadgeVariant
  icon: ReactElement
  className?: string
}

export function LabeledBadge({
  label,
  variant,
  icon,
  className,
}: LabeledBadgeConfig) {
  return (
    <Badge variant={variant} className={cn(className)}>
      {icon}
      {label}
    </Badge>
  )
}
