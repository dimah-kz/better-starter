import { notFound } from "next/navigation"
import { Suspense } from "react"
import { AccountSettingsHub } from "@/app/dashboard/account/components/account-settings-hub"
import { mapAccountSessionsForDisplay } from "@/app/dashboard/account/lib/account-session-display"
import { getAccountProfile } from "@/app/dashboard/account/lib/get-account-profile"
import { getAccountSessions } from "@/app/dashboard/account/lib/get-account-sessions"
import { getUserHasPasswordCredential } from "@/app/dashboard/account/lib/get-user-has-password-credential"
import { DashboardPageFallback } from "@/app/dashboard/components/layout/dashboard-page-shell"
import { headers } from "next/headers"
import { auth } from "@repo/auth"

export default function AccountPage() {
  return (
    <Suspense fallback={<DashboardPageFallback />}>
      <AccountPageContent />
    </Suspense>
  )
}

async function AccountPageContent() {
  const session = await auth.api.getSession({ headers: await headers() })
  const userId = session!.user.id

  const [profile, hasPasswordCredential, sessions] = await Promise.all([
    getAccountProfile(userId),
    getUserHasPasswordCredential(userId),
    getAccountSessions(),
  ])

  if (!profile) {
    notFound()
  }

  return (
    <AccountSettingsHub
      profile={profile}
      hasPasswordCredential={hasPasswordCredential}
      currentSessionToken={session!.session.token}
      sessions={mapAccountSessionsForDisplay(sessions)}
    />
  )
}
