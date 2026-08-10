"use client"

import { CrownIcon, ShieldAlertIcon, ShieldIcon, UserIcon } from "lucide-react"
import {
  type LabeledBadgeConfig,
  type LabeledBadgeVariant,
} from "@/components/badge/labeled-badge"
import { adminPluginRoles, type PlatformRole } from "@repo/auth/admin-access"
import { orgRoles, type MembershipRole } from "@repo/auth/organization-access"
import { useTranslations } from "next-intl"
import type { ReactElement } from "react"

function item(
  label: string,
  variant: LabeledBadgeVariant,
  icon: ReactElement
): LabeledBadgeConfig {
  return { label, variant, icon }
}

const userAccountStatuses = ["active", "banned"] as const

type UserAccountStatus = (typeof userAccountStatuses)[number]

const platformRoleVariants: Record<PlatformRole, LabeledBadgeVariant> = {
  user: "outline",
  admin: "primary-light",
}

const membershipRoleVariants: Record<MembershipRole, LabeledBadgeVariant> = {
  owner: "primary-light",
  admin: "secondary",
  member: "outline",
}

const userAccountStatusVariants: Record<
  UserAccountStatus,
  LabeledBadgeVariant
> = {
  active: "success-light",
  banned: "destructive-light",
}

function platformRoleIcon(role: PlatformRole) {
  return role === "admin" ? <ShieldIcon /> : <UserIcon />
}

function membershipRoleIcon(role: MembershipRole) {
  if (role === "owner") return <CrownIcon />
  if (role === "admin") return <ShieldIcon />
  return <UserIcon />
}

function userAccountStatusIcon(status: UserAccountStatus) {
  return status === "banned" ? <ShieldAlertIcon /> : <UserIcon />
}

function isPlatformRole(value: string): value is PlatformRole {
  return value in adminPluginRoles
}

function isMembershipRole(value: string): value is MembershipRole {
  return value in orgRoles
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
    icon: <UserIcon />,
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
    icon: <UserIcon />,
  }
}

export function useUserAccountStatusBadgeConfig(
  status: UserAccountStatus
): LabeledBadgeConfig {
  const t = useTranslations("badges")

  return item(
    t(`userAccountStatus.${status}`),
    userAccountStatusVariants[status],
    userAccountStatusIcon(status)
  )
}
