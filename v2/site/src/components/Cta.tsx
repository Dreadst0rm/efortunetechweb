import { site } from '../content'
import type { RemixVariant } from '../remixes/types'

export default function Cta({ variant }: { variant: RemixVariant }) {
  return (
    <section className={`${variant}-cta`} id="contact">
      <h2>{site.cta.kicker}</h2>
      <a className={`${variant}-cta__link`} href={site.cta.href}>
        {site.cta.label}
      </a>
    </section>
  )
}
