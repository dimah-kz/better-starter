"use client"

import { AccountAvatarField } from "@/app/dashboard/account/components/account-avatar-field"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { useTranslations } from "next-intl"

type AccountProfileFormFieldsProps = {
  formId: string
  profile: {
    id: string
    name: string
    email: string
    image: string | null
  }
}

export function AccountProfileFormFields({
  formId,
  profile,
}: AccountProfileFormFieldsProps) {
  const t = useTranslations("account.profile")

  return (
    <FieldGroup>
      <Field>
        <FieldLabel>{t("avatar.label")}</FieldLabel>
        <AccountAvatarField
          userId={profile.id}
          name={profile.name}
          image={profile.image}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor={`${formId}-email`}>{t("email")}</FieldLabel>
        <Input
          id={`${formId}-email`}
          type="email"
          value={profile.email}
          disabled
          readOnly
        />
        <FieldDescription>{t("emailHint")}</FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${formId}-name`}>{t("displayName")}</FieldLabel>
        <Input
          id={`${formId}-name`}
          name="name"
          autoComplete="name"
          defaultValue={profile.name}
          required
        />
      </Field>
    </FieldGroup>
  )
}
