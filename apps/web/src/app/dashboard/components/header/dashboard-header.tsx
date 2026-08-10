import { DashboardBreadcrumbs } from "@/app/dashboard/components/header/dashboard-breadcrumbs"
import { Separator } from "@repo/ui/components/separator"
import { SidebarTrigger } from "@repo/ui/components/sidebar"

export function DashboardHeader() {
  return (
    <header className="mt-2 flex h-12 shrink-0 items-center gap-2 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <SidebarTrigger className="-ms-1" />
      <Separator
        orientation="vertical"
        className="me-2 data-vertical:h-4 data-vertical:self-auto"
      />
      <DashboardBreadcrumbs />
    </header>
  )
}
