"use server"

import { invalidateAdminUsersPageCache } from "@/app/action/dashboard/admin/shared/invalidate-admin-cache"
import { invalidateUserCache } from "@/app/dashboard/lib/invalidate-user-cache"
import { headers } from "next/headers"
import { auth } from "@repo/auth"
import { getAuthApiErrorMessage } from "@repo/auth"

type UnbanUserInput = {
  userId: string
}

type UnbanUserResult = {
  success: boolean
  error?: string
}

export async function unbanUserAction(
  input: UnbanUserInput
): Promise<UnbanUserResult> {
  try {
    await auth.api.unbanUser({
      headers: await headers(),
      body: {
        userId: input.userId,
      },
    })
  } catch (error) {
    return { success: false, error: getAuthApiErrorMessage(error) }
  }

  invalidateAdminUsersPageCache()
  invalidateUserCache(input.userId)

  return { success: true }
}
