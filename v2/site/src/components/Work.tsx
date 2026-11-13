import { featuredUseCases } from '../content'
import type { RemixVariant } from '../remixes/types'

export default function Work({
  variant,
  kicker,
}: {
  variant: RemixVariant;
  kicker?: string;
}) {
  return (
    <section className={`${variant}-work`} id="engagements">
      {kicker && <p className={`${variant}-work__kicker`}>{kicker}</p>}
      <h2 className={`${variant}-work__title`}>Featured use cases</h2>
      <div className={`${variant}-work__grid`}>
        {featuredUseCases.map((c) => (
          <article key={c.title} className={`${variant}-work-card`}>
            <h3>{c.title}</h3>
            <p>{c.blurb}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
