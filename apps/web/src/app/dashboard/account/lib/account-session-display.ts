import type { AccountSessionDisplay } from "@/app/dashboard/account/components/account-sessions-content"
import { getSessionDeviceDisplay } from "@/app/dashboard/account/lib/format-session-device"
import {
  formatSessionExpires,
  formatSessionIpAddress,
  formatSessionSignedIn,
  formatSessionSignedInTitle,
} from "@/app/dashboard/account/lib/format-session-meta"
import type { AccountSessionRow } from "@/app/dashboard/account/lib/get-account-sessions"
import type { Locale } from "@repo/i18n"

type SessionDisplayLabels = {
  unknownDevice: string
  deviceOnOs: (browser: string, os: string) => string
}

export function mapAccountSessionsForDisplay(
  sessions: AccountSessionRow[],
  locale: Locale,
  labels: SessionDisplayLabels
): AccountSessionDisplay[] {
  return sessions.map((row) => {
    const device = getSessionDeviceDisplay(row.userAgent, labels)
    const createdAt = row.createdAt.toISOString()
    const expiresAt = row.expiresAt.toISOString()
    const ip = formatSessionIpAddress(row.ipAddress)

    return {
      id: row.id,
      token: row.token,
      device,
      signedInLabel: formatSessionSignedIn(createdAt, locale),
      signedInTitle: formatSessionSignedInTitle(createdAt, locale),
      expiresLabel: formatSessionExpires(expiresAt, locale),
      ipLabel: ip,
    }
  })
}
