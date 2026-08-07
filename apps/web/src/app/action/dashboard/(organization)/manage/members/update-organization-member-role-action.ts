"use server"

import { invalidateOrganizationMembersCache } from "@/app/action/dashboard/(organization)/manage/shared/invalidate-organization-manage-cache"
import { headers } from "next/headers"
import { auth } from "@better-starter/auth"
import { getAuthApiErrorMessage } from "@better-starter/auth"

type UpdateOrganizationMemberRoleInput = {
  organizationId: string
  memberId: string
  roles: string[]
}

type UpdateOrganizationMemberRoleResult = {
  success: boolean
  error?: string
}

export async function updateOrganizationMemberRoleAction(
  input: UpdateOrganizationMemberRoleInput
): Promise<UpdateOrganizationMemberRoleResult> {
  if (!input.roles.length) {
    return { success: false, error: "Select at least one role." }
  }

  try {
    await auth.api.updateMemberRole({
      headers: await headers(),
      body: {
        memberId: input.memberId,
        role: input.roles,
        organizationId: input.organizationId,
      },
    })
  } catch (error) {
    return { success: false, error: getAuthApiErrorMessage(error) }
  }

  invalidateOrganizationMembersCache(input.organizationId)

  return { success: true }
}
