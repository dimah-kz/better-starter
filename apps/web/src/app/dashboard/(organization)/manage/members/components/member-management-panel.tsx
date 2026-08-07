"use client"

import { useState } from "react"
import { MemberRoleFormShell } from "@/app/dashboard/(organization)/manage/members/components/member-role-form-shell"
import { MembersTable } from "@/app/dashboard/(organization)/manage/members/components/members-table"
import type { OrganizationMemberItem } from "@/app/dashboard/(organization)/manage/members/lib/get-organization-members-page"
import type { MemberTableFilter } from "@/app/dashboard/(organization)/manage/members/lib/members-table-params"

type MemberManagementPanelProps = {
  organizationId: string
  members: OrganizationMemberItem[]
  page: number
  pageSize: number
  totalCount: number
  filter: MemberTableFilter
  q?: string
  actorUserId: string
  actorRole: string | null
}

export function MemberManagementPanel({
  organizationId,
  members,
  page,
  pageSize,
  totalCount,
  filter,
  q,
  actorUserId,
  actorRole,
}: MemberManagementPanelProps) {
  const [roleMember, setRoleMember] = useState<OrganizationMemberItem | null>(
    null
  )

  return (
    <div className="space-y-4">
      <MembersTable
        organizationId={organizationId}
        members={members}
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        filter={filter}
        q={q}
        actorUserId={actorUserId}
        actorRole={actorRole}
        onChangeRole={setRoleMember}
      />

      <MemberRoleFormShell
        organizationId={organizationId}
        member={roleMember}
        actorRole={actorRole}
        open={Boolean(roleMember)}
        onClose={() => setRoleMember(null)}
      />
    </div>
  )
}
