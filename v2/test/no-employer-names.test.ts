import { readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')

const banned = [
  'ABC Supply',
  'Proofpoint',
  'Autodesk',
  'OPSWAT',
  'Paylocity',
  'Salesforce',
  'Zendesk',
]

/** Marketing and core site pages — Digest may cite third-party product names. */
const marketingPages = [
  'index.html',
  'contact.html',
  'thanks.html',
  'services.html',
  'pricing.html',
  'case-studies.html',
  'about.html',
  'insights.html',
  'insights/cloud-architecture-trends.html',
  'security/index.html',
  'security/acknowledgments.html',
  '404.html',
]

describe('no banned employer names in built HTML', () => {
  it('does not include known employer brands on marketing pages', () => {
    const files = marketingPages.map((p) => path.join(dist, p))
    expect(files.length).toBeGreaterThan(0)
    for (const file of files) {
      const html = readFileSync(file, 'utf8')
      for (const term of banned) {
        expect(html, `${term} found in ${path.relative(dist, file)}`).not.toContain(term)
      }
    }
  })
})
