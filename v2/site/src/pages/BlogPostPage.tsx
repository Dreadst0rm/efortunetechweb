import type { BlogPost } from '../blog/schema'
import { blogPostPath, formatDisplayDate } from '../blog/dates'

export default function BlogPostPage({
  post,
  newer,
  older,
}: {
  post: BlogPost
  newer?: BlogPost
  older?: BlogPost
}) {
  const { date, title, summary, tone, sections, bottomLine } = post.data

  return (
    <article className="bp-digest bp-digest__issue">
      <p className="bp-digest__meta">
        <time dateTime={date}>{formatDisplayDate(date)}</time>
        {tone ? <span> · {tone}</span> : null}
      </p>
      <div className="bp-digest__vt-header" data-vt-date={date}>
        <h1>{title}</h1>
      </div>

      <section className="bp-digest__callout" aria-labelledby="blog-summary">
        <h2 id="blog-summary" className="bp-digest__visually-hidden">
          Summary
        </h2>
        <p>{summary}</p>
      </section>

      {sections.map((section) => (
        <section key={section.heading} className="bp-digest__section">
          <h2>{section.heading}</h2>
          <ul className="bp-digest__bullets">
            {section.bullets.map((bullet, i) => (
              <li key={`${section.heading}-${i}`}>{bullet}</li>
            ))}
          </ul>
          {section.sources && section.sources.length > 0 ? (
            <div>
              <p className="bp-digest__sources-label">Sources</p>
              <ul className="bp-digest__sources">
                {section.sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url} rel="noopener noreferrer">
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ))}

      <section className="bp-digest__bottom" aria-labelledby="blog-bottom">
        <h2 id="blog-bottom">Bottom line</h2>
        <p>{bottomLine}</p>
      </section>

      <nav className="bp-digest__pager" aria-label="Adjacent posts">
        {newer ? <a href={blogPostPath(newer.data.date)}>Newer: {newer.data.title}</a> : <span />}
        <a href="/blog/">All posts</a>
        {older ? <a href={blogPostPath(older.data.date)}>Older: {older.data.title}</a> : <span />}
      </nav>
    </article>
  )
}