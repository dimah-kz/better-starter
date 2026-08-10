"use server"

import { invalidateAdminUsersPageCache } from "@/app/action/dashboard/admin/shared/invalidate-admin-cache"
import { invalidateUserCache } from "@/app/dashboard/lib/invalidate-user-cache"
import { headers } from "next/headers"
import { auth } from "@repo/auth"
import { getAuthApiErrorMessage } from "@repo/auth"

type BanUserInput = {
  userId: string
}

type BanUserResult = {
  success: boolean
  error?: string
}

export async function banUserAction(
  input: BanUserInput
): Promise<BanUserResult> {
  try {
    await auth.api.banUser({
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
