import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

import { STATIC_FALLBACK_CONTENT_SECURITY_POLICY } from '../worker/html-csp.js'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')

describe('HTML CSP (static build)', () => {
  it('ships strict fallback CSP in public _headers (no unsafe-inline in script-src)', () => {
    const headers = readFileSync(path.join(root, 'public/_headers'), 'utf8')
    expect(headers).toMatch(/Content-Security-Policy:/i)
    expect(headers).toContain(STATIC_FALLBACK_CONTENT_SECURITY_POLICY)
    expect(headers).not.toMatch(/script-src[^;\n]*'unsafe-inline'/)
    expect(headers).toMatch(/X-Content-Type-Options:/i)
  })

  it('configures assets.run_worker_first in wrangler.jsonc', () => {
    const raw = readFileSync(path.join(root, 'wrangler.jsonc'), 'utf8')
    expect(raw).toMatch(/"run_worker_first":\s*true/)
  })

  it('prerenders HTML without inline script bodies', () => {
    const index = readFileSync(path.join(dist, 'index.html'), 'utf8')
    expect(index).not.toMatch(/<script[^>]*>[^<]+<\/script>/)
    expect(index).toMatch(/<script src=/)
  })
})