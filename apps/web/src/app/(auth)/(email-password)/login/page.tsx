import { Suspense } from "react"
import { cookies } from "next/headers"
import { LoginForm } from "@/app/(auth)/(email-password)/login/components/login-form"
import { normalizeAuthRedirectTarget } from "@/app/(auth)/lib/auth-redirect"
import { LAST_LOGIN_METHOD_COOKIE } from "@/app/(auth)/lib/last-login-method"

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
  const cookieStore = await cookies()
  const lastLoginMethod =
    cookieStore.get(LAST_LOGIN_METHOD_COOKIE)?.value ?? null

  return <LoginForm redirectTo={redirectTo} lastLoginMethod={lastLoginMethod} />
}
