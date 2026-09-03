"use client"

import { useId, useRef, useTransition, type RefObject } from "react"
import { useRouter } from "next/navigation"
import { updateProfileAction } from "@/app/action/dashboard/account/update-profile-action"
import { changePasswordAction } from "@/app/action/dashboard/account/change-password-action"
import { revokeOtherSessionsAction } from "@/app/action/dashboard/account/revoke-other-sessions-action"
import { AccountPasswordFormFields } from "@/app/dashboard/account/components/account-password-form-fields"
import { AccountProfileFormFields } from "@/app/dashboard/account/components/account-profile-form-fields"
import type { AccountSessionDisplay } from "@/app/dashboard/account/components/account-sessions-content"
import { AccountSessionsContent } from "@/app/dashboard/account/components/account-sessions-content"
import type { AccountPanel } from "@/app/dashboard/account/lib/account-panel"
import { ResponsiveFormOverlay } from "@/components/responsive-form-overlay"
import { toast } from "@repo/ui/components/toast"
import { Button } from "@repo/ui/components/button"
import { useTranslations } from "next-intl"

type AccountProfile = {
  id: string
  name: string
  email: string
  image: string | null
}

type AccountSettingsPanelProps = {
  section: AccountPanel | null
  onClose: () => void
  profile?: AccountProfile
  hasPasswordCredential?: boolean
  sessions?: AccountSessionDisplay[]
  currentSessionToken?: string
}

export function AccountSettingsPanel({
  section,
  onClose,
  profile,
  hasPasswordCredential = false,
  sessions = [],
  currentSessionToken = "",
}: AccountSettingsPanelProps) {
  const t = useTranslations("account")
  const tCommon = useTranslations("common")
  const router = useRouter()
  const profileFormId = useId()
  const passwordFormId = useId()
  const passwordFormRef = useRef<HTMLFormElement>(null)
  const [isPending, startTransition] = useTransition()

  const open = section !== null
  const hasOtherSessions = sessions.some(
    (session) => session.token !== currentSessionToken
  )

  const handleProfileSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await updateProfileAction({}, formData)

      if (result.success) {
        toast.add({ title: t("profile.saved"), type: "success" })
        onClose()
        router.refresh()
        return
      }

      if (result.formError) {
        toast.add({ title: result.formError, type: "error" })
      }
    })
  }

  const handlePasswordSubmit = () => {
    if (!passwordFormRef.current) {
      return
    }

    const formData = new FormData(passwordFormRef.current)
    startTransition(async () => {
      const result = await changePasswordAction({}, formData)

      if (result.success) {
        toast.add({ title: t("password.saved"), type: "success" })
        passwordFormRef.current?.reset()
        onClose()
        router.refresh()
        return
      }

      if (result.formError) {
        toast.add({ title: result.formError, type: "error" })
      }
    })
  }

  const handleRevokeOthers = () => {
    startTransition(async () => {
      const result = await revokeOtherSessionsAction()
      if (!result.success) {
        toast.add({
          title: result.error ?? t("sessions.signOutOthersFailed"),
          type: "error",
        })
        return
      }
      toast.add({ title: t("sessions.signedOutOthers"), type: "success" })
      router.refresh()
    })
  }

  const { title, description, footer, children } = resolvePanelContent({
    t,
    tCommon,
    section,
    isPending,
    hasPasswordCredential,
    hasOtherSessions,
    onClose,
    profileFormId,
    passwordFormId,
    passwordFormRef,
    profile,
    sessions,
    currentSessionToken,
    handleProfileSubmit,
    handlePasswordSubmit,
    handleRevokeOthers,
  })

  return (
    <ResponsiveFormOverlay
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose()
        }
      }}
      title={title}
      description={description}
      footer={footer}
    >
      {children}
    </ResponsiveFormOverlay>
  )
}

type ResolvePanelContentArgs = {
  t: ReturnType<typeof useTranslations<"account">>
  tCommon: ReturnType<typeof useTranslations<"common">>
  section: AccountPanel | null
  isPending: boolean
  hasPasswordCredential: boolean
  hasOtherSessions: boolean
  onClose: () => void
  profileFormId: string
  passwordFormId: string
  passwordFormRef: RefObject<HTMLFormElement | null>
  profile: AccountProfile | undefined
  sessions: AccountSessionDisplay[]
  currentSessionToken: string
  handleProfileSubmit: (formData: FormData) => void
  handlePasswordSubmit: () => void
  handleRevokeOthers: () => void
}

function resolvePanelContent({
  t,
  tCommon,
  section,
  isPending,
  hasPasswordCredential,
  hasOtherSessions,
  onClose,
  profileFormId,
  passwordFormId,
  passwordFormRef,
  profile,
  sessions,
  currentSessionToken,
  handleProfileSubmit,
  handlePasswordSubmit,
  handleRevokeOthers,
}: ResolvePanelContentArgs) {
  switch (section) {
    case "profile":
      if (!profile) {
        return {
          title: "",
          description: undefined,
          footer: null,
          children: null,
        }
      }

      return {
        title: t("profile.title"),
        description: t("profile.description"),
        footer: (
          <>
            <Button type="submit" form={profileFormId} disabled={isPending}>
              {isPending ? t("profile.saving") : t("profile.save")}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={onClose}
            >
              {tCommon("cancel")}
            </Button>
          </>
        ),
        children: (
          <form
            id={profileFormId}
            noValidate
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault()
              handleProfileSubmit(new FormData(event.currentTarget))
            }}
          >
            <AccountProfileFormFields
              formId={profileFormId}
              profile={profile}
            />
          </form>
        ),
      }
    case "password":
      return {
        title: t("password.title"),
        description: t("password.description"),
        footer: hasPasswordCredential ? (
          <>
            <Button
              type="button"
              disabled={isPending}
              onClick={handlePasswordSubmit}
            >
              {isPending ? t("password.saving") : t("password.save")}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={onClose}
            >
              {tCommon("cancel")}
            </Button>
          </>
        ) : (
          <Button type="button" variant="outline" onClick={onClose}>
            {tCommon("close")}
          </Button>
        ),
        children: hasPasswordCredential ? (
          <form
            ref={passwordFormRef}
            id={passwordFormId}
            noValidate
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault()
              handlePasswordSubmit()
            }}
          >
            <AccountPasswordFormFields formId={passwordFormId} />
          </form>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t("password.unavailable")}
          </p>
        ),
      }
    case "sessions":
      return {
        title: t("sessions.title"),
        description: t("sessions.description"),
        footer: hasOtherSessions ? (
          <>
            <Button
              type="button"
              disabled={isPending}
              onClick={handleRevokeOthers}
            >
              {isPending
                ? t("sessions.signingOutOthers")
                : t("sessions.signOutOthers")}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={onClose}
            >
              {tCommon("close")}
            </Button>
          </>
        ) : (
          <Button type="button" variant="outline" onClick={onClose}>
            {tCommon("close")}
          </Button>
        ),
        children: (
          <AccountSessionsContent
            sessions={sessions}
            currentSessionToken={currentSessionToken}
            disabled={isPending}
          />
        ),
      }
    default:
      return {
        title: "",
        description: undefined,
        footer: null,
        children: null,
      }
  }
}
