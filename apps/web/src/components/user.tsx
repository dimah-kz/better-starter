import type { ComponentProps } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/avatar"
import { cn } from "@repo/ui/lib/utils"

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

function User({
  className,
  size = "default",
  ...props
}: ComponentProps<"div"> & { size?: "default" | "sm" | "lg" }) {
  return (
    <div
      data-slot="user"
      data-size={size}
      className={cn(
        "group/user flex w-full min-w-0 items-center gap-2.5",
        "data-[size=lg]:gap-3 data-[size=sm]:gap-1.5",
        className
      )}
      {...props}
    />
  )
}

function UserAvatar({
  className,
  size = "sm",
  src,
  name,
  alt,
  children,
  ...props
}: ComponentProps<typeof Avatar> & {
  src?: string | null
  name?: string
  alt?: string
}) {
  return (
    <Avatar size={size} className={className} {...props}>
      {children ?? (
        <>
          {src ? <AvatarImage src={src} alt={alt ?? ""} /> : null}
          <AvatarFallback>{getInitials(name ?? "")}</AvatarFallback>
        </>
      )}
    </Avatar>
  )
}

function UserContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="user-content"
      className={cn(
        "flex min-w-0 flex-1 flex-col gap-0.5 group-data-[size=sm]/user:gap-0",
        className
      )}
      {...props}
    />
  )
}

function UserName({
  className,
  children,
  title,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="user-name"
      title={title ?? (typeof children === "string" ? children : undefined)}
      className={cn(
        "truncate text-sm leading-tight font-medium group-data-[size=sm]/user:text-xs",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function UserDescription({
  className,
  children,
  title,
  ...props
}: ComponentProps<"p">) {
  return (
    <p
      data-slot="user-description"
      title={title ?? (typeof children === "string" ? children : undefined)}
      className={cn(
        "truncate text-xs leading-tight text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

export { User, UserAvatar, UserContent, UserName, UserDescription }
