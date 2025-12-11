import createServerAuth from '#auth/server'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from 'hub:db'

type AuthInstance = ReturnType<typeof betterAuth>
let _auth: AuthInstance | undefined

export function serverAuth(): AuthInstance {
  if (_auth)
    return _auth

  const runtimeConfig = useRuntimeConfig()

  // User's config function receives context
  const userConfig = createServerAuth({ runtimeConfig, db })

  // Library adds database adapter, secret, baseURL
  _auth = betterAuth({
    ...userConfig,
    database: drizzleAdapter(db, { provider: 'sqlite' }),
    secret: runtimeConfig.betterAuthSecret,
    baseURL: runtimeConfig.public.siteUrl,
  })

  return _auth
}
