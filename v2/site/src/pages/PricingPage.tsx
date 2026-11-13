import { pricingSummary, pricingTiers } from '../pricing'

export default function PricingPage() {
  return (
    <article className="bp-article bp-pricing-page">
      <header>
        <h1>Pricing</h1>
        <p className="bp-lead">{pricingSummary.intro}</p>
      </header>

      {pricingTiers.map((tier) => (
        <section key={tier.id} className="bp-pricing-tier">
          <h2>{tier.title}</h2>
          <p className="bp-pricing-tier__price">{tier.price}</p>
          <p>{tier.detail}</p>
          {'children' in tier && tier.children ? (
            <div className="bp-pricing-tier__split">
              {tier.children.map((child) => (
                <div key={child.title} className="bp-pricing-tier__option">
                  <h3>{child.title}</h3>
                  <p className="bp-pricing-tier__price">{child.price}</p>
                  <p>{child.detail}</p>
                  <p>
                    <a className="bp-cta-link" href={child.cta.href}>
                      {child.cta.label}
                    </a>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>
              <a className="bp-cta-link" href={tier.cta.href}>
                {tier.cta.label}
              </a>
            </p>
          )}
        </section>
      ))}

      <section className="bp-pricing-keystone">
        <h2>{pricingSummary.keystone.title}</h2>
        <p>{pricingSummary.keystone.blurb}</p>
        <p>
          <a href={pricingSummary.keystone.href}>Run the free check</a>
        </p>
      </section>
    </article>
  )
}
