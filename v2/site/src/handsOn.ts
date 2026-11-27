/** Shared CTAs and ladder copy for hands-on service pages. */

export const RESILIENCE_SNAPSHOT_HREF = '/contact.html?interest=resilience-snapshot'

export const primaryCta = {
  label: 'Book a free Resilience Snapshot',
  href: RESILIENCE_SNAPSHOT_HREF,
} as const

export const secondaryCta = {
  label: 'See fixed-price projects',
  href: '/hands-on',
} as const

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
    need: 'Want one big improvement every quarter?',
    offer: 'Quarterly Initiative',
    price: '$9,999.99',
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

export const handsOnServiceLinks = [
  { href: '/resilience-and-recovery', label: 'Resilience & recovery' },
  { href: '/performance-and-scale', label: 'Performance & scale' },
  { href: '/security-hardening', label: 'Security hardening' },
  { href: '/monitoring', label: 'Monitoring' },
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