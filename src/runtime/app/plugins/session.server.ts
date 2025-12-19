import type { AuthSession, AuthUser } from '#nuxt-better-auth'
import { defineNuxtPlugin, useRequestEvent, useRequestHeaders, useState } from '#imports'

export default defineNuxtPlugin({
  name: 'auth:session-init',
  enforce: 'pre',
  async setup() {
    const session = useState<AuthSession | null>('auth:session', () => null)
    const user = useState<AuthUser | null>('auth:user', () => null)
    const authReady = useState('auth:ready', () => false)

    // Fetch session on SSR using Better Auth's API endpoint
    const event = useRequestEvent()
    if (event) {
      try {
        const headers = useRequestHeaders(['cookie'])
        const data = await $fetch<{ session: AuthSession, user: AuthUser } | null>('/api/auth/get-session', { headers })
        if (data?.session && data?.user) {
          session.value = data.session
          user.value = data.user
        }
      }
      catch {
        // Session fetch failed - user unauthenticated
      }
    }
    authReady.value = true
  },
})
