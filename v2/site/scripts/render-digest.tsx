import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import Shell from '../src/layout/Shell'
import { loadDigestUpdates } from '../src/digest/loadUpdates'
import { digestUpdatePath } from '../src/digest/dates'
import { renderDigestRss } from '../src/digest/rss'
import { digestSite } from '../src/digest/siteMeta'
import DigestIndexPage from '../src/pages/DigestIndexPage'
import DigestIssuePage from '../src/pages/DigestIssuePage'
import { renderHead, type PageSeo } from '../src/seo'

export function renderDigest(dist: string, contentRoot: string, siteOrigin: string) {
  const updatesDir = path.join(contentRoot, 'digest', 'updates')
  const updates = loadDigestUpdates(updatesDir)

  function writeDigestPage(out: string, seo: PageSeo, body: JSX.Element) {
    const inner = renderToStaticMarkup(
      createElement(Shell, { active: 'digest', children: body }),
    )
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  ${renderHead(seo)}
</head>
<body>
  ${inner}
</body>
</html>
`
    const file = path.join(dist, out)
    mkdirSync(path.dirname(file), { recursive: true })
    writeFileSync(file, html, 'utf8')
    console.log('wrote', out)
  }

  const indexSeo: PageSeo = {
    title: `Digest | efortune.tech`,
    description: digestSite.description,
    canonicalPath: '/digest/',
  }
  writeDigestPage('digest/index.html', indexSeo, <DigestIndexPage updates={updates} />)

  updates.forEach((update, index) => {
    const newer = index > 0 ? updates[index - 1] : undefined
    const older = updates[index + 1]
    const canonical = digestUpdatePath(update.data.date)
    const seo: PageSeo = {
      title: `${update.data.title} | Digest`,
      description: update.data.summary,
      canonicalPath: canonical,
    }
    const out = `digest/updates/${update.data.date}/index.html`
    writeDigestPage(
      out,
      seo,
      <DigestIssuePage update={update} newer={newer} older={older} />,
    )
  })

  const rss = renderDigestRss(updates, siteOrigin)
  writeFileSync(path.join(dist, 'digest/rss.xml'), rss, 'utf8')
  console.log('wrote digest/rss.xml')

  return { updates, siteOrigin }
}
