import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import type { DigestIndexEntry } from '../blog/blogFilter'
import {
  digestSearchParamsToString,
  filterDigestIndex,
  isDigestFilterActive,
  parseDigestSearchParams,
} from '../blog/blogFilter'
import { applyDigestVisibility } from '../blog/blogFilterDom'

const TOPICS = ['cloud', 'ai', 'security', 'architecture', 'devops'] as const

function filterQueryFromState(q: string, topics: string[], from: string, to: string) {
  return {
    q: q || undefined,
    topics: topics.length ? topics : undefined,
    from: from || undefined,
    to: to || undefined,
  }
}

function readFilterStateFromLocation(): { q: string; topics: string[]; from: string; to: string } {
  const parsed = parseDigestSearchParams(window.location.search)
  return {
    q: parsed.q ?? '',
    topics: parsed.topics ?? [],
    from: parsed.from ?? '',
    to: parsed.to ?? '',
  }
}

function DigestFiltersApp({ index }: { index: DigestIndexEntry[] }) {
  const initial = readFilterStateFromLocation()
  const [q, setQ] = useState(initial.q)
  const [topics, setTopics] = useState(initial.topics)
  const [from, setFrom] = useState(initial.from)
  const [to, setTo] = useState(initial.to)
  const historyLock = useRef(false)
  const historyReady = useRef(false)
  const skipDiscretePush = useRef(true)
  const searchBranchOpen = useRef(Boolean(initial.q.trim()))
  const lastPushedUrl = useRef<string | null>(null)
  const filterRef = useRef({ q, topics, from, to })
  filterRef.current = { q, topics, from, to }

  const currentFilterUrl = useCallback(() => {
    const params = digestSearchParamsToString(
      filterQueryFromState(
        filterRef.current.q,
        filterRef.current.topics,
        filterRef.current.from,
        filterRef.current.to,
      ),
    )
    return `${window.location.pathname}${params}`
  }, [])

  const replaceFilterUrl = useCallback(() => {
    if (historyLock.current) return
    const next = currentFilterUrl()
    const current = `${window.location.pathname}${window.location.search}`
    if (current === next) return
    window.history.replaceState({ digestFilters: true }, '', next)
  }, [currentFilterUrl])

  const pushFilterHistory = useCallback(() => {
    if (historyLock.current) return
    const next = currentFilterUrl()
    if (lastPushedUrl.current === next) return
    window.history.pushState({ digestFilters: true }, '', next)
    lastPushedUrl.current = next
  }, [currentFilterUrl])

  const applyUrlToState = useCallback((search: string) => {
    const parsed = parseDigestSearchParams(search)
    historyLock.current = true
    setQ(parsed.q ?? '')
    setTopics(parsed.topics ?? [])
    setFrom(parsed.from ?? '')
    setTo(parsed.to ?? '')
    lastPushedUrl.current = `${window.location.pathname}${search}`
    searchBranchOpen.current = Boolean((parsed.q ?? '').trim())
    queueMicrotask(() => {
      historyLock.current = false
    })
  }, [])

  useEffect(() => {
    const onPop = () => applyUrlToState(window.location.search)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [applyUrlToState])

  useEffect(() => {
    lastPushedUrl.current = `${window.location.pathname}${window.location.search}`
    historyReady.current = true
  }, [])

  const filteredDates = useMemo(() => {
    const ids = filterDigestIndex(index, filterQueryFromState(q, topics, from, to))
    return new Set(ids.map((i) => i.date))
  }, [index, q, topics, from, to])

  useEffect(() => {
    applyDigestVisibility(document, filteredDates)
  }, [filteredDates])

  useEffect(() => {
    if (!historyReady.current) return

    const hasQ = q.trim().length > 0
    if (hasQ && !searchBranchOpen.current) {
      const snapshot = `${window.location.pathname}${window.location.search}`
      window.history.pushState({ digestFilters: true }, '', snapshot)
      lastPushedUrl.current = snapshot
      searchBranchOpen.current = true
    } else if (!hasQ) {
      searchBranchOpen.current = false
    }
    replaceFilterUrl()
  }, [q, replaceFilterUrl])

  useEffect(() => {
    if (!historyReady.current) return
    if (skipDiscretePush.current) {
      skipDiscretePush.current = false
      return
    }
    searchBranchOpen.current = false
    pushFilterHistory()
  }, [topics, from, to, pushFilterHistory])

  const active = isDigestFilterActive(filterQueryFromState(q, topics, from, to))

  const clearAll = useCallback(() => {
    setQ('')
    setTopics([])
    setFrom('')
    setTo('')
  }, [])

  useEffect(() => {
    const emptyClear = document.getElementById('blog-filter-empty-clear')
    if (!emptyClear) return
    emptyClear.addEventListener('click', clearAll)
    return () => emptyClear.removeEventListener('click', clearAll)
  }, [clearAll])

  const clearTopics = () => setTopics([])

  const toggleTopic = (t: string) => {
    setTopics((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))
  }

  return (
    <div className="bp-digest-filters" role="search" aria-label="Filter blog posts">
      <div className="bp-digest-filters__toolbar">
        <p className="bp-digest-filters__status" role="status" aria-live="polite">
          Showing {filteredDates.size} of {index.length} posts
        </p>
        {active ? (
          <button type="button" className="bp-digest-filters__clear" onClick={clearAll}>
            Clear filters
          </button>
        ) : null}
      </div>
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
          <button
            type="button"
            className={topics.length === 0 ? 'bp-chip bp-chip--on' : 'bp-chip'}
            aria-pressed={topics.length === 0}
            onClick={clearTopics}
          >
            All
          </button>
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
    </div>
  )
}

async function main() {
  const mount = document.getElementById('blog-filters')
  if (!mount) return
  const res = await fetch('/blog/index.json')
  if (!res.ok) return
  const index = (await res.json()) as DigestIndexEntry[]
  createRoot(mount).render(<DigestFiltersApp index={index} />)
}

main().catch(() => {
  /* filters optional */
})