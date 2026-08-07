import { Suspense } from "react"
import { SignUpForm } from "@/app/(auth)/(email-password)/signup/components/signup-form"
import { normalizeAuthRedirectTarget } from "@/app/(auth)/lib/auth-redirect"

type SignUpPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default function SignUpPage({ searchParams }: SignUpPageProps) {
  return (
    <Suspense fallback={<SignUpForm redirectTo="/dashboard" />}>
      <SignUpPageContent searchParams={searchParams} />
    </Suspense>
  )
}

async function SignUpPageContent({ searchParams }: SignUpPageProps) {
  const params = await searchParams
  const redirectRaw =
    typeof params.redirect === "string" ? params.redirect : undefined
  const redirectTo = normalizeAuthRedirectTarget(redirectRaw)

  return <SignUpForm redirectTo={redirectTo} />
}
