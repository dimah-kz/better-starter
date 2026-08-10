"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useTable } from "@tanstack/react-table"
import { removeOrganizationMemberAction } from "@/app/action/dashboard/(organization)/manage/members/remove-organization-member-action"
import { createMembersColumns } from "@/app/dashboard/(organization)/manage/members/components/members-columns"
import type { OrganizationMemberItem } from "@/app/dashboard/(organization)/manage/members/lib/get-organization-members-page"
import {
  organizationMembersTablePath,
  type MemberTableFilter,
} from "@/app/dashboard/(organization)/manage/members/lib/members-table-params"
import { ListFooter, ListSearch, useList } from "@/components/list"
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
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@repo/ui/components/toggle-group"
import type { Locale } from "@repo/i18n"
import { toast } from "@repo/ui/components/toast"
import { useLocale, useTranslations } from "next-intl"

type MembersTableProps = {
  organizationId: string
  members: OrganizationMemberItem[]
  page: number
  pageSize: number
  totalCount: number
  filter: MemberTableFilter
  q?: string
  actorUserId: string
  actorRole: string | null
  onChangeRole: (member: OrganizationMemberItem) => void
}

export function MembersTable({
  organizationId,
  members,
  page,
  pageSize,
  totalCount,
  filter,
  q,
  actorUserId,
  actorRole,
  onChangeRole,
}: MembersTableProps) {
  const locale = useLocale() as Locale
  const t = useTranslations()
  const tTables = useTranslations("tables")
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [removeTarget, setRemoveTarget] =
    useState<OrganizationMemberItem | null>(null)

  const list = useList({
    buildPath: organizationMembersTablePath,
    page,
    pageSize,
    totalCount,
    filter,
    q,
    countLabel: "member",
  })

  const memberFilterOptions = (["all", "managers", "members"] as const).map(
    (value) => ({
      value,
      label: t(`tables.filters.${value}`),
    })
  )

  const columns = useMemo(
    () =>
      createMembersColumns({
        t: tTables,
        locale,
        actorUserId,
        actorRole,
        disabled: isPending,
        onChangeRole,
        onRemove: setRemoveTarget,
      }),
    [actorRole, actorUserId, isPending, locale, onChangeRole, tTables]
  )

  const table = useTable({
    features: dataGridFeatures,
    data: members,
    columns,
    getRowId: (row) => row.id,
    manualPagination: true,
    rowCount: totalCount,
  })

  const handleRemove = () => {
    if (!removeTarget) return
    startTransition(async () => {
      const result = await removeOrganizationMemberAction({
        organizationId,
        memberId: removeTarget.id,
      })
      if (!result.success) {
        toast.add({
          title: result.error ?? "Could not remove the member.",
          type: "error",
        })
        return
      }
      setRemoveTarget(null)
      toast.add({
        title: "Member removed from the organization.",
        type: "success",
      })
      router.refresh()
    })
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{t("dashboard.manageTabs.members")}</CardTitle>
          <CardAction className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <ListSearch
              value={q}
              placeholder={tTables("search.users")}
              buildPath={list.buildSearchPath}
            />
            <ToggleGroup
              value={[filter]}
              onValueChange={(next) => {
                const selected = next[0]
                if (selected) {
                  list.setFilter(selected as MemberTableFilter)
                }
              }}
              size="sm"
              className="shrink-0"
            >
              {memberFilterOptions.map((option) => (
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
            emptyMessage={tTables("empty.members")}
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
          <ListFooter pagination={list.pagination} />
        </CardFooter>
      </Card>

      <AlertDialog
        open={Boolean(removeTarget)}
        onOpenChange={(open) => {
          if (!open) setRemoveTarget(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from organization</AlertDialogTitle>
            <AlertDialogDescription>
              {removeTarget
                ? `${removeTarget.name} will lose organization membership and management access.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isPending}
              onClick={handleRemove}
            >
              Remove member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
