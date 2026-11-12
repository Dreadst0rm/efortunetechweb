import { services } from '../content'
import type { RemixVariant } from '../remixes/types'

export default function Services({
  variant,
  kicker,
}: {
  variant: RemixVariant;
  kicker?: string;
}) {
  return (
    <section className={`${variant}-services`} id="services">
      {kicker && <p className={`${variant}-services__kicker`}>{kicker}</p>}
      <h2 className={`${variant}-services__title`}>How I Help</h2>
      <div className={`${variant}-services__grid`}>
        {services.map((s) => (
          <article key={s.title} className={`${variant}-service-card`}>
            <h3>{s.title}</h3>
            <p>{s.blurb}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
