"use client"

import { useMemo } from "react"
import { useTable } from "@tanstack/react-table"
import { createAdminOrganizationsColumns } from "@/app/dashboard/admin/organizations/components/admin-organizations-columns"
import type { AdminOrganizationItem } from "@/app/dashboard/admin/organizations/lib/get-admin-organizations-page"
import { adminOrganizationsTablePath } from "@/app/dashboard/admin/organizations/lib/admin-organizations-table-params"
import { List, useList } from "@/components/list"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card"
import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures,
} from "@repo/ui/components/reui/data-grid/data-grid"
import { DataGridTable } from "@repo/ui/components/reui/data-grid/data-grid-table"
import type { Locale } from "@repo/i18n"
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

  const table = useTable({
    features: dataGridFeatures,
    data: organizations,
    columns,
    getRowId: (row) => row.id,
    manualPagination: true,
    rowCount: totalCount,
  })

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t("dashboard.adminTabs.organizations")}</CardTitle>
        <CardAction className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <List.Search
            value={q}
            placeholder={tTables("search.organizations")}
            buildPath={list.buildSearchPath}
          />
        </CardAction>
      </CardHeader>
      <CardContent className="min-w-0">
        <DataGrid
          table={table}
          recordCount={totalCount}
          emptyMessage={tTables("empty.organizations")}
          className="min-w-0"
          tableLayout={{
            width: "fixed",
            headerBackground: true,
            rowBorder: true,
          }}
        >
          <DataGridContainer>
            <DataGridTable />
          </DataGridContainer>
        </DataGrid>
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <List.Footer pagination={list.pagination} />
      </CardFooter>
    </Card>
  )
}
