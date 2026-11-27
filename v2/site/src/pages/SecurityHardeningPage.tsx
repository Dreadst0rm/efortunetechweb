import { HandsOnLadder, HandsOnPageActions, HowIWorkStrip } from '../components/HandsOnShared'

export default function SecurityHardeningPage() {
  return (
    <div className="bp-page ho-page">
      <section className="bp-hero ho-page__hero" aria-labelledby="sh-hero-title">
        <div className="bp-hero__bg" aria-hidden="true" />
        <div className="bp-hero__content">
          <div className="bp-title-frame">
            <h1 id="sh-hero-title" className="bp-title">
              Close the doors attackers actually use.
            </h1>
          </div>
          <p className="bp-sub">
            Identity and access, backups attackers can&apos;t reach, patching that stays current, and
            separate credentials per service—measured steps that reduce risk and support audit
            conversations.
          </p>
          <HandsOnPageActions />
        </div>
      </section>

      <article className="bp-article">
        <section aria-labelledby="sh-what-title">
          <h2 id="sh-what-title">What we harden</h2>
          <ul>
            <li>Sign-in and access: stronger authentication, least privilege, and break-glass that is tested.</li>
            <li>Backups and admin paths stored where ransomware can&apos;t reach them in one shot.</li>
            <li>Patch and configuration drift brought under control with evidence you can show an auditor.</li>
            <li>Email and domain protection using Keystone where it fits your size.</li>
            <li>One credential set per service—no shared admin passwords across the stack.</li>
          </ul>
          <p>
            <strong>Fixed project:</strong> $10,000–$20,000 depending on environment complexity.
          </p>
        </section>

        <HowIWorkStrip />
        <HandsOnLadder />

        <section aria-labelledby="sh-cta-title">
          <h2 id="sh-cta-title">See the gaps</h2>
          <p className="bp-lead">Start with a Resilience Snapshot, then scope hardening work in writing.</p>
          <HandsOnPageActions />
        </section>
      </article>
    </div>
  )
}