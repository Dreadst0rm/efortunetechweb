import {
  engagementLadder,
  howIWorkStrip,
  primaryCta,
  secondaryCta,
} from '../handsOn'

export function HandsOnLadder({ id = 'engagement-ladder' }: { id?: string }) {
  return (
    <section className="ho-ladder" aria-labelledby={id}>
      <h2 id={id}>How engagements start</h2>
      <ol className="ho-ladder__list">
        {engagementLadder.map((step) => (
          <li key={step.step} className="ho-ladder__item">
            <span className="ho-ladder__step" aria-hidden="true">
              {step.step}
            </span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              <p>
                <a className="bp-cta-link" href={step.cta.href}>
                  {step.cta.label}
                </a>
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function HowIWorkStrip({ id = 'how-i-work' }: { id?: string }) {
  return (
    <section className="ho-how" aria-labelledby={id}>
      <h2 id={id}>How I work</h2>
      <ul className="ho-how__grid">
        {howIWorkStrip.map((item) => (
          <li key={item.title} className="ho-how__card">
            <strong>{item.title}</strong>
            <p>{item.body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function HandsOnPageActions() {
  return (
    <div className="ho-actions" aria-label="Primary actions">
      <a className="bp-hero__btn bp-hero__btn--primary" href={primaryCta.href}>
        {primaryCta.label}
      </a>
      <a className="bp-hero__btn bp-hero__btn--secondary" href={secondaryCta.href}>
        {secondaryCta.label}
      </a>
    </div>
  )
}