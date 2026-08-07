import { headers } from "next/headers"
import { auth } from "@better-starter/auth"

export type AccountSessionRow = {
  id: string
  token: string
  createdAt: Date
  expiresAt: Date
  ipAddress: string | null
  userAgent: string | null
}

export async function getAccountSessions(): Promise<AccountSessionRow[]> {
  const sessions = await auth.api.listSessions({ headers: await headers() })

  if (!Array.isArray(sessions)) {
    return []
  }

  return sessions.map((session) => ({
    id: session.id,
    token: session.token,
    createdAt: new Date(session.createdAt),
    expiresAt: new Date(session.expiresAt),
    ipAddress: session.ipAddress ?? null,
    userAgent: session.userAgent ?? null,
  }))
}
