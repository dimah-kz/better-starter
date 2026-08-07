"use client"

import { SegmentErrorFallback } from "@/components/segment-error-fallback"
import { useTranslations } from "next-intl"

type DashboardErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  const t = useTranslations("dashboard.errors")

  return (
    <SegmentErrorFallback
      title={t("title")}
      description={t("description")}
      error={error}
      reset={reset}
    />
  )
}
