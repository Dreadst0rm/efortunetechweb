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
import { SITE_PREFS_HEAD } from './siteBuild'

const origin = 'https://efortune.tech'
const defaultImage = `${origin}/assets/og-card.jpg`
const cfAnalyticsToken = process.env.CF_WEB_ANALYTICS_TOKEN
const webAnalyticsHead = buildWebAnalyticsHead(cfAnalyticsToken)

export const TURNSTILE_HEAD = `
  <base href="/">
  <link rel="preconnect" href="https://challenges.cloudflare.com">
  <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
`.trim()

export const pages: Record<string, PageSeo> = {
  'index.html': {
    title: 'Fractional CIO & vCIO | efortune.tech',
    moduleScripts: ['/assets/islands/hero.js'],
    description:
      'Fractional CIO and vCIO for companies of 50 to 2,000 employees—hands-on expertise that is hard to hire: stability, security, scalability, and resiliency.',
    canonicalPath: '/',
    ogImage: defaultImage,
  },
  'contact.html': {
    title: 'Contact Ed Fortune | Fractional CIO',
    description:
      'Book a conversation about fractional CIO, vCIO, or project work. Free Keystone domain check included.',
    canonicalPath: '/contact.html',
    extraHead: TURNSTILE_HEAD,
    scripts: ['/js/contact.js'],
    moduleScripts: ['/assets/islands/quick-check.js'],
  },
  'case-studies.html': {
    title: 'Case studies | efortune.tech',
    description:
      'Before Efortune: development, infrastructure, operations, and security outcomes described by company type.',
    canonicalPath: '/case-studies.html',
  },
  'thanks.html': {
    title: 'Message sent | efortune.tech',
    description: 'Thanks for reaching out. I typically respond within one business day.',
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
    title: 'Services | Fractional CIO & vCIO',
    description:
      'Development, infrastructure, operations, and security leadership—with proof points and pricing summary.',
    canonicalPath: '/services.html',
  },
  'pricing.html': {
    title: 'Pricing | Fractional CIO & vCIO',
    description:
      'Hourly, advisory, fractional, vCIO, project, and interim CIO options from $150/hour through $20,000+/month.',
    canonicalPath: '/pricing.html',
  },
  'hands-on/index.html': {
    title: 'Expertise that’s hard to hire | efortune.tech',
    description:
      'Hands-on stability, security, scalability, and resiliency—AI practice, cloud moves, zero trust, security roadmaps, and fixed-price technical projects.',
    canonicalPath: '/hands-on',
    ogImage: defaultImage,
  },
  'resilience-and-recovery/index.html': {
    title: 'Resilience & disaster recovery projects | efortune.tech',
    description:
      'Ride the storm when your cloud provider does not—multi-cloud backups, tested restores, and runbooks from $15,000–$20,000.',
    canonicalPath: '/resilience-and-recovery',
    ogImage: defaultImage,
  },
  'performance-and-scale/index.html': {
    title: 'Performance & scale — load-test-and-fix | efortune.tech',
    description:
      'Measure, fix, and prove faster response times before growth breaks what you have. Fixed projects from $12,000–$25,000.',
    canonicalPath: '/performance-and-scale',
    ogImage: defaultImage,
  },
  'security-hardening/index.html': {
    title: 'Cyber protection & 3–5 year security roadmap | efortune.tech',
    description:
      'Near-term hardening plus a 3–5 year protection plan—help closing gaps and preparing evidence for cyber insurance applications without promising coverage.',
    canonicalPath: '/security-hardening',
    ogImage: defaultImage,
  },
  'ai-practice/index.html': {
    title: 'AI as a practice | efortune.tech',
    description:
      'Stand up AI as an ongoing capability: use cases, guardrails, governance, data safety, and measuring payoff—not one-off tools.',
    canonicalPath: '/ai-practice',
    ogImage: defaultImage,
  },
  'cloud-migration/index.html': {
    title: 'Cloud migration & consolidation | efortune.tech',
    description:
      'Plan and lead cloud moves with cost control, failover, and runbooks your team can operate.',
    canonicalPath: '/cloud-migration',
    ogImage: defaultImage,
  },
  'zero-trust/index.html': {
    title: 'Zero trust access (replace the VPN) | efortune.tech',
    description:
      'Identity-based access to apps—fewer open doors, better remote work, vendor-neutral design.',
    canonicalPath: '/zero-trust',
    ogImage: defaultImage,
  },
  'monitoring/index.html': {
    title: 'Monitoring & Keystone | efortune.tech',
    description:
      'Know email and domain problems before customers do—Keystone monitoring plus the same hands-on ladder for deeper fixes.',
    canonicalPath: '/monitoring',
    ogImage: defaultImage,
  },
  'quarterly-initiative/index.html': {
    title: 'The $9,500 Quarterly Initiative | Efortune LLC',
    description:
      'Any one hands-on lineup project for $9,500: assessment, roadmap, verified delivery, executive readout, runbooks, 30-day support, and industry peer evaluation ($3,800 value included). No long-term contract.',
    canonicalPath: '/quarterly-initiative',
    ogImage: defaultImage,
  },
  'about.html': {
    title: 'About Ed Fortune | Fractional CIO',
    description:
      '20+ years leading technology across development, infrastructure, operations, and security. Keystone builder.',
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
  <link rel="icon" href="/favicon.ico" sizes="48x48">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  ${SITE_PREFS_HEAD}
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
