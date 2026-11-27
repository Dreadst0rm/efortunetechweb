import { pillars } from '../content'
import { pricingSummary, pricingTiers } from '../pricing'

export default function ServicesPage() {
  return (
    <article className="bp-article bp-services-page">
      <header>
        <h1>Services</h1>
        <p className="bp-lead">
          Straightforward options from an hour of advice through interim CIO coverage, including
          resilience, disaster recovery, performance, scale, and security—with hands-on delivery when
          the work needs a senior engineer in the room.
        </p>
      </header>

      {pillars.map((p) => (
        <section key={p.id} id={p.id} className="bp-services-page__pillar">
          <h2>{p.title}</h2>
          <p>{p.blurb}</p>
          <p>
            <strong>Proof:</strong> {p.proof}
          </p>
        </section>
      ))}

      <section className="bp-services-page__pricing" aria-labelledby="pricing-summary">
        <h2 id="pricing-summary">Pricing at a glance</h2>
        <p>{pricingSummary.intro}</p>
        <ul className="bp-pricing-brief">
          {pricingTiers.map((t) => (
            <li key={t.id}>
              <strong>{t.title}</strong> — {t.price}
            </li>
          ))}
        </ul>
        <p>
          <a href="/pricing.html">Full pricing details</a>
        </p>
      </section>

      <p className="bp-inline-cta">
        <a href="/contact.html?interest=resilience-snapshot">Book a free Resilience Snapshot</a>
      </p>
    </article>
  )
}
