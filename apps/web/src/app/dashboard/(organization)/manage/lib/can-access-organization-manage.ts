import { headers } from "next/headers"
import { auth } from "@repo/auth"

/** UI/route gate for organization manage — mutations still enforce via `auth.api`. */
export async function canAccessOrganizationManage(organizationId: string) {
  const { success } = await auth.api.hasPermission({
    headers: await headers(),
    body: {
      organizationId,
      permissions: { member: ["update"] },
    },
  })

  return success
}

/** UI gate for editing organization details (name, etc.). */
export async function canUpdateOrganizationDetails(organizationId: string) {
  const { success } = await auth.api.hasPermission({
    headers: await headers(),
    body: {
      organizationId,
      permissions: { organization: ["update"] },
    },
  })

  return success
}
