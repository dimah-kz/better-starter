"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeftIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes"
import { isPathActive } from "@/app/dashboard/lib/path-utils"
import {
  resolveSidebarNavSection,
  type SidebarNavSection,
} from "@/app/dashboard/lib/sidebar-nav-sections"
import { cn } from "@repo/ui/lib/utils"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui/components/sidebar"

export type NavMainItem = {
  titleKey: Parameters<ReturnType<typeof useTranslations<"dashboard">>>[0]
  url: string
  icon?: React.ReactNode
}

export type NavMainGroup = {
  id: string
  labelKey?: Parameters<ReturnType<typeof useTranslations<"dashboard">>>[0]
  items: NavMainItem[]
}

function NavItemLink({
  item,
  pathname,
}: {
  item: NavMainItem
  pathname: string
}) {
  const t = useTranslations("dashboard")
  const title = t(item.titleKey)

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isPathActive(pathname, item.url, {
          exactMatchHref: dashboardRoutes.home(),
        })}
        render={<Link href={item.url} />}
        tooltip={title}
        className="[&>svg]:opacity-55"
      >
        {item.icon}
        <span>{title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function NavBackItem({ title, backUrl }: { title: string; backUrl: string }) {
  return (
    <SidebarMenuItem className="mb-4">
      <SidebarMenuButton
        render={<Link href={backUrl} />}
        tooltip={title}
        className="relative justify-center [&>svg]:absolute [&>svg]:inset-s-2 [&>svg]:z-10 [&>svg]:opacity-55"
      >
        <ChevronLeftIcon className="rtl:rotate-180" />
        <span className="w-full truncate px-8 text-center">{title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function NavMain({
  groups,
  sections,
}: {
  groups: NavMainGroup[]
  sections: SidebarNavSection[]
}) {
  const pathname = usePathname()
  const activeSection = resolveSidebarNavSection(pathname, sections)
  const viewKey = activeSection?.id ?? "root"
  const t = useTranslations("dashboard")
  const navViewClass = cn(
    "animate-in duration-200 ease-out fade-in-0 fill-mode-both",
    activeSection ? "slide-in-from-start-2" : "slide-in-from-end-2"
  )

  return (
    <div key={viewKey} className={navViewClass}>
      {activeSection ? (
        <SidebarGroup>
          <SidebarMenu>
            <NavBackItem
              title={t(activeSection.titleKey)}
              backUrl={activeSection.backUrl}
            />
            {activeSection.items.map((item) => (
              <NavItemLink
                key={`${activeSection.id}-${item.url}`}
                item={item}
                pathname={pathname}
              />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ) : (
        groups.map((group) => (
          <SidebarGroup
            key={group.id}
            className={group.labelKey ? "pt-3" : undefined}
          >
            {group.labelKey ? (
              <SidebarGroupLabel className="h-6">
                {t(group.labelKey)}
              </SidebarGroupLabel>
            ) : null}
            <SidebarMenu className={group.labelKey ? "-mt-0.5" : undefined}>
              {group.items.map((item) => (
                <NavItemLink
                  key={`${group.id}-${item.url}`}
                  item={item}
                  pathname={pathname}
                />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))
      )}
    </div>
  )
}
