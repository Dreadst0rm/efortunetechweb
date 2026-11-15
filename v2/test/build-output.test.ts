import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')

const requiredPages = [
  'index.html',
  'contact.html',
  'thanks.html',
  '404.html',
  'services.html',
  'pricing.html',
  'case-studies.html',
  'about.html',
  'insights.html',
  'insights/cloud-architecture-trends.html',
  'security/index.html',
  'security/acknowledgments.html',
  'sitemap.xml',
  'robots.txt',
  'assets/site.css',
  'favicon.ico',
  'apple-touch-icon.png',
]

describe('build output', () => {
  it('includes prerendered pages and a single CSS bundle', () => {
    for (const page of requiredPages) {
      expect(existsSync(path.join(dist, page)), `missing ${page}`).toBe(true)
    }
  })

  it('does not ship on-site digest pages', () => {
    expect(existsSync(path.join(dist, 'digest'))).toBe(false)
  })

  it('does not ship a global client app bundle', () => {
    const index = readFileSync(path.join(dist, 'index.html'), 'utf8')
    expect(index).not.toMatch(/\/assets\/index-.*\.js/i)
    expect(index).toMatch(/\/assets\/site\.css/)
  })
})
