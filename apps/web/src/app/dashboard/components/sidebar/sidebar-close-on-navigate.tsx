"use client"

import { Suspense, useEffect, useEffectEvent } from "react"
import { usePathname } from "next/navigation"
import { useSidebar } from "@repo/ui/components/sidebar"

function SidebarCloseOnNavigateInner() {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()
  const closeMobile = useEffectEvent(() => {
    setOpenMobile(false)
  })

  useEffect(() => {
    closeMobile()
  }, [pathname])

  return null
}

export function SidebarCloseOnNavigate() {
  return (
    <Suspense fallback={null}>
      <SidebarCloseOnNavigateInner />
    </Suspense>
  )
}
