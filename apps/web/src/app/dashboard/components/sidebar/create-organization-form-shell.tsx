"use client"

import { useEffect, useId, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createOrganizationAction } from "@/app/action/dashboard/components/create-organization-action"
import { FormLabel } from "@/components/form/form-label"
import { ResponsiveFormOverlay } from "@/components/responsive-form-overlay"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { toast } from "@repo/ui/components/toast"
import { useTranslations } from "next-intl"

type CreateOrganizationFormShellProps = {
  open: boolean
  onClose: () => void
}

export function CreateOrganizationFormShell({
  open,
  onClose,
}: CreateOrganizationFormShellProps) {
  const t = useTranslations("dashboard.nav.organizationSwitcher")
  const router = useRouter()
  const fieldId = useId()
  const [isPending, startTransition] = useTransition()
  const [name, setName] = useState("")

  useEffect(() => {
    if (!open) {
      setName("")
    }
  }, [open])

  const canSubmit = Boolean(name.trim())

  const handleSubmit = () => {
    if (!canSubmit) {
      return
    }

    startTransition(async () => {
      const result = await createOrganizationAction({ name: name.trim() })

      if (!result.success) {
        toast.add({
          title: result.error ?? t("organizationCreateFailed"),
          type: "error",
        })
        return
      }

      toast.add({ title: t("organizationCreated"), type: "success" })
      onClose()
      router.refresh()
    })
  }

  const createOrganizationLabel = t("createOrganization")

  return (
    <ResponsiveFormOverlay
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose()
        }
      }}
      title={createOrganizationLabel}
      footer={
        <>
          <Button
            type="button"
            disabled={isPending || !canSubmit}
            onClick={handleSubmit}
          >
            {createOrganizationLabel}
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
      }
    >
      <div className="space-y-3">
        <FormLabel htmlFor={`${fieldId}-name`} required>
          {t("nameLabel")}
        </FormLabel>
        <Input
          id={`${fieldId}-name`}
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="organization"
          disabled={isPending}
          required
        />
      </div>
    </ResponsiveFormOverlay>
  )
}
