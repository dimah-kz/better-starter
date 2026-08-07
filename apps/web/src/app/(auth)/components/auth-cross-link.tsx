"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import type { AuthRoutePath } from "@/app/(auth)/lib/auth-routes"
import { normalizeAuthRedirectTarget } from "@/app/(auth)/lib/auth-redirect"

type AuthCrossLinkProps = {
  target: AuthRoutePath
  children: React.ReactNode
  className?: string
}

export function AuthCrossLink({
  target,
  children,
  className,
}: AuthCrossLinkProps) {
  const searchParams = useSearchParams()
  const redirectTo = normalizeAuthRedirectTarget(searchParams.get("redirect"))
  const href = `${target}?${new URLSearchParams({ redirect: redirectTo }).toString()}`

  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  )
}
