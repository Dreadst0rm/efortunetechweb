import { HandsOnLadder, HandsOnPageActions, HowIWorkStrip } from '../components/HandsOnShared'

export default function CloudMigrationPage() {
  return (
    <div className="bp-page ho-page">
      <section className="bp-hero ho-page__hero" aria-labelledby="cloud-hero-title">
        <div className="bp-hero__bg" aria-hidden="true" />
        <div className="bp-hero__content">
          <div className="bp-title-frame">
            <h1 id="cloud-hero-title" className="bp-title">
              Cloud moves with cost control and failover.
            </h1>
          </div>
          <p className="bp-sub">
            Planning and leading migration and consolidation—so you know what moves when, what it costs to run,
            and how you fail over if a region or provider stumbles.
          </p>
          <HandsOnPageActions />
        </div>
      </section>

      <article className="bp-article">
        <section aria-labelledby="cloud-what-title">
          <h2 id="cloud-what-title">What a cloud move includes</h2>
          <ul>
            <li>Inventory and dependency map—what must move together and what can wait.</li>
            <li>Phased migration plan with rollback paths, not a big-bang weekend.</li>
            <li>Cost model and guardrails so cloud spend does not quietly double after go-live.</li>
            <li>Failover and backup design sized for your risk—not a generic reference architecture.</li>
            <li>Runbooks and handoff so your team or MSP can operate what we land.</li>
          </ul>
          <p>
            <strong>Fixed project:</strong> typically $10,000–$50,000 depending on scope; priced in writing before work
            starts.
          </p>
        </section>

        <HowIWorkStrip />
        <HandsOnLadder />

        <section aria-labelledby="cloud-cta-title">
          <h2 id="cloud-cta-title">Plan the move</h2>
          <p className="bp-lead">
            <a href="/contact.html?interest=cloud-move">Start with a Resilience Snapshot</a> or{' '}
            <a href="/resilience-and-recovery">read about resilience and recovery</a> if failover is the urgent part.
          </p>
          <HandsOnPageActions />
        </section>
      </article>
    </div>
  )
}