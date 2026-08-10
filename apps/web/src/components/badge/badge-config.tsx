"use client"

import { CrownIcon, ShieldAlertIcon, ShieldIcon, UserIcon } from "lucide-react"
import {
  type LabeledBadgeConfig,
  type LabeledBadgeVariant,
} from "@/components/badge/labeled-badge"
import {
  adminPluginRoles,
  type PlatformRole,
} from "@repo/auth/admin-access"
import {
  orgRoles,
  type MembershipRole,
} from "@repo/auth/organization-access"
import { useTranslations } from "next-intl"
import type { ReactElement } from "react"

function item(
  label: string,
  variant: LabeledBadgeVariant,
  icon: ReactElement,
  className?: string
): LabeledBadgeConfig {
  return { label, variant, icon, className }
}

const userAccountStatuses = ["active", "banned"] as const

type UserAccountStatus = (typeof userAccountStatuses)[number]

const activeBadgeClassName =
  "border-transparent bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"

const platformRoleVariants: Record<PlatformRole, LabeledBadgeVariant> = {
  user: "outline",
  admin: "default",
}

const membershipRoleVariants: Record<MembershipRole, LabeledBadgeVariant> = {
  owner: "default",
  admin: "secondary",
  member: "outline",
}

const userAccountStatusVariants: Record<
  UserAccountStatus,
  LabeledBadgeVariant
> = {
  active: "outline",
  banned: "destructive",
}

const userAccountStatusClassNames: Partial<Record<UserAccountStatus, string>> =
  {
    active: activeBadgeClassName,
  }

function platformRoleIcon(role: PlatformRole) {
  return role === "admin" ? (
    <ShieldIcon data-icon="inline-start" />
  ) : (
    <UserIcon data-icon="inline-start" />
  )
}

function membershipRoleIcon(role: MembershipRole) {
  if (role === "owner") {
    return <CrownIcon data-icon="inline-start" />
  }

  if (role === "admin") {
    return <ShieldIcon data-icon="inline-start" />
  }

  return <UserIcon data-icon="inline-start" />
}

function userAccountStatusIcon(status: UserAccountStatus) {
  return status === "banned" ? (
    <ShieldAlertIcon data-icon="inline-start" />
  ) : (
    <UserIcon data-icon="inline-start" />
  )
}

function isPlatformRole(value: string): value is PlatformRole {
  return value in adminPluginRoles
}

function isMembershipRole(value: string): value is MembershipRole {
  return value in orgRoles
}

function isUserAccountStatus(value: string): value is UserAccountStatus {
  return (userAccountStatuses as readonly string[]).includes(value)
}

export function usePlatformRoleBadgeConfig(role: string): LabeledBadgeConfig {
  const t = useTranslations("badges")
  const normalizedValue = role.trim()

  if (isPlatformRole(normalizedValue)) {
    return item(
      t(`platformRole.${normalizedValue}`),
      platformRoleVariants[normalizedValue],
      platformRoleIcon(normalizedValue)
    )
  }

  return {
    label: normalizedValue || t("fallback"),
    variant: "outline",
    icon: <UserIcon data-icon="inline-start" />,
  }
}

export function useMembershipRoleBadgeConfig(role: string): LabeledBadgeConfig {
  const t = useTranslations("badges")
  const normalizedValue = role.trim()

  if (isMembershipRole(normalizedValue)) {
    return item(
      t(`membershipRole.${normalizedValue}`),
      membershipRoleVariants[normalizedValue],
      membershipRoleIcon(normalizedValue)
    )
  }

  return {
    label: normalizedValue || t("fallback"),
    variant: "outline",
    icon: <UserIcon data-icon="inline-start" />,
  }
}

export function useUserAccountStatusBadgeConfig(
  status: UserAccountStatus
): LabeledBadgeConfig {
  const t = useTranslations("badges")

  return item(
    t(`userAccountStatus.${status}`),
    userAccountStatusVariants[status],
    userAccountStatusIcon(status),
    userAccountStatusClassNames[status]
  )
}
