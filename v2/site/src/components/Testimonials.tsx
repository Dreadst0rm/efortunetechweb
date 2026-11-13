import { testimonials } from '../content'
import type { RemixVariant } from '../remixes/types'

export default function Testimonials({
  variant,
  kicker,
}: {
  variant: RemixVariant;
  kicker?: string;
}) {
  return (
    <section className={`${variant}-testimonials`} id="clients">
      {kicker && <p className={`${variant}-testimonials__kicker`}>{kicker}</p>}
      <h2 className={`${variant}-testimonials__title`}>What Clients Say</h2>
      <div className={`${variant}-testimonials__grid`}>
        {testimonials.map((t) => (
          <figure key={t.author} className={`${variant}-testimonial-card`}>
            <blockquote>
              <p>{t.quote}</p>
            </blockquote>
            <figcaption>
              <span className={`${variant}-testimonial-card__author`}>{t.author}</span>
              <span className={`${variant}-testimonial-card__role`}>{t.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
