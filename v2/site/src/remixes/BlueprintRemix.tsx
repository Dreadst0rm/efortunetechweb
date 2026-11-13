import Cta from '../components/Cta'
import HeroBlueprintDraw from '../components/HeroBlueprintDraw'
import Services from '../components/Services'
import Testimonials from '../components/Testimonials'
import Work from '../components/Work'
import { site } from '../content'

export default function BlueprintRemix() {
  return (
    <div className="bp-page">
      <section className="bp-hero" id="top">
        <HeroBlueprintDraw />
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
