"use client"

import type { Locale } from "@repo/i18n"
import type { AdminUserItem } from "@/app/dashboard/admin/users/lib/get-admin-users-page"
import { AdminUserRowActionsMenu } from "@/app/dashboard/admin/users/components/admin-user-row-actions-menu"
import { PlatformRoleBadge } from "@/components/badge/platform-role-badge"
import { UserAccountStatusBadge } from "@/components/badge/user-account-status-badge"
import { createDataGridColumnHelper } from "@/components/data-grid"
import { UserProfileCell } from "@/components/user-profile-cell"
import { formatDate } from "@/lib/format-date"

const columnHelper = createDataGridColumnHelper<AdminUserItem>()

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
}: CreateAdminUsersColumnsOptions) {
  return columnHelper.columns([
    columnHelper.accessor("name", {
      id: "user",
      header: t("columns.user"),
      meta: {
        headerTitle: t("columns.user"),
        cellClassName: "min-w-0",
      },
      cell: ({ row }) => (
        <UserProfileCell
          variant="inline"
          user={{
            name: row.original.name,
            email: row.original.email,
            image: row.original.image,
          }}
        />
      ),
      enableSorting: false,
    }),
    columnHelper.accessor("role", {
      header: t("columns.role"),
      meta: {
        headerTitle: t("columns.role"),
        headerClassName: "w-28 sm:w-32",
        cellClassName: "w-28 sm:w-32",
      },
      cell: ({ row }) => <PlatformRoleBadge role={row.original.role} />,
      enableSorting: false,
    }),
    columnHelper.accessor("banned", {
      id: "status",
      header: t("columns.status"),
      meta: {
        headerTitle: t("columns.status"),
        headerClassName: "hidden w-24 sm:table-cell",
        cellClassName: "hidden w-24 sm:table-cell",
      },
      cell: ({ row }) => (
        <UserAccountStatusBadge banned={row.original.banned} />
      ),
      enableSorting: false,
    }),
    columnHelper.accessor("createdAt", {
      id: "joined",
      header: t("columns.joined"),
      meta: {
        headerTitle: t("columns.joined"),
        headerClassName: "hidden w-28 lg:table-cell",
        cellClassName: "hidden w-28 lg:table-cell",
      },
      cell: ({ row }) => formatDate(row.original.createdAt, locale),
      enableSorting: false,
    }),
    columnHelper.display({
      id: "actions",
      header: () => <span className="sr-only">{t("columns.actions")}</span>,
      meta: {
        headerTitle: t("columns.actions"),
        headerClassName: "w-12",
        cellClassName: "w-12",
      },
      cell: ({ row }) => (
        <AdminUserRowActionsMenu
          user={row.original}
          disabled={disabled}
          isSelf={row.original.id === actorUserId}
          onChangeRole={() => onChangeRole(row.original)}
          onBan={() => onBan(row.original)}
          onUnban={() => onUnban(row.original)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }),
  ])
}
