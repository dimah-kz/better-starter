import { config } from "dotenv"
import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

config({ path: "../../.env" })

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    turbopackRustReactCompiler: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  transpilePackages: [
    "@workspace/ui",
    "@better-starter/auth",
    "@better-starter/db",
    "@better-starter/i18n",
    "@better-starter/storage",
  ],
  allowedDevOrigins: ["10.108.145.199"],
}

export default withNextIntl(nextConfig)
