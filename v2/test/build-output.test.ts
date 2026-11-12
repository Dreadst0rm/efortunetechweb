import { existsSync, readFileSync, readdirSync } from 'node:fs'
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
  'case-studies.html',
  'about.html',
  'insights.html',
  'insights/cloud-architecture-trends.html',
  'security/index.html',
  'security/acknowledgments.html',
  'sitemap.xml',
  'robots.txt',
  'assets/site.css',
]

describe('build output', () => {
  it('includes prerendered pages and a single CSS bundle', () => {
    for (const page of requiredPages) {
      expect(existsSync(path.join(dist, page)), `missing ${page}`).toBe(true)
    }
  })

  it('does not ship a client React bundle', () => {
    const assetsDir = path.join(dist, 'assets')
    const assets = existsSync(assetsDir) ? readdirSync(assetsDir) : []
    const jsBundles = assets.filter((f) => f.endsWith('.js') && !f.endsWith('.map'))
    expect(jsBundles).toEqual([])

    const index = readFileSync(path.join(dist, 'index.html'), 'utf8')
    expect(index).not.toMatch(/react|vite|\/assets\/index-.*\.js/i)
    expect(index).toMatch(/\/assets\/site\.css/)
  })
})
