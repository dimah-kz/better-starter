"use client"

import * as React from "react"
import { CreateOrganizationFormShell } from "@/app/dashboard/components/sidebar/create-organization-form-shell"
import type { SidebarOrganizationItem } from "@/app/dashboard/components/sidebar/organization-switcher"
import { useOrganizationSwitch } from "@/app/dashboard/components/sidebar/organization-switcher"
import { OrganizationAvatar } from "@/components/organization-avatar"
import { cn } from "@workspace/ui/lib/utils"
import { PlusIcon } from "lucide-react"
import { useTranslations } from "next-intl"

type DashboardOrganizationsCardProps = {
  organizations: SidebarOrganizationItem[]
  activeOrganizationId: string | null
}

export function DashboardOrganizationsCard({
  organizations,
  activeOrganizationId,
}: DashboardOrganizationsCardProps) {
  const tSwitcher = useTranslations("dashboard.nav.organizationSwitcher")
  const { isSwitching, switchOrganization } = useOrganizationSwitch()
  const [createOpen, setCreateOpen] = React.useState(false)

  const handleSelectOrganization = (organizationId: string) => {
    if (organizationId === activeOrganizationId || isSwitching) {
      return
    }

    switchOrganization(organizationId)
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {organizations.map((organization) => {
          const isActive = organization.id === activeOrganizationId

          return (
            <button
              key={organization.id}
              type="button"
              disabled={isSwitching}
              onClick={() => handleSelectOrganization(organization.id)}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "flex min-h-28 flex-col items-center justify-center gap-2.5 rounded-lg border bg-card p-4 text-center transition-colors hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60",
                isActive &&
                  "border-primary/40 bg-primary/8 ring-1 ring-primary/15"
              )}
            >
              <OrganizationAvatar
                name={organization.name}
                logo={organization.logo}
                className="size-10 rounded-lg after:rounded-lg **:data-[slot=avatar-fallback]:rounded-lg **:data-[slot=avatar-image]:rounded-lg"
              />
              <span className="line-clamp-2 w-full text-xs leading-snug font-medium">
                {organization.name}
              </span>
            </button>
          )
        })}
        <button
          type="button"
          disabled={isSwitching}
          onClick={() => setCreateOpen(true)}
          className="flex min-h-28 flex-col items-center justify-center gap-2.5 rounded-lg border border-dashed p-4 text-center text-muted-foreground transition-colors hover:border-foreground/20 hover:bg-accent/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60"
        >
          <div className="flex size-10 items-center justify-center rounded-lg border bg-background">
            <PlusIcon className="size-5" aria-hidden />
          </div>
          <span className="text-xs font-medium">
            {tSwitcher("createOrganization")}
          </span>
        </button>
      </div>

      <CreateOrganizationFormShell
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </>
  )
}
