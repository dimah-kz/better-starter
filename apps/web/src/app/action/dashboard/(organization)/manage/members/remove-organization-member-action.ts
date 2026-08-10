"use server"

import {
  invalidateOrganizationBrandingCache,
  invalidateOrganizationMembersCache,
} from "@/app/action/dashboard/(organization)/manage/shared/invalidate-organization-manage-cache"
import { headers } from "next/headers"
import { auth } from "@repo/auth"
import { getAuthApiErrorMessage } from "@repo/auth"

type RemoveOrganizationMemberInput = {
  organizationId: string
  memberId: string
}

type RemoveOrganizationMemberResult = {
  success: boolean
  error?: string
}

export async function removeOrganizationMemberAction(
  input: RemoveOrganizationMemberInput
): Promise<RemoveOrganizationMemberResult> {
  try {
    await auth.api.removeMember({
      headers: await headers(),
      body: {
        memberIdOrEmail: input.memberId,
        organizationId: input.organizationId,
      },
    })
  } catch (error) {
    return { success: false, error: getAuthApiErrorMessage(error) }
  }

  invalidateOrganizationMembersCache(input.organizationId)
  invalidateOrganizationBrandingCache(input.organizationId)

  return { success: true }
}
