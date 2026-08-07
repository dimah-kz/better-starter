"use client"

import { useActionState } from "react"
import { MailIcon } from "lucide-react"
import { signInWithEmailAction } from "@/app/action/auth/sign-in-with-email-action"
import { AUTH_FORM_INITIAL_STATE } from "@/app/(auth)/lib/auth-form-state"
import { Field, FieldGroup, FieldLabel } from "@workspace/ui/components/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import { Alert, AlertDescription } from "@workspace/ui/components/alert"
import { FormSubmitButton } from "@/components/form/form-submit-button"
import { PasswordInput } from "@/components/form/password-input"
import { AuthSocialButtons } from "@/app/(auth)/components/auth-social-buttons"
import { useTranslations } from "next-intl"

type LoginFormProps = {
  redirectTo: string
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  const t = useTranslations("auth.login")
  const [state, formAction] = useActionState(
    signInWithEmailAction,
    AUTH_FORM_INITIAL_STATE
  )

  return (
    <div className="space-y-4">
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="redirectTo" value={redirectTo} />
        {state.formError ? (
          <Alert variant="destructive">
            <AlertDescription>{state.formError}</AlertDescription>
          </Alert>
        ) : null}
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="email"
                name="email"
                type="email"
                placeholder={t("emailPlaceholder")}
                autoComplete="email"
                required
              />
              <InputGroupAddon>
                <MailIcon
                  className="size-3.5 shrink-0 opacity-60"
                  aria-hidden="true"
                />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="password">{t("password")}</FieldLabel>
            <PasswordInput
              id="password"
              name="password"
              autoComplete="current-password"
              required
            />
          </Field>
        </FieldGroup>
        <FormSubmitButton
          idleText={t("submit")}
          loadingText={t("submitting")}
        />
      </form>
      <AuthSocialButtons />
    </div>
  )
}
