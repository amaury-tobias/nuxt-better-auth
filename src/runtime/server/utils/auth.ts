import type { H3Event } from 'h3'
import { createDatabase, db } from '#auth/database'
import { createSecondaryStorage } from '#auth/secondary-storage'
import createServerAuth from '#auth/server'
import { betterAuth } from 'better-auth'
import { consola } from 'consola'
import { getRequestURL } from 'h3'
import { useRuntimeConfig } from 'nitropack/runtime'

const logger = consola.withTag('nuxt-better-auth')

type AuthInstance = ReturnType<typeof betterAuth>

declare module 'h3' {
  interface H3EventContext {
    _betterAuth?: AuthInstance
  }
}

function getBaseURL(event: H3Event, siteUrl?: string): string {
  if (siteUrl)
    return siteUrl
  const origin = getRequestURL(event).origin
  if (process.env.NODE_ENV === 'production')
    logger.warn('siteUrl not set, auto-detected:', origin)
  return origin
}

export async function serverAuth(event: H3Event): Promise<AuthInstance> {
  // Request-scoped singleton (like @nuxtjs/supabase pattern)
  if (event.context._betterAuth)
    return event.context._betterAuth

  const runtimeConfig = useRuntimeConfig()
  const database = createDatabase()
  const userConfig = createServerAuth({ runtimeConfig, db })

  event.context._betterAuth = betterAuth({
    ...userConfig,
    ...(database && { database }),
    secondaryStorage: createSecondaryStorage(),
    secret: runtimeConfig.betterAuthSecret,
    baseURL: getBaseURL(event, runtimeConfig.public.siteUrl as string | undefined),
  })

  return event.context._betterAuth
}
