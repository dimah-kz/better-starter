import { Building2Icon } from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import { cn } from "@workspace/ui/lib/utils"

type OrganizationAvatarProps = {
  name: string
  logo?: string | null
  className?: string
  size?: "default" | "sm" | "lg"
  fallbackClassName?: string
}

export function OrganizationAvatar({
  name,
  logo,
  className,
  size = "default",
  fallbackClassName,
}: OrganizationAvatarProps) {
  const trimmedLogo = logo?.trim() ?? ""

  return (
    <Avatar className={className} size={size}>
      {trimmedLogo ? <AvatarImage src={trimmedLogo} alt="" /> : null}
      <AvatarFallback
        className={cn(
          "bg-primary/10 font-medium text-primary",
          fallbackClassName
        )}
      >
        {name.trim() ? (
          (name.trim()[0]?.toUpperCase() ?? "?")
        ) : (
          <Building2Icon className="size-4" aria-hidden />
        )}
      </AvatarFallback>
    </Avatar>
  )
}
