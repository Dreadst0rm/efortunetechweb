import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import Shell from '../src/layout/Shell'
import type { NavPage } from '../src/components/Nav'
import ContactPage from '../src/pages/ContactPage'
import HomePage from '../src/pages/HomePage'
import LegacyArticlePage from '../src/pages/LegacyArticlePage'
import NotFoundPage from '../src/pages/NotFoundPage'
import ThanksPage from '../src/pages/ThanksPage'
import { caseStudies, services } from '../src/content'
import { pages, renderHead, type PageSeo } from '../src/seo'
import { renderDigest } from './render-digest'
import { digestUpdatePath } from '../src/digest/dates'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const dist = path.join(root, 'dist')

type Route = {
  out: string
  active: NavPage
  body: JSX.Element
  seo: PageSeo
}

function route(
  out: string,
  active: NavPage,
  body: JSX.Element,
): Route {
  const seo = pages[out]
  if (!seo) throw new Error(`Missing SEO config for ${out}`)
  return { out, active, body, seo }
}

const routes: Route[] = [
  route('index.html', 'home', <HomePage />),
  route('contact.html', 'contact', <ContactPage />),
  route('thanks.html', 'contact', <ThanksPage />),
  route('404.html', 'home', <NotFoundPage />),
  route(
    'services.html',
    'services',
    <LegacyArticlePage
      title="Technical Consulting Services"
      lead="Strategic guidance and hands-on architecture expertise across the technology landscape."
    >
      {services.map((s) => (
        <section key={s.title}>
          <h2>{s.title}</h2>
          <p>{s.blurb}</p>
        </section>
      ))}
      <p>
        <a href="/contact.html">Get in touch</a> to discuss your priorities.
      </p>
    </LegacyArticlePage>,
  ),
  route(
    'case-studies.html',
    'case-studies',
    <LegacyArticlePage
      title="Case Studies"
      lead="Selected engagements where clear architecture direction improved cost, speed, or reliability."
    >
      {caseStudies.map((c) => (
        <section key={c.title}>
          <h2>{c.tag}</h2>
          <h3>{c.title}</h3>
          <p>{c.blurb}</p>
        </section>
      ))}
    </LegacyArticlePage>,
  ),
  route(
    'about.html',
    'about',
    <LegacyArticlePage
      title="About Ed Fortune"
      lead="Turning technology strategy into measurable business outcomes."
    >
      <h2>What I Do for Customers</h2>
      <p>
        I help organizations convert technology strategy into disciplined, executable results.
        Over 20 years I have developed and delivered technology strategy across enterprise
        environments—guiding architecture decisions, modernizing infrastructure, and aligning
        technical choices with business value.
      </p>
      <p>
        Clients engage me when they need clear direction on cloud and infrastructure
        modernization, identity and access architecture, resilient data center and network
        designs, legacy system transitions, and pragmatic guidance on secure AI adoption.
      </p>
      <p>Based in the Chicago area, I work with leadership and engineering teams nationwide.</p>
    </LegacyArticlePage>,
  ),
  route(
    'insights.html',
    'insights',
    <LegacyArticlePage title="Insights" lead="Notes on architecture, cloud, and delivery.">
      <h2>Latest</h2>
      <p>
        <a href="/insights/cloud-architecture-trends.html">Cloud architecture trends for 2026</a>
      </p>
    </LegacyArticlePage>,
  ),
  route(
    'insights/cloud-architecture-trends.html',
    'insights',
    <LegacyArticlePage
      title="Cloud Architecture Trends for 2026 and Beyond"
      lead="Platform engineering, FinOps, and resilient multi-cloud patterns worth watching."
    >
      <p>
        Teams are investing in internal platforms, tightening cost visibility, and designing for
        failover across regions—not just availability zones. The best results come from small,
        measurable pilots rather than multi-year slide decks.
      </p>
      <p>
        <a href="/insights.html">Back to insights</a>
      </p>
    </LegacyArticlePage>,
  ),
  route(
    'security/index.html',
    'home',
    <LegacyArticlePage
      title="Security"
      lead="How we handle vulnerability reports for efortune.tech."
    >
      <p>
        Report security issues to{' '}
        <a href="mailto:hello@efortune.tech">hello@efortune.tech</a>. We respond as quickly as
        possible and coordinate disclosure with reporters.
      </p>
      <p>
        <a href="/security/acknowledgments.html">Security acknowledgments</a>
      </p>
    </LegacyArticlePage>,
  ),
  route(
    'security/acknowledgments.html',
    'home',
    <LegacyArticlePage title="Security acknowledgments" lead="Thank you to responsible reporters.">
      <p>No public acknowledgments yet. This page will list researchers who helped improve our security.</p>
      <p>
        <a href="/security/index.html">Security policy</a>
      </p>
    </LegacyArticlePage>,
  ),
]

function writePage({ out, active, body, seo }: Route) {
  const inner = renderToStaticMarkup(createElement(Shell, { active, children: body }))
  const scripts = (seo.scripts ?? [])
    .map((src) => `<script src="${src}"></script>`)
    .join('\n  ')
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  ${renderHead(seo)}
</head>
<body>
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

for (const r of routes) writePage(r)

const siteOrigin = process.env.SITE_ORIGIN ?? 'https://efortune.tech'
const contentRoot = path.join(root, 'site', 'content')
const { updates: digestUpdates } = renderDigest(dist, contentRoot, siteOrigin)

const sitemapUrls: string[] = []
for (const [file, seo] of Object.entries(pages)) {
  if (file === '404.html' || file === 'thanks.html') continue
  const loc = `${siteOrigin}${seo.canonicalPath === '/' ? '/' : seo.canonicalPath}`
  sitemapUrls.push(`  <url><loc>${loc}</loc><changefreq>monthly</changefreq></url>`)
}
sitemapUrls.push(
  `  <url><loc>${siteOrigin}/digest/</loc><changefreq>daily</changefreq></url>`,
)
for (const issue of digestUpdates) {
  sitemapUrls.push(
    `  <url><loc>${siteOrigin}${digestUpdatePath(issue.data.date)}</loc><changefreq>never</changefreq></url>`,
  )
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.join('\n')}
</urlset>
`
writeFileSync(path.join(dist, 'sitemap.xml'), sitemap, 'utf8')
console.log('wrote sitemap.xml')
