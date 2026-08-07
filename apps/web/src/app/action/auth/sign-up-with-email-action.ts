"use server"

import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { getAuthRedirectFromForm } from "@/app/(auth)/lib/auth-form-parse"
import { type AuthFormState } from "@/app/(auth)/lib/auth-form-state"
import { getFormString } from "@/components/form/form-parse"
import { auth, getAuthApiErrorMessage } from "@better-starter/auth"

export async function signUpWithEmailAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const redirectTo = getAuthRedirectFromForm(formData)

  try {
    await auth.api.signUpEmail({
      headers: await headers(),
      body: {
        name: getFormString(formData, "name"),
        email: getFormString(formData, "email"),
        password: getFormString(formData, "password"),
        callbackURL: redirectTo,
      },
    })
  } catch (error) {
    return { formError: getAuthApiErrorMessage(error) }
  }

  redirect(redirectTo)
}
