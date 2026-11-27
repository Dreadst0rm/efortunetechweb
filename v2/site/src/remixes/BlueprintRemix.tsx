import Cta from '../components/Cta'
import HeroBlueprintDraw from '../components/HeroBlueprintDraw'
import QuarterlyInitiativeBadge from '../components/QuarterlyInitiativeBadge'
import Testimonials from '../components/Testimonials'
import { featuredUseCases, pillars, site } from '../content'

export default function BlueprintRemix() {
  return (
    <div className="bp-page">
      <section className="bp-hero" id="top">
        <div className="bp-hero__bg" aria-hidden="true" />
        <HeroBlueprintDraw />
        <div className="bp-hero__content">
          <p className="bp-kicker">{site.hero.kicker}</p>
          <div className="bp-title-frame">
            <h1 className="bp-title">{site.hero.h1}</h1>
          </div>
          <QuarterlyInitiativeBadge />
          <p className="bp-hero__tagline">{site.hero.tagline}</p>
          <p className="bp-sub">{site.hero.subhead}</p>
          <div className="bp-hero__actions" aria-label="Primary actions">
            <a className="bp-hero__btn bp-hero__btn--primary" href={site.cta.href}>
              {site.cta.label}
            </a>
            <a className="bp-hero__btn bp-hero__btn--secondary" href={site.cta.secondaryHref}>
              {site.cta.secondaryLabel}
            </a>
          </div>
          <p className="bp-hero__pricing">
            <a href="/pricing.html">See pricing</a>
          </p>
          <p className="bp-hero__track">
            {site.hero.trackRecord}{' '}
            <a href={site.linkedIn} rel="noopener noreferrer">
              LinkedIn profile
            </a>
          </p>
        </div>
      </section>

      <section className="bp-services" id="pillars">
        <p className="bp-services__kicker">Expertise that&apos;s hard to hire</p>
        <h2 className="bp-services__title">Stability, security, scalability, resiliency</h2>
        <p className="bp-services__lead">
          Fixed-price hands-on projects and ongoing leadership—{' '}
          <a href="/hands-on">see the full offer lineup</a>.
        </p>
        <div className="bp-services__grid">
          {pillars.map((p) => (
            <article key={p.id} className="bp-service-card">
              <h3>{p.title}</h3>
              <p>{p.blurb}</p>
            </article>
          ))}
        </div>
        <p className="bp-inline-cta">
          <a href="/services.html">Full services and proof points</a>
        </p>
      </section>

      <section className="bp-work" id="use-cases">
        <p className="bp-work__kicker">Before Efortune</p>
        <h2 className="bp-work__title">Featured use cases</h2>
        <div className="bp-work__grid">
          {featuredUseCases.map((c) => (
            <article key={c.title} className="bp-work-card">
              <h3>{c.title}</h3>
              <p>{c.blurb}</p>
              <a href={c.href} className="bp-work-card__link">
                Read the full case
              </a>
            </article>
          ))}
        </div>
        <p className="bp-inline-cta">
          <a href="/case-studies.html">All case studies</a>
        </p>
      </section>

      <Testimonials variant="bp" kicker="What colleagues say" title="What colleagues say" />

      <Cta variant="bp" />
    </div>
  )
}
