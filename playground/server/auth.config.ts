import { admin } from 'better-auth/plugins'
import { defineServerAuth } from '../../src/runtime/config'

export default defineServerAuth(({ runtimeConfig: _runtimeConfig }) => ({
  appName: 'Nuxt Better Auth Playground',
  plugins: [admin()],
  emailAndPassword: { enabled: true },
}))
