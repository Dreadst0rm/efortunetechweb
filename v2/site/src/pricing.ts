export const pricingSummary = {
  intro:
    'Straightforward options from an hour of advice through interim CIO coverage. Every engagement starts with a conversation so scope matches what you actually need.',
  keystone: {
    title: 'Free domain check',
    blurb:
      'Keystone scans your email and domain setup—the easiest first step. Run it on the contact page before you reach out.',
    href: '/contact.html#quick-check-island',
  },
} as const

export const pricingTiers = [
  {
    id: 'hourly',
    title: 'Hourly',
    price: '$150–$450/hour',
    detail:
      'Depending on technical depth; ad hoc questions, reviews, and short assessments.',
    cta: { label: 'Book an hour', href: '/contact.html?interest=hourly' },
  },
  {
    id: 'advisory',
    title: 'Advisory retainer',
    price: '$2,500–$4,500/month',
    detail: 'About 8–15 hours/month as a standing sounding board for leadership.',
    cta: { label: 'Talk about advisory', href: '/contact.html?interest=advisory-retainer' },
  },
  {
    id: 'fractional',
    title: 'Fractional retainer',
    price: '$4,000–$12,000/month',
    detail:
      'Regular strategic leadership, vendor management, and roadmap oversight—typically 16–40 hours/month.',
    children: [
      {
        title: 'Fractional CIO',
        price: '$4,000–$12,000/month',
        detail:
          'For growing companies with no CIO. I decide where technology money goes so it grows the company: roadmap, budget priorities, vendor choices, and plain reporting to leadership.',
        cta: { label: 'Talk about a fractional CIO', href: '/contact.html?interest=fractional-cio' },
      },
      {
        title: 'vCIO alongside your MSP',
        price: '$4,900–$9,900/month',
        detail:
          'Day-to-day IT run by an MSP; I set direction and priorities while the MSP keeps running the work—no change of provider.',
        cta: {
          label: 'Add a vCIO alongside your MSP',
          href: '/contact.html?interest=vcio-msp',
        },
      },
    ],
  },
  {
    id: 'project',
    title: 'Project-based',
    price: '$10,000–$50,000 total',
    detail:
      'ERP selection, cybersecurity overhaul, M&A technology due diligence, or a full technology assessment.',
    cta: { label: 'Scope a project', href: '/contact.html?interest=project' },
  },
  {
    id: 'interim',
    title: 'Interim / near full-time',
    price: '$14,000–$20,000+/month',
    detail: 'Interim CIO during a transition.',
    cta: { label: 'Need an interim CIO?', href: '/contact.html?interest=interim-cio' },
  },
] as const
