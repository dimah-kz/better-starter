import { DashboardPageShell } from "@/app/dashboard/components/layout/dashboard-page-shell"

type AccountLayoutProps = {
  children: React.ReactNode
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  return <DashboardPageShell>{children}</DashboardPageShell>
}
