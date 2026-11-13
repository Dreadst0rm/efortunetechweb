import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')

const phonePattern = /(\+1\s*\(312\)\s*555-0180|tel:\s*\+?1|<h3>Phone<\/h3>)/i

const pagesToScan = [
  'index.html',
  'contact.html',
  'about.html',
  'services.html',
  'case-studies.html',
  'digest/index.html',
]

describe('v2 has no published phone number', () => {
  it('does not expose phone or tel: links on key pages', () => {
    for (const page of pagesToScan) {
      const html = readFileSync(path.join(dist, page), 'utf8')
      expect(html, page).not.toMatch(phonePattern)
      expect(html, page).not.toMatch(/application\/ld\+json[\s\S]*telephone/i)
    }
  })
})
