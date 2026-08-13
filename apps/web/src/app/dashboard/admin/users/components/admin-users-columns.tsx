"use client"

import type { Locale } from "@repo/i18n"
import {
  Identity,
  IdentityAvatar,
  IdentityContent,
  IdentityDescription,
  IdentityTitle,
} from "@repo/ui/components/dimah/identity"
import type { AdminUserItem } from "@/app/dashboard/admin/users/lib/get-admin-users-page"
import { AdminUserRowActionsMenu } from "@/app/dashboard/admin/users/components/admin-user-row-actions-menu"
import { PlatformRoleBadge } from "@/components/badge/platform-role-badge"
import { UserAccountStatusBadge } from "@/components/badge/user-account-status-badge"
import type { ListColumn } from "@/components/list"
import { formatDate } from "@/lib/format-date"

type TablesTranslator = {
  (key: "columns.user"): string
  (key: "columns.role"): string
  (key: "columns.status"): string
  (key: "columns.joined"): string
  (key: "columns.actions"): string
}

type CreateAdminUsersColumnsOptions = {
  t: TablesTranslator
  locale: Locale
  actorUserId: string
  disabled?: boolean
  onChangeRole: (user: AdminUserItem) => void
  onBan: (user: AdminUserItem) => void
  onUnban: (user: AdminUserItem) => void
}

export function createAdminUsersColumns({
  t,
  locale,
  actorUserId,
  disabled,
  onChangeRole,
  onBan,
  onUnban,
}: CreateAdminUsersColumnsOptions): ListColumn<AdminUserItem>[] {
  return [
    {
      id: "user",
      header: t("columns.user"),
      cellClassName: "min-w-0",
      cell: (row) => (
        <Identity>
          <IdentityAvatar src={row.image} name={row.name} />
          <IdentityContent>
            <IdentityTitle>{row.name}</IdentityTitle>
            <IdentityDescription>{row.email}</IdentityDescription>
          </IdentityContent>
        </Identity>
      ),
    },
    {
      id: "role",
      header: t("columns.role"),
      headerClassName: "whitespace-nowrap",
      cellClassName: "whitespace-nowrap",
      cell: (row) => <PlatformRoleBadge role={row.role} />,
    },
    {
      id: "status",
      header: t("columns.status"),
      headerClassName: "whitespace-nowrap",
      cellClassName: "whitespace-nowrap",
      cell: (row) => <UserAccountStatusBadge banned={row.banned} />,
    },
    {
      id: "joined",
      header: t("columns.joined"),
      headerClassName: "whitespace-nowrap text-muted-foreground",
      cellClassName: "whitespace-nowrap text-muted-foreground",
      cell: (row) => formatDate(row.createdAt, locale),
    },
    {
      id: "actions",
      header: <span className="sr-only">{t("columns.actions")}</span>,
      headerClassName: "w-full text-end",
      cellClassName: "w-full text-end",
      cell: (row) => (
        <AdminUserRowActionsMenu
          user={row}
          disabled={disabled}
          isSelf={row.id === actorUserId}
          onChangeRole={() => onChangeRole(row)}
          onBan={() => onBan(row)}
          onUnban={() => onUnban(row)}
        />
      ),
    },
  ]
}
