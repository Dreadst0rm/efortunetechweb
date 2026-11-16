import { describe, expect, it } from 'vitest'
import { loadBlogPosts } from './loadUpdates'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const updatesDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'content',
  'blog',
  'updates',
)

describe('blog post rendering data', () => {
  it('each post has renderable sections and bottom line', () => {
    const posts = loadBlogPosts(updatesDir)
    expect(posts.length).toBeGreaterThan(0)
    for (const post of posts) {
      expect(post.data.bottomLine.length).toBeGreaterThan(20)
      for (const section of post.data.sections) {
        expect(section.bullets.every((b) => b.length > 0)).toBe(true)
      }
    }
  })
})