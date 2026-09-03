"use client"

import { SegmentErrorFallback } from "@/components/segment-error-fallback"
import { useTranslations } from "next-intl"

type DashboardErrorProps = {
  error: Error & { digest?: string }
  retry: () => void
}

export default function DashboardError({ error, retry }: DashboardErrorProps) {
  const t = useTranslations("common.errors")

  return (
    <SegmentErrorFallback
      title={t("title")}
      description={t("description")}
      error={error}
      retry={retry}
    />
  )
}
