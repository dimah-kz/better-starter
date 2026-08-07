"use client"

import { MoreHorizontalIcon, ShieldIcon, Trash2Icon } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import type { OrganizationMemberItem } from "@/app/dashboard/(organization)/manage/members/lib/get-organization-members-page"
import { useTranslations } from "next-intl"

type MemberRowActionsMenuProps = {
  member: OrganizationMemberItem
  disabled?: boolean
  canRemove: boolean
  canChangeRole: boolean
  onChangeRole: () => void
  onRemove: () => void
}

export function MemberRowActionsMenu({
  member,
  disabled,
  canRemove,
  canChangeRole,
  onChangeRole,
  onRemove,
}: MemberRowActionsMenuProps) {
  const t = useTranslations("dashboard.memberManage")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button size="icon-sm" variant="ghost" />}
        aria-label={`Actions for ${member.name}`}
      >
        <MoreHorizontalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuItem
          disabled={disabled || !canChangeRole}
          onClick={onChangeRole}
        >
          <ShieldIcon />
          {t("changeRole")}
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          disabled={disabled || !canRemove}
          onClick={onRemove}
        >
          <Trash2Icon />
          {t("removeFromOrganization")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
