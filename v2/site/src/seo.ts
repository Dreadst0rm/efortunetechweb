export type PageSeo = {
  title: string
  description: string
  canonicalPath: string
  ogImage?: string
  robots?: string
  extraHead?: string
  scripts?: string[]
  moduleScripts?: string[]
}

import { buildWebAnalyticsHead } from './analytics'
import { BG_HEAD } from './siteBuild'

const origin = 'https://efortune.tech'
const defaultImage = `${origin}/icons.svg`
const cfAnalyticsToken = process.env.CF_WEB_ANALYTICS_TOKEN
const webAnalyticsHead = buildWebAnalyticsHead(cfAnalyticsToken)

export const THEME_HEAD = `
  <script src="/js/theme-init.js"></script>
  <script src="/js/theme-toggle.js" defer></script>
`.trim()

export const TURNSTILE_HEAD = `
  <base href="/">
  <link rel="preconnect" href="https://challenges.cloudflare.com">
  <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
`.trim()

export const pages: Record<string, PageSeo> = {
  'index.html': {
    title: 'efortune.tech | Expert Cloud, AI & Software Architecture',
    moduleScripts: ['/assets/islands/hero.js'],
    description:
      'Chicago-based technical consulting firm specializing in cloud architecture, software engineering, AI strategy, and digital transformation.',
    canonicalPath: '/',
    ogImage: defaultImage,
  },
  'contact.html': {
    title: 'Contact efortune.tech | Chicago',
    description:
      'Contact efortune.tech for cloud architecture, software design, AI strategy, and digital transformation consulting.',
    canonicalPath: '/contact.html',
    extraHead: TURNSTILE_HEAD,
    scripts: ['/js/contact.js'],
    moduleScripts: ['/assets/islands/quick-check.js'],
  },
  'case-studies.html': {
    title: 'Case Studies | efortune.tech',
    description: 'Selected architecture and strategy engagements from efortune.tech.',
    canonicalPath: '/case-studies.html',
    moduleScripts: ['/assets/islands/case-studies.js'],
  },
  'thanks.html': {
    title: 'Message sent | efortune.tech',
    description: 'Thanks for contacting efortune.tech. We typically respond within one business day.',
    canonicalPath: '/thanks.html',
    robots: 'noindex, follow',
  },
  '404.html': {
    title: 'Page not found | efortune.tech',
    description: 'The page you requested was not found on efortune.tech.',
    canonicalPath: '/404.html',
    robots: 'noindex, follow',
  },
  'services.html': {
    title: 'Technical Consulting Services | efortune.tech',
    description:
      'Cloud architecture, software design, AI strategy, cybersecurity, and digital transformation consulting.',
    canonicalPath: '/services.html',
  },
  'about.html': {
    title: 'About efortune.tech | Chicago Technology Experts',
    description:
      'Ed Fortune helps organizations turn technology strategy into executable outcomes.',
    canonicalPath: '/about.html',
  },
  'insights.html': {
    title: 'Insights | efortune.tech',
    description: 'Architecture and strategy notes from efortune.tech.',
    canonicalPath: '/insights.html',
  },
  'insights/cloud-architecture-trends.html': {
    title: 'Cloud Architecture Trends | efortune.tech',
    description: 'Practical notes on evolving cloud architecture patterns.',
    canonicalPath: '/insights/cloud-architecture-trends.html',
  },
  'security/index.html': {
    title: 'Security | efortune.tech',
    description: 'Security practices and disclosures for efortune.tech.',
    canonicalPath: '/security/index.html',
  },
  'security/acknowledgments.html': {
    title: 'Security acknowledgments | efortune.tech',
    description: 'Thanks to researchers who reported security issues responsibly.',
    canonicalPath: '/security/acknowledgments.html',
  },
}

export function renderHead(seo: PageSeo): string {
  const canonical = `${origin}${seo.canonicalPath === '/' ? '/' : seo.canonicalPath}`
  const ogImage = seo.ogImage ?? defaultImage
  const robots = seo.robots ?? 'index, follow'

  return `
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(seo.title)}</title>
  <meta name="description" content="${escapeHtml(seo.description)}">
  <meta name="robots" content="${escapeHtml(robots)}">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <meta property="og:title" content="${escapeHtml(seo.title)}">
  <meta property="og:description" content="${escapeHtml(seo.description)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${escapeHtml(canonical)}">
  <meta property="og:image" content="${escapeHtml(ogImage)}">
  <meta property="og:locale" content="en_US">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(seo.title)}">
  <meta name="twitter:description" content="${escapeHtml(seo.description)}">
  <meta name="twitter:image" content="${escapeHtml(ogImage)}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  ${THEME_HEAD}
  ${BG_HEAD}
  <link rel="stylesheet" href="/assets/site.css">
  ${webAnalyticsHead}
  ${seo.extraHead ?? ''}
  `.trim()
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
}
