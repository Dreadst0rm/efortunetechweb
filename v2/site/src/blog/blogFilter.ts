export type DigestIndexEntry = {
  date: string
  title: string
  summary: string
  topics: string[]
}

export type DigestFilterQuery = {
  q?: string
  topics?: string[]
  from?: string
  to?: string
}

const TOPIC_RULES: { topic: string; pattern: RegExp }[] = [
  { topic: 'cloud', pattern: /\b(cloud|aws|azure|gcp|kubernetes|k8s|finops)\b/i },
  { topic: 'ai', pattern: /\b(ai|ml|llm|agent|model|copilot|gpt)\b/i },
  { topic: 'security', pattern: /\b(security|spf|dmarc|dnssec|vulnerability|zero trust)\b/i },
  { topic: 'architecture', pattern: /\b(architecture|monolith|microservice|event[- ]driven|platform)\b/i },
  { topic: 'devops', pattern: /\b(devops|deploy|ci\/cd|sre|observability)\b/i },
]

export function deriveTopics(...texts: string[]): string[] {
  const blob = texts.join('\n')
  const found = new Set<string>()
  for (const { topic, pattern } of TOPIC_RULES) {
    if (pattern.test(blob)) found.add(topic)
  }
  return [...found].sort()
}

export function buildDigestIndexEntry(input: {
  date: string
  title: string
  summary: string
  sectionText?: string
}): DigestIndexEntry {
  return {
    date: input.date,
    title: input.title,
    summary: input.summary,
    topics: deriveTopics(input.title, input.summary, input.sectionText ?? ''),
  }
}

export function filterDigestIndex(
  items: DigestIndexEntry[],
  query: DigestFilterQuery,
): DigestIndexEntry[] {
  const q = (query.q ?? '').trim().toLowerCase()
  const topics = query.topics?.filter(Boolean) ?? []
  const from = query.from
  const to = query.to

  return items.filter((item) => {
    if (from && item.date < from) return false
    if (to && item.date > to) return false
    if (topics.length > 0 && !topics.some((t) => item.topics.includes(t))) return false
    if (!q) return true
    const hay = `${item.title}\n${item.summary}\n${item.topics.join(' ')}`.toLowerCase()
    return hay.includes(q)
  })
}

export function parseDigestSearchParams(search: string): DigestFilterQuery {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
  const topics = params.getAll('topic')
  return {
    q: params.get('q') ?? undefined,
    topics: topics.length ? topics : undefined,
    from: params.get('from') ?? undefined,
    to: params.get('to') ?? undefined,
  }
}

export function digestSearchParamsToString(query: DigestFilterQuery): string {
  const params = new URLSearchParams()
  if (query.q) params.set('q', query.q)
  if (query.from) params.set('from', query.from)
  if (query.to) params.set('to', query.to)
  for (const t of query.topics ?? []) params.append('topic', t)
  const s = params.toString()
  return s ? `?${s}` : ''
}
