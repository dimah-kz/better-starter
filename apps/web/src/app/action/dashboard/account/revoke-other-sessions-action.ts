"use server"

import { headers } from "next/headers"
import { getAuthApiErrorMessage } from "@repo/auth"
import { auth } from "@repo/auth"

type RevokeOtherSessionsResult = {
  success: boolean
  error?: string
}

export async function revokeOtherSessionsAction(): Promise<RevokeOtherSessionsResult> {
  try {
    await auth.api.revokeOtherSessions({ headers: await headers() })
  } catch (error) {
    return {
      success: false,
      error: getAuthApiErrorMessage(error),
    }
  }

  return { success: true }
}
