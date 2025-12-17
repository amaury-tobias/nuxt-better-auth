import { fileURLToPath } from 'node:url'
import { $fetch, setup, url } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

describe('nuxt-better-auth module', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })

  describe('page rendering', () => {
    it('renders home page with BetterAuthState component', async () => {
      const html = await $fetch('/')
      expect(html).toContain('Home')
      expect(html).toContain('Loading auth...')
    })
  })

  describe('route protection', () => {
    it('redirects unauthenticated users from protected routes', async () => {
      const html = await $fetch('/protected')
      expect(html).toContain('login')
    })

    it('allows access to guest routes when unauthenticated', async () => {
      const html = await $fetch('/login')
      expect(html).toContain('Login')
    })
  })

  describe('aPI protection', () => {
    it('returns 401 on protected API without auth', async () => {
      const response = await fetch(url('/api/test/me'))
      expect(response.status).toBe(401)
    })
  })

  describe('authenticated access', () => {
    const testUser = { email: `test-${Date.now()}@example.com`, password: 'testpass123', name: 'Test' }
    let cookies: string

    it('signup and access protected API', async () => {
      // Sign up
      const signupRes = await fetch(url('/api/auth/sign-up/email'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUser),
      })
      expect(signupRes.status).toBe(200)
      cookies = signupRes.headers.get('set-cookie') || ''

      // Access protected API with session
      const meRes = await fetch(url('/api/test/me'), { headers: { cookie: cookies } })
      expect(meRes.status).toBe(200)
      const data = await meRes.json()
      expect(data.email).toBe(testUser.email)
    })
  })
})
