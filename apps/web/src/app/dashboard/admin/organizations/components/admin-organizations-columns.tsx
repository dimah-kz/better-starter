"use client"

import type { Locale } from "@repo/i18n"
import {
  Identity,
  IdentityAvatar,
  IdentityContent,
  IdentityTitle,
} from "@repo/ui/components/dimah/identity"
import type { AdminOrganizationItem } from "@/app/dashboard/admin/organizations/lib/get-admin-organizations-page"
import { createDataGridColumnHelper } from "@/components/data-grid"
import { formatDate } from "@/lib/format-date"

const columnHelper = createDataGridColumnHelper<AdminOrganizationItem>()

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
      meta: {
        headerTitle: t("columns.organization"),
        cellClassName: "min-w-0",
      },
      size: 300,
      cell: ({ row }) => (
        <Identity>
          <IdentityAvatar src={row.original.logo} name={row.original.name} />
          <IdentityContent>
            <IdentityTitle>{row.original.name}</IdentityTitle>
          </IdentityContent>
        </Identity>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor("slug", {
      header: t("columns.slug"),
      meta: {
        headerTitle: t("columns.slug"),
        headerClassName: "min-w-0 whitespace-nowrap text-muted-foreground",
        cellClassName: "min-w-0 whitespace-nowrap text-muted-foreground",
      },
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
      meta: {
        headerTitle: t("columns.members"),
        headerClassName: "whitespace-nowrap",
        cellClassName: "whitespace-nowrap",
      },
      enableSorting: false,
    }),
    columnHelper.accessor("createdAt", {
      id: "created",
      header: t("columns.created"),
      meta: {
        headerTitle: t("columns.created"),
        headerClassName: "whitespace-nowrap text-muted-foreground",
        cellClassName: "whitespace-nowrap text-muted-foreground",
      },
      cell: ({ row }) => formatDate(row.original.createdAt, locale),
      enableSorting: false,
    }),
  ])
}
