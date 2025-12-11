import { betterAuth } from 'better-auth'
import Database from 'better-sqlite3'
import { beforeAll, describe, expect, it } from 'vitest'

/**
 * Auth flow tests using better-auth directly with in-memory SQLite
 * Tests signup, signin, session, signout flows without Nuxt overhead
 */

function createTestAuth() {
  const sqlite = new Database(':memory:')

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS user (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      emailVerified INTEGER NOT NULL DEFAULT 0,
      image TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS session (
      id TEXT PRIMARY KEY NOT NULL,
      expiresAt TEXT NOT NULL,
      token TEXT NOT NULL UNIQUE,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      ipAddress TEXT,
      userAgent TEXT,
      userId TEXT NOT NULL REFERENCES user(id)
    );
    CREATE TABLE IF NOT EXISTS account (
      id TEXT PRIMARY KEY NOT NULL,
      accountId TEXT NOT NULL,
      providerId TEXT NOT NULL,
      userId TEXT NOT NULL REFERENCES user(id),
      accessToken TEXT,
      refreshToken TEXT,
      idToken TEXT,
      accessTokenExpiresAt TEXT,
      refreshTokenExpiresAt TEXT,
      scope TEXT,
      password TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS verification (
      id TEXT PRIMARY KEY NOT NULL,
      identifier TEXT NOT NULL,
      value TEXT NOT NULL,
      expiresAt TEXT NOT NULL,
      createdAt TEXT,
      updatedAt TEXT
    );
  `)

  const auth = betterAuth({
    database: sqlite,
    emailAndPassword: { enabled: true },
    secret: 'test-secret-for-testing-only-32chars!',
  })

  return { auth, sqlite }
}

async function authRequest(auth: ReturnType<typeof betterAuth>, path: string, options: RequestInit = {}) {
  const url = new URL(`/api/auth${path}`, 'http://localhost:3000')
  const request = new Request(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })
  return auth.handler(request)
}

describe('better-auth E2E flows', () => {
  let auth: ReturnType<typeof betterAuth>

  beforeAll(() => {
    const testAuth = createTestAuth()
    auth = testAuth.auth
  })

  describe('signup flow', () => {
    it('creates a new user with email/password', async () => {
      const response = await authRequest(auth, '/sign-up/email', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com', password: 'password123', name: 'Test User' }),
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.user).toBeDefined()
      expect(data.user.email).toBe('test@example.com')
      expect(data.user.name).toBe('Test User')
    })

    it('rejects duplicate email', async () => {
      const response = await authRequest(auth, '/sign-up/email', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com', password: 'password123', name: 'Another User' }),
      })

      expect(response.status).not.toBe(200)
    })
  })

  describe('signin flow', () => {
    it('signs in with correct credentials', async () => {
      const response = await authRequest(auth, '/sign-in/email', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.user).toBeDefined()
      expect(response.headers.get('set-cookie')).toBeDefined()
    })

    it('rejects wrong password', async () => {
      const response = await authRequest(auth, '/sign-in/email', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com', password: 'wrongpassword' }),
      })

      expect(response.status).not.toBe(200)
    })

    it('rejects non-existent user', async () => {
      const response = await authRequest(auth, '/sign-in/email', {
        method: 'POST',
        body: JSON.stringify({ email: 'nonexistent@example.com', password: 'password123' }),
      })

      expect(response.status).not.toBe(200)
    })
  })

  describe('session flow', () => {
    it('gets session with valid token', async () => {
      const signInResponse = await authRequest(auth, '/sign-in/email', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
      })

      const cookies = signInResponse.headers.get('set-cookie')
      expect(cookies).toBeDefined()

      const sessionResponse = await authRequest(auth, '/get-session', {
        method: 'GET',
        headers: { cookie: cookies! },
      })

      expect(sessionResponse.status).toBe(200)
      const data = await sessionResponse.json()
      expect(data.user).toBeDefined()
      expect(data.session).toBeDefined()
    })

    it('returns null session without auth', async () => {
      const response = await authRequest(auth, '/get-session', { method: 'GET' })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toBeNull()
    })
  })

  describe('signout flow', () => {
    it('signs out and invalidates session', async () => {
      const signInResponse = await authRequest(auth, '/sign-in/email', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
      })
      const cookies = signInResponse.headers.get('set-cookie')

      const signOutResponse = await authRequest(auth, '/sign-out', {
        method: 'POST',
        headers: { cookie: cookies! },
      })

      expect(signOutResponse.status).toBe(200)

      const sessionResponse = await authRequest(auth, '/get-session', {
        method: 'GET',
        headers: { cookie: cookies! },
      })

      const data = await sessionResponse.json()
      expect(data).toBeNull()
    })
  })
})
