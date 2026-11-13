import type { DigestUpdate } from '../digest/schema'
import { digestUpdatePath, formatDisplayDate } from '../digest/dates'
import { digestSite } from '../digest/siteMeta'

export default function DigestIndexPage({ updates }: { updates: DigestUpdate[] }) {
  const latest = updates[0]
  const archive = updates.slice(1)

  return (
    <article className="bp-digest">
      <header className="bp-digest__hero">
        <p className="bp-kicker">{digestSite.tagline}</p>
        <h1>{digestSite.name}</h1>
        <p className="bp-lead">
          Short research and reception briefs for growing companies—what changed in infrastructure,
          security, and AI that might affect your roadmap, with the latest up top.
        </p>
      </header>

      <div id="digest-filters" className="bp-digest-filters-mount" />

      {latest ? (
        <section className="bp-digest__section" aria-labelledby="digest-latest">
          <h2 id="digest-latest">Latest</h2>
          <a
            className="bp-digest__card bp-digest__card--featured"
            href={digestUpdatePath(latest.data.date)}
            data-digest-date={latest.data.date}
            data-vt-date={latest.data.date}
          >
            <p className="bp-digest__meta">
              <time dateTime={latest.data.date}>{formatDisplayDate(latest.data.date)}</time>
              {latest.data.tone ? <span> · {latest.data.tone}</span> : null}
            </p>
            <h3>{latest.data.title}</h3>
            <p>{latest.data.summary}</p>
          </a>
        </section>
      ) : (
        <p className="bp-lead">No issues published yet.</p>
      )}

      <section className="bp-digest__section" aria-labelledby="digest-archive">
        <h2 id="digest-archive">Archive</h2>
        {archive.length > 0 ? (
          <ol className="bp-digest__archive">
            {archive.map((update) => (
              <li key={update.id}>
                <a
                  className="bp-digest__card"
                  href={digestUpdatePath(update.data.date)}
                  data-digest-date={update.data.date}
                  data-vt-date={update.data.date}
                >
                  <p className="bp-digest__meta">
                    <time dateTime={update.data.date}>{formatDisplayDate(update.data.date)}</time>
                  </p>
                  <h3>{update.data.title}</h3>
                  <p>{update.data.summary}</p>
                </a>
              </li>
            ))}
          </ol>
        ) : (
          <p className="bp-lead">The archive will grow as new issues are added.</p>
        )}
      </section>

      <section className="bp-digest__section" aria-labelledby="digest-how">
        <h2 id="digest-how">How Digest works</h2>
        <p>
          Digest publishes short research and reception briefs for operators. Pages stay stable; each
          new day is one JSON file in the build.
        </p>
        <p>
          Each issue lives at <code>/digest/updates/YYYY-MM-DD/</code> with a title, summary,
          optional tone, sections with bullets and labeled source links, and a bottom line you can
          act on. Sources are public coverage links, not invented metrics. Some issues link to the{' '}
          <a href="https://secure.efortune.tech">secure.efortune.tech member library</a> where deeper
          material already lives—we keep those links as written.
        </p>
        <p>
          Subscribe via <a href="/digest/rss.xml">/digest/rss.xml</a> (RSS 2.0).
        </p>
      </section>
    </article>
  )
}
