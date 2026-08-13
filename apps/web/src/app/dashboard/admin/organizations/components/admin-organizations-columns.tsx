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
      className: "w-full min-w-0",
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
      className: "text-muted-foreground",
      cell: (row) => row.slug,
    },
    {
      id: "members",
      header: t("columns.members"),
      cell: (row) => row.memberCount,
    },
    {
      id: "created",
      header: t("columns.created"),
      className: "text-muted-foreground",
      cell: (row) => formatDate(row.createdAt, locale),
    },
  ]
}
