import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@repo/ui/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/avatar"

function getInitials(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"

  if (parts.length === 1) {
    return (Array.from(parts[0]!)[0] ?? "?").toUpperCase()
  }

  const first = Array.from(parts[0]!)[0]
  const last = Array.from(parts[parts.length - 1]!)[0]
  return `${first ?? ""}${last ?? ""}`.toUpperCase()
}

const identityVariants = cva(
  "group/identity flex w-full min-w-0 items-center",
  {
    variants: {
      size: {
        sm: "gap-1.5",
        default: "gap-2.5",
        lg: "gap-3",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

function Identity({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof identityVariants>) {
  return (
    <div
      data-slot="identity"
      data-size={size}
      className={cn(identityVariants({ size }), className)}
      {...props}
    />
  )
}

function IdentityAvatar({
  className,
  size,
  src,
  name,
  alt,
  children,
  ...props
}: React.ComponentProps<typeof Avatar> & {
  src?: string | null
  name?: string
  alt?: string
}) {
  return (
    <Avatar
      size={size}
      className={cn(
        size == null &&
          "group-data-[size=lg]/identity:size-10 group-data-[size=sm]/identity:size-6 group-data-[size=sm]/identity:**:data-[slot=avatar-fallback]:text-xs",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          {src ? <AvatarImage src={src} alt={alt ?? name ?? ""} /> : null}
          <AvatarFallback>{getInitials(name ?? "")}</AvatarFallback>
        </>
      )}
    </Avatar>
  )
}

function IdentityContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="identity-content"
      className={cn(
        "flex max-w-full min-w-0 flex-1 flex-col gap-0.5 overflow-hidden group-data-[size=sm]/identity:gap-0",
        className
      )}
      {...props}
    />
  )
}

function IdentityTitle({
  className,
  children,
  title,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="identity-title"
      title={title ?? (typeof children === "string" ? children : undefined)}
      className={cn(
        "block max-w-full min-w-0 truncate text-start text-sm/tight font-medium group-data-[size=lg]/identity:text-base/tight group-data-[size=sm]/identity:text-xs/tight",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

function IdentityDescription({
  className,
  children,
  title,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="identity-description"
      title={title ?? (typeof children === "string" ? children : undefined)}
      className={cn(
        "block max-w-full min-w-0 truncate text-start text-xs/tight text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export {
  Identity,
  IdentityAvatar,
  IdentityContent,
  IdentityTitle,
  IdentityDescription,
}
