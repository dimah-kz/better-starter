import { notFound } from "next/navigation"
import { OrganizationManageHeaderPanel } from "@/app/dashboard/(organization)/manage/components/organization-manage-header-panel"
import { canUpdateOrganizationDetails } from "@/app/dashboard/(organization)/manage/lib/can-access-organization-manage"
import { getActiveOrganizationBranding } from "@/app/dashboard/(organization)/manage/lib/get-active-organization-branding"

type OrganizationManageHeaderProps = {
  organizationId: string
}

export async function OrganizationManageHeader({
  organizationId,
}: OrganizationManageHeaderProps) {
  const organization = await getActiveOrganizationBranding(organizationId)

  if (!organization) {
    notFound()
  }

  const canEdit = await canUpdateOrganizationDetails(organizationId)

  return (
    <OrganizationManageHeaderPanel
      organization={organization}
      canEdit={canEdit}
    />
  )
}
