import type { BlogPost } from './schema'
import { blogPostPath } from './dates'
import { blogSite } from './siteMeta'

function escapeXml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

export function renderBlogRss(posts: BlogPost[], siteOrigin: string): string {
  const origin = siteOrigin.replace(/\/$/, '')
  const channelLink = `${origin}/blog/`
  const feedUrl = `${origin}/blog/rss.xml`
  const items = posts
    .map((post) => {
      const link = `${origin}${blogPostPath(post.data.date)}`
      const pub = new Date(`${post.data.date}T12:00:00.000Z`).toUTCString()
      return `    <item>
      <title>${escapeXml(post.data.title)}</title>
      <description>${escapeXml(post.data.summary)}</description>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${escapeXml(pub)}</pubDate>
    </item>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`efortune.tech ${blogSite.name}`)}</title>
    <description>${escapeXml(blogSite.description)}</description>
    <link>${escapeXml(channelLink)}</link>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
    <language>en-us</language>
${items}
  </channel>
</rss>
`
}