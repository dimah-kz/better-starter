"use client"

import { useMemo } from "react"
import { createAdminOrganizationsColumns } from "@/app/dashboard/admin/organizations/components/admin-organizations-columns"
import type { AdminOrganizationItem } from "@/app/dashboard/admin/organizations/lib/get-admin-organizations-page"
import { adminOrganizationsTablePath } from "@/app/dashboard/admin/organizations/lib/admin-organizations-table-params"
import type { Locale } from "@better-starter/i18n"
import { DataTable, DataTableCard } from "@/components/data-table"
import { List, useList } from "@/components/list"
import { useLocale, useTranslations } from "next-intl"

type AdminOrganizationsTableProps = {
  organizations: AdminOrganizationItem[]
  page: number
  pageSize: number
  totalCount: number
  q?: string
}

export function AdminOrganizationsTable({
  organizations,
  page,
  pageSize,
  totalCount,
  q,
}: AdminOrganizationsTableProps) {
  const locale = useLocale() as Locale
  const t = useTranslations()
  const tTables = useTranslations("tables")

  const list = useList({
    buildPath: adminOrganizationsTablePath,
    page,
    pageSize,
    totalCount,
    q,
    countLabel: "organization",
  })

  const columns = useMemo(
    () =>
      createAdminOrganizationsColumns({
        t: tTables,
        locale,
      }),
    [locale, tTables]
  )

  return (
    <DataTableCard
      title={t("dashboard.adminTabs.organizations")}
      toolbar={
        <List.Search
          value={q}
          placeholder={tTables("search.organizations")}
          buildPath={list.buildSearchPath}
        />
      }
      footer={<List.Footer pagination={list.pagination} />}
    >
      <DataTable
        variant="plain"
        columns={columns}
        data={organizations}
        getRowId={(row) => row.id}
        manualPagination
        rowCount={totalCount}
        emptyMessage={tTables("empty.organizations")}
      />
    </DataTableCard>
  )
}
