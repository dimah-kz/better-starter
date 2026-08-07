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
import { toast } from "@workspace/ui/components/toast"
import { Button } from "@workspace/ui/components/button"
import { useTranslations } from "next-intl"

type AccountSettingsPanelProps = {
  section: AccountPanel | null
  onClose: () => void
  profile: {
    id: string
    name: string
    email: string
    image: string | null
  }
  hasPasswordCredential: boolean
  sessions: AccountSessionDisplay[]
  currentSessionToken: string
}

export function AccountSettingsPanel({
  section,
  onClose,
  profile,
  hasPasswordCredential,
  sessions,
  currentSessionToken,
}: AccountSettingsPanelProps) {
  const t = useTranslations("account")
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
        toast.add({ title: "Your password was updated.", type: "success" })
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
          title: result.error ?? "Could not revoke other sessions.",
          type: "error",
        })
        return
      }
      toast.add({ title: "Other sessions were signed out.", type: "success" })
      router.refresh()
    })
  }

  const { title, footer, children } = resolvePanelContent({
    t,
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
      footer={footer}
    >
      {children}
    </ResponsiveFormOverlay>
  )
}

type ResolvePanelContentArgs = {
  t: ReturnType<typeof useTranslations<"account">>
  section: AccountPanel | null
  isPending: boolean
  hasPasswordCredential: boolean
  hasOtherSessions: boolean
  onClose: () => void
  profileFormId: string
  passwordFormId: string
  passwordFormRef: RefObject<HTMLFormElement | null>
  profile: AccountSettingsPanelProps["profile"]
  sessions: AccountSessionDisplay[]
  currentSessionToken: string
  handleProfileSubmit: (formData: FormData) => void
  handlePasswordSubmit: () => void
  handleRevokeOthers: () => void
}

function resolvePanelContent({
  t,
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
      return {
        title: t("profile.title"),
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
              {t("profile.cancel")}
            </Button>
          </>
        ),
        children: (
          <form
            id={profileFormId}
            noValidate
            className="space-y-4"
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
    case "security":
      return {
        title: t("security.title"),
        footer: hasPasswordCredential ? (
          <>
            <Button
              type="button"
              disabled={isPending}
              onClick={handlePasswordSubmit}
            >
              {isPending ? "Updating…" : "Update password"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={onClose}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        ),
        children: hasPasswordCredential ? (
          <form
            ref={passwordFormRef}
            id={passwordFormId}
            noValidate
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault()
              handlePasswordSubmit()
            }}
          >
            <AccountPasswordFormFields formId={passwordFormId} />
          </form>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t("security.unavailable")}
          </p>
        ),
      }
    case "sessions":
      return {
        title: t("sessions.title"),
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
              Close
            </Button>
          </>
        ) : (
          <Button type="button" variant="outline" onClick={onClose}>
            Close
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
        footer: null,
        children: null,
      }
  }
}
