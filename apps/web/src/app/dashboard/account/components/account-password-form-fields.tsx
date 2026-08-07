"use client"

import { PasswordInput } from "@/components/form/password-input"
import { Field, FieldGroup, FieldLabel } from "@workspace/ui/components/field"

type AccountPasswordFormFieldsProps = {
  formId: string
}

export function AccountPasswordFormFields({
  formId,
}: AccountPasswordFormFieldsProps) {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor={`${formId}-currentPassword`}>
          Current password
        </FieldLabel>
        <PasswordInput
          id={`${formId}-currentPassword`}
          name="currentPassword"
          autoComplete="current-password"
          required
        />
      </Field>
      <Field>
        <FieldLabel htmlFor={`${formId}-newPassword`}>New password</FieldLabel>
        <PasswordInput
          id={`${formId}-newPassword`}
          name="newPassword"
          autoComplete="new-password"
          required
        />
      </Field>
      <Field>
        <FieldLabel htmlFor={`${formId}-confirmPassword`}>
          Confirm new password
        </FieldLabel>
        <PasswordInput
          id={`${formId}-confirmPassword`}
          name="confirmPassword"
          autoComplete="new-password"
          required
        />
      </Field>
    </FieldGroup>
  )
}
