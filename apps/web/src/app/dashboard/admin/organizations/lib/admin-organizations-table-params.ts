import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes"
import { listPath, type ListSearchParamsInput } from "@/components/list"

export const ADMIN_ORGANIZATIONS_DEFAULT_PAGE_SIZE = 20

export function adminOrganizationsTablePath(
  input: ListSearchParamsInput = {}
): string {
  return listPath(
    dashboardRoutes.adminOrganizations(),
    {
      page: input.page,
      pageSize: input.pageSize,
      q: input.q,
    },
    { defaultPageSize: ADMIN_ORGANIZATIONS_DEFAULT_PAGE_SIZE }
  )
}
