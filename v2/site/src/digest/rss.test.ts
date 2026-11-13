import { describe, expect, it } from 'vitest'
import { loadDigestUpdates } from './loadUpdates'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { renderDigestRss } from './rss'

const updatesDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'content',
  'digest',
  'updates',
)

describe('renderDigestRss', () => {
  it('emits RSS 2.0 with absolute efortune.tech links', () => {
    const updates = loadDigestUpdates(updatesDir).slice(0, 2)
    const xml = renderDigestRss(updates, 'https://efortune.tech')
    expect(xml).toMatch(/<rss version="2.0">/)
    expect(xml).toContain('<link>https://efortune.tech/digest/</link>')
    expect(xml).toContain(`https://efortune.tech/digest/updates/${updates[0].data.date}/`)
  })

  it('respects SITE_ORIGIN override for staging', () => {
    const updates = loadDigestUpdates(updatesDir).slice(0, 1)
    const xml = renderDigestRss(updates, 'https://v2.efortune.tech')
    expect(xml).toContain('https://v2.efortune.tech/digest/')
  })
})
