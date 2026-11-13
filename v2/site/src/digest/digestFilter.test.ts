import { describe, expect, it } from 'vitest'
import {
  buildDigestIndexEntry,
  deriveTopics,
  digestSearchParamsToString,
  filterDigestIndex,
  parseDigestSearchParams,
} from './digestFilter'

describe('deriveTopics', () => {
  it('tags cloud and ai content', () => {
    const topics = deriveTopics('Kubernetes control plane on AWS', 'LLM agent rollout')
    expect(topics).toContain('cloud')
    expect(topics).toContain('ai')
  })
})

describe('filterDigestIndex', () => {
  const items = [
    buildDigestIndexEntry({
      date: '2026-10-01',
      title: 'AWS migration notes',
      summary: 'FinOps and landing zones',
    }),
    buildDigestIndexEntry({
      date: '2026-09-01',
      title: 'Agent harness benchmark',
      summary: 'LLM agents in production',
    }),
  ]

  it('filters by query and topic', () => {
    const out = filterDigestIndex(items, { q: 'agent', topics: ['ai'] })
    expect(out).toHaveLength(1)
    expect(out[0].date).toBe('2026-09-01')
  })

  it('filters by date range', () => {
    const out = filterDigestIndex(items, { from: '2026-10-01', to: '2026-10-31' })
    expect(out).toHaveLength(1)
    expect(out[0].date).toBe('2026-10-01')
  })
})

describe('URL query sync', () => {
  it('round-trips search params', () => {
    const q = { q: 'cloud', topics: ['cloud', 'ai'], from: '2026-01-01' }
    const s = digestSearchParamsToString(q)
    expect(parseDigestSearchParams(s)).toEqual(q)
  })
})
