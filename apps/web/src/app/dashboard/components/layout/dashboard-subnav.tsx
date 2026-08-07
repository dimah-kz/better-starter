"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { resolveActiveTabKey } from "@/app/dashboard/lib/path-utils"
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"

export type DashboardSubnavItem = {
  key: string
  labelKey: Parameters<ReturnType<typeof useTranslations<"dashboard">>>[0]
  pathSuffix: string
  href: string
}

type DashboardSubnavProps = {
  tabs: readonly DashboardSubnavItem[]
  defaultTabKey: string
}

export function DashboardSubnav({ tabs, defaultTabKey }: DashboardSubnavProps) {
  const pathname = usePathname()
  const t = useTranslations("dashboard")
  const activeTab = resolveActiveTabKey(pathname, tabs, defaultTabKey)

  if (tabs.length < 2) {
    return null
  }

  return (
    <Tabs value={activeTab} onValueChange={() => undefined} className="gap-0">
      <TabsList variant="line">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.key}
            value={tab.key}
            nativeButton={false}
            render={<Link href={tab.href} />}
          >
            {t(tab.labelKey)}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
