export default defineNuxtConfig({
  modules: ['@nuxthub/core', '../src/module'],

  hub: { database: true },

  devtools: { enabled: true },

  runtimeConfig: {
    betterAuthSecret: 'dev-secret-change-in-production',
    public: {
      siteUrl: 'http://localhost:3000',
    },
  },

  routeRules: {
    '/app/**': { auth: 'user' },
    '/admin/**': { auth: 'user', requiresAdmin: true },
    '/login': { auth: 'guest' },
  },

  compatibilityDate: '2025-01-01',
})
