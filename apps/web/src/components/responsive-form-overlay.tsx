"use client"

import type { ReactNode } from "react"
import { useDirection } from "@workspace/ui/components/direction"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet"
import { cn } from "@workspace/ui/lib/utils"

export type ResponsiveFormOverlayProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  footer: ReactNode
  children: ReactNode
  headerClassName?: string
  descriptionClassName?: string
  contentClassName?: string
  footerClassName?: string
}

export function ResponsiveFormOverlay({
  open,
  onOpenChange,
  title,
  description,
  footer,
  children,
  headerClassName,
  contentClassName,
  footerClassName,
}: ResponsiveFormOverlayProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="p-0 max-sm:w-full!">
        <SheetHeader className={cn("p-4 pe-14", headerClassName)}>
          <SheetTitle>{title}</SheetTitle>
          {description ? (
            <SheetDescription>{description}</SheetDescription>
          ) : null}
        </SheetHeader>
        <div
          className={cn("min-h-0 flex-1 overflow-y-auto p-4", contentClassName)}
        >
          {children}
        </div>
        <SheetFooter className={cn("p-4", footerClassName)}>
          {footer}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
