import { HandsOnLadder, HandsOnPageActions, HowIWorkStrip } from '../components/HandsOnShared'
import { quarterlyNoContract, startWithQuarterlyLine } from '../quarterlyInitiative'

export default function PerformanceScalePage() {
  return (
    <div className="bp-page ho-page">
      <section className="bp-hero ho-page__hero" aria-labelledby="ps-hero-title">
        <div className="bp-hero__bg" aria-hidden="true" />
        <div className="bp-hero__content">
          <div className="bp-title-frame">
            <h1 id="ps-hero-title" className="bp-title">
              Fast today, still fast when you&apos;re twice the size.
            </h1>
          </div>
          <p className="bp-sub">
            Load-test-and-fix: measure what users feel today, fix the bottlenecks, and prove the
            before-and-after with numbers your leadership can trust.
          </p>
          <HandsOnPageActions />
        </div>
      </section>

      <article className="bp-article">
        <section aria-labelledby="ps-what-title">
          <h2 id="ps-what-title">Load-test-and-fix</h2>
          <ul>
            <li>Baseline measurements on the paths that matter—checkout, login, APIs, or internal apps.</li>
            <li>Targeted fixes for database, caching, network, or code hotspots—not a rewrite for sport.</li>
            <li>Repeatable load tests so you see improvement, not gut feel.</li>
            <li>Capacity notes so the next growth spike is planned, not discovered at 2 a.m.</li>
          </ul>
          <p>
            <strong>{startWithQuarterlyLine}</strong> {quarterlyNoContract} Larger scoped engagements:
            $12,000–$25,000 depending on stack and traffic shape.{' '}
            <a href="/quarterly-initiative">Quarterly Initiative details</a>.
          </p>
        </section>

        <HowIWorkStrip />
        <HandsOnLadder />

        <section aria-labelledby="ps-cta-title">
          <h2 id="ps-cta-title">Find what&apos;s slow</h2>
          <p className="bp-lead">Book a Resilience Snapshot and we&apos;ll pick the right measurement plan.</p>
          <HandsOnPageActions />
        </section>
      </article>
    </div>
  )
}