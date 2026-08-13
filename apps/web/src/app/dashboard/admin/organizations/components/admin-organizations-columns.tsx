"use client"

import type { Locale } from "@repo/i18n"
import {
  Identity,
  IdentityAvatar,
  IdentityContent,
  IdentityTitle,
} from "@repo/ui/components/dimah/identity"
import type { AdminOrganizationItem } from "@/app/dashboard/admin/organizations/lib/get-admin-organizations-page"
import type { ListColumn } from "@/components/list"
import { formatDate } from "@/lib/format-date"

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
}: CreateAdminOrganizationsColumnsOptions): ListColumn<AdminOrganizationItem>[] {
  return [
    {
      id: "organization",
      header: t("columns.organization"),
      cellClassName: "min-w-0",
      cell: (row) => (
        <Identity>
          <IdentityAvatar src={row.logo} name={row.name} />
          <IdentityContent>
            <IdentityTitle>{row.name}</IdentityTitle>
          </IdentityContent>
        </Identity>
      ),
    },
    {
      id: "slug",
      header: t("columns.slug"),
      headerClassName: "min-w-0 whitespace-nowrap text-muted-foreground",
      cellClassName: "min-w-0 whitespace-nowrap text-muted-foreground",
      cell: (row) => (
        <span className="block truncate" title={row.slug}>
          {row.slug}
        </span>
      ),
    },
    {
      id: "members",
      header: t("columns.members"),
      headerClassName: "whitespace-nowrap",
      cellClassName: "whitespace-nowrap",
      cell: (row) => row.memberCount,
    },
    {
      id: "created",
      header: t("columns.created"),
      headerClassName: "whitespace-nowrap text-muted-foreground",
      cellClassName: "whitespace-nowrap text-muted-foreground",
      cell: (row) => formatDate(row.createdAt, locale),
    },
  ]
}
