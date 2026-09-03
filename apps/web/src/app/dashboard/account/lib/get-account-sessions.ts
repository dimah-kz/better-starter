import { headers } from "next/headers"
import { getLocale, getTranslations } from "next-intl/server"
import {
  dateOnlyOptions,
  dateTimeOptions,
  formatDate,
  formatRelativeTime,
  resolveLocale,
  type Locale,
} from "@repo/i18n"
import { auth } from "@repo/auth"

export type AccountSessionDeviceKind =
  "desktop" | "mobile" | "tablet" | "unknown"

export type AccountSession = {
  id: string
  isCurrent: boolean
  kind: AccountSessionDeviceKind
  title: string
  signedInLabel: string
  signedInTitle: string
  expiresLabel: string
  ipLabel: string | null
}

const RELATIVE_EXPIRY_WINDOW_MS = 14 * 24 * 60 * 60 * 1000

const BROWSER_PATTERNS: Array<[RegExp, string]> = [
  [/Edg(?:e|A|iOS)?\/(\d+)/i, "Edge"],
  [/OPR\/(\d+)/i, "Opera"],
  [/SamsungBrowser\/(\d+)/i, "Samsung Internet"],
  [/CriOS\/(\d+)/i, "Chrome"],
  [/FxiOS\/(\d+)/i, "Firefox"],
  [/Firefox\/(\d+)/i, "Firefox"],
  [/Chrome\/(\d+)/i, "Chrome"],
  [/Version\/(\d+).*Safari/i, "Safari"],
]

const OS_PATTERNS: Array<[RegExp, string]> = [
  [/iPhone|iPad|iPod/i, "iOS"],
  [/Android/i, "Android"],
  [/Windows NT/i, "Windows"],
  [/Mac OS X|Macintosh/i, "macOS"],
  [/CrOS/i, "Chrome OS"],
  [/Linux/i, "Linux"],
]

export async function getAccountSessions(
  currentSessionId: string
): Promise<AccountSession[]> {
  const requestHeaders = await headers()
  const [sessions, localeValue, t] = await Promise.all([
    auth.api.listSessions({ headers: requestHeaders }),
    getLocale(),
    getTranslations("account.sessions"),
  ])

  if (!Array.isArray(sessions)) {
    return []
  }

  const locale = resolveLocale(localeValue)
  const labels = {
    unknownDevice: t("unknownDevice"),
    deviceOnOs: (browser: string, os: string) =>
      t("deviceOnOs", { browser, os }),
  }

  return [...sessions]
    .sort((left, right) => {
      const leftCurrent = left.id === currentSessionId
      const rightCurrent = right.id === currentSessionId
      if (leftCurrent !== rightCurrent) {
        return leftCurrent ? -1 : 1
      }

      return (
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
      )
    })
    .map((session) => {
      const createdAt = new Date(session.createdAt)
      const expiresAt = new Date(session.expiresAt)
      const device = parseSessionUserAgent(session.userAgent ?? null)

      return {
        id: session.id,
        isCurrent: session.id === currentSessionId,
        kind: device.kind,
        title: sessionDeviceTitle(device, labels),
        signedInLabel: formatRelativeTime(createdAt, locale),
        signedInTitle: formatDate(createdAt, locale, dateTimeOptions),
        expiresLabel: formatSessionExpires(expiresAt, locale),
        ipLabel: sessionIpLabel(session.ipAddress ?? null),
      }
    })
}

function parseSessionUserAgent(userAgent: string | null): {
  kind: AccountSessionDeviceKind
  browser: string | null
  os: string | null
} {
  if (!userAgent?.trim()) {
    return { kind: "unknown", browser: null, os: null }
  }

  return {
    kind: parseDeviceKind(userAgent),
    browser: parseLabeledVersion(userAgent, BROWSER_PATTERNS),
    os: parseFirstMatch(userAgent, OS_PATTERNS),
  }
}

function parseDeviceKind(userAgent: string): AccountSessionDeviceKind {
  if (
    /iPad|Tablet|PlayBook|Silk/i.test(userAgent) ||
    (/Android/i.test(userAgent) && !/Mobile/i.test(userAgent))
  ) {
    return "tablet"
  }

  if (/Mobi|iPhone|iPod|Android.*Mobile|webOS|BlackBerry/i.test(userAgent)) {
    return "mobile"
  }

  return "desktop"
}

function parseLabeledVersion(
  userAgent: string,
  patterns: Array<[RegExp, string]>
) {
  for (const [pattern, name] of patterns) {
    const match = pattern.exec(userAgent)
    if (match?.[1]) {
      return `${name} ${match[1]}`
    }
  }

  return null
}

function parseFirstMatch(userAgent: string, patterns: Array<[RegExp, string]>) {
  for (const [pattern, name] of patterns) {
    if (pattern.test(userAgent)) {
      return name
    }
  }

  return null
}

function sessionDeviceTitle(
  device: { browser: string | null; os: string | null },
  labels: {
    unknownDevice: string
    deviceOnOs: (browser: string, os: string) => string
  }
) {
  if (device.browser && device.os) {
    return labels.deviceOnOs(device.browser, device.os)
  }

  return device.browser ?? device.os ?? labels.unknownDevice
}

function formatSessionExpires(expiresAt: Date, locale: Locale) {
  const remainingMs = expiresAt.getTime() - Date.now()

  if (remainingMs <= 0 || remainingMs > RELATIVE_EXPIRY_WINDOW_MS) {
    return formatDate(expiresAt, locale, dateOnlyOptions)
  }

  return formatRelativeTime(expiresAt, locale)
}

function sessionIpLabel(ipAddress: string | null) {
  const ip = ipAddress?.trim()
  if (!ip || isLoopbackOrUnspecifiedIp(ip)) {
    return null
  }

  return ip
}

function isLoopbackOrUnspecifiedIp(ip: string) {
  if (ip.includes(".")) {
    return ip === "127.0.0.1" || ip.endsWith("127.0.0.1")
  }

  if (!ip.includes(":")) {
    return false
  }

  const values = ip
    .split(":")
    .filter((group) => group.length > 0)
    .map((group) => Number.parseInt(group, 16))

  if (values.some((value) => Number.isNaN(value))) {
    return false
  }

  const nonzero = values.filter((value) => value !== 0)
  return nonzero.length === 0 || (nonzero.length === 1 && nonzero[0] === 1)
}
