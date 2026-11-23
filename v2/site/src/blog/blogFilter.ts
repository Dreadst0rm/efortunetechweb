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

type TopicRule = {
  topic: string
  pattern: RegExp
  /** When set, only title, summary, and section headings are scanned (reduces stray mentions in bullets). */
  primaryOnly?: boolean
}

const TOPIC_RULES: TopicRule[] = [
  { topic: 'cloud', pattern: /\b(cloud|aws|azure|gcp|kubernetes|k8s|finops)\b/i },
  {
    topic: 'ai',
    pattern:
      /\b(ai\b|llm|gpt-?\d|chatgpt|openai|anthropic|claude|gemini|grok\b|genai|generative ai|machine learning|copilot|deepseek|mistral|a(i|l)ops|agi\b|agents?\b)\b/i,
    primaryOnly: true,
  },
  { topic: 'security', pattern: /\b(security|spf|dmarc|dnssec|vulnerability|zero trust)\b/i },
  {
    topic: 'architecture',
    pattern: /\b(architecture|monolith|microservice|event[- ]driven|platform)\b/i,
  },
  { topic: 'devops', pattern: /\b(devops|deploy|ci\/cd|sre|observability)\b/i },
]

export type DigestTopicSource = {
  title: string
  summary: string
  sectionText?: string
  sectionHeadings?: string
}

function topicSourceBlob(rule: TopicRule, source: DigestTopicSource): string {
  if (rule.primaryOnly) {
    return [source.title, source.summary, source.sectionHeadings ?? ''].join('\n')
  }
  return [source.title, source.summary, source.sectionText ?? ''].join('\n')
}

export function deriveTopics(source: DigestTopicSource): string[] {
  const found = new Set<string>()
  for (const rule of TOPIC_RULES) {
    if (rule.pattern.test(topicSourceBlob(rule, source))) found.add(rule.topic)
  }
  return [...found].sort()
}

export function buildDigestIndexEntry(input: {
  date: string
  title: string
  summary: string
  sectionText?: string
  sectionHeadings?: string
}): DigestIndexEntry {
  return {
    date: input.date,
    title: input.title,
    summary: input.summary,
    topics: deriveTopics({
      title: input.title,
      summary: input.summary,
      sectionText: input.sectionText,
      sectionHeadings: input.sectionHeadings,
    }),
  }
}

export function isDigestFilterActive(query: DigestFilterQuery): boolean {
  return Boolean(
    (query.q ?? '').trim() || (query.topics?.length ?? 0) > 0 || query.from || query.to,
  )
}

export function clearDigestFilterQuery(): DigestFilterQuery {
  return {}
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
