import { HandsOnLadder, HandsOnPageActions, HowIWorkStrip } from '../components/HandsOnShared'
import { handsOnServiceLinks, hubComparisonRows, outageReferences } from '../handsOn'

export default function HandsOnHubPage() {
  return (
    <div className="bp-page ho-page">
      <section className="bp-hero ho-page__hero" aria-labelledby="ho-hero-title">
        <div className="bp-hero__bg" aria-hidden="true" />
        <div className="bp-hero__content">
          <div className="bp-title-frame">
            <h1 id="ho-hero-title" className="bp-title">
              When it has to work, I build it myself.
            </h1>
          </div>
          <p className="bp-sub">
            Senior, hands-on engineering for resilience, recovery, performance and security. Fixed
            scope, fixed price, done in weeks.
          </p>
          <HandsOnPageActions />
        </div>
      </section>

      <article className="bp-article ho-page__body">
        <section aria-labelledby="ho-services-title">
          <h2 id="ho-services-title">Fixed-price projects</h2>
          <p className="bp-lead">
            Pick the problem that hurts most. Each engagement uses the same ladder: snapshot, fixed
            project, then ongoing support if you want it.
          </p>
          <div className="ho-service-grid">
            {handsOnServiceLinks.map((link) => (
              <article key={link.href} className="bp-service-card">
                <h3>
                  <a href={link.href}>{link.label}</a>
                </h3>
              </article>
            ))}
          </div>
        </section>

        <section className="ho-comparison" aria-labelledby="ho-compare-title">
          <h2 id="ho-compare-title">Ways to work together</h2>
          <table>
            <thead>
              <tr>
                <th scope="col">You need</th>
                <th scope="col">Option</th>
                <th scope="col">Typical price</th>
              </tr>
            </thead>
            <tbody>
              {hubComparisonRows.map((row) => (
                <tr key={row.need}>
                  <td>{row.need}</td>
                  <td>{row.offer}</td>
                  <td>{row.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="bp-inline-cta">
            <a href="/quarterly-initiative">Quarterly Initiative details</a>
          </p>
        </section>

        <HowIWorkStrip />
        <HandsOnLadder />

        <section className="ho-outages" aria-labelledby="ho-why-title">
          <h2 id="ho-why-title">Why this matters</h2>
          <p>
            Provider outages and misconfigurations still take companies offline—even when backups
            exist. Recent examples include a major pension fund losing access to its Google Cloud
            environment in May 2024 and the global IT disruption tied to a CrowdStrike software update
            in July 2024.
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

        <section aria-labelledby="ho-cta-title">
          <h2 id="ho-cta-title">Start with a snapshot</h2>
          <p className="bp-lead">
            No obligation—a short call and a quick look at two public pages before we scope
            anything larger.
          </p>
          <HandsOnPageActions />
        </section>
      </article>
    </div>
  )
}
