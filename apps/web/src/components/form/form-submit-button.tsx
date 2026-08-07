"use client"

import { useFormStatus } from "react-dom"
import { Button } from "@workspace/ui/components/button"
import { Spinner } from "@workspace/ui/components/spinner"
import { cn } from "@workspace/ui/lib/utils"

type FormSubmitButtonProps = {
  idleText: string
  loadingText: string
  className?: string
  disabled?: boolean
}

export function FormSubmitButton({
  idleText,
  loadingText,
  className,
  disabled,
}: FormSubmitButtonProps) {
  const { pending } = useFormStatus()
  const isDisabled = pending || disabled

  return (
    <Button
      type="submit"
      className={cn("w-full", className)}
      disabled={isDisabled}
      aria-busy={pending}
    >
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <Spinner className="size-4" />
          {loadingText}
        </span>
      ) : (
        idleText
      )}
    </Button>
  )
}
