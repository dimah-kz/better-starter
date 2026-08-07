"use client"

import { useState } from "react"
import { AdminUsersTable } from "@/app/dashboard/admin/users/components/admin-users-table"
import { UserPlatformRoleFormShell } from "@/app/dashboard/admin/users/components/user-platform-role-form-shell"
import type { AdminUserItem } from "@/app/dashboard/admin/users/lib/get-admin-users-page"
import type { AdminUserTableFilter } from "@/app/dashboard/admin/users/lib/admin-users-table-params"

type AdminUserManagementPanelProps = {
  users: AdminUserItem[]
  page: number
  pageSize: number
  totalCount: number
  filter: AdminUserTableFilter
  q?: string
  actorUserId: string
}

export function AdminUserManagementPanel({
  users,
  page,
  pageSize,
  totalCount,
  filter,
  q,
  actorUserId,
}: AdminUserManagementPanelProps) {
  const [roleUser, setRoleUser] = useState<AdminUserItem | null>(null)

  return (
    <div className="space-y-4">
      <AdminUsersTable
        users={users}
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        filter={filter}
        q={q}
        actorUserId={actorUserId}
        onChangeRole={setRoleUser}
      />

      <UserPlatformRoleFormShell
        user={roleUser}
        open={Boolean(roleUser)}
        onClose={() => setRoleUser(null)}
      />
    </div>
  )
}
