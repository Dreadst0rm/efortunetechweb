import { existsSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')

const islands = {
  hero: 'assets/islands/hero.js',
  caseStudies: 'assets/islands/case-studies.js',
  digest: 'assets/islands/digest.js',
  quickCheck: 'assets/islands/quick-check.js',
} as const

describe('per-page island bundles', () => {
  for (const [name, file] of Object.entries(islands)) {
    it(`builds ${name} island`, () => {
      const full = path.join(dist, file)
      expect(existsSync(full), file).toBe(true)
      const kb = statSync(full).size / 1024
      expect(kb).toBeLessThan(512)
    })
  }

  it('loads only the expected scripts per page', () => {
    const index = readFileSync(path.join(dist, 'index.html'), 'utf8')
    expect(index).toContain('assets/islands/hero.js')
    expect(index).not.toContain('assets/islands/digest.js')

    const services = readFileSync(path.join(dist, 'services.html'), 'utf8')
    expect(services).not.toContain('assets/islands/')

    const digest = readFileSync(path.join(dist, 'digest/index.html'), 'utf8')
    expect(digest).toContain('assets/islands/digest.js')
    expect(digest).not.toContain('assets/islands/hero.js')

    const contact = readFileSync(path.join(dist, 'contact.html'), 'utf8')
    expect(contact).toContain('assets/islands/quick-check.js')
    expect(contact).toContain('/js/contact.js')

    const cs = readFileSync(path.join(dist, 'case-studies.html'), 'utf8')
    expect(cs).toContain('assets/islands/case-studies.js')
  })
})
