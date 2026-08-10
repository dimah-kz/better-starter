"use client"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@repo/ui/components/toggle-group"
import { cn } from "@repo/ui/lib/utils"
import type { ListFilterOption } from "@/components/list/types"

type ListFilterProps<T extends string> = {
  value: T
  options: readonly ListFilterOption<T>[]
  onValueChange: (value: T) => void
  className?: string
  size?: "sm" | "default"
}

export function ListFilter<T extends string>({
  value,
  options,
  onValueChange,
  className,
  size = "sm",
}: ListFilterProps<T>) {
  return (
    <ToggleGroup
      data-slot="list-filter"
      value={[value]}
      onValueChange={(next) => {
        const selected = next[0]
        if (selected) {
          onValueChange(selected as T)
        }
      }}
      size={size}
      className={cn("shrink-0", className)}
    >
      {options.map((option) => {
        const Icon = option.icon

        return (
          <ToggleGroupItem key={option.value} value={option.value}>
            {Icon ? <Icon data-icon="inline-start" /> : null}
            {option.label}
          </ToggleGroupItem>
        )
      })}
    </ToggleGroup>
  )
}
