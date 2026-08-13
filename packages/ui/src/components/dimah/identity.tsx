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

function IdentityAddon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="identity-addon"
      className={cn(
        "inline-flex shrink-0 items-center justify-center [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 group-data-[size=lg]/identity:[&_svg:not([class*='size-'])]:size-4 group-data-[size=sm]/identity:[&_svg:not([class*='size-'])]:size-3",
        className
      )}
      {...props}
    />
  )
}

function isIdentityAddon(
  node: React.ReactNode
): node is React.ReactElement<React.ComponentProps<typeof IdentityAddon>> {
  return React.isValidElement(node) && node.type === IdentityAddon
}

function getIdentityLineLabel(children: React.ReactNode) {
  const parts: string[] = []
  React.Children.forEach(children, (node) => {
    if (typeof node === "string" && node.trim()) parts.push(node)
  })
  return parts.length > 0 ? parts.join(" ") : undefined
}

function renderIdentityLine(children: React.ReactNode) {
  const result: React.ReactNode[] = []
  let label: React.ReactNode[] = []
  let labelIndex = 0

  const flushLabel = () => {
    if (label.length === 0) return
    result.push(
      <span key={`label-${labelIndex++}`} className="min-w-0 truncate">
        {label}
      </span>
    )
    label = []
  }

  for (const node of React.Children.toArray(children)) {
    if (isIdentityAddon(node)) {
      flushLabel()
      result.push(node)
      continue
    }
    label.push(node)
  }
  flushLabel()

  return result
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
      title={title ?? getIdentityLineLabel(children)}
      className={cn(
        "flex max-w-full min-w-0 items-center gap-1 text-start text-sm/tight font-medium group-data-[size=lg]/identity:text-base/tight group-data-[size=sm]/identity:gap-0.5 group-data-[size=sm]/identity:text-xs/tight",
        className
      )}
      {...props}
    >
      {renderIdentityLine(children)}
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
      title={title ?? getIdentityLineLabel(children)}
      className={cn(
        "flex max-w-full min-w-0 items-center gap-1 text-start text-xs/tight text-muted-foreground group-data-[size=sm]/identity:gap-0.5",
        className
      )}
      {...props}
    >
      {renderIdentityLine(children)}
    </span>
  )
}

export {
  Identity,
  IdentityAvatar,
  IdentityContent,
  IdentityTitle,
  IdentityDescription,
  IdentityAddon,
}
