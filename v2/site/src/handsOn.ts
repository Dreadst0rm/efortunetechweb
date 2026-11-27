/** Shared CTAs and ladder copy for hands-on service pages. */

export const RESILIENCE_SNAPSHOT_HREF = '/contact.html?interest=resilience-snapshot'

export const primaryCta = {
  label: 'Book a free Resilience Snapshot',
  href: RESILIENCE_SNAPSHOT_HREF,
} as const

export const secondaryCta = {
  label: 'See what’s hard to hire',
  href: '/hands-on',
} as const

export const hardToHireOutcomes = [
  {
    id: 'stability',
    title: 'Stability',
    body: 'Systems stay up, costs stay predictable, and your team is not fighting the same fire every week.',
  },
  {
    id: 'security',
    title: 'Security',
    body: 'Fewer open doors, evidence you can show an auditor or insurer, and a plan that outlasts this year’s tools.',
  },
  {
    id: 'scalability',
    title: 'Scalability',
    body: 'Growth does not slow the business down—capacity, cloud spend, and architecture keep pace.',
  },
  {
    id: 'resiliency',
    title: 'Resiliency',
    body: 'When something fails—a provider, a site, or a bad deploy—you know how to restore and keep working.',
  },
] as const

export type HubOfferLink =
  | { type: 'page'; href: string; label: string }
  | { type: 'contact'; interest: string; label: string }

export const hubPrimaryOffers = [
  {
    id: 'ai-practice',
    title: 'AI as a practice',
    outcomes: ['scalability', 'stability'] as const,
    summary:
      'Stand up AI as an ongoing capability: use-case selection, guardrails, data safety, governance, and measuring payoff—not one-off tools your team forgets in a month.',
    links: [{ type: 'page', href: '/ai-practice', label: 'AI as a practice' }] as const satisfies readonly HubOfferLink[],
  },
  {
    id: 'technology-direction',
    title: 'Technology direction',
    outcomes: ['stability'] as const,
    summary:
      'A senior roadmap and decision-making partner when you do not have a full-time CIO or CTO—or start any one lineup project for $9,999.99 through the Quarterly Initiative.',
    links: [
      { type: 'page', href: '/pricing.html', label: 'Fractional and advisory pricing' },
      { type: 'page', href: '/quarterly-initiative', label: 'Quarterly Initiative' },
      { type: 'contact', interest: 'technology-direction', label: 'Talk about technology direction' },
    ] as const satisfies readonly HubOfferLink[],
  },
  {
    id: 'cloud-migration',
    title: 'Cloud moves',
    outcomes: ['scalability', 'resiliency'] as const,
    summary:
      'Planning and leading migration and consolidation to cloud—with cost control, failover, and a team that knows how to run what you land.',
    links: [{ type: 'page', href: '/cloud-migration', label: 'Cloud migration and consolidation' }] as const satisfies readonly HubOfferLink[],
  },
  {
    id: 'zero-trust',
    title: 'Zero trust access (replace the VPN)',
    outcomes: ['security', 'stability'] as const,
    summary:
      'Identity-based access to apps instead of a wide-open VPN—fewer standing doors, better remote-work experience, vendor-neutral design.',
    links: [{ type: 'page', href: '/zero-trust', label: 'Zero trust access' }] as const satisfies readonly HubOfferLink[],
  },
  {
    id: 'security-roadmap',
    title: 'Cyber protection and a 3–5 year security roadmap',
    outcomes: ['security'] as const,
    summary:
      'Near-term hardening plus a written protection plan for the next 3–5 years—including help answering cyber insurance application questions and closing control gaps.',
    links: [
      { type: 'page', href: '/security-hardening', label: 'Security roadmap and hardening' },
      { type: 'contact', interest: 'cyber-insurance-readiness', label: 'Cyber insurance readiness' },
    ] as const satisfies readonly HubOfferLink[],
  },
] as const

export const handsOnTechnicalPages = [
  {
    href: '/resilience-and-recovery',
    label: 'Resilience & recovery',
    blurb: 'Backups, restore testing, and runbooks when a provider or site fails.',
    outcomes: ['resiliency'] as const,
  },
  {
    href: '/performance-and-scale',
    label: 'Performance & scale',
    blurb: 'Load-test-and-fix before growth breaks what you have.',
    outcomes: ['scalability'] as const,
  },
  {
    href: '/monitoring',
    label: 'Monitoring',
    blurb: 'Catch email, domain, and health issues before customers do.',
    outcomes: ['stability'] as const,
  },
] as const

export const engagementLadder = [
  {
    step: '1',
    title: 'Free Resilience Snapshot',
    body: 'A 30-minute call plus a one-time check of two public pages’ basic health—enough to spot obvious gaps before you commit.',
    cta: primaryCta,
  },
  {
    step: '2',
    title: 'Fixed-price project',
    body: 'Written scope, weekly demo, and a plain-English report with a technical appendix. You know the price before work starts.',
    cta: secondaryCta,
  },
  {
    step: '3',
    title: 'Ongoing',
    body: 'Keystone monitoring for email and domain health, or an advisory or fractional CIO retainer when you want a leader on call.',
    cta: { label: 'Talk about ongoing support', href: '/contact.html?interest=advisory-retainer' },
  },
] as const

export const howIWorkStrip = [
  { title: 'Fixed price', body: 'Scope and fee agreed in writing before kickoff.' },
  { title: 'Written scope', body: 'No surprise deliverables—every outcome is listed up front.' },
  { title: 'Weekly demo', body: 'You see progress every week, not a big reveal at the end.' },
  {
    title: 'No shared passwords',
    body: 'Every service gets its own credentials—no one “admin password” for everything.',
  },
  {
    title: 'Plain-English report',
    body: 'Executive summary your leadership can read, plus a technical appendix for your team.',
  },
] as const

export const hubComparisonRows = [
  {
    need: 'Need one problem solved?',
    offer: 'Fixed project',
    price: '$10,000–$50,000',
  },
  {
    need: 'Want one project from the lineup delivered?',
    offer: 'Quarterly Initiative',
    price:
      '$9,999.99 — one project, agreed outcome & delivery, industry evaluation included ($3,800 value)',
  },
  {
    need: 'Need a technology leader on call?',
    offer: 'Advisory or fractional CIO / CTO',
    price: '$2,500–$4,500/mo advisory · $4,000–$12,000/mo fractional',
  },
  {
    need: 'Short, well-defined tasks',
    offer: 'Hourly',
    price: '$150–$450/hour (available for short, well-defined tasks)',
  },
] as const

/** Verified news sources for outage references on public pages. */
export const outageReferences = [
  {
    label: 'Guardian — UniSuper Google Cloud outage, May 2024',
    href: 'https://www.theguardian.com/australia-news/article/2024/may/09/unisuper-google-cloud-issue-account-access',
  },
  {
    label: 'Reuters — CrowdStrike-related global outage, July 2024',
    href: 'https://www.reuters.com/technology/crowdstrike-says-actively-working-with-customers-impacted-by-outage-2024-07-19/',
  },
] as const

/** General reference for controls insurers often ask about (not a guarantee of coverage). */
export const cyberInsuranceReference = {
  label: 'CISA — cybersecurity best practices',
  href: 'https://www.cisa.gov/resources-tools/resources/cybersecurity-best-practices',
} as const