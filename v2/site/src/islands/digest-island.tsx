import { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import type { DigestIndexEntry } from '../digest/digestFilter'
import {
  digestSearchParamsToString,
  filterDigestIndex,
  parseDigestSearchParams,
} from '../digest/digestFilter'

const TOPICS = ['cloud', 'ai', 'security', 'architecture', 'devops'] as const

function DigestFiltersApp({
  index,
}: {
  index: DigestIndexEntry[]
}) {
  const [q, setQ] = useState('')
  const [topics, setTopics] = useState<string[]>([])
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  useEffect(() => {
    const parsed = parseDigestSearchParams(window.location.search)
    setQ(parsed.q ?? '')
    setTopics(parsed.topics ?? [])
    setFrom(parsed.from ?? '')
    setTo(parsed.to ?? '')
  }, [])

  const filteredDates = useMemo(() => {
    const ids = filterDigestIndex(index, { q, topics, from: from || undefined, to: to || undefined })
    return new Set(ids.map((i) => i.date))
  }, [index, q, topics, from, to])

  useEffect(() => {
    const params = digestSearchParamsToString({
      q: q || undefined,
      topics: topics.length ? topics : undefined,
      from: from || undefined,
      to: to || undefined,
    })
    const next = `${window.location.pathname}${params}`
    window.history.replaceState({}, '', next)

    const cards = document.querySelectorAll<HTMLElement>('[data-digest-date]')
    for (const el of cards) {
      const date = el.getAttribute('data-digest-date')
      if (!date) continue
      const show = filteredDates.has(date)
      el.hidden = !show
    }
  }, [filteredDates, q, topics, from, to])

  const toggleTopic = (t: string) => {
    setTopics((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))
  }

  return (
    <div className="bp-digest-filters" role="search" aria-label="Filter digest issues">
      <label className="bp-digest-filters__field">
        <span>Search</span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Title or summary"
          autoComplete="off"
        />
      </label>
      <fieldset className="bp-digest-filters__topics">
        <legend>Topics</legend>
        <div className="bp-digest-filters__chips">
          {TOPICS.map((t) => (
            <button
              key={t}
              type="button"
              className={topics.includes(t) ? 'bp-chip bp-chip--on' : 'bp-chip'}
              aria-pressed={topics.includes(t)}
              onClick={() => toggleTopic(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="bp-digest-filters__dates">
        <label>
          From
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label>
          To
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </label>
      </div>
      <p className="bp-digest-filters__status" role="status" aria-live="polite">
        Showing {filteredDates.size} of {index.length} issues
      </p>
    </div>
  )
}

async function main() {
  const mount = document.getElementById('digest-filters')
  if (!mount) return
  const res = await fetch('/digest/index.json')
  if (!res.ok) return
  const index = (await res.json()) as DigestIndexEntry[]
  createRoot(mount).render(<DigestFiltersApp index={index} />)
}

main().catch(() => {
  /* filters optional */
})
