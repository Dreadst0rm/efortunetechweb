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
import CaseStudiesPage from '../src/pages/CaseStudiesPage'
import ServicesPage from '../src/pages/ServicesPage'
import PricingPage from '../src/pages/PricingPage'
import AboutPage from '../src/pages/AboutPage'
import { pages, renderHead, type PageSeo } from '../src/seo'
import { htmlRootAttrs } from '../src/siteBuild'
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
  route('services.html', 'services', <ServicesPage />),
  route('pricing.html', 'pricing', <PricingPage />),
  route('case-studies.html', 'case-studies', <CaseStudiesPage />),
  route('about.html', 'about', <AboutPage />),
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
      lead="How I handle vulnerability reports for efortune.tech."
    >
      <p>
        Report security issues to{' '}
        <a href="mailto:hello@efortune.tech">hello@efortune.tech</a>. I respond as quickly as
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
  const scripts = [
    ...(seo.scripts ?? []).map((src) => `<script src="${src}"></script>`),
    ...(seo.moduleScripts ?? []).map(
      (src) => `<script type="module" src="${src}"></script>`,
    ),
  ].join('\n  ')
  const html = `<!DOCTYPE html>
<html ${htmlRootAttrs()}>
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
