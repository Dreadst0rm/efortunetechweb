import { HandsOnLadder, HandsOnPageActions, HowIWorkStrip } from '../components/HandsOnShared'
import { quarterlyNoContract, startWithQuarterlyLine } from '../quarterlyInitiative'

export default function AiPracticePage() {
  return (
    <div className="bp-page ho-page">
      <section className="bp-hero ho-page__hero" aria-labelledby="ai-hero-title">
        <div className="bp-hero__bg" aria-hidden="true" />
        <div className="bp-hero__content">
          <div className="bp-title-frame">
            <h1 id="ai-hero-title" className="bp-title">
              AI as a practice—not a pile of tools.
            </h1>
          </div>
          <p className="bp-sub">
            Help your company stand up AI as an ongoing capability: which use cases matter, where
            guardrails and data safety live, how you govern rollout, and how you measure payoff.
          </p>
          <HandsOnPageActions />
        </div>
      </section>

      <article className="bp-article">
        <section aria-labelledby="ai-what-title">
          <h2 id="ai-what-title">What we build together</h2>
          <ul>
            <li>Use-case selection tied to business outcomes—not demos that never ship.</li>
            <li>Guardrails for data handling, access, and acceptable use—written so legal and IT agree.</li>
            <li>Governance: who approves new tools, how experiments graduate to production, and how you say no.</li>
            <li>Measuring payoff: baselines, review cadence, and when to shut down work that does not earn its keep.</li>
            <li>Safe adoption patterns from organizations your size—reduces risk without pretending AI is risk-free.</li>
          </ul>
          <p>
            <strong>{startWithQuarterlyLine}</strong> {quarterlyNoContract}{' '}
            <a href="/quarterly-initiative">Quarterly Initiative details</a>.
          </p>
        </section>

        <HowIWorkStrip />
        <HandsOnLadder />

        <section aria-labelledby="ai-cta-title">
          <h2 id="ai-cta-title">Make AI repeatable</h2>
          <p className="bp-lead">
            <a href="/contact.html?interest=ai-practice">Book a Resilience Snapshot</a> and we will map where an
            AI practice fits your team.
          </p>
          <HandsOnPageActions />
        </section>
      </article>
    </div>
  )
}