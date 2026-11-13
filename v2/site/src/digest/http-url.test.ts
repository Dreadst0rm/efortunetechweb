import { describe, expect, it } from 'vitest'
import { isHttpUrl } from './http-url'

describe('isHttpUrl', () => {
  it('accepts http and https', () => {
    expect(isHttpUrl('https://example.com/x')).toBe(true)
    expect(isHttpUrl('http://example.com')).toBe(true)
  })

  it('rejects javascript and data URLs', () => {
    expect(isHttpUrl('javascript:alert(1)')).toBe(false)
    expect(isHttpUrl('javascript://example.com/%0aalert(1)')).toBe(false)
    expect(isHttpUrl('data:text/html,<script>alert(1)</script>')).toBe(false)
  })
})
