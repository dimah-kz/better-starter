"use client"

import { AdminOrganizationsTable } from "@/app/dashboard/admin/organizations/components/admin-organizations-table"
import type { AdminOrganizationItem } from "@/app/dashboard/admin/organizations/lib/get-admin-organizations-page"

type AdminOrganizationManagementPanelProps = {
  organizations: AdminOrganizationItem[]
  page: number
  pageSize: number
  totalCount: number
  q?: string
}

export function AdminOrganizationManagementPanel(
  props: AdminOrganizationManagementPanelProps
) {
  return (
    <div className="space-y-4">
      <AdminOrganizationsTable {...props} />
    </div>
  )
}
