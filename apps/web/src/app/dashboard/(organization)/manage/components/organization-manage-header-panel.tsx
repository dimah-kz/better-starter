"use client"

import { useState } from "react"
import { PencilIcon } from "lucide-react"
import { updateOrganizationNameAction } from "@/app/action/dashboard/(organization)/manage/update-organization-name-action"
import type { OrganizationBranding } from "@/app/dashboard/(organization)/manage/lib/get-active-organization-branding"
import { OrganizationLogoField } from "@/app/dashboard/(organization)/manage/components/organization-logo-field"
import { OrganizationNameFormShell } from "@/app/dashboard/(organization)/manage/components/organization-name-form-shell"
import { OrganizationAvatar } from "@/components/organization-avatar"
import { Button } from "@repo/ui/components/button"
import { useTranslations } from "next-intl"

type OrganizationManageHeaderPanelProps = {
  organization: OrganizationBranding
  canEdit: boolean
}

export function OrganizationManageHeaderPanel({
  organization,
  canEdit,
}: OrganizationManageHeaderPanelProps) {
  const t = useTranslations("dashboard.organizationManage")
  const [editOpen, setEditOpen] = useState(false)

  return (
    <>
      <div className="flex min-w-0 items-center gap-2">
        {canEdit ? (
          <OrganizationLogoField
            organizationId={organization.id}
            name={organization.name}
            logo={organization.logo}
          />
        ) : (
          <OrganizationAvatar
            name={organization.name}
            logo={organization.logo}
            size="lg"
          />
        )}
        <h1 className="truncate text-base font-semibold">
          {organization.name}
        </h1>
        {canEdit ? (
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-label={t("editName")}
            onClick={() => setEditOpen(true)}
          >
            <PencilIcon />
          </Button>
        ) : null}
      </div>

      <OrganizationNameFormShell
        organization={editOpen ? organization : null}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        submitAction={updateOrganizationNameAction}
      />
    </>
  )
}
