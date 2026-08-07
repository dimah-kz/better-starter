import { normalizeAuthRedirectTarget } from "@/app/(auth)/lib/auth-redirect"
import { getFormString } from "@/components/form/form-parse"

export function getAuthRedirectFromForm(formData: FormData) {
  return normalizeAuthRedirectTarget(getFormString(formData, "redirectTo"))
}
