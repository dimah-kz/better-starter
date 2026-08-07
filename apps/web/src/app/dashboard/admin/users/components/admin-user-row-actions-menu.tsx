"use client"

import {
  BanIcon,
  MoreHorizontalIcon,
  ShieldIcon,
  ShieldOffIcon,
} from "lucide-react"
import type { AdminUserItem } from "@/app/dashboard/admin/users/lib/get-admin-users-page"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { useTranslations } from "next-intl"

type AdminUserRowActionsMenuProps = {
  user: AdminUserItem
  disabled?: boolean
  isSelf: boolean
  onChangeRole: () => void
  onBan: () => void
  onUnban: () => void
}

export function AdminUserRowActionsMenu({
  user,
  disabled,
  isSelf,
  onChangeRole,
  onBan,
  onUnban,
}: AdminUserRowActionsMenuProps) {
  const t = useTranslations("dashboard.adminUserManage")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button size="icon-sm" variant="ghost" />}
        aria-label={`Actions for ${user.name}`}
      >
        <MoreHorizontalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuItem disabled={disabled} onClick={onChangeRole}>
          <ShieldIcon />
          {t("changeRole")}
        </DropdownMenuItem>
        {user.banned ? (
          <DropdownMenuItem disabled={disabled} onClick={onUnban}>
            <ShieldOffIcon />
            {t("unbanUser")}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            variant="destructive"
            disabled={disabled || isSelf}
            onClick={onBan}
          >
            <BanIcon />
            {t("banUser")}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
