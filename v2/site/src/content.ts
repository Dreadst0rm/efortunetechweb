export const site = {
  brand: 'efortune',
  domain: 'efortune.tech',
  linkedIn: 'https://www.linkedin.com/in/edfortune3/',
  hero: {
    kicker: 'Fractional CIO · vCIO · Technology leadership',
    h1: 'Senior technology leadership, without the full-time hire.',
    tagline:
      'Outages, slowdowns and breaches are business problems. I fix them hands-on, then make sure they stay fixed.',
    subhead:
      'Fractional CIO and vCIO services for companies of 50 to 2,000 employees—plus hands-on expertise that is hard to hire: stability, security, scalability, and resiliency.',
    trackRecord:
      '20+ years leading technology at an HR/payroll software company, a cybersecurity software vendor, a design-software company, an enterprise email-security vendor, and a national building-products distributor.',
  },
  cta: {
    kicker: 'Book a free Resilience Snapshot',
    label: 'Book a free Resilience Snapshot',
    href: '/contact.html?interest=resilience-snapshot',
    secondaryLabel: 'See what’s hard to hire',
    secondaryHref: '/hands-on',
  },
}

export const pillars = [
  {
    id: 'development',
    title: 'Development',
    blurb:
      'Rescue stalled projects and stand up AI as a practice—with guardrails, governance, and use cases that pay off, not one-off experiments.',
    proof:
      'Stalled business application delivered in 9 months after 3+ years of failed attempts; release cadence moved from quarterly to biweekly.',
  },
  {
    id: 'infrastructure',
    title: 'Infrastructure platforms',
    blurb:
      'Cloud moves and consolidation, network modernization, and Microsoft 365 and Azure platforms, built to stay up, fail over cleanly, and grow with you, with AI used only where it is safe.',
    proof: 'Phased AWS/GCP and Kubernetes migration; SD-WAN replacing costly private circuits.',
  },
  {
    id: 'operations',
    title: 'Operations',
    blurb:
      'Keep systems fast and reliable as you grow: monitoring your team will actually use, cost control, performance when it slips, and capacity planning before the next spike.',
    proof:
      '25% better availability and response times and $4M cost avoidance; 99.9% SLA through a decade of 40% yearly growth.',
  },
  {
    id: 'security',
    title: 'Security',
    blurb:
      'Close the gaps attackers look for first: stronger sign-in, email and domain protection with Keystone, and audit readiness (PCI, SOC 2, GDPR, and federal encryption requirements) sized for a company like yours.',
    proof:
      'Built a security team and automated audit controls; FIPS work that kept $10M in yearly revenue.',
  },
] as const

/** Short cards on the home page */
export const featuredUseCases = [
  {
    title: 'Modernizing network, identity, and resiliency',
    blurb:
      'A national building-products distributor needed one Microsoft platform, a modern network, and an identity and recovery plan that held up under scrutiny.',
    href: '/case-studies.html#case-5',
  },
  {
    title: 'Rescuing a stalled business application',
    blurb:
      'A national building-products distributor needed a customer-facing application delivered after years of false starts. I reset the plan and shipped in 9 months.',
    href: '/case-studies.html#case-1',
  },
  {
    title: 'Scaling IT through a decade of fast growth',
    blurb:
      'An HR and payroll software company growing about 40% a year needed infrastructure, security, and audits that kept pace—99.9% SLA for 10 years.',
    href: '/case-studies.html#case-2',
  },
  {
    title: 'Cloud move with faster response times',
    blurb:
      'An enterprise email-security vendor moved to AWS/GCP on Kubernetes with shared dashboards—25% better availability and $4M cost avoided.',
    href: '/case-studies.html#case-3',
  },
] as const

export type CaseStudy = {
  id: string
  title: string
  pillars: string[]
  companyType: string
  problem: string
  did: string
  outcome: string
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'case-1',
    title: 'Rescuing a stalled business application',
    pillars: ['Development'],
    companyType: 'National building-products distributor',
    problem:
      'A customer-facing business application had stalled through 3+ years of failed attempts.',
    did: 'I reset expectations and got leadership, contractors, and internal teams behind one plan.',
    outcome: 'Delivered in 9 months.',
  },
  {
    id: 'case-2',
    title: 'Scaling IT and security through a decade of fast growth',
    pillars: ['Operations', 'Security', 'Development'],
    companyType: 'HR and payroll software company (from startup stage)',
    problem:
      'Workforce growing about 40% a year needed infrastructure, security, and audits that kept up.',
    did: 'I scaled infrastructure, set up the security team, automated SOC 2 and PCI audit controls, and moved releases to short agile cycles with automated database deployments.',
    // TODO(Ed): confirm startup-to-valuation figures with current public wording.
    outcome:
      '99.9% SLA for 10 years; quarterly to biweekly releases; helped grow from a $5M startup to a $100M valuation.',
  },
  {
    id: 'case-3',
    title: 'Cloud move with faster response times and shared observability',
    pillars: ['Infrastructure platforms', 'Operations'],
    companyType: 'Enterprise email-security vendor',
    problem:
      'Services needed to move to AWS/GCP without hurting reliability; 20+ engineering teams lacked a shared view of system health.',
    did: 'I directed phased migrations onto Kubernetes, reported cost and risk to executives, built shared dashboards, and negotiated a 3-year monitoring contract.',
    outcome:
      'Availability and response times improved 25%; $4M cost avoided; lower infrastructure cost.',
  },
  {
    id: 'case-4',
    title: 'Clearing a compliance blocker to keep revenue',
    pillars: ['Security'],
    companyType: 'Enterprise email-security vendor',
    problem: 'Federal compliance requirements (FIPS) put existing revenue and future upgrades at risk.',
    did: 'I worked through the compliance problems and cleared the path for FIPS upgrades; led secure AI adoption and encryption compliance work.',
    outcome: '$10M in annual recurring revenue kept.',
  },
  {
    id: 'case-5',
    title: 'Modernizing network, identity, and resiliency',
    pillars: ['Infrastructure platforms', 'Security'],
    companyType: 'National building-products distributor',
    problem:
      'Scattered point tools, costly private network circuits, sign-in setup needing a long-term plan.',
    did: 'I led the move onto one Microsoft platform, designed a modern network to replace costly private circuits, and built the identity roadmap. I also helped the team plan how to leave a data center, back up Microsoft 365, and restore operations if a site went down.',
    outcome:
      'Lower running cost, a more resilient network, and a clearer plan to recover if something failed. The team called the technology choices unbiased.',
  },
  {
    id: 'case-6',
    title: 'Cutting cloud and back-office cost',
    pillars: ['Operations', 'Development'],
    companyType: 'Design-software company and cybersecurity software vendor',
    problem:
      'Rising cloud spend, manual back-office work, scattered customer portals, and high team turnover.',
    did: 'I built a cloud cost tool that moved workloads automatically, automated back-office steps, led GDPR work on financial systems, merged four web apps into one portal tied to sales and support tools, and created career paths.',
    outcome:
      '40% lower operating cost and 50% less back-office process work (design-software company); $100K/year saved on cloud and average tenure up from 4.5 to 20 months (cybersecurity software vendor).',
  },
]

export const testimonials = [
  {
    quote:
      'Having Ed as an advisor on these initiatives helped my team make unbiased decisions about the technology we wanted to leverage.',
    author: 'Chris',
    role: 'Infrastructure leader, national building-products distributor',
  },
  {
    quote:
      'His cross-functional experience, dogged nature, and insightful genius created powerful, cost-saving solutions that were repeatable across the enterprise.',
    author: 'Doug',
    role: 'Colleague, enterprise email-security vendor',
  },
] as const

export const contactInterests = [
  { value: 'resilience-snapshot', label: 'Free Resilience Snapshot' },
  { value: 'ai-practice', label: 'AI as a practice' },
  { value: 'technology-direction', label: 'Technology direction' },
  { value: 'cloud-move', label: 'Cloud migration' },
  { value: 'zero-trust', label: 'Zero trust access' },
  { value: 'cyber-insurance-readiness', label: 'Cyber insurance readiness' },
  { value: 'hourly', label: 'Hourly advice' },
  { value: 'advisory-retainer', label: 'Advisory retainer' },
  { value: 'fractional-cio', label: 'Fractional CIO' },
  { value: 'vcio-msp', label: 'vCIO alongside my MSP' },
  { value: 'project', label: 'A project' },
  { value: 'interim-cio', label: 'Interim CIO' },
  { value: 'quarterly-initiative', label: 'Quarterly Initiative ($9,999.99)' },
  { value: 'not-sure', label: 'Not sure' },
] as const

export const contactTopics = [
  { value: 'resilience', label: 'Resilience' },
  { value: 'disaster-recovery', label: 'Disaster recovery' },
  { value: 'performance-scale', label: 'Performance and scale' },
  { value: 'security', label: 'Security' },
  { value: 'ai-practice', label: 'AI practice' },
  { value: 'technology-direction', label: 'Technology direction' },
  { value: 'cloud-move', label: 'Cloud move' },
  { value: 'zero-trust', label: 'Zero trust' },
  { value: 'cyber-insurance', label: 'Cyber insurance readiness' },
] as const

export const companySizes = [
  { value: 'under-50', label: 'Fewer than 50 employees' },
  { value: '50-199', label: '50–199 employees' },
  { value: '200-499', label: '200–499 employees' },
  { value: '500-999', label: '500–999 employees' },
  { value: '1000-2000', label: '1,000–2,000 employees' },
  { value: 'over-2000', label: 'More than 2,000 employees' },
] as const
