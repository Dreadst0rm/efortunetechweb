import { HandsOnLadder, HandsOnPageActions, HowIWorkStrip } from '../components/HandsOnShared'
import { pricingSummary } from '../pricing'

export default function MonitoringPage() {
  return (
    <div className="bp-page ho-page">
      <section className="bp-hero ho-page__hero" aria-labelledby="mon-hero-title">
        <div className="bp-hero__bg" aria-hidden="true" />
        <div className="bp-hero__content">
          <div className="bp-title-frame">
            <h1 id="mon-hero-title" className="bp-title">
              Know it&apos;s broken before your customers do.
            </h1>
          </div>
          <p className="bp-sub">
            Keystone monitoring for the email and domain signals small teams usually ignore—plus the
            same hands-on ladder if you need a deeper fix afterward.
          </p>
          <HandsOnPageActions />
        </div>
      </section>

      <article className="bp-article">
        <section aria-labelledby="mon-keystone-title">
          <h2 id="mon-keystone-title">Keystone monitoring</h2>
          <p>{pricingSummary.keystone.blurb}</p>
          <p>
            Keystone is the scanner behind the free check on my{' '}
            <a href="/contact.html#quick-check-island">contact page</a>. It looks at SPF, DMARC, MX,
            MTA-STS, TLS-RPT, and DNSSEC—the controls that stop email impersonation and keep domains
            trustworthy.
          </p>
          <p>
            <a href={pricingSummary.keystone.href}>Run the free check</a> or{' '}
            <a href="/contact.html?interest=resilience-snapshot">book a Resilience Snapshot</a> to talk
            about ongoing monitoring for your environment.
          </p>
        </section>

        <HowIWorkStrip />
        <HandsOnLadder />

        <section aria-labelledby="mon-cta-title">
          <h2 id="mon-cta-title">Catch issues early</h2>
          <HandsOnPageActions />
        </section>
      </article>
    </div>
  )
}