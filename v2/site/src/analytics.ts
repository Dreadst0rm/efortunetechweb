/**
 * Manual Cloudflare Web Analytics (CSP-safe: external beacon only, no inline loader).
 * Set CF_WEB_ANALYTICS_TOKEN at build time; disable automatic JS injection in the
 * Cloudflare dashboard (Analytics → Web Analytics → manage site → turn off automatic injection).
 */
export function buildWebAnalyticsHead(token: string | undefined): string {
  const t = token?.trim()
  if (!t) return ''
  const beacon = JSON.stringify({ token: t, spa: false })
  return `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='${beacon}'></script>`
}
