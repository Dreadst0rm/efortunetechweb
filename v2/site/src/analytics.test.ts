import { describe, expect, it } from 'vitest'
import { buildWebAnalyticsHead } from './analytics'

describe('buildWebAnalyticsHead', () => {
  it('omits script without token', () => {
    expect(buildWebAnalyticsHead(undefined)).toBe('')
    expect(buildWebAnalyticsHead('  ')).toBe('')
  })

  it('emits external beacon only', () => {
    const head = buildWebAnalyticsHead('abc-token')
    expect(head).toContain('static.cloudflareinsights.com/beacon.min.js')
    expect(head).toContain('data-cf-beacon')
    expect(head).not.toContain('unsafe-inline')
    expect(head).not.toMatch(/<script[^>]*>[^<]+<\/script>/)
  })
})
