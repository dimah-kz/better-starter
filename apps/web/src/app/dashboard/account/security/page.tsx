import { Suspense } from "react"
import { AccountSecurityHub } from "@/app/dashboard/account/components/account-security-hub"
import { getAccountSessions } from "@/app/dashboard/account/lib/get-account-sessions"
import { getUserHasPasswordCredential } from "@/app/dashboard/account/lib/get-user-has-password-credential"
import { DashboardPageFallback } from "@/app/dashboard/components/layout/dashboard-page-shell"
import { requireDashboardSession } from "@/app/dashboard/lib/dashboard-session"

export default function AccountSecurityPage() {
  return (
    <Suspense fallback={<DashboardPageFallback />}>
      <AccountSecurityPageContent />
    </Suspense>
  )
}

async function AccountSecurityPageContent() {
  const session = await requireDashboardSession()
  const userId = session.user.id

  const [hasPasswordCredential, sessions] = await Promise.all([
    getUserHasPasswordCredential(userId),
    getAccountSessions(session.session.id),
  ])

  return (
    <AccountSecurityHub
      hasPasswordCredential={hasPasswordCredential}
      sessions={sessions}
    />
  )
}
