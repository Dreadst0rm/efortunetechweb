import { HandsOnLadder, HandsOnPageActions, HowIWorkStrip } from '../components/HandsOnShared'
import HubOfferLinks from '../components/HubOfferLinks'
import {
  hardToHireOutcomes,
  handsOnTechnicalPages,
  hubComparisonRows,
  hubPrimaryOffers,
  outageReferences,
} from '../handsOn'

function outcomeLabels(ids: readonly string[]) {
  return ids
    .map((id) => hardToHireOutcomes.find((o) => o.id === id)?.title)
    .filter(Boolean)
    .join(', ')
}

export default function HandsOnHubPage() {
  return (
    <div className="bp-page ho-page">
      <section className="bp-hero ho-page__hero" aria-labelledby="ho-hero-title">
        <div className="bp-hero__bg" aria-hidden="true" />
        <div className="bp-hero__content">
          <div className="bp-title-frame">
            <h1 id="ho-hero-title" className="bp-title">
              Expertise that&apos;s hard to hire.
            </h1>
          </div>
          <p className="bp-sub">
            Senior, hands-on work for stability, security, scalability, and resiliency—fixed scope and
            fixed price when you need a project, or ongoing leadership when you need a partner.
          </p>
          <HandsOnPageActions />
        </div>
      </section>

      <article className="bp-article ho-page__body">
        <section className="ho-outcomes" aria-labelledby="ho-outcomes-title">
          <h2 id="ho-outcomes-title">Four outcomes</h2>
          <p className="bp-lead">
            These are the problems companies struggle to staff: keeping systems stable, staying secure,
            scaling without surprise, and recovering when something breaks.
          </p>
          <ul className="ho-outcomes__grid">
            {hardToHireOutcomes.map((item) => (
              <li key={item.id} className="bp-service-card ho-outcomes__card">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="ho-lineup-title">
          <h2 id="ho-lineup-title">The offer lineup</h2>
          <p className="bp-lead">
            Each engagement starts the same way: a free Resilience Snapshot, then a written fixed-price
            scope—or a retainer when you need a technology leader on call.
          </p>
          <div className="ho-offer-list">
            {hubPrimaryOffers.map((offer) => (
              <article key={offer.id} className="ho-offer bp-service-card" id={offer.id}>
                <p className="ho-offer__meta">
                  <span className="ho-offer__outcomes">{outcomeLabels(offer.outcomes)}</span>
                </p>
                <h3>{offer.title}</h3>
                <p>{offer.summary}</p>
                <HubOfferLinks links={offer.links} />
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="ho-technical-title">
          <h2 id="ho-technical-title">Focused technical projects</h2>
          <p className="bp-lead">
            When the need is narrow and measurable, these fixed-price paths still use the same ladder.
          </p>
          <div className="ho-service-grid">
            {handsOnTechnicalPages.map((page) => (
              <article key={page.href} className="bp-service-card">
                <p className="ho-offer__meta">
                  <span className="ho-offer__outcomes">{outcomeLabels(page.outcomes)}</span>
                </p>
                <h3>
                  <a href={page.href}>{page.label}</a>
                </h3>
                <p>{page.blurb}</p>
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
            No obligation—a short call and a quick look at two public pages before we scope anything
            larger.
          </p>
          <HandsOnPageActions />
        </section>
      </article>
    </div>
  )
}