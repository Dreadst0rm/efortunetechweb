import QuarterlyInitiativeBadge from '../components/QuarterlyInitiativeBadge'
import QuarterlyProjectIncludes from '../components/QuarterlyProjectIncludes'
import {
  QUARTERLY_INITIATIVE_PRICE,
  quarterlyInitiativePitch,
  quarterlyLargerProjectsNote,
  quarterlyNoContract,
} from '../quarterlyInitiative'

const CONTACT_BOOK = '/contact.html?interest=quarterly-initiative'

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
    title: 'Pick from the lineup',
    body: 'Choose any one project on the hands-on offer list—or we map your priority to the closest fit.',
  },
  {
    title: 'Define success and delivery',
    body: 'We agree on the outcome, timeline, and who does what before kickoff. No surprise scope.',
  },
  {
    title: 'Deliver through the quarter',
    body: 'I lead with your team or IT provider, hands-on where it counts, until the agreed outcome is met.',
  },
  {
    title: 'Industry evaluation',
    body: 'You receive a full report on peers, competition, and future readiness—the included evaluation valued at $3,800 on its own.',
  },
] as const

const partnerPoints = [
  {
    title: 'Proof before commitment',
    body: 'You see real results from one focused project before you decide on anything bigger.',
  },
  {
    title: 'Momentum that compounds',
    body: 'Each quarter can build on the last. A steady technology leader beats starting from scratch every time.',
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
              Any one lineup project. {QUARTERLY_INITIATIVE_PRICE}.
            </h1>
          </div>
          <QuarterlyInitiativeBadge />
          <p className="bp-sub">{quarterlyInitiativePitch}</p>
          <p className="qi-no-contract">{quarterlyNoContract}</p>
          <p className="bp-inline-cta">
            <a href="/hands-on">See expertise that&apos;s hard to hire</a>
          </p>
          <div className="bp-hero__actions" aria-label="Primary actions">
            <a className="bp-hero__btn bp-hero__btn--primary" href={CONTACT_BOOK}>
              Start my project
            </a>
            <a className="bp-hero__btn bp-hero__btn--secondary" href="#qi-process">
              See how it works
            </a>
          </div>
        </div>
      </section>

      <article className="bp-article qi-page__body">
        <section className="qi-section">
          <QuarterlyProjectIncludes showNoContract />
          <p className="qi-footnote">{quarterlyLargerProjectsNote}</p>
        </section>

        <section className="qi-section" aria-labelledby="qi-initiatives-title">
          <h2 id="qi-initiatives-title">Choose your project</h2>
          <p className="bp-lead">
            Examples of what you can tackle in one quarter—or{' '}
            <a href="/hands-on">browse the full hands-on lineup</a>.
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
          <h2 id="qi-process-title">How it works</h2>
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
          <h2 id="qi-cta-title">Pick your project</h2>
          <p className="bp-lead">
            {QUARTERLY_INITIATIVE_PRICE} for any one hands-on lineup project—including assessment, roadmap, delivery,
            executive readout, runbooks, 30-day support, and the closing industry peer evaluation.
          </p>
          <p>{quarterlyNoContract}</p>
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