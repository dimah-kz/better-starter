"use client"

import { formatDate } from "@/lib/format-date"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { removeOrganizationMemberAction } from "@/app/action/dashboard/(organization)/manage/members/remove-organization-member-action"
import { MemberRowActionsMenu } from "@/app/dashboard/(organization)/manage/members/components/member-row-actions-menu"
import { toast } from "@workspace/ui/components/toast"
import type { OrganizationMemberItem } from "@/app/dashboard/(organization)/manage/members/lib/get-organization-members-page"
import {
  organizationMembersTablePath,
  type MemberTableFilter,
} from "@/app/dashboard/(organization)/manage/members/lib/members-table-params"
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
import { List, useList } from "@/components/list"
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
import { MembershipRoleBadge } from "@/components/badge/membership-role-badge"
import { UserProfileCell } from "@/components/user-profile-cell"
import { memberRoleOptions } from "@/app/dashboard/(organization)/manage/lib/member-role-options"
import { roleStringHas } from "@/lib/role-string"
import { useLocale, useTranslations } from "next-intl"

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
  const locale = useLocale()
  const t = useTranslations()
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

  const handleRemove = () => {
    if (!removeTarget) return
    startTransition(async () => {
      const result = await removeOrganizationMemberAction({
        organizationId,
        memberId: removeTarget.id,
      })
      if (!result.success) {
        toast.add({ title: result.error ?? "Could not remove the member.", type: "error" })
        return
      }
      setRemoveTarget(null)
      toast.add({ title: "Member removed from the organization.", type: "success" })
      router.refresh()
    })
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{t("dashboard.manageTabs.members")}</CardTitle>
          <CardAction className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <List.Search
              value={q}
              placeholder={t("tables.search.users")}
              buildPath={list.buildSearchPath}
            />
            <List.Filter
              value={filter}
              options={memberFilterOptions}
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
                <TableHead className="hidden w-28 whitespace-normal lg:table-cell">
                  Joined
                </TableHead>
                <TableHead className="w-12 whitespace-normal">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.length ? (
                members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="min-w-0 whitespace-normal">
                      <UserProfileCell
                        variant="inline"
                        user={{
                          name: member.name,
                          email: member.email,
                          image: member.image,
                        }}
                      />
                    </TableCell>
                    <TableCell className="whitespace-normal">
                      <MembershipRoleBadge role={member.role} />
                    </TableCell>
                    <TableCell className="hidden whitespace-normal lg:table-cell">
                      {formatDate(member.joinedAt, locale)}
                    </TableCell>
                    <TableCell className="w-12 whitespace-normal">
                      <MemberRowActionsMenu
                        member={member}
                        disabled={isPending}
                        canRemove={member.userId !== actorUserId}
                        canChangeRole={canChangeMemberRole(
                          actorRole,
                          member.role
                        )}
                        onChangeRole={() => onChangeRole(member)}
                        onRemove={() => setRemoveTarget(member)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <List.Empty colSpan={4}>No members found.</List.Empty>
              )}
            </TableBody>
          </Table>
        </CardContent>

        <CardFooter className="justify-between gap-2">
          <List.Footer pagination={list.pagination} />
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
