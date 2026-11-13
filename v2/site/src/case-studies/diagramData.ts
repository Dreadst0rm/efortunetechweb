export type DiagramNode = {
  id: string
  label: string
  x: number
  y: number
  detail: string
}

export type DiagramState = {
  nodes: DiagramNode[]
  edges: [string, string][]
}

export type CaseStudyDiagram = {
  slug: string
  title: string
  blurb: string
  before: DiagramState
  after: DiagramState
}

export const caseStudyDiagrams: CaseStudyDiagram[] = [
  {
    slug: 'cloud-migration',
    title: 'Legacy platform to AWS',
    blurb: 'Order processing moved from fixed on-prem capacity to autoscaling tiers on AWS.',
    before: {
      nodes: [
        { id: 'legacy', label: 'Monolith', x: 200, y: 120, detail: 'Single deploy unit, fixed hardware' },
        { id: 'db', label: 'On-prem DB', x: 200, y: 220, detail: 'Vertical scale only' },
        { id: 'users', label: 'Clients', x: 200, y: 40, detail: 'Peak traffic strains one stack' },
      ],
      edges: [
        ['users', 'legacy'],
        ['legacy', 'db'],
      ],
    },
    after: {
      nodes: [
        { id: 'users', label: 'Clients', x: 200, y: 40, detail: 'Same traffic, more headroom' },
        { id: 'edge', label: 'Load tier', x: 200, y: 120, detail: 'Autoscaling web layer' },
        { id: 'svc', label: 'Services', x: 120, y: 200, detail: 'Bounded workloads' },
        { id: 'aws', label: 'Managed data', x: 280, y: 200, detail: 'RDS + object store' },
      ],
      edges: [
        ['users', 'edge'],
        ['edge', 'svc'],
        ['edge', 'aws'],
        ['svc', 'aws'],
      ],
    },
  },
  {
    slug: 'ai-copilot',
    title: 'LLM support copilot rollout',
    blurb: 'Tier-1 support gained a guarded copilot path without bypassing ticketing controls.',
    before: {
      nodes: [
        { id: 'agent', label: 'Support', x: 80, y: 140, detail: 'Manual triage' },
        { id: 'queue', label: 'Ticket queue', x: 200, y: 140, detail: 'Growing backlog' },
        { id: 'kb', label: 'Static KB', x: 320, y: 140, detail: 'Hard to search under load' },
      ],
      edges: [
        ['agent', 'queue'],
        ['queue', 'kb'],
      ],
    },
    after: {
      nodes: [
        { id: 'agent', label: 'Support', x: 80, y: 140, detail: 'Approves copilot suggestions' },
        { id: 'copilot', label: 'Copilot', x: 200, y: 80, detail: 'Scoped tools + logging' },
        { id: 'queue', label: 'Ticket queue', x: 200, y: 180, detail: 'Deflection where safe' },
        { id: 'kb', label: 'Knowledge', x: 320, y: 140, detail: 'Retrieval with citations' },
      ],
      edges: [
        ['agent', 'copilot'],
        ['copilot', 'queue'],
        ['copilot', 'kb'],
      ],
    },
  },
  {
    slug: 'event-driven',
    title: 'Monolith to event-driven services',
    blurb: 'Deploy cadence moved from monthly releases to daily bounded-context services.',
    before: {
      nodes: [
        { id: 'mono', label: 'Monolith', x: 200, y: 120, detail: 'Shared schema, risky deploys' },
        { id: 'db', label: 'One database', x: 200, y: 220, detail: 'Coupled migrations' },
      ],
      edges: [['mono', 'db']],
    },
    after: {
      nodes: [
        { id: 'a', label: 'Orders', x: 100, y: 100, detail: 'Owns order events' },
        { id: 'b', label: 'Billing', x: 200, y: 100, detail: 'Subscribes to fulfilled orders' },
        { id: 'c', label: 'Notify', x: 300, y: 100, detail: 'Async fan-out' },
        { id: 'bus', label: 'Event bus', x: 200, y: 200, detail: 'Contracts between teams' },
      ],
      edges: [
        ['a', 'bus'],
        ['b', 'bus'],
        ['c', 'bus'],
      ],
    },
  },
]
