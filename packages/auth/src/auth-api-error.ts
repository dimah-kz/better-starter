import { APIError } from "better-auth"

export function getAuthApiErrorMessage(error: unknown) {
  if (error instanceof APIError) return error.message || String(error.status)
  if (error instanceof Error) return error.message
  return String(error)
}
