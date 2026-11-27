import { HandsOnLadder, HandsOnPageActions, HowIWorkStrip } from '../components/HandsOnShared'
import { outageReferences } from '../handsOn'

const PROJECT_PRICE = '$15,000–$20,000 depending on industry'

export default function ResilienceRecoveryPage() {
  return (
    <div className="bp-page ho-page">
      <section className="bp-hero ho-page__hero" aria-labelledby="rr-hero-title">
        <div className="bp-hero__bg" aria-hidden="true" />
        <div className="bp-hero__content">
          <div className="bp-title-frame">
            <h1 id="rr-hero-title" className="bp-title">
              Ride the storm when your cloud provider doesn&apos;t.
            </h1>
          </div>
          <p className="bp-sub">
            Multi-cloud backups, tested restore paths, and runbooks your team can follow when
            something fails—reduces risk and gives evidence for your auditor.
          </p>
          <HandsOnPageActions />
        </div>
      </section>

      <article className="bp-article">
        <section aria-labelledby="rr-what-title">
          <h2 id="rr-what-title">What you get</h2>
          <ul>
            <li>Recovery targets aligned with how your business actually runs—not generic RTO slides.</li>
            <li>Backup design that assumes a provider or region can fail, with restore tests on a schedule.</li>
            <li>Email, files, and critical systems mapped to a restore order that people can execute.</li>
            <li>Plain-English report plus technical appendix for your IT partner or internal team.</li>
          </ul>
          <p>
            <strong>Fixed project:</strong> {PROJECT_PRICE}
          </p>
        </section>

        <section className="ho-outages" aria-labelledby="rr-context-title">
          <h2 id="rr-context-title">Recent reminders</h2>
          <p>
            Cloud misconfiguration and vendor outages still delete or block access to production
            environments. Planning for provider failure is no longer optional for companies your size.
          </p>
          <ul>
            {outageReferences.map((ref) => (
              <li key={ref.href}>
                <a href={ref.href} rel="noopener noreferrer">
                  {ref.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <HowIWorkStrip />
        <HandsOnLadder />

        <section aria-labelledby="rr-cta-title">
          <h2 id="rr-cta-title">Ready to test the plan?</h2>
          <p className="bp-lead">Start with a free Resilience Snapshot, then scope the fixed project.</p>
          <HandsOnPageActions />
        </section>
      </article>
    </div>
  )
}