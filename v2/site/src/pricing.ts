export const pricingSummary = {
  intro:
    'Straightforward options from an hour of advice through a focused project or interim CIO coverage, including resilience, disaster recovery, performance, scale, and security.',
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
    id: 'quarterly-initiative',
    title: 'Quarterly Initiative',
    price: '$9,999.99',
    detail:
      'Any one project from the hands-on lineup: strategy session, defined success outcome, delivery through the quarter, and a full industry evaluation report ($3,800 value included). No long-term contract.',
    cta: {
      label: 'Start your quarter',
      href: '/contact.html?interest=quarterly-initiative',
    },
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
          'For growing companies of 50 to 2,000 employees with no CIO. Together we decide where technology money goes so it grows the business: roadmap, budget priorities, vendor choices, and plain reporting to leadership.',
        cta: { label: 'Talk about a fractional CIO', href: '/contact.html?interest=fractional-cio' },
      },
      {
        title: 'vCIO alongside your MSP',
        price: '$4,900–$9,900/month',
        detail:
          'Day-to-day IT run by an MSP; we set direction and priorities together while the MSP keeps running the work—no change of provider.',
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
      'Larger multi-part work: disaster recovery and backups, performance and scale, a cybersecurity overhaul, ERP selection, or technology review for a merger or acquisition. For one lineup project, see the Quarterly Initiative.',
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
