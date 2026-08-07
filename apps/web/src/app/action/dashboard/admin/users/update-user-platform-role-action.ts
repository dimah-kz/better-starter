"use server"

import { invalidateAdminUsersPageCache } from "@/app/action/dashboard/admin/shared/invalidate-admin-cache"
import { invalidateUserCache } from "@/app/dashboard/lib/invalidate-user-cache"
import { headers } from "next/headers"
import { auth } from "@better-starter/auth"
import { getAuthApiErrorMessage } from "@better-starter/auth"
import {
  adminPluginRoles,
  type PlatformRole,
} from "@better-starter/auth/admin-access"

type UpdateUserPlatformRoleInput = {
  userId: string
  roles: PlatformRole[]
}

type UpdateUserPlatformRoleResult = {
  success: boolean
  error?: string
}

export async function updateUserPlatformRoleAction(
  input: UpdateUserPlatformRoleInput
): Promise<UpdateUserPlatformRoleResult> {
  if (!input.roles.length) {
    return { success: false, error: "Select at least one role." }
  }

  const validRoles = new Set(Object.keys(adminPluginRoles))
  if (!input.roles.every((role) => validRoles.has(role))) {
    return { success: false, error: "Invalid platform role." }
  }

  try {
    await auth.api.setRole({
      headers: await headers(),
      body: {
        userId: input.userId,
        role: input.roles,
      },
    })
  } catch (error) {
    return { success: false, error: getAuthApiErrorMessage(error) }
  }

  invalidateAdminUsersPageCache()
  invalidateUserCache(input.userId)

  return { success: true }
}
