"use client"

import Link from "next/link"
import { useState } from "react"
import { ChevronLeftIcon } from "lucide-react"
import { AccountSettingsPanel } from "@/app/dashboard/account/components/account-settings-panel"
import { AccountSettingsNavItem } from "@/app/dashboard/account/components/account-settings-nav-item"
import type { AccountSessionDisplay } from "@/app/dashboard/account/components/account-sessions-content"
import type { AccountSecurityPanel } from "@/app/dashboard/account/lib/account-panel"
import { accountSecurityItems } from "@/app/dashboard/account/lib/account-settings-items"
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes"
import { Button } from "@repo/ui/components/button"
import { ItemGroup } from "@repo/ui/components/item"
import { useTranslations } from "next-intl"

type AccountSecurityHubProps = {
  hasPasswordCredential: boolean
  sessions: AccountSessionDisplay[]
  currentSessionToken: string
}

export function AccountSecurityHub({
  hasPasswordCredential,
  sessions,
  currentSessionToken,
}: AccountSecurityHubProps) {
  const t = useTranslations("dashboard")
  const [openSection, setOpenSection] = useState<AccountSecurityPanel | null>(
    null
  )

  return (
    <>
      <div className="flex w-full max-w-xl flex-col gap-4">
        <div className="flex flex-col gap-3">
          <div>
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<Link href={dashboardRoutes.account()} />}
            >
              <ChevronLeftIcon
                data-icon="inline-start"
                className="rtl:rotate-180"
              />
              {t("accountSettings.back")}
            </Button>
          </div>
          <h1 className="text-base font-medium tracking-tight">
            {t("accountSettings.security")}
          </h1>
        </div>

        <ItemGroup className="gap-2" role="list">
          {accountSecurityItems.map((item) => (
            <AccountSettingsNavItem
              key={item.key}
              title={t(item.labelKey)}
              description={t(item.descriptionKey)}
              icon={item.icon}
              onClick={() => setOpenSection(item.key)}
            />
          ))}
        </ItemGroup>
      </div>

      <AccountSettingsPanel
        section={openSection}
        onClose={() => setOpenSection(null)}
        hasPasswordCredential={hasPasswordCredential}
        sessions={sessions}
        currentSessionToken={currentSessionToken}
      />
    </>
  )
}
