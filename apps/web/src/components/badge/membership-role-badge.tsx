"use client"

import { useMembershipRoleBadgeConfig } from "@/components/badge/badge-config"
import { LabeledBadge } from "@/components/badge/labeled-badge"
import { parseRoleString } from "@/lib/role-string"

function MembershipRoleBadgeItem({ role }: { role: string }) {
  const config = useMembershipRoleBadgeConfig(role)
  return <LabeledBadge {...config} />
}

export function MembershipRoleBadge({ role }: { role: string }) {
  const tokens = parseRoleString(role)

  if (!tokens.length) {
    return <MembershipRoleBadgeItem role={role} />
  }

  return (
    <span className="flex flex-wrap gap-1">
      {tokens.map((token) => (
        <MembershipRoleBadgeItem key={token} role={token} />
      ))}
    </span>
  )
}
