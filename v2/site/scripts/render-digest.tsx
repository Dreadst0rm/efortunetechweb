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
import { buildDigestIndexEntry } from '../src/digest/digestFilter'

export function renderDigest(dist: string, contentRoot: string, siteOrigin: string) {
  const updatesDir = path.join(contentRoot, 'digest', 'updates')
  const updates = loadDigestUpdates(updatesDir)

  const vtRules = updates
    .map((u) => {
      const name = `d${u.data.date.replaceAll('-', '')}`
      return `.bp-digest__card[data-vt-date="${u.data.date}"], .bp-digest__vt-header[data-vt-date="${u.data.date}"] { view-transition-name: ${name}; }`
    })
    .join('\n')
  const vtCssPath = path.join(dist, 'assets', 'digest-vt.css')
  mkdirSync(path.dirname(vtCssPath), { recursive: true })
  writeFileSync(vtCssPath, vtRules, 'utf8')

  function writeDigestPage(out: string, seo: PageSeo, body: JSX.Element) {
    const inner = renderToStaticMarkup(
      createElement(Shell, { active: 'digest', children: body }),
    )
    const scripts = [
      ...(seo.scripts ?? []).map((src) => `<script src="${src}"></script>`),
      ...(seo.moduleScripts ?? []).map(
        (src) => `<script type="module" src="${src}"></script>`,
      ),
    ].join('\n  ')
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  ${renderHead(seo)}
</head>
<body class="bp-vt-root">
  ${inner}
  ${scripts}
</body>
</html>
`
    const file = path.join(dist, out)
    mkdirSync(path.dirname(file), { recursive: true })
    writeFileSync(file, html, 'utf8')
    console.log('wrote', out)
  }

  const indexEntries = updates.map((u) =>
    buildDigestIndexEntry({
      date: u.data.date,
      title: u.data.title,
      summary: u.data.summary,
      sectionText: u.data.sections
        .map((s) => `${s.heading}\n${s.bullets.join('\n')}`)
        .join('\n'),
    }),
  )
  const digestDir = path.join(dist, 'digest')
  mkdirSync(digestDir, { recursive: true })
  writeFileSync(
    path.join(digestDir, 'index.json'),
    JSON.stringify(indexEntries, null, 2),
    'utf8',
  )
  console.log('wrote digest/index.json')

  const indexSeo: PageSeo = {
    title: `Digest | efortune.tech`,
    description: digestSite.description,
    canonicalPath: '/digest/',
    extraHead: '<link rel="stylesheet" href="/assets/digest-vt.css">',
    moduleScripts: ['/assets/islands/digest.js'],
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
      extraHead: '<link rel="stylesheet" href="/assets/digest-vt.css">',
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
