import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { loadBlogPosts } from './loadUpdates'
import {
  buildDigestIndexEntry,
  clearDigestFilterQuery,
  deriveTopics,
  digestSearchParamsToString,
  filterDigestIndex,
  isDigestFilterActive,
  parseDigestSearchParams,
} from './blogFilter'

const updatesDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../content/blog/updates',
)

describe('deriveTopics', () => {
  it('does not tag Coolify ops posts as AI from incidental agent mentions in bullets', () => {
    const topics = deriveTopics({
      title: 'Coolify vs Dokploy and peers, NetBird h2c routing fix',
      summary: 'Self-hosted PaaS comparison for teams that want deploy control.',
      sectionText:
        'Side notes\nCoolify REST API and MCP server for agent automation. Keep agent automation on the Coolify API.',
      sectionHeadings: 'PaaS pick\nNetBird routing',
    })
    expect(topics).not.toContain('ai')
  })

  it('tags posts that focus on AI in title or summary', () => {
    const topics = deriveTopics({
      title: 'Opus 5.5 vs GPT-6 Astra',
      summary: 'Frontier model reception for teams comparing OpenAI and Anthropic.',
      sectionHeadings: 'Pricing',
    })
    expect(topics).toContain('ai')
  })
})

describe('filterDigestIndex', () => {
  const items = [
    { date: '2026-10-01', title: 'Cloud spend guardrails', summary: 'FinOps', topics: ['cloud'] },
    { date: '2026-10-02', title: 'GPT agent runtime', summary: 'OpenAI preview', topics: ['ai'] },
    { date: '2026-09-01', title: 'DMARC rollouts', summary: 'Email auth', topics: ['security'] },
  ]

  it('filters by search query', () => {
    const out = filterDigestIndex(items, { q: 'dmarc' })
    expect(out).toHaveLength(1)
    expect(out[0]?.date).toBe('2026-09-01')
  })

  it('filters by topic', () => {
    const out = filterDigestIndex(items, { topics: ['cloud'] })
    expect(out.map((i) => i.date)).toEqual(['2026-10-01'])
  })

  it('returns empty when query matches nothing', () => {
    expect(filterDigestIndex(items, { q: 'zzzz-no-match' })).toHaveLength(0)
  })
})

describe('digest URL params', () => {
  it('round-trips query params', () => {
    const q = { q: 'astra', topics: ['ai', 'security'], from: '2026-09-01', to: '2026-10-01' }
    const search = digestSearchParamsToString(q)
    expect(parseDigestSearchParams(search)).toEqual(q)
  })

  it('detects active filters', () => {
    expect(isDigestFilterActive({})).toBe(false)
    expect(isDigestFilterActive({ q: 'x' })).toBe(true)
    expect(isDigestFilterActive({ topics: ['ai'] })).toBe(true)
    expect(isDigestFilterActive(clearDigestFilterQuery())).toBe(false)
  })
})

describe('committed blog index topics', () => {
  it('labels fewer than all posts as AI', () => {
    const posts = loadBlogPosts(updatesDir)
    const entries = posts.map((p) =>
      buildDigestIndexEntry({
        date: p.data.date,
        title: p.data.title,
        summary: p.data.summary,
        sectionText: p.data.sections.map((s) => `${s.heading}\n${s.bullets.join('\n')}`).join('\n'),
        sectionHeadings: p.data.sections.map((s) => s.heading).join('\n'),
      }),
    )
    const aiCount = entries.filter((e) => e.topics.includes('ai')).length
    expect(aiCount).toBeGreaterThan(0)
    expect(aiCount).toBeLessThan(entries.length)
  })

  it('narrows AI topic chip below full list', () => {
    const posts = loadBlogPosts(updatesDir)
    const entries = posts.map((p) =>
      buildDigestIndexEntry({
        date: p.data.date,
        title: p.data.title,
        summary: p.data.summary,
        sectionText: p.data.sections.map((s) => `${s.heading}\n${s.bullets.join('\n')}`).join('\n'),
        sectionHeadings: p.data.sections.map((s) => s.heading).join('\n'),
      }),
    )
    const aiOnly = filterDigestIndex(entries, { topics: ['ai'] })
    expect(aiOnly.length).toBeLessThan(entries.length)
  })
})