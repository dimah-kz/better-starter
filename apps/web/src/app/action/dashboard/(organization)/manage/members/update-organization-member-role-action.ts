"use server"

import { invalidateOrganizationMembersCache } from "@/app/action/dashboard/(organization)/manage/shared/invalidate-organization-manage-cache"
import { headers } from "next/headers"
import { getTranslations } from "next-intl/server"
import { auth } from "@repo/auth"
import { getAuthApiErrorMessage } from "@repo/auth"

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
    const t = await getTranslations("common.errors")
    return { success: false, error: t("selectRole") }
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
