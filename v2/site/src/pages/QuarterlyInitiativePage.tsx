import QuarterlyInitiativeBadge from '../components/QuarterlyInitiativeBadge'

const CONTACT_BOOK = '/contact.html?interest=quarterly-initiative'

const offerItems = [
  {
    title: 'A one-hour strategy session',
    body: 'We dig into your systems, your team, and your goals, and find where technology is holding you back or costing you money.',
  },
  {
    title: 'One quarterly initiative, scoped for results',
    body: 'You choose the focus. We turn it into a clear, measurable goal you can actually finish in 90 days.',
  },
  {
    title: 'A written roadmap',
    body: 'Priorities, quick wins, risks, and a realistic budget, written in plain language your team and your IT provider can act on right away.',
  },
  {
    title: 'A 30-day check-in',
    body: "We review progress, clear blockers, and adjust the plan, so the roadmap doesn't end up in a drawer.",
  },
] as const

const initiatives = [
  {
    title: 'Safe AI adoption',
    body: 'Put AI to work where it pays off, with the guardrails that keep your data, your customers, and your reputation safe.',
  },
  {
    title: 'IT resilience',
    body: 'Find the weak points in your systems and build a setup that stays up when something fails.',
  },
  {
    title: 'Disaster recovery',
    body: "Know how you'll restore email, files, and critical systems, and test that the plan actually works.",
  },
  {
    title: 'Performance and scale',
    body: "Speed up what's slow, and get ready for growth before it breaks what you have.",
  },
  {
    title: 'Cloud',
    body: 'Stop overpaying for cloud services, fix what keeps breaking, and build a setup that grows with you instead of against you.',
  },
  {
    title: 'Digital transformation',
    body: 'Replace manual workarounds and aging tools with systems that save your team hours every week.',
  },
  {
    title: 'Security',
    body: 'Close the gaps attackers look for first, with protections sized for a company like yours, not a global enterprise.',
  },
  {
    title: 'Vendor and IT spend',
    body: "See exactly what you're paying for, cut what you don't use, and get better terms on what you keep.",
  },
] as const

const processSteps = [
  {
    title: 'Pick and scope',
    body: "You choose the initiative. Together we define what success looks like and how we'll measure it.",
  },
  {
    title: 'Assess and plan',
    body: 'We review your systems, people, and vendors, then hand you a roadmap built for your business, not a generic checklist.',
  },
  {
    title: 'Carry it out, with steering',
    body: 'I lead the initiative with your team or your IT provider. I help do the technical work, make the calls that need a senior voice, and clear roadblocks so the quarter actually finishes.',
  },
  {
    title: 'Review and choose next',
    body: "We measure what changed, share what we learned, and line up the next quarter's win.",
  },
] as const

const partnerPoints = [
  {
    title: 'Proof before commitment',
    body: 'You see real results from one focused project before you decide on anything bigger.',
  },
  {
    title: 'Momentum that compounds',
    body: 'Each quarter builds on the last. A steady technology leader beats starting from scratch every time.',
  },
  {
    title: 'Executive leadership without a full-time hire',
    body: 'Get the strategic direction of a CTO or CIO for a fraction of what a full-time executive costs.',
  },
  {
    title: 'A seat at your table',
    body: "When you're ready, a fractional CTO or CIO retainer gives you ongoing strategy, vendor management, and roadmap oversight, month after month.",
  },
] as const

export default function QuarterlyInitiativePage() {
  return (
    <div className="bp-page qi-page">
      <section className="bp-hero qi-page__hero" aria-labelledby="qi-hero-title">
        <div className="bp-hero__bg" aria-hidden="true" />
        <div className="bp-hero__content">
          <div className="bp-title-frame">
            <h1 id="qi-hero-title" className="bp-title">
              One quarter. One big technology win. $9,999.99.
            </h1>
          </div>
          <QuarterlyInitiativeBadge />
          <p className="bp-sub">
            Most growing companies don't need more technology. They need someone senior to decide what
            matters, set the plan, and keep it moving. That's what you get here: executive-level
            technology leadership, focused on one initiative that moves your business forward this
            quarter—including resilience, recovery, performance, scale, or security—for a fixed
            $9,999.99.
          </p>
          <div className="bp-hero__actions" aria-label="Primary actions">
            <a className="bp-hero__btn bp-hero__btn--primary" href={CONTACT_BOOK}>
              Start my quarter
            </a>
            <a className="bp-hero__btn bp-hero__btn--secondary" href="#qi-process">
              See how it works
            </a>
          </div>
        </div>
      </section>

      <article className="bp-article qi-page__body">
        <section className="qi-section" aria-labelledby="qi-offer-title">
          <h2 id="qi-offer-title">The offer</h2>
          <p className="bp-lead">Here's everything you get for $9,999.99.</p>
          <ol className="qi-offer-list">
            {offerItems.map((item) => (
              <li key={item.title}>
                <strong>{item.title}:</strong> {item.body}
              </li>
            ))}
          </ol>
          <p className="qi-footnote">
            This is a fixed-price first quarter for new clients. Similar project work usually starts at
            $10,000 and can run to $50,000, depending on scope.
          </p>
        </section>

        <section className="qi-section" aria-labelledby="qi-initiatives-title">
          <h2 id="qi-initiatives-title">Choose your initiative</h2>
          <p className="bp-lead">
            Pick the one that matters most right now. You can take on another next quarter.
          </p>
          <div className="qi-initiative-grid">
            {initiatives.map((item) => (
              <article key={item.title} className="bp-service-card qi-initiative-card">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="qi-section" id="qi-process" aria-labelledby="qi-process-title">
          <h2 id="qi-process-title">How each quarter works</h2>
          <ol className="qi-process-list">
            {processSteps.map((step, index) => (
              <li key={step.title}>
                <span className="qi-process-list__step" aria-hidden="true">
                  {index + 1}
                </span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="qi-section" aria-labelledby="qi-partner-title">
          <h2 id="qi-partner-title">From one quarter to a technology partner</h2>
          <p className="bp-lead">
            A good way to start working together. Many teams continue with advisory or fractional
            leadership after the first quarter.
          </p>
          <ul className="qi-partner-list">
            {partnerPoints.map((item) => (
              <li key={item.title}>
                <strong>{item.title}:</strong> {item.body}
              </li>
            ))}
          </ul>
        </section>

        <section className="qi-section qi-section--cta" aria-labelledby="qi-cta-title">
          <h2 id="qi-cta-title">Pick your first initiative</h2>
          <p className="bp-lead">
            Start your $9,999.99 quarter: strategy session, a written roadmap, and a 30-day check-in
            included.
          </p>
          <p>
            No long-term contract. Just one quarter, one clear goal, and a senior technology leader
            in your corner.
          </p>
          <p>
            <a className="bp-hero__btn bp-hero__btn--primary" href={CONTACT_BOOK}>
              Book my strategy session
            </a>
          </p>
        </section>
      </article>
    </div>
  )
}