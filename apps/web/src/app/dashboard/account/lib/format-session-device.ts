import { UAParser } from "ua-parser-js"

export type SessionDeviceKind = "desktop" | "mobile" | "tablet" | "unknown"

export type SessionDeviceDisplay = {
  kind: SessionDeviceKind
  title: string
  subtitle: string | null
}

export function getSessionDeviceDisplay(
  userAgent: string | null
): SessionDeviceDisplay {
  if (!userAgent?.trim()) {
    return {
      kind: "unknown",
      title: "Unknown device",
      subtitle: null,
    }
  }

  const { browser, os, device } = new UAParser(userAgent).getResult()

  let kind: SessionDeviceKind = "desktop"
  if (device.type === "mobile") {
    kind = "mobile"
  } else if (device.type === "tablet") {
    kind = "tablet"
  }

  const browserLabel = formatBrowserLabel(browser)
  const osLabel = os.name?.trim() || null

  let title = "Unknown device"
  if (browserLabel && osLabel) {
    title = `${browserLabel} on ${osLabel}`
  } else if (browserLabel) {
    title = browserLabel
  } else if (osLabel) {
    title = osLabel
  }

  const model = [device.vendor, device.model].filter(Boolean).join(" ").trim()
  const subtitle = pickSessionDeviceSubtitle(model, device.type)

  return { kind, title, subtitle }
}

function pickSessionDeviceSubtitle(
  model: string,
  deviceType: string | undefined
): string | null {
  if (model.length >= 3) {
    return model
  }

  if (deviceType && deviceType !== "console") {
    return capitalize(deviceType)
  }

  return null
}

function formatBrowserLabel(browser: {
  name?: string
  major?: string
  version?: string
}) {
  const name = browser.name?.trim()
  if (!name) {
    return null
  }
  if (browser.major) {
    return `${name} ${browser.major}`
  }
  return name
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
