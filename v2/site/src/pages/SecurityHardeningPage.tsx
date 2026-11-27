import { HandsOnLadder, HandsOnPageActions, HowIWorkStrip } from '../components/HandsOnShared'
import { cyberInsuranceReference } from '../handsOn'

export default function SecurityHardeningPage() {
  return (
    <div className="bp-page ho-page">
      <section className="bp-hero ho-page__hero" aria-labelledby="sh-hero-title">
        <div className="bp-hero__bg" aria-hidden="true" />
        <div className="bp-hero__content">
          <div className="bp-title-frame">
            <h1 id="sh-hero-title" className="bp-title">
              Cyber protection and a 3–5 year security roadmap.
            </h1>
          </div>
          <p className="bp-sub">
            Near-term hardening plus a written protection plan for the next 3–5 years—identity, backups, patching,
            and separate credentials per service. Measured steps that reduce risk and help you answer tough questions
            from leadership, auditors, and insurers.
          </p>
          <HandsOnPageActions />
        </div>
      </section>

      <article className="bp-article">
        <section aria-labelledby="sh-roadmap-title">
          <h2 id="sh-roadmap-title">The 3–5 year roadmap</h2>
          <p>
            A slide deck is not a plan. You get a phased roadmap: what to fix this quarter, what to fund next year, and
            what “good” looks like in 3–5 years—aligned to how your business actually runs, not a generic enterprise
            checklist.
          </p>
          <ul>
            <li>Prioritized controls by risk and effort—not everything at once.</li>
            <li>Owner, budget band, and success measures for each phase.</li>
            <li>Incident response and recovery steps your team can rehearse.</li>
            <li>Email and domain protection with Keystone where it fits your size.</li>
          </ul>
        </section>

        <section aria-labelledby="sh-now-title">
          <h2 id="sh-now-title">Near-term hardening (first project)</h2>
          <ul>
            <li>Sign-in and access: stronger authentication, least privilege, and break-glass that is tested.</li>
            <li>Backups and admin paths stored where ransomware cannot reach them in one shot.</li>
            <li>Patch and configuration drift under control with evidence you can show an auditor.</li>
            <li>One credential set per service—no shared admin passwords across the stack.</li>
          </ul>
          <p>
            <strong>Fixed project:</strong> $10,000–$20,000 depending on environment complexity.
          </p>
        </section>

        <section aria-labelledby="sh-insurance-title">
          <h2 id="sh-insurance-title">Cyber insurance readiness</h2>
          <p>
            Many companies need or renew cyber insurance while their controls are still catching up. Insurers commonly
            ask about practices such as:
          </p>
          <ul>
            <li>Multi-factor authentication for email, remote access, and privileged accounts</li>
            <li>Offline, immutable, or otherwise protected backups—and restore tests on a schedule</li>
            <li>Endpoint protection and timely patching</li>
            <li>Privileged access management and separation of duties</li>
            <li>A written incident response plan your team has reviewed</li>
          </ul>
          <p>
            I help you close gaps and prepare plain-language evidence for the application. This does not guarantee
            coverage, lower premiums, or compliance with any standard—it helps you answer the insurer&apos;s questions
            honestly and show progress where you still have work to do.
          </p>
          <p>
            For general guidance on baseline practices, see{' '}
            <a href={cyberInsuranceReference.href} rel="noopener noreferrer">
              {cyberInsuranceReference.label}
            </a>
            .
          </p>
          <p>
            <a className="bp-cta-link" href="/contact.html?interest=cyber-insurance-readiness">
              Talk about cyber insurance readiness
            </a>
          </p>
        </section>

        <HowIWorkStrip />
        <HandsOnLadder />

        <section aria-labelledby="sh-cta-title">
          <h2 id="sh-cta-title">See the gaps</h2>
          <p className="bp-lead">Start with a Resilience Snapshot, then scope the roadmap and first project in writing.</p>
          <HandsOnPageActions />
        </section>
      </article>
    </div>
  )
}