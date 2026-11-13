import { pillars, site, testimonials } from '../content'

export default function AboutPage() {
  return (
    <article className="bp-article bp-about-page">
      <header className="bp-about-page__header">
        <div>
          <h1>About Ed Fortune</h1>
          <p className="bp-lead">
            I help leadership teams of 60 to 900 people decide where technology money goes so it
            grows the business—without hiring a full-time CIO.
          </p>
        </div>
        <figure className="bp-about-page__photo">
          <img src="/assets/hero.png" alt="Ed Fortune" width={320} height={320} loading="lazy" />
        </figure>
      </header>

      <section>
        <h2>Background</h2>
        <p>
          I have spent 20+ years in technology leadership (27 years in the field overall), spanning
          development, infrastructure, operations, and security. My work includes identity and
          passwordless sign-in, data center resiliency, network segmentation, Microsoft 365
          platforms, and endpoint strategy.
        </p>
        <p>{site.hero.trackRecord}</p>
        <p>
          I founded and ran a 450-member internal technical community at an enterprise
          email-security vendor—peer learning at scale without vendor hype.
        </p>
      </section>

      <section>
        <h2>Keystone</h2>
        <p>
          I build{' '}
          <a href="https://keystone.efortune.tech" rel="noopener noreferrer">
            Keystone
          </a>
          , an email and domain security scanner for small companies that usually only get
          checklists. It is the same tool behind the free check on my contact page.
        </p>
      </section>

      <section>
        <h2>How I work</h2>
        <p>
          I operate across four pillars—development, infrastructure platforms, operations, and
          security—and fold in AI only where it is safe and measurable.
        </p>
        <ul>
          {pillars.map((p) => (
            <li key={p.id}>
              <strong>{p.title}:</strong> {p.blurb}
            </li>
          ))}
        </ul>
      </section>

      <section className="bp-about-page__quotes">
        <h2>What colleagues say</h2>
        {testimonials.map((t) => (
          <figure key={t.author}>
            <blockquote>
              <p>&ldquo;{t.quote}&rdquo;</p>
            </blockquote>
            <figcaption>
              — {t.author}, {t.role}
            </figcaption>
          </figure>
        ))}
      </section>

      <section>
        <h2>Availability</h2>
        <p>
          Based in the Chicago area, I work with leadership teams across North America as a
          fractional CIO, vCIO, or interim CIO during transitions.
        </p>
        <p>
          <a href={site.linkedIn} rel="noopener noreferrer">
            LinkedIn profile
          </a>
        </p>
        <p>
          <a href="/contact.html">Book a 30-minute call</a>
        </p>
      </section>
    </article>
  )
}
