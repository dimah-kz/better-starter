import { Suspense } from "react"
import { LoginForm } from "@/app/(auth)/(email-password)/login/components/login-form"
import { normalizeAuthRedirectTarget } from "@/app/(auth)/lib/auth-redirect"

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <Suspense fallback={<LoginForm redirectTo="/dashboard" />}>
      <LoginPageContent searchParams={searchParams} />
    </Suspense>
  )
}

async function LoginPageContent({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const redirectRaw =
    typeof params.redirect === "string" ? params.redirect : undefined
  const redirectTo = normalizeAuthRedirectTarget(redirectRaw)

  return <LoginForm redirectTo={redirectTo} />
}
