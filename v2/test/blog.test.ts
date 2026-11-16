import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { loadBlogPosts } from '../site/src/blog/loadUpdates'
import { blogPostPath } from '../site/src/blog/dates'
import { renderBlogRss } from '../site/src/blog/rss'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const contentDir = path.join(root, 'site', 'content', 'blog', 'updates')

describe('blog content', () => {
  it('loads imported posts from daily-pulse', () => {
    const posts = loadBlogPosts(contentDir)
    expect(posts.length).toBeGreaterThanOrEqual(27)
    for (const post of posts) {
      expect(post.data.title.length).toBeGreaterThan(0)
      expect(post.data.sections.length).toBeGreaterThan(0)
      expect(blogPostPath(post.data.date)).toMatch(/^\/blog\/updates\/\d{4}-\d{2}-\d{2}\/$/)
    }
  })

  it('renders RSS with blog URLs', () => {
    const posts = loadBlogPosts(contentDir)
    const xml = renderBlogRss(posts.slice(0, 2), 'https://efortune.tech')
    expect(xml).toContain('<link>https://efortune.tech/blog/</link>')
    expect(xml).toContain(`/blog/updates/${posts[0].data.date}/`)
  })

  it('records import manifest', () => {
    const manifest = JSON.parse(
      readFileSync(path.join(root, 'site', 'content', 'blog', 'import-manifest.json'), 'utf8'),
    ) as { postCount: number; failed: unknown[] }
    expect(manifest.postCount).toBeGreaterThanOrEqual(27)
    expect(manifest.failed).toEqual([])
  })
})

describe('built blog HTML', () => {
  const dist = path.join(root, 'dist')
  it.skipIf(!existsSync(path.join(dist, 'blog', 'index.html')))('includes Blog nav on index', () => {
    const html = readFileSync(path.join(dist, 'blog', 'index.html'), 'utf8')
    expect(html).toContain('>Blog</a>')
    expect(html).not.toMatch(/\bteaser\b/i)
    expect(html).not.toMatch(/\bpaywall\b/i)
  })
})