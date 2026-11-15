import { caseStudies } from '../content'

export default function CaseStudiesPage() {
  return (
    <article className="bp-article bp-cs-page">
      <header>
        <h1>Case studies</h1>
        <p className="bp-lead">
          Before Efortune — selected work from my years as an employee, described by company type
          only.
        </p>
      </header>

      {caseStudies.map((c) => (
        <section key={c.id} id={c.id} className="bp-cs-detail">
          <p className="bp-cs-detail__tags">{c.pillars.join(' · ')}</p>
          <h2>{c.title}</h2>
          <p className="bp-cs-detail__type">
            <em>{c.companyType}</em>
          </p>
          <h3>Problem</h3>
          <p>{c.problem}</p>
          <h3>What I did</h3>
          <p>{c.did}</p>
          <h3>Outcome</h3>
          <p>{c.outcome}</p>
        </section>
      ))}

      <p className="bp-inline-cta">
        If you lead a company of 50 to 2,000 employees and want to work like this together,{' '}
        <a href="/contact.html">let&apos;s talk</a>.
      </p>
    </article>
  )
}
