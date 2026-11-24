import type { BlogPost } from '../blog/schema'
import { blogPostPath, formatDisplayDate } from '../blog/dates'
import { blogSite } from '../blog/siteMeta'

export default function BlogIndexPage({ posts }: { posts: BlogPost[] }) {
  const latest = posts[0]
  const archive = posts.slice(1)

  return (
    <article className="bp-digest">
      <header className="bp-digest__hero">
        <p className="bp-kicker">{blogSite.tagline}</p>
        <h1>{blogSite.name}</h1>
        <p className="bp-lead">
          Short research and reception briefs for growing companies—what changed in infrastructure,
          security, and AI that might affect your roadmap, with the latest up top.
        </p>
      </header>

      <div id="blog-filters" className="bp-digest-filters-mount" />

      <div
        id="blog-filter-empty"
        className="bp-digest__empty"
        hidden
        role="status"
        aria-live="polite"
      >
        <p>No posts match your filters.</p>
        <p className="bp-digest__empty-hint">
          Try a broader search, another topic, or{' '}
          <button type="button" id="blog-filter-empty-clear" className="bp-digest__empty-link">
            clear filters
          </button>{' '}
          to see everything again.
        </p>
      </div>

      {latest ? (
        <section className="bp-digest__section" data-digest-section="latest" aria-labelledby="blog-latest">
          <h2 id="blog-latest">Latest</h2>
          <a
            className="bp-digest__card bp-digest__card--featured"
            href={blogPostPath(latest.data.date)}
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
        <p className="bp-lead">No posts published yet.</p>
      )}

      <section className="bp-digest__section" data-digest-section="archive" aria-labelledby="blog-archive">
        <h2 id="blog-archive">Archive</h2>
        {archive.length > 0 ? (
          <ol className="bp-digest__archive">
            {archive.map((post) => (
              <li key={post.id}>
                <a
                  className="bp-digest__card"
                  href={blogPostPath(post.data.date)}
                  data-digest-date={post.data.date}
                  data-vt-date={post.data.date}
                >
                  <p className="bp-digest__meta">
                    <time dateTime={post.data.date}>{formatDisplayDate(post.data.date)}</time>
                  </p>
                  <h3>{post.data.title}</h3>
                  <p>{post.data.summary}</p>
                </a>
              </li>
            ))}
          </ol>
        ) : (
          <p className="bp-lead">The archive will grow as new posts are added.</p>
        )}
      </section>

      <footer className="bp-digest__feed">
        <p>
          <a href="/blog/rss.xml">RSS feed</a> for readers and tools that subscribe to updates.
        </p>
      </footer>
    </article>
  )
}