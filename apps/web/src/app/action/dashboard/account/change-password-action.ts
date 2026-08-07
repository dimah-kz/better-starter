"use server"

import { type AccountFormState } from "@/app/action/dashboard/account/shared/account-form-state"
import { headers } from "next/headers"
import { auth, getAuthApiErrorMessage } from "@better-starter/auth"
import { getFormString } from "@/components/form/form-parse"

export async function changePasswordAction(
  _prevState: AccountFormState,
  formData: FormData
): Promise<AccountFormState> {
  const currentPassword = getFormString(formData, "currentPassword")
  const newPassword = getFormString(formData, "newPassword")
  const confirmPassword = getFormString(formData, "confirmPassword")

  if (newPassword !== confirmPassword) {
    return { formError: "Passwords do not match." }
  }

  try {
    await auth.api.changePassword({
      headers: await headers(),
      body: { currentPassword, newPassword, revokeOtherSessions: false },
    })
  } catch (error) {
    return { formError: getAuthApiErrorMessage(error) }
  }

  return { success: true }
}
