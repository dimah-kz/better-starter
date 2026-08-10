"use client"

import type { Locale } from "@repo/i18n"
import type { OrganizationMemberItem } from "@/app/dashboard/(organization)/manage/members/lib/get-organization-members-page"
import { MemberRowActionsMenu } from "@/app/dashboard/(organization)/manage/members/components/member-row-actions-menu"
import { memberRoleOptions } from "@/app/dashboard/(organization)/manage/lib/member-role-options"
import { MembershipRoleBadge } from "@/components/badge/membership-role-badge"
import { createDataGridColumnHelper } from "@/components/data-grid"
import { UserProfileCell } from "@/components/user-profile-cell"
import { formatDate } from "@/lib/format-date"
import { roleStringHas } from "@/lib/role-string"

const columnHelper = createDataGridColumnHelper<OrganizationMemberItem>()

function canChangeMemberRole(
  actorRole: string | null,
  memberRole: string
): boolean {
  if (!memberRoleOptions(actorRole).length) return false
  if (
    roleStringHas(memberRole, "owner") &&
    !roleStringHas(actorRole ?? "", "owner")
  ) {
    return false
  }
  return true
}

type TablesTranslator = {
  (key: "columns.user"): string
  (key: "columns.role"): string
  (key: "columns.joined"): string
  (key: "columns.actions"): string
}

type CreateMembersColumnsOptions = {
  t: TablesTranslator
  locale: Locale
  actorUserId: string
  actorRole: string | null
  disabled?: boolean
  onChangeRole: (member: OrganizationMemberItem) => void
  onRemove: (member: OrganizationMemberItem) => void
}

export function createMembersColumns({
  t,
  locale,
  actorUserId,
  actorRole,
  disabled,
  onChangeRole,
  onRemove,
}: CreateMembersColumnsOptions) {
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
      cell: ({ row }) => <MembershipRoleBadge role={row.original.role} />,
      enableSorting: false,
    }),
    columnHelper.accessor("joinedAt", {
      id: "joined",
      header: t("columns.joined"),
      meta: {
        headerTitle: t("columns.joined"),
        headerClassName: "hidden w-28 lg:table-cell",
        cellClassName: "hidden w-28 lg:table-cell",
      },
      cell: ({ row }) => formatDate(row.original.joinedAt, locale),
      enableSorting: false,
    }),
    columnHelper.display({
      id: "actions",
      header: () => <span className="sr-only">{t("columns.actions")}</span>,
      meta: {
        headerTitle: t("columns.actions"),
        headerClassName: "w-full text-end",
        cellClassName: "w-full text-end",
      },
      cell: ({ row }) => (
        <MemberRowActionsMenu
          member={row.original}
          disabled={disabled}
          canRemove={row.original.userId !== actorUserId}
          canChangeRole={canChangeMemberRole(actorRole, row.original.role)}
          onChangeRole={() => onChangeRole(row.original)}
          onRemove={() => onRemove(row.original)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }),
  ])
}
