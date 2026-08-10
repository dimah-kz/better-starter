"use client"

import type { Locale } from "@repo/i18n"
import type { AdminOrganizationItem } from "@/app/dashboard/admin/organizations/lib/get-admin-organizations-page"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar"
import { createDataTableColumnHelper } from "@/components/data-table"
import { formatDate } from "@/lib/format-date"

const columnHelper = createDataTableColumnHelper<AdminOrganizationItem>()

function organizationInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

type TablesTranslator = {
  (key: "columns.organization"): string
  (key: "columns.slug"): string
  (key: "columns.members"): string
  (key: "columns.created"): string
}

type CreateAdminOrganizationsColumnsOptions = {
  t: TablesTranslator
  locale: Locale
}

export function createAdminOrganizationsColumns({
  t,
  locale,
}: CreateAdminOrganizationsColumnsOptions) {
  return columnHelper.columns([
    columnHelper.accessor("name", {
      id: "organization",
      header: t("columns.organization"),
      meta: { className: "min-w-0" },
      cell: ({ row }) => (
        <div className="flex min-w-0 items-center gap-2">
          <Avatar size="sm" className="shrink-0">
            {row.original.logo ? (
              <AvatarImage src={row.original.logo} alt="" />
            ) : null}
            <AvatarFallback>
              {organizationInitials(row.original.name)}
            </AvatarFallback>
          </Avatar>
          <span
            className="block truncate font-medium"
            title={row.original.name}
          >
            {row.original.name}
          </span>
        </div>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor("slug", {
      header: t("columns.slug"),
      meta: { className: "hidden min-w-0 text-muted-foreground sm:table-cell" },
      cell: ({ row }) => (
        <span className="block truncate" title={row.original.slug}>
          {row.original.slug}
        </span>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor("memberCount", {
      id: "members",
      header: t("columns.members"),
      enableSorting: false,
    }),
    columnHelper.accessor("createdAt", {
      id: "created",
      header: t("columns.created"),
      meta: { className: "hidden lg:table-cell" },
      cell: ({ row }) => formatDate(row.original.createdAt, locale),
      enableSorting: false,
    }),
  ])
}
