export const authRoutes = {
  login: () => "/login",
  signup: () => "/signup",
} as const

export type AuthRoutePath =
  ReturnType<typeof authRoutes.login> | ReturnType<typeof authRoutes.signup>
