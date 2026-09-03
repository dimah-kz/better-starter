"use server"

import { headers } from "next/headers"
import { getTranslations } from "next-intl/server"
import { auth, getAuthApiErrorMessage } from "@repo/auth"

type RevokeSessionResult = {
  success: boolean
  error?: string
}

export async function revokeSessionAction(
  sessionId: string
): Promise<RevokeSessionResult> {
  const requestHeaders = await headers()
  const id = sessionId.trim()

  try {
    const [current, sessions] = await Promise.all([
      auth.api.getSession({ headers: requestHeaders }),
      auth.api.listSessions({ headers: requestHeaders }),
    ])

    const target = Array.isArray(sessions)
      ? sessions.find((session) => session.id === id)
      : undefined

    if (!current || !target || target.id === current.session.id) {
      const t = await getTranslations("account.sessions")
      return { success: false, error: t("revokeFailed") }
    }

    await auth.api.revokeSession({
      headers: requestHeaders,
      body: { token: target.token },
    })
  } catch (error) {
    return { success: false, error: getAuthApiErrorMessage(error) }
  }

  return { success: true }
}
