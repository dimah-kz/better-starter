"use server"

import { type AccountFormState } from "@/app/action/dashboard/account/shared/account-form-state"
import { invalidateUserCache } from "@/app/dashboard/lib/invalidate-user-cache"
import { getFormString } from "@/components/form/form-parse"
import { headers } from "next/headers"
import { auth, getAuthApiErrorMessage } from "@repo/auth"

export async function updateProfileAction(
  _prevState: AccountFormState,
  formData: FormData
): Promise<AccountFormState> {
  const name = getFormString(formData, "name")

  try {
    await auth.api.updateUser({
      headers: await headers(),
      body: { name },
    })
  } catch (error) {
    return { formError: getAuthApiErrorMessage(error) }
  }

  const session = await auth.api.getSession({ headers: await headers() })
  const userId = session?.user.id

  if (userId) {
    invalidateUserCache(userId)
  }

  return { success: true }
}
