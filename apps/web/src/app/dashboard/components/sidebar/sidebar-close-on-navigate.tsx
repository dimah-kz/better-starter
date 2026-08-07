"use client"

import { Suspense, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useSidebar } from "@workspace/ui/components/sidebar"

function SidebarCloseOnNavigateInner() {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()

  useEffect(() => {
    setOpenMobile(false)
  }, [pathname, setOpenMobile])

  return null
}

export function SidebarCloseOnNavigate() {
  return (
    <Suspense fallback={null}>
      <SidebarCloseOnNavigateInner />
    </Suspense>
  )
}
