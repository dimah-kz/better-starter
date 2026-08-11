import { notFound } from "next/navigation"
import { Suspense } from "react"
import {
  canDeleteOrganization,
  canUpdateOrganizationDetails,
} from "@/app/dashboard/(organization)/manage/lib/can-access-organization-manage"
import { getActiveOrganizationBranding } from "@/app/dashboard/(organization)/manage/lib/get-active-organization-branding"
import { OrganizationSettingsHub } from "@/app/dashboard/(organization)/manage/settings/components/organization-settings-hub"
import { DashboardPageFallback } from "@/app/dashboard/components/layout/dashboard-page-shell"
import { resolveDashboardActiveOrganizationId } from "@/app/dashboard/lib/dashboard-session"

export default function OrganizationSettingsPage() {
  return (
    <Suspense fallback={<DashboardPageFallback />}>
      <OrganizationSettingsPageContent />
    </Suspense>
  )
}

async function OrganizationSettingsPageContent() {
  const organizationId = await resolveDashboardActiveOrganizationId()

  if (!organizationId) {
    return null
  }

  const organization = await getActiveOrganizationBranding(organizationId)

  if (!organization) {
    notFound()
  }

  const [canEdit, canDelete] = await Promise.all([
    canUpdateOrganizationDetails(organizationId),
    canDeleteOrganization(organizationId),
  ])

  return (
    <OrganizationSettingsHub
      organization={organization}
      canEdit={canEdit}
      canDelete={canDelete}
    />
  )
}
