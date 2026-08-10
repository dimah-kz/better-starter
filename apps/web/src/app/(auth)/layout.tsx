import { AuthSettingsMenu } from "@/app/(auth)/components/auth-settings-menu"
import { IconStack } from "@workspace/ui/components/reui/icon-stack"
import { ImageIcon } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-svh w-full md:grid-cols-2">
      <div className="relative flex min-h-svh flex-col overflow-hidden border-border md:border-e">
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute inset-0 bg-muted/50 dark:bg-muted/30" />
          <div className="absolute inset-0 bg-background/70 dark:bg-background/45" />
        </div>

        <div className="relative z-10 flex min-h-svh flex-col bg-card/80 backdrop-blur-xl dark:bg-card/60">
          <div className="flex p-4 md:p-6">
            <AuthSettingsMenu />
          </div>
          <div className="flex flex-1 flex-col items-center justify-center px-6 pb-10 md:px-12 lg:px-16">
            <div className="w-full max-w-sm">{children}</div>
          </div>
        </div>
      </div>

      <div
        className="relative hidden min-h-svh items-center justify-center bg-muted/60 md:flex dark:bg-muted/25"
        aria-hidden="true"
      >
        <IconStack className="h-40 w-36 text-muted-foreground">
          <ImageIcon
            className="size-8 text-muted-foreground/70"
            strokeWidth={1.5}
          />
        </IconStack>
      </div>
    </div>
  )
}
