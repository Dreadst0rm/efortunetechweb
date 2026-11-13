import { caseStudies } from '../content'

export default function CaseStudiesPage() {
  return (
    <article className="bp-article bp-cs-page">
      <h1>Case Studies</h1>
      <p className="bp-lead">
        Selected engagements where clear architecture direction improved cost, speed, or reliability.
      </p>

      <div id="case-studies-island" className="bp-cs-mount" tabIndex={-1} />

      <noscript>
        <section>
          {caseStudies.map((c) => (
            <div key={c.title}>
              <h2>{c.tag}</h2>
              <h3>{c.title}</h3>
              <p>{c.blurb}</p>
            </div>
          ))}
        </section>
      </noscript>

      <section className="bp-cs-fallback" aria-label="Case study summaries">
        {caseStudies.map((c) => (
          <div key={c.title} className="bp-cs-fallback__item">
            <h2>{c.tag}</h2>
            <h3>{c.title}</h3>
            <p>{c.blurb}</p>
          </div>
        ))}
      </section>
    </article>
  )
}
