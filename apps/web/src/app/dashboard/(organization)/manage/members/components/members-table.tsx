"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { removeOrganizationMemberAction } from "@/app/action/dashboard/(organization)/manage/members/remove-organization-member-action"
import { createMembersColumns } from "@/app/dashboard/(organization)/manage/members/components/members-columns"
import type { OrganizationMemberItem } from "@/app/dashboard/(organization)/manage/members/lib/get-organization-members-page"
import {
  organizationMembersTablePath,
  type MemberTableFilter,
} from "@/app/dashboard/(organization)/manage/members/lib/members-table-params"
import { DataTable, DataTableCard } from "@/components/data-table"
import { List, useList } from "@/components/list"
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
      <DataTableCard
        title={t("dashboard.manageTabs.members")}
        toolbar={
          <>
            <List.Search
              value={q}
              placeholder={tTables("search.users")}
              buildPath={list.buildSearchPath}
            />
            <List.Filter
              value={filter}
              options={memberFilterOptions}
              onValueChange={list.setFilter}
            />
          </>
        }
        footer={<List.Footer pagination={list.pagination} />}
      >
        <DataTable
          variant="plain"
          columns={columns}
          data={members}
          getRowId={(row) => row.id}
          manualPagination
          rowCount={totalCount}
          emptyMessage={tTables("empty.members")}
        />
      </DataTableCard>

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
