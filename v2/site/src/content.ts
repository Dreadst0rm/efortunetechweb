export const site = {
  brand: 'efortune',
  domain: 'efortune.tech',
  kicker: 'Expert Cloud, AI & Software Architecture',
  h1: 'Technology Strategy That Delivers Results',
  cta: {
    kicker: 'Ready for clearer technical direction?',
    label: 'Get in Touch',
    href: '/contact.html',
  },
}

export const services = [
  {
    title: 'Cloud Architecture & Migration',
    blurb: 'Design resilient, cost-optimized cloud platforms on AWS, Azure, and GCP.',
  },
  {
    title: 'AI & ML Strategy',
    blurb: 'Identify high-value AI opportunities and ship production-grade ML systems.',
  },
  {
    title: 'Software Architecture',
    blurb: 'Maintainable, scalable system designs — DDD, microservices, event-driven.',
  },
] as const

export const caseStudies = [
  {
    tag: 'Cloud Migration',
    title: 'Legacy platform to AWS',
    blurb:
      // TODO(ed): Confirm case study metric and wording — placeholder until Ed approves.
      'Re-platformed a 15-year-old order system onto AWS with zero downtime — infra spend down 38% in the first quarter.',
  },
  {
    tag: 'AI Strategy',
    title: 'LLM support copilot rollout',
    blurb:
      // TODO(ed): Confirm case study metric and wording — placeholder until Ed approves.
      'Scoped, piloted, and shipped a production LLM assistant that deflected 27% of tier-1 tickets across three product lines.',
  },
  {
    tag: 'Architecture',
    title: 'Monolith to event-driven services',
    blurb:
      'Decomposed a monolith into bounded-context services with an event backbone — deploy frequency went from monthly to daily.',
  },
] as const

export const testimonials = [
  {
    quote:
      // TODO(ed): Confirm testimonial — placeholder client quote until Ed approves.
      'Ed turned a six-month architecture debate into a two-week decision. The roadmap is still being executed, on time and on budget.',
    author: 'VP of Engineering',
    role: 'Series B SaaS company',
  },
  {
    quote:
      // TODO(ed): Confirm testimonial — placeholder client quote until Ed approves.
      'A rare mix of deep hands-on skill and the judgment to know what NOT to build. Our cloud bill dropped before the migration even finished.',
    author: 'CTO',
    role: 'Logistics platform',
  },
  {
    quote:
      // TODO(ed): Confirm testimonial — placeholder client quote until Ed approves.
      'The AI strategy work alone paid for itself — we shipped a pilot in six weeks that our previous vendor had quoted at six months.',
    author: 'Head of Product',
    role: 'Fintech startup',
  },
] as const
