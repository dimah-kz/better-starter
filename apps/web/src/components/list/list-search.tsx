"use client"

import { useEffect, useRef, useState } from "react"
import { SearchIcon, XIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@repo/ui/components/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@repo/ui/components/input-group"
import { cn } from "@repo/ui/lib/utils"
import { LIST_SEARCH_MIN_LENGTH } from "@/components/list/types"

const DEFAULT_DEBOUNCE_MS = 300

export type ListSearchProps = {
  value?: string
  placeholder?: string
  className?: string
  debounceMs?: number
  minLength?: number
  onCommit: (q: string | undefined) => void
}

function commitSearch(
  draft: string,
  normalizedValue: string,
  minLength: number,
  onCommit: (q: string | undefined) => void
) {
  const trimmed = draft.trim()

  if (trimmed === normalizedValue) {
    return
  }

  if (trimmed.length > 0 && trimmed.length < minLength) {
    return
  }

  const nextValue = trimmed.length >= minLength ? trimmed : undefined

  if (nextValue === normalizedValue || (!nextValue && !normalizedValue)) {
    return
  }

  onCommit(nextValue)
}

export function ListSearch({
  value,
  placeholder = "Search…",
  className,
  debounceMs = DEFAULT_DEBOUNCE_MS,
  minLength = LIST_SEARCH_MIN_LENGTH,
  onCommit,
}: ListSearchProps) {
  const t = useTranslations("common")
  const [draft, setDraft] = useState(value ?? "")
  const timeoutRef = useRef<number>(undefined)
  const normalizedValue = value?.trim() ?? ""

  useEffect(() => {
    setDraft(value ?? "")
  }, [value])

  useEffect(() => {
    timeoutRef.current = window.setTimeout(() => {
      commitSearch(draft, normalizedValue, minLength, onCommit)
    }, debounceMs)

    return () => window.clearTimeout(timeoutRef.current)
  }, [debounceMs, draft, minLength, normalizedValue, onCommit])

  const handleClear = () => {
    window.clearTimeout(timeoutRef.current)
    setDraft("")
    if (normalizedValue) {
      onCommit(undefined)
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
        onKeyDown={(event) => {
          if (event.key !== "Enter") {
            return
          }
          event.preventDefault()
          window.clearTimeout(timeoutRef.current)
          commitSearch(draft, normalizedValue, minLength, onCommit)
        }}
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
            aria-label={t("clearSearch")}
            onClick={handleClear}
          >
            <XIcon />
          </Button>
        </InputGroupAddon>
      ) : null}
    </InputGroup>
  )
}
