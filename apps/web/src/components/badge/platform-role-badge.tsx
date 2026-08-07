"use client"

import { usePlatformRoleBadgeConfig } from "@/components/badge/badge-config"
import { LabeledBadge } from "@/components/badge/labeled-badge"
import { parseRoleString } from "@/lib/role-string"

function PlatformRoleBadgeItem({ role }: { role: string }) {
  const config = usePlatformRoleBadgeConfig(role)
  return <LabeledBadge {...config} />
}

export function PlatformRoleBadge({ role }: { role: string }) {
  const tokens = parseRoleString(role)

  if (!tokens.length) {
    return <PlatformRoleBadgeItem role={role} />
  }

  return (
    <span className="flex flex-wrap gap-1">
      {tokens.map((token) => (
        <PlatformRoleBadgeItem key={token} role={token} />
      ))}
    </span>
  )
}
