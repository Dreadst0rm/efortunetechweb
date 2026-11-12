import Cta from '../components/Cta'
import Services from '../components/Services'
import Testimonials from '../components/Testimonials'
import Work from '../components/Work'
import { site } from '../content'

export default function BlueprintRemix() {
  return (
    <div className="bp-page">
      <section className="bp-hero" id="top">
        <div className="bp-grid" aria-hidden="true" />
        <div className="bp-crosshair" aria-hidden="true" />
        <div className="bp-stamp" aria-hidden="true">
          APPROVED
        </div>
        <div className="bp-frame" aria-hidden="true" />
        <span className="bp-note" aria-hidden="true">
          REV A — SCALE 1:1
        </span>
        <div className="bp-hero__content">
          <p className="bp-kicker">{site.kicker}</p>
          <h1 className="bp-title">{site.h1}</h1>
          <p className="bp-sub">
            I help organizations turn technology strategy into executable outcomes.
          </p>
        </div>
      </section>

      <Services variant="bp" kicker="Sheet 01 / 03 — Services" />
      <Work variant="bp" kicker="Sheet 02 / 03 — Engagements" />
      <Testimonials variant="bp" kicker="Sheet 03 / 03 — Client Notes" />

      <Cta variant="bp" />
    </div>
  )
}
