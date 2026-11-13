import type { DigestUpdate } from './schema'
import { digestUpdatePath } from './dates'

function escapeXml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

export function renderDigestRss(updates: DigestUpdate[], siteOrigin: string): string {
  const origin = siteOrigin.replace(/\/$/, '')
  const channelLink = `${origin}/digest/`
  const items = updates
    .map((update) => {
      const link = `${origin}${digestUpdatePath(update.data.date)}`
      const pub = new Date(`${update.data.date}T12:00:00.000Z`).toUTCString()
      return `    <item>
      <title>${escapeXml(update.data.title)}</title>
      <description>${escapeXml(update.data.summary)}</description>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${escapeXml(pub)}</pubDate>
    </item>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(`efortune.tech ${digestSiteName()}`)}</title>
    <description>${escapeXml(digestSiteDescription())}</description>
    <link>${escapeXml(channelLink)}</link>
    <language>en-us</language>
${items}
  </channel>
</rss>
`
}

function digestSiteName() {
  return 'Digest'
}

function digestSiteDescription() {
  return 'Short daily briefs on product reception, research, and independent coverage.'
}
