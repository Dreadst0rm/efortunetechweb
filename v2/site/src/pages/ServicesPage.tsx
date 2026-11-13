import { pillars } from '../content'
import { pricingSummary, pricingTiers } from '../pricing'

export default function ServicesPage() {
  return (
    <article className="bp-article bp-services-page">
      <header>
        <h1>Services</h1>
        <p className="bp-lead">
          Fractional CIO and vCIO leadership across development, infrastructure, operations, and
          security—with AI folded in where it helps, always with guardrails.
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
        <a href="/contact.html">Book a 30-minute call</a>
      </p>
    </article>
  )
}
