import type { AccountSessionDisplay } from "@/app/dashboard/account/components/account-sessions-content"
import { getSessionDeviceDisplay } from "@/app/dashboard/account/lib/format-session-device"
import {
  formatSessionExpires,
  formatSessionIpAddress,
  formatSessionSignedIn,
  formatSessionSignedInTitle,
} from "@/app/dashboard/account/lib/format-session-meta"
import type { AccountSessionRow } from "@/app/dashboard/account/lib/get-account-sessions"

export function mapAccountSessionsForDisplay(
  sessions: AccountSessionRow[]
): AccountSessionDisplay[] {
  return sessions.map((row) => {
    const device = getSessionDeviceDisplay(row.userAgent)
    const createdAt = row.createdAt.toISOString()
    const expiresAt = row.expiresAt.toISOString()
    const ip = formatSessionIpAddress(row.ipAddress)

    return {
      id: row.id,
      token: row.token,
      device,
      signedInLabel: formatSessionSignedIn(createdAt),
      signedInTitle: formatSessionSignedInTitle(createdAt),
      expiresLabel: formatSessionExpires(expiresAt),
      ipLabel: ip,
    }
  })
}
