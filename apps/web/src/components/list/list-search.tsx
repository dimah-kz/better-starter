"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { SearchIcon, XIcon } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import { cn } from "@workspace/ui/lib/utils"

const DEFAULT_DEBOUNCE_MS = 300
const DEFAULT_MIN_LENGTH = 2

export type ListSearchProps = {
  value?: string
  placeholder?: string
  className?: string
  debounceMs?: number
  minLength?: number
  buildPath: (input: { q?: string; page?: number }) => string
}

export function ListSearch({
  value,
  placeholder = "Search…",
  className,
  debounceMs = DEFAULT_DEBOUNCE_MS,
  minLength = DEFAULT_MIN_LENGTH,
  buildPath,
}: ListSearchProps) {
  const router = useRouter()
  const [draft, setDraft] = useState(value ?? "")
  const normalizedValue = value?.trim() ?? ""

  useEffect(() => {
    setDraft(value ?? "")
  }, [value])

  useEffect(() => {
    const trimmed = draft.trim()

    if (trimmed === normalizedValue) {
      return
    }

    if (trimmed.length > 0 && trimmed.length < minLength) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      const nextValue = trimmed.length >= minLength ? trimmed : undefined

      if (nextValue === normalizedValue || (!nextValue && !normalizedValue)) {
        return
      }

      router.push(buildPath({ q: nextValue, page: 1 }))
    }, debounceMs)

    return () => window.clearTimeout(timeoutId)
  }, [buildPath, debounceMs, draft, minLength, normalizedValue, router])

  const handleClear = () => {
    setDraft("")
    if (normalizedValue) {
      router.push(buildPath({ q: undefined, page: 1 }))
    }
  }

  return (
    <InputGroup
      data-slot="list-search"
      className={cn("w-full min-w-0 sm:max-w-xs", className)}
    >
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
      />
      {draft.length > 0 ? (
        <InputGroupAddon align="inline-end">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            aria-label="Clear search"
            onClick={handleClear}
          >
            <XIcon />
          </Button>
        </InputGroupAddon>
      ) : null}
    </InputGroup>
  )
}
