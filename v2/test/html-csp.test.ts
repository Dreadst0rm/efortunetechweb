import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')

describe('HTML CSP (static build)', () => {
  it('does not ship Content-Security-Policy in public _headers (Worker sets per HTML response)', () => {
    const headers = readFileSync(path.join(root, 'public/_headers'), 'utf8')
    expect(headers).not.toMatch(/Content-Security-Policy:/i)
    expect(headers).toMatch(/X-Content-Type-Options:/i)
  })

  it('prerenders HTML without inline script bodies', () => {
    const index = readFileSync(path.join(dist, 'index.html'), 'utf8')
    expect(index).not.toMatch(/<script[^>]*>[^<]+<\/script>/)
    expect(index).toMatch(/<script src=/)
  })
})