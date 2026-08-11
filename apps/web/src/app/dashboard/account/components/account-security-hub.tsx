"use client"

import Link from "next/link"
import { Fragment, useState } from "react"
import { ChevronLeftIcon } from "lucide-react"
import { AccountSettingsPanel } from "@/app/dashboard/account/components/account-settings-panel"
import { AccountSettingsNavItem } from "@/app/dashboard/account/components/account-settings-nav-item"
import { AccountSettingsSection } from "@/app/dashboard/account/components/account-settings-section"
import type { AccountSessionDisplay } from "@/app/dashboard/account/components/account-sessions-content"
import type { AccountSecurityPanel } from "@/app/dashboard/account/lib/account-panel"
import { accountSecurityItems } from "@/app/dashboard/account/lib/account-settings-items"
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes"
import { Button } from "@repo/ui/components/button"
import { ItemSeparator } from "@repo/ui/components/item"
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
      <div className="flex w-full max-w-xl flex-col gap-6">
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

        <AccountSettingsSection label={t("accountSettings.sections.security")}>
          {accountSecurityItems.map((item, index) => (
            <Fragment key={item.key}>
              {index > 0 ? <ItemSeparator className="my-0" /> : null}
              <AccountSettingsNavItem
                title={t(item.labelKey)}
                description={t(item.descriptionKey)}
                icon={item.icon}
                onClick={() => setOpenSection(item.key)}
              />
            </Fragment>
          ))}
        </AccountSettingsSection>
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
