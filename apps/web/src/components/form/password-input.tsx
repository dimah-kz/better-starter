"use client"

import { useState } from "react"
import { EyeIcon, EyeOffIcon, LockIcon } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@repo/ui/components/input-group"
import { useTranslations } from "next-intl"

type PasswordInputProps = Omit<React.ComponentProps<"input">, "type">

export function PasswordInput(props: PasswordInputProps) {
  const t = useTranslations("common.password")
  const [isVisible, setIsVisible] = useState(false)

  return (
    <InputGroup>
      <InputGroupInput {...props} type={isVisible ? "text" : "password"} />
      <InputGroupAddon>
        <LockIcon className="size-3.5 shrink-0 opacity-60" aria-hidden="true" />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          aria-label={isVisible ? t("hide") : t("show")}
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
