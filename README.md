# Nuxt Better Auth

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Nuxt module for [Better Auth](https://better-auth.com) integration with [NuxtHub](https://hub.nuxt.com). Provides route protection, session management, and role-based access.

## Features

- NuxtHub Integration - Uses `hub:db` for database access
- Route Protection - Declarative access rules via `routeRules`
- Session Management - Server and client plugins that sync auth state
- Role-Based Access - Support for `admin`, `user`, and custom roles
- Tier Gating - Generic tier system for subscription/premium features
- Auto-Imports - `useUserSession`, `usePageAccess`, `requireUserSession`, `getUserSession`

## Requirements

- NuxtHub with database enabled (`hub: { database: true }`)

## Quick Start

### 1. Install

```bash
pnpm add nuxt-better-auth better-auth drizzle-orm @nuxthub/core
```

### 2. Configure Nuxt

```ts
export default defineNuxtConfig({
  modules: ['@nuxthub/core', 'nuxt-better-auth'],

  hub: { database: true },

  runtimeConfig: {
    betterAuthSecret: '', // BETTER_AUTH_SECRET env var
    public: { siteUrl: 'http://localhost:3000' },
  },

  routeRules: {
    '/app/**': { auth: 'user' },
    '/admin/**': { auth: 'user', requiresAdmin: true },
    '/login': { auth: 'guest' },
  },
})
```

### 3. Create Server Config

Create `server/auth.config.ts`:

```ts
import { admin } from 'better-auth/plugins'
import { defineServerAuth } from 'nuxt-better-auth'

export default defineServerAuth(({ runtimeConfig, db }) => ({
  appName: 'My App',
  plugins: [admin()],
  emailAndPassword: { enabled: true },
}))
```

### 4. Create Client Config

Create `app/auth.client.ts`:

```ts
import { adminClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/vue'

export function createAppAuthClient(baseURL: string) {
  return createAuthClient({
    baseURL,
    plugins: [adminClient()],
  })
}

export type AppAuthClient = ReturnType<typeof createAppAuthClient>
```

### 5. Add Type Extensions

Create `shared/types/auth.d.ts`:

```ts
import '#nuxt-better-auth'

declare module '#nuxt-better-auth' {
  interface AuthUser {
    role?: string | null
    banned?: boolean | null
  }
}
```

## Route Rules

| Option | Type | Description |
|--------|------|-------------|
| `auth` | `boolean \| 'guest' \| 'user'` | Auth requirement |
| `role` | `string \| string[]` | Required role(s) |
| `requiresAdmin` | `boolean` | Shorthand for `role: 'admin'` |
| `tier` | `string \| string[]` | Required tier |

## Composables

### `useUserSession()`

```ts
const { user, session, loggedIn, ready, client, signIn, signUp, signOut, fetchSession, updateUser } = useUserSession()
```

### `usePageAccess()`

```ts
const { hasAccess, showPaywall, paywallConfig } = usePageAccess()
```

## Server Utils

```ts
// Require auth
const { user, session } = await requireUserSession(event)

// Require admin
const { user } = await requireUserSession(event, { role: 'admin' })

// Optional session
const session = await getUserSession(event)
```

## Module Aliases

| Alias | Points To |
|-------|-----------|
| `#auth/server` | `server/auth.config.ts` |
| `#auth/client` | `app/auth.client.ts` |
| `#nuxt-better-auth` | Module type augmentation |

## Development

```bash
pnpm install
pnpm dev:prepare
pnpm dev
```

## License

MIT

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-better-auth/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-better-auth

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-better-auth.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/nuxt-better-auth

[license-src]: https://img.shields.io/npm/l/nuxt-better-auth.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-better-auth

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
