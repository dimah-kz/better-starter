"use client"

import { useUserAccountStatusBadgeConfig } from "@/components/badge/badge-config"
import { LabeledBadge } from "@/components/badge/labeled-badge"

export function UserAccountStatusBadge({ banned }: { banned: boolean }) {
  const config = useUserAccountStatusBadgeConfig(banned ? "banned" : "active")
  return <LabeledBadge {...config} />
}
