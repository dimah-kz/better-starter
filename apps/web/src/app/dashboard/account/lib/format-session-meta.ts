import {
  dateOnlyOptions,
  dateTimeOptions,
  formatDate,
  formatRelativeTime,
  type Locale,
} from "@repo/i18n"

const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000

export function formatSessionSignedIn(iso: string, locale: Locale) {
  return formatRelativeTime(iso, locale)
}

export function formatSessionSignedInTitle(iso: string, locale: Locale) {
  return formatDate(iso, locale, dateTimeOptions)
}

export function formatSessionExpires(iso: string, locale: Locale) {
  const date = new Date(iso)
  const now = Date.now()
  const remainingMs = date.getTime() - now

  if (remainingMs <= 0 || remainingMs > FOURTEEN_DAYS_MS) {
    return formatDate(date, locale, dateOnlyOptions)
  }

  return formatRelativeTime(date, locale)
}

export function formatSessionIpAddress(
  ipAddress: string | null
): string | null {
  if (!ipAddress?.trim()) {
    return null
  }

  const ip = ipAddress.trim()

  if (ip === "127.0.0.1" || ip === "::1") {
    return null
  }

  if (isUnspecifiedIpv6(ip)) {
    return null
  }

  return ip
}

function isUnspecifiedIpv6(ip: string) {
  const normalized = ip.toLowerCase()
  if (!normalized.includes(":")) {
    return false
  }

  const collapsed = normalized.replace(/^::/, "0:").replace(/::$/, ":0")
  const parts = collapsed.split(":").filter(Boolean)
  if (parts.length === 0) {
    return true
  }

  return parts.every((part) => /^0+$/.test(part))
}
