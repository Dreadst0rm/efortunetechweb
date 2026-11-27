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
  'hands-on/index.html',
  'resilience-and-recovery/index.html',
  'performance-and-scale/index.html',
  'security-hardening/index.html',
  'monitoring/index.html',
  'ai-practice/index.html',
  'cloud-migration/index.html',
  'zero-trust/index.html',
  'sitemap.xml',
  'robots.txt',
  'assets/site.css',
  'favicon.ico',
  'apple-touch-icon.png',
  'assets/ed-fortune.jpg',
  'assets/ed-fortune.webp',
  'assets/og-card.jpg',
]

describe('build output', () => {
  it('includes prerendered pages and a single CSS bundle', () => {
    for (const page of requiredPages) {
      expect(existsSync(path.join(dist, page)), `missing ${page}`).toBe(true)
    }
  })

  it('ships blog index, RSS, and at least one post', () => {
    expect(existsSync(path.join(dist, 'blog', 'index.html'))).toBe(true)
    expect(existsSync(path.join(dist, 'blog', 'rss.xml'))).toBe(true)
    expect(existsSync(path.join(dist, 'blog', 'updates', '2026-11-13', 'index.html'))).toBe(true)
    expect(existsSync(path.join(dist, 'digest'))).toBe(false)
  })

  it('lists hands-on routes in sitemap.xml', () => {
    const xml = readFileSync(path.join(dist, 'sitemap.xml'), 'utf8')
    for (const loc of [
      'https://efortune.tech/hands-on',
      'https://efortune.tech/resilience-and-recovery',
      'https://efortune.tech/performance-and-scale',
      'https://efortune.tech/security-hardening',
      'https://efortune.tech/monitoring',
      'https://efortune.tech/ai-practice',
      'https://efortune.tech/cloud-migration',
      'https://efortune.tech/zero-trust',
    ]) {
      expect(xml, `missing ${loc}`).toContain(`<loc>${loc}</loc>`)
    }
  })

  it('does not ship a global client app bundle', () => {
    const index = readFileSync(path.join(dist, 'index.html'), 'utf8')
    expect(index).not.toMatch(/\/assets\/index-.*\.js/i)
    expect(index).toMatch(/\/assets\/site\.css/)
  })
})
