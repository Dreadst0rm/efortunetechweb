export const site = {
  brand: 'efortune',
  domain: 'efortune.tech',
  linkedIn: 'https://www.linkedin.com/in/edfortune3/',
  hero: {
    kicker: 'Fractional CIO · vCIO · Technology leadership',
    h1: 'Senior technology leadership, without the full-time hire.',
    subhead:
      'Fractional CIO and vCIO services for companies of 60 to 900 people. I decide where your technology money goes so it grows the business, using 20+ years leading development, infrastructure, operations, and security.',
    trackRecord:
      '20+ years leading technology at an HR/payroll software company, a cybersecurity software vendor, a design-software company, an enterprise email-security vendor, and a national building-products distributor.',
  },
  cta: {
    kicker: 'Book a 30-minute call',
    label: 'Contact me',
    href: '/contact.html',
  },
}

export const pillars = [
  {
    id: 'development',
    title: 'Development',
    blurb:
      'Rescue stalled projects, reset scope, and release faster with less risk—architecture that fits your team size, using AI safely where it helps.',
    proof:
      'Stalled business application delivered in 9 months after 3+ years of failed attempts; release cadence moved from quarterly to biweekly.',
  },
  {
    id: 'infrastructure',
    title: 'Infrastructure platforms',
    blurb:
      'Cloud moves and consolidation, network modernization (SD-WAN), and Microsoft 365 and Azure platforms—with AI used safely, not randomly.',
    proof: 'Phased AWS/GCP and Kubernetes migration; SD-WAN replacing costly private circuits.',
  },
  {
    id: 'operations',
    title: 'Operations',
    blurb:
      'Monitoring teams actually use, cloud and vendor cost control, and reliability through fast growth.',
    proof:
      '25% better availability and response times and $4M cost avoidance; 99.9% SLA through a decade of 40% yearly growth.',
  },
  {
    id: 'security',
    title: 'Security',
    blurb:
      'Identity and passwordless sign-in, compliance readiness (PCI, SSAE16/SOC, GDPR, FIPS), email and domain protection with Keystone.',
    proof:
      'Built a security team and automated audit controls; FIPS work that kept $10M in yearly revenue.',
  },
] as const

/** Short cards on the home page */
export const featuredUseCases = [
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
    title: 'Cloud move with observability',
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
    did: 'I scaled infrastructure, set up the security team, automated SSAE16 and PCI audit controls, and moved releases to short agile cycles with automated database deployments.',
    outcome:
      '99.9% SLA for 10 years; quarterly to biweekly releases; helped grow from a $5M startup to a $100M valuation.',
  },
  {
    id: 'case-3',
    title: 'Moving to the cloud and making it observable',
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
    did: 'I led consolidation onto one Microsoft platform, designed SD-WAN to replace the circuits, built the identity roadmap, and advised on data center evacuation, Microsoft 365 backups, server upgrades, segmentation, and endpoint tools.',
    outcome:
      'Lower total cost of ownership and better network resiliency; technology choices the team called unbiased.',
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
    author: 'Chris Lofy',
    role: 'Infrastructure leader, national building-products distributor',
  },
  {
    quote:
      'His cross-functional experience, dogged nature, and insightful genius created powerful, cost-saving solutions that were repeatable across the enterprise.',
    author: 'Doug Dexter',
    role: 'Colleague, enterprise email-security vendor',
  },
] as const

export const contactInterests = [
  { value: 'hourly', label: 'Hourly advice' },
  { value: 'advisory-retainer', label: 'Advisory retainer' },
  { value: 'fractional-cio', label: 'Fractional CIO' },
  { value: 'vcio-msp', label: 'vCIO alongside my MSP' },
  { value: 'project', label: 'A project' },
  { value: 'interim-cio', label: 'Interim CIO' },
  { value: 'not-sure', label: 'Not sure' },
] as const

export const companySizes = [
  { value: '1-59', label: '1–59 employees' },
  { value: '60-199', label: '60–199 employees' },
  { value: '200-499', label: '200–499 employees' },
  { value: '500-899', label: '500–899 employees' },
  { value: '900+', label: '900+ employees' },
] as const
