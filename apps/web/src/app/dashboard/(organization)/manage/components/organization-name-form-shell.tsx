"use client"

import { useEffect, useId, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { FormLabel } from "@/components/form/form-label"
import { ResponsiveFormOverlay } from "@/components/responsive-form-overlay"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { toast } from "@repo/ui/components/toast"
import { useTranslations } from "next-intl"

type OrganizationNameTarget = {
  id: string
  name: string
}

type UpdateOrganizationNameResult = {
  success: boolean
  error?: string
}

type OrganizationNameFormShellProps = {
  organization: OrganizationNameTarget | null
  open: boolean
  onClose: () => void
  submitAction: (input: {
    organizationId: string
    name: string
  }) => Promise<UpdateOrganizationNameResult>
}

export function OrganizationNameFormShell({
  organization,
  open,
  onClose,
  submitAction,
}: OrganizationNameFormShellProps) {
  const t = useTranslations("dashboard.organizationManage")
  const router = useRouter()
  const fieldId = useId()
  const [isPending, startTransition] = useTransition()
  const [name, setName] = useState("")

  useEffect(() => {
    if (organization) {
      setName(organization.name)
    }
  }, [organization])

  const canSubmit = Boolean(organization && name.trim())

  const handleSubmit = () => {
    if (!organization || !canSubmit) {
      return
    }

    startTransition(async () => {
      const result = await submitAction({
        organizationId: organization.id,
        name: name.trim(),
      })

      if (!result.success) {
        toast.add({
          title: result.error ?? t("nameUpdateFailed"),
          type: "error",
        })
        return
      }

      toast.add({ title: t("nameUpdated"), type: "success" })
      onClose()
      router.refresh()
    })
  }

  const editNameLabel = t("editName")

  return (
    <ResponsiveFormOverlay
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose()
        }
      }}
      title={editNameLabel}
      description={organization?.name}
      footer={
        <>
          <Button
            type="button"
            disabled={isPending || !canSubmit}
            onClick={handleSubmit}
          >
            {editNameLabel}
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
      {organization ? (
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
      ) : null}
    </ResponsiveFormOverlay>
  )
}
