import { HandsOnLadder, HandsOnPageActions, HowIWorkStrip } from '../components/HandsOnShared'
import { quarterlyNoContract, startWithQuarterlyLine } from '../quarterlyInitiative'

export default function ZeroTrustPage() {
  return (
    <div className="bp-page ho-page">
      <section className="bp-hero ho-page__hero" aria-labelledby="zt-hero-title">
        <div className="bp-hero__bg" aria-hidden="true" />
        <div className="bp-hero__content">
          <div className="bp-title-frame">
            <h1 id="zt-hero-title" className="bp-title">
              Identity-based access instead of a wide-open VPN.
            </h1>
          </div>
          <p className="bp-sub">
            Zero trust networking for companies your size: verify each user and device before they reach an app—fewer
            standing network doors, better experience for remote and hybrid work. Vendor-neutral design.
          </p>
          <HandsOnPageActions />
        </div>
      </section>

      <article className="bp-article">
        <section aria-labelledby="zt-what-title">
          <h2 id="zt-what-title">What changes</h2>
          <ul>
            <li>Applications published with identity and policy checks—not “on the VPN, so you can reach everything.”</li>
            <li>Strong sign-in and step-up authentication for sensitive apps and admin roles.</li>
            <li>Device posture and least-privilege access—defaults that reduce lateral movement if an account is stolen.</li>
            <li>Migration path off legacy remote access without stranding road warriors or plant-floor users.</li>
            <li>Documentation your IT partner can operate—no proprietary lock-in required in the write-up.</li>
          </ul>
          <p>
            <strong>{startWithQuarterlyLine}</strong> {quarterlyNoContract}{' '}
            <a href="/quarterly-initiative">Quarterly Initiative details</a>.
          </p>
        </section>

        <HowIWorkStrip />
        <HandsOnLadder />

        <section aria-labelledby="zt-cta-title">
          <h2 id="zt-cta-title">Close the VPN blast radius</h2>
          <p className="bp-lead">
            <a href="/contact.html?interest=zero-trust">Book a Resilience Snapshot</a> to review identity and remote
            access as it works today.
          </p>
          <HandsOnPageActions />
        </section>
      </article>
    </div>
  )
}