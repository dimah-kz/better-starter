import { Suspense } from "react"
import { AccountSecurityHub } from "@/app/dashboard/account/components/account-security-hub"
import { mapAccountSessionsForDisplay } from "@/app/dashboard/account/lib/account-session-display"
import { getAccountSessions } from "@/app/dashboard/account/lib/get-account-sessions"
import { getUserHasPasswordCredential } from "@/app/dashboard/account/lib/get-user-has-password-credential"
import { DashboardPageFallback } from "@/app/dashboard/components/layout/dashboard-page-shell"
import { headers } from "next/headers"
import { auth } from "@repo/auth"

export default function AccountSecurityPage() {
  return (
    <Suspense fallback={<DashboardPageFallback />}>
      <AccountSecurityPageContent />
    </Suspense>
  )
}

async function AccountSecurityPageContent() {
  const session = await auth.api.getSession({ headers: await headers() })
  const userId = session!.user.id

  const [hasPasswordCredential, sessions] = await Promise.all([
    getUserHasPasswordCredential(userId),
    getAccountSessions(),
  ])

  return (
    <AccountSecurityHub
      hasPasswordCredential={hasPasswordCredential}
      currentSessionToken={session!.session.token}
      sessions={mapAccountSessionsForDisplay(sessions)}
    />
  )
}
