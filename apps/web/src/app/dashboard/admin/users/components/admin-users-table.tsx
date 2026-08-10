"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useTable } from "@tanstack/react-table"
import { banUserAction } from "@/app/action/dashboard/admin/users/ban-user-action"
import { unbanUserAction } from "@/app/action/dashboard/admin/users/unban-user-action"
import { createAdminUsersColumns } from "@/app/dashboard/admin/users/components/admin-users-columns"
import type { AdminUserItem } from "@/app/dashboard/admin/users/lib/get-admin-users-page"
import {
  adminUsersTablePath,
  type AdminUserTableFilter,
} from "@/app/dashboard/admin/users/lib/admin-users-table-params"
import { ListPagination, ListSearch, useList } from "@/components/list"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/ui/components/alert-dialog"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card"
import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures,
} from "@repo/ui/components/reui/data-grid/data-grid"
import { DataGridTable } from "@repo/ui/components/reui/data-grid/data-grid-table"
import { ToggleGroup, ToggleGroupItem } from "@repo/ui/components/toggle-group"
import type { Locale } from "@repo/i18n"
import { toast } from "@repo/ui/components/toast"
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
  const locale = useLocale() as Locale
  const t = useTranslations()
  const tTables = useTranslations("tables")
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
  })

  const filterOptions = (["all", "admins", "users", "banned"] as const).map(
    (value) => ({
      value,
      label: t(`tables.filters.${value}`),
    })
  )

  const columns = useMemo(
    () =>
      createAdminUsersColumns({
        t: tTables,
        locale,
        actorUserId,
        disabled: isPending,
        onChangeRole,
        onBan: setBanTarget,
        onUnban: (user) => {
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
        },
      }),
    [actorUserId, isPending, locale, onChangeRole, router, tTables]
  )

  const table = useTable({
    features: dataGridFeatures,
    data: users,
    columns,
    getRowId: (row) => row.id,
    manualPagination: true,
    rowCount: totalCount,
  })

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

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{t("dashboard.adminTabs.users")}</CardTitle>
          <CardAction className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <ListSearch
              value={q}
              placeholder={tTables("search.users")}
              onCommit={list.setQuery}
            />
            <ToggleGroup
              value={[filter]}
              onValueChange={(next) => {
                const selected = next[0]
                if (selected) {
                  list.setFilter(selected as AdminUserTableFilter)
                }
              }}
              size="sm"
              className="shrink-0"
            >
              {filterOptions.map((option) => (
                <ToggleGroupItem key={option.value} value={option.value}>
                  {option.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </CardAction>
        </CardHeader>
        <CardContent className="min-w-0">
          <DataGrid
            table={table}
            recordCount={totalCount}
            emptyMessage={tTables("empty.users")}
            className="min-w-0"
            tableLayout={{
              width: "fixed",
              headerBackground: true,
              rowBorder: true,
            }}
          >
            <DataGridContainer>
              <DataGridTable />
            </DataGridContainer>
          </DataGrid>
        </CardContent>
        <CardFooter className="justify-between gap-2">
          {totalCount > 0 ? <ListPagination {...list.pagination} /> : null}
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
