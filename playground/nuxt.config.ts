export default defineNuxtConfig({
  modules: ['@nuxthub/core', '@nuxt/ui', 'nuxt-qrcode', '../src/module'],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Nuxt Better Auth Demo',
      meta: [
        { name: 'description', content: 'Official demo showcasing Better Auth features with Nuxt: email/password, social auth, passkeys, 2FA, admin panel.' },
        { property: 'og:title', content: 'Nuxt Better Auth Demo' },
        { property: 'og:description', content: 'Official demo showcasing Better Auth features with Nuxt.' },
        { property: 'og:image', content: '/og.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },

  hub: {
    db: {
      dialect: 'sqlite',
      driver: 'd1',
      connection: { databaseId: 'c57ea4c6-1f34-4933-904d-7dddd77510c1' },
    },
  },

  devtools: { enabled: true },

  runtimeConfig: {
    betterAuthSecret: 'dev-secret-change-in-production-32+',
  },

  auth: {
    redirects: {
      login: '/login',
      guest: '/',
    },
  },

  routeRules: {
    '/app/**': { auth: 'user' },
    '/admin/**': { auth: { user: { role: 'admin' } } },
    '/login': { auth: 'guest' },
    '/register': { auth: 'guest' },
    '/forget-password': { auth: 'guest' },
    '/two-factor': { auth: false },
    '/two-factor/otp': { auth: false },
  },

  nitro: {
    virtual: { '#react-email-mock': 'export const render = () => ""' },
    alias: { '@react-email/render': '#react-email-mock' },
    cloudflare: {
      wrangler: {
        compatibility_flags: ['nodejs_compat'],
        observability: { enabled: true, logs: { enabled: true, invocation_logs: true } },
      },
    },
  },

  compatibilityDate: '2025-01-01',
})
