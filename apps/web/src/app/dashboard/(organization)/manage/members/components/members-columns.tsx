"use client"

import type { Locale } from "@repo/i18n"
import {
  Identity,
  IdentityAvatar,
  IdentityContent,
  IdentityDescription,
  IdentityTitle,
} from "@repo/ui/components/dimah/identity"
import type { OrganizationMemberItem } from "@/app/dashboard/(organization)/manage/members/lib/get-organization-members-page"
import { MemberRowActionsMenu } from "@/app/dashboard/(organization)/manage/members/components/member-row-actions-menu"
import { memberRoleOptions } from "@/app/dashboard/(organization)/manage/lib/member-role-options"
import { MembershipRoleBadge } from "@/components/badge/membership-role-badge"
import type { ListColumn } from "@/components/list"
import { formatDate } from "@/lib/format-date"
import { parseRoleString } from "@/lib/role-string"

function canChangeMemberRole(
  actorRole: string | null,
  memberRole: string
): boolean {
  if (!memberRoleOptions(actorRole).length) return false
  if (
    parseRoleString(memberRole).includes("owner") &&
    !parseRoleString(actorRole).includes("owner")
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
}: CreateMembersColumnsOptions): ListColumn<OrganizationMemberItem>[] {
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
      cell: (row) => <MembershipRoleBadge role={row.role} />,
    },
    {
      id: "joined",
      header: t("columns.joined"),
      headerClassName: "whitespace-nowrap text-muted-foreground",
      cellClassName: "whitespace-nowrap text-muted-foreground",
      cell: (row) => formatDate(row.joinedAt, locale),
    },
    {
      id: "actions",
      header: <span className="sr-only">{t("columns.actions")}</span>,
      headerClassName: "w-full text-end",
      cellClassName: "w-full text-end",
      cell: (row) => (
        <MemberRowActionsMenu
          member={row}
          disabled={disabled}
          canRemove={row.userId !== actorUserId}
          canChangeRole={canChangeMemberRole(actorRole, row.role)}
          onChangeRole={() => onChangeRole(row)}
          onRemove={() => onRemove(row)}
        />
      ),
    },
  ]
}
