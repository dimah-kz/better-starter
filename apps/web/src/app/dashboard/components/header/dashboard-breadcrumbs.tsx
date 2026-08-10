"use client"

import Link from "next/link"
import { Fragment } from "react"
import { usePathname } from "next/navigation"
import { HomeIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  dashboardBreadcrumbSegments,
  dashboardRouteSegments,
} from "@/app/dashboard/lib/dashboard-routes"
import { normalizePathname } from "@/app/dashboard/lib/path-utils"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui/components/breadcrumb"

type BreadcrumbSegmentKey =
  | "dashboard"
  | (typeof dashboardRouteSegments)[keyof typeof dashboardRouteSegments]

export function DashboardBreadcrumbs() {
  const pathname = usePathname()
  const t = useTranslations("dashboard.breadcrumbSegments")
  const parts = normalizePathname(pathname).split("/").filter(Boolean)

  const trail =
    parts.length <= 1
      ? [{ label: t("dashboard"), isHome: true, href: undefined }]
      : parts.flatMap((segment, index) => {
          if (!dashboardBreadcrumbSegments.has(segment)) {
            return []
          }

          return [
            {
              label: t(segment as BreadcrumbSegmentKey),
              isHome: segment === "dashboard",
              href:
                index < parts.length - 1
                  ? `/${parts.slice(0, index + 1).join("/")}`
                  : undefined,
            },
          ]
        })

  return (
    <Breadcrumb className="min-w-0 flex-1">
      <BreadcrumbList className="flex-nowrap sm:gap-2.5">
        {trail.map((crumb, index) => {
          const label = crumb.isHome ? (
            <>
              <HomeIcon aria-hidden className="size-3.5 shrink-0" />
              <span className="sr-only">{crumb.label}</span>
            </>
          ) : (
            crumb.label
          )

          return (
            <Fragment key={`${crumb.label}-${index}`}>
              {index > 0 ? <BreadcrumbSeparator /> : null}
              <BreadcrumbItem className="min-w-0">
                {crumb.href ? (
                  <BreadcrumbLink
                    className={crumb.isHome ? undefined : "truncate"}
                    render={<Link href={crumb.href} />}
                  >
                    {label}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage
                    className={crumb.isHome ? undefined : "truncate"}
                  >
                    {label}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
