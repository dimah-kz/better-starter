"use client"

import { useState } from "react"
import { EyeIcon, EyeOffIcon, LockIcon } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@workspace/ui/components/input-group"

type PasswordInputProps = Omit<React.ComponentProps<"input">, "type">

export function PasswordInput({
  placeholder = "********",
  ...props
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <InputGroup>
      <InputGroupInput
        type={isVisible ? "text" : "password"}
        placeholder={placeholder}
        {...props}
      />
      <InputGroupAddon>
        <LockIcon className="size-3.5 shrink-0 opacity-60" aria-hidden="true" />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          aria-label={isVisible ? "Hide password" : "Show password"}
          onClick={() => setIsVisible((previous) => !previous)}
        >
          {isVisible ? (
            <EyeOffIcon className="size-3.5" aria-hidden="true" />
          ) : (
            <EyeIcon className="size-3.5" aria-hidden="true" />
          )}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
