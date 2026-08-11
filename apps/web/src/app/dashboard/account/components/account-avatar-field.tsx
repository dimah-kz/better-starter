"use client"

import { removeAccountAvatarAction } from "@/app/action/dashboard/account/remove-account-avatar-action"
import { setAccountAvatarAction } from "@/app/action/dashboard/account/set-account-avatar-action"
import { AvatarUploadField } from "@/components/avatar-upload-field"
import { toAvatarKey } from "@/lib/avatar-storage"
import { useTranslations } from "next-intl"

type AccountAvatarFieldProps = {
  userId: string
  name: string
  image: string | null
}

export function AccountAvatarField({
  userId,
  name,
  image,
}: AccountAvatarFieldProps) {
  const t = useTranslations("account.profile.avatar")

  return (
    <div className="flex justify-center">
      <AvatarUploadField
        name={name}
        image={image}
        toKey={(fileName) =>
          toAvatarKey({ kind: "user", id: userId }, fileName)
        }
        setAction={setAccountAvatarAction}
        removeAction={removeAccountAvatarAction}
        labels={{
          change: t("change"),
          upload: t("upload"),
          remove: t("remove"),
          updated: t("updated"),
          removed: t("removed"),
          uploadFailed: t("uploadFailed"),
        }}
      />
    </div>
  )
}
