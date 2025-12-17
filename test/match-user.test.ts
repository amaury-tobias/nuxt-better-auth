import { describe, expect, it } from 'vitest'
import { matchesUser } from '../src/runtime/utils/match-user'

describe('matchesUser', () => {
  it('matches single value', () => {
    const user = { role: 'admin', name: 'John' }
    expect(matchesUser(user, { role: 'admin' })).toBe(true)
  })

  it('fails when single value mismatches', () => {
    const user = { role: 'user', name: 'John' }
    expect(matchesUser(user, { role: 'admin' })).toBe(false)
  })

  it('matches value in array (OR logic)', () => {
    const user = { role: 'editor', name: 'John' }
    expect(matchesUser(user, { role: ['admin', 'editor'] })).toBe(true)
  })

  it('fails when value not in array', () => {
    const user = { role: 'user', name: 'John' }
    expect(matchesUser(user, { role: ['admin', 'editor'] })).toBe(false)
  })

  it('matches multiple fields (AND logic)', () => {
    const user = { role: 'admin', status: 'active', name: 'John' }
    expect(matchesUser(user, { role: 'admin', status: 'active' })).toBe(true)
  })

  it('fails if any field mismatches', () => {
    const user = { role: 'admin', status: 'inactive', name: 'John' }
    expect(matchesUser(user, { role: 'admin', status: 'active' })).toBe(false)
  })

  it('handles undefined field gracefully', () => {
    const user = { name: 'John' } as { name: string, role?: string }
    expect(matchesUser(user, { role: 'admin' })).toBe(false)
  })

  it('matches empty object (no constraints)', () => {
    const user = { role: 'admin', name: 'John' }
    expect(matchesUser(user, {})).toBe(true)
  })
})
