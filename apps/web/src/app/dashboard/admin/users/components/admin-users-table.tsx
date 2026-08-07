"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { banUserAction } from "@/app/action/dashboard/admin/users/ban-user-action"
import { unbanUserAction } from "@/app/action/dashboard/admin/users/unban-user-action"
import { AdminUserRowActionsMenu } from "@/app/dashboard/admin/users/components/admin-user-row-actions-menu"
import type { AdminUserItem } from "@/app/dashboard/admin/users/lib/get-admin-users-page"
import {
  adminUsersTablePath,
  type AdminUserTableFilter,
} from "@/app/dashboard/admin/users/lib/admin-users-table-params"
import { PlatformRoleBadge } from "@/components/badge/platform-role-badge"
import { UserAccountStatusBadge } from "@/components/badge/user-account-status-badge"
import { List, useList } from "@/components/list"
import { UserProfileCell } from "@/components/user-profile-cell"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { formatDate } from "@/lib/format-date"
import { toast } from "@workspace/ui/components/toast"
import { useLocale, useTranslations } from "next-intl"

type AdminUsersTableProps = {
  users: AdminUserItem[]
  page: number
  pageSize: number
  totalCount: number
  filter: AdminUserTableFilter
  q?: string
  actorUserId: string
  onChangeRole: (user: AdminUserItem) => void
}

export function AdminUsersTable({
  users,
  page,
  pageSize,
  totalCount,
  filter,
  q,
  actorUserId,
  onChangeRole,
}: AdminUsersTableProps) {
  const locale = useLocale()
  const t = useTranslations()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [banTarget, setBanTarget] = useState<AdminUserItem | null>(null)

  const list = useList({
    buildPath: adminUsersTablePath,
    page,
    pageSize,
    totalCount,
    filter,
    q,
    countLabel: "user",
  })

  const filterOptions = (["all", "admins", "users", "banned"] as const).map(
    (value) => ({
      value,
      label: t(`tables.filters.${value}`),
    })
  )

  const handleBan = () => {
    if (!banTarget) return
    startTransition(async () => {
      const result = await banUserAction({ userId: banTarget.id })
      if (!result.success) {
        toast.add({
          title: result.error ?? "Could not ban the user.",
          type: "error",
        })
        return
      }
      setBanTarget(null)
      toast.add({ title: "User banned.", type: "success" })
      router.refresh()
    })
  }

  const handleUnban = (user: AdminUserItem) => {
    startTransition(async () => {
      const result = await unbanUserAction({ userId: user.id })
      if (!result.success) {
        toast.add({
          title: result.error ?? "Could not unban the user.",
          type: "error",
        })
        return
      }
      toast.add({ title: "User unbanned.", type: "success" })
      router.refresh()
    })
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{t("dashboard.adminTabs.users")}</CardTitle>
          <CardAction className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <List.Search
              value={q}
              placeholder={t("tables.search.users")}
              buildPath={list.buildSearchPath}
            />
            <List.Filter
              value={filter}
              options={filterOptions}
              onValueChange={list.setFilter}
            />
          </CardAction>
        </CardHeader>

        <CardContent className="min-w-0">
          <Table className="table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-0 whitespace-normal">
                  User
                </TableHead>
                <TableHead className="w-28 whitespace-normal sm:w-32">
                  Role
                </TableHead>
                <TableHead className="hidden w-24 whitespace-normal sm:table-cell">
                  Status
                </TableHead>
                <TableHead className="hidden w-28 whitespace-normal lg:table-cell">
                  Joined
                </TableHead>
                <TableHead className="w-12 whitespace-normal">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="min-w-0 whitespace-normal">
                      <UserProfileCell
                        variant="inline"
                        user={{
                          name: user.name,
                          email: user.email,
                          image: user.image,
                        }}
                      />
                    </TableCell>
                    <TableCell className="whitespace-normal">
                      <PlatformRoleBadge role={user.role} />
                    </TableCell>
                    <TableCell className="hidden whitespace-normal sm:table-cell">
                      <UserAccountStatusBadge banned={user.banned} />
                    </TableCell>
                    <TableCell className="hidden whitespace-normal lg:table-cell">
                      {formatDate(user.createdAt, locale)}
                    </TableCell>
                    <TableCell className="w-12 whitespace-normal">
                      <AdminUserRowActionsMenu
                        user={user}
                        disabled={isPending}
                        isSelf={user.id === actorUserId}
                        onChangeRole={() => onChangeRole(user)}
                        onBan={() => setBanTarget(user)}
                        onUnban={() => handleUnban(user)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <List.Empty colSpan={5}>No users found.</List.Empty>
              )}
            </TableBody>
          </Table>
        </CardContent>

        <CardFooter className="justify-between gap-2">
          <List.Footer pagination={list.pagination} />
        </CardFooter>
      </Card>

      <AlertDialog
        open={Boolean(banTarget)}
        onOpenChange={(open) => {
          if (!open) setBanTarget(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("dashboard.adminUserManage.banTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {banTarget
                ? `${banTarget.name} — ${t("dashboard.adminUserManage.banDescription")}`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isPending}
              onClick={handleBan}
            >
              {t("dashboard.adminUserManage.banConfirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
