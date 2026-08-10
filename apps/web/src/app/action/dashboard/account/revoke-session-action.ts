"use server"

import { headers } from "next/headers"
import { getAuthApiErrorMessage } from "@repo/auth"
import { auth } from "@repo/auth"

type RevokeSessionInput = {
  token: string
}

type RevokeSessionResult = {
  success: boolean
  error?: string
}

export async function revokeSessionAction(
  input: RevokeSessionInput
): Promise<RevokeSessionResult> {
  try {
    await auth.api.revokeSession({
      headers: await headers(),
      body: { token: input.token.trim() },
    })
  } catch (error) {
    return { success: false, error: getAuthApiErrorMessage(error) }
  }

  return { success: true }
}
