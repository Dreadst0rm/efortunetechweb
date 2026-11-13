import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')

function gzipKb(file: string): number {
  return gzipSync(readFileSync(file)).length / 1024
}

const islands = {
  hero: 'assets/islands/hero.js',
  caseStudies: 'assets/islands/case-studies.js',
  digest: 'assets/islands/digest.js',
  quickCheck: 'assets/islands/quick-check.js',
} as const

const preactIslands = ['caseStudies', 'digest', 'quickCheck'] as const

describe('per-page island bundles', () => {
  for (const [name, file] of Object.entries(islands)) {
    it(`builds ${name} island`, () => {
      const full = path.join(dist, file)
      expect(existsSync(full), file).toBe(true)
    })
  }

  it('keeps Preact island entry bundles small (gzip)', () => {
    for (const key of preactIslands) {
      const file = path.join(dist, islands[key])
      const gz = gzipKb(file)
      expect(gz, `${key} entry gzip ${gz.toFixed(1)} KB`).toBeLessThanOrEqual(15)
    }
  })

  it('shares a single preact vendor chunk among island pages', () => {
    const chunkDir = path.join(dist, 'assets/islands/chunks')
    expect(existsSync(chunkDir)).toBe(true)
    const chunks = readdirSync(chunkDir).filter((f) => f.endsWith('.js'))
    expect(chunks.some((f) => f.startsWith('preact'))).toBe(true)
    const preactChunk = chunks.find((f) => f.startsWith('preact'))
    if (preactChunk) {
      const gz = gzipKb(path.join(chunkDir, preactChunk))
      expect(gz).toBeLessThan(12)
    }
  })

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
